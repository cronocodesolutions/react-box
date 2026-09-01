import { BoxStyleValue } from './coreTypes';

/**
 * What the `content` prop takes. `::before` and `::after` generate no box at all until `content` says so,
 * which makes this the prop the pseudo-elements are built on — and the only prop whose value is *text*.
 * Text has to be quoted before it becomes rule text, and a value that closes the declaration block it
 * lands in is exactly what quoting prevents: everything here is validated, never passed through.
 */
namespace Content {
  /** The keywords, none of which are text. `empty` is this library's name for `''`, the commonest of all. */
  export const keywords = ['empty', 'none', 'normal', 'open-quote', 'close-quote', 'no-open-quote', 'no-close-quote'] as const;

  export type Keyword = (typeof keywords)[number];

  /**
   * A value the caller wrote as CSS rather than as text: a quoted string, one of the functions, or a
   * sequence of both — `content='"Step " counter(step)'` is the canonical use of the property and no
   * amount of quoting on our side can express it. Open-ended template types, so the keywords above keep
   * their autocomplete beside it.
   */
  export type CssValue =
    | `"${string}`
    | `'${string}`
    | `attr(${string}`
    | `counter(${string}`
    | `counters(${string}`
    | `url(${string}`
    | `var(${string}`
    | `image-set(${string}`
    | `linear-gradient(${string}`;

  export const cssValue = '' as CssValue;

  /** Text: anything else. Intersected with an empty object so the unions above still reach autocomplete. */
  export const text = '' as string & NonNullable<unknown>;

  const functionStart = /^(attr|counter|counters|url|var|image-set|linear-gradient)\(/;

  /** Whether this is CSS the caller wrote — and therefore whether it is safe to write out unquoted. */
  export function isCssValue(value: BoxStyleValue): boolean {
    if (typeof value !== 'string') return false;

    const trimmed = value.trim();
    const written = trimmed.startsWith('"') || trimmed.startsWith("'") || functionStart.test(trimmed);

    return written && isSafe(trimmed);
  }

  // Outside a string, none of these belongs in a value: `}` closes the rule somebody else opened, `;`
  // ends the declaration, `@` starts an at-rule and a backslash escapes whatever comes next.
  const unsafeOutsideString = new Set([';', '{', '}', '@', '\\']);

  /**
   * One pass, tracking whether we are inside a string, because the two questions have opposite answers
   * there: `(` inside `"…"` is a character, outside it opens a function that has to close again.
   */
  function isSafe(value: string): boolean {
    let quote: string | null = null;
    let parentheses = 0;

    for (let index = 0; index < value.length; index++) {
      const char = value[index];

      if (quote) {
        // An escape covers the next character, the closing quote included.
        if (char === '\\') index++;
        else if (char === quote) quote = null;
        else if (char === '\n') return false;
      } else if (char === '"' || char === "'") {
        quote = char;
      } else if (char === '(') {
        parentheses++;
      } else if (char === ')') {
        if (--parentheses < 0) return false;
      } else if (unsafeOutsideString.has(char)) {
        return false;
      }
    }

    return quote === null && parentheses === 0;
  }

  /**
   * Text as a CSS string. The quote and the backslash are escaped, and a newline becomes `\A ` — the
   * trailing space is part of the escape, since CSS reads hex digits until one.
   */
  export function quote(value: BoxStyleValue): string {
    const escaped = String(value)
      .replace(/[\\"]/g, (char) => `\\${char}`)
      .replace(/\r?\n/g, '\\A ');

    return `"${escaped}"`;
  }

  /** A keyword as its declaration. Only `empty` differs from what was written — it is the one that needed a name. */
  export function keyword(value: BoxStyleValue): string {
    return value === 'empty' ? "''" : String(value);
  }
}

export default Content;
