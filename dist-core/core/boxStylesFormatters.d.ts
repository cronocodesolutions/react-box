/**
 * Value formatters shared by the prop definitions in `boxStyles.ts`. A `valueFormat` is called as
 * `valueFormat(value, getVariableValue, styleName)`, so every formatter here takes the prop value
 * first. Formatters that took `(key, value)` were unreachable dead code and have been removed —
 * see `boxStylesFormatters.test.ts` for the behaviour each one guarantees.
 */
export declare namespace BoxStylesFormatters {
    namespace Value {
        /** Spacing scale: divides by 4, so `p={4}` is `1rem`. */
        function rem(value: number): string;
        /** Direct pixels: `b={1}` is `1px`. */
        function px(value: number): string;
        /** Direct milliseconds: `animationDuration={1100}` is `1100ms`. */
        function ms(value: number): string;
        /** Fraction token: `'1/2'` becomes `'50%'`. */
        function fraction(value: string): string;
    }
}
