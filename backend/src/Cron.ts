import { CronJob } from "cron";
import axios from "axios";
import {
  BROWSE_AI_TOKEN,
  ORIGIN_URL,
  ROBOT_ID,
  ROBOT1_ID,
  ROBOT2_ID,
} from "./config/config";
import { Data } from "./entity/Data";
import { AppDataSource } from "./DataSource";
import { History } from "./entity/History";
const { google } = require("googleapis");
// Your API key
// const apiKey = "AIzaSyCTDPX4tBOAtROQ7B5dLMtzVxVcSc5O7fw";
const apiKey = "";
// Create a YouTube Data API client
const youtube = google.youtube({
  version: "v3",
  auth: apiKey,
});

const dataRepository = AppDataSource.getRepository(Data);
const historyRepository = AppDataSource.getRepository(History);
function extractVideoId(url) {
  const regularMatch = url.match(/(?:\?|&)v=([^&#]+)/);
  const shortsMatch = url.match(/\/(?:shorts|embed)\/([^?&]+)/);

  if (regularMatch) {
    return regularMatch[1];
  } else if (shortsMatch) {
    return shortsMatch[1];
  } else {
    return null;
  }
}
async function isVideoLive(videoUrl) {
  try {
    // Extract video ID from URL
    const videoId = extractVideoId(videoUrl);
    if (!videoId) {
      console.error("Invalid video URL");
      return false;
    }

    const response = await youtube.videos.list({
      part: "snippet",
      id: videoId,
    });

    // Check if the video is live
    if (response.data.items.length > 0) {
      return true;
    } else {
      console.error("Video not found");
      return false;
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
}
const startVerify = async () => {
  try {
    console.log("Start checking video status");
    const historyRows = await historyRepository.find();
    for (var i = 0; i < historyRows.length; i++) {
      console.log("🚀 ~ startVerify ~ i:", i);
      const histroyRow = historyRows[i];
      const isLive = await isVideoLive(histroyRow.url);
      if (isLive) {
        histroyRow.status = "ONLINE";
      } else histroyRow.status = "REMOVED";
      await historyRepository.save(histroyRow);
    }
  } catch (e) {
    console.log("🚀 ~ startBotJob ~ e:", e);
  }
};
const startVerifyURLJob = new CronJob("0 0 9 * * *", async () => {
  startVerify();
});
const startBotJob = new CronJob("0 0 0 * * *", async () => {
  startBot();
});

const startBot = async () => {
  try {
    console.log("Start Bot JOb Running");
    const results = await axios.post(
      `https://api.browse.ai/v2/robots/${ROBOT_ID}/tasks`,
      {
        inputParameters: {
          originUrl: ORIGIN_URL,
        },
      },
      { headers: { Authorization: BROWSE_AI_TOKEN } }
    );

    const result = results.data.result;
    if (results.status == 200) {
      const taskId = result.id;
      // Schedule fetchData to run after 1 minute
      setTimeout(() => {
        fetchData(ROBOT_ID, taskId);
      }, 60000 * 5); // 1 minute = 60,000 milliseconds
    } else {
    }

    console.log("Start Bot1 JOb Running");
    const results1 = await axios.post(
      `https://api.browse.ai/v2/robots/${ROBOT1_ID}/tasks`,
      {
        inputParameters: {
          originUrl: ORIGIN_URL,
        },
      },
      { headers: { Authorization: BROWSE_AI_TOKEN } }
    );

    const result1 = results1.data.result;
    if (results1.status == 200) {
      const taskId = result1.id;
      // Schedule fetchData to run after 1 minute
      setTimeout(() => {
        fetchData(ROBOT1_ID, taskId);
      }, 60000 * 5); // 1 minute = 60,000 milliseconds
    } else {
    }

    console.log("Start Bot2 JOb Running");
    const results2 = await axios.post(
      `https://api.browse.ai/v2/robots/${ROBOT2_ID}/tasks`,
      {
        inputParameters: {
          originUrl: ORIGIN_URL,
        },
      },
      { headers: { Authorization: BROWSE_AI_TOKEN } }
    );

    const result2 = results2.data.result;
    if (results2.status == 200) {
      const taskId = result2.id;
      // Schedule fetchData to run after 1 minute
      setTimeout(() => {
        fetchData(ROBOT2_ID, taskId);
      }, 60000); // 1 minute = 60,000 milliseconds
    } else {
    }
  } catch (e) {
    console.log("🚀 ~ startBotJob ~ e:", e);
  }
};
const fetchData = async (robotId: string, taskId: string) => {
  console.log("FETCHING DATA = " + robotId);
  const results = await axios.get(
    `https://api.browse.ai/v2/robots/${robotId}/tasks/${taskId}`,
    { headers: { Authorization: BROWSE_AI_TOKEN } }
  );
  if (results.status == 200) {
    const result = results.data.result;
    if (!result.finishedAt) {
      setTimeout(() => {
        fetchData(robotId, taskId);
      }, 60000); // 1 minute = 60,000 milliseconds
    } else {
      await dataRepository.clear();
      const videos = result.capturedLists.Videos;
      if (videos) {
        for (var i = 0; i < videos.length; i++) {
          var item = videos[i];
          // const dataRow = Object.assign(new Data(), {
          //   url: item.Link ?? "",
          //   title: item.Title ?? "",
          //   views: item.Views ?? "",
          //   status: item._STATUS == "REMOVED" ? "REMOVED" : "ONLINE",
          //   taskId: taskId,
          // });
          const historyRow = await historyRepository.findOne({
            where: { url: item.Link },
          });
          if (historyRow) {
            if (item._STATUS != "REMOVED") {
              const views = item.Views;
              console.log("🚀 ~ fetchData ~ views:", views);
              let numViews = 0;
              if (views == null) numViews = 0;
              else {
                if (views.includes("K")) {
                  const viewNumber = parseFloat(views.replace("K", "")) * 1000;
                  numViews = isNaN(viewNumber) ? 0 : viewNumber;
                } else if (views.includes("M")) {
                  const viewNumber =
                    parseFloat(views.replace("M", "")) * 1000000;
                  numViews = isNaN(viewNumber) ? 0 : viewNumber;
                } else {
                  const viewNumber = parseFloat(views);
                  numViews = isNaN(viewNumber) ? 0 : viewNumber;
                }
              }
              historyRow.views = item.Views;
              historyRow.num_views = numViews;
              console.log("🚀 ~ fetchData ~ num_views:", numViews);
            }
            historyRow.status =
              item._STATUS == "REMOVED" ? "REMOVED" : "ONLINE";
            await historyRepository.save(historyRow);
          } else {
            const views = item.Views;
            console.log("🚀 ~ fetchData ~ views:", views);
            let numViews = 0;
            if (views == null) numViews = 0;
            else {
              if (views.includes("K")) {
                const viewNumber = parseFloat(views.replace("K", "")) * 1000;
                numViews = isNaN(viewNumber) ? 0 : viewNumber;
              } else if (views.includes("M")) {
                const viewNumber = parseFloat(views.replace("M", "")) * 1000000;
                numViews = isNaN(viewNumber) ? 0 : viewNumber;
              } else {
                const viewNumber = parseFloat(views);
                numViews = isNaN(viewNumber) ? 0 : viewNumber;
              }
            }
            console.log("🚀 ~ fetchData ~ numViews:", numViews);

            const newHistoryRow = Object.assign(new History(), {
              url: item.Link,
              title: item.Title,
              views: item.Views,
              num_views: numViews,
              status: item._STATUS == "REMOVED" ? item._STATUS : "ONLINE",
            });
            await historyRepository.save(newHistoryRow);
          }
          // dataRepository.save(dataRow);
        }
      }
    }
  }
};
export default { startBotJob, startBot, startVerifyURLJob, startVerify };
