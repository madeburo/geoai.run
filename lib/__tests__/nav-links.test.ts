import { describe, it, expect } from "vitest";
import { NAV_LINKS } from "@/lib/nav-links";

describe("NAV_LINKS", () => {
  it("is a non-empty array", () => {
    expect(NAV_LINKS.length).toBeGreaterThan(0);
  });

  it("every link has label and href", () => {
    for (const link of NAV_LINKS) {
      expect(link.label).toBeTruthy();
      expect(link.href).toBeTruthy();
    }
  });

  it("external links have external flag", () => {
    for (const link of NAV_LINKS) {
      if (link.href.startsWith("http")) {
        expect(link.external).toBe(true);
      }
    }
  });

  it("internal links start with / or #", () => {
    for (const link of NAV_LINKS) {
      if (!link.external) {
        expect(link.href).toMatch(/^[/#]/);
      }
    }
  });
});
