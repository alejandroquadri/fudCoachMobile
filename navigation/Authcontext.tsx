import { createContext } from 'react';
import { User } from '../types';

export type AuthContextType = {
  signIn: (token: string, setUserProfile: User) => Promise<void>;
  signOut: () => void;
  user: User | null;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
