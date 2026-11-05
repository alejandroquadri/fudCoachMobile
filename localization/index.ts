import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import es from './es.json';
import { getLocales } from 'expo-localization';

import {
  languages,
  Language,
  LanguagePreference,
  resolvePreferredLanguage,
} from './registry';
export {
  languages,
  Language,
  LanguagePreference,
  isLanguage,
} from './registry';
export function resolveLanguage(preference: LanguagePreference): Language {
  return resolvePreferredLanguage(preference, getLocales());
}

void i18n.use(initReactI18next).init({
  compatibilityJSON: 'v4',
  lng: resolveLanguage('system'),
  supportedLngs: Object.keys(languages),
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
  keySeparator: false,
  nsSeparator: false,
  initAsync: false,
  resources: { en: { translation: en }, es: { translation: es } },
});

export default i18n;

// Call from mounted components so changing language updates text without remounting screens.
export { useTranslation as useLanguageUpdates } from 'react-i18next';
export function tr(
  text: string,
  values: Record<string, string | number> = {}
): string {
  return i18n.t(text, { defaultValue: text, ...values });
}
export function localeTag(): string {
  return (
    languages[i18n.resolvedLanguage as Language]?.locale ?? languages.en.locale
  );
}
