import type { MetadataRoute } from "next";
import { LOCALES, toBcp47 } from "@/lib/locale-utils";

const baseUrl = "https://www.geoai.run";

function localeAlternates(): Record<string, string> {
  return Object.fromEntries(LOCALES.map((locale) => [toBcp47(locale), baseUrl]));
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
      alternates: {
        languages: localeAlternates(),
      },
    },
    {
      url: `${baseUrl}/analyze`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: {
        languages: localeAlternates(),
      },
    },
  ];
}
