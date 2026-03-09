"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ScrollReveal } from "@/components/scroll-reveal";
import {
  NodejsLogo,
  NestjsLogo,
  NextjsLogo,
  WordpressLogo,
  WoocommerceLogo,
  ShopifyLogo,
} from "@/components/platform-logos";

interface PlatformLogo {
  component: React.ComponentType<{ className?: string }>;
  name: string;
  wide?: boolean;
  tall?: boolean; // wide logos that need extra height to match icon size visually
}

interface EcosystemProduct {
  key: string;
  href: string;
  label: string;
  logos: PlatformLogo[];
}

const ECOSYSTEM_PRODUCTS: EcosystemProduct[] = [
  {
    key: "core",
    href: "https://github.com/madeburo/GEO-AI",
    label: "Core",
    logos: [
      { component: NodejsLogo, name: "Node.js" },
      { component: NestjsLogo, name: "NestJS" },
      { component: NextjsLogo, name: "Next.js", wide: true },
    ],
  },
  {
    key: "woo",
    href: "https://github.com/madeburo/GEO-AI-Woo",
    label: "Plugin",
    logos: [
      { component: WordpressLogo, name: "WordPress" },
      { component: WoocommerceLogo, name: "WooCommerce", wide: true },
    ],
  },
  {
    key: "shopify",
    href: "https://github.com/madeburo/GEO-AI-Shopify",
    label: "App",
    logos: [{ component: ShopifyLogo, name: "Shopify", wide: true, tall: true }],
  },
];

function ProductCard({ product }: { product: EcosystemProduct }) {
  const prefersReducedMotion = useReducedMotion();
  const t = useTranslations("ecosystem");

  return (
    <motion.a
      href={product.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col rounded-2xl border border-border/60 bg-card p-6 shadow-sm transition-all hover:border-border hover:shadow-md sm:p-8 dark:border-white/8 dark:bg-white/4 dark:hover:border-white/14 dark:hover:bg-white/6"
      whileHover={prefersReducedMotion ? undefined : { y: -4 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {/* Type label */}
      <span className="mb-4 inline-flex w-fit items-center rounded-md border border-border/60 bg-muted/60 px-2 py-0.5 font-mono text-[10px] font-semibold tracking-widest text-muted-foreground/70 uppercase dark:border-white/8 dark:bg-white/5">
        {product.label}
      </span>

      {/* Logo area */}
      <div className="mb-6 flex h-32 items-center justify-center sm:h-40">
        <div className="flex flex-wrap items-center justify-center gap-8">
          {product.logos.map(({ component: Logo, name, wide, tall }) => (
            <Logo
              key={name}
              className={
                tall
                  ? "h-8 w-auto opacity-40 transition-opacity group-hover:opacity-70 dark:opacity-50 dark:group-hover:opacity-90 filter-[invert(1)] dark:filter-none"
                  : wide
                  ? "h-5 w-auto opacity-40 transition-opacity group-hover:opacity-70 dark:opacity-50 dark:group-hover:opacity-90 filter-[invert(1)] dark:filter-none"
                  : "h-10 w-10 opacity-40 transition-opacity group-hover:opacity-70 dark:opacity-50 dark:group-hover:opacity-90 filter-[invert(1)] dark:filter-none"
              }
            />
          ))}
        </div>
      </div>

      <h3 className="text-base font-bold tracking-tight sm:text-lg">
        {t(`products.${product.key}.title`)}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground/80">
        {t(`products.${product.key}.description`)}
      </p>
      <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground/50 transition-colors group-hover:text-glow">
        {t("readMore")}
        <svg
          className="h-3.5 w-3.5 translate-x-0 transition-transform group-hover:translate-x-0.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </span>
    </motion.a>
  );
}

export function Ecosystem() {
  const t = useTranslations("ecosystem");

  return (
    <section className="relative w-full px-4 py-16 sm:px-6 md:py-20 lg:py-24">
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-px w-2/3 max-w-xl glow-line opacity-20" />

      <div className="mx-auto max-w-6xl">
        <ScrollReveal>
          <div className="mb-12 grid gap-4 sm:mb-16 md:grid-cols-2 md:items-end">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              {t("title")}
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base md:text-right">
              {t("description")}
            </p>
          </div>
        </ScrollReveal>

        <div className="-mx-4 flex gap-4 overflow-x-auto scrollbar-hide px-4 pb-4 sm:-mx-6 sm:gap-5 sm:px-6 md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-3">
          {ECOSYSTEM_PRODUCTS.map((product, i) => (
            <ScrollReveal
              key={product.key}
              delay={i * 0.1}
              className="min-w-[280px] shrink-0 md:min-w-0 md:shrink"
            >
              <ProductCard product={product} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
