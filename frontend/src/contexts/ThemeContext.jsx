import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { ConfigProvider, theme } from 'antd';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(localStorage.getItem('smart_notes_theme') || 'dark');
  const isDark = mode === 'dark';

  useEffect(() => {
    localStorage.setItem('smart_notes_theme', mode);
    document.documentElement.dataset.theme = mode;
  }, [mode]);

  const value = useMemo(
    () => ({
      isDark,
      mode,
      toggleTheme: () => setMode((current) => (current === 'dark' ? 'light' : 'dark')),
    }),
    [isDark, mode],
  );

  return (
    <ThemeContext.Provider value={value}>
      <ConfigProvider
        theme={{
          algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
          token: {
            colorPrimary: '#7c3aed',
            borderRadius: 14,
            fontFamily:
              'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          },
        }}
      >
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
}

export function useThemeMode() {
  const value = useContext(ThemeContext);
  if (!value) {
    throw new Error('useThemeMode must be used inside ThemeProvider');
  }
  return value;
}
