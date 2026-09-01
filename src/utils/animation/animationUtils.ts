/**
 * The model behind `<Presence>`: how long the CSS already on an element says its current transition or
 * animation lasts. No React and no DOM — it reads a `CSSStyleDeclaration`-shaped record, so CSS's
 * list-cycling rules are testable without a browser, which is the only place they are ever exercised.
 */
namespace AnimationUtils {
  /** The computed timing properties `activeDuration` reads. A `CSSStyleDeclaration` satisfies it. */
  export interface Timing {
    transitionDuration: string;
    transitionDelay: string;
    animationName: string;
    animationDuration: string;
    animationDelay: string;
    animationIterationCount: string;
  }

  /**
   * One frame of head-room on a measured wait. The timer starts in the commit that applies the leaving
   * styles, and the browser only creates the transition on the style recalculation after it — so the
   * exit really ends a frame later than the duration alone says.
   */
  export const SETTLE_FRAME = 16;

  /** `'260ms'`, `'0.25s'`, `''` — a CSS time in the milliseconds a timer counts. */
  function milliseconds(value: string): number {
    const number = parseFloat(value);
    if (Number.isNaN(number)) return 0;

    return value.endsWith('ms') ? number : number * 1000;
  }

  /** A comma-separated CSS list. Never empty: `''` is one entry worth nothing. */
  function list(value: string): string[] {
    return value.split(',').map((entry) => entry.trim());
  }

  /**
   * A timing list shorter than the property list it belongs to repeats from the start — the rule that
   * makes `transition: opacity 200ms, transform` legal, and why this is a modulo rather than a zip.
   */
  function at(values: string[], index: number): string {
    return values[index % values.length];
  }

  /** An unset `animation-iteration-count` is one pass; `infinite` is not a number and never finishes. */
  function iterations(value: string): number {
    return value === '' ? 1 : parseFloat(value);
  }

  /** The longest transition on the element, each property counted with its own delay. */
  function transitionTotal(timing: Timing): number {
    const durations = list(timing.transitionDuration);
    const delays = list(timing.transitionDelay);
    let longest = 0;

    for (let index = 0; index < Math.max(durations.length, delays.length); index++) {
      longest = Math.max(longest, milliseconds(at(durations, index)) + milliseconds(at(delays, index)));
    }

    return longest;
  }

  /** The longest *finite* animation. An infinite one has no end, so there is nothing to wait for. */
  function animationTotal(timing: Timing): number {
    const durations = list(timing.animationDuration);
    const delays = list(timing.animationDelay);
    const counts = list(timing.animationIterationCount);

    return list(timing.animationName).reduce((longest, name, index) => {
      if (name === '' || name === 'none') return longest;

      const count = iterations(at(counts, index));
      if (!Number.isFinite(count)) return longest;

      return Math.max(longest, milliseconds(at(durations, index)) * count + milliseconds(at(delays, index)));
    }, 0);
  }

  /**
   * How long the element's own CSS says it has left to move, in ms. `0` means nothing is set up to run —
   * which is also what `prefers-reduced-motion` produces, since every Box transition rides
   * `--transitionTime` and that media query sets it to `0s`.
   */
  export function activeDuration(timing: Timing): number {
    return Math.max(transitionTotal(timing), animationTotal(timing));
  }
}

export default AnimationUtils;
