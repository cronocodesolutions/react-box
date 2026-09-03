/**
 * The filter functions an element carries at once, on `filter` and on `backdrop-filter`.
 *
 * Both are one property whose value is a *list*, so each function sets a custom property of its own and
 * every one of them writes the same composed declaration — the shadow stack's trick, for the same reason.
 * The order is the grammar's rather than the caller's: filter functions apply in sequence and the result
 * depends on it, so fixing the order is what lets two elements naming the same two functions share a class.
 * `drop-shadow` sits last, where nothing else blurs or desaturates it.
 *
 * The layers are registered `inherits: false` in the base stylesheet. Without that a child asking only for
 * `brightness` would read its parent's `--boxBlur` through the fallback and blur a second time.
 */
declare namespace Filters {
    /** The nine functions `filter` composes, in the order the browser applies them. */
    export const filterLayers: readonly ["Blur", "Brightness", "Contrast", "Grayscale", "HueRotate", "Invert", "Saturate", "Sepia", "DropShadow"];
    /** The same list on `backdrop-filter`, which has no drop shadow and an `opacity` that `filter` cannot use. */
    export const backdropLayers: readonly ["BackdropBlur", "BackdropBrightness", "BackdropContrast", "BackdropGrayscale", "BackdropHueRotate", "BackdropInvert", "BackdropOpacity", "BackdropSaturate", "BackdropSepia"];
    export type Layer = (typeof filterLayers)[number] | (typeof backdropLayers)[number];
    /** Every layer as an `@property` rule: the registration that stops one element's filter reaching its children. */
    export const properties: readonly string[];
    /**
     * A layer that paints nothing. `initial` reverts a registered property to the guaranteed-invalid value it
     * starts from — it has no `initial-value` — so the `var()` above falls back to nothing at all.
     */
    export const cleared = "initial";
    /** One layer's declarations: its own custom property, and the composed filter every layer of that property shares. */
    export function layerDeclarations(layer: Layer, value: string): string;
    /** Tailwind 4.3's blur scale, verified against its `theme.css`. A number is a radius in px instead. */
    const blurs: {
        xs: number;
        sm: number;
        md: number;
        lg: number;
        xl: number;
        xxl: number;
        xxxl: number;
    };
    export const blurScale: (keyof typeof blurs)[];
    /** A blur step as its radius in px, which is what the number form of the prop takes directly. */
    export function blur(size: string): number;
    export {};
}
export default Filters;
