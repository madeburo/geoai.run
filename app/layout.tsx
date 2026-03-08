import type { Metadata } from "next";
import { Manrope, Noto_Sans_JP, Noto_Sans_KR, Noto_Sans_SC } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import { createGeoAI } from "geo-ai-core";
import { GEO_SITE_NAME, GEO_SITE_URL, createGeoProvider } from "@/lib/geo-config";
import { LOCALES, toBcp47 } from "@/lib/locale-utils";
import { CLARITY_ID } from "@/lib/clarity";
import { CookieBanner } from "@/components/cookie-banner";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
});

const notoJP = Noto_Sans_JP({
  variable: "--font-noto-jp",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const notoKR = Noto_Sans_KR({
  variable: "--font-noto-kr",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const notoSC = Noto_Sans_SC({
  variable: "--font-noto-sc",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geo = createGeoAI({
  siteName: GEO_SITE_NAME,
  siteUrl: GEO_SITE_URL,
  provider: createGeoProvider(),
});

const BASE_URL = "https://www.geoai.run";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations("metadata.home");

  const activeLocale = locale;
  const activeBcp47 = toBcp47(activeLocale);
  const alternateLocales = LOCALES.filter((l) => l !== activeLocale).map(toBcp47);

  return {
    title: t("title"),
    description: t("description"),
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: BASE_URL,
      languages: {
        ...Object.fromEntries(LOCALES.map((l) => [toBcp47(l), BASE_URL])),
        "x-default": BASE_URL,
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      type: "website",
      url: BASE_URL,
      locale: activeBcp47,
      alternateLocale: alternateLocales,
      images: [
        {
          url: "/og.png",
          width: 1200,
          height: 630,
          alt: t("title"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: ["/og.png"],
    },
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/favicon.png", type: "image/png" },
      ],
      apple: "/apple-touch-icon.png",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = geo.generateJsonLd();
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={toBcp47(locale)} className={`${manrope.variable} ${notoJP.variable} ${notoKR.variable} ${notoSC.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='light'){document.documentElement.classList.remove('dark')}else{document.documentElement.classList.add('dark')}}catch(e){}})()`,
          }}
        />
        <meta name="llms" content="https://www.geoai.run/llms.txt" />
        <meta name="llms-full" content="https://www.geoai.run/llms-full.txt" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased">
        <NextIntlClientProvider messages={messages}>
          {children}
          <CookieBanner clarityId={CLARITY_ID} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
