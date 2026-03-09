// URL normalization utility
import type { NormalizeResult } from "./types";

/**
 * Normalizes a raw URL input into a canonical HTTP/HTTPS URL.
 * - Trims whitespace
 * - Prepends `https://` if no protocol is present
 * - Preserves explicit `http://` protocol
 * - Strips hash fragments
 * - Validates the result is a parseable HTTP/HTTPS URL
 */
export function normalizeUrl(input: string): NormalizeResult {
  const trimmed = input.trim();

  if (!trimmed) {
    return { ok: false, error: "URL input is empty" };
  }

  // Reject non-http(s) protocols explicitly before prepending
  if (/^[a-z][a-z0-9+\-.]*:\/\//i.test(trimmed) && !/^https?:\/\//i.test(trimmed)) {
    return {
      ok: false,
      error: `Unsupported protocol in "${input}" — only http and https are allowed`,
    };
  }

  // Prepend https:// if no protocol is present
  const withProtocol =
    /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  let parsed: URL;
  try {
    parsed = new URL(withProtocol);
  } catch {
    return { ok: false, error: `Invalid URL: "${input}"` };
  }

  // Strip hash fragment
  parsed.hash = "";

  return { ok: true, url: parsed };
}
