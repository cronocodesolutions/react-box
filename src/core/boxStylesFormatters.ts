import { DEFAULT_REM_DIVIDER } from './boxConstants';

/**
 * Value formatters shared by the prop definitions in `boxStyles.ts`. A `valueFormat` is called as
 * `valueFormat(value, getVariableValue, styleName)`, so every formatter here takes the prop value
 * first. Formatters that took `(key, value)` were unreachable dead code and have been removed —
 * see `boxStylesFormatters.test.ts` for the behaviour each one guarantees.
 */
export namespace BoxStylesFormatters {
  export namespace Value {
    /** Spacing scale: divides by 4, so `p={4}` is `1rem`. */
    export function rem(value: number) {
      return `${value / DEFAULT_REM_DIVIDER}rem`;
    }
    /** Direct pixels: `b={1}` is `1px`. */
    export function px(value: number) {
      return `${value}px`;
    }
    /** Fraction token: `'1/2'` becomes `'50%'`. */
    export function fraction(value: string) {
      const [a, b] = value.split('/');
      return `${(+a / +b) * 100}%`;
    }
  }
}
