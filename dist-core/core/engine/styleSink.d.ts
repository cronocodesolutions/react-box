/** A generated rule plus the sort key that fixes its position in the cascade. */
export interface SortedRule {
    sortKey: number;
    rule: string;
}
/**
 * One hoistable `<style>` element: its CSS, the `href` React 19 dedupes it by, and its precedence group.
 * Element mode hands these to the adapter instead of writing anywhere, which is what makes it work in a
 * Server Component, where there is no effect and no DOM.
 */
export interface StyleElementDescriptor {
    /** Content-addressed: the same CSS always produces the same href, in every process. */
    href: string;
    css: string;
    precedence: string;
    /** Cascade position, so a list of descriptors can be kept in rule order. */
    sortKey: number;
}
/** The precedence group of the engine's base element (reset, `:root`, the cascade-layer order). */
export declare const BASE_PRECEDENCE = "rb-base";
/** The precedence group every generated rule element belongs to. */
export declare const RULE_PRECEDENCE = "rb";
export type SinkMode = 'cssom' | 'textContent' | 'string' | 'element';
export interface StyleSink {
    /** Which implementation this is. */
    readonly mode: SinkMode;
    /** The engine's base rules (reset + the first `:root` block), written once when it initializes. */
    writeBase(rules: readonly string[]): void;
    /** A `:root` block for variables first used after initialization. Goes ahead of everything else. */
    writeVariables(rule: string): void;
    /** Generated rules, each placed by its sort key. */
    writeRules(rules: readonly SortedRule[]): void;
    /** Everything written so far, as CSS text. */
    getStyles(): string;
    /** Drop everything written so far. */
    reset(): void;
    /**
     * Element mode only: the base rules (reset, `:root`, the layer order) as one hoistable element, null
     * before anything is written. The href follows the content, so a longer version is a new element rather
     * than a silently-dropped duplicate.
     */
    baseElement?(): StyleElementDescriptor | null;
}
/** Collects CSS in memory. The server-rendering sink, and the fallback wherever there is no DOM. */
export declare function createStringSink(): StyleSink;
/**
 * Element mode: nothing is written anywhere. Each rule becomes a `StyleElementDescriptor` the adapter
 * renders as `<style href precedence>`, which React 19 hoists and dedupes. This sink keeps the same
 * in-memory model as the string one, so `getStyles()` still returns the whole stylesheet.
 */
export declare function createElementSink(): StyleSink;
/** Writes the whole rule model into the style element's text on every change. */
export declare function createTextContentSink(getElement: () => HTMLStyleElement): StyleSink;
/** Inserts into the element's live `CSSStyleSheet` — what a browser uses. */
export declare function createCssomSink(getElement: () => HTMLStyleElement): StyleSink;
/** The engine's `<style>` element, created (at the top of `<head>`) the first time it is needed. */
export declare function resolveStyleElement(styleElementId: string): HTMLStyleElement;
/**
 * The sink for a mode. With none given it follows the environment — a stylesheet in the browser, a
 * string on a server, which is why server rendering needs no fake `document`.
 */
export declare function createSink(styleElementId: string, mode?: SinkMode): StyleSink;
