import { Properties } from 'csstype';
/**
 * The grammar behind `css`, the escape hatch: a style object for the properties this library has no prop
 * for, compiled into a class through the same pipeline rather than into an inline style. What is judged
 * here is the *shape* — a name that is a property name, a value that cannot end the declaration early —
 * never whether the browser knows the property: an unknown one is dropped by the browser, the right place.
 */
declare namespace Css {
    /**
     * The `css` prop's value: every property csstype knows, camel-cased the way React spells them, plus a
     * custom property (`vars` is the prop for those, but the runtime takes one, so the type does too). `0` is
     * the one number a length takes — `width: 100` is a type error, because a number is written out as it
     * stands and `width:100` is not CSS — while `zIndex`, `opacity`, `flexGrow` and `lineHeight` take theirs.
     */
    type Declarations = Readonly<Properties<string | 0> & {
        [name: `--${string}`]: string | number;
    }>;
    /**
     * A camelCase name as CSS: `backgroundColor` → `background-color`, and a vendor prefix by React's rule — a
     * leading capital is `-webkit-`/`-moz-`, `ms` the one lower-case prefix (`msOverflowStyle`). A hyphenated
     * or custom-property name is CSS already and passes through.
     */
    function toPropertyName(name: string): string;
    /**
     * Whether a value is a usable style object: an object with at least one entry worth writing. Judged entry
     * by entry, the way `vars` is — one unusable declaration costs that declaration, not the other five.
     */
    function isDeclarations(value: unknown): value is Declarations;
    /**
     * The style object as the body of a rule: `mix-blend-mode:multiply;-webkit-line-clamp:2`. A colour token
     * resolves to the variable behind it, so `outlineColor: 'sky-500'` stays themed; anything else is written
     * out as it stands, a number included — the value grammar is `vars`', so there is one rule to learn.
     */
    function declarations(value: Declarations, getVariableValue: (name: string) => string): string;
}
export default Css;
