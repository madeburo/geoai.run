# Implementation Plan: GEO AI Landing

## Overview

Incremental implementation of the GEO AI landing site — a modern, minimalist Next.js 16 landing page with animated sections, dot-pattern backgrounds, geometric SVG illustrations, and a separate analyzer page. Each task builds on previous steps, wiring components together progressively.

## Tasks

- [-] 1. Project setup and shared infrastructure
  - [-] 1.1 Install dependencies and initialize Shadcn UI
    - Install framer-motion, fast-check, @testing-library/react, @testing-library/jest-dom, vitest, jsdom
    - Initialize Shadcn UI (`npx shadcn@latest init`)
    - Add Shadcn components: button, input, card
    - Configure Vitest in `vitest.config.ts` with jsdom environment and React plugin
    - _Requirements: 1.1, 1.2_

  - [ ] 1.2 Configure theme system and global styles
    - Update `app/globals.css` with CSS custom properties for light theme (#ffffff bg, #0a0a0a text) and dark theme (#0a0a0a bg, #ffffff text) via `@media (prefers-color-scheme: dark)`
    - Configure Geist Sans and Geist Mono fonts in `app/layout.tsx`
    - Set smooth scroll behavior (`scroll-behavior: smooth`)
    - Add transition for theme color changes
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 1.2, 1.5_

  - [ ] 1.3 Set up SEO metadata in layout
    - Add meta title "GEO AI — AI Search Optimization" and meta description in `app/layout.tsx` using Next.js Metadata API
    - Add Open Graph tags (og:title, og:description, og:type, og:url)
    - Ensure semantic HTML structure: `<html>`, `<body>` with proper lang attribute
    - _Requirements: 13.1, 13.2, 13.4_

- [ ] 2. Shared visual components
  - [ ] 2.1 Create ScrollReveal wrapper component
    - Create `components/scroll-reveal.tsx` as a Client Component
    - Implement Framer Motion `motion.div` with `whileInView` and `viewport={{ once: true }}`
    - Support props: `children`, `className`, `delay`, `direction` ("up" | "down" | "left" | "right")
    - Animate only `opacity` and `y`/`x` (GPU-accelerated properties)
    - Check `prefers-reduced-motion` and skip animation if enabled
    - _Requirements: 12.1, 12.2, 12.3, 12.6_

  - [ ]* 2.2 Write property test for ScrollReveal — GPU-accelerated properties
    - **Property 12: Анимации используют только GPU-ускоренные свойства**
    - **Validates: Requirements 12.2**

  - [ ] 2.3 Create DotPatternBackground component
    - Create `components/dot-pattern-bg.tsx` as a Client Component
    - Implement Canvas rendering of world map dot pattern using normalized `[x, y]` coordinates
    - Add subtle animation via `requestAnimationFrame` (slow drift/pulse)
    - Support props: `className`, `dotColor`, `animated`
    - Check `prefers-reduced-motion` to disable animation
    - Handle SSR: guard with `typeof window !== 'undefined'`
    - _Requirements: 4.3, 12.5, 12.6, 15.1, 15.2_

  - [ ] 2.4 Create GeoIllustration SVG component
    - Create `components/geo-illustrations.tsx`
    - Implement three SVG illustration variants: "rings" (3D concentric rings), "radial-burst" (radial dot pattern), "parallel-lines" (parallel line pattern)
    - Use monochrome/muted color palette
    - Support props: `type` (IllustrationType), `className`
    - _Requirements: 5.3, 15.3, 15.7_

  - [ ]* 2.5 Write property test for GeoIllustration uniqueness
    - **Property 4: Уникальность иллюстраций на карточках экосистемы**
    - **Validates: Requirements 5.3, 15.3**

- [ ] 3. Navbar and Footer
  - [ ] 3.1 Implement Navbar component
    - Create `components/navbar.tsx` as a Client Component
    - Add GEO AI logo on the left
    - Add navigation links: Analyzer (/analyze), GitHub (external), Documentation (external), Specification (#spec)
    - Add "Sign in" button on the right
    - Apply sticky positioning (`sticky top-0`) with backdrop-blur on scroll
    - Clean minimalist style with transparent/white background
    - Responsive layout (hamburger menu for mobile)
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

  - [ ]* 3.2 Write property test for Navbar links
    - **Property 1: Навигационные ссылки присутствуют в Navbar**
    - **Validates: Requirements 3.3**

  - [ ] 3.3 Implement Footer component
    - Create `components/footer.tsx`
    - Display "GEO AI" title and "AI Search Optimization" subtitle
    - Add links: Analyzer (/analyze), GitHub (external), Documentation, Specification
    - Display domain geoai.run
    - Use semantic `<footer>` element
    - _Requirements: 11.1, 11.2, 11.3, 13.3_

  - [ ]* 3.4 Write property test for Footer links
    - **Property 10: Ссылки Footer содержат все обязательные элементы**
    - **Validates: Requirements 11.2**

- [ ] 4. Checkpoint — Shared components complete
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 5. Hero Section
  - [ ] 5.1 Implement Hero section component
    - Create `components/hero.tsx` as a Client Component
    - Full viewport height (`h-screen`) with white/light background
    - Integrate `DotPatternBackground` as subtle background layer
    - Add centered content: subtitle "Open-source AI Search Optimization", main heading "GEO AI" (large display font, fade-in animation), subheading text
    - Add primary CTA button "Run Analyzer" (link to /analyze) with subtle gradient effect
    - Add secondary text link "View on GitHub" (link to https://github.com/madeburo/GEO-AI)
    - Add AI Logos Bar at bottom with muted gray logos: ChatGPT, Claude, Gemini, Perplexity, Grok, Qwen
    - Implement fade-in and slide-up entrance animations
    - Use semantic `<section>` element
    - _Requirements: 4.1–4.12, 15.2, 13.3_

  - [ ]* 5.2 Write property test for AI logos in Hero
    - **Property 2: AI логотипы отображаются в Hero**
    - **Validates: Requirements 4.10**

- [ ] 6. Platform Ecosystem Section
  - [ ] 6.1 Implement Ecosystem section component
    - Create `components/ecosystem.tsx` as a Client Component
    - Grid layout: section title on the left, description on the right
    - Three product cards in a row: GEO AI Core (rings illustration), GEO AI Woo (radial-burst), GEO AI Shopify (parallel-lines)
    - Each card: GeoIllustration at top, bold title, description, "Read more →" link
    - Light gray card background (#f5f5f5 / #f8f9fa), no heavy borders, generous padding
    - Subtle hover effect (shadow lift) via Framer Motion `whileHover`
    - Wrap with ScrollReveal for entrance animation
    - Generous whitespace between cards and around section
    - _Requirements: 5.1–5.8, 15.4, 15.6_

  - [ ]* 6.2 Write property test for Ecosystem cards
    - **Property 3: Карточки экосистемы содержат все обязательные элементы**
    - **Validates: Requirements 5.2, 5.5**

- [ ] 7. How It Works Section
  - [ ] 7.1 Implement How It Works section component
    - Create `components/how-it-works.tsx` as a Client Component
    - Four steps with Lucide icons: "Generate llms.txt", "Configure AI crawler rules", "Add AI metadata", "Provide structured signals"
    - Subtle connection lines between steps (SVG or CSS borders)
    - Clean minimalist layout with whitespace
    - Sequential scroll reveal animation with stagger delay
    - _Requirements: 6.1–6.4_

  - [ ]* 7.2 Write property test for How It Works steps
    - **Property 5: Шаги How It Works отображаются полностью**
    - **Validates: Requirements 6.1**

- [ ] 8. Analyzer Demo Section
  - [ ] 8.1 Implement Analyzer demo section component
    - Create `components/analyzer.tsx` as a Client Component
    - Display heading "Check your AI search visibility"
    - URL input field with placeholder "Enter your website URL" and "Analyze site" button
    - Demo results: AI Visibility Score 72 with animated SVG circle gauge
    - Passed checks list (llms.txt detected, AI metadata present, structured schema)
    - Missing items list (crawler rules missing, AI summary missing)
    - Animated progress bars for visualization
    - "Fix with GEO AI" button
    - Animate score gauge and progress bars on viewport entry
    - _Requirements: 7.1–7.6_

  - [ ]* 8.2 Write property test for Analyzer results display
    - **Property 6: Результаты анализатора отображают все данные**
    - **Validates: Requirements 7.3**

- [ ] 9. Checkpoint — Main sections complete
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 10. Developer Quick Start Section
  - [ ] 10.1 Implement QuickStart section component
    - Create `components/quickstart.tsx` as a Client Component
    - Code block with install command: `npm install geo-ai-core`
    - Code block with usage example using `createGeoAI`
    - CSS-based syntax highlighting with Geist Mono font
    - Copy-to-clipboard button using `navigator.clipboard.writeText`
    - Fallback to `document.execCommand('copy')` if clipboard API unavailable
    - _Requirements: 8.1–8.5_

  - [ ]* 10.2 Write property test for clipboard copy
    - **Property 7: Копирование кода в буфер обмена**
    - **Validates: Requirements 8.5**

- [ ] 11. GEO Specification Section
  - [ ] 11.1 Implement Spec section component
    - Create `components/spec.tsx` as a Client Component
    - Display four specification elements: llms.txt, AI metadata, crawler rules, structured signals
    - Each element with Lucide icon, title, and description
    - Link to specification page
    - Scroll reveal animation on viewport entry
    - Use `id="spec"` for anchor navigation from Navbar
    - _Requirements: 9.1–9.4_

  - [ ]* 11.2 Write property test for Spec items
    - **Property 8: Элементы спецификации отображаются полностью**
    - **Validates: Requirements 9.2**

- [ ] 12. Open Source Section
  - [ ] 12.1 Implement OpenSource section component
    - Create `components/opensource.tsx` as a Client Component
    - Repository cards with links: GEO AI Core, GEO AI Woo, GEO AI Shopify, npm package
    - Display GitHub stars and npm downloads counts (static values)
    - Scroll reveal animation on viewport entry
    - _Requirements: 10.1–10.3_

  - [ ]* 12.2 Write property test for repository cards
    - **Property 9: Карточки репозиториев содержат все обязательные данные**
    - **Validates: Requirements 10.1, 10.2**

- [ ] 13. Landing page composition and wiring
  - [ ] 13.1 Compose landing page in app/page.tsx
    - Import and arrange all section components in correct order in `app/page.tsx` (Server Component)
    - Order: Navbar, Hero, Ecosystem, HowItWorks, Analyzer, QuickStart, Spec, OpenSource, Footer
    - Wrap main content in semantic `<main>` element, each section in `<section>`
    - Ensure smooth scrolling and generous whitespace between sections
    - _Requirements: 1.1, 1.4, 1.6, 13.3_

  - [ ]* 13.2 Write property test for semantic HTML structure
    - **Property 11: Семантическая HTML-разметка**
    - **Validates: Requirements 13.3**

- [ ] 14. Analyzer page
  - [ ] 14.1 Implement Analyzer page at /analyze
    - Create `app/analyze/page.tsx` as a Client Component
    - URL input field and "Analyze" button
    - Client-side URL validation with inline error message
    - Reuse Navbar and Footer components
    - Same visual style as landing page (theme, fonts, spacing)
    - _Requirements: 14.1, 14.2, 14.3_

- [ ] 15. Responsive design and polish
  - [ ] 15.1 Ensure responsive layout across all components
    - Test and adjust layouts for 320px–2560px screen widths
    - Ecosystem cards: 3-column on desktop, stack on mobile
    - How It Works: horizontal on desktop, vertical on mobile
    - Navbar: hamburger menu on mobile
    - Hero: adjust font sizes and spacing for mobile
    - _Requirements: 1.3, 1.6_

- [ ] 16. Final checkpoint — All features complete
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- All components use TypeScript with strict typing
- Server Components by default, Client Components only where needed (animations, interactivity)
