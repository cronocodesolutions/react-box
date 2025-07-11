import React, { useContext, useLayoutEffect, useState } from 'react';
import Box from '../../box';
import ThemeContext from './themeContext';

interface ThemeProps {
  children: React.ReactNode;
  theme: string;
  use?: 'global' | 'local';
}

function Theme(props: ThemeProps) {
  const { children, theme, use = 'local' } = props;
  const [themeName, setThemeName] = useState(theme);

  useLayoutEffect(() => {
    if (use === 'local') return;

    const root = document.documentElement;
    root.classList.add(themeName);

    return () => {
      root.classList.remove(themeName);
    };
  }, [themeName]);

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
