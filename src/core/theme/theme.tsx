import React, { useContext, useLayoutEffect, useState } from 'react';
import ThemeContext from './themeContext';

interface ThemeProps {
  children: React.ReactNode;
  theme: string;
}

function Theme(props: ThemeProps) {
  const { children, theme } = props;
  const [themeName, setThemeName] = useState(theme);

  useLayoutEffect(() => {
    const root = document.documentElement;
    root.classList.add(themeName);

    return () => {
      root.classList.remove(themeName);
    };
  }, [themeName]);

  return <ThemeContext.Provider value={{ theme: themeName, setTheme: setThemeName }}>{children}</ThemeContext.Provider>;
}

namespace Theme {
  export function useTheme(): [string, (theme: string) => void] {
    const { theme, setTheme } = useContext(ThemeContext);

    return [theme, setTheme];
  }
}

export default Theme;
