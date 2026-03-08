import { NextResponse } from "next/server";

const VALID_LOCALES = new Set(["de", "en", "es", "fr", "ja", "ko", "pt", "ru", "zh"]);

export async function POST(request: Request) {
  const { locale } = await request.json();
  if (!VALID_LOCALES.has(locale)) {
    return NextResponse.json({ error: "Invalid locale" }, { status: 400 });
  }
  const response = NextResponse.json({ locale });
  response.cookies.set("locale", locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  return response;
}
