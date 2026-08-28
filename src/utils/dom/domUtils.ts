/**
 * "Did this happen inside that?" — the question behind every popup that closes when you click away,
 * asked identically by `useVisibility` (the click-outside hook the Dropdown uses) and `useDismiss`
 * (the layered one the accessible components use).
 *
 * `ElementLike` is structural rather than `React.RefObject`, which keeps this file framework-free:
 * a caller holding a ref and a caller holding an element both pass what they have.
 *
 * Named exports rather than the `namespace XUtils` idiom, for the reason given in
 * `environmentUtils.ts`: this is a leaf several chunks import, and a namespace object cannot be
 * tree-shaken a function at a time.
 */
export type ElementLike = { readonly current: Element | null } | Element | null | undefined;

/** The element behind a ref or an element, whichever the caller happens to be holding. */
export function elementOf(value: ElementLike): Element | null {
  if (!value) return null;

  return 'current' in value ? value.current : value;
}

/** The same, narrowed to an `HTMLElement` — for callers that need `focus()` or `style`. */
export function htmlElementOf(value: ElementLike): HTMLElement | null {
  const element = elementOf(value);

  return element instanceof HTMLElement ? element : null;
}

/**
 * Whether an event happened inside any of these elements.
 *
 * `composedPath()` first, so an event from inside a shadow root is still recognised as inside its
 * host; `contains()` as the fallback, since the path is only populated while the event is being
 * dispatched and not every environment provides the method.
 */
export function isEventInside(event: Event, elements: readonly ElementLike[]): boolean {
  const path = typeof event.composedPath === 'function' ? event.composedPath() : [];

  return elements.some((value) => {
    const element = elementOf(value);
    if (!element) return false;

    return path.includes(element) || (event.target instanceof Node && element.contains(event.target));
  });
}
