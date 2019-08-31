import ky from "ky";
import {urls} from "../interface/networks/watermelon/interfaces/network";
import {valueOf} from "./typescript";

export const post = (url: valueOf<typeof urls>, json?: object) => {
  return ky.post(url, {
    json
  }).json();
};
