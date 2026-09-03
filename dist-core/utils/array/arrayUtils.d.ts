export type SortDirection = 'ASC' | 'DESC';
export interface GroupItem<TKey, T> {
    key: TKey;
    values: T[];
}
declare namespace ArrayUtils {
    function take<T>(items: readonly T[], count: number, skip?: number): T[];
    function sumBy<T>(items: readonly T[], fn: (value: T, index: number) => number, initialValue?: number): number;
    function sortBy<T, TVal>(items: readonly T[], fn: (value: T) => TVal, direction?: SortDirection): T[];
    function maxBy<T>(items: readonly T[], fn: (value: T) => number): number;
    function findOrThrow<T>(items: readonly T[], predicate: (value: T) => boolean): T;
    function toRecord<T, K extends string | number | symbol, V>(items: readonly T[], fn: (value: T) => [K, V] | undefined): Record<K, V>;
    function groupBy<T, TKey extends string | number | symbol>(items: readonly T[], keySelector: (item: T, index: number) => TKey): GroupItem<TKey, T>[];
}
export default ArrayUtils;
