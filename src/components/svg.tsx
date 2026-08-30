import { forwardRef, Ref, RefAttributes } from 'react';
import Box, { BoxProps, BoxTagProps } from '../box';
import { ExtractElementFromTag } from '../react/reactTypes';
import svgNaming from '../react/svg/svgNaming';
import { ComponentsAndVariants } from '../types';
import StringUtils from '../utils/string/stringUtils';

/**
 * The SVG elements as components, so a drawing is written the way the rest of this library is
 * written — `<Circle cx={28} r={12} />`, never `<Box tag="circle">`.
 *
 * The whole difficulty of an SVG component is that SVG attribute names and Box prop names collide,
 * and the collision is silent: a `<path>`'s `d` is Box's flex-direction prop, a `<rect>`'s `width`
 * is the ÷4 layout scale, a `<text>`'s `x` is a CSS geometry property that does not apply to text
 * at all. Chakra once turned the `d` attribute into `display` this way. So each component names the
 * attributes it owns and **lifts them off the style props onto the element itself**: on `Path`, `d`
 * is path data; on `RadialGradient`, `cx` is the attribute; on a shape, `cx` stays the CSS prop SV2
 * shipped. The rule is per element, because whether a name is CSS or an attribute is a question
 * about the element and not about the name.
 *
 * A name CSS really does own on that element is left alone. `cx`/`cy`/`r`/`rx`/`ry`/`x`/`y` on a
 * shape stay Box props, which is what makes them transition — see the geometry section of /svg.
 */

/** A name the element accepts as an attribute. */
type Attribute<TTag extends keyof React.JSX.IntrinsicElements> = keyof React.JSX.IntrinsicElements[TTag];

/** Box's props for the tag, minus the names this element claims as attributes, plus those attributes. */
type SvgElementProps<
  TTag extends keyof React.JSX.IntrinsicElements,
  TAttribute extends Attribute<TTag>,
  TKey extends keyof ComponentsAndVariants,
> = Omit<BoxProps<TTag, TKey>, 'tag' | TAttribute> & Pick<React.JSX.IntrinsicElements[TTag], TAttribute>;

type SvgElementType<
  TTag extends keyof React.JSX.IntrinsicElements,
  TAttribute extends Attribute<TTag>,
  TKey extends keyof ComponentsAndVariants = never,
> = (props: SvgElementProps<TTag, TAttribute, TKey> & RefAttributes<ExtractElementFromTag<TTag>>) => React.ReactNode;

/**
 * Split the claimed attributes out of a component's props. Returns the style props with those names
 * removed and the attributes to merge over `props`. A name that was not passed is not written
 * either — an absent attribute must never shadow one the caller put in `props` by hand.
 */
function liftAttributes(source: object, names: readonly string[]) {
  // A fresh object, so deleting from it leaves the caller's props untouched.
  const { props: tagProps, ...rest } = source as { props?: Record<string, unknown> };
  const styleProps = rest as Record<string, unknown>;
  let lifted: Record<string, unknown> | undefined;

  for (const name of names) {
    if (!(name in styleProps)) continue;

    (lifted ??= {})[name] = styleProps[name];
    delete styleProps[name];
  }

  return { styleProps, tagProps: lifted ? { ...tagProps, ...lifted } : tagProps };
}

function svgElement<
  TTag extends keyof React.JSX.IntrinsicElements,
  TAttribute extends Attribute<TTag>,
  TKey extends keyof ComponentsAndVariants,
>(tagName: TTag, attributes: readonly TAttribute[] = [], displayName?: string): SvgElementType<TTag, TAttribute, TKey> {
  const names = attributes as unknown as readonly string[];

  // Typed loosely inside and asserted once on the way out: while the tag is still a type parameter,
  // an `Omit` of Box's props does not survive the `PropsWithoutRef` React wraps a forwardRef in.
  const comp = forwardRef((props: object, ref: Ref<unknown>) => {
    const { styleProps, tagProps } = liftAttributes(props, names);

    return (
      <Box
        tag={tagName}
        ref={ref as Ref<ExtractElementFromTag<TTag>>}
        component={tagName as unknown as TKey}
        {...(styleProps as BoxProps<TTag, TKey>)}
        props={tagProps as BoxTagProps<TTag, TKey>}
      />
    );
  });

  comp.displayName = displayName ?? StringUtils.capitalize(tagName);

  return comp as unknown as SvgElementType<TTag, TAttribute, TKey>;
}

const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

interface SvgOwnProps {
  /** The coordinate system every number inside the drawing is measured in — `"0 0 24 24"`. */
  viewBox?: string;
  /** How the drawing is fitted when the box it is given is a different shape. */
  preserveAspectRatio?: string;
  /** The `width` attribute: a number in user units, or any CSS length — `"100%"`, `"12rem"`. */
  width?: string | number;
  /** The `height` attribute: a number in user units, or any CSS length. */
  height?: string | number;
  /** Names the drawing — `role="img"` and this text. Without one the `<svg>` is `aria-hidden`. */
  label?: string;
}

/** The `width`/`height` here are the SVG attributes, not the ÷4 layout props they are on a `<div>`. */
type Props = Omit<BoxProps<'svg'>, 'tag' | 'width' | 'height'> & SvgOwnProps;

const SVG_ATTRIBUTES = ['viewBox', 'preserveAspectRatio', 'width', 'height'];

function SvgImpl(props: Props, ref: Ref<SVGSVGElement>) {
  const { label, ...withoutLabel } = props;
  const { styleProps, tagProps } = liftAttributes(withoutLabel, SVG_ATTRIBUTES);

  return (
    <Box
      tag="svg"
      ref={ref}
      component={'svg' as never}
      {...(styleProps as BoxProps<'svg'>)}
      props={{ xmlns: SVG_NAMESPACE, ...svgNaming(label, tagProps), ...tagProps }}
    />
  );
}

/** The root `<svg>`: the coordinate system, the size, and whether a screen reader is told about it. */
export const Svg = /* @__PURE__ */ forwardRef(SvgImpl);
Svg.displayName = 'Svg';

export type SvgProps = React.ComponentProps<typeof Svg>;

/**
 * The rest of the elements. Each list is the attributes that element owns — everything CSS styles
 * on it stays a Box prop, so a shape's geometry still transitions and a gradient's `cx` still lands
 * where SVG expects it. `transform` is an attribute everywhere it appears because SVG's version
 * carries its own centre of rotation (`rotate(-90 48 48)`), which the CSS `rotate` prop cannot say
 * — CSS turns an SVG element around the corner of the viewBox unless a `transform-origin` says
 * otherwise, and this library has no prop for that yet.
 */
export const G = /* @__PURE__ */ svgElement('g', ['transform']);
export const Defs = /* @__PURE__ */ svgElement('defs');
export const Path = /* @__PURE__ */ svgElement('path', ['d', 'transform', 'pathLength']);
export const Circle = /* @__PURE__ */ svgElement('circle', ['transform', 'pathLength']);
export const Ellipse = /* @__PURE__ */ svgElement('ellipse', ['transform', 'pathLength']);
export const Rect = /* @__PURE__ */ svgElement('rect', ['width', 'height', 'transform', 'pathLength']);
export const Line = /* @__PURE__ */ svgElement('line', ['x1', 'y1', 'x2', 'y2', 'transform', 'pathLength']);
export const Polyline = /* @__PURE__ */ svgElement('polyline', ['points', 'transform', 'pathLength']);
export const Polygon = /* @__PURE__ */ svgElement('polygon', ['points', 'transform', 'pathLength']);

/**
 * `SvgText`, not `Text`, because `<text>` and a future HTML text component would be one name for
 * two elements. Its `x`/`y` are attributes: the CSS geometry properties do not apply to `<text>`,
 * so the Box props of the same name would compile, generate a rule, and move nothing.
 */
export const SvgText = /* @__PURE__ */ svgElement('text', ['x', 'y', 'dx', 'dy', 'textLength', 'lengthAdjust', 'transform'], 'SvgText');
export const TSpan = /* @__PURE__ */ svgElement('tspan', ['x', 'y', 'dx', 'dy', 'textLength', 'lengthAdjust'], 'TSpan');

export const LinearGradient = /* @__PURE__ */ svgElement('linearGradient', [
  'x1',
  'y1',
  'x2',
  'y2',
  'gradientUnits',
  'gradientTransform',
  'spreadMethod',
]);
export const RadialGradient = /* @__PURE__ */ svgElement('radialGradient', [
  'cx',
  'cy',
  'r',
  'fx',
  'fy',
  'gradientUnits',
  'gradientTransform',
  'spreadMethod',
]);
export const Stop = /* @__PURE__ */ svgElement('stop', ['offset', 'stopColor', 'stopOpacity']);

export const ClipPath = /* @__PURE__ */ svgElement('clipPath', ['clipPathUnits', 'transform']);
export const Mask = /* @__PURE__ */ svgElement('mask', ['maskUnits', 'maskContentUnits', 'x', 'y', 'width', 'height']);
export const Use = /* @__PURE__ */ svgElement('use', ['href', 'width', 'height', 'transform']);
/** `SvgSymbol`, not `Symbol` — the global of that name is not something a module should shadow. */
export const SvgSymbol = /* @__PURE__ */ svgElement('symbol', ['viewBox', 'preserveAspectRatio', 'x', 'y', 'width', 'height'], 'SvgSymbol');
export const Marker = /* @__PURE__ */ svgElement('marker', [
  'markerWidth',
  'markerHeight',
  'refX',
  'refY',
  'orient',
  'markerUnits',
  'viewBox',
]);
