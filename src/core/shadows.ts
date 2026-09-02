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
namespace Shadows {
  /** The layers, in paint order — CSS draws the first shadow of a list on top of the ones after it. */
  export const layers = ['InsetShadow', 'InsetRing', 'Ring', 'Shadow'] as const;
  export type Layer = (typeof layers)[number];

  /**
   * The two shadows that are not `box-shadow` layers but take a colour the same way: `text-shadow` is its
   * own property, and `drop-shadow` is a filter function, composed by `filters.ts` rather than here.
   */
  export type Colored = Layer | 'TextShadow' | 'DropShadow';

  /** A shadow that paints nothing, so an unset layer — or one turned off — costs no pixels. */
  const empty = '0 0 #0000';

  /** The declaration all four layers write, reading whichever of them are set. */
  const composed = `box-shadow:${layers.map((layer) => `var(--box${layer}, ${empty})`).join(',')}`;

  /** Every layer's custom property and colour, as `@property` rules: the registration that stops them inheriting. */
  export const properties: readonly string[] = [
    ...layers.flatMap((layer) => [
      `@property --box${layer}{syntax: "*";inherits: false;}`,
      `@property --box${layer}Color{syntax: "*";inherits: false;}`,
    ]),
    `@property --boxTextShadowColor{syntax: "*";inherits: false;}`,
    `@property --boxDropShadowColor{syntax: "*";inherits: false;}`,
  ];

  const boxShadows = {
    xxs: '0 1px @.05',
    xs: '0 1px 2px 0 @.05',
    sm: '0 1px 3px 0 @.1,0 1px 2px -1px @.1',
    md: '0 4px 6px -1px @.1,0 2px 4px -2px @.1',
    lg: '0 10px 15px -3px @.1,0 4px 6px -4px @.1',
    xl: '0 20px 25px -5px @.1,0 8px 10px -6px @.1',
    xxl: '0 25px 50px -12px @.25',
  };

  const insetShadows = {
    xxs: 'inset 0 1px @.05',
    xs: 'inset 0 1px 1px @.05',
    sm: 'inset 0 2px 4px @.05',
  };

  const textShadows = {
    xxs: '0px 1px 0px @.15',
    xs: '0px 1px 1px @.2',
    sm: '0px 1px 0px @.075,0px 1px 1px @.075,0px 2px 2px @.075',
    md: '0px 1px 1px @.1,0px 1px 2px @.1,0px 2px 4px @.1',
    lg: '0px 1px 2px @.1,0px 3px 2px @.1,0px 4px 8px @.1',
  };

  // Every step is a single shadow, because `drop-shadow()` takes one — no comma list and no spread.
  const dropShadows = {
    xs: '0 1px 1px @.05',
    sm: '0 1px 2px @.15',
    md: '0 3px 3px @.12',
    lg: '0 4px 4px @.15',
    xl: '0 9px 7px @.1',
    xxl: '0 25px 25px @.15',
  };

  export type BoxSize = keyof typeof boxShadows | 'none';
  export type InsetSize = keyof typeof insetShadows | 'none';
  export type TextSize = keyof typeof textShadows | 'none';
  export type DropSize = keyof typeof dropShadows | 'none';

  export const boxSizes = [...Object.keys(boxShadows), 'none'] as BoxSize[];
  export const insetSizes = [...Object.keys(insetShadows), 'none'] as InsetSize[];
  export const textSizes = [...Object.keys(textShadows), 'none'] as TextSize[];
  export const dropSizes = [...Object.keys(dropShadows), 'none'] as DropSize[];

  // `var(--boxShadowColor, rgb(0 0 0 / .1))`: the fallback is the step's own alpha, and it is reached only
  // because the layer's colour is registered with the universal syntax and no initial value.
  function paint(template: string, layer: Colored): string {
    return template.replace(/@([\d.]+)/g, (_, alpha) => `var(--box${layer}Color, rgb(0 0 0 / ${alpha}))`);
  }

  /** One layer's declarations: its own custom property, and the composed shadow every layer shares. */
  export function layerDeclarations(layer: Layer, value: string): string {
    return `--box${layer}:${value};${composed}`;
  }

  /** A layer's colour, which is a custom property and nothing else — an unpainted layer shows none of it. */
  export function colorDeclaration(layer: Colored, color: string): string {
    return `--box${layer}Color:${color}`;
  }

  /** A step of the elevation scale on the outer or the inset layer, `none` clearing just that one. */
  export function shadow(layer: 'Shadow' | 'InsetShadow', size: string): string {
    const scale: Record<string, string> = layer === 'Shadow' ? boxShadows : insetShadows;

    return layerDeclarations(layer, size === 'none' ? empty : paint(scale[size], layer));
  }

  /** A ring: a hard-edged shadow `width` px wide, outside the border box or inside it. */
  export function ring(layer: 'Ring' | 'InsetRing', width: number): string {
    const inset = layer === 'InsetRing' ? 'inset ' : '';

    return layerDeclarations(layer, width === 0 ? empty : `${inset}0 0 0 ${width}px var(--box${layer}Color, currentColor)`);
  }

  /** `text-shadow` is one property with one contributor, so it needs no composing — only a colour to read. */
  export function textShadow(size: string): string {
    return size === 'none' ? 'none' : paint(textShadows[size as keyof typeof textShadows], 'TextShadow');
  }

  /** A step of the drop-shadow scale as the filter function itself, for `filters.ts` to put in its layer. */
  export function dropShadow(size: string): string {
    return `drop-shadow(${paint(dropShadows[size as keyof typeof dropShadows], 'DropShadow')})`;
  }
}

export default Shadows;
