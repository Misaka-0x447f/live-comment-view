/**
 * alternative to native switch statement
 */
export const selectCase = <T>(opt: { exp: T, def?: () => void, case: Array<[T] | [T, () => void]> }) => {
  const r = opt.case.every((v) => {
    if (opt.exp === v[0]) {
      if (v[1]) {
        v[1]();
      }
    }
    return opt.exp === v[0];
  });
  if (!r && opt.def) {
    opt.def();
  }
};

export const nop: (...args: any[]) => any = () => undefined;
export const bypass: (...args: any[]) => any = (...args) => args.length === 1 ? args[0] : args;
