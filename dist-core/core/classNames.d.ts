export type ClassNameType<T extends string = string> = T extends never ? undefined : undefined | T | T[] | Record<T, boolean> | ClassNameType<T>[];
export declare function classNames(...classNameRules: ClassNameType[]): string[];
