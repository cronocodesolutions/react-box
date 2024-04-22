import { describe, expect, it, beforeEach } from 'vitest';
import useStyles from './useStyles';
import { renderHook } from '@testing-library/react';
import StylesContext from './stylesContext';

describe('useStyles', () => {
  describe('creates scc styles', () => {
    beforeEach(() => {
      StylesContext.clear();
    });

    it('display block', () => {
      renderHook(() => useStyles({ display: 'block' }, false));

      const el = StylesContext.getElement();

      expect(el.innerHTML).toContain('.displayblock{display:block;}');
    });

    it('hover display block', () => {
      renderHook(() => useStyles({ hover: { display: 'block' } }, false));

      const el = StylesContext.getElement();

      expect(el.innerHTML).toContain('.displayHoverblock:hover{display:block;}');
    });

    it('hoverGroup display block', () => {
      renderHook(() => useStyles({ hoverGroup: { test2: { display: 'block' } } }, false));

      const el = StylesContext.getElement();

      expect(el.innerHTML).toContain('.hoverGrouptest2:hover .displayHovertest2block{display:block;}');
    });

    it('width 100%', () => {
      renderHook(() => useStyles({ width: 'fit' }, false));

      const el = StylesContext.getElement();

      expect(el.innerHTML).toContain('.widthfit{width:100%;}');
    });

    it('width 2/3', () => {
      renderHook(() => useStyles({ width: '2/3' }, false));

      const el = StylesContext.getElement();

      expect(el.innerHTML).toContain('.width2/3{width:66.66666666666666%;}');
    });

    it('p:4 m:2 width: fit color: red', () => {
      renderHook(() => useStyles({ p: 4, m: 2, width: 'fit', color: 'red' }, false));

      const el = StylesContext.getElement();

      expect(el.innerHTML).toContain('.widthfit{width:100%;}');
      expect(el.innerHTML).toContain('.m2{margin:0.5rem;}');
      expect(el.innerHTML).toContain('.p4{padding:1rem;}');
      expect(el.innerHTML).toContain('.colorred{color:var(--colorred)');
    });

    it('p:4 m:2 + media query', () => {
      renderHook(() => useStyles({ p: 4, m: 2, md: { p: 3, m: 4 } }, false));

      const el = StylesContext.getElement();

      expect(el.innerHTML).toContain('.p4{padding:1rem;}');
      expect(el.innerHTML).toContain('.m2{margin:0.5rem;}');
      expect(el.innerHTML).toContain('@media(min-width: 768px){.mdm4{margin:1rem;}.mdp3{padding:0.75rem;}}');
    });
  });
});
