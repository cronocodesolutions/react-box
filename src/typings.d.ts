type Hovered<T> = {
  [K in keyof T as K extends string ? `${K}H` : never]: T[K];
};

type Focused<T> = {
  [K in keyof T as K extends string ? `${K}F` : never]: T[K];
};

type Activated<T> = {
  [K in keyof T as K extends string ? `${K}A` : never]: T[K];
};
