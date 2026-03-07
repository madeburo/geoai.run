import { describe, it, expect } from "vitest";
import { GEO_SITE_NAME, GEO_SITE_URL, GEO_SITE_DESCRIPTION, createGeoProvider } from "@/lib/geo-config";

describe("geo-config", () => {
  it("exports consistent site name", () => {
    expect(GEO_SITE_NAME).toBe("GEO AI");
  });

  it("exports HTTPS URL with www", () => {
    expect(GEO_SITE_URL).toMatch(/^https:\/\/www\./);
  });

  it("exports non-empty description", () => {
    expect(GEO_SITE_DESCRIPTION.length).toBeGreaterThan(0);
  });

  it("creates a provider with getSections method", () => {
    const provider = createGeoProvider();
    expect(typeof provider.getSections).toBe("function");
  });

  it("provider returns sections with resources", async () => {
    const provider = createGeoProvider();
    const sections = await provider.getSections();
    expect(sections.length).toBeGreaterThan(0);
    for (const section of sections) {
      expect(section).toHaveProperty("name");
      expect(section).toHaveProperty("resources");
      expect(section.resources.length).toBeGreaterThan(0);
    }
  });
});
