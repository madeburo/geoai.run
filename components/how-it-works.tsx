"use client";

import { FileText, Bot, BrainCircuit, Network } from "lucide-react";
import { useTranslations } from "next-intl";
import { ScrollReveal } from "@/components/scroll-reveal";

const STEP_ICONS = [
  <FileText key="ft" className="h-6 w-6" />,
  <Bot key="bot" className="h-6 w-6" />,
  <BrainCircuit key="bc" className="h-6 w-6" />,
  <Network key="net" className="h-6 w-6" />,
];

const STEP_KEYS = ["generate", "crawler", "metadata", "signals"] as const;

export function HowItWorks() {
  const t = useTranslations("howItWorks");

  return (
    <section className="w-full px-4 py-16 sm:px-6 md:py-24 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal>
          <h2 className="mb-10 text-center text-2xl font-bold tracking-tight sm:mb-16 sm:text-3xl lg:text-4xl">
            {t("title")}
          </h2>
        </ScrollReveal>

        <div className="relative -mx-4 flex gap-6 overflow-x-auto scrollbar-hide px-4 pb-4 sm:-mx-6 sm:gap-8 sm:px-6 md:mx-0 md:grid md:grid-cols-2 md:gap-12 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-4 lg:gap-8">
          <div
            className="pointer-events-none absolute top-10 right-0 left-0 hidden h-px bg-border lg:block"
            aria-hidden="true"
          />

          {STEP_KEYS.map((key, i) => (
            <ScrollReveal key={key} delay={i * 0.12} className="w-[240px] shrink-0 md:w-auto md:shrink">
              <div className="relative flex flex-col items-center text-center">
                <div className="relative z-10 mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-card sm:mb-6 sm:h-20 sm:w-20 dark:bg-linear-to-b dark:from-[rgba(20,28,55,0.8)] dark:to-[#03070f]">
                  <span className="text-foreground/70">{STEP_ICONS[i]}</span>
                </div>
                <span className="mb-2 text-xs font-medium tracking-widest text-muted-foreground/50 uppercase">
                  {t("step", { number: i + 1 })}
                </span>
                <h3 className="text-sm font-semibold sm:text-base">{t(`steps.${key}.title`)}</h3>
                <p className="mt-2 text-xs text-muted-foreground sm:text-sm">
                  {t(`steps.${key}.description`)}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
