import React, { useContext, useLayoutEffect, useState } from 'react';
import Box from '../../box';
import ThemeContext from './themeContext';

interface ThemeProps {
  children: React.ReactNode;
  theme?: string; // Optional: auto-detects using prefers-color-scheme when not provided
  use?: 'global' | 'local';
}

function Theme(props: ThemeProps) {
  const { children, theme, use = 'local' } = props;
  // Initialize with 'light' for SSR consistency - actual system theme is set in useLayoutEffect
  const [themeName, setThemeName] = useState(theme ?? 'light');

  // Detect system theme and listen for changes (client-only, prevents hydration mismatch)
  useLayoutEffect(() => {
    if (theme !== undefined) return; // Only auto-detect if theme not explicitly provided

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // Set actual system theme after hydration
    setThemeName(mediaQuery.matches ? 'dark' : 'light');

    const handleChange = (e: MediaQueryListEvent) => {
      setThemeName(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  useLayoutEffect(() => {
    if (use === 'local') return;

    const root = document.documentElement;
    root.classList.add(themeName);

    return () => {
      root.classList.remove(themeName);
    };
  }, [themeName, use]);

  if (use === 'local') {
    return (
      <ThemeContext.Provider value={{ theme: themeName, setTheme: setThemeName }}>
        <Box className={themeName}>{children}</Box>
      </ThemeContext.Provider>
    );
  }

  return <ThemeContext.Provider value={{ theme: themeName, setTheme: setThemeName }}>{children}</ThemeContext.Provider>;
}

namespace Theme {
  export function useTheme(): [string, (theme: string) => void] {
    const { theme, setTheme } = useContext(ThemeContext);

    return [theme, setTheme];
  }
}

export default Theme;
