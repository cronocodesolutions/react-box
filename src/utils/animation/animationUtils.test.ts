import { describe, expect, it } from 'vitest';
import AnimationUtils from './animationUtils';

/**
 * The wait `<Presence>` measures, read straight off a computed style. Every list here is a shape a
 * browser really produces — which is the point of testing the parser rather than the browser.
 */
describe('AnimationUtils.activeDuration', () => {
  const timing = (overrides: Partial<AnimationUtils.Timing> = {}): AnimationUtils.Timing => ({
    transitionDuration: '',
    transitionDelay: '',
    animationName: '',
    animationDuration: '',
    animationDelay: '',
    animationIterationCount: '',
    ...overrides,
  });

  it('is zero when nothing is set up to run', () => {
    expect(AnimationUtils.activeDuration(timing())).toBe(0);
  });

  it('reads both CSS time units', () => {
    expect(AnimationUtils.activeDuration(timing({ transitionDuration: '260ms' }))).toBe(260);
    expect(AnimationUtils.activeDuration(timing({ transitionDuration: '0.25s' }))).toBe(250);
  });

  it('is zero under reduced motion, where the base transition resolves to 0s', () => {
    expect(AnimationUtils.activeDuration(timing({ transitionDuration: '0s' }))).toBe(0);
  });

  it('counts each property with its own delay and takes the longest', () => {
    const style = timing({ transitionDuration: '100ms, 200ms', transitionDelay: '150ms, 0ms' });

    // 100 + 150 beats 200 + 0.
    expect(AnimationUtils.activeDuration(style)).toBe(250);
  });

  it('repeats a short timing list the way CSS repeats it', () => {
    // `transition: opacity 200ms, transform` — one duration against two properties.
    expect(AnimationUtils.activeDuration(timing({ transitionDuration: '200ms', transitionDelay: '0ms, 300ms' }))).toBe(500);
  });

  it('counts a finite animation, iterations included', () => {
    const style = timing({ animationName: 'fade', animationDuration: '150ms', animationIterationCount: '3', animationDelay: '50ms' });

    expect(AnimationUtils.activeDuration(style)).toBe(500);
  });

  it('treats an unset iteration count as one pass', () => {
    expect(AnimationUtils.activeDuration(timing({ animationName: 'fade', animationDuration: '150ms' }))).toBe(150);
  });

  it('ignores an infinite animation, which has no end to wait for', () => {
    const style = timing({ animationName: 'spin', animationDuration: '1000ms', animationIterationCount: 'infinite' });

    expect(AnimationUtils.activeDuration(style)).toBe(0);
  });

  it('waits for the finite animation next to an infinite one', () => {
    const style = timing({
      animationName: 'spin, fade',
      animationDuration: '1000ms, 200ms',
      animationIterationCount: 'infinite, 1',
    });

    expect(AnimationUtils.activeDuration(style)).toBe(200);
  });

  it('ignores a named-but-absent animation', () => {
    expect(AnimationUtils.activeDuration(timing({ animationName: 'none', animationDuration: '400ms' }))).toBe(0);
  });

  it('takes whichever of a transition and an animation lasts longer', () => {
    const style = timing({ transitionDuration: '300ms', animationName: 'fade', animationDuration: '500ms' });

    expect(AnimationUtils.activeDuration(style)).toBe(500);
  });
});
