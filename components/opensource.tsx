"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { ScrollReveal } from "@/components/scroll-reveal";

export function OpenSource() {
  const t = useTranslations("openSource");

  return (
    <section className="w-full px-4 py-16 sm:px-6 md:py-24 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal>
          <div className="flex items-start justify-between gap-6">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
                {t("title")}
              </h2>
              <p className="mt-3 text-sm text-muted-foreground sm:mt-4 sm:text-lg">
                {t("description")}
              </p>
            </div>
            <a
              href="https://github.com/madeburo/GEO-AI"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0"
              aria-label="GEO AI on GitHub"
            >
              <Image src="/github-logo.svg" alt="GitHub" width={120} height={33} className="hidden h-8 w-auto opacity-60 transition-opacity hover:opacity-100 dark:invert sm:block sm:h-10" />
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
