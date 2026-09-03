/** The theme name used when the system preference cannot be read (server, no `matchMedia`). */
export declare const defaultThemeName = "light";
/** The document root (`<html>`), or `null` when there is no DOM. */
export declare function documentRoot(): Element | null;
/** `'dark'` or `'light'` from `prefers-color-scheme`; `'light'` when the preference is unreadable. */
export declare function getSystemTheme(): string;
/**
 * Call `onChange` whenever the system preference flips. Returns the unsubscribe function — a no-op
 * when there is nothing to listen to, so callers never need to branch.
 */
export declare function watchSystemTheme(onChange: (theme: string) => void): () => void;
/**
 * Mark `element` as carrying `themeName`: the theme name as a class (what the generated
 * ancestor-scoped selectors match on — `.dark .className`) plus a `data-theme` attribute for
 * consumers' own CSS. Returns the cleanup that removes exactly what was added.
 */
export declare function applyThemeToElement(element: Element, themeName: string): () => void;
/**
 * The `data-theme` attribute on its own, for an element that already carries the theme class
 * (a local `<Box.Theme>` wrapper gets the class through `className`).
 */
export declare function setThemeAttribute(element: Element, themeName: string): void;
/** The persisted theme name, or `null` when nothing is stored or storage is unavailable. */
export declare function readStoredTheme(storageKey: string): string | null;
/** Persist `themeName`; silently does nothing when storage is unavailable. */
export declare function writeStoredTheme(storageKey: string, themeName: string): void;
/** Forget the persisted theme, handing control back to the system preference. */
export declare function clearStoredTheme(storageKey: string): void;
