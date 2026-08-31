/**
 * Where a component keeps its DOM attributes — and how a component that hands attributes to
 * somebody else's element finds out.
 *
 * Two conventions meet here. Every icon set in the ecosystem spreads its props onto the element it
 * renders, so `<Sun role="img" />` reaches the `<svg>`; this library does the opposite on purpose
 * (convention #9), keeping attributes in a `props` bag so the top level can be all style props.
 * `Icon` speaks the first dialect, because that is what an icon set answers to — which meant that
 * an `<Icon label="Sort">` around one of *our* components handed `role`/`aria-label` to a Box as
 * top-level props, where they were dropped: an unnamed, `aria-hidden` icon, and no error anywhere
 * (bug #78).
 *
 * So the components that take the second route say so, and the adapter asks. It is one bit rather
 * than a list of component names, so a component added later is covered by marking itself.
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
