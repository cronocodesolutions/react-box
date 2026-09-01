/**
 * Spring physics as a CSS easing. A damped harmonic oscillator is sampled into `linear()` — already a
 * value on both timing-function props — so a spring costs no JavaScript at all once the curve is a string.
 * The curve is progress: it passes 1 and comes back when the spring overshoots, and it is normalized over
 * the settling time, which is why a spring is a *pair* (`easing` and `duration`) rather than a curve alone.
 */
namespace Springs {
  /** Half a percent of the travel left: past this nobody sees the difference, and the curve has to end somewhere. */
  const restDelta = 0.005;

  /** A spring that never settles would sample forever. */
  const maxDuration = 10000;

  export interface SpringOptions {
    /** How hard the spring pulls toward its target — higher is faster and tighter. Default 180. */
    stiffness?: number;
    /** What resists the motion. Below `2 * sqrt(stiffness * mass)` the spring overshoots and comes back. Default 20. */
    damping?: number;
    /** Default 1. Heavier is slower, and overshoots more for the same damping. */
    mass?: number;
    /** Progress per second at the start — a throw rather than a release. Default 0. */
    velocity?: number;
  }

  export interface Spring {
    /** The sampled curve, for `transitionTimingFunction` / `animationTimingFunction`. */
    easing: `linear(${string})`;
    /** Milliseconds until it comes to rest, for `transitionDuration` / `animationDuration`. */
    duration: number;
  }

  /** How far there is still to go at `t` seconds: 1 at the start, 0 at rest, negative while overshooting. */
  function remaining({ stiffness, damping, mass, velocity }: Required<SpringOptions>): (t: number) => number {
    const frequency = Math.sqrt(stiffness / mass);
    const ratio = damping / (2 * Math.sqrt(stiffness * mass));

    if (ratio < 1) {
      const damped = frequency * Math.sqrt(1 - ratio * ratio);
      const amplitude = (ratio * frequency - velocity) / damped;

      return (t) => Math.exp(-ratio * frequency * t) * (Math.cos(damped * t) + amplitude * Math.sin(damped * t));
    }

    if (ratio === 1) return (t) => Math.exp(-frequency * t) * (1 + (frequency - velocity) * t);

    const decay = frequency * Math.sqrt(ratio * ratio - 1);
    const fast = -ratio * frequency + decay;
    const slow = -ratio * frequency - decay;
    const share = (-velocity - slow) / (fast - slow);

    return (t) => share * Math.exp(fast * t) + (1 - share) * Math.exp(slow * t);
  }

  /** The last 10ms tick that is still moving. Scanned from the far end, so a fast spring answers first. */
  function settleTime(distance: (t: number) => number): number {
    for (let ms = maxDuration; ms >= 20; ms -= 10) {
      if (Math.abs(distance(ms / 1000)) >= restDelta) return ms + 10;
    }

    return 20;
  }

  /**
   * Three decimals, and no more: the string lands in a class name and in a rule, so it has to come out
   * identical in Node and in the browser — `Math.exp` is not promised to agree to the last bit.
   */
  function round(value: number): number {
    return Math.round(value * 1000) / 1000;
  }

  /** A spring sampled into a CSS easing and the time it takes. */
  export function spring(options: SpringOptions = {}): Spring {
    const { stiffness = 180, damping = 20, mass = 1, velocity = 0 } = options;
    const distance = remaining({ stiffness, damping, mass, velocity });
    const duration = settleTime(distance);
    // One point per ~25ms: enough that linear interpolation between two of them is invisible, few enough
    // that the value stays a value. `linear()` spaces them evenly, so no point carries a position.
    const steps = Math.min(32, Math.max(12, Math.ceil(duration / 25)));
    const points: string[] = [];

    for (let step = 0; step <= steps; step++) points.push(String(round(1 - distance((step / steps) * (duration / 1000)))));

    // The two ends are exact by definition, and rounding must not leave a curve that starts short of 0 or never arrives.
    points[0] = '0';
    points[steps] = '1';

    return { easing: `linear(${points.join(',')})`, duration };
  }

  export const presetNames = ['spring', 'spring-gentle', 'spring-bouncy', 'spring-snappy'] as const;

  export type PresetName = (typeof presetNames)[number];

  /** The four families, in the spread that matters: 420ms and barely a bounce, up to 880ms and 20% past the target. */
  const presetOptions: Record<PresetName, SpringOptions> = {
    spring: { stiffness: 180, damping: 20 },
    'spring-gentle': { stiffness: 120, damping: 18 },
    'spring-bouncy': { stiffness: 180, damping: 12 },
    'spring-snappy': { stiffness: 300, damping: 26 },
  };

  const sampled = new Map<PresetName, Spring>();

  /** Sampled on first use and kept — a page that names no spring samples none, the way an unused preset writes no keyframes. */
  export function preset(name: PresetName): Spring {
    let curve = sampled.get(name);

    if (!curve) sampled.set(name, (curve = spring(presetOptions[name])));

    return curve;
  }
}

export default Springs;
