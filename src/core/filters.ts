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
namespace Filters {
  /** The nine functions `filter` composes, in the order the browser applies them. */
  export const filterLayers = [
    'Blur',
    'Brightness',
    'Contrast',
    'Grayscale',
    'HueRotate',
    'Invert',
    'Saturate',
    'Sepia',
    'DropShadow',
  ] as const;

  /** The same list on `backdrop-filter`, which has no drop shadow and an `opacity` that `filter` cannot use. */
  export const backdropLayers = [
    'BackdropBlur',
    'BackdropBrightness',
    'BackdropContrast',
    'BackdropGrayscale',
    'BackdropHueRotate',
    'BackdropInvert',
    'BackdropOpacity',
    'BackdropSaturate',
    'BackdropSepia',
  ] as const;

  export type Layer = (typeof filterLayers)[number] | (typeof backdropLayers)[number];

  // An unset layer contributes nothing — `var(--boxBlur,)`, an empty fallback rather than an identity
  // function. Only a layer that set itself writes this declaration, so the value is never empty in full.
  const composed = {
    filter: `filter:${filterLayers.map((layer) => `var(--box${layer},)`).join(' ')}`,
    backdrop: `backdrop-filter:${backdropLayers.map((layer) => `var(--box${layer},)`).join(' ')}`,
  };

  /** Every layer as an `@property` rule: the registration that stops one element's filter reaching its children. */
  export const properties: readonly string[] = [...filterLayers, ...backdropLayers].map(
    (layer) => `@property --box${layer}{syntax: "*";inherits: false;}`,
  );

  /**
   * A layer that paints nothing. `initial` reverts a registered property to the guaranteed-invalid value it
   * starts from — it has no `initial-value` — so the `var()` above falls back to nothing at all.
   */
  export const cleared = 'initial';

  /** One layer's declarations: its own custom property, and the composed filter every layer of that property shares. */
  export function layerDeclarations(layer: Layer, value: string): string {
    return `--box${layer}:${value};${composed[layer.startsWith('Backdrop') ? 'backdrop' : 'filter']}`;
  }

  /** Tailwind 4.3's blur scale, verified against its `theme.css`. A number is a radius in px instead. */
  const blurs = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 40, xxxl: 64 };

  export const blurScale = Object.keys(blurs) as (keyof typeof blurs)[];

  /** A blur step as its radius in px, which is what the number form of the prop takes directly. */
  export function blur(size: string): number {
    return blurs[size as keyof typeof blurs];
  }
}

export default Filters;
