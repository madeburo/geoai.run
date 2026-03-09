import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { fetchHtml, fetchText } from "@/lib/analyzer/fetch-html";

// Helper to build a mock Response
function mockResponse(
  body: string,
  status: number,
  headers: Record<string, string> = {},
  url = "https://example.com/"
): Response {
  const responseHeaders = new Headers({
    "content-type": "text/html",
    ...headers,
  });
  return {
    ok: status >= 200 && status < 300,
    status,
    url,
    text: () => Promise.resolve(body),
    headers: responseHeaders,
  } as unknown as Response;
}

describe("fetchHtml", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("sets User-Agent header to GEO-AI-Analyzer/1.0", async () => {
    vi.mocked(fetch).mockResolvedValue(mockResponse("<html/>", 200));

    await fetchHtml("https://example.com");

    expect(fetch).toHaveBeenCalledWith(
      "https://example.com",
      expect.objectContaining({
        headers: expect.objectContaining({ "User-Agent": "GEO-AI-Analyzer/1.0" }),
      })
    );
  });

  it("follows redirects (redirect: follow)", async () => {
    vi.mocked(fetch).mockResolvedValue(mockResponse("<html/>", 200));

    await fetchHtml("https://example.com");

    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ redirect: "follow" })
    );
  });

  it("returns ok:true with body, status, finalUrl, and headers for a 200 response", async () => {
    vi.mocked(fetch).mockResolvedValue(
      mockResponse("<html>hello</html>", 200, { "x-custom": "value" }, "https://example.com/final")
    );

    const result = await fetchHtml("https://example.com");

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.body).toBe("<html>hello</html>");
      expect(result.status).toBe(200);
      expect(result.finalUrl).toBe("https://example.com/final");
      expect(result.headers["x-custom"]).toBe("value");
    }
  });

  it("returns ok:true with status 404 (HTTP error is not a network error)", async () => {
    vi.mocked(fetch).mockResolvedValue(mockResponse("Not Found", 404));

    const result = await fetchHtml("https://example.com/missing");

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.status).toBe(404);
    }
  });

  it("returns ok:true with status 500", async () => {
    vi.mocked(fetch).mockResolvedValue(mockResponse("Server Error", 500));

    const result = await fetchHtml("https://example.com");

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.status).toBe(500);
    }
  });

  it("returns ok:true with status 403", async () => {
    vi.mocked(fetch).mockResolvedValue(mockResponse("Forbidden", 403));

    const result = await fetchHtml("https://example.com");

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.status).toBe(403);
    }
  });

  it("returns ok:false with kind:network on network error", async () => {
    vi.mocked(fetch).mockRejectedValue(new TypeError("Failed to fetch"));

    const result = await fetchHtml("https://unreachable.example.com");

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.kind).toBe("network");
      expect(result.error).toBeTruthy();
    }
  });

  it("returns ok:false on timeout (AbortError)", async () => {
    const abortError = new DOMException("The operation was aborted", "AbortError");
    vi.mocked(fetch).mockRejectedValue(abortError);

    const result = await fetchHtml("https://slow.example.com");

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.kind).toBe("network");
      expect(result.error).toBeTruthy();
    }
  });

  it("uses AbortSignal.timeout for the 15-second deadline", async () => {
    const timeoutSpy = vi.spyOn(AbortSignal, "timeout");
    vi.mocked(fetch).mockResolvedValue(mockResponse("<html/>", 200));

    await fetchHtml("https://example.com");

    expect(timeoutSpy).toHaveBeenCalledWith(15_000);
    timeoutSpy.mockRestore();
  });
});

describe("fetchText", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("sets User-Agent header to GEO-AI-Analyzer/1.0", async () => {
    vi.mocked(fetch).mockResolvedValue(
      mockResponse("User-agent: *\nDisallow:", 200, { "content-type": "text/plain" })
    );

    await fetchText("https://example.com/robots.txt");

    expect(fetch).toHaveBeenCalledWith(
      "https://example.com/robots.txt",
      expect.objectContaining({
        headers: expect.objectContaining({ "User-Agent": "GEO-AI-Analyzer/1.0" }),
      })
    );
  });

  it("returns ok:true with body for a 200 text response", async () => {
    const body = "# llms.txt\nhttps://example.com/docs";
    vi.mocked(fetch).mockResolvedValue(
      mockResponse(body, 200, { "content-type": "text/plain" })
    );

    const result = await fetchText("https://example.com/llms.txt");

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.body).toBe(body);
      expect(result.status).toBe(200);
    }
  });

  it("returns ok:true with status 404", async () => {
    vi.mocked(fetch).mockResolvedValue(mockResponse("", 404));

    const result = await fetchText("https://example.com/llms.txt");

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.status).toBe(404);
    }
  });

  it("returns ok:false with kind:network on network error", async () => {
    vi.mocked(fetch).mockRejectedValue(new TypeError("DNS resolution failed"));

    const result = await fetchText("https://unreachable.example.com/robots.txt");

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.kind).toBe("network");
      expect(result.error).toBeTruthy();
    }
  });

  it("uses AbortSignal.timeout for the 15-second deadline", async () => {
    const timeoutSpy = vi.spyOn(AbortSignal, "timeout");
    vi.mocked(fetch).mockResolvedValue(
      mockResponse("content", 200, { "content-type": "text/plain" })
    );

    await fetchText("https://example.com/sitemap.xml");

    expect(timeoutSpy).toHaveBeenCalledWith(15_000);
    timeoutSpy.mockRestore();
  });
});
