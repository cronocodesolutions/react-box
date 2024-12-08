import React, { useContext, useMemo, useState } from 'react';
import ObjectUtils from '../../utils/object/objectUtils';
import { ThemeType, Themes, ThemeSetup } from './themeContract';
import defaultTheme from './defaultTheme';
import ThemeContext from './themeContext';

interface ThemeProps {
  children: React.ReactNode;
  theme: string;
}

function Theme(props: ThemeProps) {
  const { children, theme } = props;

  const [themeName, setThemeName] = useState(theme);

  const themeStyles = useMemo(() => {
    const themeStylesByName = Theme.userThemes?.[themeName];
    if (!themeStylesByName) return defaultTheme as ThemeType;

    const { components, ...restStyles } = themeStylesByName;
    const com = components ?? {};

    Object.entries(restStyles).forEach(([name, componentStructure]) => {
      com[name] = componentStructure;
    });

    Object.keys(com).forEach((name) => {
      if (com[name].clean && name in defaultTheme) {
        delete defaultTheme[name as keyof ThemeSetup];
      }
    });

    return ObjectUtils.mergeDeep<ThemeType>(defaultTheme, com);
  }, [themeName]);

  return <ThemeContext.Provider value={{ themeStyles, theme: themeName, setTheme: setThemeName }}>{children}</ThemeContext.Provider>;
}

namespace Theme {
  export let userThemes: Maybe<Themes> = undefined;

  export function setup(themes: Themes) {
    userThemes = themes;
  }

  export function useTheme(): [string, (theme: string) => void] {
    const { theme, setTheme } = useContext(ThemeContext);

    return [theme, setTheme];
  }
}

export default Theme;
