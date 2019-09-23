export const getParams = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const store: {[key in string]: string} = {};
  // @ts-ignore
  for (const [i, v] of urlParams) {
    Reflect.set(store, i, v);
  }
  return store;
};
