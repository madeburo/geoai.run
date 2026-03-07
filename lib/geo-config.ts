import { GeoAIRunProvider } from "@/lib/geo-provider";

export const GEO_SITE_NAME = "GEO AI";
export const GEO_SITE_URL = "https://www.geoai.run";
export const GEO_SITE_DESCRIPTION =
  "AI Search Optimization — make your site visible to ChatGPT, Claude, Gemini, Perplexity and more";

export function createGeoProvider() {
  return new GeoAIRunProvider();
}
