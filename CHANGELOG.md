# Changelog

All notable changes to GEO AI are documented in this file.

Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [0.2.4] — 2026-03-12

Mobile UI fixes

### Fixed

- `components/docs/mobile-nav.tsx` — docs drawer now renders via `createPortal` into `document.body`, bypassing the sticky nav bar's `backdrop-filter` stacking context that was clipping the drawer; drawer covers full screen height, backdrop and scroll-lock work correctly
- `app/analyze/page.tsx` — secondary action buttons restructured: "Read docs" and "View on GitHub" in one row, `npm install geo-ai-core` as a full-width row below — prevents text wrapping and unequal button heights on mobile

### Changed

- `components/cli-preview-section.tsx` — section heading now uses `t("title")` from `cliPage` translations

---

## [0.2.3] — 2026-03-11

Animated CLI terminal preview on `/cli` hero and page.

### Added

- `components/cli-terminal-preview.tsx` — animated terminal card: types each command letter-by-letter (`npx geo-ai init`, `npx geo-ai generate`, `npx geo-ai validate`), pauses, shows output lines (`✓ Created geo-ai.config.ts`, etc.), then loops; respects `useReducedMotion` (renders all lines statically when motion is reduced)
- `components/cli-preview-section.tsx` — page section embedding the terminal preview with text and CTA; placed after the GEO Specification block on the homepage

### Changed

- `app/cli/page.tsx` — hero redesigned from single-column to two-column layout (text left, animated terminal right); all hardcoded strings replaced with `useTranslations("cliPage")`
- `app/page.tsx` — `<CliPreviewSection />` inserted between `<Spec />` and `<Ecosystem />`
- `messages/en.json` and all 8 locale files (de, es, fr, ja, ko, pt, ru, zh) — `cliPage` namespace added with full translations for the `/cli` page: hero, install section, four commands, config section, why-CLI cards, ecosystem links, and CTA

---

## [0.2.2] — 2026-03-11

Contact page and 404 spacing polish.

### Added

- `app/contact/page.tsx` — `/contact` page

### Changed

- `components/navbar.tsx` — GitHub removed from desktop and mobile nav; Contact page added
- `components/footer.tsx` — GitHub removed from footer links; Contact added
- `components/docs/mobile-nav.tsx` — docs drawer fixed on mobile: `z-index` raised to `z-60`, drawer now starts at `top-[57px]` (below navbar) instead of `top-0`, padding restored; navigation items were previously hidden behind the navbar

---

## [0.2.1] — 2026-03-11

GEO Specification as a top-level product pillar: standalone overview page, full docs section.

### Added

- `app/specification/page.tsx` — standalone `/specification` page: hero, "Why it exists" framing cards, four implementation layers, "How the Analyzer uses the spec" cards, scoring model with status table and formula, GEO-ready definition block, packages grid, and final CTA section; full i18n via `useTranslations("specificationPage")`
- GEO Specification docs section: 7 pages at `/docs/specification/*` (Overview, llms.txt, AI Metadata, Crawler Rules, Structured Signals, Scoring, Recommendations) replacing legacy `/docs/concepts/*`

### Changed

- All "Specification" nav links updated from `#spec` / `/#spec` to `/specification` — `components/navbar.tsx`, `components/footer.tsx`, `lib/nav-links.ts`, `app/not-found.tsx`
- `components/spec.tsx` — "Read Spec" link updated to `/specification`

---

## [0.2.0] — 2026-03-10

Full documentation experience at `/docs` technical docs.

### Added

- `app/docs/` — new `/docs` route with dedicated docs layout (sticky left sidebar, right-side TOC on desktop, mobile drawer navigation)
- `app/docs/page.tsx` — docs homepage: intro, "Start here" cards, package grid, "Choose your path" shortcuts, "Coming next" section
- `app/docs/[...slug]/page.tsx` — dynamic route covering all doc pages; breadcrumbs, prev/next navigation, right-side TOC, `generateStaticParams` for static build
- `lib/docs/navigation.ts` — sidebar navigation structure (6 sections, 21 items) and `getPrevNext()` helper
- `lib/docs/content.ts` — slug-to-page mapping for all doc routes
- `components/docs/doc-sidebar.tsx` — sticky sidebar with active item highlight and "soon" badges
- `components/docs/doc-toc.tsx` — right-side table of contents with `IntersectionObserver`-based active section tracking
- `components/docs/mobile-nav.tsx` — mobile docs drawer triggered from a sticky bar below the header
- `components/docs/breadcrumbs.tsx` — breadcrumb trail component
- `components/docs/prev-next.tsx` — previous/next page navigation at the bottom of each doc
- `components/docs/callout.tsx` — note/warning/tip/success callout blocks
- `components/docs/code-block.tsx` — premium code block with filename, language label, and copy button; `InlineCode` component
- `components/docs/doc-heading.tsx` — typed heading and table primitives (`H1`, `H2`, `H3`, `Lead`, `P`, `UL`, `LI`, `IC`, `DocTable`, etc.)
- 21 documentation pages covering: Getting Started, Choose Your Package, GEO Specification, llms.txt, AI Metadata, Crawler Rules, Structured Signals, GEO AI Core, GEO AI Next, GEO AI Woo, GEO AI Shopify, Analyzer, Scoring, Recommendations, CLI, NestJS (placeholder), Laravel (placeholder), Configuration Reference, API Reference, FAQ

### Changed

- `components/navbar.tsx` — "Documentation" link updated from `#` to `/docs`
- `components/footer.tsx` — "Documentation" link updated from `#` to `/docs`
- `components/quickstart.tsx` — `USAGE_CODE` corrected to match actual `geo-ai-core` API: added required `siteName` and `provider` fields, replaced non-existent methods (`generateLlmsTxt`, `generateCrawlerRules`, `generateMetadata`) with real ones (`generateLlms`, `generateRobotsTxt`, `generateMetaTags`, `generateJsonLd`)

---

## [0.1.10] — 2026-03-10

Analyzer score/issues consistency fix, optional improvements section, and richer llms.txt content.

### Changed

- `app/analyze/page.tsx` — low-severity issues no longer appear under "Implementation issues"; they render in a separate visually subdued "Optional improvements" block — a 100/100 score with only minor metadata gaps no longer looks contradictory
- `lib/geo-provider.ts` — provider enriched with `keywords` and `content` fields on all resources; added Documentation section (Getting Started, GEO Specification); product descriptions unified in style — `llms-full.txt` is now meaningfully richer than `llms.txt` (content fields are appended only in full mode by the library)
- `messages/*.json` — `optionalImprovements` key added to `whatYouGet` in all 9 locales (en, de, es, fr, ja, ko, pt, ru, zh)

---

## [0.1.9] — 2026-03-10

Dependency updates, static llms.txt generation, and mobile animation fixes.

### Added

- `geo-ai.config.mjs` — static config for `geo-ai-generate` CLI: site name, URL, description, pages and products
- `geo:generate` script in `package.json` — runs `geo-ai-generate` to produce `public/llms.txt` and `public/llms-full.txt` before build
- `build` script now runs `geo:generate` before `next build` — static files are generated at build time, no middleware needed

### Changed

- `geo-ai-next` and `geo-ai-core` updated from `0.1.2` to `0.2.0`
- `components/scroll-reveal.tsx` — added `mobileStatic` prop; when set, renders children without animation on mobile (`< 768px`) via `matchMedia`
- `components/ecosystem.tsx` — Platform Ecosystem cards use `mobileStatic` on `ScrollReveal` — no slide-up or fade on mobile
- `components/navbar.tsx` — GitHub link moved to last position in nav; mobile menu items animate with fade only (removed `x: -12` slide)

---

## [0.1.8] — 2026-03-10

404 page redesigned as a product-recovery screen.

### Changed

- `app/not-found.tsx` — replaced minimal single-button 404 with a brand-aware recovery page: GEO AI logo, large 404 heading, descriptive subtitle, three primary CTAs (Go home, Open analyzer, Read docs), and a "Popular destinations" quick-links row (Analyzer, Documentation, Specification, GitHub); subtle radial glow background matches product atmosphere

---

## [0.1.7] — 2026-03-09

Live site analysis wired up end-to-end.

### Added

- `app/api/analyze/route.ts` — GET endpoint that calls `analyzeSiteForAIReadiness`, with rate limiting (via `lib/rate-limit.ts`) and input validation
- `/analyze` page now runs real analysis: loading state with 4 check chips, score display, per-category status cards with pass/warn/fail/not_found/unknown icons, issues list (color-coded by severity), and recommendations list
- `?url=` query param auto-triggers analysis on page load — hero form on homepage navigates directly into a live result
- `analyzing`, `errorRateLimit`, `errorApi` translation keys added to all 9 locales

### Changed

- Landing content (check cards, how it works, what you get) now only renders when no analysis is active — replaced by live results after submission

---

## [0.1.6] — 2026-03-09

Site analysis module and /analyze page redesign.

### Added

- `lib/analyzer/` — full site analysis module: `analyzeSiteForAIReadiness(url)` orchestrator, four checkers (llms.txt, AI metadata, crawler rules, structured signals), URL normalizer, HTML fetcher, score calculator, helper utilities, and all public TypeScript types
- 160 unit and property-based tests across all analyzer modules (Vitest + fast-check)
- `/analyze` page redesigned: 4 check cards (llms.txt, AI metadata, crawler rules, structured signals), "How it works" 3-step block, "What you get" panel, trust lines (no signup, runs in seconds, checks GEO spec), scope subheadline
- New `analyze` i18n keys (`scope`, `trust.*`, `checksLabel`, `checks.*`, `howLabel`, `how[]`, `whatYouGetLabel`, `whatYouGet.*`) added to all 9 locales

### Changed

- Property-based test `numRuns` reduced from 100 to 25 across all test files — test suite runs in ~1.2s

---

## [0.1.5] — 2026-03-09

Secondary action row, /analyze page content, i18n fixes, hydration fix, middleware – proxy migration.

### Added

- Secondary action row in hero (below the analyzer form): "Read docs" (accented), "View on GitHub" (outline), `npm install geo-ai-core` (copyable code chip with copy/check icon)
- Same secondary action row on `/analyze` page below the form, with a localized description
- `readDocs`, `viewOnGithub`, `generateDescription` translation keys added to all 9 locales in both `hero` and `analyze` namespaces

### Changed

- `middleware.ts` renamed to `proxy.ts`, exported function renamed from `middleware` to `proxy` — resolves Next.js 16 deprecation warning
- `app/layout.tsx` — removed hardcoded `dark` class from `<html>`; added inline `<script>` in `<head>` that synchronously reads `localStorage` and applies `dark` class before hydration; added `suppressHydrationWarning` on `<html>`; dark mode remains the default for new visitors
- `components/cookie-banner.tsx` — fixed hydration mismatch: `consent` state now always initializes as `null` on server; `localStorage` is read in `useEffect` only

### Fixed

- Hydration mismatch caused by `CookieBanner` reading `localStorage` in `useState` initializer (server/client divergence)
- Hydration mismatch caused by theme class difference between SSR (`dark`) and client (user preference)
- `Github` icon import replaced with `Github as GithubIcon` in `hero.tsx` and `analyze/page.tsx` — resolves lucide-react deprecation hint

---

## [0.1.4] — 2026-03-08

Cookie consent banner with Clarity integration.

### Added

- `components/cookie-banner.tsx` — fixed bottom-right consent banner
- Cookie consent logic: `accepted` – loads Clarity script dynamically; `rejected` – no tracking; `unset` – banner shown; choice persisted in `localStorage`
- Small "cookies" re-open trigger shown after consent is set, allowing the user to change their choice
- `cookies` translation keys (`message`, `accept`, `reject`, `settings`) added to all 9 locales: en, ru, de, es, fr, ja, ko, pt, zh

### Changed

- `app/layout.tsx` — removed inline Clarity script injection; Clarity now loads only after user consent via `CookieBanner`

---

## [0.1.3] — 2026-03-08

Language selector redesign and localized SEO infrastructure.

### Added

- `lib/locale-utils.ts` — single source of truth for locale data: `LOCALES` constant array, `Locale` type, `LOCALE_META` record (shortCode + nativeName per locale), `toBcp47` helper mapping `zh` → `zh-CN`
- `LanguageSelector` component in `components/navbar.tsx` replaces `LanguageSwitcher`:
  - Trigger button with Globe icon and active locale short code (EN, DE, …)
  - Dropdown list showing native language name and short code per option
  - Active locale highlight (background + Check icon) with `aria-current="true"`
  - Full keyboard navigation: Enter/Space/ArrowDown open the menu, ArrowUp/Down move focus with wrapping, Escape closes and returns focus to trigger
  - ARIA attributes: `aria-haspopup="menu"`, `aria-expanded`, `role="menu"`, `role="menuitem"`
  - Framer Motion `AnimatePresence` animation respecting `useReducedMotion`
- `app/layout.tsx` — expanded SEO metadata:
  - `<html lang>` now uses BCP 47 tag via `toBcp47(locale)` (zh → zh-CN)
  - `alternates.canonical` — absolute URL for the current page
  - `alternates.languages` — hreflang links for all 9 locales + `x-default`
  - `openGraph.locale` and `openGraph.alternateLocale` with BCP 47 tags
  - Localized `title`, `description`, `og:title`, `og:description` from the active locale's message catalog
- `app/sitemap.ts` — locale alternates annotation:
  - Entries for `/` and `/analyze` now include `alternates.languages` with all 9 BCP 47 tags pointing to the base URL (cookie-based routing, no path prefixes)

---

## [0.1.2] — 2026-03-08

UI polish, new languages, and localized SEO.

### Added

- 3 new languages: Japanese (JA), Korean (KO), Simplified Chinese (ZH) — total 9 languages
- Localized `<title>`, `<meta description>`, Open Graph, and Twitter Card tags via `generateMetadata`
- `hreflang` alternates for all 9 locales on `/` and `/analyze`
- CJK font support: Noto Sans JP, Noto Sans KR, Noto Sans SC as fallbacks
- Locale validation in `/api/locale` route

### Changed

- Light theme background updated to `#f4faff` (cool blue tint)
- Light theme surfaces (card, input, border, muted, accent, surface) shifted to `#e0ebf8` blue tone — removes yellowish cast
- Input component uses `bg-white/60` instead of `bg-transparent` in light mode
- SVG illustrations in Platform Ecosystem now use darker blue (`oklch(0.45 0.15 250)`) on light theme for visibility, with `dark:` variant preserving original glow color
- Hero section height reduced from `min-h-screen` to `min-h-[85vh]` on desktop
- Reduced vertical padding on all landing sections (How It Works, Quick Start, Spec, Ecosystem, Open Source) from `py-24/md:py-32/lg:py-40` to `py-16/md:py-20/lg:py-24`
- Hero bottom fade reduced from `h-32` to `h-20`
- AI logos marquee top padding reduced from `pt-12/sm:pt-16` to `pt-8/sm:pt-10`
- Language selector now sorted alphabetically (DE, EN, ES, FR, JA, KO, PT, RU, ZH)
- Metadata converted from static `export const metadata` to dynamic `generateMetadata()` for locale-aware SEO

---

## [0.1.1] — 2026-03-08

Post-release cleanup and mobile UX fixes.

### Fixed

- Hero text and form no longer overflow on mobile (added container `max-w`, proper `px` padding)
- Disabled parallax effect on mobile to prevent content clipping under `overflow-hidden`
- Added `overflow-x-hidden` on `html` to eliminate horizontal scroll globally
- Mobile menu now opens reliably — moved overlay out of `sticky` nav to avoid stacking context issues
- Mobile menu covers full screen (`fixed inset-0`) without scrolling behind it

### Changed

- Hero section uses `min-h-[80vh]` on mobile instead of `min-h-screen` to reduce gap before How It Works
- Mobile menu z-index raised to `z-60` above navbar
- Removed separate backdrop overlay for mobile menu (unnecessary with fullscreen panel)
- Description text size reduced to `text-sm` on mobile for better fit
- License updated from GPL-2.0 to MIT
- Removed logo image from README header

---

## [0.1.0] — 2026-03-07

Initial release. Site and project foundation.

### Added

- Site composed of sections: Hero, How It Works, Quick Start, Spec, Ecosystem
- Responsive navbar with mobile hamburger menu (fixed overlay, backdrop blur, slide-down animation, staggered links)
- `/analyze` page with URL validation (analysis not yet implemented)
- Internationalization (i18n) via `next-intl` — 6 languages: EN, DE, FR, ES, PT, RU
- Cookie-based locale switching with language selector in navbar
- Light/dark theme toggle with deep navy foreground in light mode
- `ScrollReveal` component for scroll-triggered fade-in animations
- Framer Motion animations with `prefers-reduced-motion` support
- Infinite marquee animation for AI engine names in hero
- Horizontal scroll for Ecosystem, How It Works, and Spec cards on mobile
- Text selection styling (deep navy background)
- Global `cursor-pointer` for all interactive elements
- GitHub wordmark logo in Open Source section
- Logo CSS filter for deep navy in light mode (`logo-navy` utility)
- `scrollbar-hide` CSS utility
- shadcn/ui primitives: Button, Card, Input (base-nova style, `@base-ui/react`)
- `cn()` utility (`clsx` + `tailwind-merge`)
- Vitest + React Testing Library + fast-check configuration
- ESLint 9 flat config (core-web-vitals + typescript)
- Manrope font with cyrillic subset via `next/font/google`
- SEO metadata with Open Graph tags
- Footer: `© 2026 GEO AI · Open Source`
