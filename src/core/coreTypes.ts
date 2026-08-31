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

/**
 * A definition whose value is a record of names to values — the shape a custom property needs,
 * since the *names* it declares come out of the value and no definition can know them in advance.
 * It has no `styleName`, so it writes its own `declarations`. `vars` is the only one.
 */
interface BoxStyleRecord {
  values: Readonly<Record<string, string | number>>;
  tuple?: never;
  valueFormat?: never;
}

/** Every shape a prop value can take, and so everything `match` and `declarations` are handed. */
export type BoxStyleValue = string | number | boolean | readonly (string | number | boolean)[] | Readonly<Record<string, string | number>>;

export type BoxStyle = (BoxStyleScalar | BoxStyleTupleArrays | BoxStyleRecord) & {
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
  match?: (value: BoxStyleValue) => boolean;
  /**
   * The whole rule body this definition writes, as text — for a definition whose `styleName` cannot
   * name what it declares.
   *
   * One prop, several declarations, and the property names coming out of the *value*:
   * `vars={{ 'color-x': 'sky-500' }}` has to emit `--color-x:var(--sky-500)`, and `--color-x` is a
   * name the registry never sees. A definition that declares this ignores `styleName` and
   * `valueFormat`; everything else about it — the class name, the media query, the theme and group
   * selectors, the cascade layer — is the same as for any other prop.
   */
  declarations?: (value: BoxStyleValue, getVariableValue: (name: string) => string) => string;
};

export type ExtractKeys<T extends Record<string, unknown>, TT> = {
  [K in keyof T]?: TT;
};
