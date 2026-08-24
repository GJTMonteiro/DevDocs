import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { getProfile } from '../services/profile';

interface User {
  name: string;
  email: string;
  role: string;
}

interface UserContextValue {
  user: User | null;
  isLoading: boolean;
  updateUser: (updates: Partial<User>) => void;
}

const DEFAULT_USER: User = {
  name: 'Guilherme Monteiro',
  email: 'guilherme@example.com',
  role: 'Developer',
};

const UserContext = createContext<UserContextValue | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadUser = async () => {
      try {
        setIsLoading(true);

        const profile = await getProfile();

        if (!isMounted) {
          return;
        }

        setUser({
          name: profile.name,
          email: profile.email,
          role: profile.role,
        });
      } catch (error) {
        console.error('Failed to load user profile:', error);

        if (isMounted) {
          setUser(DEFAULT_USER);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadUser();

    return () => {
      isMounted = false;
    };
  }, []);

  const updateUser = useCallback((updates: Partial<User>) => {
    setUser((current) => {
      if (!current) {
        return DEFAULT_USER;
      }

      return {
        ...current,
        ...updates,
      };
    });
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      updateUser,
    }),
    [user, isLoading, updateUser],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error('useUser must be used inside UserProvider');
  }

  return context;
};
