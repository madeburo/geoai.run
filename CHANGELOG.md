# Changelog

All notable changes to GEO AI are documented in this file.

Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

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
