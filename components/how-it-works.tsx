"use client";

import { FileText, Bot, BrainCircuit, Network } from "lucide-react";
import { useTranslations } from "next-intl";
import { ScrollReveal } from "@/components/scroll-reveal";

const STEP_ICONS = [
  <FileText key="ft" className="h-5 w-5" />,
  <Bot key="bot" className="h-5 w-5" />,
  <BrainCircuit key="bc" className="h-5 w-5" />,
  <Network key="net" className="h-5 w-5" />,
];

const STEP_KEYS = ["generate", "crawler", "metadata", "signals"] as const;

export function HowItWorks() {
  const t = useTranslations("howItWorks");

  return (
    <section className="relative w-full px-4 py-16 sm:px-6 md:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal>
          <h2 className="mb-4 text-center text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {t("title")}
          </h2>
          <div className="mx-auto mb-16 h-px w-12 bg-glow/40 sm:mb-20" />
        </ScrollReveal>

        <div className="relative -mx-4 flex gap-4 overflow-x-auto scrollbar-hide px-4 pb-4 sm:-mx-6 sm:gap-6 sm:px-6 md:mx-0 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-4 lg:gap-5">
          {/* Connecting line */}
          <div
            className="pointer-events-none absolute top-[52px] right-8 left-8 hidden h-px lg:block"
            aria-hidden="true"
          >
            <div className="h-full w-full bg-linear-to-r from-transparent via-border to-transparent dark:via-white/6" />
          </div>

          {STEP_KEYS.map((key, i) => (
            <ScrollReveal key={key} delay={i * 0.1} className="w-[260px] shrink-0 md:w-auto md:shrink">
              <div className="group relative flex flex-col items-center rounded-2xl border border-border/60 bg-card p-6 text-center shadow-sm transition-all hover:border-border hover:shadow-md dark:border-white/8 dark:bg-white/4 dark:hover:border-white/14 dark:hover:bg-white/6">
                {/* Step number */}
                <span className="mb-4 text-[10px] font-semibold tracking-[0.2em] text-muted-foreground/60 uppercase">
                  {t("step", { number: i + 1 })}
                </span>

                {/* Icon */}
                <div className="relative z-10 mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-border/60 bg-background shadow-sm dark:border-white/10 dark:bg-white/6">
                  <span className="text-foreground/60 transition-colors group-hover:text-glow">{STEP_ICONS[i]}</span>
                </div>

                <h3 className="mb-2 text-sm font-bold tracking-tight sm:text-base">{t(`steps.${key}.title`)}</h3>
                <p className="text-xs leading-relaxed text-muted-foreground/80 sm:text-sm">
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