import en from "@/locales/en.json";
import ca from "@/locales/ca.json";

const languages = { en, ca };

export function getDictionary(locale: keyof typeof languages = 'ca') {
  return languages[locale] || languages.ca;
}

export function useI18n(locale: keyof typeof languages = 'ca') {
  return getDictionary(locale);
}