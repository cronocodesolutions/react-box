import { BoxStyleValue } from './coreTypes';
import { default as Springs } from './springs';
/**
 * The values the animation and transition props take that are more than a CSS keyword: the four presets,
 * the easing escape hatch, and the property groups `transition` accepts.
 */
declare namespace Animations {
    const presetNames: readonly ["spin", "pulse", "bounce", "ping"];
    type PresetName = (typeof presetNames)[number];
    /**
     * The `animation` shorthand each preset writes. Durations ride `--transitionTime` rather than naming
     * seconds, so a preset stops under `prefers-reduced-motion` for the reason every Box transition does.
     */
    const presets: Record<PresetName, string>;
    /**
     * An easing curve CSS computes rather than one of the keywords — `cubic-bezier()`, `steps()`, and the
     * `linear()` a sampled spring compiles to. A template type rather than `string`, so the keywords keep
     * their autocomplete beside it.
     */
    type TimingFunction = `cubic-bezier(${string})` | `steps(${string})` | `linear(${string})`;
    const timingFunction: TimingFunction;
    const springNames: readonly ["spring", "spring-gentle", "spring-bouncy", "spring-snappy"];
    type SpringName = Springs.PresetName;
    /** The curve half of a spring preset, sampled once and shared by every rule that names it. */
    function springEasing(name: SpringName): string;
    /**
     * The other half: a sampled spring has a fixed settling time, and naming it on the duration prop is what
     * makes the physics look right. Counted in `--transitionTime` units, so reduced motion stops a spring too.
     */
    function springDuration(name: SpringName): string;
    /**
     * An easing declaration, and under a `linear()` curve the `ease-out` it degrades to: the ~13% of browsers
     * without `linear()` drop the second line and keep the first. `cubic-bezier()` and `steps()` need no such thing.
     */
    function easingDeclarations(styleName: string, value: string): string;
    /** The definition's `match`: one balanced easing function, so a typo emits nothing at all. */
    function isTimingFunction(value: BoxStyleValue): boolean;
    /**
     * What `transition` transitions, by group rather than by CSS property name — the same groups Tailwind
     * ships, because "which properties are the colours" is not a question worth asking twice. `all` is
     * still the default every Box gets from the base class.
     */
    const propertyGroups: {
        readonly colors: "color, background-color, border-color, outline-color, text-decoration-color, fill, stroke";
        readonly opacity: "opacity";
        readonly shadow: "box-shadow, text-shadow";
        readonly transform: "transform, translate, rotate, scale";
        readonly size: "width, height";
        readonly filter: "filter, backdrop-filter";
    };
    type PropertyGroup = keyof typeof propertyGroups;
    const propertyGroupNames: PropertyGroup[];
}
export default Animations;
