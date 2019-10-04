import {fetchRoom, get} from "../../../../utils/network";

export const urls = {
  room: () =>
    `https://i.snssdk.com/videolive/room/enter?version_code=730&device_platform=android`,
  liveComment: (roomId, offset) => `https://i.snssdk.com/videolive/im/get_msg?cursor=${offset}&room_id=${roomId}`,
  locateRoom: (keyword) => "https://security.snssdk.com/video/app/search/live/" +
    "?version_code=730&device_platform=android" +
    `&format=json&keyword=${keyword}`,
  giftList: (roomId) => `https://i.snssdk.com/videolive/gift/get_gift_list?room_id=${roomId}` +
    `&version_code=730&device_platform=android`,
} as const;

export const fetchRoomInfo = (roomId: string) =>
  fetchRoom(urls.room, {roomId});

export const fetchLiveComment = (roomId: string, opts: { offset: number }) =>
  get(urls.liveComment, {args: [roomId, opts.offset]});

export const fetchLocateRoom = (keyword: string) =>
  get(urls.locateRoom, {args: [keyword]});

export const fetchGiftList = (roomId: string) =>
  get(urls.giftList, {args: [roomId]});
