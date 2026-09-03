/**
 * The four shadows an element can carry at once, and the four scales they come from.
 *
 * `box-shadow` is one property, so an inset shadow, an inset ring, a ring and a drop shadow each set
 * their own custom property and all four write the same composed declaration — the `translate` trick,
 * for the same reason: two props writing one property keep whichever rule lands last. The layers are
 * registered `inherits: false` in the base stylesheet, or a child asking for a ring would inherit its
 * parent's shadow through the `var()` fallback.
 *
 * The scales are Tailwind 4.3's, verified against its `theme.css`. `@` is where the colour goes, with the
 * alpha the step wants: `shadowColor` replaces every occurrence at once, since one step names it per shadow.
 */
declare namespace Shadows {
    /** The layers, in paint order — CSS draws the first shadow of a list on top of the ones after it. */
    export const layers: readonly ["InsetShadow", "InsetRing", "Ring", "Shadow"];
    export type Layer = (typeof layers)[number];
    /**
     * The two shadows that are not `box-shadow` layers but take a colour the same way: `text-shadow` is its
     * own property, and `drop-shadow` is a filter function, composed by `filters.ts` rather than here.
     */
    export type Colored = Layer | 'TextShadow' | 'DropShadow';
    /** Every layer's custom property and colour, as `@property` rules: the registration that stops them inheriting. */
    export const properties: readonly string[];
    const boxShadows: {
        xxs: string;
        xs: string;
        sm: string;
        md: string;
        lg: string;
        xl: string;
        xxl: string;
    };
    const insetShadows: {
        xxs: string;
        xs: string;
        sm: string;
    };
    const textShadows: {
        xxs: string;
        xs: string;
        sm: string;
        md: string;
        lg: string;
    };
    const dropShadows: {
        xs: string;
        sm: string;
        md: string;
        lg: string;
        xl: string;
        xxl: string;
    };
    export type BoxSize = keyof typeof boxShadows | 'none';
    export type InsetSize = keyof typeof insetShadows | 'none';
    export type TextSize = keyof typeof textShadows | 'none';
    export type DropSize = keyof typeof dropShadows | 'none';
    export const boxSizes: BoxSize[];
    export const insetSizes: InsetSize[];
    export const textSizes: TextSize[];
    export const dropSizes: DropSize[];
    /** One layer's declarations: its own custom property, and the composed shadow every layer shares. */
    export function layerDeclarations(layer: Layer, value: string): string;
    /** A layer's colour, which is a custom property and nothing else — an unpainted layer shows none of it. */
    export function colorDeclaration(layer: Colored, color: string): string;
    /** A step of the elevation scale on the outer or the inset layer, `none` clearing just that one. */
    export function shadow(layer: 'Shadow' | 'InsetShadow', size: string): string;
    /** A ring: a hard-edged shadow `width` px wide, outside the border box or inside it. */
    export function ring(layer: 'Ring' | 'InsetRing', width: number): string;
    /** `text-shadow` is one property with one contributor, so it needs no composing — only a colour to read. */
    export function textShadow(size: string): string;
    /** A step of the drop-shadow scale as the filter function itself, for `filters.ts` to put in its layer. */
    export function dropShadow(size: string): string;
    export {};
}
export default Shadows;
