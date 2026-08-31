export type ExtractTupleValues<T> = T extends readonly unknown[]
  ? {
      -readonly [K in keyof T]: T[K] extends ReadonlyArray<infer U> ? U : never;
    }
  : never;

export type BoxStylesType<T> = T extends ReadonlyArray<unknown> ? T[number] : T;

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
  /**
   * Which values this definition accepts, when its `values` cannot say.
   *
   * A scalar definition (`values: ''`, `values: 0`) is matched by `typeof` alone, so it accepts
   * *every* string or *every* number — fine for a scale, wrong for a shape. `match` replaces that
   * test: declare it and the definition takes exactly the values it says yes to, so a value the
   * prop does not really support produces no rule and no class name rather than a broken
   * declaration. `fill: 'url(#sky)'` is the first caller (`Variables.isReference`).
   */
  match?: (value: string | number | boolean | readonly (string | number | boolean)[]) => boolean;
};

export type ExtractKeys<T extends Record<string, unknown>, TT> = {
  [K in keyof T]?: TT;
};
