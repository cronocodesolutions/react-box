import { BoxComponentStyles, BoxStyleProps, ComponentsAndVariants } from '../../types';
import { Components } from './boxComponents';
/**
 * Pure component-style resolution (no hooks). Resolves the base component styles by
 * dot-notation and applies variants. Kept hook-free so `useStyles` can call it lazily
 * on a style-cache miss instead of paying a per-instance `useMemo` on every Box.
 * The registry is passed in so it stays tied to the calling engine instance.
 */
export declare function resolveComponentStyles<TKey extends keyof ComponentsAndVariants = never>(props: BoxStyleProps<TKey>, componentsStyles: Components): BoxComponentStyles | undefined;
