// @ts-ignore
import { styleVariables } from '../src/types';

type StylesType = Record<string, Record<string, string>>;

function getClassNames(className: string, value: string | boolean | number) {
  const classNames: string[] = ['.' + className + value];
  classNames.push('.' + className + 'H' + value + ':hover');
  classNames.push('.hovertrue:hover' + ' .' + className + 'H' + value);
  classNames.push('.' + className + 'F' + value + ':focus-within');
  classNames.push('.focustrue:focus-within' + ' .' + className + 'F' + value);
  classNames.push('.' + className + 'A' + value + ':active');

  return classNames;
}

function addStyle(
  styles: StylesType,
  className: string,
  value: string | boolean | number,
  styleName: string[],
  styleValue: string | number,
  alias: string[],
) {
  let classNames = getClassNames(className, value);
  alias.forEach((a) => {
    classNames = classNames.concat(getClassNames(a, value));
  });

  const tmp: Record<string, string | number> = (styles[classNames.join(',')] = {});
  styleName.forEach((s) => {
    tmp[s] = styleValue;
  });
}

function newStyles(styles: StylesType, className: string, values: readonly string[], styleName?: string[], alias?: string[]) {
  values.forEach((value) => {
    addStyle(styles, className, value, styleName || [className], value, alias || []);
  });
}

function newStylesCssVariables(
  styles: StylesType,
  className: string,
  values: readonly number[] | readonly string[],
  styleName?: string[],
  alias?: string[],
  justValue: boolean = false,
) {
  values.forEach((value) => {
    const variableName = justValue ? value : className + value;
    addStyle(styles, className, value, styleName || [className], 'var(--' + variableName + ')', alias || []);
  });
}

function newStylesWithSizes(
  styles: StylesType,
  className: string,
  values: readonly number[],
  unity: 'px' | 'rem' | '' = 'rem',
  styleName?: string[],
  alias?: string[],
) {
  values.forEach((value) => {
    addStyle(
      styles,
      className,
      value,
      styleName || [className],
      value * (unity === 'rem' ? styleVariables.sizeMultiplier : 1) + unity,
      alias || [],
    );
  });
}

function newStylesWithMapping<T extends string | number>(
  styles: StylesType,
  className: string,
  values: readonly T[],
  valueMap: (value: T, className: string) => string | number,
  styleName?: string[],
) {
  values.forEach((value) => {
    addStyle(styles, className, value, styleName || [className], valueMap(value, className), []);
  });
}

const boxStyles = {};
// inline
addStyle(boxStyles, 'inline', true, ['display'], 'inline-block', []);

// display
newStyles(boxStyles, 'display', styleVariables.display);

// boxSizing
newStyles(boxStyles, 'boxSizing', styleVariables.boxSizing, ['box-sizing']);

// position
newStyles(boxStyles, 'position', styleVariables.position);
newStylesWithSizes(boxStyles, 'inset', styleVariables.sizes);
newStylesWithSizes(boxStyles, 'top', styleVariables.sizes);
newStylesWithSizes(boxStyles, 'right', styleVariables.sizes);
newStylesWithSizes(boxStyles, 'bottom', styleVariables.sizes);
newStylesWithSizes(boxStyles, 'left', styleVariables.sizes);

// width, height
function specialSizeMap(value: string, className: string) {
  switch (value) {
    case 'fit':
      return '100%';
    case 'fit-screen':
      return className.includes('height') ? '100vh' : '100vw';
    default:
      return value;
  }
}
newStylesWithMapping(boxStyles, 'width', styleVariables.sizeSpecialValues, specialSizeMap);
newStylesWithMapping(boxStyles, 'minWidth', styleVariables.sizeSpecialValues, specialSizeMap, ['min-width']);
newStylesWithMapping(boxStyles, 'maxWidth', styleVariables.sizeSpecialValues, specialSizeMap, ['max-width']);
newStylesWithMapping(boxStyles, 'height', styleVariables.sizeSpecialValues, specialSizeMap);
newStylesWithMapping(boxStyles, 'height', styleVariables.sizeSpecialValues, specialSizeMap, ['min-height']);
newStylesWithMapping(boxStyles, 'height', styleVariables.sizeSpecialValues, specialSizeMap, ['max-height']);

// margin
newStylesWithSizes(boxStyles, 'margin', styleVariables.sizes, 'rem', undefined, ['m']);
addStyle(boxStyles, 'margin', 'auto', ['margin'], 'auto', ['m']);
newStylesWithSizes(boxStyles, 'marginHorizontal', styleVariables.sizes, 'rem', ['margin-inline'], ['mx']);
addStyle(boxStyles, 'marginHorizontal', 'auto', ['margin-inline'], 'auto', ['mx']);
newStylesWithSizes(boxStyles, 'marginVertical', styleVariables.sizes, 'rem', ['margin-block'], ['my']);
addStyle(boxStyles, 'marginVertical', 'auto', ['margin-block'], 'auto', ['my']);
newStylesWithSizes(boxStyles, 'marginTop', styleVariables.sizes, 'rem', ['margin-top'], ['mt']);
addStyle(boxStyles, 'marginTop', 'auto', ['margin-top'], 'auto', ['mt']);
newStylesWithSizes(boxStyles, 'marginRight', styleVariables.sizes, 'rem', ['margin-right'], ['mr']);
addStyle(boxStyles, 'marginRight', 'auto', ['margin-right'], 'auto', ['mr']);
newStylesWithSizes(boxStyles, 'marginBottom', styleVariables.sizes, 'rem', ['margin-bottom'], ['mb']);
addStyle(boxStyles, 'marginBottom', 'auto', ['margin-bottom'], 'auto', ['mb']);
newStylesWithSizes(boxStyles, 'marginLeft', styleVariables.sizes, 'rem', ['margin-left'], ['ml']);
addStyle(boxStyles, 'marginLeft', 'auto', ['margin-left'], 'auto', ['ml']);

// padding
newStylesWithSizes(boxStyles, 'padding', styleVariables.sizes, 'rem', undefined, ['p']);
newStylesWithSizes(boxStyles, 'paddingHorizontal', styleVariables.sizes, 'rem', ['padding-inline'], ['px']);
newStylesWithSizes(boxStyles, 'paddingVertical', styleVariables.sizes, 'rem', ['padding-block'], ['py']);
newStylesWithSizes(boxStyles, 'paddingTop', styleVariables.sizes, 'rem', ['padding-top'], ['pt']);
newStylesWithSizes(boxStyles, 'paddingRight', styleVariables.sizes, 'rem', ['padding-right'], ['pr']);
newStylesWithSizes(boxStyles, 'paddingBottom', styleVariables.sizes, 'rem', ['padding-bottom'], ['pb']);
newStylesWithSizes(boxStyles, 'paddingLeft', styleVariables.sizes, 'rem', ['padding-left'], ['pl']);

// border
newStylesWithSizes(boxStyles, 'border', styleVariables.borderSizes, 'px', ['border-width'], ['b']);
newStylesWithSizes(boxStyles, 'borderHorizontal', styleVariables.borderSizes, 'px', ['border-inline-width'], ['bx']);
newStylesWithSizes(boxStyles, 'borderVertical', styleVariables.borderSizes, 'px', ['border-block-width'], ['by']);
newStylesWithSizes(boxStyles, 'borderTop', styleVariables.borderSizes, 'px', ['border-top-width'], ['bt']);
newStylesWithSizes(boxStyles, 'borderRight', styleVariables.borderSizes, 'px', ['border-right-width'], ['br']);
newStylesWithSizes(boxStyles, 'borderBottom', styleVariables.borderSizes, 'px', ['border-bottom-width'], ['bb']);
newStylesWithSizes(boxStyles, 'borderLeft', styleVariables.borderSizes, 'px', ['border-left-width'], ['bl']);
newStyles(boxStyles, 'borderStyle', styleVariables.borderAndOutlineStyles, ['border-style']);
newStylesWithSizes(boxStyles, 'borderRadius', styleVariables.sizes, 'rem', ['border-radius']);
newStylesWithSizes(boxStyles, 'borderRadiusTop', styleVariables.sizes, 'rem', ['border-top-left-radius', 'border-top-right-radius']);
newStylesWithSizes(boxStyles, 'borderRadiusRight', styleVariables.sizes, 'rem', ['border-top-right-radius', 'border-bottom-right-radius']);
newStylesWithSizes(boxStyles, 'borderRadiusBottom', styleVariables.sizes, 'rem', [
  'border-bottom-left-radius',
  'border-bottom-right-radius',
]);
newStylesWithSizes(boxStyles, 'borderRadiusLeft', styleVariables.sizes, 'rem', ['border-top-left-radius', 'border-bottom-left-radius']);
newStylesWithSizes(boxStyles, 'borderRadiusTopLeft', styleVariables.sizes, 'rem', ['border-top-left-radius']);
newStylesWithSizes(boxStyles, 'borderRadiusTopRight', styleVariables.sizes, 'rem', ['border-top-right-radius']);
newStylesWithSizes(boxStyles, 'borderRadiusBottomLeft', styleVariables.sizes, 'rem', ['border-bottom-left-radius']);
newStylesWithSizes(boxStyles, 'borderRadiusBottomRight', styleVariables.sizes, 'rem', ['border-bottom-right-radius']);

// shadow
newStylesCssVariables(boxStyles, 'shadow', styleVariables.shadows, ['box-shadow']);

// backgrounds
newStylesCssVariables(boxStyles, 'background', styleVariables.backgrounds, ['background'], ['bg']);

// colors
newStylesCssVariables(boxStyles, 'color', styleVariables.baseColors, ['color'], [], true);
newStylesCssVariables(boxStyles, 'color', styleVariables.fontColors, ['color'], []);
newStylesCssVariables(boxStyles, 'backgroundColor', styleVariables.baseColors, ['background-color'], ['bgColor'], true);
newStylesCssVariables(boxStyles, 'backgroundColor', styleVariables.bgColors, ['background-color'], ['bgColor']);
newStylesCssVariables(boxStyles, 'borderColor', styleVariables.baseColors, ['border-color'], [], true);
newStylesCssVariables(boxStyles, 'borderColor', styleVariables.borderColors, ['border-color'], []);
newStylesCssVariables(boxStyles, 'outlineColor', styleVariables.baseColors, ['outline-color'], [], true);
newStylesCssVariables(boxStyles, 'outlineColor', styleVariables.outlineColors, ['outline-color'], []);

// cursor
newStyles(boxStyles, 'cursor', styleVariables.cursors);

// zIndex
newStylesWithSizes(boxStyles, 'zIndex', styleVariables.zIndexSizes, '', ['z-index']);

// overflow
newStyles(boxStyles, 'overflow', styleVariables.overflows);
newStyles(boxStyles, 'overflowX', styleVariables.overflows, ['overflow-x']);
newStyles(boxStyles, 'overflowY', styleVariables.overflows, ['overflow-y']);

// opacity
newStylesWithMapping(boxStyles, 'opacity', styleVariables.opacity, (value) => value / 100);

// font
newStylesWithSizes(boxStyles, 'fontSize', styleVariables.fontSizes, 'px', ['font-size']);
newStylesWithSizes(boxStyles, 'lineHeight', styleVariables.fontSizes, 'px', ['line-height']);
newStylesWithSizes(boxStyles, 'fontWeight', styleVariables.fontWeight, '', ['font-weight']);
newStylesWithSizes(boxStyles, 'letterSpacing', styleVariables.sizes, '', ['letter-spacing']);

// text
newStyles(boxStyles, 'textDecoration', styleVariables.textDecoration, ['text-decoration']);
newStyles(boxStyles, 'textTransform', styleVariables.textTransform, ['text-transform']);
newStyles(boxStyles, 'textAlign', styleVariables.textAlign, ['text-align']);

// flex
newStyles(boxStyles, 'flexWrap', styleVariables.flexWrap, ['flex-wrap'], ['wrap']);
newStyles(boxStyles, 'justifyContent', styleVariables.justifyContent, ['justify-content'], ['jc']);
newStyles(boxStyles, 'alignItems', styleVariables.alignItems, ['align-items'], ['ai']);
newStyles(boxStyles, 'alignContent', styleVariables.alignContent, ['align-content'], ['ac']);
addStyle(boxStyles, 'flex1', true, ['flex'], 1, []);
newStyles(boxStyles, 'flexDirection', styleVariables.flexDirection, ['flex-direction'], ['d']);
newStylesWithSizes(boxStyles, 'gap', styleVariables.gap);
newStylesWithSizes(boxStyles, 'rowGap', styleVariables.gap, 'rem', ['row-gap']);
newStylesWithSizes(boxStyles, 'columnGap', styleVariables.gap, 'rem', ['column-gap']);
newStylesWithSizes(boxStyles, 'order', styleVariables.order, '');
newStylesWithSizes(boxStyles, 'flexGrow', styleVariables.flexGrow, '', ['flex-grow'], ['grow']);
newStylesWithSizes(boxStyles, 'flexShrink', styleVariables.flexShrink, '', ['flex-shrink'], ['shrink']);
newStyles(boxStyles, 'alignSelf', styleVariables.flexSelf, ['align-self'], ['as']);
newStyles(boxStyles, 'justifySelf', styleVariables.flexSelf, ['justify-self'], ['js']);

// outline
newStylesWithSizes(boxStyles, 'outline', styleVariables.borderSizes, 'px', ['outline-width']);
newStyles(boxStyles, 'outlineStyle', styleVariables.borderAndOutlineStyles, ['outline-style']);
newStylesWithSizes(boxStyles, 'outlineOffset', styleVariables.outlineOffset, 'px', ['outline-offset']);

export default {
  boxStyles: (_mixin: any) => boxStyles,
};
