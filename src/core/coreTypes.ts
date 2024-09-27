export type ArrayType<T> = T extends (infer U)[] ? U : T;

export type BoxStylesType<T> = T extends ReadonlyArray<infer U> ? T[number] : T;

export type ExtractElementType<T> =
  T extends React.DetailedHTMLProps<React.HTMLAttributes<infer E>, infer E> ? E : T extends React.SVGProps<infer E> ? E : never;

export type ExtractElementFromTag<T extends keyof React.JSX.IntrinsicElements> = ExtractElementType<React.JSX.IntrinsicElements[T]>;

interface BoxStyleArrayString {
  values: ReadonlyArray<string>;
  valueFormat?: (value: string) => string;
}

interface BoxStyleArrayBoolean {
  values: ReadonlyArray<boolean>;
  valueFormat?: (value: boolean) => string;
}

interface BoxStyleArrayNumber {
  values: ReadonlyArray<number>;
  valueFormat?: (value: number) => string;
}

interface BoxStyleNumber {
  values: number;
  valueFormat?: (value: number) => string;
}

interface BoxStyleString {
  values: string;
  valueFormat?: (value: string) => string;
}

export type BoxStyle = (BoxStyleArrayString | BoxStyleArrayBoolean | BoxStyleArrayNumber | BoxStyleNumber | BoxStyleString) & {
  styleName?: string;
};

export type ExtractKeys<T extends Record<string, unknown>, TT> = {
  [K in keyof T]?: TT;
};
