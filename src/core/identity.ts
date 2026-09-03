/**
 * Counter-addressed identity for generated CSS: the short names a class gets while one process owns
 * every render (`hash.ts` is the content-addressed half, for when it does not). Base-52 for the first
 * character because a class name may not start with a digit, base-62 for every character after it.
 */

const FIRST = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const NEXT = `${FIRST}0123456789`;

export default class IdentityFactory {
  private index = 0;
  private cache: Record<string, string> = {};

  /** The name for a key: minted on first ask and kept, so the same key always answers the same name. */
  getIdentity(key: string): string {
    return (this.cache[key] ??= this.getByIndex(this.index++));
  }

  getByIndex(index: number): string {
    const nextIndex = index - FIRST.length;

    if (nextIndex < 0) return FIRST[index];

    const cycles = Math.floor(nextIndex / NEXT.length);

    return this.getByIndex(cycles) + NEXT[nextIndex - cycles * NEXT.length];
  }
}
