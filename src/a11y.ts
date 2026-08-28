/**
 * `@cronocode/react-box/a11y` — the behaviour primitives the accessible components are built from.
 *
 * Every APG pattern needs the same four mechanics: return focus to whatever opened a layer, move
 * through a list with the arrow keys, close on Escape or a press outside, and hold a value the
 * consumer may or may not own. Getting those right is most of the work in an accessible component
 * and none of it is visible in the markup, which is why they live here as one tested
 * implementation instead of once per component.
 *
 * They are shipped rather than hidden because the components in this library will never cover
 * every pattern an application needs — a consumer building their own tree view or split button
 * should not have to reimplement the mechanics to make it behave like the ones we ship.
 *
 * These are client hooks: the entry carries a `'use client'` banner, so importing it from a Server
 * Component opens a client boundary. `VisuallyHidden` is a component rather than a hook and ships
 * as `@cronocode/react-box/components/visuallyHidden`, where it can still render on a server.
 */
export { default as useControllableState } from './react/a11y/useControllableState';
export type { ChangeDetails, ChangeHandler, ControllableStateOptions, SetControllableState } from './react/a11y/useControllableState';

export { default as useDismiss } from './react/a11y/useDismiss';
export type { DismissOptions, DismissReason, ElementLike } from './react/a11y/useDismiss';

export { default as useFocusReturn } from './react/a11y/useFocusReturn';
export type { FocusReturnOptions } from './react/a11y/useFocusReturn';

export { default as useIdentifier } from './react/a11y/useIdentifier';

export { default as useRovingFocus } from './react/a11y/useRovingFocus';
export type {
  RovingFocus,
  RovingFocusItemProps,
  RovingFocusOptions,
  RovingFocusReason,
  RovingOrientation,
} from './react/a11y/useRovingFocus';
