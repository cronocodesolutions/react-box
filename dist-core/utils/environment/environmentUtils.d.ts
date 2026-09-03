/**
 * "Is there a DOM, and what may I touch?" — asked in seven places and once answered with a hand-written
 * `typeof` in each. The answers are not interchangeable: a server render has no `document`, a `document`
 * may have no `<head>`, and `matchMedia` is missing from environments that look like browsers. Named
 * exports rather than a namespace, which compiles to an IIFE that ships whole, and every chunk imports this.
 */
/** A browser: a window with a document. What an effect that touches layout needs to exist. */
export declare function isBrowser(): boolean;
/** Whether there is a document at all — false during a server render. */
export declare function hasDocument(): boolean;
/** The document, or null when there is none, so a caller can `?.` instead of branching. */
export declare function documentOrNull(): Document | null;
/** The document root (`<html>`), or null when there is no DOM. */
export declare function documentRoot(): Element | null;
/** The `<head>` to write a stylesheet into, or null when there is nothing to write to. */
export declare function documentHead(): HTMLHeadElement | null;
/** A media query, or null where `matchMedia` does not exist — a server, or a bare jsdom. */
export declare function matchMedia(query: string): MediaQueryList | null;
