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
 * A definition whose value is a record — the shape a custom property needs, since the names it declares
 * come out of the value. It has no `styleName`, so it writes its own `declarations`. `vars` is the only one.
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
   * Which values this definition accepts, when its `values` cannot say. A scalar `values` is matched by
   * `typeof` alone, so it takes *every* string — fine for a scale, wrong for a shape. Declare this and an
   * unsupported value produces no rule and no class name (`Variables.isReference` was the first caller).
   */
  match?: (value: BoxStyleValue) => boolean;
  /**
   * The `@keyframes` names this value refers to, for a prop whose value names a sequence (`animation`,
   * `animationName`). The engine emits the ones it has registered and leaves the rest alone — keyframes
   * are written only when something asks for them.
   */
  keyframes?: (value: BoxStyleValue) => string[];
  /**
   * The whole rule body this definition writes, for a prop whose property names come out of its *value*:
   * `vars={{ 'color-x': 'sky-500' }}` has to emit `--color-x:var(--sky-500)`, a name the registry never
   * sees. It replaces `styleName`/`valueFormat`; everything else about the prop is unchanged.
   */
  declarations?: (value: BoxStyleValue, getVariableValue: (name: string) => string) => string;
};

export type ExtractKeys<T extends Record<string, unknown>, TT> = {
  [K in keyof T]?: TT;
};
