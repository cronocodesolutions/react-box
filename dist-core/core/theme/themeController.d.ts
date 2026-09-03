/**
 * Theming with no framework: the state machine `<Box.Theme>` holds in React state, as a plain object any
 * adapter can own. Same rules as the provider — explicit beats persisted beats the system preference,
 * which is followed live — with one difference: the *first* value is already the real one, since there is
 * no hydration to stay consistent with. Theme rules are ancestor-scoped, so writing the name on an
 * element restyles everything inside it.
 */
export interface ThemeControllerOptions {
    /**
     * The element that carries the theme name (as a class) and `data-theme`. Defaults to the document root,
     * which is what `theme={{ dark: … }}` props expect; pass an element to theme a subtree, `null` to write
     * nothing and keep only the state.
     */
    target?: Element | null;
    /** When set, the chosen theme is persisted under this `localStorage` key and restored on start. */
    storageKey?: string;
    /** Start on this theme and stop following the system preference — the same as calling `set()` immediately. */
    theme?: string;
}
export interface ThemeController {
    /** The theme in effect right now. */
    readonly theme: string;
    /** Whether the current theme was chosen rather than read from the system preference. */
    readonly isOverridden: boolean;
    /** Switch theme, persisting it when a `storageKey` was given. `null` hands control back to the system. */
    set(theme: string | null): void;
    /** Run `listener` on every change. Returns the unsubscribe function. */
    subscribe(listener: (theme: string) => void): () => void;
    /** Stop watching the system preference and remove what was written to the target element. */
    destroy(): void;
}
export default function createThemeController(options?: ThemeControllerOptions): ThemeController;
