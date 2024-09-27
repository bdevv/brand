import axios from "axios";
import { apiConfig } from "../config/Constants";
const API_URL = apiConfig.API_URL + "api/";
const signUp = async (username: string, email: string) => {
  return axios.post(API_URL + "users/signup", {
    username,
    email,
  });
};
const getUserInfo = async (email: string | null | undefined) => {
  return axios.get(API_URL + "users/" + email);
};

const getYoutubeData = async (
  sorting: string,
  offset: number,
  limit: number,
  filter: string
) => {
  return axios.post(API_URL + "getYoutubeData", {
    sorting,
    offset,
    limit,
    filter,
  });
};
const getYoutubeSummary = async () => {
  return axios.post(API_URL + "getYoutubeSummary", {});
};
const getSummaryAll = async () => {
  return axios.post(API_URL + "getSummaryAll", {});
};
const deleteTrade = async (id: number) => {
  return axios.post(API_URL + "deleteTrade", { id: id });
};
const deleteVideo = async (url: string) => {
  return axios.post(API_URL + "deleteVideo", { url });
};
const uploadImageToServer = async (
  base64Image: any,
  filename: string,
  title: string
) => {
  function _arrayBufferToBase64(buffer: ArrayBuffer) {
    var binary = "";
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }
  return axios.post(API_URL + "uploadImage", {
    base64Image: _arrayBufferToBase64(base64Image),
    filename,
    title,
  });
};
const getTrademarks = async () => {
  return axios.post(API_URL + "getTrademarks", {});
};
export default {
  signUp,
  getYoutubeData,
  getUserInfo,
  uploadImageToServer,
  getYoutubeSummary,
  getTrademarks,
  getSummaryAll,
  deleteTrade,
  deleteVideo,
};
