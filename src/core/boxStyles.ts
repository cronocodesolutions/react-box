import { BoxStylesFormatters } from './boxStylesFormatters';
import { BoxStyle } from './coreTypes';
import Variables from './variables';

export const cssStyles = {
  /** The appearance CSS property is used to display UI elements with platform-specific styling, based on the operating system's theme. */
  appearance: [
    {
      values: ['none', 'auto', 'menulist-button', 'textfield', 'button', 'checkbox'] as const,
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
  ],
  /** The right CSS property participates in specifying the horizontal position of a positioned element. This inset property has no effect on non-positioned elements. */
  right: [
    {
      values: 0,
      valueFormat: BoxStylesFormatters.Value.rem,
    },
  ],
  /** The bottom CSS property participates in setting the vertical position of a positioned element. This inset property has no effect on non-positioned elements. */
  bottom: [
    {
      values: 0,
      valueFormat: BoxStylesFormatters.Value.rem,
    },
  ],
  /** The left CSS property participates in specifying the horizontal position of a positioned element. This inset property has no effect on non-positioned elements. */
  left: [
    {
      values: 0,
      valueFormat: BoxStylesFormatters.Value.rem,
    },
  ],
  /** The inset CSS property is a shorthand that corresponds to the top, right, bottom, and/or left properties. It has the same multi-value syntax of the margin shorthand. */
  inset: [
    {
      values: 0,
      valueFormat: BoxStylesFormatters.Value.rem,
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
      values: ['none', 'block', 'inline-block', 'flex', 'inline-flex', 'grid', 'inline-grid', 'contents'] as const,
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
      valueFormat: BoxStylesFormatters.Value.px,
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
  ],
  /** The row-gap CSS property sets the size of the gap (gutter) between an element's rows. */
  rowGap: [
    {
      styleName: 'row-gap',
      values: 0,
      valueFormat: BoxStylesFormatters.Value.rem,
    },
  ],
  /** The column-gap CSS property sets the size of the gap (gutter) between an element's columns. */
  columnGap: [
    {
      styleName: 'column-gap',
      values: 0,
      valueFormat: BoxStylesFormatters.Value.rem,
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
    { values: 0, valueFormat: (value: number) => `${value / 4}rem` },
    {
      values: ['fit'] as const,
      valueFormat: () => '100%',
    },
    {
      values: ['fit-screen'] as const,
      valueFormat: () => '100vh',
    },
    {
      values: [
        '1/2',
        '1/3',
        '2/3',
        '1/4',
        '2/4',
        '3/4',
        '1/5',
        '2/5',
        '3/5',
        '4/5',
        '1/6',
        '2/6',
        '3/6',
        '4/6',
        '5/6',
        '1/12',
        '2/12',
        '3/12',
        '4/12',
        '5/12',
        '6/12',
        '7/12',
        '8/12',
        '9/12',
        '10/12',
        '11/12',
      ] as const,
      valueFormat: (value: string) => {
        const [a, b] = value.split('/');
        return `${(+a / +b) * 100}%`;
      },
    },
    {
      values: ['auto', 'fit-content', 'max-content', 'min-content'] as const,
    },
  ],
  /** The min-height CSS property sets the minimum height of an element. It prevents the used value of the height property from becoming smaller than the value specified for min-height. */
  minHeight: [
    { styleName: 'min-height', values: 0, valueFormat: (value: number) => `${value / 4}rem` },
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
      values: [
        '1/2',
        '1/3',
        '2/3',
        '1/4',
        '2/4',
        '3/4',
        '1/5',
        '2/5',
        '3/5',
        '4/5',
        '1/6',
        '2/6',
        '3/6',
        '4/6',
        '5/6',
        '1/12',
        '2/12',
        '3/12',
        '4/12',
        '5/12',
        '6/12',
        '7/12',
        '8/12',
        '9/12',
        '10/12',
        '11/12',
      ] as const,
      valueFormat: (value: string) => {
        const [a, b] = value.split('/');
        return `${(+a / +b) * 100}%`;
      },
    },
    {
      styleName: 'min-height',
      values: ['auto', 'fit-content', 'max-content', 'min-content'] as const,
    },
  ],
  /** The max-height CSS property sets the maximum height of an element. It prevents the used value of the height property from becoming larger than the value specified for max-height. */
  maxHeight: [
    { styleName: 'max-height', values: 0, valueFormat: (value: number) => `${value / 4}rem` },
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
      values: [
        '1/2',
        '1/3',
        '2/3',
        '1/4',
        '2/4',
        '3/4',
        '1/5',
        '2/5',
        '3/5',
        '4/5',
        '1/6',
        '2/6',
        '3/6',
        '4/6',
        '5/6',
        '1/12',
        '2/12',
        '3/12',
        '4/12',
        '5/12',
        '6/12',
        '7/12',
        '8/12',
        '9/12',
        '10/12',
        '11/12',
      ] as const,
      valueFormat: (value: string) => {
        const [a, b] = value.split('/');
        return `${(+a / +b) * 100}%`;
      },
    },
    {
      styleName: 'max-height',
      values: ['auto', 'fit-content', 'max-content', 'min-content'] as const,
    },
  ],
  /** The width CSS property sets an element's width. By default, it sets the width of the content area, but if box-sizing is set to border-box, it sets the width of the border area. */
  width: [
    { values: 0, valueFormat: (value: number) => `${value / 4}rem` },
    {
      values: ['fit'] as const,
      valueFormat: () => '100%',
    },
    {
      values: ['fit-screen'] as const,
      valueFormat: () => '100vw',
    },
    {
      values: [
        '1/2',
        '1/3',
        '2/3',
        '1/4',
        '2/4',
        '3/4',
        '1/5',
        '2/5',
        '3/5',
        '4/5',
        '1/6',
        '2/6',
        '3/6',
        '4/6',
        '5/6',
        '1/12',
        '2/12',
        '3/12',
        '4/12',
        '5/12',
        '6/12',
        '7/12',
        '8/12',
        '9/12',
        '10/12',
        '11/12',
      ] as const,
      valueFormat: (value: string) => {
        const [a, b] = value.split('/');
        return `${(+a / +b) * 100}%`;
      },
    },
    {
      values: ['auto', 'fit-content', 'max-content', 'min-content'] as const,
    },
  ],
  /** The min-width CSS property sets the minimum width of an element. It prevents the used value of the width property from becoming smaller than the value specified for min-width. */
  minWidth: [
    { styleName: 'min-width', values: 0, valueFormat: (value: number) => `${value / 4}rem` },
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
      values: [
        '1/2',
        '1/3',
        '2/3',
        '1/4',
        '2/4',
        '3/4',
        '1/5',
        '2/5',
        '3/5',
        '4/5',
        '1/6',
        '2/6',
        '3/6',
        '4/6',
        '5/6',
        '1/12',
        '2/12',
        '3/12',
        '4/12',
        '5/12',
        '6/12',
        '7/12',
        '8/12',
        '9/12',
        '10/12',
        '11/12',
      ] as const,
      valueFormat: (value: string) => {
        const [a, b] = value.split('/');
        return `${(+a / +b) * 100}%`;
      },
    },
    {
      styleName: 'min-width',
      values: ['auto', 'fit-content', 'max-content', 'min-content'] as const,
    },
  ],
  /** The max-width CSS property sets the maximum width of an element. It prevents the used value of the width property from becoming larger than the value specified by max-width. */
  maxWidth: [
    { styleName: 'max-width', values: 0, valueFormat: (value: number) => `${value / 4}rem` },
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
      values: [
        '1/2',
        '1/3',
        '2/3',
        '1/4',
        '2/4',
        '3/4',
        '1/5',
        '2/5',
        '3/5',
        '4/5',
        '1/6',
        '2/6',
        '3/6',
        '4/6',
        '5/6',
        '1/12',
        '2/12',
        '3/12',
        '4/12',
        '5/12',
        '6/12',
        '7/12',
        '8/12',
        '9/12',
        '10/12',
        '11/12',
      ] as const,
      valueFormat: (value: string) => {
        const [a, b] = value.split('/');
        return `${(+a / +b) * 100}%`;
      },
    },
    {
      styleName: 'max-width',
      values: ['auto', 'fit-content', 'max-content', 'min-content'] as const,
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
      valueFormat: (value: string) => '1',
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
  ],
  /** The padding CSS shorthand property sets the padding area on all four sides of an element at once. */
  p: [
    {
      values: 0,
      styleName: 'padding',
      valueFormat: BoxStylesFormatters.Value.rem,
    },
  ],
  /** The padding-inline CSS shorthand property defines the logical inline start and end padding of an element, which maps to physical padding properties depending on the element's writing mode, directionality, and text orientation. */
  px: [
    {
      values: 0,
      styleName: 'padding-inline',
      valueFormat: BoxStylesFormatters.Value.rem,
    },
  ],
  /** The padding-block CSS shorthand property defines the logical block start and end padding of an element, which maps to physical padding properties depending on the element's writing mode, directionality, and text orientation. */
  py: [
    {
      values: 0,
      styleName: 'padding-block',
      valueFormat: BoxStylesFormatters.Value.rem,
    },
  ],
  /** The padding-top CSS property sets the height of the padding area on the top of an element. */
  pt: [
    {
      values: 0,
      styleName: 'padding-top',
      valueFormat: BoxStylesFormatters.Value.rem,
    },
  ],
  /** The padding-right CSS property sets the width of the padding area on the right of an element. */
  pr: [
    {
      values: 0,
      styleName: 'padding-right',
      valueFormat: BoxStylesFormatters.Value.rem,
    },
  ],
  /** The padding-bottom CSS property sets the height of the padding area on the bottom of an element. */
  pb: [
    {
      values: 0,
      styleName: 'padding-bottom',
      valueFormat: BoxStylesFormatters.Value.rem,
    },
  ],
  /** The padding-left CSS property sets the width of the padding area to the left of an element. */
  pl: [
    {
      values: 0,
      styleName: 'padding-left',
      valueFormat: BoxStylesFormatters.Value.rem,
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
      values: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1] as const,
    },
  ],
  /** The CSS outline-width property sets the thickness of an element's outline. An outline is a line that is drawn around an element, outside the border. */
  outline: [
    {
      styleName: 'outline-width',
      values: 0,
      valueFormat: BoxStylesFormatters.Value.px,
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
      values: [0, 90, 180, 270, -90, -180, -270] as const,
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
  /** The transition-property CSS property sets the CSS properties to which a transition effect should be applied. */
  transition: [
    {
      styleName: 'transition-property',
      values: ['none', 'all'] as const,
    },
  ],
  /** The transition-duration CSS property sets the length of time a transition animation should take to complete. By default, the value is 0s, meaning that no animation will occur. */
  transitionDuration: [
    {
      styleName: 'transition-duration',
      values: [50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800, 850, 900, 950, 1000] as const,
      valueFormat: (value: number) => `${value}ms`,
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
  color: [
    {
      values: Object.keys(Variables.colors) as Variables.ColorType[],
      valueFormat: (value, useVariable) => useVariable(value),
    },
  ],
  bgColor: [
    {
      values: Object.keys(Variables.colors) as Variables.ColorType[],
      valueFormat: (value, useVariable) => useVariable(value),
      styleName: 'background-color',
    },
  ],
  borderColor: [
    {
      values: Object.keys(Variables.colors) as Variables.ColorType[],
      valueFormat: (value, useVariable) => useVariable(value),
      styleName: 'border-color',
    },
  ],
  outlineColor: [
    {
      values: Object.keys(Variables.colors) as Variables.ColorType[],
      valueFormat: (value, useVariable) => useVariable(value),
      styleName: 'outline-color',
    },
  ],
} satisfies Record<string, BoxStyle[]>;

export const pseudo1 = {
  hover: ':hover',
  focus: ':focus-within',
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
};

export const pseudo2 = {
  indeterminate: ':indeterminate',
  checked: ':checked',
  required: ':required',
  disabled: '[disabled]',
};

export const pseudoClasses = { ...pseudo1, ...pseudo2 };
export const pseudoClassesWeight = Object.entries(pseudoClasses).reduce(
  (acc, [key], index) => {
    acc[key as keyof typeof pseudoClasses] = Math.pow(2, index);

    return acc;
  },
  {} as Record<keyof typeof pseudoClasses, number>,
);

export const pseudoClassesByWeight = Object.entries(pseudoClasses).reduce(
  (acc, [key]) => {
    const weight = pseudoClassesWeight[key as keyof typeof pseudoClasses];
    Object.entries(acc).forEach(([prevWeight, pseudoClassesToUse]) => {
      acc[+prevWeight + weight] = [...pseudoClassesToUse, key as keyof typeof pseudoClasses];
    });

    return acc;
  },
  { 0: [] } as { [key: number]: (keyof typeof pseudoClasses)[] },
);

export const pseudoGroupClasses = {
  hoverGroup: 'hover',
  focusGroup: 'focus',
  activeGroup: 'active',
  disabledGroup: 'disabled',
} satisfies { [key: string]: keyof typeof pseudoClasses };

export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  xxl: 1536,
};
