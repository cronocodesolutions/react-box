import { useState } from 'react';

// Whether the prerendered HTML has been adopted yet. The site's one piece of state React does not
// own: what mounts *with* the page is already on screen, what mounts after it is a real mount.
let hydrated = false;

export function hasHydrated(): boolean {
  return hydrated;
}

export function hydrationFinished(): void {
  hydrated = true;
}

/**
 * Whether *this* mount is a real one rather than the prerendered first paint — which is the whole
 * question an entrance animation has to answer here. `startingStyle` fires the first time an element is
 * styled, and for prerendered HTML that is the initial paint, so every entrance on the site is gated on
 * this and only a client-side navigation (or a keyed swap) animates. Read once, on purpose: the answer
 * belongs to the mount, not to the render.
 */
export function useIsRealMount(): boolean {
  const [real] = useState(hasHydrated);

  return real;
}
