export type valueOf<T> = T[keyof T];
export type Await<T> = T extends PromiseLike<infer K> ? K : never;
