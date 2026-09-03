import { BoxStyles } from '../../types';
/** Where one step of a sequence sits: the two keywords, or a percentage of the way through. */
export type KeyframeStop = 'from' | 'to' | `${number}%`;
/** One `@keyframes` sequence: its stops, each holding Box props rather than CSS. */
export type KeyframeStops = Partial<Record<KeyframeStop, BoxStyles>>;
/** What `Box.keyframes()` takes: sequences by name, the names `animationName` then refers to. */
export type Keyframes = Record<string, KeyframeStops>;
export interface KeyframesRegistry {
    /** Add sequences. A name already registered is replaced, and re-emitted if it was already used. */
    register(keyframes: Keyframes): void;
    /** Mark the names a rule just referenced, so the ones this registry knows reach the stylesheet. */
    use(names: readonly string[]): void;
    hasPending(): boolean;
    /** The sequences waiting to be written, as `[name, stops]`, and they are no longer waiting after. */
    drainPending(): [string, KeyframeStops][];
    /** Forget what has been emitted — the registrations themselves are configuration and survive. */
    reset(): void;
}
/**
 * The keyframes one engine knows. Registration is free and emission is lazy: nothing reaches the
 * stylesheet until a rule names it, which is what keeps four unused presets out of every page.
 */
export default function createKeyframesRegistry(): KeyframesRegistry;
