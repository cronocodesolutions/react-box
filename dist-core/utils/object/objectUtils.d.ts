/**
 * Object helpers that know nothing about the prop registry — which is what lets both packages import
 * this file. `mergeDeep` used to live here and does not any more: it reads `pseudo2`, so it belongs in
 * `src/core/mergeDeep.ts` (see the note there).
 */
declare namespace ObjectUtils {
    function buildProps<T extends {
        props?: object;
    }, TKey extends keyof T>(props: T, keys: Readonly<TKey[]>, extraTagProps?: object): T;
    function isObject(value: unknown): value is object;
    function isKeyOf<T extends object>(key: any, obj: T): key is keyof T;
}
export default ObjectUtils;
