# Changelog

All notable changes to GEO AI are documented in this file.

Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

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
- Footer: `© 2026 GEO AI · Open Source · GPL-2.0 License`
