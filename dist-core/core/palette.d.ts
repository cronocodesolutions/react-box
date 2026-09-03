import { BoxStyleValue } from './coreTypes';
/**
 * The colour palette, and the one modifier a colour value takes: `bgColor="blue-500/40"` is that token
 * mixed with `transparent`, so the alpha rides the colour rather than the element the way `opacity` does.
 *
 * The palette is Tailwind CSS 4.3.3's, in OKLCH — twenty-six families of eleven steps. It is packed one
 * string per family rather than written out as 286 `oklch()` values, because the table ships in every
 * bundle: 1.1 KB gzipped cheaper, with the hue rounded to a tenth of a degree (nothing a display resolves).
 */
declare namespace Palette {
    /** The eleven steps every family has, lightest first — the second half of a token name. */
    export const steps: readonly [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
    const families: {
        slate: string;
        gray: string;
        zinc: string;
        neutral: string;
        stone: string;
        mauve: string;
        mist: string;
        olive: string;
        taupe: string;
        red: string;
        orange: string;
        amber: string;
        yellow: string;
        lime: string;
        green: string;
        emerald: string;
        teal: string;
        cyan: string;
        sky: string;
        blue: string;
        indigo: string;
        violet: string;
        purple: string;
        fuchsia: string;
        pink: string;
        rose: string;
    };
    /**
     * The colours that are not a family: four CSS keywords kept from v1, the ends of the greyscale, and `vi`
     * — a stray brand violet that has been a token since v1 and is somebody's colour by now.
     */
    const keywords: {
        currentColor: string;
        transparent: string;
        green: string;
        red: string;
        blue: string;
        gray: string;
        black: string;
        white: string;
        vi: string;
    };
    export type Family = keyof typeof families;
    export type Step = (typeof steps)[number];
    /** One palette token: the family and the step, `blue-500` or `slate-950`. */
    export type Token = `${Family}-${Step}`;
    /** Every name `colors` holds — a token or one of the keywords. */
    export type ColorName = keyof typeof keywords | Token;
    /** Every colour this library knows, as the value its `--token` variable is declared with. */
    export const colors: Record<ColorName, string>;
    /** A colour with an opacity modifier — `blue-500/40`, `black/50`: Tailwind's spelling of the same thing. */
    export type Alpha = `${ColorName}/${number}`;
    /** The colour props' `values`, as a template type: the modifier reaches their union and their autocomplete. */
    export const alpha: Alpha;
    /** The colour and the percentage of a `token/alpha` value, or null when it is not one. */
    export function alphaOf(value: BoxStyleValue): {
        color: string;
        percent: string;
    } | null;
    /** Whether a value is a colour this library knows carrying one — the colour props' `match`. */
    export function isAlpha(value: BoxStyleValue): value is Alpha;
    /**
     * That value as CSS: the token mixed with `transparent`, in `oklab` — mixing towards transparency in a
     * polar space carries the hue with it. The mix is what keeps the alpha composed with the *variable*, so
     * the colour still follows the palette, the theme and every `extend()` that touched it.
     */
    export function mix(value: BoxStyleValue, getVariableValue: (name: string) => string): string;
    export {};
}
export default Palette;
