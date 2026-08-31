/**
 * Where a component keeps its DOM attributes, and how a component handing them to somebody else’s element
 * finds out. Every icon set spreads its props onto the element it renders; this library keeps them in a
 * `props` bag. `Icon` speaks the first dialect, so an `<Icon label="Sort">` around one of *our* components
 * handed `role` to a Box at the top level, where it was dropped — an unnamed icon, no error (bug #78). One
 * bit rather than a list of names, so a component added later is covered by marking itself.
 */
const MARKER = '__boxAttributesInProps';

/** Marks a component of this library's own: its DOM attributes belong in `props`, not on top. */
export function withAttributesInProps<TComponent>(component: TComponent): TComponent {
  (component as Record<string, unknown>)[MARKER] = true;

  return component;
}

/** Whether an element's `type` is one of those components. Anything else takes attributes on top. */
export function hasAttributesInProps(type: unknown): boolean {
  return typeof type === 'function' || (typeof type === 'object' && type !== null)
    ? (type as Record<string, unknown>)[MARKER] === true
    : false;
}
