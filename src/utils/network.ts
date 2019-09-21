import ky from "ky";
import {urls} from "../interface/networks/watermelon/interfaces/network";
import {valueOf} from "./typescript";
import {defaultTo} from "lodash-es";

const CORSProxy = "http://localhost:24112/";

export const post = <T extends valueOf<typeof urls>>(url: T, opts: {
  args?: Parameters<T>;
  json?: object;
}): any => {
  // @ts-ignore
  return ky.post(CORSProxy + url(...defaultTo(opts.args, [])), {
    json: opts.json,
  }).json();
};

export const get = <T extends valueOf<typeof urls>>(url: T, opts: {
  args?: Parameters<T>;
}): any => {
  // @ts-ignore
  return ky.get(CORSProxy + url(...defaultTo(opts.args, []))).json();
};
