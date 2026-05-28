export type ExtractTupleValues<T> = T extends readonly unknown[]
  ? {
      -readonly [K in keyof T]: T[K] extends ReadonlyArray<infer U> ? U : never;
    }
  : never;

export type BoxStylesType<T> = T extends ReadonlyArray<unknown> ? T[number] : T;

export type ExtractElementType<T> =
  T extends React.DetailedHTMLProps<React.HTMLAttributes<infer E>, infer E> ? E : T extends React.SVGProps<infer E> ? E : never;

export type ExtractElementFromTag<T extends keyof React.JSX.IntrinsicElements> = ExtractElementType<React.JSX.IntrinsicElements[T]>;

interface BoxStyleArrayString {
  values: ReadonlyArray<string>;
  valueFormat?: (value: string, getVariableValue: (name: string) => string, styleName?: string) => string;
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

interface BoxStyleTupleArrays {
  tuple: true;
  values: readonly ReadonlyArray<string | number | boolean>[];
  valueFormat?: (value: readonly (string | number | boolean)[], getVariableValue: (name: string) => string, styleName?: string) => string;
}

type BoxStyleScalar = (BoxStyleArrayString | BoxStyleArrayBoolean | BoxStyleArrayNumber | BoxStyleNumber | BoxStyleString) & {
  tuple?: never;
};

export type BoxStyle = (BoxStyleScalar | BoxStyleTupleArrays) & {
  styleName?: string | string[];
  selector?: (className: string, pseudoClass: string) => string;
};

export type ExtractKeys<T extends Record<string, unknown>, TT> = {
  [K in keyof T]?: TT;
};
