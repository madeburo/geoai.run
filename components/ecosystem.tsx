"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { GeoIllustration, type IllustrationType } from "@/components/geo-illustrations";
import { ScrollReveal } from "@/components/scroll-reveal";

interface EcosystemProduct {
  key: string;
  href: string;
  illustration: IllustrationType;
}

const ECOSYSTEM_PRODUCTS: EcosystemProduct[] = [
  { key: "core", href: "https://github.com/madeburo/GEO-AI", illustration: "rings" },
  { key: "woo", href: "https://github.com/madeburo/GEO-AI-Woo", illustration: "radial-burst" },
  { key: "shopify", href: "https://github.com/madeburo/GEO-AI-Shopify", illustration: "parallel-lines" },
];

function ProductCard({ product }: { product: EcosystemProduct }) {
  const prefersReducedMotion = useReducedMotion();
  const t = useTranslations("ecosystem");

  return (
    <motion.a
      href={product.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col rounded-2xl border border-border/40 bg-card/50 p-6 transition-all sm:p-8 dark:border-white/4 dark:bg-white/2 dark:hover:border-white/8 dark:hover:bg-white/3"
      whileHover={prefersReducedMotion ? undefined : { y: -4 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <div className="mb-6 flex h-32 items-center justify-center sm:h-40">
        <GeoIllustration type={product.illustration} className="h-24 w-24 opacity-60 transition-opacity group-hover:opacity-90 sm:h-32 sm:w-32" />
      </div>
      <h3 className="text-base font-semibold sm:text-lg">{t(`products.${product.key}.title`)}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t(`products.${product.key}.description`)}</p>
      <span className="mt-5 text-sm font-medium text-muted-foreground/60 transition-colors group-hover:text-glow">
        {t("readMore")}
      </span>
    </motion.a>
  );
}

export function Ecosystem() {
  const t = useTranslations("ecosystem");

  return (
    <section className="relative w-full px-4 py-24 sm:px-6 md:py-32 lg:py-40">
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
            <ScrollReveal key={product.key} delay={i * 0.1} className="min-w-[280px] shrink-0 md:min-w-0 md:shrink">
              <ProductCard product={product} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}