export const register = {
  poolSize: 10000,
  price: 4,         // CNY/100
  interval: {
    room: 10,
    comment: 2,
    refresh: 10,
  },
  filter: [
    /^\d*$/,
    /挂/,
  ],
};
