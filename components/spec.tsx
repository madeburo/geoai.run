"use client";

import { FileText, Bot, BrainCircuit, Network } from "lucide-react";
import { useTranslations } from "next-intl";
import { ScrollReveal } from "@/components/scroll-reveal";

const SPEC_ICONS = [
  <FileText key="ft" className="h-6 w-6" />,
  <BrainCircuit key="bc" className="h-6 w-6" />,
  <Bot key="bot" className="h-6 w-6" />,
  <Network key="net" className="h-6 w-6" />,
];

const SPEC_KEYS = ["llms", "metadata", "crawler", "signals"] as const;

export function Spec() {
  const t = useTranslations("spec");

  return (
    <section id="spec" className="w-full px-4 py-16 sm:px-6 md:py-24 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal>
          <div className="mb-10 max-w-2xl sm:mb-16">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
              {t("title")}
            </h2>
            <p className="mt-3 text-sm text-muted-foreground sm:mt-4 sm:text-lg">
              {t("description")}
            </p>
          </div>
        </ScrollReveal>

        <div className="-mx-4 flex gap-4 overflow-x-auto scrollbar-hide px-4 pb-4 sm:-mx-6 sm:gap-8 sm:px-6 md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 md:pb-0">
          {SPEC_KEYS.map((key, i) => (
            <ScrollReveal key={key} delay={i * 0.1} className="w-[240px] shrink-0 md:w-auto md:shrink">
              <div className="flex gap-4 rounded-xl bg-card p-4 sm:p-6 dark:bg-linear-to-b dark:from-[rgba(20,28,55,0.8)] dark:to-[#03070f]">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-background sm:h-12 sm:w-12 dark:bg-[rgba(40,55,90,0.5)]">
                  <span className="text-foreground/70">{SPEC_ICONS[i]}</span>
                </div>
                <div>
                  <h3 className="text-sm font-semibold sm:text-base">{t(`items.${key}.title`)}</h3>
                  <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                    {t(`items.${key}.description`)}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.4}>
          <div className="mt-10 text-center sm:mt-12">
            <a
              href="https://github.com/madeburo/GEO-AI"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-foreground underline underline-offset-4 hover:text-foreground/70"
            >
              {t("readSpec")}
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
