import ky from "ky";
import {urls} from "../interface/networks/watermelon/interfaces/network";
import {valueOf} from "./typescript";
import {defaultTo} from "lodash-es";

const CORSProxy = "http://localhost:24112/";

export const fetchRoom = <T extends valueOf<typeof urls>>(url: T, opts: {
  roomId: number;
}): any => {
  // @ts-ignore
  return ky.post(CORSProxy + url(opts.roomId), {
    body: `room_id=${opts.roomId}&version_code=730&device_platform=android`,
    // body: `{"room_id": ${opts.roomId}, "version_code": 730, "device_platform": "android"}`,
    // json: {
    //   room_id: opts.roomId,
    //   version_code: 730,
    //   device_platform: "android",
    // },
    headers: {"content-type": "application/x-www-form-urlencoded"},
  }).json();
};

export const get = <T extends valueOf<typeof urls>>(url: T, opts: {
  args?: Parameters<T>;
}): any => {
  // @ts-ignore
  return ky.get(CORSProxy + url(...defaultTo(opts.args, []))).json();
};
