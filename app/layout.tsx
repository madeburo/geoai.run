import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { createGeoAI } from "geo-ai-core";
import { GEO_SITE_NAME, GEO_SITE_URL, createGeoProvider } from "@/lib/geo-config";
import { clarityScript } from "@/lib/clarity";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
});

const geo = createGeoAI({
  siteName: GEO_SITE_NAME,
  siteUrl: GEO_SITE_URL,
  provider: createGeoProvider(),
});

export const metadata: Metadata = {
  title: "GEO AI — AI Search Optimization",
  description: "Open-source AI Search Optimization for websites and ecommerce.",
  metadataBase: new URL("https://www.geoai.run"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "GEO AI — AI Search Optimization",
    description: "Open-source AI Search Optimization for websites and ecommerce.",
    type: "website",
    url: "https://www.geoai.run",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "GEO AI — AI Search Optimization",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GEO AI — AI Search Optimization",
    description: "Open-source AI Search Optimization for websites and ecommerce.",
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = geo.generateJsonLd();
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${manrope.variable} dark`}>
      <head>
        {clarityScript && (
          <script
            dangerouslySetInnerHTML={{ __html: clarityScript }}
          />
        )}
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
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
