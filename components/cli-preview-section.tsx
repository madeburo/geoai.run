"use client";

import Link from "next/link";
import { Terminal, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { ScrollReveal } from "@/components/scroll-reveal";
import { CliTerminalPreview } from "@/components/cli-terminal-preview";

export function CliPreviewSection() {
  const t = useTranslations("cliPage");

  return (
    <section className="relative w-full px-4 py-16 sm:px-6 md:py-20 lg:py-24">
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-px w-2/3 max-w-xl glow-line opacity-20" />

      <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Left: terminal */}
          <ScrollReveal>
            <CliTerminalPreview />
          </ScrollReveal>

          {/* Right: text */}
          <ScrollReveal delay={0.1}>
            <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-glow/35 bg-glow/10 px-3.5 py-1 text-xs font-bold tracking-widest text-glow uppercase">
              <Terminal className="size-3" />
              GEO AI CLI
            </div>

            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              {t("title")}
            </h2>

            <p className="mb-8 text-sm leading-relaxed text-muted-foreground sm:text-base">
              Generate <code className="rounded px-1.5 py-0.5 font-mono text-[0.875em] bg-white/6 border border-white/8">llms.txt</code> and <code className="rounded px-1.5 py-0.5 font-mono text-[0.875em] bg-white/6 border border-white/8">llms-full.txt</code> for any Node.js project — framework-agnostic, build-time, zero runtime overhead.
            </p>

            <Link
              href="/cli"
              className="inline-flex items-center gap-2 rounded-lg border border-border/60 bg-white/4 px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-border hover:bg-white/6"
            >
              Explore the CLI
              <ArrowRight className="size-4" />
            </Link>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
