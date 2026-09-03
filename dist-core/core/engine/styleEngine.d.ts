import { BoxStyleProps } from '../../types';
import { BoxStyle } from '../coreTypes';
import { Components } from '../extends/boxComponents';
import { FlushScheduler } from './flushScheduler';
import { Keyframes } from './keyframes';
import { SinkMode, StyleElementDescriptor } from './styleSink';
/** Explicit engine configuration — replaces the previous NODE_ENV-based sniffing. */
export interface StylesConfiguration {
    /**
     * How class names are emitted: `'hashed'` (default, through the identity factory), `'readable'`
     * (kept as-is, for tests) or `'stable'` (content-hashed, so two processes agree — element mode's default).
     */
    classNames?: 'hashed' | 'readable' | 'stable';
    /**
     * Where rules are written: `'cssom'` (`insertRule`), `'textContent'`, `'string'` (in memory, for
     * `getStyles()`) or `'element'` (nowhere — they come back as `<style href precedence>` descriptors,
     * which is what works in a Server Component). Defaults to the environment; changing it re-emits everything.
     */
    sink?: SinkMode;
    /**
     * What the base class transitions — `'all'` by default, one of the `transition` prop's groups, or
     * `false` to declare nothing at all and leave transitions entirely to the props. Changing it after the
     * first render re-emits every rule, since the base block is written once.
     */
    transition?: string | false;
}
export interface StyleEngineOptions extends StylesConfiguration {
    /** The id of the `<style>` element this engine owns, so two engines cannot corrupt each other's rule order. */
    styleElementId?: string;
    /** When pending rules reach the sink — see `FlushScheduler`. `flushSync()` works regardless. */
    scheduler?: FlushScheduler;
}
/**
 * An isolated styling engine: its own class-name cache, rule registry, identity factory, variables,
 * prop registry (`Box.extend`) and component registry (`Box.components`) — nothing in module scope.
 */
export interface StyleEngine {
    /** The id of the `<style>` element this engine writes to. */
    readonly styleElementId: string;
    /**
     * The class list for a Box's props, cached. `signature` is null when the props would not serialize;
     * `styleElements` is element mode only, the base element first.
     */
    resolveClassNames(props: BoxStyleProps<any>, isSvg: boolean): {
        classNames: string[];
        signature: string | null;
        styleElements?: StyleElementDescriptor[];
    };
    /**
     * The class list as a `class` attribute value — the whole API a non-React adapter needs. The CSS
     * follows on the engine's own schedule; throws in element mode, where `resolveClassNames` is the way in.
     */
    classNames(props: BoxStyleProps<any>, options?: {
        svg?: boolean;
    }): string;
    /** Rules targeting a root selector (`html`) rather than a class. Returns style elements like `resolveClassNames`. */
    addGlobalStyles(props: BoxStyleProps<any>, selector: string): StyleElementDescriptor[] | undefined;
    /** Write every pending rule to this engine's sink, now. */
    flushSync(): void;
    /**
     * Say that rules are pending and let the `FlushScheduler` pick the moment, so many calls in one turn
     * produce one flush. The engine calls it itself; an adapter needs it only for rules it queued alone.
     */
    scheduleFlush(): void;
    /** The CSS emitted so far, as text. Flushes first, so a server render — where no effect runs — is complete. */
    getStyles(): string;
    /**
     * Drop everything emitted: rules, cached class lists, the name counter, resolved variables, the sink.
     * Registration (extended props, components, declared variables) survives. Call it between SSR requests.
     */
    clear(): void;
    /** Apply explicit configuration. Cached class names are dropped when the configuration changes. */
    configure(config: StylesConfiguration): void;
    extend<TProps extends Record<string, BoxStyle[]>, TPropTypes extends Record<string, BoxStyle[]>>(variables: Record<string, string>, extendedProps: TProps, extendedPropTypes: TPropTypes): {
        extendedProps: TProps;
        extendedPropTypes: TPropTypes;
    };
    components<T extends Components>(components: T): T;
    /**
     * Register `@keyframes` sequences, whose steps are Box props. Nothing is emitted until a rule names
     * one, so registering a library of them costs no CSS.
     */
    keyframes<T extends Keyframes>(keyframes: T): T;
    getComponentsStyles(): Components;
    getVariableValue(name: string): string;
}
export declare const DEFAULT_STYLE_ELEMENT_ID = "box-kite-styles";
export declare function createStyleEngine(options?: StyleEngineOptions): StyleEngine;
