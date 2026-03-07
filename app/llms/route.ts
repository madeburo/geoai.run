import { createLlmsHandler } from "geo-ai-next";
import {
  GEO_SITE_NAME,
  GEO_SITE_URL,
  GEO_SITE_DESCRIPTION,
  createGeoProvider,
} from "@/lib/geo-config";

export const { GET } = createLlmsHandler({
  siteName: GEO_SITE_NAME,
  siteUrl: GEO_SITE_URL,
  siteDescription: GEO_SITE_DESCRIPTION,
  provider: createGeoProvider(),
  cacheMaxAge: 3600,
});
