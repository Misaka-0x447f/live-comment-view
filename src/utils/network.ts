import ky from "ky";
import {urls} from "../interface/networks/watermelon/interfaces/network";
import {valueOf} from "./typescript";

const CORSProxy = "http://localhost:24112/";

export const post = <T extends valueOf<typeof urls>>(url: T, opts: {
  args?: Parameters<T>;
  json?: object;
}): any => {
  // @ts-ignore
  return ky.post(CORSProxy + url(...opts.args), {
    json: opts.json,
  }).json();
};
