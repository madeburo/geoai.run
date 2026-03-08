<p align="center">
  Open-Source AI Search Optimization
</p>

<p align="center">
  <a href="https://geoai.run">Website</a> ·
  <a href="https://github.com/madeburo/GEO-AI">GitHub</a> ·
  <a href="https://www.npmjs.com/package/geo-ai-core">npm</a>
</p>

---

## What is GEO AI?

GEO AI helps websites become visible to AI-powered search engines like ChatGPT, Claude, Gemini, Perplexity, Grok, Qwen, and DeepSeek. It generates `llms.txt`, AI crawler rules, and structured metadata so AI systems can accurately discover, understand, and cite your content.

## Ecosystem

| Product | Description | Link |
|---------|-------------|------|
| **GEO AI Core** | TypeScript engine for AI search optimization | [GitHub](https://github.com/madeburo/GEO-AI) |
| **GEO AI Woo** | WordPress & WooCommerce plugin | [GitHub](https://github.com/madeburo/GEO-AI-Woo) |
| **GEO AI Shopify** | Shopify app for AI visibility | [GitHub](https://github.com/madeburo/GEO-AI-Shopify) |

## Quick Start

```bash
npm install geo-ai-core
```

```typescript
import { createGeoAI } from "geo-ai-core";

const geoai = createGeoAI({
  siteUrl: "https://example.com",
  outputDir: "./public",
});

await geoai.generateLlmsTxt();
await geoai.generateCrawlerRules();
await geoai.generateMetadata();
```

## How It Works

1. **Generate llms.txt** — a structured file that describes your site to large language models
2. **Configure AI crawler rules** — control how AI crawlers access and index your content
3. **Add AI metadata** — semantic markup and meta tags for AI search engines
4. **Provide structured signals** — machine-readable data formats for accurate content surfacing

## GEO Specification

GEO defines a set of structured signals that make websites visible to AI-powered search:

- `llms.txt` — site description for LLMs
- AI metadata — semantic markup for AI search engines
- Crawler rules — directives for AI crawlers
- Structured signals — machine-readable data formats

[Read the full spec →](https://github.com/madeburo/GEO-AI)

## About This Site

This repository contains the landing page for [geoai.run](https://geoai.run), built with:

- **Next.js 16** (App Router, React 19)
- **TypeScript** (strict mode)
- **Tailwind CSS 4** with oklch color theming
- **shadcn/ui** components (`@base-ui/react` primitives)
- **Framer Motion** animations (respects `prefers-reduced-motion`)
- **next-intl** — i18n with 9 languages (DE, EN, ES, FR, JA, KO, PT, RU, ZH)
- **Vitest** + React Testing Library + fast-check

Features: light/dark theme, scroll-reveal animations, responsive design, mobile-first horizontal scroll sections, infinite marquee, SEO metadata with Open Graph, and an AI visibility analyzer page.

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run test` | Run tests |
| `npm run lint` | Lint |

## License

MIT — see [LICENSE](LICENSE) for details.

---

<p align="center">
  <a href="https://geoai.run">geoai.run</a>
</p>
