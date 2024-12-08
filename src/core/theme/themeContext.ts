import React from 'react';
import defaultTheme from './defaultTheme';
import { ThemeType } from './themeContract';

interface IThemeContext {
  themeStyles: ThemeType;
  theme: string;
  setTheme(theme: string): void;
}

const ThemeContext = React.createContext<IThemeContext>({ themeStyles: defaultTheme as ThemeType, theme: '', setTheme: () => {} });

export default ThemeContext;
