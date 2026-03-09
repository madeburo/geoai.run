// HTTP fetch utilities for the Site Analysis module

import type { FetchResult } from "./types";

const USER_AGENT = "GEO-AI-Analyzer/1.0";
const TIMEOUT_MS = 15_000;

async function fetchWithTimeout(url: string): Promise<FetchResult> {
  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: { "User-Agent": USER_AGENT },
      redirect: "follow",
    });

    const body = await response.text();

    const headers: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      headers[key] = value;
    });

    return {
      ok: true,
      body,
      status: response.status,
      finalUrl: response.url,
      headers,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { ok: false, kind: "network", error: message };
  }
}

/** Fetch an HTML page. Returns ok:true for any HTTP response, ok:false only for network-level failures. */
export async function fetchHtml(url: string): Promise<FetchResult> {
  return fetchWithTimeout(url);
}

/** Fetch a plain-text resource (llms.txt, robots.txt, sitemap.xml). Same behaviour as fetchHtml. */
export async function fetchText(url: string): Promise<FetchResult> {
  return fetchWithTimeout(url);
}
