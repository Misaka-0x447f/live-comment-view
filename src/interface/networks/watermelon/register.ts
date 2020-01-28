export const register = {
  poolSize: 10000,
  price: 4,         // CNY/100
  interval: {
    room: 10,
    comment: 1,
    refresh: 10,
  },
  filterChat: [
    /^\d*$/,
    /太菜了/,
  ],
  replaceChat: [
    [/(.{12}).+/, (_, p1) => p1],
  ] as Array<Parameters<string["replace"]>>,
  replaceUsername: [
    [/^(\W{2,})\d{4,}/, (_, p1) => p1],
  ] as Array<Parameters<string["replace"]>>,
};
