import { MockInstance, afterEach, describe, expect, it, vi, beforeAll, afterAll, beforeEach } from 'vitest';
import useStyles from './useStyles';
import { renderHook } from '@testing-library/react';
import { StyleItem, boxStyles } from './boxStyles';
import StylesContext from './stylesContext';

describe('useStyles', () => {
  describe('creates css class', () => {
    let fetchSpy: MockInstance<[], void>;

    beforeEach(() => {
      fetchSpy = vi.spyOn(StylesContext, 'flush');
    });

    afterEach(() => {
      fetchSpy.mockRestore();
    });

    afterAll(() => {
      StylesContext.clear();
    });

    it('returns _box class', () => {
      const classNames = renderHook(() => useStyles({}, false)).result.current;

      expect(classNames.at(0)).toEqual('_box');
    });

    it('returns _svg class', () => {
      const classNames = renderHook(() => useStyles({}, true)).result.current;

      expect(classNames.at(0)).toEqual('_svg');
    });

    const useCases = Object.entries(boxStyles)
      .filter(([style, val]) => !(val as StyleItem).pseudoSuffix)
      .flatMap(([style, val]) => {
        return val.values1?.values.map((value) => [style, value]);
      })
      .filter((item) => !!item);

    useCases.forEach(([style, value]) => {
      it(`returns ${style} ${value}`, () => {
        StylesContext.flush = vi.fn();
        const classNames = renderHook(() => useStyles({ [style as string]: value }, false)).result.current;
        expect(classNames.at(-1)).toEqual(`${style}${value}`);
      });
    });

    it('hover group name', () => {
      const el = StylesContext.getElement();
      const classNames = renderHook(() => useStyles({ hoverGroup: 'test' }, false)).result.current;

      expect(classNames.at(-1)).toEqual('hoverGrouptest');
    });
  });
});
