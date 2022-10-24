type Hovered<T> = {
  [K in keyof T as K extends string ? `${K}h` : never]: T[K];
};

type Maybe<T> = T | undefined;
