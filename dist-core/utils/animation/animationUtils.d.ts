/**
 * The model behind `<Presence>`: how long the CSS already on an element says its current transition or
 * animation lasts. No React and no DOM — it reads a `CSSStyleDeclaration`-shaped record, so CSS's
 * list-cycling rules are testable without a browser, which is the only place they are ever exercised.
 */
declare namespace AnimationUtils {
    /** The computed timing properties `activeDuration` reads. A `CSSStyleDeclaration` satisfies it. */
    interface Timing {
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
    const SETTLE_FRAME = 16;
    /**
     * How long the element's own CSS says it has left to move, in ms. `0` means nothing is set up to run —
     * which is also what `prefers-reduced-motion` produces, since every Box transition rides
     * `--transitionTime` and that media query sets it to `0s`.
     */
    function activeDuration(timing: Timing): number;
}
export default AnimationUtils;
