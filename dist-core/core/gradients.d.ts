import { BoxStyleValue } from './coreTypes';
import { default as Palette } from './palette';
import { default as Variables } from './variables';
/**
 * The grammar behind `bgGradient`: a gradient written as a record — the key names the kind and carries
 * its geometry, `colors` are the stops in order. The stops are palette values, so a gradient is themed,
 * takes the opacity modifier and shares one class with every other element asking for the same one.
 */
declare namespace Gradients {
    /** Where a linear gradient runs to. A number is an angle in degrees instead, `0` pointing up. */
    const directions: {
        t: string;
        tr: string;
        r: string;
        br: string;
        b: string;
        bl: string;
        l: string;
        tl: string;
    };
    export type Direction = keyof typeof directions | number;
    /** Where a radial or conic gradient is centred — `at` — since neither runs in a direction. */
    const positions: readonly ["center", "top", "right", "bottom", "left", "top left", "top right", "bottom left", "bottom right"];
    export type Position = (typeof positions)[number];
    /**
     * Which space the colours are interpolated in. Worth naming: sRGB drags a two-stop gradient through
     * grey, and `-longer` takes the long way round the hue circle, which is what turns two stops into a
     * spectrum. Left unset, the browser's default (sRGB) applies.
     */
    const interpolations: {
        srgb: string;
        hsl: string;
        oklab: string;
        oklch: string;
        'hsl-longer': string;
        'oklch-longer': string;
    };
    export type Interpolation = keyof typeof interpolations;
    /** A stop's colour: everything a colour prop takes, so `blue-500/40` and `var(--chart-1)` both work. */
    export type StopColor = Variables.ColorType | Variables.SystemColorType | Palette.Alpha | Variables.Reference;
    /** One stop: a colour, or that colour and how far along the gradient it sits. */
    export type Stop = StopColor | readonly [StopColor, Variables.PercentString];
    type Linear = {
        linear: Direction;
        colors: readonly Stop[];
        interpolate?: Interpolation;
    };
    type Radial = {
        radial: 'circle' | 'ellipse' | true;
        at?: Position;
        colors: readonly Stop[];
        interpolate?: Interpolation;
    };
    type Conic = {
        conic: number | true;
        at?: Position;
        colors: readonly Stop[];
        interpolate?: Interpolation;
    };
    /** The `bgGradient` prop's value: one of the three kinds, its geometry and its stops. */
    export type Gradient = Linear | Radial | Conic;
    /**
     * Whether a value is a gradient this grammar can write — the prop's `match`. Judged whole rather than
     * key by key, because a gradient is one value: a bad stop makes the rest of it meaningless.
     */
    export function isGradient(value: BoxStyleValue): value is Gradient;
    /** The record as a `background-image` value, every stop resolved to the variable behind its token. */
    export function css(value: BoxStyleValue, getVariableValue: (name: string) => string): string;
    export {};
}
export default Gradients;
