export const LOCALES = ["de", "en", "es", "fr", "ja", "ko", "pt", "ru", "zh"] as const;
export type Locale = (typeof LOCALES)[number];

export const LOCALE_META: Record<Locale, { shortCode: string; nativeName: string }> = {
  de: { shortCode: "DE", nativeName: "Deutsch" },
  en: { shortCode: "EN", nativeName: "English" },
  es: { shortCode: "ES", nativeName: "Español" },
  fr: { shortCode: "FR", nativeName: "Français" },
  ja: { shortCode: "JA", nativeName: "日本語" },
  ko: { shortCode: "KO", nativeName: "한국어" },
  pt: { shortCode: "PT", nativeName: "Português" },
  ru: { shortCode: "RU", nativeName: "Русский" },
  zh: { shortCode: "ZH", nativeName: "简体中文" },
};

/** Maps internal locale code to BCP 47 tag for HTML/SEO attributes. */
export function toBcp47(locale: Locale | string): string {
  return locale === "zh" ? "zh-CN" : locale;
}
