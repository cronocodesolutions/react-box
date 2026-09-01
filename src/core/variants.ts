import ObjectUtils from '../utils/object/objectUtils';
import { pseudoClasses } from './boxStyles';

/**
 * The nesting keys that hang off the element's *own* selector: an attribute it carries
 * (`dataAttr={{ 'state=open': … }}`), something it contains (`has`), or a state it is not in (`not`).
 * Everything else — a breakpoint, a theme, a group — still nests around them.
 *
 * A key the grammar does not accept produces no rule and no class name, the same way an unmatched prop
 * value does: a typo is invisible rather than a selector that closes the rule it sits in.
 */
namespace Variants {
  /** The four keys, each mapped to the selector prefix it builds. The engine dispatches on this record. */
  export const variantKeys = {
    /** Styles for a `data-*` attribute on this element: `{ 'state=open': … }` → `[data-state="open"]`, `{ loading: … }` → `[data-loading]`. */
    dataAttr: 'data-',
    /** Styles for an `aria-*` attribute on this element. A bare key means `="true"`: `{ selected: … }` → `[aria-selected="true"]`. */
    ariaAttr: 'aria-',
    /** Styles for what this element contains: `{ ':checked': … }` → `:has(:checked)`. */
    has: ':has',
    /** Styles for a state this element is *not* in, keyed by pseudo-class name: `{ hover: … }` → `:not(:hover)`. */
    not: ':not',
  };

  export type VariantKey = keyof typeof variantKeys;

  /**
   * What `not` takes: every pseudo-class key except `theme`, which is an ancestor class rather than a
   * selector on this element. The pseudo-*elements* are their own record, so they cannot be named here —
   * `:not(::before)` is not a selector.
   */
  export type NotKey = Exclude<keyof typeof pseudoClasses, 'theme'>;

  /** One compiled variant: what it adds to the class name, and what it adds to the selector. */
  export interface Variant {
    /** The class-name segment. The record key as written, so two keys can never collapse into one class. */
    name: string;
    /** The selector fragment appended to the element's own compound selector. */
    selector: string;
  }

  // An attribute name after `data-`/`aria-`: what HTML allows and a selector can hold unquoted.
  const attributeName = /^[a-zA-Z][\w-]*$/;
  // An attribute value, which lands inside double quotes — so the quote itself, and anything that could
  // end the declaration block, is out.
  const attributeValue = /^[\w .:/@%-]*$/;
  // What may appear inside `:has()`. Deliberately narrow: no braces, no semicolon, no at-rule, no comment.
  const hasSelector = /^[\w\s.#:,>+~*()[\]="'|^$-]+$/;

  function isBalanced(selector: string): boolean {
    let parentheses = 0;
    let brackets = 0;

    for (const char of selector) {
      if (char === '(') parentheses++;
      else if (char === ')') parentheses--;
      else if (char === '[') brackets++;
      else if (char === ']') brackets--;
      if (parentheses < 0 || brackets < 0) return false;
    }

    return parentheses === 0 && brackets === 0;
  }

  /** `name` or `name=value`, as an attribute selector. `defaultValue` is what a bare name means (`aria-*` says `true`). */
  function attributeSelector(prefix: string, key: string, defaultValue?: string): string | null {
    const separator = key.indexOf('=');
    const name = separator === -1 ? key : key.slice(0, separator);
    const value = separator === -1 ? defaultValue : key.slice(separator + 1);

    if (!attributeName.test(name)) return null;
    if (value === undefined) return `[${prefix}${name}]`;

    return attributeValue.test(value) ? `[${prefix}${name}="${value}"]` : null;
  }

  function notPseudoSelector(key: string): string | null {
    if (!ObjectUtils.isKeyOf(key, pseudoClasses)) return null;

    const selector = pseudoClasses[key];
    // `theme` is the empty string — an ancestor class, not a state of this element.
    if (!selector) return null;

    return `:not(${selector})`;
  }

  /** One nested variant compiled, or null when its key is not something this variant accepts. */
  export function variant(key: VariantKey, name: string): Variant | null {
    const trimmed = name.trim();
    if (!trimmed) return null;

    const selector = selectorOf(key, trimmed);
    // The variant key is part of the class-name segment: `dataAttr={{ selected }}` and
    // `ariaAttr={{ selected }}` are different selectors and must never collapse into one class.
    return selector === null ? null : { name: `${key}-${trimmed}`, selector };
  }

  function selectorOf(key: VariantKey, name: string): string | null {
    switch (key) {
      case 'dataAttr':
        return attributeSelector('data-', name);
      case 'ariaAttr':
        return attributeSelector('aria-', name, 'true');
      case 'has':
        return hasSelector.test(name) && isBalanced(name) ? `:has(${name})` : null;
      case 'not':
        return notPseudoSelector(name);
    }
  }

  /**
   * One more variant on the way down, kept sorted by name so `dataAttr` before `not` and `not` before
   * `dataAttr` resolve to the same class — the two selectors match the same elements either way.
   */
  export function add(variants: readonly Variant[], next: Variant): Variant[] {
    return [...variants, next].sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
  }
}

export default Variants;
