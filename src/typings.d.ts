type Hovered<T> = {
  [K in keyof T as K extends string ? `${K}H` : never]: T[K];
};

type Focused<T> = {
  [K in keyof T as K extends string ? `${K}F` : never]: T[K];
};

type Activated<T> = {
  [K in keyof T as K extends string ? `${K}A` : never]: T[K];
};

type ExtractElementType<T> = T extends React.DetailedHTMLProps<React.HTMLAttributes<infer E>, infer E>
  ? E
  : T extends React.SVGProps<infer E>
  ? E
  : never;

type ExtractElementFromTag<T extends keyof React.IntrinsicElements> = ExtractElementType<JSX.IntrinsicElements[T]>;
