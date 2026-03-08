"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { ScrollReveal } from "@/components/scroll-reveal";

export function OpenSource() {
  const t = useTranslations("openSource");

  return (
    <section className="relative w-full px-4 py-16 sm:px-6 md:py-20 lg:py-24">
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-px w-2/3 max-w-xl glow-line opacity-20" />

      <div className="mx-auto max-w-6xl">
        <ScrollReveal>
          <div className="flex flex-col items-start gap-6 rounded-2xl border border-border/40 bg-card/30 p-8 sm:flex-row sm:items-center sm:justify-between sm:p-12 dark:border-white/4 dark:bg-white/1.5">
            <div className="max-w-xl">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                {t("title")}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base lg:text-lg">
                {t("description")}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-5">
              <a
                href="https://github.com/madeburo/GEO-AI"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GEO AI on GitHub"
              >
                <Image src="/github-logo.svg" alt="GitHub" width={80} height={22} className="h-5 w-auto opacity-40 transition-opacity hover:opacity-80 dark:invert" />
              </a>
              <a
                href="https://www.npmjs.com/package/geo-ai-core"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="geo-ai-core on npm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="54" height="21" viewBox="0 0 18 7" className="opacity-40 transition-opacity hover:opacity-80" aria-hidden="true">
                  <path fill="currentColor" d="M0,0h18v6H9v1H5V6H0V0z M1,5h2V2h1v3h1V1H1V5z M6,1v5h2V5h2V1H6z M8,2h1v2H8V2z M11,1v4h2V2h1v3h1V2h1v3h1V1H11z"/>
                </svg>
              </a>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}