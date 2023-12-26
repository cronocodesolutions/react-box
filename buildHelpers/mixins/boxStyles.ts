import { styleVariables } from '../../src/types';

type StylesType = Record<string, Record<string, string>>;

const boxStyles = {};

['hover', 'focus', 'active'].forEach((pseudoClass) => {
  function getClassNames(className: string, value: string | boolean | number) {
    const classNames: string[] = [];

    if (pseudoClass === 'hover') {
      classNames.push('.' + className + value);
      classNames.push('.' + className + 'H' + value + ':hover');
      classNames.push('.hovertrue:hover' + '>.' + className + 'H' + value);
    } else if (pseudoClass === 'focus') {
      classNames.push('.' + className + 'F' + value + ':focus-within');
      classNames.push('.focustrue:focus-within' + '>.' + className + 'F' + value);
    } else if (pseudoClass === 'active') {
      classNames.push('.' + className + 'A' + value + ':active');
    }

    return classNames;
  }

  function addStyle(
    styles: StylesType,
    className: string,
    value: string | boolean | number,
    styleName: string[],
    styleValue: string | number,
  ) {
    let classNames = getClassNames(className, value);

    const tmp: Record<string, string | number> = (styles[classNames.join(',')] = {});
    styleName.forEach((s) => {
      tmp[s] = styleValue;
    });
  }

  function newStyles(styles: StylesType, className: string, values: readonly string[], styleName?: string[]) {
    values.forEach((value) => {
      addStyle(styles, className, value, styleName || [className], value);
    });
  }

  function newStylesWithSizes(
    styles: StylesType,
    className: string,
    values: readonly number[],
    unity: 'px' | 'rem' | '' = 'rem',
    styleName?: string[],
  ) {
    values.forEach((value) => {
      addStyle(styles, className, value, styleName || [className], value * (unity === 'rem' ? styleVariables.sizeMultiplier : 1) + unity);
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
      addStyle(styles, className, value, styleName || [className], valueMap(value, className));
    });
  }

  // inline
  addStyle(boxStyles, 'inline', true, ['display'], 'inline-block');

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
        return className.toLocaleLowerCase().includes('height') ? '100vh' : '100vw';
      default:
        return value;
    }
  }
  newStylesWithMapping(boxStyles, 'width', styleVariables.sizeSpecialValues, specialSizeMap);
  newStylesWithMapping(boxStyles, 'minWidth', styleVariables.sizeSpecialValues, specialSizeMap, ['min-width']);
  newStylesWithMapping(boxStyles, 'maxWidth', styleVariables.sizeSpecialValues, specialSizeMap, ['max-width']);
  newStylesWithMapping(boxStyles, 'height', styleVariables.sizeSpecialValues, specialSizeMap);
  newStylesWithMapping(boxStyles, 'minHeight', styleVariables.sizeSpecialValues, specialSizeMap, ['min-height']);
  newStylesWithMapping(boxStyles, 'maxHeight', styleVariables.sizeSpecialValues, specialSizeMap, ['max-height']);

  // margin
  newStylesWithSizes(boxStyles, 'margin', styleVariables.sizes, 'rem', undefined);
  addStyle(boxStyles, 'margin', 'auto', ['margin'], 'auto');
  newStylesWithSizes(boxStyles, 'marginHorizontal', styleVariables.sizes, 'rem', ['margin-inline']);
  addStyle(boxStyles, 'marginHorizontal', 'auto', ['margin-inline'], 'auto');
  newStylesWithSizes(boxStyles, 'marginVertical', styleVariables.sizes, 'rem', ['margin-block']);
  addStyle(boxStyles, 'marginVertical', 'auto', ['margin-block'], 'auto');
  newStylesWithSizes(boxStyles, 'marginTop', styleVariables.sizes, 'rem', ['margin-top']);
  addStyle(boxStyles, 'marginTop', 'auto', ['margin-top'], 'auto');
  newStylesWithSizes(boxStyles, 'marginRight', styleVariables.sizes, 'rem', ['margin-right']);
  addStyle(boxStyles, 'marginRight', 'auto', ['margin-right'], 'auto');
  newStylesWithSizes(boxStyles, 'marginBottom', styleVariables.sizes, 'rem', ['margin-bottom']);
  addStyle(boxStyles, 'marginBottom', 'auto', ['margin-bottom'], 'auto');
  newStylesWithSizes(boxStyles, 'marginLeft', styleVariables.sizes, 'rem', ['margin-left']);
  addStyle(boxStyles, 'marginLeft', 'auto', ['margin-left'], 'auto');

  // padding
  newStylesWithSizes(boxStyles, 'padding', styleVariables.sizes, 'rem', undefined);
  newStylesWithSizes(boxStyles, 'paddingHorizontal', styleVariables.sizes, 'rem', ['padding-inline']);
  newStylesWithSizes(boxStyles, 'paddingVertical', styleVariables.sizes, 'rem', ['padding-block']);
  newStylesWithSizes(boxStyles, 'paddingTop', styleVariables.sizes, 'rem', ['padding-top']);
  newStylesWithSizes(boxStyles, 'paddingRight', styleVariables.sizes, 'rem', ['padding-right']);
  newStylesWithSizes(boxStyles, 'paddingBottom', styleVariables.sizes, 'rem', ['padding-bottom']);
  newStylesWithSizes(boxStyles, 'paddingLeft', styleVariables.sizes, 'rem', ['padding-left']);

  // border
  newStylesWithSizes(boxStyles, 'border', styleVariables.borderSizes, 'px', ['border-width']);
  newStylesWithSizes(boxStyles, 'borderHorizontal', styleVariables.borderSizes, 'px', ['border-inline-width']);
  newStylesWithSizes(boxStyles, 'borderVertical', styleVariables.borderSizes, 'px', ['border-block-width']);
  newStylesWithSizes(boxStyles, 'borderTop', styleVariables.borderSizes, 'px', ['border-top-width']);
  newStylesWithSizes(boxStyles, 'borderRight', styleVariables.borderSizes, 'px', ['border-right-width']);
  newStylesWithSizes(boxStyles, 'borderBottom', styleVariables.borderSizes, 'px', ['border-bottom-width']);
  newStylesWithSizes(boxStyles, 'borderLeft', styleVariables.borderSizes, 'px', ['border-left-width']);
  newStyles(boxStyles, 'borderStyle', styleVariables.borderAndOutlineStyles, ['border-style']);
  newStylesWithSizes(boxStyles, 'borderRadius', styleVariables.sizes, 'rem', ['border-radius']);
  newStylesWithSizes(boxStyles, 'borderRadiusTop', styleVariables.sizes, 'rem', ['border-top-left-radius', 'border-top-right-radius']);
  newStylesWithSizes(boxStyles, 'borderRadiusRight', styleVariables.sizes, 'rem', [
    'border-top-right-radius',
    'border-bottom-right-radius',
  ]);
  newStylesWithSizes(boxStyles, 'borderRadiusBottom', styleVariables.sizes, 'rem', [
    'border-bottom-left-radius',
    'border-bottom-right-radius',
  ]);
  newStylesWithSizes(boxStyles, 'borderRadiusLeft', styleVariables.sizes, 'rem', ['border-top-left-radius', 'border-bottom-left-radius']);
  newStylesWithSizes(boxStyles, 'borderRadiusTopLeft', styleVariables.sizes, 'rem', ['border-top-left-radius']);
  newStylesWithSizes(boxStyles, 'borderRadiusTopRight', styleVariables.sizes, 'rem', ['border-top-right-radius']);
  newStylesWithSizes(boxStyles, 'borderRadiusBottomLeft', styleVariables.sizes, 'rem', ['border-bottom-left-radius']);
  newStylesWithSizes(boxStyles, 'borderRadiusBottomRight', styleVariables.sizes, 'rem', ['border-bottom-right-radius']);

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
  newStyles(boxStyles, 'fontStyle', styleVariables.fontStyle, ['font-style']);
  newStylesWithSizes(boxStyles, 'lineHeight', styleVariables.fontSizes, 'px', ['line-height']);
  newStylesWithSizes(boxStyles, 'fontWeight', styleVariables.fontWeight, '', ['font-weight']);
  newStylesWithSizes(boxStyles, 'letterSpacing', styleVariables.sizes, 'px', ['letter-spacing']);

  // text
  newStyles(boxStyles, 'textDecoration', styleVariables.textDecoration, ['text-decoration']);
  newStyles(boxStyles, 'textTransform', styleVariables.textTransform, ['text-transform']);
  newStyles(boxStyles, 'textAlign', styleVariables.textAlign, ['text-align']);

  // flex
  newStyles(boxStyles, 'flexWrap', styleVariables.flexWrap, ['flex-wrap']);
  newStyles(boxStyles, 'justifyContent', styleVariables.justifyContent, ['justify-content']);
  newStyles(boxStyles, 'alignItems', styleVariables.alignItems, ['align-items']);
  newStyles(boxStyles, 'alignContent', styleVariables.alignContent, ['align-content']);
  addStyle(boxStyles, 'flex1', true, ['flex'], 1);
  newStyles(boxStyles, 'flexDirection', styleVariables.flexDirection, ['flex-direction']);
  newStylesWithSizes(boxStyles, 'gap', styleVariables.gap);
  newStylesWithSizes(boxStyles, 'rowGap', styleVariables.gap, 'rem', ['row-gap']);
  newStylesWithSizes(boxStyles, 'columnGap', styleVariables.gap, 'rem', ['column-gap']);
  newStylesWithSizes(boxStyles, 'order', styleVariables.order, '');
  newStylesWithSizes(boxStyles, 'flexGrow', styleVariables.flexGrow, '', ['flex-grow']);
  newStylesWithSizes(boxStyles, 'flexShrink', styleVariables.flexShrink, '', ['flex-shrink']);
  newStyles(boxStyles, 'alignSelf', styleVariables.flexSelf, ['align-self']);
  newStyles(boxStyles, 'justifySelf', styleVariables.flexSelf, ['justify-self']);

  // outline
  newStylesWithSizes(boxStyles, 'outline', styleVariables.borderSizes, 'px', ['outline-width']);
  newStyles(boxStyles, 'outlineStyle', styleVariables.borderAndOutlineStyles, ['outline-style']);
  newStylesWithSizes(boxStyles, 'outlineOffset', styleVariables.outlineOffset, 'px', ['outline-offset']);

  // transition
  newStyles(boxStyles, 'transition', styleVariables.transition);

  // user-select
  newStyles(boxStyles, 'userSelect', styleVariables.userSelect, ['user-select']);

  // appearance
  newStyles(boxStyles, 'appearance', styleVariables.appearance);

  // pointer-events
  newStyles(boxStyles, 'pointerEvents', styleVariables.pointerEvents, ['pointer-events']);

  // white-space
  newStyles(boxStyles, 'whiteSpace', styleVariables.whiteSpace, ['white-space']);

  // text-overflow
  newStyles(boxStyles, 'textOverflow', styleVariables.textOverflow, ['text-overflow']);
});

export default {
  boxStyles: (_mixin: any) => boxStyles,
};
