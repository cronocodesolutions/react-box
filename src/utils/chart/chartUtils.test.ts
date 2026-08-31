import { describe, expect, it } from 'vitest';
import ChartUtils from './chartUtils';

/**
 * The chart geometry has no DOM in it, so this is where the primitives are really tested: a path
 * string is a value, and every mistake a chart can make — an upside-down line, a bar with no
 * height, an arc that draws nothing — is visible here and invisible in a rendered component.
 */
describe('ChartUtils', () => {
  describe('points', () => {
    it('spreads the data across the box and flips y, because SVG counts downwards', () => {
      expect(ChartUtils.points([0, 5, 10])).toEqual([
        { x: 0, y: 100 },
        { x: 50, y: 50 },
        { x: 100, y: 0 },
      ]);
    });

    it('scales to the data it was given, not to zero', () => {
      // 100 and 200 are the ends of the scale, so they are the floor and the ceiling of the box.
      expect(ChartUtils.points([100, 150, 200])).toEqual([
        { x: 0, y: 100 },
        { x: 50, y: 50 },
        { x: 100, y: 0 },
      ]);
    });

    it('takes a fixed domain, so many rows can share one scale', () => {
      expect(ChartUtils.points([0, 5, 10], { min: 0, max: 20 })).toEqual([
        { x: 0, y: 100 },
        { x: 50, y: 75 },
        { x: 100, y: 50 },
      ]);
    });

    it('puts data that never changes in the middle rather than dividing by zero', () => {
      expect(ChartUtils.points([4, 4, 4])).toEqual([
        { x: 0, y: 50 },
        { x: 50, y: 50 },
        { x: 100, y: 50 },
      ]);
    });

    it('draws one datum as a flat line across the box', () => {
      expect(ChartUtils.points([7])).toEqual([
        { x: 0, y: 50 },
        { x: 100, y: 50 },
      ]);
    });

    it('has nothing to draw for no data', () => {
      expect(ChartUtils.points([])).toEqual([]);
      expect(ChartUtils.linePath([])).toBe('');
      expect(ChartUtils.areaPath([])).toBe('');
      expect(ChartUtils.barsPath([])).toBe('');
    });
  });

  describe('paths', () => {
    it('writes a line as one move and the rest lines', () => {
      expect(ChartUtils.linePath(ChartUtils.points([0, 10]))).toBe('M0 100L100 0');
    });

    it('closes an area down to the floor of the box', () => {
      expect(ChartUtils.areaPath(ChartUtils.points([0, 10]))).toBe('M0 100L100 0L100 100L0 100Z');
    });

    it('draws every bar in one path, gapped and centred in its slot', () => {
      // Two bars: slots of 50, a quarter of each left empty, so 37.5 wide starting at 6.25.
      expect(ChartUtils.barsPath([0, 10])).toBe('M6.25 99h37.5v1h-37.5ZM56.25 0h37.5v100h-37.5Z');
    });

    it('keeps a floor under the lowest bar, so a bottom-of-scale value still shows', () => {
      const bars = ChartUtils.barsPath([5, 5, 5], { min: 5, max: 10 });

      // Every bar is at the bottom of the scale, and each is one unit tall rather than nothing.
      expect(bars.split('Z')).toHaveLength(4);
      expect(bars).toContain('v1h');
    });
  });

  describe('rings', () => {
    it('fits the stroke inside the box', () => {
      expect(ChartUtils.radius(8)).toBe(46);
      expect(ChartUtils.circumference(46)).toBe(289.03);
    });

    it('reveals the fraction asked for, measured from the start of the path', () => {
      expect(ChartUtils.dash(100, 0.25)).toEqual({ strokeDasharray: 100, strokeDashoffset: 75 });
      expect(ChartUtils.dash(100, 1)).toEqual({ strokeDasharray: 100, strokeDashoffset: 0 });
      expect(ChartUtils.dash(100, 0)).toEqual({ strokeDasharray: 100, strokeDashoffset: 100 });
    });

    it('cannot be more than full or less than empty', () => {
      expect(ChartUtils.dash(100, 4)).toEqual({ strokeDasharray: 100, strokeDashoffset: 0 });
      expect(ChartUtils.dash(100, -1)).toEqual({ strokeDasharray: 100, strokeDashoffset: 100 });
    });

    /**
     * The dash offset lands in a class name, so the number of distinct values is the number of CSS
     * rules a page generates. Rounding to `FRACTION_STEP` is what keeps that bounded.
     */
    it('rounds the fraction, so a column of percentages cannot generate a rule each', () => {
      const offsets = new Set(Array.from({ length: 1000 }, (_, i) => ChartUtils.dash(100, i / 1000).strokeDashoffset));

      expect(offsets.size).toBe(1 / ChartUtils.FRACTION_STEP + 1);
      expect(ChartUtils.fraction(0.3742)).toBe(0.375);
    });

    it('draws an arc from where it starts to where it ends', () => {
      // A quarter turn from twelve o'clock: the top of the circle round to the right-hand side.
      expect(ChartUtils.arcPath(50, 0, 90)).toBe('M50 0A50 50 0 0 1 100 50');
      // The gauge shape: three quarters of a turn from the bottom left round to the bottom right.
      // Past a half turn the large-arc flag has to be set, or the browser takes the short way round.
      expect(ChartUtils.arcPath(50, 225, 270)).toBe('M14.64 85.36A50 50 0 1 1 85.36 85.36');
    });

    it('splits a full turn in two, because one arc back to its own start draws nothing', () => {
      expect(ChartUtils.arcPath(50, 0, 360)).toBe('M50 0A50 50 0 0 1 50 100A50 50 0 0 1 50 0');
    });

    it('measures an arc as its share of the circle', () => {
      expect(ChartUtils.arcLength(50, 360)).toBe(ChartUtils.circumference(50));
      expect(ChartUtils.arcLength(50, 180)).toBeCloseTo(ChartUtils.circumference(50) / 2, 1);
    });
  });

  describe('donutSegments', () => {
    it('gives each value its share of the circle, and turns it to where it starts', () => {
      expect(ChartUtils.donutSegments([1, 1, 2], 100)).toEqual([
        { strokeDasharray: '25 75', rotate: 0, value: 1, index: 0 },
        { strokeDasharray: '25 75', rotate: 90, value: 1, index: 1 },
        { strokeDasharray: '50 50', rotate: 180, value: 2, index: 2 },
      ]);
    });

    it('has nothing to draw when the values sum to nothing', () => {
      expect(ChartUtils.donutSegments([], 100)).toEqual([]);
      expect(ChartUtils.donutSegments([0, 0], 100)).toEqual([]);
      expect(ChartUtils.donutSegments([-1, -2], 100)).toEqual([]);
    });

    it('counts a negative value as none — a ring of a whole cannot show one', () => {
      expect(ChartUtils.donutSegments([-5, 1, 1], 100).map((s) => s.strokeDasharray)).toEqual(['0 100', '50 50', '50 50']);
    });
  });
});
