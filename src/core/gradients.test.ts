import { describe, expect, it } from 'vitest';
import Gradients from './gradients';

const variable = (name: string) => `var(--${name})`;
const css = (value: unknown) => Gradients.css(value as never, variable);

/**
 * The `bgGradient` grammar: which records are a gradient, and what each one writes. A gradient is judged
 * whole — one bad stop makes the rest of it meaningless — so every rejection here costs the entire value.
 */
describe('Gradients.isGradient', () => {
  it('takes each of the three kinds with its own geometry', () => {
    expect(Gradients.isGradient({ linear: 'r', colors: ['blue-500', 'pink-500'] })).toBe(true);
    expect(Gradients.isGradient({ linear: 135, colors: ['blue-500', 'pink-500'] })).toBe(true);
    expect(Gradients.isGradient({ radial: 'circle', colors: ['blue-500', 'pink-500'] })).toBe(true);
    expect(Gradients.isGradient({ conic: 45, colors: ['blue-500', 'pink-500'] })).toBe(true);
    // `true` is the kind with no geometry of its own — the browser's default shape or start angle.
    expect(Gradients.isGradient({ radial: true, colors: ['blue-500', 'pink-500'] })).toBe(true);
    expect(Gradients.isGradient({ conic: true, colors: ['blue-500', 'pink-500'] })).toBe(true);
  });

  it('takes every colour a colour prop takes, positioned or not', () => {
    expect(Gradients.isGradient({ linear: 'r', colors: ['blue-500/40', 'var(--chart-1)'] })).toBe(true);
    expect(Gradients.isGradient({ linear: 'r', colors: [['blue-500', '20%'], 'transparent'] })).toBe(true);
    expect(Gradients.isGradient({ linear: 'r', colors: ['Canvas', 'CanvasText'] })).toBe(true);
  });

  it('needs two stops, since one is a colour and not a gradient', () => {
    expect(Gradients.isGradient({ linear: 'r', colors: ['blue-500'] })).toBe(false);
    expect(Gradients.isGradient({ linear: 'r', colors: [] })).toBe(false);
    expect(Gradients.isGradient({ linear: 'r' })).toBe(false);
  });

  it('rejects a stop the palette does not have, so a typo costs the whole value', () => {
    expect(Gradients.isGradient({ linear: 'r', colors: ['bleu-500', 'pink-500'] })).toBe(false);
    expect(Gradients.isGradient({ linear: 'r', colors: ['blue-500/140', 'pink-500'] })).toBe(false);
    expect(Gradients.isGradient({ linear: 'r', colors: [['blue-500', '20'], 'pink-500'] })).toBe(false);
  });

  it('names exactly one kind', () => {
    expect(Gradients.isGradient({ colors: ['blue-500', 'pink-500'] })).toBe(false);
    expect(Gradients.isGradient({ linear: 'r', radial: true, colors: ['blue-500', 'pink-500'] })).toBe(false);
  });

  it('rejects a key the grammar does not know, so a misspelling is not a silent sRGB gradient', () => {
    expect(Gradients.isGradient({ linear: 'r', colors: ['blue-500', 'pink-500'], interpolat: 'oklch' })).toBe(false);
    expect(Gradients.isGradient({ linear: 'r', colors: ['blue-500', 'pink-500'], interpolate: 'oklab-longer' })).toBe(false);
    // A linear gradient runs in a direction rather than out of a point, so `at` is not one of its keys.
    expect(Gradients.isGradient({ linear: 'r', at: 'center', colors: ['blue-500', 'pink-500'] })).toBe(false);
    expect(Gradients.isGradient({ radial: true, at: 'middle', colors: ['blue-500', 'pink-500'] })).toBe(false);
  });

  it('rejects a direction, shape or angle it does not name', () => {
    expect(Gradients.isGradient({ linear: 'rr', colors: ['blue-500', 'pink-500'] })).toBe(false);
    expect(Gradients.isGradient({ linear: Number.NaN, colors: ['blue-500', 'pink-500'] })).toBe(false);
    expect(Gradients.isGradient({ radial: 'square', colors: ['blue-500', 'pink-500'] })).toBe(false);
    expect(Gradients.isGradient({ conic: 'r', colors: ['blue-500', 'pink-500'] })).toBe(false);
  });

  it('is not fooled by a value that is not a record at all', () => {
    expect(Gradients.isGradient('linear-gradient(red,blue)')).toBe(false);
    expect(Gradients.isGradient(['blue-500', 'pink-500'])).toBe(false);
    expect(Gradients.isGradient(4)).toBe(false);
  });
});

describe('Gradients.css', () => {
  it('resolves every stop to the variable behind its token', () => {
    expect(css({ linear: 'r', colors: ['blue-500', 'pink-500'] })).toBe('linear-gradient(to right,var(--blue-500),var(--pink-500))');
  });

  it('writes an angle in degrees, with 0 pointing up the way CSS does', () => {
    expect(css({ linear: 135, colors: ['blue-500', 'pink-500'] })).toBe('linear-gradient(135deg,var(--blue-500),var(--pink-500))');
  });

  it('keeps the opacity modifier as the mix that applies it, so the token stays a variable', () => {
    expect(css({ linear: 'b', colors: ['blue-500/40', 'pink-500'] })).toBe(
      'linear-gradient(to bottom,color-mix(in oklab, var(--blue-500) 40%, transparent),var(--pink-500))',
    );
  });

  it('places a positioned stop after its colour', () => {
    expect(
      css({
        linear: 'r',
        colors: [
          ['blue-500', '20%'],
          ['pink-500', '80%'],
        ],
      }),
    ).toBe('linear-gradient(to right,var(--blue-500) 20%,var(--pink-500) 80%)');
  });

  it('centres a radial or conic gradient with `at`, and starts a conic one from an angle', () => {
    expect(css({ radial: 'circle', at: 'top left', colors: ['blue-500', 'pink-500'] })).toBe(
      'radial-gradient(circle at top left,var(--blue-500),var(--pink-500))',
    );
    expect(css({ conic: 45, at: 'center', colors: ['blue-500', 'pink-500'] })).toBe(
      'conic-gradient(from 45deg at center,var(--blue-500),var(--pink-500))',
    );
  });

  it('names the interpolation space, which is what keeps two stops out of the grey middle', () => {
    expect(css({ linear: 'r', colors: ['blue-500', 'pink-500'], interpolate: 'oklch' })).toBe(
      'linear-gradient(to right in oklch,var(--blue-500),var(--pink-500))',
    );
    // The long way round the hue circle: what turns two stops into a spectrum.
    expect(css({ conic: true, colors: ['red-500', 'red-500'], interpolate: 'oklch-longer' })).toBe(
      'conic-gradient(in oklch longer hue,var(--red-500),var(--red-500))',
    );
  });

  it('writes no prelude at all for a kind that carries no geometry', () => {
    expect(css({ radial: true, colors: ['white', 'transparent'] })).toBe('radial-gradient(var(--white),var(--transparent))');
  });
});
