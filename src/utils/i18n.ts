import {bypass, nop} from "./lang";

export const i18n = {
  room: {
    streamer: "主播",
    operator: "房管",
  },
  comments: {
    present: (v) => `礼物大量发生中: ${v}`,
    presentEnd: (v) => `礼物发生完了: ${v}`,
    broadcast: nop, // ads
    chat: bypass,
    danmaku: bypass,
    inbound: (v) => `(进站) ${v}`,
    outbound: (v) => `(出站) ${v}`,
    subscribed: (v) => `(订阅) ${v}`,
    onboard: (v) => `(加入) ${v}`,
    message: bypass,
    like: (v) => `${v} +1 了你!`,
    leave: "zzzzzzzzz",
    lottery: (v) => `(中奖) ${v}`,
  },
};

export default i18n;
