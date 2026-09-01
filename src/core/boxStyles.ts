import Animations from './animations';
import { BoxStylesFormatters } from './boxStylesFormatters';
import { BoxStyle, BoxStyleValue } from './coreTypes';
import Variables from './variables';

/** The opacity scale shared by `opacity`, `fillOpacity` and `strokeOpacity`. */
const opacityValues = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1] as const;

/**
 * `url(#id)` or `var(--name)` — a gradient, a pattern, a clip path: something the document defines
 * rather than a token this library knows. Declared after each prop's token list, which `find` gives
 * first refusal, and deliberately unformatted: someone else's variable is not ours to resolve.
 */
const referenceValues = {
  values: Variables.reference,
  match: Variables.isReference,
} satisfies BoxStyle;

/**
 * The percentage every spacing, sizing, inset and translate prop accepts. It carries its own `match`
 * because `values` is a plain string, and a scalar `values` is matched by `typeof` alone — which made all
 * thirty of them an unvalidated catch-all (bug #31).
 */
const percentValue = {
  values: Variables.percentString,
  match: Variables.isPercentString,
} satisfies BoxStyle;

/**
 * One axis of the composed `translate`. Both axes used to write `transform`, so a Box asking for both kept
 * whichever rule landed last; each now sets its own custom property and both write the same declaration,
 * which still transitions because `var()` substitutes at computed-value time.
 */
function translate(axis: 'X' | 'Y', format: (value: BoxStyleValue) => string) {
  return (value: BoxStyleValue) => `--boxTranslate${axis}:${format(value)};translate:var(--boxTranslateX, 0) var(--boxTranslateY, 0)`;
}

export const cssStyles = {
  /** The appearance CSS property is used to display UI elements with platform-specific styling, based on the operating system's theme. */
  appearance: [
    {
      values: ['none', 'auto', 'menulist-button', 'textfield', 'button', 'checkbox'] as const,
    },
  ],
  /**
   * One of the four presets — their `@keyframes` are registered already and their durations ride
   * `--transitionTime`, so `prefers-reduced-motion` stops them with no opt-in. Declared before the
   * longhands below, so `animationDuration` and friends override what a preset chose.
   */
  animation: [
    {
      values: [...Animations.presetNames, 'none'] as const,
      valueFormat: (value: string) => Animations.presets[value as Animations.PresetName] ?? 'none',
      keyframes: (value: BoxStyleValue) => [value as string],
    },
  ],
  /** The animation-delay CSS property specifies the amount of time to wait from applying the animation to an element before beginning to perform the animation. Milliseconds, like every other time here. */
  animationDelay: [
    {
      values: 0,
      styleName: 'animation-delay',
      valueFormat: BoxStylesFormatters.Value.ms,
    },
  ],
  /** The animation-direction CSS property sets whether an animation should play forward, backward, or alternate back and forth between playing the sequence forward and backward. */
  animationDirection: [
    {
      values: ['normal', 'reverse', 'alternate', 'alternate-reverse'] as const,
      styleName: 'animation-direction',
    },
  ],
  /** The animation-duration CSS property sets the length of time that an animation takes to complete one cycle. Milliseconds: `animationDuration={1100}` is `1100ms`, and it names its own time, so reduced motion cannot reach it — say so with `motionReduce`. A spring name is that spring's settling time. */
  animationDuration: [
    {
      values: 0,
      styleName: 'animation-duration',
      valueFormat: BoxStylesFormatters.Value.ms,
    },
    {
      values: [...Animations.springNames] as const,
      styleName: 'animation-duration',
      valueFormat: (value: string) => Animations.springDuration(value as Animations.SpringName),
    },
  ],
  /** The animation-fill-mode CSS property sets how a CSS animation applies styles to its target before and after its execution. */
  animationFillMode: [
    {
      values: ['none', 'forwards', 'backwards', 'both'] as const,
      styleName: 'animation-fill-mode',
    },
  ],
  /** The animation-iteration-count CSS property sets the number of times an animation sequence should be played before stopping. */
  animationIterationCount: [
    {
      values: ['infinite'] as const,
      styleName: 'animation-iteration-count',
    },
    {
      values: 0,
      styleName: 'animation-iteration-count',
    },
  ],
  /**
   * Which `@keyframes` to run: a sequence registered with `Box.keyframes()`, one of the four preset
   * names, or a name from a stylesheet this library never wrote — an unknown name is left alone rather
   * than dropped, because `@keyframes` can come from anywhere.
   */
  animationName: [
    {
      values: '',
      styleName: 'animation-name',
      keyframes: (value: BoxStyleValue) => String(value).split(/[\s,]+/),
    },
  ],
  /** The animation-play-state CSS property sets whether an animation is running or paused. */
  animationPlayState: [
    {
      values: ['running', 'paused'] as const,
      styleName: 'animation-play-state',
    },
  ],
  /**
   * How an animation progresses through each cycle: a keyword, one of the four sampled springs, or a curve
   * of your own — `cubic-bezier()`, `steps()` and `linear()` are values. A spring names its duration too.
   */
  animationTimingFunction: [
    {
      values: ['linear', 'ease', 'ease-in', 'ease-in-out', 'ease-out', 'step-start', 'step-end'] as const,
      styleName: 'animation-timing-function',
    },
    {
      values: [...Animations.springNames] as const,
      styleName: 'animation-timing-function',
      declarations: (value) =>
        Animations.easingDeclarations('animation-timing-function', Animations.springEasing(value as Animations.SpringName)),
    },
    {
      values: Animations.timingFunction,
      match: Animations.isTimingFunction,
      styleName: 'animation-timing-function',
      declarations: (value) => Animations.easingDeclarations('animation-timing-function', value as string),
    },
  ],
  /** The border-width shorthand CSS property sets the width of an element's border. */
  b: [
    {
      values: 0,
      styleName: 'border-width',
      valueFormat: BoxStylesFormatters.Value.px,
    },
  ],
  /** The border-width shorthand CSS property sets the width of an element's left and right border. */
  bx: [
    {
      values: 0,
      styleName: 'border-inline-width',
      valueFormat: BoxStylesFormatters.Value.px,
    },
  ],
  /** The border-width shorthand CSS property sets the width of an element's top and bottom border. */
  by: [
    {
      values: 0,
      styleName: 'border-block-width',
      valueFormat: BoxStylesFormatters.Value.px,
    },
  ],
  /** The border-top-width CSS property sets the width of the top border of an element. */
  bt: [
    {
      values: 0,
      styleName: 'border-top-width',
      valueFormat: BoxStylesFormatters.Value.px,
    },
  ],
  /** The border-right-width CSS property sets the width of the right border of an element. */
  br: [
    {
      values: 0,
      styleName: 'border-right-width',
      valueFormat: BoxStylesFormatters.Value.px,
    },
  ],
  /** The border-bottom-width CSS property sets the width of the bottom border of an element. */
  bb: [
    {
      values: 0,
      styleName: 'border-bottom-width',
      valueFormat: BoxStylesFormatters.Value.px,
    },
  ],
  /** The border-left-width CSS property sets the width of the left border of an element. */
  bl: [
    {
      values: 0,
      styleName: 'border-left-width',
      valueFormat: BoxStylesFormatters.Value.px,
    },
  ],
  /** The border-style shorthand CSS property sets the line style for all four sides of an element's border. */
  borderStyle: [
    {
      styleName: 'border-style',
      values: ['solid', 'dashed', 'dotted', 'double', 'groove', 'ridge', 'inset', 'outset', 'none', 'hidden'] as const,
    },
  ],
  /** The border-radius CSS property rounds the corners of an element's outer border edge. You can set a single radius to make circular corners, or two radii to make elliptical corners. */
  borderRadius: [
    {
      styleName: 'border-radius',
      values: 0,
      valueFormat: BoxStylesFormatters.Value.rem,
    },
  ],
  /** The border-top-radius CSS property rounds the top corners of an element by specifying the radius (or the radius of the semi-major and semi-minor axes) of the ellipse defining the curvature of the corner. */
  borderRadiusTop: [
    {
      values: 0,
      styleName: ['border-top-left-radius', 'border-top-right-radius'],
      valueFormat: BoxStylesFormatters.Value.rem,
    },
  ],
  /** The border-right-radius CSS property rounds the right corners of an element by specifying the radius (or the radius of the semi-major and semi-minor axes) of the ellipse defining the curvature of the corner. */
  borderRadiusRight: [
    {
      values: 0,
      styleName: ['border-top-right-radius', 'border-bottom-right-radius'],
      valueFormat: BoxStylesFormatters.Value.rem,
    },
  ],
  /** The border-bottom-radius CSS property rounds the bottom corners of an element by specifying the radius (or the radius of the semi-major and semi-minor axes) of the ellipse defining the curvature of the corner. */
  borderRadiusBottom: [
    {
      values: 0,
      styleName: ['border-bottom-left-radius', 'border-bottom-right-radius'],
      valueFormat: BoxStylesFormatters.Value.rem,
    },
  ],
  /** The border-left-radius CSS property rounds the left corners of an element by specifying the radius (or the radius of the semi-major and semi-minor axes) of the ellipse defining the curvature of the corner. */
  borderRadiusLeft: [
    {
      values: 0,
      styleName: ['border-top-left-radius', 'border-bottom-left-radius'],
      valueFormat: BoxStylesFormatters.Value.rem,
    },
  ],
  /** The border-top-left-radius CSS property rounds the top-left corner of an element by specifying the radius (or the radius of the semi-major and semi-minor axes) of the ellipse defining the curvature of the corner. */
  borderRadiusTopLeft: [
    {
      values: 0,
      styleName: 'border-top-left-radius',
      valueFormat: BoxStylesFormatters.Value.rem,
    },
  ],
  /** The border-top-right-radius CSS property rounds the top-right corner of an element by specifying the radius (or the radius of the semi-major and semi-minor axes) of the ellipse defining the curvature of the corner. */
  borderRadiusTopRight: [
    {
      values: 0,
      styleName: 'border-top-right-radius',
      valueFormat: BoxStylesFormatters.Value.rem,
    },
  ],
  /** The border-bottom-right-radius CSS property rounds the bottom-right corner of an element by specifying the radius (or the radius of the semi-major and semi-minor axes) of the ellipse defining the curvature of the corner. */
  borderRadiusBottomRight: [
    {
      values: 0,
      styleName: 'border-bottom-right-radius',
      valueFormat: BoxStylesFormatters.Value.rem,
    },
  ],
  /** The border-bottom-left-radius CSS property rounds the bottom-left corner of an element by specifying the radius (or the radius of the semi-major and semi-minor axes) of the ellipse defining the curvature of the corner. */
  borderRadiusBottomLeft: [
    {
      values: 0,
      styleName: 'border-bottom-left-radius',
      valueFormat: BoxStylesFormatters.Value.rem,
    },
  ],
  /** The position CSS property sets how an element is positioned in a document. The top, right, bottom, and left properties determine the final location of positioned elements. */
  position: [
    {
      values: ['static', 'relative', 'absolute', 'fixed', 'sticky'] as const,
    },
  ],
  /** The top CSS property sets the vertical position of a positioned element. This inset property has no effect on non-positioned elements. */
  top: [
    {
      values: 0,
      valueFormat: BoxStylesFormatters.Value.rem,
    },
    {
      values: Variables.percentages,
      valueFormat: BoxStylesFormatters.Value.fraction,
    },
    {
      values: Variables.negativePercentages,
      valueFormat: BoxStylesFormatters.Value.fraction,
    },
    {
      ...percentValue,
    },
  ],
  /** The right CSS property participates in specifying the horizontal position of a positioned element. This inset property has no effect on non-positioned elements. */
  right: [
    {
      values: 0,
      valueFormat: BoxStylesFormatters.Value.rem,
    },
    {
      values: Variables.percentages,
      valueFormat: BoxStylesFormatters.Value.fraction,
    },
    {
      values: Variables.negativePercentages,
      valueFormat: BoxStylesFormatters.Value.fraction,
    },
    {
      ...percentValue,
    },
  ],
  /** The bottom CSS property participates in setting the vertical position of a positioned element. This inset property has no effect on non-positioned elements. */
  bottom: [
    {
      values: 0,
      valueFormat: BoxStylesFormatters.Value.rem,
    },
    {
      values: Variables.percentages,
      valueFormat: BoxStylesFormatters.Value.fraction,
    },
    {
      values: Variables.negativePercentages,
      valueFormat: BoxStylesFormatters.Value.fraction,
    },
    {
      ...percentValue,
    },
  ],
  /** The left CSS property participates in specifying the horizontal position of a positioned element. This inset property has no effect on non-positioned elements. */
  left: [
    {
      values: 0,
      valueFormat: BoxStylesFormatters.Value.rem,
    },
    {
      values: Variables.percentages,
      valueFormat: BoxStylesFormatters.Value.fraction,
    },
    {
      values: Variables.negativePercentages,
      valueFormat: BoxStylesFormatters.Value.fraction,
    },
    {
      ...percentValue,
    },
  ],
  /** The inset CSS property is a shorthand that corresponds to the top, right, bottom, and/or left properties. It has the same multi-value syntax of the margin shorthand. */
  inset: [
    {
      values: 0,
      valueFormat: BoxStylesFormatters.Value.rem,
    },
    {
      ...percentValue,
    },
  ],
  /** The `box-sizing` CSS property sets how the total width and height of an element is calculated. */
  boxSizing: [
    {
      values: ['border-box', 'content-box'] as const,
      styleName: 'box-sizing',
    },
  ],
  /** The content-visibility CSS property controls whether or not an element renders its contents at all, along with forcing a strong set of containments, allowing user agents to potentially omit large swathes of layout and rendering work until it becomes needed. It enables the user agent to skip an element's rendering work (including layout and painting) until it is needed — which makes the initial page load much faster. */
  contentVisibility: [
    {
      values: ['visible', 'hidden'] as const,
      styleName: 'content-visibility',
    },
  ],
  /** The clip-path CSS property creates a clipping region that sets what part of an element should be shown. Parts that are inside the region are shown, while those outside are hidden. `inset(50%)` clips an element away entirely without removing it from the accessibility tree — the visually-hidden recipe. A `<ClipPath>` in the document is `clipPath="url(#frame)"`. */
  clipPath: [
    {
      values: ['inset(50%)', 'none'] as const,
      styleName: 'clip-path',
    },
    { ...referenceValues, styleName: 'clip-path' },
  ],
  /** The cursor CSS property sets the mouse cursor, if any, to show when the mouse pointer is over an element. */
  cursor: [
    {
      values: [
        'auto',
        'default',
        'none',
        'context-menu',
        'help',
        'pointer',
        'progress',
        'wait',
        'cell',
        'crosshair',
        'text',
        'vertical-text',
        'alias',
        'copy',
        'move',
        'no-drop',
        'not-allowed',
        'e-resize',
        'n-resize',
        'ne-resize',
        'nw-resize',
        's-resize',
        'se-resize',
        'sw-resize',
        'w-resize',
        'ew-resize',
        'ns-resize',
        'nesw-resize',
        'nwse-resize',
        'col-resize',
        'row-resize',
        'all-scroll',
        'zoom-in',
        'zoom-out',
        'grab',
        'grabbing',
      ] as const,
    },
  ],
  /** The `display` CSS property sets whether an element is treated as a block or inline box and the layout used for its children, such as flow layout, grid or flex. */
  display: [
    {
      values: [
        'none',
        'block',
        'inline',
        'inline-block',
        'flex',
        'inline-flex',
        'grid',
        'inline-grid',
        'contents',
        'table',
        'table-header-group',
        'table-row-group',
        'table-row',
        'table-cell',
      ] as const,
    },
  ],
  /** The `inline` property is a shortcut to transform `block`, `flex` and `grid` value to `inline-block`, `inline-flex` and `inline-grid` respectively. */
  inline: [
    {
      values: [true] as const,
      styleName: 'display',
      valueFormat: () => 'inline-block',
    },
  ],
  /**
   * Whether `height`/`width` may interpolate to and from a keyword — `auto`, `min-content`, `fit-content`.
   * Inherited, so it belongs on the container and every size inside it animates; Chromium-only for now,
   * and elsewhere a `height: auto` transition simply snaps, which is what it already does today.
   */
  interpolateSize: [
    {
      styleName: 'interpolate-size',
      values: ['numeric-only', 'allow-keywords'] as const,
    },
  ],
  /** The CSS justify-content property defines how the browser distributes space between and around content items along the main axis of a flex container and the inline axis of grid and multicol containers. */
  jc: [
    {
      styleName: 'justify-content',
      values: [
        'start',
        'end',
        'flex-start',
        'flex-end',
        'center',
        'left',
        'right',
        'space-between',
        'space-around',
        'space-evenly',
        'stretch',
      ] as const,
    },
  ],
  /** The CSS align-items property sets the align-self value on all direct children as a group. In flexbox, it controls the alignment of items on the cross axis. In grid layout, it controls the alignment of items on the block axis within their grid areas. */
  ai: [
    {
      styleName: 'align-items',
      values: ['stretch', 'flex-start', 'flex-end', 'center', 'baseline', 'start', 'end', 'self-start', 'self-end'] as const,
    },
  ],
  placeContent: [
    {
      styleName: 'place-content',
      values: ['start', 'end', 'flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly', 'stretch'] as const,
    },
  ],
  /** The CSS align-content property sets the distribution of space between and around content items along a flexbox's cross axis, or a grid or block-level element's block axis. */
  alignContent: [
    {
      styleName: 'align-content',
      values: [
        'flex-start',
        'flex-end',
        'center',
        'space-between',
        'space-around',
        'space-evenly',
        'stretch',
        'start',
        'end',
        'baseline',
      ] as const,
    },
  ],
  /** The flex CSS shorthand property sets flex to fit the space available in its flex container. */
  flex1: [
    {
      styleName: 'flex',
      values: [true] as const,
      valueFormat: () => '1',
    },
  ],
  /** The flex-direction CSS property sets how flex items are placed in the flex container defining the main axis and the direction (normal or reversed). */
  d: [
    {
      styleName: 'flex-direction',
      values: ['row', 'row-reverse', 'column', 'column-reverse'] as const,
    },
  ],
  /** The flex-wrap CSS property sets whether flex items are forced onto one line or can wrap onto multiple lines. If wrapping is allowed, it sets the direction that lines are stacked. */
  flexWrap: [
    {
      styleName: 'flex-wrap',
      values: ['nowrap', 'wrap', 'wrap-reverse'] as const,
    },
  ],
  /** The flex-grow CSS property sets the flex grow factor, which specifies how much of the flex container's positive free space, if any, should be assigned to the flex item's main size. */
  flexGrow: [
    {
      styleName: 'flex-grow',
      values: 0,
    },
  ],
  /** The flex-shrink CSS property sets the flex shrink factor of a flex item. If the size of all flex items is larger than the flex container, the flex items can shrink to fit according to their flex-shrink value. Each flex line's negative free space is distributed between the line's flex items that have a flex-shrink value greater than 0. */
  flexShrink: [
    {
      styleName: 'flex-shrink',
      values: 0,
    },
  ],
  /** The align-self CSS property overrides a grid or flex item's align-items value. In grid, it aligns the item inside the grid area. In flexbox, it aligns the item on the cross axis. */
  alignSelf: [
    {
      styleName: 'align-self',
      values: ['auto', 'flex-start', 'flex-end', 'center', 'baseline', 'stretch'] as const,
    },
  ],
  /** The CSS justify-self property sets the way a box is justified inside its alignment container along the appropriate axis. */
  justifySelf: [
    {
      styleName: 'justify-self',
      values: ['auto', 'flex-start', 'flex-end', 'center', 'baseline', 'stretch'] as const,
    },
  ],
  /** The font-size CSS property sets the size of the font. Changing the font size also updates the sizes of the font size-relative <length> units, such as em, ex, and so forth. */
  fontSize: [
    {
      styleName: 'font-size',
      values: 0,
      valueFormat: (value: number) => `${value / 16}rem`,
    },
    {
      styleName: 'font-size',
      values: ['inherit'] as const,
    },
  ],
  /** The font-style CSS property sets whether a font should be styled with a normal, italic, or oblique face from its font-family. */
  fontStyle: [
    {
      styleName: 'font-style',
      values: ['italic', 'normal', 'oblique'] as const,
    },
  ],
  /** The font-weight CSS property sets the weight (or boldness) of the font. The weights available depend on the font-family that is currently set. */
  fontWeight: [
    {
      styleName: 'font-weight',
      values: [100, 200, 300, 400, 500, 600, 700, 800, 900] as const,
    },
  ],
  /** The gap CSS shorthand property sets the gaps (also called gutters) between rows and columns. This property applies to multi-column, flex, and grid containers. */
  gap: [
    {
      values: 0,
      valueFormat: BoxStylesFormatters.Value.rem,
    },
    {
      ...percentValue,
    },
  ],
  /** The row-gap CSS property sets the size of the gap (gutter) between an element's rows. */
  rowGap: [
    {
      styleName: 'row-gap',
      values: 0,
      valueFormat: BoxStylesFormatters.Value.rem,
    },
    {
      styleName: 'row-gap',
      ...percentValue,
    },
  ],
  /** The column-gap CSS property sets the size of the gap (gutter) between an element's columns. */
  columnGap: [
    {
      styleName: 'column-gap',
      values: 0,
      valueFormat: BoxStylesFormatters.Value.rem,
    },
    {
      styleName: 'column-gap',
      ...percentValue,
    },
  ],
  /** The order CSS property sets the order to lay out an item in a flex or grid container. Items in a container are sorted by ascending order value and then by their source code order. Items not given an explicit order value are assigned the default value of 0. */
  order: [
    {
      styleName: 'order',
      values: 0,
    },
  ],
  /** The height CSS property specifies the height of an element. By default, the property defines the height of the content area. If box-sizing is set to border-box, however, it instead determines the height of the border area. */
  height: [
    { values: 0, valueFormat: BoxStylesFormatters.Value.rem },
    {
      values: ['fit'] as const,
      valueFormat: () => '100%',
    },
    {
      values: ['fit-screen'] as const,
      valueFormat: () => '100vh',
    },
    {
      values: Variables.percentages,
      valueFormat: BoxStylesFormatters.Value.fraction,
    },
    {
      values: ['auto', 'fit-content', 'max-content', 'min-content'] as const,
    },
    {
      ...percentValue,
    },
  ],
  /** The min-height CSS property sets the minimum height of an element. It prevents the used value of the height property from becoming smaller than the value specified for min-height. */
  minHeight: [
    { styleName: 'min-height', values: 0, valueFormat: BoxStylesFormatters.Value.rem },
    {
      styleName: 'min-height',
      values: ['fit'] as const,
      valueFormat: () => '100%',
    },
    {
      styleName: 'min-height',
      values: ['fit-screen'] as const,
      valueFormat: () => '100vh',
    },
    {
      styleName: 'min-height',
      values: Variables.percentages,
      valueFormat: BoxStylesFormatters.Value.fraction,
    },
    {
      styleName: 'min-height',
      values: ['auto', 'fit-content', 'max-content', 'min-content'] as const,
    },
    {
      styleName: 'min-height',
      ...percentValue,
    },
  ],
  /** The max-height CSS property sets the maximum height of an element. It prevents the used value of the height property from becoming larger than the value specified for max-height. */
  maxHeight: [
    { styleName: 'max-height', values: 0, valueFormat: BoxStylesFormatters.Value.rem },
    {
      styleName: 'max-height',
      values: ['fit'] as const,
      valueFormat: () => '100%',
    },
    {
      styleName: 'max-height',
      values: ['fit-screen'] as const,
      valueFormat: () => '100vh',
    },
    {
      styleName: 'max-height',
      values: Variables.percentages,
      valueFormat: BoxStylesFormatters.Value.fraction,
    },
    {
      styleName: 'max-height',
      values: ['auto', 'fit-content', 'max-content', 'min-content'] as const,
    },
    {
      styleName: 'max-height',
      ...percentValue,
    },
  ],
  /** The width CSS property sets an element's width. By default, it sets the width of the content area, but if box-sizing is set to border-box, it sets the width of the border area. */
  width: [
    { values: 0, valueFormat: BoxStylesFormatters.Value.rem },
    {
      values: ['fit'] as const,
      valueFormat: () => '100%',
    },
    {
      values: ['fit-screen'] as const,
      valueFormat: () => '100vw',
    },
    {
      values: Variables.percentages,
      valueFormat: BoxStylesFormatters.Value.fraction,
    },
    {
      values: ['auto', 'fit-content', 'max-content', 'min-content'] as const,
    },
    {
      ...percentValue,
    },
  ],
  /** The min-width CSS property sets the minimum width of an element. It prevents the used value of the width property from becoming smaller than the value specified for min-width. */
  minWidth: [
    { styleName: 'min-width', values: 0, valueFormat: BoxStylesFormatters.Value.rem },
    {
      styleName: 'min-width',
      values: ['fit'] as const,
      valueFormat: () => '100%',
    },
    {
      styleName: 'min-width',
      values: ['fit-screen'] as const,
      valueFormat: () => '100vw',
    },
    {
      styleName: 'min-width',
      values: Variables.percentages,
      valueFormat: BoxStylesFormatters.Value.fraction,
    },
    {
      styleName: 'min-width',
      values: ['auto', 'fit-content', 'max-content', 'min-content'] as const,
    },
    {
      styleName: 'min-width',
      ...percentValue,
    },
  ],
  /** The max-width CSS property sets the maximum width of an element. It prevents the used value of the width property from becoming larger than the value specified by max-width. */
  maxWidth: [
    { styleName: 'max-width', values: 0, valueFormat: BoxStylesFormatters.Value.rem },
    {
      styleName: 'max-width',
      values: ['fit'] as const,
      valueFormat: () => '100%',
    },
    {
      styleName: 'max-width',
      values: ['fit-screen'] as const,
      valueFormat: () => '100vw',
    },
    {
      styleName: 'max-width',
      values: Variables.percentages,
      valueFormat: BoxStylesFormatters.Value.fraction,
    },
    {
      styleName: 'max-width',
      values: ['auto', 'fit-content', 'max-content', 'min-content'] as const,
    },
    {
      styleName: 'max-width',
      ...percentValue,
    },
  ],
  /** The letter-spacing CSS property sets the horizontal spacing behavior between text characters. This value is added to the natural spacing between characters while rendering the text. Positive values of letter-spacing causes characters to spread farther apart, while negative values of letter-spacing bring characters closer together. */
  letterSpacing: [
    {
      styleName: 'letter-spacing',
      values: 0,
      valueFormat: BoxStylesFormatters.Value.px,
    },
  ],
  /** The line-height CSS property sets the height of a line box in horizontal writing modes. In vertical writing modes, it sets the width of a line box. It's commonly used to set the distance between lines of text. On block-level elements in horizontal writing modes, it specifies the preferred height of line boxes within the element, and on non-replaced inline elements, it specifies the height that is used to calculate line box height. */
  lineHeight: [
    {
      styleName: 'line-height',
      values: 0,
      valueFormat: BoxStylesFormatters.Value.px,
    },
    {
      styleName: 'line-height',
      values: ['font-size'] as const,
      valueFormat: () => '1',
    },
  ],
  /** The list-style CSS shorthand property allows you to set all the list style properties at once. */
  listStyle: [
    {
      styleName: 'list-style',
      values: ['square', 'inside', 'outside', 'none'] as const,
    },
  ],
  /** The margin CSS shorthand property sets the margin area on all four sides of an element. */
  m: [
    {
      values: 0,
      styleName: 'margin',
      valueFormat: BoxStylesFormatters.Value.rem,
    },
    {
      values: ['auto'] as const,
      styleName: 'margin',
    },
    {
      styleName: 'margin',
      values: Variables.percentages,
      valueFormat: BoxStylesFormatters.Value.fraction,
    },
    {
      styleName: 'margin',
      values: Variables.negativePercentages,
      valueFormat: BoxStylesFormatters.Value.fraction,
    },
    {
      ...percentValue,
      styleName: 'margin',
    },
  ],
  /** The margin-inline CSS shorthand property is a shorthand property that defines both the logical inline start and end margins of an element, which maps to physical margins depending on the element's writing mode, directionality, and text orientation. */
  mx: [
    {
      values: 0,
      styleName: 'margin-inline',
      valueFormat: BoxStylesFormatters.Value.rem,
    },
    {
      values: ['auto'] as const,
      styleName: 'margin-inline',
    },
    {
      styleName: 'margin-inline',
      values: Variables.percentages,
      valueFormat: BoxStylesFormatters.Value.fraction,
    },
    {
      styleName: 'margin-inline',
      values: Variables.negativePercentages,
      valueFormat: BoxStylesFormatters.Value.fraction,
    },
    {
      ...percentValue,
      styleName: 'margin-inline',
    },
  ],
  /** The margin-block CSS shorthand property defines the logical block start and end margins of an element, which maps to physical margins depending on the element's writing mode, directionality, and text orientation. */
  my: [
    {
      values: 0,
      styleName: 'margin-block',
      valueFormat: BoxStylesFormatters.Value.rem,
    },
    {
      values: ['auto'] as const,
      styleName: 'margin-block',
    },
    {
      styleName: 'margin-block',
      values: Variables.percentages,
      valueFormat: BoxStylesFormatters.Value.fraction,
    },
    {
      styleName: 'margin-block',
      values: Variables.negativePercentages,
      valueFormat: BoxStylesFormatters.Value.fraction,
    },
    {
      ...percentValue,
      styleName: 'margin-block',
    },
  ],
  /** The margin-top CSS property sets the margin area on the top of an element. A positive value places it farther from its neighbors, while a negative value places it closer. */
  mt: [
    {
      values: 0,
      styleName: 'margin-top',
      valueFormat: BoxStylesFormatters.Value.rem,
    },
    {
      values: ['auto'] as const,
      styleName: 'margin-top',
    },
    {
      values: Variables.percentages,
      valueFormat: BoxStylesFormatters.Value.fraction,
      styleName: 'margin-top',
    },
    {
      values: Variables.negativePercentages,
      valueFormat: BoxStylesFormatters.Value.fraction,
      styleName: 'margin-top',
    },
    {
      ...percentValue,
      styleName: 'margin-top',
    },
  ],
  /** The margin-right CSS property sets the margin area on the right side of an element. A positive value places it farther from its neighbors, while a negative value places it closer. */
  mr: [
    {
      values: 0,
      styleName: 'margin-right',
      valueFormat: BoxStylesFormatters.Value.rem,
    },
    {
      values: ['auto'] as const,
      styleName: 'margin-right',
    },
    {
      values: Variables.percentages,
      valueFormat: BoxStylesFormatters.Value.fraction,
      styleName: 'margin-right',
    },
    {
      values: Variables.negativePercentages,
      valueFormat: BoxStylesFormatters.Value.fraction,
      styleName: 'margin-right',
    },
    {
      ...percentValue,
      styleName: 'margin-right',
    },
  ],
  /** The margin-bottom CSS property sets the margin area on the bottom of an element. A positive value places it farther from its neighbors, while a negative value places it closer. */
  mb: [
    {
      values: 0,
      styleName: 'margin-bottom',
      valueFormat: BoxStylesFormatters.Value.rem,
    },
    {
      values: ['auto'] as const,
      styleName: 'margin-bottom',
    },
    {
      values: Variables.percentages,
      valueFormat: BoxStylesFormatters.Value.fraction,
      styleName: 'margin-bottom',
    },
    {
      values: Variables.negativePercentages,
      valueFormat: BoxStylesFormatters.Value.fraction,
      styleName: 'margin-bottom',
    },
    {
      ...percentValue,
      styleName: 'margin-bottom',
    },
  ],
  /** The margin-left CSS property sets the margin area on the left side of an element. A positive value places it farther from its neighbors, while a negative value places it closer. */
  ml: [
    {
      values: 0,
      styleName: 'margin-left',
      valueFormat: BoxStylesFormatters.Value.rem,
    },
    {
      values: ['auto'] as const,
      styleName: 'margin-left',
    },
    {
      values: Variables.percentages,
      valueFormat: BoxStylesFormatters.Value.fraction,
      styleName: 'margin-left',
    },
    {
      values: Variables.negativePercentages,
      valueFormat: BoxStylesFormatters.Value.fraction,
      styleName: 'margin-left',
    },
    {
      ...percentValue,
      styleName: 'margin-left',
    },
  ],
  /** The padding CSS shorthand property sets the padding area on all four sides of an element at once. */
  p: [
    {
      values: 0,
      styleName: 'padding',
      valueFormat: BoxStylesFormatters.Value.rem,
    },
    {
      values: Variables.percentages,
      valueFormat: BoxStylesFormatters.Value.fraction,
      styleName: 'padding',
    },
    {
      ...percentValue,
      styleName: 'padding',
    },
  ],
  /** The padding-inline CSS shorthand property defines the logical inline start and end padding of an element, which maps to physical padding properties depending on the element's writing mode, directionality, and text orientation. */
  px: [
    {
      values: 0,
      styleName: 'padding-inline',
      valueFormat: BoxStylesFormatters.Value.rem,
    },
    {
      values: Variables.percentages,
      valueFormat: BoxStylesFormatters.Value.fraction,
      styleName: 'padding-inline',
    },
    {
      ...percentValue,
      styleName: 'padding-inline',
    },
  ],
  /** The padding-block CSS shorthand property defines the logical block start and end padding of an element, which maps to physical padding properties depending on the element's writing mode, directionality, and text orientation. */
  py: [
    {
      values: 0,
      styleName: 'padding-block',
      valueFormat: BoxStylesFormatters.Value.rem,
    },
    {
      values: Variables.percentages,
      valueFormat: BoxStylesFormatters.Value.fraction,
      styleName: 'padding-block',
    },
    {
      ...percentValue,
      styleName: 'padding-block',
    },
  ],
  /** The padding-top CSS property sets the height of the padding area on the top of an element. */
  pt: [
    {
      values: 0,
      styleName: 'padding-top',
      valueFormat: BoxStylesFormatters.Value.rem,
    },
    {
      values: Variables.percentages,
      valueFormat: BoxStylesFormatters.Value.fraction,
      styleName: 'padding-top',
    },
    {
      ...percentValue,
      styleName: 'padding-top',
    },
  ],
  /** The padding-right CSS property sets the width of the padding area on the right of an element. */
  pr: [
    {
      values: 0,
      styleName: 'padding-right',
      valueFormat: BoxStylesFormatters.Value.rem,
    },
    {
      values: Variables.percentages,
      valueFormat: BoxStylesFormatters.Value.fraction,
      styleName: 'padding-right',
    },
    {
      ...percentValue,
      styleName: 'padding-right',
    },
  ],
  /** The padding-bottom CSS property sets the height of the padding area on the bottom of an element. */
  pb: [
    {
      values: 0,
      styleName: 'padding-bottom',
      valueFormat: BoxStylesFormatters.Value.rem,
    },
    {
      values: Variables.percentages,
      valueFormat: BoxStylesFormatters.Value.fraction,
      styleName: 'padding-bottom',
    },
    {
      ...percentValue,
      styleName: 'padding-bottom',
    },
  ],
  /** The padding-left CSS property sets the width of the padding area to the left of an element. */
  pl: [
    {
      values: 0,
      styleName: 'padding-left',
      valueFormat: BoxStylesFormatters.Value.rem,
    },
    {
      values: Variables.percentages,
      valueFormat: BoxStylesFormatters.Value.fraction,
      styleName: 'padding-left',
    },
    {
      ...percentValue,
      styleName: 'padding-left',
    },
  ],
  /** The object-fit CSS property sets how the content of a replaced element, such as an <img> or <video>, should be resized to fit its container. */
  objectFit: [
    {
      styleName: 'object-fit',
      values: ['fill', 'contain', 'cover', 'scale-down', 'none'] as const,
    },
  ],
  /** The opacity CSS property sets the opacity of an element. Opacity is the degree to which content behind an element is hidden, and is the opposite of transparency. */
  opacity: [
    {
      values: opacityValues,
    },
  ],
  /** The CSS outline-width property sets the thickness of an element's outline. An outline is a line that is drawn around an element, outside the border. A width alone is enough: the style comes with it, and `outlineStyle` — declared after this — is what changes it. */
  outline: [
    {
      // A width with no style draws nothing (`outline-style` starts at `none`), and the UA only supplies
      // a style for `:focus` — which is why a `highlighted` variant's outline was invisible while the
      // class, the rule and the tests all looked right (bug #54).
      values: 0,
      declarations: (value) => `outline-width:${BoxStylesFormatters.Value.px(value as number)};outline-style:solid`,
    },
  ],
  /** The outline-style CSS property sets the style of an element's outline. An outline is a line that is drawn around an element, outside the border. */
  outlineStyle: [
    {
      styleName: 'outline-style',
      values: ['solid', 'dashed', 'dotted', 'double', 'groove', 'ridge', 'inset', 'outset', 'none', 'hidden'] as const,
    },
  ],
  /** The outline-offset CSS property sets the amount of space between an outline and the edge or border of an element. */
  outlineOffset: [
    {
      styleName: 'outline-offset',
      values: 0,
      valueFormat: BoxStylesFormatters.Value.px,
    },
  ],
  /** The overflow CSS shorthand property sets the desired behavior when content does not fit in the element's padding box (overflows) in the horizontal and/or vertical direction. */
  overflow: [
    {
      values: ['auto', 'hidden', 'scroll', 'visible'] as const,
    },
  ],
  /** The overflow-x CSS property sets what shows when content overflows a block-level element's left and right edges. This may be nothing, a scroll bar, or the overflow content. This property may also be set by using the overflow shorthand property. */
  overflowX: [
    {
      styleName: 'overflow-x',
      values: ['auto', 'hidden', 'scroll', 'visible'] as const,
    },
  ],
  /** The overflow-y CSS property sets what shows when content overflows a block-level element's top and bottom edges. This may be nothing, a scroll bar, or the overflow content. This property may also be set by using the overflow shorthand property. */
  overflowY: [
    {
      styleName: 'overflow-y',
      values: ['auto', 'hidden', 'scroll', 'visible'] as const,
    },
  ],
  /** The pointer-events CSS property sets under what circumstances (if any) a particular graphic element can become the target of pointer events. */
  pointerEvents: [
    {
      styleName: 'pointer-events',
      values: ['none', 'auto', 'all'] as const,
    },
  ],
  /** The resize CSS property sets whether an element is resizable, and if so, in which directions. */
  resize: [
    {
      values: ['none', 'both', 'horizontal', 'vertical', 'block', 'inline'] as const,
    },
  ],
  /** The rotate CSS property allows you to specify rotation transforms individually and independently of the transform property. This maps better to typical user interface usage, and saves having to remember the exact order of transform functions to specify in the transform property. */
  rotate: [
    {
      values: [0, 45, 90, 135, 180, 270, 360, -45, -90, -135, -180, -270] as const,
      valueFormat: (value: number) => `${value}deg`,
    },
  ],
  flip: [
    {
      styleName: 'scale',
      values: ['xAxis', 'yAxis'] as const,
      valueFormat: (value: string) => (value === 'xAxis' ? '-1 1' : '1 -1'),
    },
  ],
  /** The scale CSS property lets you specify scale transforms individually and independently of the transform property: `scale={1.05}` is 105% in both axes. Declared after `flip`, which writes the same property — use one or the other, not both. */
  scale: [
    {
      values: 0,
    },
  ],
  /** The text-align CSS property sets the horizontal alignment of the inline-level content inside a block element or table-cell box. This means it works like vertical-align but in the horizontal direction. */
  textAlign: [
    {
      styleName: 'text-align',
      values: ['left', 'right', 'center', 'justify'] as const,
    },
  ],
  /** The text-decoration shorthand CSS property sets the appearance of decorative lines on text. It is a shorthand for text-decoration-line, text-decoration-color, text-decoration-style, and the newer text-decoration-thickness property. */
  textDecoration: [
    {
      styleName: 'text-decoration',
      values: ['none', 'underline', 'overline', 'line-through'] as const,
    },
  ],
  /** The text-overflow CSS property sets how hidden overflow content is signaled to users. It can be clipped, display an ellipsis ('…'), or display a custom string. */
  textOverflow: [
    {
      styleName: 'text-overflow',
      values: ['clip', 'ellipsis'] as const,
    },
  ],
  /** The text-transform CSS property specifies how to capitalize an element's text. It can be used to make text appear in all-uppercase or all-lowercase, or with each word capitalized. It also can help improve legibility for ruby. */
  textTransform: [
    {
      styleName: 'text-transform',
      values: ['none', 'capitalize', 'lowercase', 'uppercase'] as const,
    },
  ],
  /** The text-wrap CSS shorthand property controls how text inside an element is wrapped. The different values provide: */
  textWrap: [
    {
      styleName: 'text-wrap',
      values: ['wrap', 'nowrap', 'balance', 'pretty'] as const,
    },
  ],
  /** What a transition applies to: `all` (what the base class already does), `none`, or one of the property groups — `colors`, `opacity`, `shadow`, `transform`, `size`, `filter`. */
  transition: [
    {
      styleName: 'transition-property',
      values: ['none', 'all', ...Animations.propertyGroupNames] as const,
      valueFormat: (value: string) => Animations.propertyGroups[value as Animations.PropertyGroup] ?? value,
    },
  ],
  /**
   * Whether the properties that cannot be interpolated transition at all: `display`, `overlay`,
   * `content-visibility`. `allow-discrete` flips them at the *end* of the transition instead of the start,
   * which is what keeps an element in the DOM long enough to animate out of it.
   */
  transitionBehavior: [
    {
      styleName: 'transition-behavior',
      values: ['normal', 'allow-discrete'] as const,
    },
  ],
  /** The transition-delay CSS property specifies the duration to wait before starting a property's transition effect when its value changes. Milliseconds. */
  transitionDelay: [
    {
      styleName: 'transition-delay',
      values: 0,
      valueFormat: BoxStylesFormatters.Value.ms,
    },
  ],
  /**
   * How long a transition takes. Milliseconds, like every other time here — or a spring name, which is
   * that spring's settling time in `--transitionTime` units, so a spring stops under reduced motion.
   */
  transitionDuration: [
    {
      styleName: 'transition-duration',
      values: 0,
      valueFormat: BoxStylesFormatters.Value.ms,
    },
    {
      styleName: 'transition-duration',
      values: [...Animations.springNames] as const,
      valueFormat: (value: string) => Animations.springDuration(value as Animations.SpringName),
    },
  ],
  /**
   * How a transition gets from one value to the other: a keyword, one of the four sampled springs
   * (`spring`, `spring-gentle`, `spring-bouncy`, `spring-snappy`), or a curve — `cubic-bezier()`,
   * `steps()` and `linear()` are values. A spring's other half is `transitionDuration`, which takes the
   * same four names.
   */
  transitionTimingFunction: [
    {
      styleName: 'transition-timing-function',
      values: ['linear', 'ease', 'ease-in', 'ease-in-out', 'ease-out', 'step-start', 'step-end'] as const,
    },
    {
      values: [...Animations.springNames] as const,
      styleName: 'transition-timing-function',
      declarations: (value) =>
        Animations.easingDeclarations('transition-timing-function', Animations.springEasing(value as Animations.SpringName)),
    },
    {
      values: Animations.timingFunction,
      match: Animations.isTimingFunction,
      styleName: 'transition-timing-function',
      declarations: (value) => Animations.easingDeclarations('transition-timing-function', value as string),
    },
  ],
  /** The user-select CSS property controls whether the user can select text. This doesn't have any effect on content loaded as part of a browser's user interface (its chrome), except in textboxes. */
  userSelect: [
    {
      styleName: 'user-select',
      values: ['none', 'auto', 'text', 'all'] as const,
    },
  ],
  /** The visibility CSS property shows or hides an element without changing the layout of a document. The property can also hide rows or columns in a <table>. */
  visibility: [
    {
      styleName: 'visibility',
      values: ['visible', 'hidden', 'collapse'] as const,
    },
  ],
  /** The white-space CSS property sets how white space inside an element is handled. */
  whiteSpace: [
    {
      styleName: 'white-space',
      values: ['break-spaces', 'normal', 'nowrap', 'pre', 'pre-line', 'pre-wrap'] as const,
    },
  ],
  /** The z-index CSS property sets the z-order of a positioned element and its descendants or flex and grid items. Overlapping elements with a larger z-index cover those with a smaller one. */
  zIndex: [
    {
      styleName: 'z-index',
      values: [1, 2, 3, 4, 5, 10, 11, 12, 13, 14, 15, 100, 101, 102, 103, 104, 105, 1000, 1001, 1002, 1003, 1004, 1005] as const,
    },
  ],
  /** The grid-template-columns CSS property defines the line names and track sizing functions of the grid columns. */
  gridTemplateColumns: [
    {
      styleName: 'grid-template-columns',
      values: 0,
      valueFormat: (value: number) => `repeat(${value},minmax(0,1fr))`,
    },
    {
      styleName: 'grid-template-columns',
      values: ['subgrid'] as const,
    },
  ],
  /** The grid-template-rows CSS property defines the line names and track sizing functions of the grid rows. */
  gridTemplateRows: [
    {
      styleName: 'grid-template-rows',
      values: 0,
      valueFormat: (value: number) => `repeat(${value},minmax(0,1fr))`,
    },
    {
      styleName: 'grid-template-rows',
      values: ['subgrid'] as const,
    },
  ],
  /** The grid-column CSS shorthand property specifies a grid item's size and location within a grid column by contributing a line, a span, or nothing (automatic) to its grid placement, thereby specifying the inline-start and inline-end edge of its grid area. */
  gridColumn: [
    {
      styleName: 'grid-column',
      values: 0,
      valueFormat: (value: number) => `span ${value}/span ${value}`,
    },
    {
      styleName: 'grid-column',
      values: ['full-row'] as const,
      valueFormat: () => '1/-1',
    },
  ],
  /** The grid-column-start CSS property specifies a grid item's start position within the grid column by contributing a line, a span, or nothing (automatic) to its grid placement. This start position defines the block-start edge of the grid area. */
  gridColumnStart: [
    {
      styleName: 'grid-column-start',
      values: 0,
    },
  ],
  /** The grid-column-end CSS property specifies a grid item's end position within the grid column by contributing a line, a span, or nothing (automatic) to its grid placement, thereby specifying the block-end edge of its grid area. */
  gridColumnEnd: [
    {
      styleName: 'grid-column-end',
      values: 0,
    },
  ],
  /** The grid-row CSS shorthand property specifies a grid item's size and location within a grid row by contributing a line, a span, or nothing (automatic) to its grid placement, thereby specifying the inline-start and inline-end edge of its grid area. */
  gridRow: [
    {
      styleName: 'grid-row',
      values: 0,
      valueFormat: (value: number) => `span ${value}/span ${value}`,
    },
    {
      styleName: 'grid-row',
      values: ['full-column'] as const,
      valueFormat: () => '1/-1',
    },
  ],
  /** The grid-row-start CSS property specifies a grid item's start position within the grid row by contributing a line, a span, or nothing (automatic) to its grid placement, thereby specifying the inline-start edge of its grid area. */
  gridRowStart: [
    {
      styleName: 'grid-row-start',
      values: 0,
    },
  ],
  /** The grid-row-end CSS property specifies a grid item's end position within the grid row by contributing a line, a span, or nothing (automatic) to its grid placement, thereby specifying the inline-end edge of its grid area. */
  gridRowEnd: [
    {
      styleName: 'grid-row-end',
      values: 0,
    },
  ],
  /** The color CSS property sets the foreground color value of an element's text and text decorations, and sets the currentcolor value.  */
  color: [
    {
      values: Variables.colorValues,
      valueFormat: (value, getVariableValue) => getVariableValue(value),
    },
    {
      // Every colour prop takes the system colours too, unformatted: they are keywords rather than
      // tokens, and they are the only palette a forced-colors mode keeps (bug #65).
      values: Variables.systemColorValues,
    },
  ],
  /** The background-color CSS property sets the background color of an element. */
  bgColor: [
    {
      values: Variables.colorValues,
      valueFormat: (value, getVariableValue) => getVariableValue(value),
      styleName: 'background-color',
    },
    {
      values: Variables.systemColorValues,
      styleName: 'background-color',
    },
  ],
  /** The border-color shorthand CSS property sets the color of an element's border. */
  borderColor: [
    {
      values: Variables.colorValues,
      valueFormat: (value, getVariableValue) => getVariableValue(value),
      styleName: 'border-color',
    },
    {
      values: Variables.systemColorValues,
      styleName: 'border-color',
    },
  ],
  /** The outline-color CSS property sets the color of an element's outline. */
  outlineColor: [
    {
      values: Variables.colorValues,
      valueFormat: (value, getVariableValue) => getVariableValue(value),
      styleName: 'outline-color',
    },
    {
      values: Variables.systemColorValues,
      styleName: 'outline-color',
    },
  ],
  /** The fill CSS property defines how SVG text content and the interior canvas of SVG shapes are filled or painted. If present, it overrides the element's fill attribute. Takes a colour token, a paint server the document defines (`fill="url(#sky)"` — a `<LinearGradient>` or a pattern) or a variable somebody else declared (`fill="var(--chart-1)"`). */
  fill: [
    {
      values: Variables.colorValues,
      valueFormat: (value, getVariableValue) => getVariableValue(value),
    },
    {
      values: Variables.systemColorValues,
    },
    referenceValues,
  ],
  /** The fill-opacity CSS property defines the opacity of the paint applied to the interior of an SVG shape or to SVG text. */
  fillOpacity: [
    {
      values: opacityValues,
      styleName: 'fill-opacity',
    },
  ],
  /** The fill-rule CSS property defines which parts of a self-intersecting SVG shape count as inside it, and are therefore filled. */
  fillRule: [
    {
      values: ['nonzero', 'evenodd'] as const,
      styleName: 'fill-rule',
    },
  ],
  /** The stroke CSS property defines the color or SVG paint server used to draw an element's stroke. Takes a colour token, `stroke="url(#sky)"` for a paint server the document defines, or `stroke="var(--chart-1)"` for a variable somebody else declared. */
  stroke: [
    {
      values: Variables.colorValues,
      valueFormat: (value, getVariableValue) => getVariableValue(value),
    },
    {
      values: Variables.systemColorValues,
    },
    referenceValues,
  ],
  /** The stroke-opacity CSS property defines the opacity of the paint applied to an SVG element's stroke. */
  strokeOpacity: [
    {
      values: opacityValues,
      styleName: 'stroke-opacity',
    },
  ],
  /** The stroke-width CSS property sets the width of an SVG element's stroke, in user units — `strokeWidth={2}` is `stroke-width: 2`, no divider. */
  strokeWidth: [
    {
      values: 0,
      styleName: 'stroke-width',
    },
  ],
  /** The stroke-linecap CSS property defines the shape drawn at the two ends of an open SVG subpath. */
  strokeLinecap: [
    {
      values: ['butt', 'round', 'square'] as const,
      styleName: 'stroke-linecap',
    },
  ],
  /** The stroke-linejoin CSS property defines the shape drawn where two segments of an SVG path meet. */
  strokeLinejoin: [
    {
      values: ['miter', 'round', 'bevel'] as const,
      styleName: 'stroke-linejoin',
    },
  ],
  /** The stroke-miterlimit CSS property sets how far a miter join may extend before it is cut back to a bevel. Values below 1 are invalid. */
  strokeMiterlimit: [
    {
      values: 0,
      styleName: 'stroke-miterlimit',
    },
  ],
  /** The stroke-dasharray CSS property turns an SVG stroke into dashes: a single number is the dash and the gap alike, a string is the full pattern (`'8 4'`). Lengths are user units. */
  strokeDasharray: [
    {
      values: 0,
      styleName: 'stroke-dasharray',
    },
    {
      values: '' as string,
      // The one string prop that is a *list* rather than a token, so it cannot be matched by `typeof`
      // alone either: dashes and gaps, numbers or percentages, and nothing that could end the rule.
      match: (value) => typeof value === 'string' && /^\s*[\d.]+%?(\s*[\s,]\s*[\d.]+%?)*\s*$/.test(value),
      styleName: 'stroke-dasharray',
    },
  ],
  /** The stroke-dashoffset CSS property moves the dash pattern along the path — the property a path-drawing animation transitions. A percentage is of the path's own length. */
  strokeDashoffset: [
    {
      values: 0,
      styleName: 'stroke-dashoffset',
    },
    {
      ...percentValue,
      styleName: 'stroke-dashoffset',
    },
  ],
  /** The paint-order CSS property sets what is painted first. `paintOrder="stroke"` puts the stroke behind the fill, which is how outlined SVG text stays legible. */
  paintOrder: [
    {
      values: ['normal', 'fill', 'stroke', 'markers'] as const,
      styleName: 'paint-order',
    },
  ],
  /**
   * How an SVG element's stroke reacts to the transforms above it: `non-scaling-stroke` keeps a hairline
   * one pixel wide at any scale. Not inherited, so its rule targets the element *and* its descendants —
   * the only way the prop can mean anything on an `<svg>`.
   */
  vectorEffect: [
    {
      values: ['none', 'non-scaling-stroke'] as const,
      styleName: 'vector-effect',
      selector: (className, pseudoClass) => `${className}${pseudoClass},${className}${pseudoClass} *`,
    },
  ],
  /** The shape-rendering CSS property tells the renderer what to trade away when drawing an SVG shape — `crispEdges` turns off anti-aliasing, which is what pixel-exact gridlines want. */
  shapeRendering: [
    {
      values: ['auto', 'optimizeSpeed', 'crispEdges', 'geometricPrecision'] as const,
      styleName: 'shape-rendering',
    },
  ],
  /**
   * Which part of SVG text sits on its `x`: `middle` centres an axis label under a tick. Inherited, so a
   * value on the `<svg>` is the default for every label in it.
   */
  textAnchor: [
    {
      values: ['start', 'middle', 'end'] as const,
      styleName: 'text-anchor',
    },
  ],
  /**
   * Which baseline of SVG text sits on its `y`: `central` centres a number inside a gauge. Not inherited,
   * so like `vectorEffect` its rule names the element *and* its descendants.
   */
  dominantBaseline: [
    {
      values: ['auto', 'text-bottom', 'alphabetic', 'ideographic', 'middle', 'central', 'mathematical', 'hanging', 'text-top'] as const,
      styleName: 'dominant-baseline',
      selector: (className, pseudoClass) => `${className}${pseudoClass},${className}${pseudoClass} *`,
    },
  ],
  /**
   * The centre of a `<circle>` or `<ellipse>`, horizontally, in user units. Real CSS, so unlike the
   * attribute it transitions — moving a point on hover is one prop and no JavaScript.
   */
  cx: [
    {
      values: 0,
    },
    {
      ...percentValue,
    },
  ],
  /** The cy CSS property positions the centre of a `<circle>` or an `<ellipse>` vertically, in user units. Transitions like `cx`. */
  cy: [
    {
      values: 0,
    },
    {
      ...percentValue,
    },
  ],
  /** The r CSS property sets the radius of a `<circle>`, in user units. Transition it and the circle grows; a percentage is of the viewport's diagonal. */
  r: [
    {
      values: 0,
    },
    {
      ...percentValue,
    },
  ],
  /**
   * The horizontal radius of an `<ellipse>` or corner radius of a `<rect>` — `borderRadius` for SVG, in
   * user units rather than on the spacing scale. `auto` takes the radius from `ry`.
   */
  rx: [
    {
      values: 0,
    },
    {
      values: ['auto'] as const,
    },
    {
      ...percentValue,
    },
  ],
  /** The ry CSS property sets the vertical radius of an `<ellipse>` or the vertical corner radius of a `<rect>`, in user units. `auto` takes it from `rx`. */
  ry: [
    {
      values: 0,
    },
    {
      values: ['auto'] as const,
    },
    {
      ...percentValue,
    },
  ],
  /**
   * Positions a `<rect>`, `<image>`, `<use>`, `<foreignObject>` or nested `<svg>` horizontally, in user
   * units. Not `<text>`, whose `x` takes a list of positions and stays an attribute — pass it in `props`.
   */
  x: [
    {
      values: 0,
    },
    {
      ...percentValue,
    },
  ],
  /** The y CSS property positions a `<rect>`, `<image>`, `<use>`, `<foreignObject>` or a nested `<svg>` vertically, in user units. Not for `<text>` — see `x`. */
  y: [
    {
      values: 0,
    },
    {
      ...percentValue,
    },
  ],
  /** The background-image CSS property sets one or more background images on an element. */
  bgImage: [
    {
      values: Variables.bgImageValues,
      valueFormat: (value, getVariableValue) => getVariableValue(value),
      styleName: 'background-image',
    },
  ],
  /** The box-shadow CSS property adds shadow effects around an element's frame */
  shadow: [
    {
      values: Variables.shadowValues,
      valueFormat: (value, getVariableValue) => getVariableValue(value),
      styleName: 'box-shadow',
    },
  ],
  /** Moves an element horizontally on the 2D plane, on the ÷4 spacing scale, as a fraction of its own width (`'1/2'`) or as a percentage. Composes with `translateY`. */
  translateX: [
    {
      values: 0,
      declarations: translate('X', (value) => BoxStylesFormatters.Value.rem(value as number)),
    },
    {
      values: Variables.percentages,
      declarations: translate('X', (value) => BoxStylesFormatters.Value.fraction(value as string)),
    },
    {
      values: Variables.negativePercentages,
      declarations: translate('X', (value) => BoxStylesFormatters.Value.fraction(value as string)),
    },
    {
      ...percentValue,
      declarations: translate('X', String),
    },
  ],
  /** Moves an element vertically on the 2D plane, on the ÷4 spacing scale, as a fraction of its own height (`'1/2'`) or as a percentage. Composes with `translateX`. */
  translateY: [
    {
      values: 0,
      declarations: translate('Y', (value) => BoxStylesFormatters.Value.rem(value as number)),
    },
    {
      values: Variables.percentages,
      declarations: translate('Y', (value) => BoxStylesFormatters.Value.fraction(value as string)),
    },
    {
      values: Variables.negativePercentages,
      declarations: translate('Y', (value) => BoxStylesFormatters.Value.fraction(value as string)),
    },
    {
      ...percentValue,
      declarations: translate('Y', String),
    },
  ],
  /** The content CSS property replaces content with a generated value. It can be used to define what is rendered inside an element or pseudo-element. */
  content: [
    {
      values: ['empty'] as const,
      valueFormat: () => {
        return "''";
      },
    },
  ],
  backdropFilter: [
    {
      values: ['none', 'blur(12px)', 'blur(8px)', 'blur(4px)'] as const,
      styleName: 'backdrop-filter',
    },
  ],
  scrollbarWidth: [
    {
      values: ['auto', 'thin', 'none'] as const,
      styleName: 'scrollbar-width',
    },
  ],
  /** The scrollbar-color CSS property sets the color of the scrollbar thumb and track. The value pair is [thumbColor, trackColor]. */
  scrollbarColor: [
    {
      tuple: true,
      values: [Variables.colorValues, Variables.colorValues] as const,
      styleName: 'scrollbar-color',
      valueFormat: (value, getVariableValue) => `${getVariableValue(value[0] as string)} ${getVariableValue(value[1] as string)}`,
    },
  ],
  /**
   * CSS custom properties on this element, inherited by everything inside it: `vars={{ 'color-x': 'sky-500' }}`
   * emits `--color-x: var(--sky-500)`. The one prop whose declaration *names* come from its value, which is
   * what makes it the answer for markup this library does not render — a Recharts `<Line>`, a third-party
   * widget. A colour token becomes the variable behind it, anything else is written out as it stands.
   */
  vars: [
    {
      values: {} as Variables.CustomProperties,
      match: Variables.isCustomProperties,
      declarations: Variables.customProperties as NonNullable<BoxStyle['declarations']>,
    },
  ],
} satisfies Record<string, BoxStyle[]>;

export const pseudo1 = {
  hover: ':hover',
  focus: ':focus-within',
  // What `focus` cannot express: the ring a keyboard user needs and a mouse user does not. A cell
  // in a grid, a card, anything focused programmatically — `:focus-within` lights all of them up on
  // a click, and the browser already knows which presses deserve a ring.
  focusVisible: ':focus-visible',
  hasFocus: ':has(:focus)',
  active: ':active',
  valid: ':user-valid',
  hasValid: ':has(:valid)',
  invalid: ':user-invalid',
  hasInvalid: ':has(:user-invalid)',
  optional: ':optional',
  hasChecked: ':has(:checked)',
  hasRequired: ':has(:required)',
  hasDisabled: ':has([disabled])',
  before: '::before',
  after: '::after',
  placeholderStyles: '::placeholder',
};

export const pseudo2 = {
  indeterminate: ':indeterminate',
  checked: ':checked',
  required: ':required',
  disabled: '[disabled]',
  selected: '[aria-selected="true"]',
};

const theme = {
  theme: '',
};

export const pseudoClasses = { ...pseudo1, ...pseudo2, ...theme };

/**
 * The three that are pseudo-*elements*, which have to come last in a compound selector: assembled in
 * declaration order, `checked: { before: {…} }` produced the invalid `::before:checked` and the browser
 * dropped the whole rule.
 */
export const pseudoElements = ['before', 'after', 'placeholderStyles'] as const satisfies readonly (keyof typeof pseudo1)[];

function isPseudoElement(key: keyof typeof pseudoClasses): boolean {
  return (pseudoElements as readonly string[]).includes(key);
}

/** A set of pseudo keys as one compound selector suffix, with any pseudo-element last. */
export function pseudoSelector(keys: readonly (keyof typeof pseudoClasses)[]): string {
  const elements = keys.filter(isPseudoElement);
  const ordered = elements.length === 0 ? keys : [...keys.filter((key) => !isPseudoElement(key)), ...elements];

  return ordered.map((key) => pseudoClasses[key]).join('');
}
export const pseudoClassesWeight = Object.entries(pseudoClasses).reduce(
  (acc, [key], index) => {
    acc[key as keyof typeof pseudoClasses] = Math.pow(2, index);

    return acc;
  },
  {} as Record<keyof typeof pseudoClasses, number>,
);

// The keys in declaration order — the order a weight decodes back into, so a class name built from one
// reads the way it always has. A 32-bit mask, so this map cannot grow past 31 keys.
const pseudoClassKeys = Object.keys(pseudoClasses) as (keyof typeof pseudoClasses)[];

const pseudoClassesCache = new Map<number, (keyof typeof pseudoClasses)[]>();

/**
 * The pseudo keys one weight stands for, decoded from the bitmask and kept — a page asks for the same
 * few combinations over and over. This used to be a table of *every* subset: 2²² arrays, 1.5 GB of heap
 * and 1.4 s, built at import time, whether a page styled anything or not.
 */
export function pseudoClassesOfWeight(weight: number): (keyof typeof pseudoClasses)[] {
  const cached = pseudoClassesCache.get(weight);
  if (cached) return cached;

  const keys = pseudoClassKeys.filter((key) => weight & pseudoClassesWeight[key]);
  pseudoClassesCache.set(weight, keys);

  return keys;
}

export const pseudoGroupClasses = {
  hoverGroup: 'hover',
  focusGroup: 'focus',
  activeGroup: 'active',
  disabledGroup: 'disabled',
  selectedGroup: 'selected',
} satisfies { [key: string]: keyof typeof pseudoClasses };

export const themeGroupClass = {
  theme: 'theme',
} satisfies { [key: string]: keyof typeof pseudoClasses };

/**
 * The one nesting key that is neither a selector nor a media query: `@starting-style` holds the values a
 * property had *before* the element's first style change, which is the whole difference between an element
 * appearing already finished and one transitioning in. Wraps the rule rather than joining the selector, so
 * it composes with every other kind of nesting.
 */
export const startingStyleKey = {
  /** What these props start from the first time this element is styled — an entrance, with no JavaScript. */
  startingStyle: '@starting-style',
};

export const breakpoints = {
  /** Styles applied for small screens and larger. >= 640 */
  sm: 640,
  /** Styles applied for medium screens and larger. >= 768 */
  md: 768,
  /** Styles applied for large screens and larger. >= 1024 */
  lg: 1024,
  /** Styles applied for extra-large screens and larger. >= 1280 */
  xl: 1280,
  /** Styles applied for 2x extra-large screens and larger. >= 1536 */
  xxl: 1536,
};

/**
 * The preferences a user sets once in their OS, shaped exactly like a breakpoint and ranked *after* every
 * breakpoint: a screen wide enough for `xxl` is not a reason to override a statement about the reader.
 * `motionReduce` has a default behind it — the base rule transitions on `var(--transitionTime)`, which
 * `prefers-reduced-motion` zeroes, so declaring it is how you opt back *in*.
 */
export const mediaFeatures = {
  /** Styles applied when the user asked for less motion. `@media (prefers-reduced-motion: reduce)` */
  motionReduce: '(prefers-reduced-motion: reduce)',
  /** Styles applied in a forced-colors mode, e.g. Windows High Contrast. `@media (forced-colors: active)` */
  forcedColors: '(forced-colors: active)',
  /** Styles applied when the user asked for more contrast. `@media (prefers-contrast: more)` */
  contrastMore: '(prefers-contrast: more)',
};

/**
 * Every key that puts a rule in an `@media` block, in cascade order with `normal` (no query) first. The
 * engine ranks rules by this and names their cascade layer from it.
 */
export const mediaKeys: readonly string[] = ['normal', ...Object.keys(breakpoints), ...Object.keys(mediaFeatures)];

/** The `@media` condition one media key stands for, or null for `normal`, which needs no query. */
export function mediaCondition(key: string): string | null {
  if (key in breakpoints) return `(min-width: ${breakpoints[key as keyof typeof breakpoints]}px)`;

  return mediaFeatures[key as keyof typeof mediaFeatures] ?? null;
}
