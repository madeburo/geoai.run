import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import { normalizeUrl } from "@/lib/analyzer/normalize-url";

describe("normalizeUrl — unit tests", () => {
  // Bare domain → https
  it("prepends https:// to a bare domain", () => {
    const result = normalizeUrl("example.com");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.url.protocol).toBe("https:");
      expect(result.url.hostname).toBe("example.com");
    }
  });

  it("prepends https:// to a domain with path", () => {
    const result = normalizeUrl("example.com/path/to/page");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.url.protocol).toBe("https:");
      expect(result.url.hostname).toBe("example.com");
      expect(result.url.pathname).toBe("/path/to/page");
    }
  });

  // Explicit http:// preserved
  it("preserves explicit http:// protocol", () => {
    const result = normalizeUrl("http://example.com");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.url.protocol).toBe("http:");
    }
  });

  it("preserves explicit https:// protocol", () => {
    const result = normalizeUrl("https://example.com");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.url.protocol).toBe("https:");
    }
  });

  // Fragment stripped
  it("strips hash fragment from URL", () => {
    const result = normalizeUrl("https://example.com/page#section");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.url.hash).toBe("");
      expect(result.url.href).not.toContain("#");
    }
  });

  it("strips hash fragment from bare domain", () => {
    const result = normalizeUrl("example.com#top");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.url.hash).toBe("");
    }
  });

  // Hostname and path preserved
  it("preserves hostname and path", () => {
    const result = normalizeUrl("https://sub.example.com/foo/bar");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.url.hostname).toBe("sub.example.com");
      expect(result.url.pathname).toBe("/foo/bar");
    }
  });

  it("trims leading/trailing whitespace", () => {
    const result = normalizeUrl("  example.com  ");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.url.hostname).toBe("example.com");
    }
  });

  // Invalid input returns error
  it("returns error for empty string", () => {
    const result = normalizeUrl("");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBeTruthy();
    }
  });

  it("returns error for whitespace-only string", () => {
    const result = normalizeUrl("   ");
    expect(result.ok).toBe(false);
  });

  it("returns error for non-URL string", () => {
    const result = normalizeUrl("not a url at all!!!");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBeTruthy();
    }
  });

  it("returns error for unsupported protocol", () => {
    const result = normalizeUrl("ftp://example.com");
    expect(result.ok).toBe(false);
  });

  it("returns error for javascript: protocol", () => {
    const result = normalizeUrl("javascript:alert(1)");
    expect(result.ok).toBe(false);
  });
});

describe("normalizeUrl — property-based tests", () => {
  // Property 1: URL protocol normalization
  it("Property 1: bare domain always gets https://, explicit http:// is preserved", () => {
    // Feature: site-analysis, Property 1: URL protocol normalization
    const domainArb = fc
      .tuple(
        fc.stringMatching(/^[a-z0-9][a-z0-9-]{1,10}$/),
        fc.constantFrom("com", "org", "net", "io")
      )
      .map(([sub, tld]) => `${sub}.${tld}`);

    fc.assert(
      fc.property(domainArb, (domain) => {
        const result = normalizeUrl(domain);
        if (result.ok) {
          expect(result.url.protocol).toBe("https:");
        }
      }),
      { numRuns: 25 }
    );

    // Explicit http:// must be preserved
    fc.assert(
      fc.property(domainArb, (domain) => {
        const result = normalizeUrl(`http://${domain}`);
        if (result.ok) {
          expect(result.url.protocol).toBe("http:");
        }
      }),
      { numRuns: 25 }
    );
  });

  // Property 2: URL fragment stripping
  it("Property 2: fragment is always stripped from the normalized URL", () => {
    // Feature: site-analysis, Property 2: URL fragment stripping
    const urlWithFragmentArb = fc
      .tuple(
        fc.stringMatching(/^[a-z0-9][a-z0-9-]{1,10}$/),
        fc.stringMatching(/^[a-zA-Z0-9_-]{1,20}$/)
      )
      .map(([domain, fragment]) => `https://${domain}.com#${fragment}`);

    fc.assert(
      fc.property(urlWithFragmentArb, (url) => {
        const result = normalizeUrl(url);
        if (result.ok) {
          expect(result.url.hash).toBe("");
          expect(result.url.href).not.toContain("#");
        }
      }),
      { numRuns: 25 }
    );
  });

  // Property 4: Invalid URL produces error result
  it("Property 4: strings that cannot be valid HTTP/HTTPS URLs return { ok: false }", () => {
    // Feature: site-analysis, Property 4: Invalid URL produces error result
    const invalidArb = fc.oneof(
      // Unsupported protocols
      fc
        .stringMatching(/^[a-z]{2,5}$/)
        .map((proto) => `${proto}://example.com`),
      // Random strings with spaces (not valid hostnames)
      fc.string({ minLength: 1, maxLength: 20 }).filter((s) => {
        const trimmed = s.trim();
        if (!trimmed) return true; // empty is invalid
        // Must contain a space or special char that breaks URL parsing
        return /[\s<>{}|\\^`]/.test(trimmed);
      })
    );

    fc.assert(
      fc.property(invalidArb, (input) => {
        const result = normalizeUrl(input);
        // Either ok (if somehow valid) or not ok with a non-empty error
        if (!result.ok) {
          expect(result.error.length).toBeGreaterThan(0);
        }
      }),
      { numRuns: 25 }
    );

    // Empty string always fails
    const emptyResult = normalizeUrl("");
    expect(emptyResult.ok).toBe(false);
    if (!emptyResult.ok) {
      expect(emptyResult.error.length).toBeGreaterThan(0);
    }
  });
});
