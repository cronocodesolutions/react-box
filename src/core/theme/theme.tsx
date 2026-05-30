import React, { useCallback, useContext, useLayoutEffect, useRef, useState } from 'react';
import Box from '../../box';
import { BoxStyleProps } from '../../types';
import { useGlobalStyles } from '../useStyles';
import ThemeContext from './themeContext';

interface ThemeProps {
  children: React.ReactNode;
  theme?: string; // Optional: auto-detects using prefers-color-scheme when not provided
  use?: 'global' | 'local';
  /** When provided, persists the user-selected theme to localStorage under this key. */
  storageKey?: string;
  /**
   * App-wide Box style props applied to the document root (`<html>`). Only takes effect when `use="global"`.
   * Supports the same shape as Box props, including theme-keyed values:
   * `globalStyles={{ scrollbarColor: ['violet-500', 'transparent'], theme: { dark: { scrollbarColor: [...] } } }}`.
   */
  globalStyles?: BoxStyleProps;
}

function Theme(props: ThemeProps) {
  const { children, theme, use = 'local', storageKey, globalStyles } = props;

  useGlobalStyles(use === 'global' ? globalStyles : undefined, 'html');
  // Initialize with 'light' for SSR consistency - actual system theme is set in useLayoutEffect
  const [themeName, setThemeName] = useState(theme ?? 'light');
  const [isUserOverride, setIsUserOverride] = useState(theme !== undefined);
  const localRef = useRef<HTMLDivElement>(null);

  const handleSetTheme = useCallback(
    (value: string | null) => {
      if (value === null) {
        if (storageKey) {
          try {
            localStorage.removeItem(storageKey);
          } catch {
            // localStorage may be unavailable (SSR, privacy mode)
          }
        }
        setIsUserOverride(false);
      } else {
        if (storageKey) {
          try {
            localStorage.setItem(storageKey, value);
          } catch {
            // localStorage may be unavailable (SSR, privacy mode)
          }
        }
        setThemeName(value);
        setIsUserOverride(true);
      }
    },
    [storageKey],
  );

  // Sync with theme prop changes (render-phase, no effect — initial state already covers mount).
  const [prevTheme, setPrevTheme] = useState(theme);
  if (theme !== prevTheme) {
    setPrevTheme(theme);
    if (theme !== undefined) {
      setThemeName(theme);
      setIsUserOverride(true);
    } else {
      setIsUserOverride(false);
    }
  }

  // Detect system theme and listen for changes (client-only, prevents hydration mismatch).
  // setState here is intentional: the actual system/persisted theme must be applied after
  // hydration to keep SSR output deterministic, so this can't move to a render-phase derivation.
  /* eslint-disable react-hooks/set-state-in-effect */
  useLayoutEffect(() => {
    if (isUserOverride) return;

    // Restore persisted theme from localStorage before falling back to system detection
    if (storageKey) {
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          setThemeName(stored);
          setIsUserOverride(true);
          return;
        }
      } catch {
        // localStorage may be unavailable (SSR, privacy mode)
      }
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // Set actual system theme after hydration
    setThemeName(mediaQuery.matches ? 'dark' : 'light');

    const handleChange = (e: MediaQueryListEvent) => {
      setThemeName(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [isUserOverride, storageKey]);
  /* eslint-enable react-hooks/set-state-in-effect */

  useLayoutEffect(() => {
    if (use === 'local') return;

    const root = document.documentElement;
    root.classList.add(themeName);
    root.setAttribute('data-theme', themeName);

    return () => {
      root.classList.remove(themeName);
      root.removeAttribute('data-theme');
    };
  }, [themeName, use]);

  // Set data-theme on the local wrapper element
  useLayoutEffect(() => {
    if (use !== 'local' || !localRef.current) return;
    localRef.current.setAttribute('data-theme', themeName);
  }, [themeName, use]);

  if (use === 'local') {
    return (
      <ThemeContext.Provider value={{ theme: themeName, setTheme: handleSetTheme }}>
        <Box ref={localRef} className={themeName}>
          {children}
        </Box>
      </ThemeContext.Provider>
    );
  }

  return <ThemeContext.Provider value={{ theme: themeName, setTheme: handleSetTheme }}>{children}</ThemeContext.Provider>;
}

namespace Theme {
  export function useTheme(): [string, (theme: string | null) => void] {
    const { theme, setTheme } = useContext(ThemeContext);

    return [theme, setTheme];
  }
}

export default Theme;
