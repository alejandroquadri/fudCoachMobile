import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { AppState } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import i18n, {
  Language,
  LanguagePreference,
  resolveLanguage,
  isLanguage,
} from './index';

const KEY = 'languagePreference';
type LanguageContextValue = {
  preference: LanguagePreference;
  language: Language;
  setPreference: (preference: LanguagePreference) => Promise<void>;
};
const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [preference, setPreferenceState] =
    useState<LanguagePreference>('system');
  const [language, setLanguage] = useState<Language>(resolveLanguage('system'));
  const [ready, setReady] = useState(false);

  const apply = useCallback((next: LanguagePreference) => {
    const resolved = resolveLanguage(next);
    setPreferenceState(next);
    setLanguage(resolved);
    void i18n.changeLanguage(resolved);
  }, []);

  useEffect(() => {
    let mounted = true;
    SecureStore.getItemAsync(KEY)
      .then(value => {
        if (!mounted) return;
        apply(isLanguage(value) ? value : 'system');
      })
      .catch(() => {})
      .finally(() => {
        if (mounted) setReady(true);
      });
    return () => {
      mounted = false;
    };
  }, [apply]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', state => {
      if (state === 'active' && preference === 'system') apply('system');
    });
    return () => subscription.remove();
  }, [apply, preference]);

  const setPreference = useCallback(
    async (next: LanguagePreference) => {
      await SecureStore.setItemAsync(KEY, next);
      apply(next);
    },
    [apply]
  );

  if (!ready) return null;
  return (
    <LanguageContext.Provider value={{ preference, language, setPreference }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context)
    throw new Error('useLanguage must be used within LanguageProvider');
  return context;
}
