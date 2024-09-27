import { AppDataSource } from "../DataSource";
import { NextFunction, Request, Response } from "express";
import { Data } from "../entity/Data";
import { History } from "../entity/History";
const KEYWORDS = [
  "cheat",
  "hack",
  "mod",
  "mod apk",
  "hack mod apk",
  "gem hack",
  "Unlimited gems",
  "unlimited hack",
];
export class DataController {
  private dataRepository = AppDataSource.getRepository(Data);
  private historyRepository = AppDataSource.getRepository(History);

  async getDataFromAPI() {
    const results = await this.dataRepository.find();
    return { status: "success", data: results };
  }
  async getYoutubeData(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const { sorting, offset, limit, filter } = request.body;
    const queryBuilder = this.historyRepository.createQueryBuilder("history");

    // Apply offset and limit
    queryBuilder.skip(offset).take(limit);

    // Apply sorting
    if (sorting === "ascending") {
      queryBuilder.orderBy("history.num_views", "ASC");
    } else if (sorting === "descending") {
      queryBuilder.orderBy("history.num_views", "DESC");
    }

    // Apply filtering
    if (filter != "" && filter != "ALL") {
      queryBuilder.where("history.Status = :filter", { filter });
    }

    // Execute the query
    const [results, total] = await queryBuilder.getManyAndCount();

    const newDataArray = results.map((item: any) => {
      const keys = item.title
        .split(" ")
        .map((key: string) => key.toLowerCase());
      const foundKeywords = keys.filter((key: string) =>
        KEYWORDS.includes(key)
      );
      return {
        url: item.url,
        status: item.status,
        views: item.num_views,
        title: item.title,
        cr:
          foundKeywords.length > 0
            ? Math.floor(Math.random() * 10 + 90)
            : Math.floor(Math.random() * 20 + 20),
      };
    });

    return { status: "success", data: newDataArray, total: total };
  }
  async getYoutubeSummary() {
    const results = await this.historyRepository.find();
    let infringements = 0;
    const dataArray = results?.map((item: any) => {
      const keys = item.title
        .split(" ")
        .map((key: string) => key.toLowerCase());
      const foundKeywords = keys.filter((key: string) =>
        KEYWORDS.includes(key)
      );
      if (foundKeywords.length > 0) infringements++;
      return {
        url: item.url,
        status: item.status,
        views: parseFloat(item.num_views),
        title: item.title,
        cr:
          foundKeywords.length > 0
            ? Math.floor(Math.random() * 10 + 90)
            : Math.floor(Math.random() * 20 + 20),
      };
    });
    let summaryArray = [
      { title: "TCI Copyright Infringements", value: "" },
      { title: "Percentage Removed", value: "" },
      { title: "Total Views Removed", value: "" },
    ];
    let percentage =
      (dataArray.filter((item: any) => item.status == "REMOVED").length /
        dataArray.length) *
      100;
    if (!isNaN(percentage)) {
      summaryArray[0].value = dataArray
        .filter((item: any) => item.cr >= 90)
        .length.toString();
      summaryArray[1].value =
        (percentage % 1 === 0 ? percentage : percentage.toFixed(2)) + "%";
      summaryArray[2].value = formatNumber(
        sumViews(dataArray.filter((item: any) => item.status == "REMOVED"))
      ).toString();
    }

    return { status: "success", data: summaryArray };
  }
  async getSummaryAll() {
    const youtube = (await this.getYoutubeSummary()).data;
    return { status: "success", data: youtube };
  }
  async all(request: Request, response: Response, next: NextFunction) {
    const { email } = request.body;
  }
  async deleteVideo(request: Request, response: Response, next: NextFunction) {
    const { url } = request.body;
    const historyRow = await this.historyRepository.findOne({ where: { url } });
    if (!historyRow) {
      return "not exist";
    }
    await this.historyRepository.remove(historyRow);
    return "success";
  }
}
export const formatNumber = (number: number) => {
  if (number >= 1000000) {
    return (number / 1000000) % 1 === 0
      ? number / 1000000 + "M"
      : (number / 1000000).toFixed(1) + "M";
  } else if (number >= 1000) {
    return (number / 1000) % 1 === 0
      ? number / 1000 + "K"
      : (number / 1000).toFixed(1) + "K";
  } else {
    return number.toString();
  }
};
// Function to sum the views
export const sumViews = (
  dataArray: Array<{
    url: string;
    title: string;
    views: number;
    cr: number;
    status: string;
  }>
) => {
  let totalViews = 0;
  for (let i = 0; i < dataArray.length; i++) {
    totalViews += dataArray[i].views;
  }
  return totalViews;
};
