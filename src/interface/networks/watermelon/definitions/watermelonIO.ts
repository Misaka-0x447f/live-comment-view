import {User} from "./user";

export interface WatermelonIO {
  status: {
    isLive: boolean
    isValidRoom: boolean
    name: string
    room: {
      id: number
      title: string
      streamer?: User
      activeUserCount: number
    }
  };
  raw: {
    room: object
    cursor: "0"
    updRoomCount: number
    lottery: boolean
  };
}
