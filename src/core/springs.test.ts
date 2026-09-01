import { describe, expect, it } from 'vitest';
import Springs from './springs';

/** Every point of a sampled curve, as numbers. */
function pointsOf(easing: string): number[] {
  return easing.slice('linear('.length, -1).split(',').map(Number);
}

/**
 * The sampler is physics, so the tests are the physics: a spring that is damped enough never passes its
 * target, one that is not passes it and comes back, and both end where they started aiming.
 */
describe('spring sampling', () => {
  it('starts at 0 and arrives at 1', () => {
    const points = pointsOf(Springs.spring().easing);

    expect(points[0]).toBe(0);
    expect(points[points.length - 1]).toBe(1);
  });

  it('overshoots when damping is below critical, and does not when it is above', () => {
    const critical = 2 * Math.sqrt(200); // 2 * sqrt(stiffness * mass)

    expect(Math.max(...pointsOf(Springs.spring({ stiffness: 200, damping: 10 }).easing))).toBeGreaterThan(1);
    expect(Math.max(...pointsOf(Springs.spring({ stiffness: 200, damping: critical + 10 }).easing))).toBe(1);
  });

  it('settles sooner the stiffer it is', () => {
    expect(Springs.spring({ stiffness: 400, damping: 30 }).duration).toBeLessThan(Springs.spring({ stiffness: 80, damping: 12 }).duration);
  });

  it('takes an initial velocity, which is a throw rather than a release', () => {
    const thrown = pointsOf(Springs.spring({ stiffness: 180, damping: 20, velocity: 4 }).easing);
    const released = pointsOf(Springs.spring({ stiffness: 180, damping: 20 }).easing);

    expect(thrown[1]).toBeGreaterThan(released[1]);
  });

  // A sampled curve lands in a class name and in a rule, so Node and the browser have to agree on it.
  it('rounds to three decimals, and samples at most 33 points', () => {
    const points = Springs.spring({ stiffness: 40, damping: 4 }).easing.slice('linear('.length, -1).split(',');

    expect(points.length).toBeLessThanOrEqual(33);
    expect(points.every((point) => (point.split('.')[1] ?? '').length <= 3)).toBe(true);
  });

  /**
   * The four presets are the library's published values: changing one changes every rule that names it,
   * so their curves are written down here rather than left to whatever the sampler does next.
   */
  describe('presets', () => {
    it.each([
      ['spring', 540, 1.03],
      ['spring-gentle', 660, 1.011],
      ['spring-bouncy', 880, 1.205],
      ['spring-snappy', 420, 1.028],
    ] as const)('%s settles in %ims and overshoots to %f', (name, duration, overshoot) => {
      const curve = Springs.preset(name);

      expect(curve.duration).toBe(duration);
      expect(Math.max(...pointsOf(curve.easing))).toBe(overshoot);
    });

    it('samples a preset once and hands out the same curve after that', () => {
      expect(Springs.preset('spring-bouncy')).toBe(Springs.preset('spring-bouncy'));
    });

    it('writes the bouncy curve exactly', () => {
      expect(Springs.preset('spring-bouncy').easing).toBe(
        'linear(0,0.06,0.212,0.411,0.621,0.816,0.977,1.096,1.17,1.204,1.205,1.182,1.145,1.101,1.059,1.021,0.992,0.972,0.96,0.957,0.959,0.966,0.974,0.983,0.992,0.999,1.004,1.007,1.009,1.009,1.008,1.006,1)',
      );
    });
  });
});
