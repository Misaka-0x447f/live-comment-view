import ky from "ky";
import {urls} from "../interface/networks/watermelon/interfaces/network";
import {valueOf} from "./typescript";

const CORSProxy = "http://localhost:24112/";

export const post = (url: valueOf<typeof urls>, json?: object): any => {
  // @ts-ignore
  return ky.post(CORSProxy + url, {
    json,
  }).json();
};
