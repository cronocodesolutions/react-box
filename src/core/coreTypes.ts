export type ArrayType<T> = T extends (infer U)[] ? U : T;

export type BoxStylesType<T> = T extends ReadonlyArray<infer U> ? T[number] : T;

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

export type ExtractBoxPseudoClassesStyles1<T extends Record<string, number>, TT> = {
  [K in keyof T]?: TT;
};

export type ExtractBoxPseudoClassesStyles2<T extends Record<string, number>, TT> = {
  [K in keyof T]?: boolean | [boolean, TT];
};

export type ExtractBoxPseudoGroupClassesStyles<T extends Record<string, string>, TT> = {
  [K in keyof T]?: string | Record<string, TT>;
};

export type ExtractBoxBreakpointsStyles<T extends Record<string, number>, TT> = {
  [K in keyof T]?: TT;
};
