import { NextResponse } from "next/server";
import { analyzeSiteForAIReadiness } from "@/lib/analyzer";
import { rateLimit } from "@/lib/rate-limit";

const MAX_URL_LENGTH = 2048;

export async function GET(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { allowed, remaining } = rateLimit(ip);

  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests" },
      {
        status: 429,
        headers: {
          "Retry-After": "60",
          "X-RateLimit-Limit": "60",
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  if (url.length > MAX_URL_LENGTH) {
    return NextResponse.json({ error: "URL too long" }, { status: 400 });
  }

  // Block non-http(s) schemes before they reach the analyzer
  const trimmed = url.trim();
  if (trimmed && !/^https?:\/\//i.test(trimmed) && /^[a-z][a-z0-9+\-.]*:\/\//i.test(trimmed)) {
    return NextResponse.json({ error: "Invalid URL scheme" }, { status: 400 });
  }

  const report = await analyzeSiteForAIReadiness(url);

  return NextResponse.json(report, {
    headers: {
      "X-RateLimit-Limit": "60",
      "X-RateLimit-Remaining": String(remaining),
    },
  });
}
