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
      className="group flex flex-col rounded-2xl bg-card p-6 transition-colors sm:p-8 dark:bg-linear-to-b dark:from-[rgba(20,28,55,0.8)] dark:to-[#03070f]"
      whileHover={prefersReducedMotion ? undefined : { y: -4 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <div className="mb-4 flex h-32 items-center justify-center sm:mb-6 sm:h-40">
        <GeoIllustration type={product.illustration} className="h-24 w-24 sm:h-32 sm:w-32" />
      </div>
      <h3 className="text-base font-bold sm:text-lg">{t(`products.${product.key}.title`)}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{t(`products.${product.key}.description`)}</p>
      <span className="mt-4 text-sm font-medium text-foreground/70 transition-colors group-hover:text-foreground">
        {t("readMore")}
      </span>
    </motion.a>
  );
}

export function Ecosystem() {
  const t = useTranslations("ecosystem");

  return (
    <section className="w-full px-4 py-16 sm:px-6 md:py-24 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal>
          <div className="mb-10 grid gap-4 sm:mb-16 md:grid-cols-2 md:items-end">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
              {t("title")}
            </h2>
            <p className="text-sm text-muted-foreground sm:text-base md:text-right">
              {t("description")}
            </p>
          </div>
        </ScrollReveal>

        <div className="-mx-4 flex gap-4 overflow-x-auto scrollbar-hide px-4 pb-4 sm:-mx-6 sm:gap-6 sm:px-6 md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-3">
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
