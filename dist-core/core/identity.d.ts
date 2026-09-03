/**
 * Counter-addressed identity for generated CSS: the short names a class gets while one process owns
 * every render (`hash.ts` is the content-addressed half, for when it does not). Base-52 for the first
 * character because a class name may not start with a digit, base-62 for every character after it.
 */
export default class IdentityFactory {
    private index;
    private cache;
    /** The name for a key: minted on first ask and kept, so the same key always answers the same name. */
    getIdentity(key: string): string;
    getByIndex(index: number): string;
}
