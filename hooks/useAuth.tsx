import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useRef,
} from 'react';
import * as SecureStore from 'expo-secure-store';
import { UserProfile } from '@types';
import { profileApi } from '@api';

const saveProfile = async (profile: UserProfile) => {
  const withoutAvatar = { ...profile };
  delete withoutAvatar.avatar;
  await SecureStore.setItemAsync('userProfile', JSON.stringify(withoutAvatar));
};

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
  const userRevision = useRef(0);

  /** Load persisted session once on mount */
  useEffect(() => {
    console.log('[Auth] init');
    (async () => {
      try {
        // // NOTE: la funcion de abajo sirve para cuando quiero resetear las tokens
        // await wipeSecureStore();

        const token = await SecureStore.getItemAsync('userToken');
        const profileString = await SecureStore.getItemAsync('userProfile');
        setUserToken(token);
        if (profileString) {
          const stored = JSON.parse(profileString) as UserProfile;
          setUser(stored);
          if (token) {
            const revision = userRevision.current;
            void profileApi
              .getProfile(stored._id)
              .then(async fresh => {
                if (
                  fresh &&
                  userRevision.current === revision &&
                  (await SecureStore.getItemAsync('userToken')) === token &&
                  userRevision.current === revision
                ) {
                  await saveProfile(fresh);
                  if (userRevision.current === revision) setUser(fresh);
                }
              })
              .catch(() => {});
          }
        }
      } catch (error) {
        // Keychain entries can be temporarily unavailable when iOS launches
        // the app without allowing user interaction (for example, while the
        // device is locked). Keep the persisted values intact and start in a
        // signed-out state instead of leaving an unhandled promise rejection.
        console.warn('[Auth] unable to restore the stored session', error);
        setUserToken(null);
        setUser(null);
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
        userRevision.current++;
        await SecureStore.setItemAsync('userToken', token);
        await SecureStore.setItemAsync('refreshUserToken', refreshToken);
        await saveProfile(profile);
        setUserToken(token);
        setUser(profile);
      },
      signUp: async (token, refreshToken, profile) => {
        userRevision.current++;
        await SecureStore.setItemAsync('userToken', token);
        await SecureStore.setItemAsync('refreshUserToken', refreshToken);
        await saveProfile(profile);
        setUserToken(token);
        setUser(profile);
      },
      signOut: async () => {
        userRevision.current++;
        await SecureStore.deleteItemAsync('userToken');
        await SecureStore.deleteItemAsync('refreshUserToken');
        await SecureStore.deleteItemAsync('userProfile');
        setUserToken(null);
        setUser(null);
      },
      refreshUser: async profile => {
        userRevision.current++;
        await saveProfile(profile);
        setUser(profile);
      },
    }),
    [loading, userToken, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
