import {post} from "../../../../utils/network";

export const urls = {
  room: "https://i.snssdk.com/videolive/room/enter?version_code=730&device_platform=android",
  liveComment: (roomId, offset) => `https://i.snssdk.com/videolive/im/get_msg?cursor=${offset}&room_id=${roomId}`
} as const;

export const fetchRoomInfo = (roomId: number) =>
  post(urls.room, {
    room_id: roomId,
    version_code: 730,
    device_platform: "android"
  });

export const fetchLiveComment = (roomId: number, opts: {offset: number}) =>
  // @ts-ignore
  post(urls.liveComment(opts.offset, roomId));
