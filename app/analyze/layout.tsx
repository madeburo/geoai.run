import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

const SUPPORTED_LOCALES = ["de", "en", "es", "fr", "ja", "ko", "pt", "ru", "zh"];

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata.analyze");

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: "https://www.geoai.run/analyze",
      languages: Object.fromEntries(
        SUPPORTED_LOCALES.map((l) => [l, "https://www.geoai.run/analyze"])
      ),
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      type: "website",
      url: "https://www.geoai.run/analyze",
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
  };
}

export default function AnalyzeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
