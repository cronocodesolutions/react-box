import { BoxStyleValue } from './coreTypes';
/**
 * Container queries: the same question a breakpoint asks, addressed to the element's own container
 * instead of the viewport. `cq={{ md: … }}` queries the nearest one, `cq={{ 'sidebar/md': … }}` the
 * container named `sidebar`; the `container` prop is what makes an element one.
 *
 * A key the grammar does not accept produces no rule and no class name, the way a `Variants` key does —
 * the container *name* lands in an at-rule prelude, so it is validated before it becomes one.
 */
declare namespace Containers {
    /** The nesting key. The engine dispatches on this record, the way it does on `breakpoints`. */
    const containerQueryKey: {
        /** Styles that answer to the width of a container rather than the viewport: `cq={{ md: { d: 'row' } }}`. */
        cq: string;
    };
    /**
     * The scale, in rem — Tailwind's `@xs`…`@2xl`, so a component copied from there queries at the same
     * widths. Deliberately far smaller than the breakpoints: a card is 400px wide, a viewport is not.
     */
    const containerSizes: {
        /** 20rem — 320px. */
        xs: number;
        /** 24rem — 384px. */
        sm: number;
        /** 28rem — 448px. */
        md: number;
        /** 32rem — 512px. */
        lg: number;
        /** 36rem — 576px. */
        xl: number;
        /** 42rem — 672px. */
        xxl: number;
    };
    type SizeKey = keyof typeof containerSizes;
    /** The complement of a size, not a `max-width` an epsilon below it: `md` and `maxMd` never both match. */
    type MaxKey = `max${Capitalize<SizeKey>}`;
    /** One `cq` key: a size, alone or against a named container — `md`, `maxMd`, `sidebar/md`. */
    type QueryKey = SizeKey | MaxKey | `${string}/${SizeKey | MaxKey}`;
    /** One compiled query: where it sorts, and the at-rule it wraps its rule in. */
    interface Query {
        /** The class-name segment and part of the rule key, prefixed so `cq={{ md }}` and the `md` breakpoint cannot collide. */
        key: string;
        /** Which cascade slot it takes — the *size*, since a name changes what a query asks, not where it lands. */
        rankKey: string;
        /** The at-rule prelude, the space after `@container` included. */
        prelude: string;
    }
    /**
     * The cascade slots this family takes, between the breakpoints and the preferences: a question about
     * the element's own container is a more local statement than one about the viewport, and neither is a
     * reason to override what the reader asked for. Sizes ascend, then the `max` keys **descend** — the
     * narrower `max` matches fewer containers, so it has to land later to win where two of them overlap.
     */
    const rankKeys: readonly string[];
    /** Whether a value may be written as a container name — the `container`/`containerName` props' `match`. */
    function isContainerName(value: BoxStyleValue): boolean;
    /** One `cq` key compiled, or null when the grammar accepts neither its size nor its container name. */
    function query(key: string): Query | null;
}
export default Containers;
