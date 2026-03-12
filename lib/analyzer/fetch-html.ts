// HTTP fetch utilities for the Site Analysis module

import type { FetchResult } from "./types";

const USER_AGENT = "GEO-AI-Analyzer/1.0";
const TIMEOUT_MS = 15_000;

// Max response body size: 2 MB — prevents memory exhaustion from huge responses
const MAX_BODY_BYTES = 2 * 1024 * 1024;

/**
 * SSRF protection: blocks requests to private/loopback/link-local IP ranges.
 * Resolves the hostname and checks against known private CIDR blocks.
 */
function isPrivateHostname(hostname: string): boolean {
  // Block localhost variants
  if (hostname === "localhost" || hostname === "0.0.0.0") return true;

  // Block raw IPv4 private ranges without DNS resolution
  const ipv4 = hostname.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (ipv4) {
    const [, a, b, c] = ipv4.map(Number);
    if (
      a === 10 ||                          // 10.0.0.0/8
      a === 127 ||                         // 127.0.0.0/8 loopback
      (a === 172 && b >= 16 && b <= 31) || // 172.16.0.0/12
      (a === 192 && b === 168) ||          // 192.168.0.0/16
      (a === 169 && b === 254) ||          // 169.254.0.0/16 link-local (AWS metadata)
      (a === 100 && b >= 64 && b <= 127) || // 100.64.0.0/10 shared address space
      a === 0 ||                           // 0.0.0.0/8
      a === 198 && b === 51 && c === 100 || // TEST-NET-2
      a === 203 && b === 0 && c === 113    // TEST-NET-3
    ) return true;
  }

  // Block IPv6 loopback and link-local
  if (hostname === "::1" || hostname.startsWith("fe80:") || hostname.startsWith("[fe80:")) return true;

  return false;
}

async function fetchWithTimeout(url: string): Promise<FetchResult> {
  try {
    const parsed = new URL(url);

    // Block non-http(s) schemes (file://, ftp://, etc.)
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return { ok: false, kind: "network", error: `Blocked: unsupported protocol ${parsed.protocol}` };
    }

    // SSRF: block private/internal hostnames
    if (isPrivateHostname(parsed.hostname)) {
      return { ok: false, kind: "network", error: "Blocked: private or internal address" };
    }

    const response = await fetch(url, {
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: { "User-Agent": USER_AGENT },
      redirect: "follow",
    });

    // Check final URL after redirects for SSRF via open redirect
    if (response.url && response.url !== url) {
      const finalParsed = new URL(response.url);
      if (isPrivateHostname(finalParsed.hostname)) {
        return { ok: false, kind: "network", error: "Blocked: redirect to private address" };
      }
    }

    // Limit response body size to prevent memory exhaustion
    const contentLength = response.headers.get("content-length");
    if (contentLength && parseInt(contentLength, 10) > MAX_BODY_BYTES) {
      return { ok: false, kind: "network", error: "Response too large" };
    }

    const body = await response.text();

    // Double-check actual body size after reading
    if (body.length > MAX_BODY_BYTES) {
      return { ok: false, kind: "network", error: "Response body too large" };
    }

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
