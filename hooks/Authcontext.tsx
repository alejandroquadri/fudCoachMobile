import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} from 'react';
import * as SecureStore from 'expo-secure-store';
import { UserProfile } from '@types';

export type AuthContextType = {
  loading: boolean;
  userToken: string | null;
  user: UserProfile | null;
  signIn: (
    token: string,
    refreshToken: string,
    profile: UserProfile
  ) => Promise<void>;
  signUp: (
    token: string,
    refreshToken: string,
    profile: UserProfile
  ) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: (profile: UserProfile) => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

// Small helper for consumers
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};

export const useCurrentUser = (): UserProfile => {
  const { user } = useAuth();
  if (!user) {
    throw new Error('No user in context. Are you logged in?');
  }
  return user;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [loading, setLoading] = useState(true);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);

  /** Load persisted session once on mount */
  useEffect(() => {
    (async () => {
      try {
        const token = await SecureStore.getItemAsync('userToken');
        const profileString = await SecureStore.getItemAsync('userProfile');
        setUserToken(token);
        if (profileString) setUser(JSON.parse(profileString));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /** Memoise context value */
  const value = useMemo<AuthContextType>(
    () => ({
      loading,
      userToken,
      user,
      signIn: async (token, refreshToken, profile) => {
        await SecureStore.setItemAsync('userToken', token);
        await SecureStore.setItemAsync('refreshUserToken', refreshToken);
        await SecureStore.setItemAsync('userProfile', JSON.stringify(profile));
        setUserToken(token);
        setUser(profile);
      },
      signUp: async (token, refreshToken, profile) => {
        await SecureStore.setItemAsync('userToken', token);
        await SecureStore.setItemAsync('refreshUserToken', refreshToken);
        await SecureStore.setItemAsync('userProfile', JSON.stringify(profile));
        setUserToken(token);
        setUser(profile);
      },
      signOut: async () => {
        await SecureStore.deleteItemAsync('userToken');
        await SecureStore.deleteItemAsync('refreshUserToken');
        await SecureStore.deleteItemAsync('userProfile');
        setUserToken(null);
        setUser(null);
      },
      refreshUser: async profile => {
        await SecureStore.setItemAsync('userProfile', JSON.stringify(profile));
        setUser(profile);
      },
    }),
    [loading, userToken, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
