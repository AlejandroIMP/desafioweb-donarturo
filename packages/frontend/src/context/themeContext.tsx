import { createContext, useContext, useState, useMemo } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

type ThemeContextType = {
  mode: 'light' | 'dark';
  toggleTheme: (mode: 'light' | 'dark') => void;
};

const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType);

const getInitialMode = (): 'light' | 'dark' => {
  const savedMode = localStorage.getItem('theme-mode');
  return (savedMode as 'light' | 'dark') || 'light';
};


export const ThemeProviderWrapper = ({ children }: { children: React.ReactNode }) => {
  const [mode, setMode] = useState<'light' | 'dark'>(getInitialMode());

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: mode,
          background: {
            paper: mode === 'dark' ? '#1e1e1e' : '#ffffff'
          }
        },
      }),
    [mode]
  );

  const toggleTheme = (newMode: 'light' | 'dark') => {
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