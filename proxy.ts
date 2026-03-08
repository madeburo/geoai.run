import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { geoAIMiddleware } from "geo-ai-next";
import {
  GEO_SITE_NAME,
  GEO_SITE_URL,
  GEO_SITE_DESCRIPTION,
  createGeoProvider,
} from "./lib/geo-config";
import { rateLimit } from "./lib/rate-limit";

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

export default function proxy(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { allowed, remaining } = rateLimit(ip);

  if (!allowed) {
    return new NextResponse("Too Many Requests", {
      status: 429,
      headers: {
        "Retry-After": "60",
        "X-RateLimit-Remaining": "0",
      },
    });
  }

  const response = geoMiddleware(request);

  if (response instanceof NextResponse || response instanceof Response) {
    response.headers.set("X-RateLimit-Remaining", String(remaining));
    return response;
  }

  return NextResponse.next({
    headers: { "X-RateLimit-Remaining": String(remaining) },
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
