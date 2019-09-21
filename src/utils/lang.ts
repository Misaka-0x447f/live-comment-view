/**
 * alternative to native switch statement
 */
import {isNull} from "lodash-es";

export const selectCase = <T>(opt: { exp: T, def?: () => any, case: Array<[T] | [T, () => any]> }) => {
  for (const v of opt.case) {
    if (opt.exp === v[0]) {
      if (v[1]) {
        return v[1]();
      }
    }
  }
  if (opt.def) {
    return opt.def();
  }
  return;
};

type anyFunc = (...args: any[]) => any;

export const nop: anyFunc = () => undefined;
export const bypass: anyFunc = (...args) => args.length === 1 ? args[0] : args;

export const recursivelyRun = async (method: (...args: any[]) => Promise<any>, interval: number) => {
  await method();
  setTimeout(async () => {
    await method();
    await recursivelyRun(method, interval);
  }, interval);
};

export const sleep = async (time: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
};

/**
 * index starts at one.
 */
export const regexMatch = (str: string, regexp: RegExp, index: number = 1) => {
  const r = str.match(regexp);
  if (isNull(r)) { return null; }
  return r[index];
};
