import { NextResponse } from "next/server";
import { analyzeSiteForAIReadiness } from "@/lib/analyzer";
import { rateLimit } from "@/lib/rate-limit";

export async function GET(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { allowed } = rateLimit(ip);
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");
  if (!url) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  const report = await analyzeSiteForAIReadiness(url);
  return NextResponse.json(report);
}
