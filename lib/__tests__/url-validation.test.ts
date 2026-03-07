import { describe, it, expect } from "vitest";
import fc from "fast-check";

// Extract the validation logic to test it (mirrors app/analyze/page.tsx)
function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value.includes("://") ? value : `https://${value}`);
    return (
      (url.protocol === "https:" || url.protocol === "http:") &&
      url.hostname.includes(".") &&
      !url.hostname.endsWith(".") &&
      !/\s/.test(url.hostname) &&
      !/\.(exe|bat|cmd|msi|dll|sh|bin|app|dmg|rpm|deb)$/i.test(url.hostname)
    );
  } catch {
    return false;
  }
}

describe("isValidUrl()", () => {
  it("accepts valid domains", () => {
    expect(isValidUrl("example.com")).toBe(true);
    expect(isValidUrl("https://example.com")).toBe(true);
    expect(isValidUrl("http://sub.example.com")).toBe(true);
    expect(isValidUrl("https://example.co.uk/path")).toBe(true);
  });

  it("rejects invalid inputs", () => {
    expect(isValidUrl("")).toBe(false);
    expect(isValidUrl("not-a-url")).toBe(false);
    expect(isValidUrl("ftp://example.com")).toBe(false);
  });

  it("rejects file-like hostnames", () => {
    expect(isValidUrl("evil.exe")).toBe(false);
    expect(isValidUrl("malware.bat")).toBe(false);
    expect(isValidUrl("script.sh")).toBe(false);
    expect(isValidUrl("installer.msi")).toBe(false);
    expect(isValidUrl("program.dll")).toBe(false);
  });

  it("rejects hostnames ending with dot", () => {
    expect(isValidUrl("example.com.")).toBe(false);
  });

  it("rejects hostnames with whitespace", () => {
    expect(isValidUrl("exam ple.com")).toBe(false);
  });

  it("property: never throws", () => {
    fc.assert(
      fc.property(fc.string(), (input) => {
        const result = isValidUrl(input);
        expect(typeof result).toBe("boolean");
      }),
    );
  });

  it("property: valid URLs with known TLDs are accepted", () => {
    const tlds = ["com", "org", "net", "io", "dev", "co"];
    fc.assert(
      fc.property(
        fc.tuple(
          fc.stringMatching(/^[a-z][a-z0-9-]{1,20}$/),
          fc.constantFrom(...tlds),
        ),
        ([name, tld]) => {
          expect(isValidUrl(`${name}.${tld}`)).toBe(true);
        },
      ),
    );
  });
});
