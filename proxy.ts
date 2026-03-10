import { geoAIMiddleware } from "geo-ai-next";
import {
  GEO_SITE_NAME,
  GEO_SITE_URL,
  GEO_SITE_DESCRIPTION,
  createGeoProvider,
} from "./lib/geo-config";

const geoMiddleware = geoAIMiddleware({
  siteName: GEO_SITE_NAME,
  siteUrl: GEO_SITE_URL,
  siteDescription: GEO_SITE_DESCRIPTION,
  provider: createGeoProvider(),
  crawlers: "all",
  cache: "24h",
  crawlTracking: true,
  injectLinkHeader: true,
  cacheMaxAge: 3600,
});

export default geoMiddleware;

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|favicon.png|robots.txt|sitemap.xml|llms.txt|llms-full.txt).*)",
  ],
};
