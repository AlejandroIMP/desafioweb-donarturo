import { createContext, useContext, useState, useMemo } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

type ThemeContextType = {
  mode: 'light' | 'dark' | 'system';
  toggleTheme: (mode: 'light' | 'dark' | 'system') => void;
};

const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType);

const getInitialMode = (): 'light' | 'dark' | 'system' => {
  const savedMode = localStorage.getItem('theme-mode');
  return (savedMode as 'light' | 'dark' | 'system') || 'system';
};

export const ThemeProviderWrapper = ({ children }: { children: React.ReactNode }) => {
  const [mode, setMode] = useState<'light' | 'dark' | 'system'>(getInitialMode());

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: mode === 'system' 
            ? window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
            : mode,
          background: {
            paper: mode === 'dark' ? '#1e1e1e' : '#ffffff'
          }
        },
      }),
    [mode]
  );

  const toggleTheme = (newMode: 'light' | 'dark' | 'system') => {
    localStorage.setItem('theme-mode', newMode);
    setMode(newMode);
  };

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);