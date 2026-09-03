import { default as Palette } from './palette';
declare namespace Variables {
    /**
     * Every colour, as the value its variable is declared with — the palette plus the keywords, with `none`
     * beside them in `colorValues`. The table itself lives in `palette.ts`, which also owns the one modifier
     * a colour value takes (`blue-500/40`); this is where a colour becomes a *variable*.
     */
    const colors: Record<Palette.ColorName, string>;
    type ColorType = Palette.ColorName | 'none';
    const colorValues: Variables.ColorType[];
    const bgImages: {
        'gradient-primary': string;
        'gradient-aurora-light': string;
        'gradient-aurora-dark': string;
        'gradient-accent': string;
        'bg-img-checked': string;
        'bg-img-indeterminate': string;
        'bg-img-radio': string;
    };
    type BgImageType = keyof typeof bgImages | 'none';
    const bgImageValues: Variables.BgImageType[];
    const shadows: {
        small: string;
        medium: string;
        large: string;
    };
    type ShadowType = keyof typeof shadows | 'none';
    const shadowValues: Variables.ShadowType[];
    const percentages: readonly ["1/1", "1/2", "1/3", "2/3", "1/4", "2/4", "3/4", "1/5", "2/5", "3/5", "4/5", "1/6", "2/6", "3/6", "4/6", "5/6", "1/12", "2/12", "3/12", "4/12", "5/12", "6/12", "7/12", "8/12", "9/12", "10/12", "11/12"];
    const negativePercentages: readonly ["-1/1", "-1/2", "-1/3", "-2/3", "-1/4", "-2/4", "-3/4", "-1/5", "-2/5", "-3/5", "-4/5", "-1/6", "-2/6", "-3/6", "-4/6", "-5/6", "-1/12", "-2/12", "-3/12", "-4/12", "-5/12", "-6/12", "-7/12", "-8/12", "-9/12", "-10/12", "-11/12"];
    type PercentString = `${number}%`;
    const percentString: PercentString;
    /**
     * Whether a value really is the percentage its definition claims to take. `percentString` is a plain
     * string, and a scalar `values` is matched by `typeof` alone — which made all thirty props declaring it
     * an unvalidated catch-all: `width="banana"` reached CSS verbatim (bug #31).
     */
    function isPercentString(value: unknown): value is PercentString;
    /** The two ratios worth a name — CSS has neither, and Tailwind's `aspect-video` is the same 16/9. */
    const aspectRatios: Readonly<Record<string, string>>;
    type Ratio = `${number}/${number}`;
    const ratio: Ratio;
    /** Whether a value really is a ratio: `4/3` and `1.85/1`, not `4:3` and not a fraction with a unit. */
    function isRatio(value: unknown): value is Ratio;
    /**
     * The CSS system colours: the one palette a forced-colors mode does not throw away. Keywords rather
     * than tokens — they resolve to whatever the user's high-contrast theme says — so they are written out
     * unformatted, which is what lets `forcedColors={{ … }}` restore a state that colour alone was signalling.
     */
    const systemColors: readonly ["Highlight", "HighlightText", "Canvas", "CanvasText", "ButtonFace", "ButtonText", "GrayText", "LinkText"];
    type SystemColorType = (typeof systemColors)[number];
    const systemColorValues: readonly SystemColorType[];
    /**
     * A value CSS resolves for itself rather than one of this library's tokens: `url(#sky)` for a gradient,
     * pattern or clip path, `var(--chart-1)` for somebody else's variable. SVG paint is the reason it exists
     * — written as an attribute the paint would leave the prop system, losing theme, breakpoint and `hover`.
     */
    type Reference = `url(#${string})` | `var(--${string})`;
    const reference: Reference;
    /**
     * Whether a value is one of those two forms, as the definition's `match`: `typeof` alone cannot tell
     * `url(#sky)` from a typo. Deliberately strict — one balanced reference, no whitespace (a class
     * attribute splits on it), no nesting, so `fill` cannot smuggle in a whole shorthand.
     */
    function isReference(value: unknown): value is Reference;
    /**
     * A value for a custom property: a colour token (resolved to the variable behind it), a `url()`/`var()`
     * reference, or any CSS value written out. `string` is intersected with an empty object so the token
     * union it follows still reaches autocomplete.
     */
    type CustomPropertyValue = ColorType | Palette.Alpha | Reference | number | (string & NonNullable<unknown>);
    /** The `vars` prop's value: custom-property names, with or without their leading `--`, to values. */
    type CustomProperties = Readonly<Record<string, CustomPropertyValue>>;
    /**
     * Whether a value can be written into a rule as it stands — the only thing between a prop value and the
     * text of a rule: a `;` or a brace would end the declaration early and let the rest be read as CSS. Shared
     * with `css`, the other prop whose values reach a rule unformatted.
     */
    function isUsableValue(entry: unknown): entry is string | number;
    /**
     * Whether a value is a usable set of declarations: an object with at least one entry worth writing.
     * Judged entry by entry because a record *is* many independent declarations — one unusable name (a
     * series called `user.name`) costs that variable rather than the other five.
     */
    function isCustomProperties(value: unknown): value is CustomProperties;
    /**
     * A value that names a colour, resolved: a token becomes the variable behind it and a token with an
     * opacity modifier the mix that applies it, so a chart's colour — or a gradient stop — follows the
     * palette either way. Anything else is written out as it stands: a system colour and a `var()`
     * reference are already CSS, and neither is ours to resolve.
     */
    function colorValue(entry: string, getVariableValue: (name: string) => string): string;
    /**
     * Those declarations as the body of a rule: `--color-x:var(--sky-500);--gap:4px`. A colour token becomes
     * the variable behind it, so the value follows the palette; anything else is written out as it stands,
     * in the order it was written — order carries no meaning to CSS anyway.
     */
    function customProperties(value: CustomProperties, getVariableValue: (name: string) => string): string;
    /** The mutable variable state of a single style engine. */
    interface VariablesRegistry {
        /** Record `name` as used (so it reaches `:root`) and return the `var(--name)` reference. */
        getVariableValue(name: string): string;
        /** Every variable used so far, as `:root` declarations. */
        generateVariables(): string;
        /** Variables used since the last call — returns and clears them. */
        getPendingVariables(): Record<string, string>;
        hasPendingVariables(): boolean;
        /** Whether `name` was declared through `Box.extend({ variables })`. */
        isUserVariable(name: string): boolean;
        /**
         * Forget which variables have been used, so the next `:root` block is built from scratch. Variables from
         * `Box.extend({ variables })` are registration rather than per-render state, and survive.
         */
        reset(): void;
        /** Add user variables. Merged into the ones already declared, so sequential `extend()` calls accumulate. */
        setUserVariables(variables: Record<string, string>): void;
    }
    /**
     * Per-engine variable state, kept out of module scope so two engines (iframes, shadow roots, parallel
     * SSR requests) never share a `:root` block or a pending queue.
     */
    function createRegistry(): VariablesRegistry;
}
export default Variables;
