/**
 * Content-addressed identity for generated CSS.
 *
 * The default engine names classes from a counter (`IdentityFactory`), which is perfect while one
 * process owns every render. Element mode breaks that assumption: the same props are resolved in a
 * Server Component, in the client bundle, and in the next request of a long-lived server, and all
 * three have to agree — a `<style href>` React dedupes by, and the class name that rule targets,
 * must be a function of the CSS itself, not of how many rules happened to be generated first.
 */

/**
 * FNV-1a run twice with the two constants swapped, so the result carries ~64 bits of state instead
 * of 32. Cheap enough to call per rule, and the collision probability across a few thousand rules
 * is far below anything that could matter here.
 */
export function stableHash(text: string): string {
  let h1 = 0x811c9dc5;
  let h2 = 0x01000193;

  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    h1 = Math.imul(h1 ^ char, 0x01000193) >>> 0;
    h2 = Math.imul(h2 ^ char, 0x811c9dc5) >>> 0;
  }

  return `${h1.toString(36)}${h2.toString(36)}`;
}
