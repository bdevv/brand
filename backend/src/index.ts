const dotenv = require("dotenv");
dotenv.config();
import * as express from "express";
import * as bodyParser from "body-parser";
import { Request, Response } from "express";
import { AppDataSource } from "./DataSource";
import { Routes } from "./Routes";
import jobs from "./Cron";
const path = require("path");

var cors = require("cors");
AppDataSource.initialize()
  .then(async () => {
    // create express app
    const app = express();
    app.use(bodyParser.json({ limit: "50mb" }));
    app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

    app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
    app.use(cors());
    // register express routes from defined application routes
    Routes.forEach((route) => {
      (app as any)[route.method](
        route.route,
        (req: Request, res: Response, next: Function) => {
          const result = new (route.controller as any)()[route.action](
            req,
            res,
            next
          );
          if (result instanceof Promise) {
            result.then((result) =>
              result !== null && result !== undefined
                ? res.send(result)
                : undefined
            );
          } else if (result !== null && result !== undefined) {
            res.json(result);
          }
        }
      );
    });
    jobs.startBot(); //call once
    setTimeout(() => {
      jobs.startVerify();
    }, 60000); //call once
    jobs.startBotJob.start();
    jobs.startVerifyURLJob.start();
    app.listen(3001);
    console.log(
      "Express server has started on port 3001. Open http://localhost:3001/users to see results"
    );
  })
  .catch((error) => console.log(error));
