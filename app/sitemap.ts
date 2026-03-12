import type { MetadataRoute } from "next";
import { LOCALES, toBcp47 } from "@/lib/locale-utils";

const baseUrl = "https://www.geoai.run";

function localeAlternates(): Record<string, string> {
  return Object.fromEntries(LOCALES.map((locale) => [toBcp47(locale), baseUrl]));
}

const ROUTES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "",              priority: 1.0, changeFrequency: "weekly"  },
  { path: "/analyze",      priority: 0.9, changeFrequency: "weekly"  },
  { path: "/specification",priority: 0.8, changeFrequency: "monthly" },
  { path: "/cli",          priority: 0.8, changeFrequency: "monthly" },
  { path: "/docs",         priority: 0.8, changeFrequency: "weekly"  },
  { path: "/contact",      priority: 0.5, changeFrequency: "monthly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map(({ path, priority, changeFrequency }) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
    alternates: {
      languages: localeAlternates(),
    },
  }));
}
