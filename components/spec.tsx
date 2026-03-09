"use client";

import { FileText, Bot, BrainCircuit, Network } from "lucide-react";
import { useTranslations } from "next-intl";
import { ScrollReveal } from "@/components/scroll-reveal";

const SPEC_ICONS = [
  <FileText key="ft" className="h-5 w-5" />,
  <BrainCircuit key="bc" className="h-5 w-5" />,
  <Bot key="bot" className="h-5 w-5" />,
  <Network key="net" className="h-5 w-5" />,
];

const SPEC_KEYS = ["llms", "metadata", "crawler", "signals"] as const;

export function Spec() {
  const t = useTranslations("spec");

  return (
    <section id="spec" className="relative w-full px-4 py-16 sm:px-6 md:py-20 lg:py-24">
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-px w-2/3 max-w-xl glow-line opacity-20" />

      <div className="mx-auto max-w-6xl">
        <ScrollReveal>
          <div className="mb-12 max-w-2xl sm:mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              {t("title")}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base lg:text-lg">
              {t("description")}
            </p>
          </div>
        </ScrollReveal>

        <div className="-mx-4 flex gap-4 overflow-x-auto scrollbar-hide px-4 pb-4 sm:-mx-6 sm:gap-5 sm:px-6 md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 md:pb-0">
          {SPEC_KEYS.map((key, i) => (
            <ScrollReveal key={key} delay={i * 0.08} className="w-[280px] shrink-0 md:w-auto md:shrink">
              <div className="group flex gap-4 rounded-xl border border-border/60 bg-card p-5 shadow-sm transition-all hover:border-border hover:shadow-md sm:p-6 dark:border-white/8 dark:bg-white/4 dark:hover:border-white/14 dark:hover:bg-white/6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-background shadow-sm dark:border-white/10 dark:bg-white/6">
                  <span className="text-foreground/60 transition-colors group-hover:text-glow">{SPEC_ICONS[i]}</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold tracking-tight sm:text-base">{t(`items.${key}.title`)}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground/80 sm:text-sm">
                    {t(`items.${key}.description`)}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.35}>
          <div className="mt-12 text-center sm:mt-14">
            <a
              href="https://github.com/madeburo/GEO-AI"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
            >
              {t("readSpec")}
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}