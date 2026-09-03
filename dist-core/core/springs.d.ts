/**
 * Spring physics as a CSS easing. A damped harmonic oscillator is sampled into `linear()` — already a
 * value on both timing-function props — so a spring costs no JavaScript at all once the curve is a string.
 * The curve is progress: it passes 1 and comes back when the spring overshoots, and it is normalized over
 * the settling time, which is why a spring is a *pair* (`easing` and `duration`) rather than a curve alone.
 */
declare namespace Springs {
    interface SpringOptions {
        /** How hard the spring pulls toward its target — higher is faster and tighter. Default 180. */
        stiffness?: number;
        /** What resists the motion. Below `2 * sqrt(stiffness * mass)` the spring overshoots and comes back. Default 20. */
        damping?: number;
        /** Default 1. Heavier is slower, and overshoots more for the same damping. */
        mass?: number;
        /** Progress per second at the start — a throw rather than a release. Default 0. */
        velocity?: number;
    }
    interface Spring {
        /** The sampled curve, for `transitionTimingFunction` / `animationTimingFunction`. */
        easing: `linear(${string})`;
        /** Milliseconds until it comes to rest, for `transitionDuration` / `animationDuration`. */
        duration: number;
    }
    /** A spring sampled into a CSS easing and the time it takes. */
    function spring(options?: SpringOptions): Spring;
    const presetNames: readonly ["spring", "spring-gentle", "spring-bouncy", "spring-snappy"];
    type PresetName = (typeof presetNames)[number];
    /** Sampled on first use and kept — a page that names no spring samples none, the way an unused preset writes no keyframes. */
    function preset(name: PresetName): Spring;
}
export default Springs;
