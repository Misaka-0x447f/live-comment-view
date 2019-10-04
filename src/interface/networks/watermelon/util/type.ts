export const apis = {
  present: "VideoLivePresentMessage",
  presentEnd: "VideoLivePresentEndTipMessage",
  ad: "VideoLiveRoomAdMessage",
  chat: "VideoLiveChatMessage",
  useExtra: "VideoLiveMemberMessage",
  subscribe: "VideoLiveSocialMessage",
  favourite: "VideoLiveJoinDiscipulusMessage",
  leave: "VideoLiveControlMessage",
  ad2: "VideoLiveDiggMessage",
  danmaku: "VideoLiveDanmakuMessage",
  ad3: "VideoLiveNoticeMessage",
} as const;

export const extraApis = {
  inbound: "Inbound",
  banned: "Banned",
  unbanned: "Unbanned",
  elevated: "Elevated",
  subscribed: "Subscribed",
} as const;

export type ChatMethods = typeof apis[keyof typeof apis] | typeof extraApis[keyof typeof extraApis];
