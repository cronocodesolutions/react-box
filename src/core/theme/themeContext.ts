import React from 'react';

interface ThemeContextProps {
  theme: string;
  setTheme(theme: string): void;
}

const ThemeContext = React.createContext<ThemeContextProps>({ theme: '', setTheme: () => {} });

export default ThemeContext;
