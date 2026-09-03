import { pseudoClasses } from './boxStyles';
/**
 * The nesting keys that hang off the element's *own* selector: an attribute it carries
 * (`dataAttr={{ 'state=open': … }}`), something it contains (`has`), a state it is not in (`not`), or
 * where it sits among its siblings (`nth`). Everything else — a breakpoint, a theme, a group — still
 * nests around them.
 *
 * A key the grammar does not accept produces no rule and no class name, the same way an unmatched prop
 * value does: a typo is invisible rather than a selector that closes the rule it sits in.
 */
declare namespace Variants {
    /** The five keys, each mapped to the selector prefix it builds. The engine dispatches on this record. */
    export const variantKeys: {
        /** Styles for a `data-*` attribute on this element: `{ 'state=open': … }` → `[data-state="open"]`, `{ loading: … }` → `[data-loading]`. */
        dataAttr: string;
        /** Styles for an `aria-*` attribute on this element. A bare key means `="true"`: `{ selected: … }` → `[aria-selected="true"]`. */
        ariaAttr: string;
        /** Styles for what this element contains: `{ ':checked': … }` → `:has(:checked)`. */
        has: string;
        /** Styles for a state this element is *not* in: `{ hover: … }` → `:not(:hover)`, `{ 'data-loading': … }` → `:not([data-loading])`. */
        not: string;
        /** Styles for this element's position among its siblings: `{ first: … }` → `:first-child`, `{ '2n+1': … }` → `:nth-child(2n+1)`. */
        nth: string;
    };
    export type VariantKey = keyof typeof variantKeys;
    /**
     * One state, as the vocabulary `not`, `group` and `peer` all share: a pseudo-class this library names,
     * or an attribute the element carries. The pseudo-*elements* are their own record, so they cannot be
     * named here — `:not(::before)` is not a selector.
     */
    export type StateKey = keyof typeof pseudoClasses | `data-${string}` | `aria-${string}`;
    /** An `An+B` microsyntax, written compactly: a class name holds it, so `2n + 1` is not offered. */
    type NthFormula = 'odd' | 'even' | 'n' | `${number}` | `${number}n` | `${number}n+${number}` | `${number}n-${number}` | `n+${number}` | `-n+${number}`;
    /** What `nth` takes: a position keyword, a formula, or either counted from the end (`'last 2'`). */
    export type NthKey = 'first' | 'last' | 'only' | NthFormula | `last ${NthFormula}`;
    /** One compiled variant: what it adds to the class name, and what it adds to the selector. */
    export interface Variant {
        /** The class-name segment. The record key as written, so two keys can never collapse into one class. */
        name: string;
        /** The selector fragment appended to the element's own compound selector. */
        selector: string;
    }
    /**
     * One state as a selector fragment, for the element itself (`not`) or for an ancestor (`group`/`peer`):
     * a pseudo-class this library names, or a `data-`/`aria-` attribute. The prefix is what tells the two
     * apart — a bare key is a pseudo-class, so a `data-*` state has to say so.
     */
    export function stateSelector(state: string): string | null;
    /** One nested variant compiled, or null when its key is not something this variant accepts. */
    export function variant(key: VariantKey, name: string): Variant | null;
    /**
     * One more variant on the way down, kept sorted by name so `dataAttr` before `not` and `not` before
     * `dataAttr` resolve to the same class — the two selectors match the same elements either way.
     */
    export function add(variants: readonly Variant[], next: Variant): Variant[];
    export {};
}
export default Variants;
