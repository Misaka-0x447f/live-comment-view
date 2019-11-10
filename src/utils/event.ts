import {EventEmitter} from "events";
import {Watermelon} from "../interface/networks/watermelon/interfaces/watermelon";
import {Await} from "./typescript";

const em = new EventEmitter();

interface Ev {
  presentEnd: (gift: Await<ReturnType<Watermelon["toGift"]>>) => void;
}

export const ec = {
  emit: <T extends keyof Ev>(event: T, ...payload: Parameters<Ev[T]>) => em.emit(event, ...payload),
  on: <T extends keyof Ev>(event: T, callback: Ev[T]) => em.on(event, callback),
  off: <T extends keyof Ev>(event: T, callback: Ev[T]) => em.removeListener(event, callback),
  once: <T extends keyof Ev>(event: T, callback: Ev[T]) => em.once(event, callback),
};
