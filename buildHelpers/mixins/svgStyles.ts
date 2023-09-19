import { styleVariables } from '../../src/types';

type StylesType = Record<string, Record<string, string>>;

const svgStyles = {};

['hover', 'focus'].forEach((pseudoClass) => {
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
    alias: string[],
    children: string[],
  ) {
    let classNames = getClassNames(className, value);
    alias.forEach((a) => {
      classNames = classNames.concat(getClassNames(a, value));
    });

    if (children.length) {
      classNames = children.reduce((newClassNames, c) => {
        const newArr = [...classNames];
        for (const index in newArr) {
          newArr[index] = newArr[index] + ' ' + c;
        }
        return newClassNames.concat(newArr);
      }, [] as string[]);
    }

    const tmp: Record<string, string | number> = (styles[classNames.join(',')] = {});

    styleName.forEach((s) => {
      tmp[s] = styleValue;
    });
  }

  function newStyles(styles: StylesType, className: string, values: readonly string[], styleName?: string[], alias?: string[]) {
    values.forEach((value) => {
      addStyle(styles, className, value, styleName || [className], value, alias || [], []);
    });
  }

  function newStylesCssVariables(
    styles: StylesType,
    className: string,
    values: readonly number[] | readonly string[],
    styleName?: string[],
    alias?: string[],
    children?: string[],
    justValue: boolean = false,
  ) {
    values.forEach((value) => {
      const variableName = justValue ? value : className + value;
      addStyle(styles, className, value, styleName || [className], 'var(--' + variableName + ')', alias || [], children || []);
    });
  }

  function newStylesWithSizes(
    styles: StylesType,
    className: string,
    values: readonly number[],
    unity: 'px' | 'rem' | 'deg' | '' = 'rem',
    styleName?: string[],
    alias?: string[],
    valueFactory?: (value: string) => string,
  ) {
    values.forEach((value) => {
      const val = value * (unity === 'rem' ? styleVariables.sizeMultiplier : 1) + unity;

      addStyle(styles, className, value, styleName || [className], valueFactory ? valueFactory(val) : val, alias || [], []);
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
      addStyle(styles, className, value, styleName || [className], valueMap(value, className), [], []);
    });
  }

  // newStylesCssVariables(svgStyles, 'fill', styleVariables.baseColors, ['fill'], [], ['path', 'circle', 'rect', 'line'], true);
  // newStylesCssVariables(svgStyles, 'stroke', styleVariables.baseColors, ['stroke'], [], ['path', 'circle', 'rect', 'line'], true);

  newStylesWithMapping(svgStyles, 'rotate', [0, 90, 180, 270], (value, className) => `${value}deg`, ['rotate']);
  newStylesWithMapping(svgStyles, 'flip', ['xAxis', 'yAxis'], (value, className) => (value === 'xAxis' ? '-1 1' : '1 -1'), ['scale']);
});

export default {
  svgStyles: (_mixin: any) => svgStyles,
};
