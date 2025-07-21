import { createContext } from 'react';
import { UserProfile } from '@types';

export type AuthContextType = {
  signIn: (
    token: string,
    refreshToken: string,
    setUserProfile: UserProfile
  ) => Promise<void>;
  signUp: (
    token: string,
    refreshToken: string,
    setUserProfile: UserProfile
  ) => Promise<void>;
  signOut: () => void;
  refreshUser: (user: UserProfile) => void;
  user: UserProfile | null;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
