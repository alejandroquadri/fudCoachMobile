import { createContext } from 'react';
import { User } from '../types';

export type AuthContextType = {
  signIn: (
    token: string,
    refreshToken: string,
    setUserProfile: User
  ) => Promise<void>;
  signUp: (
    token: string,
    refreshToken: string,
    setUserProfile: User
  ) => Promise<void>;
  signOut: () => void;
  refreshUser: (user: User) => void;
  user: User | null;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
