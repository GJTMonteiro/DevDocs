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

const THEME_STORAGE_KEY = 'devdocs-theme';

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

const getStoredTheme = (): Theme | null => {
  try {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);

    if (
      storedTheme === 'dark' ||
      storedTheme === 'light' ||
      storedTheme === 'system'
    ) {
      return storedTheme;
    }

    return null;
  } catch (error) {
    console.error('Failed to read stored theme:', error);
    return null;
  }
};

const storeTheme = (theme: Theme) => {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (error) {
    console.error('Failed to store theme:', error);
  }
};

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  /*
   * Read the locally persisted theme immediately.
   *
   * This prevents the application from always starting
   * in dark mode after a refresh.
   */
  const [theme, setThemeState] = useState<Theme>(() => {
    return getStoredTheme() ?? 'dark';
  });

  const [isThemeLoading, setIsThemeLoading] = useState(true);

  /*
   * Apply the initial theme immediately.
   */
  useEffect(() => {
    applyTheme(theme);
  }, []);

  /*
   * Load the persisted theme from the server.
   *
   * The localStorage value is used immediately so the UI
   * does not have to wait for the API request.
   *
   * Once the server responds, its value becomes the
   * authoritative preference for the account.
   */
  useEffect(() => {
    let isMounted = true;

    const loadTheme = async () => {
      try {
        const settings = await getSettings();

        if (!isMounted) {
          return;
        }

        const serverTheme = settings.theme;

        setThemeState(serverTheme);
        storeTheme(serverTheme);
        applyTheme(serverTheme);
      } catch (error) {
        console.error('Failed to load theme:', error);

        /*
         * Keep the locally stored theme if the API
         * is unavailable.
         */
      } finally {
        if (isMounted) {
          setIsThemeLoading(false);
        }
      }
    };

    loadTheme();

    return () => {
      isMounted = false;
    };
  }, []);

  /*
   * Apply the theme whenever it changes.
   */
  useEffect(() => {
    applyTheme(theme);
    storeTheme(theme);
  }, [theme]);

  /*
   * React to operating system changes when
   * the user has selected "System".
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

  /*
   * Public theme setter.
   */
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    storeTheme(newTheme);
    applyTheme(newTheme);
  };

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
