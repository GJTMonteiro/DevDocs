import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

import { getSettings } from '../services/settings';

type Theme = 'dark' | 'light' | 'system';

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isThemeLoading: boolean;
}

interface ThemeProviderProps {
  children: ReactNode;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const getSystemTheme = (): 'dark' | 'light' => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
};

const resolveTheme = (theme: Theme): 'dark' | 'light' => {
  if (theme === 'system') {
    return getSystemTheme();
  }

  return theme;
};

const applyTheme = (theme: Theme) => {
  const resolvedTheme = resolveTheme(theme);

  document.documentElement.dataset.theme = resolvedTheme;

  document.documentElement.style.colorScheme = resolvedTheme;
};

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setTheme] = useState<Theme>('dark');

  const [isThemeLoading, setIsThemeLoading] = useState(true);

  /*
   * Load the persisted theme once.
   */
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const settings = await getSettings();

        setTheme(settings.theme);
      } catch (error) {
        console.error('Failed to load theme:', error);

        setTheme('dark');
      } finally {
        setIsThemeLoading(false);
      }
    };

    loadTheme();
  }, []);

  /*
   * Apply the theme whenever it changes.
   */
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  /*
   * React to operating system changes
   * when the user selected "System".
   */
  useEffect(() => {
    if (theme !== 'system') {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = () => {
      applyTheme('system');
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        isThemeLoading,
      }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used inside ThemeProvider.');
  }

  return context;
};
