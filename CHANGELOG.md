# Changelog

All notable changes to GEO AI are documented in this file.

Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

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
