"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ScrollReveal } from "@/components/scroll-reveal";
import { CliTerminalPreview } from "@/components/cli-terminal-preview";
import {
  Terminal,
  ArrowRight,
  FileText,
  CheckCircle,
  Search,
  Eye,
  Package,
  Layers,
  Box,
} from "lucide-react";

const INSTALL_CMD = "npm install --save-dev geo-ai-cli";

const QUICKSTART_CMDS = [
  "npx geo-ai init",
  "npx geo-ai generate",
  "npx geo-ai validate",
];

const CAPABILITY_ICONS = [FileText, Terminal, CheckCircle, Eye];

const ECOSYSTEM_HREFS = [
  "/docs/packages/core",
  "/docs/packages/next",
  "/analyze",
  "/specification",
];

const ECOSYSTEM_ICONS = [Box, Layers, Search, Package];

function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded px-1.5 py-0.5 font-mono text-[0.875em] bg-white/6 text-glow border border-white/8">
      {children}
    </code>
  );
}

export default function CliPage() {
  const t = useTranslations("cliPage");

  const capabilities = [0, 1, 2, 3].map((i) => ({
    icon: CAPABILITY_ICONS[i],
    title: t(`capabilities.${i}.title`),
    description: t(`capabilities.${i}.description`),
  }));

  const ecosystemLinks = [0, 1, 2, 3].map((i) => ({
    icon: ECOSYSTEM_ICONS[i],
    label: t(`ecosystemLinks.${i}.label`),
    description: t(`ecosystemLinks.${i}.description`),
    href: ECOSYSTEM_HREFS[i],
  }));

  const whyItems = [0, 1, 2].map((i) => ({
    title: t(`whyItems.${i}.title`),
    body: t(`whyItems.${i}.body`),
  }));

  const ctaItems = [0, 1, 2, 3, 4].map((i) => t(`ctaItems.${i}`));

  const quickstartComments = [
    t("quickstartComment1"),
    t("quickstartComment2"),
    t("quickstartComment3"),
  ];

  return (
    <div className="noise-bg">
      <Navbar />
      <main id="main-content">

        {/* Hero */}
        <section className="relative w-full px-4 pt-20 pb-16 sm:px-6 sm:pt-28 sm:pb-20">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute left-1/2 top-0 -translate-x-1/2 h-px w-2/3 max-w-2xl glow-line opacity-30" />
          </div>

          <div className="mx-auto max-w-6xl">
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
              {/* Left: text */}
              <ScrollReveal>
                <div className="mb-6 flex items-center gap-2.5">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-glow/35 bg-glow/10 px-3.5 py-1 text-xs font-bold tracking-widest text-glow uppercase">
                    <Terminal className="size-3" />
                    {t("badge")}
                  </span>
                  <span className="rounded border border-border/50 bg-white/4 px-2 py-0.5 font-mono text-[10px] text-muted-foreground/60">
                    v0.1.0
                  </span>
                  <span className="rounded border border-border/40 bg-white/3 px-2 py-0.5 text-[10px] text-muted-foreground/50">
                    Node.js ≥ 20
                  </span>
                </div>

                <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                  {t("title")}
                </h1>

                <p className="mb-3 max-w-xl text-base leading-relaxed text-foreground/80 sm:text-lg">
                  {t.rich("description", {
                    llms: () => <InlineCode>llms.txt</InlineCode>,
                    llmsfull: () => <InlineCode>llms-full.txt</InlineCode>,
                  })}
                </p>
                <p className="mb-8 max-w-lg text-sm leading-relaxed text-muted-foreground">
                  {t("subDescription")}
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href="/docs/integrations/cli"
                    className="inline-flex items-center gap-2 rounded-lg bg-glow px-5 py-2.5 text-sm font-semibold text-background transition-opacity hover:opacity-90"
                  >
                    {t("readDocs")}
                    <ArrowRight className="size-4" />
                  </Link>
                  <a
                    href="https://github.com/madeburo/GEO-AI"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-border/60 bg-white/4 px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-border hover:bg-white/6"
                  >
                    {t("viewOnGithub")}
                  </a>
                </div>
              </ScrollReveal>

              {/* Right: animated terminal */}
              <ScrollReveal delay={0.1}>
                <CliTerminalPreview />
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Install + Quick start */}
        <section className="relative w-full px-4 py-16 sm:px-6 sm:py-20">
          <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-px w-2/3 max-w-xl glow-line opacity-20" />
          <div className="mx-auto max-w-4xl">
            <ScrollReveal>
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground/50">
                {t("installTitle")}
              </p>
              <h2 className="mb-8 text-2xl font-bold tracking-tight sm:text-3xl">
                {t("installHeading")}
              </h2>
            </ScrollReveal>

            <div className="flex flex-col gap-4">
              <ScrollReveal delay={0.05}>
                <div className="overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm dark:border-white/10 dark:bg-[#0f1424]">
                  <div className="flex items-center justify-between border-b border-border/50 bg-muted/30 px-4 py-2.5 dark:border-white/8 dark:bg-white/4">
                    <div className="flex items-center gap-2">
                      <Terminal className="size-3.5 text-muted-foreground/60" />
                      <span className="font-mono text-[11px] font-semibold tracking-wide text-muted-foreground/80">
                        Terminal
                      </span>
                    </div>
                  </div>
                  <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-[1.7] text-foreground/90">
                    <code>
                      <span className="text-muted-foreground/50"># Install locally (recommended){"\n"}</span>
                      <span>{INSTALL_CMD}{"\n"}</span>
                      <span className="text-muted-foreground/50">{"\n"}# Or globally{"\n"}</span>
                      <span>npm install -g geo-ai-cli</span>
                    </code>
                  </pre>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.1}>
                <div className="overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm dark:border-white/10 dark:bg-[#0f1424]">
                  <div className="flex items-center border-b border-border/50 bg-muted/30 px-4 py-2.5 dark:border-white/8 dark:bg-white/4">
                    <Terminal className="size-3.5 text-muted-foreground/60 mr-2" />
                    <span className="font-mono text-[11px] font-semibold tracking-wide text-muted-foreground/80">
                      Quick start
                    </span>
                  </div>
                  <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-[1.9] text-foreground/90">
                    <code>
                      {QUICKSTART_CMDS.map((cmd, i) => (
                        <span key={i}>
                          <span className="text-muted-foreground/40">{quickstartComments[i]}{"\n"}</span>
                          <span>{cmd}{i < QUICKSTART_CMDS.length - 1 ? "\n\n" : ""}</span>
                        </span>
                      ))}
                    </code>
                  </pre>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* What it does */}
        <section className="relative w-full px-4 py-16 sm:px-6 sm:py-20">
          <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-px w-2/3 max-w-xl glow-line opacity-20" />
          <div className="mx-auto max-w-4xl">
            <ScrollReveal>
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground/50">
                {t("commandsTitle")}
              </p>
              <h2 className="mb-8 text-2xl font-bold tracking-tight sm:text-3xl">
                {t("commandsHeading")}
              </h2>
            </ScrollReveal>

            <div className="grid gap-4 sm:grid-cols-2">
              {capabilities.map((cap, i) => {
                const Icon = cap.icon;
                return (
                  <ScrollReveal key={cap.title} delay={i * 0.07}>
                    <div className="group flex gap-4 rounded-xl border border-border/60 bg-card p-5 shadow-sm transition-all hover:border-glow/30 hover:bg-card/80 hover:shadow-md dark:border-white/10 dark:bg-white/4 dark:hover:border-glow/25 dark:hover:bg-white/6">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-background shadow-sm dark:border-white/12 dark:bg-white/6">
                        <Icon className="size-4 text-foreground/50 transition-colors group-hover:text-glow" />
                      </div>
                      <div>
                        <p className="mb-1.5 font-mono text-sm font-bold text-foreground tracking-tight">
                          {cap.title}
                        </p>
                        <p className="text-xs leading-relaxed text-muted-foreground/90">
                          {cap.description}
                        </p>
                      </div>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* Config example */}
        <section className="relative w-full px-4 py-16 sm:px-6 sm:py-20">
          <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-px w-2/3 max-w-xl glow-line opacity-20" />
          <div className="mx-auto max-w-4xl">
            <ScrollReveal>
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground/50">
                {t("configTitle")}
              </p>
              <h2 className="mb-3 text-2xl font-bold tracking-tight sm:text-3xl">
                {t("configHeading")}
              </h2>
              <p className="mb-8 max-w-xl text-sm leading-relaxed text-muted-foreground">
                {t.rich("configDescription", {
                  config: () => <InlineCode>geo-ai.config.ts</InlineCode>,
                  ts: () => <InlineCode>.ts</InlineCode>,
                  js: () => <InlineCode>.js</InlineCode>,
                  json: () => <InlineCode>.json</InlineCode>,
                  siteName: () => <InlineCode>siteName</InlineCode>,
                  siteUrl: () => <InlineCode>siteUrl</InlineCode>,
                  provider: () => <InlineCode>provider</InlineCode>,
                })}
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.08}>
              <div className="overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm dark:border-white/10 dark:bg-[#0f1424]">
                <div className="flex items-center border-b border-border/50 bg-muted/30 px-4 py-2.5 dark:border-white/8 dark:bg-white/4">
                  <FileText className="size-3.5 text-muted-foreground/60 mr-2" />
                  <span className="font-mono text-[11px] font-semibold tracking-wide text-muted-foreground/80">
                    geo-ai.config.ts
                  </span>
                </div>
                <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-[1.7] text-foreground/90">
                  <code>{`import type { GeoAIConfig } from 'geo-ai-core';

export default {
  siteName: 'My Site',
  siteUrl: 'https://example.com',
  siteDescription: 'A brief description for AI crawlers.',
  crawlers: 'all',
  provider: {
    Pages: [
      { title: 'Home', url: 'https://example.com/', description: 'Welcome page' },
    ],
    Blog: [
      { title: 'Getting Started', url: 'https://example.com/blog/start', description: 'First steps' },
    ],
  },
} satisfies GeoAIConfig;`}</code>
                </pre>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Why use the CLI */}
        <section className="relative w-full px-4 py-16 sm:px-6 sm:py-20">
          <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-px w-2/3 max-w-xl glow-line opacity-20" />
          <div className="mx-auto max-w-4xl">
            <ScrollReveal>
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground/50">
                {t("whyTitle")}
              </p>
              <h2 className="mb-8 text-2xl font-bold tracking-tight sm:text-3xl">
                {t("whyHeading")}
              </h2>
            </ScrollReveal>

            <div className="grid gap-4 sm:grid-cols-3">
              {whyItems.map((item, i) => (
                <ScrollReveal key={item.title} delay={i * 0.07}>
                  <div className="rounded-xl border border-border/60 bg-card p-5 shadow-sm dark:border-white/8 dark:bg-white/4">
                    <p className="mb-2 text-sm font-semibold text-foreground">{item.title}</p>
                    <p className="text-xs leading-relaxed text-muted-foreground/80">{item.body}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Ecosystem */}
        <section className="relative w-full px-4 py-16 sm:px-6 sm:py-20">
          <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-px w-2/3 max-w-xl glow-line opacity-20" />
          <div className="mx-auto max-w-4xl">
            <ScrollReveal>
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground/50">
                {t("ecosystemTitle")}
              </p>
              <h2 className="mb-3 text-2xl font-bold tracking-tight sm:text-3xl">
                {t("ecosystemHeading")}
              </h2>
              <p className="mb-8 max-w-xl text-sm leading-relaxed text-muted-foreground">
                {t.rich("ecosystemDescription", {
                  core: () => <InlineCode>geo-ai-core</InlineCode>,
                })}
              </p>
            </ScrollReveal>

            <div className="grid gap-3 sm:grid-cols-2">
              {ecosystemLinks.map((item, i) => {
                const Icon = item.icon;
                return (
                  <ScrollReveal key={item.href} delay={i * 0.06}>
                    <Link
                      href={item.href}
                      className="group flex items-center gap-3.5 rounded-lg border border-border/60 bg-card/40 p-4 transition-all hover:border-border hover:bg-card/70"
                    >
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-white/5 text-muted-foreground transition-colors group-hover:text-foreground">
                        <Icon className="size-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-foreground">{item.label}</p>
                        <p className="text-xs text-muted-foreground/70">{item.description}</p>
                      </div>
                      <ArrowRight className="size-3.5 shrink-0 text-muted-foreground/30 transition-all group-hover:text-muted-foreground group-hover:translate-x-0.5" />
                    </Link>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="relative w-full px-4 py-16 sm:px-6 sm:py-24">
          <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-px w-2/3 max-w-xl glow-line opacity-20" />
          <div className="mx-auto max-w-4xl">
            <ScrollReveal>
              <div className="rounded-2xl border border-glow/20 bg-glow/5 px-8 py-12 text-center">
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-glow">
                  {t("ctaTitle")}
                </p>
                <h2 className="mb-4 text-2xl font-bold tracking-tight sm:text-3xl">
                  {t("ctaHeading")}
                </h2>
                <ul className="mb-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-1.5">
                  {ctaItems.map((item) => (
                    <li key={item} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <CheckCircle className="size-3.5 shrink-0 text-glow/60" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <Link
                    href="/docs/integrations/cli"
                    className="inline-flex items-center gap-2 rounded-lg bg-glow px-6 py-2.5 text-sm font-semibold text-background transition-opacity hover:opacity-90"
                  >
                    {t("cliDocs")}
                    <ArrowRight className="size-4" />
                  </Link>
                  <Link
                    href="/docs"
                    className="inline-flex items-center gap-2 rounded-lg border border-border/60 bg-white/4 px-6 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-border hover:bg-white/6"
                  >
                    {t("exploreDocs")}
                  </Link>
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
