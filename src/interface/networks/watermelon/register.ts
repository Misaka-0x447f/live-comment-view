export const register = {
  poolSize: 10000,
  price: 4,         // CNY/100
  interval: {
    room: 10,
    comment: 2,
    refresh: 10,
  },
  filterChat: [
    /^\d*$/,
    /挂/,
    /太菜了/,
    /不会玩/,
  ],
  filterUserName: [
    [/用户\d{8,16}/, "用户"],
  ] as Array<[RegExp, string]>,
};
