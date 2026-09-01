import { BoxStyleValue } from './coreTypes';

/**
 * Container queries: the same question a breakpoint asks, addressed to the element's own container
 * instead of the viewport. `cq={{ md: … }}` queries the nearest one, `cq={{ 'sidebar/md': … }}` the
 * container named `sidebar`; the `container` prop is what makes an element one.
 *
 * A key the grammar does not accept produces no rule and no class name, the way a `Variants` key does —
 * the container *name* lands in an at-rule prelude, so it is validated before it becomes one.
 */
namespace Containers {
  /** The nesting key. The engine dispatches on this record, the way it does on `breakpoints`. */
  export const containerQueryKey = {
    /** Styles that answer to the width of a container rather than the viewport: `cq={{ md: { d: 'row' } }}`. */
    cq: '@container',
  };

  /**
   * The scale, in rem — Tailwind's `@xs`…`@2xl`, so a component copied from there queries at the same
   * widths. Deliberately far smaller than the breakpoints: a card is 400px wide, a viewport is not.
   */
  export const containerSizes = {
    /** 20rem — 320px. */
    xs: 20,
    /** 24rem — 384px. */
    sm: 24,
    /** 28rem — 448px. */
    md: 28,
    /** 32rem — 512px. */
    lg: 32,
    /** 36rem — 576px. */
    xl: 36,
    /** 42rem — 672px. */
    xxl: 42,
  };

  export type SizeKey = keyof typeof containerSizes;
  /** The complement of a size, not a `max-width` an epsilon below it: `md` and `maxMd` never both match. */
  export type MaxKey = `max${Capitalize<SizeKey>}`;
  /** One `cq` key: a size, alone or against a named container — `md`, `maxMd`, `sidebar/md`. */
  export type QueryKey = SizeKey | MaxKey | `${string}/${SizeKey | MaxKey}`;

  /** One compiled query: where it sorts, and the at-rule it wraps its rule in. */
  export interface Query {
    /** The class-name segment and part of the rule key, prefixed so `cq={{ md }}` and the `md` breakpoint cannot collide. */
    key: string;
    /** Which cascade slot it takes — the *size*, since a name changes what a query asks, not where it lands. */
    rankKey: string;
    /** The at-rule prelude, the space after `@container` included. */
    prelude: string;
  }

  const sizeKeys = Object.keys(containerSizes) as SizeKey[];

  function maxKeyOf(size: string): string {
    return `max${size[0].toUpperCase()}${size.slice(1)}`;
  }

  // Every size key and its complement, as the condition each stands for. A Map rather than an object:
  // the keys come from a caller, and `conditions['constructor']` on a literal is not undefined.
  const conditions = new Map<string, string>(
    sizeKeys.flatMap((size) => [
      [size, `(min-width: ${containerSizes[size]}rem)`] as [string, string],
      [maxKeyOf(size), `not (min-width: ${containerSizes[size]}rem)`] as [string, string],
    ]),
  );

  /**
   * The cascade slots this family takes, between the breakpoints and the preferences: a question about
   * the element's own container is a more local statement than one about the viewport, and neither is a
   * reason to override what the reader asked for. Sizes ascend, then the `max` keys **descend** — the
   * narrower `max` matches fewer containers, so it has to land later to win where two of them overlap.
   */
  export const rankKeys: readonly string[] = [
    ...sizeKeys.map((size) => `cq-${size}`),
    ...[...sizeKeys].reverse().map((size) => `cq-${maxKeyOf(size)}`),
  ];

  // A container name is a `<custom-ident>`: what the parser takes, minus the words the prelude itself
  // uses — `not`/`and`/`or` there would compile to a query nobody wrote.
  const containerName = /^[a-zA-Z_][\w-]*$/;
  const reservedNames = new Set(['none', 'and', 'or', 'not', 'normal', 'initial', 'inherit', 'unset', 'revert', 'revert-layer', 'default']);

  /** Whether a value may be written as a container name — the `container`/`containerName` props' `match`. */
  export function isContainerName(value: BoxStyleValue): boolean {
    return typeof value === 'string' && containerName.test(value) && !reservedNames.has(value.toLowerCase());
  }

  /** One `cq` key compiled, or null when the grammar accepts neither its size nor its container name. */
  export function query(key: string): Query | null {
    const trimmed = key.trim();
    // The *last* slash separates the two: a name cannot hold one, so an earlier one is already a typo.
    const separator = trimmed.lastIndexOf('/');
    const name = separator === -1 ? null : trimmed.slice(0, separator);
    const condition = conditions.get(separator === -1 ? trimmed : trimmed.slice(separator + 1));

    if (!condition || (name !== null && !isContainerName(name))) return null;

    return {
      key: `cq-${trimmed}`,
      rankKey: `cq-${separator === -1 ? trimmed : trimmed.slice(separator + 1)}`,
      prelude: `@container ${name ? `${name} ` : ''}${condition}`,
    };
  }
}

export default Containers;
