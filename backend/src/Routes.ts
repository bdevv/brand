import { DataController } from "./controller/DataController";
import { UploadController } from "./controller/UploadController";
import { UserController } from "./controller/UserController";

export const Routes = [
  {
    method: "get",
    route: "/api/users",
    controller: UserController,
    action: "all",
  },
  {
    method: "get",
    route: "/api/users/:email",
    controller: UserController,
    action: "one",
  },
  {
    method: "post",
    route: "/api/users/signup",
    controller: UserController,
    action: "save",
  },
  {
    method: "delete",
    route: "/api/users/:email",
    controller: UserController,
    action: "remove",
  },
  {
    method: "post",
    route: "/api/getDataFromAPI",
    controller: DataController,
    action: "getDataFromAPI",
  },
  {
    method: "post",
    route: "/api/getYoutubeData",
    controller: DataController,
    action: "getYoutubeData",
  },
  {
    method: "post",
    route: "/api/getYoutubeSummary",
    controller: DataController,
    action: "getYoutubeSummary",
  },
  {
    method: "post",
    route: "/api/getSummaryAll",
    controller: DataController,
    action: "getSummaryAll",
  },
  {
    method: "post",
    route: "/api/uploadImage",
    controller: UploadController,
    action: "uploadImage",
  },
  {
    method: "post",
    route: "/api/getTrademarks",
    controller: UploadController,
    action: "all",
  },
  {
    method: "post",
    route: "/api/deleteTrade",
    controller: UploadController,
    action: "deleteOne",
  },
  {
    method: "post",
    route: "/api/deleteVideo",
    controller: DataController,
    action: "deleteVideo",
  },
];
