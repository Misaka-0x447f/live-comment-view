/**
 * alternative to native switch statement
 */
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

export const recursivelyRun = (method: (...args: any[]) => Promise<any>, interval: number) => {
  setTimeout(async () => {
    await method();
    recursivelyRun(method, interval);
  }, interval);
};
