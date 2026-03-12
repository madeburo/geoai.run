"use client";

import Link from "next/link";
import { Github, Mail, ArrowRight, MessageSquare, GitPullRequest, Handshake, Lightbulb } from "lucide-react";

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}
import { useTranslations } from "next-intl";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ScrollReveal } from "@/components/scroll-reveal";

const BLOCK_ICONS = [MessageSquare, GitPullRequest, Handshake, Lightbulb];
const BLOCK_HREFS = [
  { href: "mailto:hi@geoai.run", external: false },
  { href: "https://github.com/madeburo/GEO-AI", external: true },
  { href: "mailto:hi@geoai.run", external: false },
  { href: "https://github.com/madeburo/GEO-AI/discussions", external: true },
];

export default function ContactPage() {
  const t = useTranslations("contactPage");
  const blocks = t.raw("blocks") as { title: string; description: string; action: string }[];

  return (
    <div className="noise-bg">
      <Navbar />
      <main id="main-content">

        {/* Hero */}
        <section className="relative w-full px-4 pt-14 pb-8 sm:px-6 sm:pt-18 sm:pb-10">
          <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-px w-2/3 max-w-xl glow-line opacity-20" />
          <div className="mx-auto max-w-2xl text-center">
            <ScrollReveal>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-glow">
                {t("badge")}
              </p>
              <h1 className="mb-3 text-4xl font-bold tracking-tight sm:text-5xl">
                {t("title")}
              </h1>
              <p className="mx-auto max-w-md text-base leading-relaxed text-muted-foreground">
                {t("description")}
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* Blocks */}
        <section className="w-full px-4 py-8 sm:px-6 sm:py-10">
          <div className="mx-auto max-w-4xl grid gap-4 sm:grid-cols-2 sm:items-stretch">
            {blocks.map((block, i) => {
              const Icon = BLOCK_ICONS[i];
              const { href, external } = BLOCK_HREFS[i];
              return (
                <ScrollReveal key={block.title} delay={i * 0.08} className="h-full">
                  <div className="group relative flex h-full flex-col gap-4 rounded-2xl border border-border/60 bg-card p-6 transition-all hover:border-border hover:shadow-md dark:border-white/8 dark:bg-white/4 dark:hover:border-white/14 dark:hover:bg-white/6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border/60 bg-background dark:border-white/10 dark:bg-white/6">
                      <Icon className="size-5 text-foreground/60 transition-colors group-hover:text-glow" />
                    </div>
                    <div className="flex-1">
                      <p className="mb-1.5 text-sm font-bold tracking-tight">{block.title}</p>
                      <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">{block.description}</p>
                    </div>
                    <a
                      href={href}
                      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-glow hover:underline"
                    >
                      {block.action} <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                    </a>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </section>

        {/* CTA */}
        <section className="w-full px-4 py-12 sm:px-6 sm:py-16">
          <div className="mx-auto max-w-4xl">
            <ScrollReveal delay={0.1}>
              <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card px-8 py-10 dark:border-white/8 dark:bg-white/4 sm:px-12 sm:py-12">
                <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-px w-1/2 glow-line opacity-30" />
                <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left">
                  <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground/50">{t("directLinks")}</p>
                    <div className="mt-3 flex flex-wrap items-center justify-center gap-4 sm:justify-start">
                      <a
                        href="https://github.com/madeburo/GEO-AI"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <Github className="size-4" /> GitHub
                      </a>
                      <a
                        href="https://x.com/imadeburo"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <XIcon className="size-4" /> X / social
                      </a>
                      <a
                        href="mailto:hi@geoai.run"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <Mail className="size-4" /> hi@geoai.run
                      </a>
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-wrap items-center justify-center gap-3">
                    <a
                      href="https://github.com/madeburo/GEO-AI"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-10 items-center gap-2 rounded-lg bg-foreground px-5 text-sm font-medium text-background transition-all hover:opacity-90 dark:bg-white dark:text-black"
                    >
                      {t("openGithub")} <ArrowRight className="size-3.5" />
                    </a>
                    <a
                      href="mailto:hi@geoai.run"
                      className="inline-flex h-10 items-center gap-2 rounded-lg border border-border/60 px-5 text-sm font-medium text-muted-foreground transition-colors hover:border-border hover:text-foreground"
                    >
                      {t("emailUs")}
                    </a>
                    <Link
                      href="/docs"
                      className="inline-flex h-10 items-center gap-2 rounded-lg border border-border/60 px-5 text-sm font-medium text-muted-foreground transition-colors hover:border-border hover:text-foreground"
                    >
                      {t("viewDocs")}
                    </Link>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
