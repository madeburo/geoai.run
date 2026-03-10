import Link from "next/link";
import {
  Zap,
  Package,
  FileText,
  Search,
  Terminal,
  ArrowRight,
  Box,
  ShoppingBag,
  Globe,
  Layers,
} from "lucide-react";

const startCards = [
  {
    icon: Zap,
    title: "Quick Start",
    description: "Get GEO AI running in your project in under 5 minutes.",
    href: "/docs/getting-started",
    accent: true,
  },
  {
    icon: FileText,
    title: "GEO Specification",
    description: "Understand llms.txt, AI metadata, and crawler rules.",
    href: "/docs/specification",
  },
  {
    icon: Search,
    title: "Analyzer",
    description: "Check your site's AI search visibility score.",
    href: "/docs/analyzer",
  },
  {
    icon: Package,
    title: "Choose a Package",
    description: "Pick the right integration for your stack.",
    href: "/docs/getting-started/choose",
  },
];

const packageCards = [
  {
    icon: Box,
    name: "geo-ai-core",
    label: "GEO AI Core",
    description: "Universal TypeScript engine. Zero dependencies. Works with any Node.js framework.",
    href: "/docs/packages/core",
    badge: "npm",
  },
  {
    icon: Layers,
    name: "geo-ai-next",
    label: "GEO AI Next",
    description: "Next.js integration — static file generation, middleware, and App Router route handler.",
    href: "/docs/packages/next",
    badge: "npm",
  },
  {
    icon: Globe,
    name: "geo-ai-woo",
    label: "GEO AI Woo",
    description: "WordPress & WooCommerce plugin. Zero-config setup, WooCommerce-first.",
    href: "/docs/packages/woo",
    badge: "plugin",
  },
  {
    icon: ShoppingBag,
    name: "geo-ai-shopify",
    label: "GEO AI Shopify",
    description: "Shopify embedded app. Native metafields, App Proxy, multilingual support.",
    href: "/docs/packages/shopify",
    badge: "app",
  },
];

const pathCards = [
  { label: "I want to analyze a site", href: "/docs/analyzer" },
  { label: "I want to generate GEO files", href: "/docs/getting-started" },
  { label: "I use Next.js", href: "/docs/packages/next" },
  { label: "I use WordPress / WooCommerce", href: "/docs/packages/woo" },
  { label: "I use Shopify", href: "/docs/packages/shopify" },
  { label: "I want to understand the spec", href: "/docs/specification" },
];

export default function DocsHomePage() {
  return (
    <div className="max-w-3xl">
      {/* Page title */}
      <div className="mb-10">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-glow">
          GEO AI
        </p>
        <h1 className="mb-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Documentation
        </h1>
        <p className="text-base text-muted-foreground leading-relaxed max-w-xl">
          Use these docs to integrate GEO AI, understand the specification, and choose the right package for your stack.
        </p>
        <p className="mt-2 text-sm text-muted-foreground/60 leading-relaxed max-w-xl">
          GEO AI generates{" "}
          <code className="rounded px-1.5 py-0.5 text-[0.875em] font-mono bg-white/6 text-glow border border-white/8">
            llms.txt
          </code>
          , AI crawler rules, and metadata to make your site visible to ChatGPT, Claude, Gemini, Perplexity, and more.
        </p>
      </div>

      {/* Start here */}
      <section className="mb-12">
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground/50">
          Start here
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {startCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.href}
                href={card.href}
                className={`group flex items-start gap-3.5 rounded-lg border p-4 transition-all ${
                  card.accent
                    ? "border-glow/25 bg-glow/5 hover:border-glow/40 hover:bg-glow/8"
                    : "border-border/60 bg-card/40 hover:border-border hover:bg-card/70"
                }`}
              >
                <div
                  className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md ${
                    card.accent ? "bg-glow/15 text-glow" : "bg-white/5 text-muted-foreground"
                  }`}
                >
                  <Icon className="size-4" />
                </div>
                <div className="min-w-0">
                  <p className={`mb-0.5 text-sm font-semibold ${card.accent ? "text-glow" : "text-foreground"}`}>
                    {card.title}
                  </p>
                  <p className="text-xs text-muted-foreground/70 leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Packages */}
      <section className="mb-12">
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground/50">
          Packages
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {packageCards.map((pkg) => {
            const Icon = pkg.icon;
            return (
              <Link
                key={pkg.href}
                href={pkg.href}
                className="group flex items-start gap-3.5 rounded-lg border border-border/60 bg-card/40 p-4 transition-all hover:border-border hover:bg-card/70"
              >
                <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-white/5 text-muted-foreground group-hover:text-foreground transition-colors">
                  <Icon className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-0.5 flex items-center gap-2">
                    <p className="text-sm font-semibold text-foreground">{pkg.label}</p>
                    <span className="rounded px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide bg-white/6 text-muted-foreground/60">
                      {pkg.badge}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-muted-foreground/50 mb-1">{pkg.name}</p>
                  <p className="text-xs text-muted-foreground/70 leading-relaxed">
                    {pkg.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Choose your path */}
      <section className="mb-12">
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground/50">
          Choose your path
        </h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {pathCards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group flex items-center justify-between rounded-md border border-border/60 px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:border-border hover:text-foreground"
            >
              <span>{card.label}</span>
              <ArrowRight className="size-3.5 opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
            </Link>
          ))}
        </div>
      </section>

      {/* Coming next */}
      <section>
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground/50">
          Coming next
        </h2>
        <div className="grid gap-2 sm:grid-cols-3">
          {[
            { icon: Terminal, label: "CLI", href: "/docs/integrations/cli" },
            { icon: Layers, label: "NestJS", href: "/docs/integrations/nestjs" },
            { icon: Globe, label: "Laravel", href: "/docs/integrations/laravel" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2.5 rounded-md border border-border/40 px-4 py-2.5 text-sm text-muted-foreground/50 transition-colors hover:border-border/60 hover:text-muted-foreground"
              >
                <Icon className="size-4 shrink-0" />
                <span>{item.label}</span>
                <span className="ml-auto rounded-sm px-1.5 py-px text-[9px] font-semibold uppercase tracking-wider border border-border/40 text-muted-foreground/35">
                  soon
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
