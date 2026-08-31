// Whether the prerendered HTML has been adopted yet. The site's one piece of state React does not
// own: what mounts *with* the page is already on screen, what mounts after it is a real mount.
let hydrated = false;

export function hasHydrated(): boolean {
  return hydrated;
}

export function hydrationFinished(): void {
  hydrated = true;
}
