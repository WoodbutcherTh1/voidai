const LANG_KEY = "voidai_language";

const SUPPORTED = [
  "en",
  "es",
  "fr",
  "de",
  "zh",
  "ja",
  "ko",
  "ar",
  "ru",
  "he",
  "hi",
] as const;

export type LanguageCode = (typeof SUPPORTED)[number];

export const LANGUAGE_LABELS: Record<LanguageCode, string> = {
  en: "English",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
  zh: "中文",
  ja: "日本語",
  ko: "한국어",
  ar: "العربية",
  ru: "Русский",
  he: "עברית",
  hi: "हिन्दी",
};

function isBrowser() {
  return typeof window !== "undefined";
}

export function getPreferredLanguage(): LanguageCode {
  if (!isBrowser()) return "en";
  const saved = localStorage.getItem(LANG_KEY) as LanguageCode | null;
  return saved && SUPPORTED.includes(saved) ? saved : "en";
}

export function setPreferredLanguage(lang: LanguageCode): void {
  if (!isBrowser()) return;
  localStorage.setItem(LANG_KEY, lang);
}

export function getPreferredLanguageLabel(): string {
  return LANGUAGE_LABELS[getPreferredLanguage()];
}
