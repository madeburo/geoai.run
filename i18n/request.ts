import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

const locales = ["en", "de", "fr", "es", "pt", "ru"] as const;
type Locale = (typeof locales)[number];

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const cookie = cookieStore.get("locale")?.value;
  const locale: Locale = locales.includes(cookie as Locale)
    ? (cookie as Locale)
    : "en";

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
