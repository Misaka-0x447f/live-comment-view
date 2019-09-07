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

export const nop: (...args: any[]) => any = () => undefined;
export const bypass: (...args: any[]) => any = (...args) => args.length === 1 ? args[0] : args;
