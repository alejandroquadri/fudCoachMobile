export const languages = {
  en: { label: 'English', locale: 'en-US' },
  es: { label: 'Español', locale: 'es-AR' },
} as const;
export type Language = keyof typeof languages;
export type LanguagePreference = 'system' | Language;
export function isLanguage(value: unknown): value is Language {
  return typeof value === 'string' && Object.hasOwn(languages, value);
}
export function resolvePreferredLanguage(
  preference: LanguagePreference,
  locales: readonly { languageCode: string | null }[]
): Language {
  if (preference !== 'system') return preference;
  return (
    (locales.find(locale => isLanguage(locale.languageCode))
      ?.languageCode as Language) || 'en'
  );
}
