/**
 * alternative to native switch statement
 */
import {isArray, isNull, isUndefined} from "lodash-es";

export const selectCase =
  <T>(opt: { exp: T, def?: () => any, case: Array<[T] | [T, () => any] | [T[]] | [T[], () => any]> }) => {
    for (const v of opt.case) {
      const conditions = isArray(v[0]) ? v[0] : [v[0]];
      if (conditions.includes(opt.exp)) {
        if (v[1]) {
          return v[1]();
        } else {
          return;
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
  try {
    await method();
  } catch (e) {
    throw e;
  } finally {
    setTimeout(() => {
      recursivelyRun(method, interval).then();
    }, interval);
  }
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
  if (isNull(r)) {
    return null;
  }
  return r[index];
};

export const includeAll = (target: object, propertyKeys: PropertyKey[]) => {
  for (const v of propertyKeys) {
    if (!Reflect.has(target, v) || isUndefined(target[v])) {
      return false;
    }
  }
  return true;
};
