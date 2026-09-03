/**
 * "Did this happen inside that?" — the question behind every popup that closes when you click away, asked
 * identically by `useVisibility` and `useDismiss`. `ElementLike` is structural rather than
 * `React.RefObject`, which keeps the file framework-free. Named exports rather than a namespace, for the
 * reason in `environmentUtils.ts`: a namespace object cannot be tree-shaken a function at a time.
 */
export type ElementLike = {
    readonly current: Element | null;
} | Element | null | undefined;
/** The element behind a ref or an element, whichever the caller happens to be holding. */
export declare function elementOf(value: ElementLike): Element | null;
/** The same, narrowed to an `HTMLElement` — for callers that need `focus()` or `style`. */
export declare function htmlElementOf(value: ElementLike): HTMLElement | null;
/**
 * Whether an event happened inside any of these elements. `composedPath()` first, so an event from a
 * shadow root counts as inside its host; `contains()` as the fallback, since the path is populated only
 * while the event is being dispatched.
 */
export declare function isEventInside(event: Event, elements: readonly ElementLike[]): boolean;
/**
 * Whether this element reads right to left — the direction the browser *resolved*, which is the only
 * form of the answer that accounts for a `dir="auto"` or a `<bdi>` above it. Nothing but
 * `getComputedStyle` knows it, and jsdom computes no direction at all, so a test environment reads as
 * left to right — which is the initial value anyway.
 */
export declare function isRtl(value: ElementLike): boolean;
