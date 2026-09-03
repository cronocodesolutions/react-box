import { BoxStyleValue } from './coreTypes';
/**
 * What the `content` prop takes. `::before` and `::after` generate no box at all until `content` says so,
 * which makes this the prop the pseudo-elements are built on — and the only prop whose value is *text*.
 * Text has to be quoted before it becomes rule text, and a value that closes the declaration block it
 * lands in is exactly what quoting prevents: everything here is validated, never passed through.
 */
declare namespace Content {
    /** The keywords, none of which are text. `empty` is this library's name for `''`, the commonest of all. */
    const keywords: readonly ["empty", "none", "normal", "open-quote", "close-quote", "no-open-quote", "no-close-quote"];
    type Keyword = (typeof keywords)[number];
    /**
     * A value the caller wrote as CSS rather than as text: a quoted string, one of the functions, or a
     * sequence of both — `content='"Step " counter(step)'` is the canonical use of the property and no
     * amount of quoting on our side can express it. Open-ended template types, so the keywords above keep
     * their autocomplete beside it.
     */
    type CssValue = `"${string}` | `'${string}` | `attr(${string}` | `counter(${string}` | `counters(${string}` | `url(${string}` | `var(${string}` | `image-set(${string}` | `linear-gradient(${string}`;
    const cssValue: CssValue;
    /** Text: anything else. Intersected with an empty object so the unions above still reach autocomplete. */
    const text: string & NonNullable<unknown>;
    /** Whether this is CSS the caller wrote — and therefore whether it is safe to write out unquoted. */
    function isCssValue(value: BoxStyleValue): boolean;
    /**
     * Text as a CSS string. The quote and the backslash are escaped, and a newline becomes `\A ` — the
     * trailing space is part of the escape, since CSS reads hex digits until one.
     */
    function quote(value: BoxStyleValue): string;
    /** A keyword as its declaration. Only `empty` differs from what was written — it is the one that needed a name. */
    function keyword(value: BoxStyleValue): string;
}
export default Content;
