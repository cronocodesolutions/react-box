import { describe, expect, it } from 'vitest';
import { DEFAULT_REM_DIVIDER } from './boxConstants';
import { BoxStylesFormatters } from './boxStylesFormatters';

const { rem, px, fraction } = BoxStylesFormatters.Value;

describe('BoxStylesFormatters.Value.rem', () => {
  it('divides by the spacing divider', () => {
    expect(DEFAULT_REM_DIVIDER).toBe(4);
    expect(rem(4)).toBe('1rem');
    expect(rem(1)).toBe('0.25rem');
    expect(rem(2)).toBe('0.5rem');
    expect(rem(0)).toBe('0rem');
  });

  it('keeps sub-pixel precision instead of rounding', () => {
    expect(rem(0.5)).toBe('0.125rem');
    expect(rem(3)).toBe('0.75rem');
  });

  it('formats negative values (offsets, margins)', () => {
    expect(rem(-4)).toBe('-1rem');
    expect(rem(-2)).toBe('-0.5rem');
  });
});

describe('BoxStylesFormatters.Value.px', () => {
  it('emits the number unchanged as pixels', () => {
    expect(px(1)).toBe('1px');
    expect(px(0)).toBe('0px');
    expect(px(24)).toBe('24px');
    expect(px(-2)).toBe('-2px');
  });
});

describe('BoxStylesFormatters.Value.fraction', () => {
  it('converts a fraction token to a percentage', () => {
    expect(fraction('1/1')).toBe('100%');
    expect(fraction('1/2')).toBe('50%');
    expect(fraction('3/4')).toBe('75%');
    expect(fraction('1/5')).toBe('20%');
  });

  it('converts negative fractions', () => {
    expect(fraction('-1/2')).toBe('-50%');
    expect(fraction('-11/12')).toBe(`${(-11 / 12) * 100}%`);
  });

  it('does not round repeating fractions', () => {
    expect(fraction('1/3')).toBe(`${(1 / 3) * 100}%`);
    expect(fraction('2/3')).toBe(`${(2 / 3) * 100}%`);
  });
});
