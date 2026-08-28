/**
 * "Is there a DOM, and what may I touch?" — asked in seven places across the engine, the React
 * binding, the shared hooks and the components, and previously answered with a hand-written
 * `typeof` in every one of them.
 *
 * Worth centralising because the answers are not interchangeable and the differences are easy to
 * get wrong: a server render has no `document` at all, a `document` may exist without a `<head>` to
 * write into, and `window.matchMedia` is missing from environments that otherwise look like
 * browsers (jsdom by default, older embedded webviews).
 *
 * Framework-free, so the engine may use it: `src/core.ts` reaches this file and
 * `npm run check:boundaries` checks it for React along with the rest of the core graph.
 *
 * Plain named exports rather than the `namespace XUtils` idiom the other utils use. This module is
 * imported by every chunk the build emits, and a namespace object compiles to an IIFE that ships
 * whole — a consumer needing `hasDocument` would carry `matchMedia` with it. Named exports are
 * tree-shaken one function at a time.
 */

/** A browser: a window with a document. What an effect that touches layout needs to exist. */
export function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.document !== 'undefined';
}

/** Whether there is a document at all — false during a server render. */
export function hasDocument(): boolean {
  return typeof document !== 'undefined';
}

/** The document, or null when there is none, so a caller can `?.` instead of branching. */
export function documentOrNull(): Document | null {
  return hasDocument() ? document : null;
}

/** The document root (`<html>`), or null when there is no DOM. */
export function documentRoot(): Element | null {
  return documentOrNull()?.documentElement ?? null;
}

/** The `<head>` to write a stylesheet into, or null when there is nothing to write to. */
export function documentHead(): HTMLHeadElement | null {
  return documentOrNull()?.head ?? null;
}

/** A media query, or null where `matchMedia` does not exist — a server, or a bare jsdom. */
export function matchMedia(query: string): MediaQueryList | null {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return null;

  return window.matchMedia(query);
}
