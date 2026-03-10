"use client";

import Link from "next/link";
import {
  FileText, BrainCircuit, Bot, Network,
  ArrowRight, CheckCircle2, Search, BarChart3,
  Box, Layers, Globe, ShoppingBag,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const LAYER_HREFS = [
  "/docs/specification/llms-txt",
  "/docs/specification/ai-metadata",
  "/docs/specification/crawler-rules",
  "/docs/specification/structured-signals",
];

const LAYER_ICONS = [FileText, BrainCircuit, Bot, Network];

const ANALYZER_HREFS = [
  "/docs/specification/llms-txt#analyzer-checks",
  "/docs/specification/ai-metadata#analyzer-checks",
  "/docs/specification/crawler-rules#analyzer-checks",
  "/docs/specification/structured-signals#analyzer-checks",
];

const SCORE_STATUSES = [
  { label: "pass",      score: "100", color: "text-emerald-500" },
  { label: "warn",      score: "65",  color: "text-amber-500"   },
  { label: "fail",      score: "20",  color: "text-red-500"     },
  { label: "not_found", score: "10",  color: "text-muted-foreground" },
  { label: "unknown",   score: "40",  color: "text-muted-foreground" },
];

const PACKAGE_ICONS = [Box, Layers, Globe, ShoppingBag];
const PACKAGE_HREFS = [
  "/docs/packages/core",
  "/docs/packages/next",
  "/docs/packages/woo",
  "/docs/packages/shopify",
];
const PACKAGE_NAMES = ["geo-ai-core", "geo-ai-next", "geo-ai-woo", "geo-ai-shopify"];

export default function SpecificationPage() {
  const t = useTranslations("specificationPage");

  const whyItems   = t.raw("why.items")   as { title: string; body: string }[];
  const layerItems = t.raw("layers.items") as { title: string; description: string }[];
  const analyzerItems = t.raw("analyzer.items") as { title: string; description: string }[];
  const geoReadyItems = t.raw("geoReady.items") as string[];
  const packageItems  = t.raw("packages.items") as { label: string; badge: string; description: string }[];

  return (
    <div className="noise-bg">
      <Navbar />
      <main id="main-content">

        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <section className="relative w-full px-4 pt-16 pb-10 sm:px-6 sm:pt-22 sm:pb-14">
          <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-px w-2/3 max-w-xl glow-line opacity-20" />
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-glow">
              {t("badge")}
            </p>
            <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              {t("title")}
            </h1>
            <p className="mx-auto max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {t("subtitle")}
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/docs/specification"
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-foreground px-5 text-sm font-medium text-background transition-all hover:opacity-90 dark:bg-white dark:text-black"
              >
                {t("cta.readSpec")}
                <ArrowRight className="size-3.5" />
              </Link>
              <Link
                href="/analyze"
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-border/60 px-5 text-sm font-medium text-muted-foreground transition-colors hover:border-border hover:text-foreground"
              >
                {t("cta.checkSite")}
              </Link>
            </div>
          </div>
        </section>

        {/* ── Why it exists ────────────────────────────────────────────────── */}
        <section className="w-full px-4 py-10 sm:px-6 sm:py-12">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-4 sm:grid-cols-3">
              {whyItems.map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl border border-border bg-card p-6 dark:border-white/12 dark:bg-white/5 sm:p-7"
                >
                  <p className="mb-2.5 text-sm font-bold tracking-tight text-foreground">{item.title}</p>
                  <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Four layers ──────────────────────────────────────────────────── */}
        <section className="w-full px-4 py-12 sm:px-6 sm:py-16">
          <div className="mx-auto max-w-5xl">
            <p className="mb-2 text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground/50">
              {t("layers.label")}
            </p>
            <h2 className="mb-10 text-center text-2xl font-bold tracking-tight sm:text-3xl">
              {t("layers.title")}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {layerItems.map((item, i) => {
                const Icon = LAYER_ICONS[i];
                return (
                  <Link
                    key={LAYER_HREFS[i]}
                    href={LAYER_HREFS[i]}
                    className="group flex gap-4 rounded-xl border border-border/60 bg-card p-5 transition-all hover:border-border hover:shadow-md dark:border-white/8 dark:bg-white/4 dark:hover:border-white/14 dark:hover:bg-white/6 sm:p-6"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-background dark:border-white/10 dark:bg-white/6">
                      <Icon className="size-5 text-foreground/60 transition-colors group-hover:text-glow" />
                    </div>
                    <div className="min-w-0">
                      <p className="mb-1.5 text-sm font-bold tracking-tight">{item.title}</p>
                      <p className="text-xs leading-relaxed text-muted-foreground/80 sm:text-sm">{item.description}</p>
                      <span className="mt-3 inline-flex items-center gap-1 text-xs text-glow opacity-0 transition-opacity group-hover:opacity-100">
                        {t("layers.readSpec")} <ArrowRight className="size-3" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── How the Analyzer uses the spec ───────────────────────────────── */}
        <section className="w-full px-4 py-12 sm:px-6 sm:py-16">
          <div className="mx-auto max-w-5xl">
            <div className="mb-10 flex flex-col items-center gap-2 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground/50">
                  {t("analyzer.label")}
                </p>
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  {t("analyzer.title")}
                </h2>
              </div>
              <Link
                href="/analyze"
                className="inline-flex shrink-0 items-center gap-1.5 text-xs font-medium text-glow hover:underline"
              >
                <Search className="size-3.5" />
                {t("analyzer.checkSite")}
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {analyzerItems.map((item, i) => {
                const Icon = LAYER_ICONS[i];
                return (
                  <Link
                    key={ANALYZER_HREFS[i]}
                    href={ANALYZER_HREFS[i]}
                    className="group flex flex-col gap-3 rounded-xl border border-border/60 bg-card p-5 transition-all hover:border-border hover:shadow-md dark:border-white/8 dark:bg-white/4 dark:hover:border-white/14"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/60 bg-background dark:border-white/10 dark:bg-white/6">
                      <Icon className="size-4 text-foreground/60 transition-colors group-hover:text-glow" />
                    </div>
                    <p className="text-sm font-semibold">{item.title}</p>
                    <p className="text-xs leading-relaxed text-muted-foreground/70">{item.description}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Scoring model ────────────────────────────────────────────────── */}
        <section className="w-full px-4 py-12 sm:px-6 sm:py-16">
          <div className="mx-auto max-w-5xl">
            <div className="rounded-2xl border border-border/60 bg-card p-8 dark:border-white/8 dark:bg-white/4 sm:p-10">
              <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground/50">
                    {t("scoring.label")}
                  </p>
                  <h2 className="mb-4 text-2xl font-bold tracking-tight sm:text-3xl">
                    {t("scoring.title")}
                  </h2>
                  <p className="mb-6 text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {t("scoring.description")}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href="/docs/specification/scoring"
                      className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border/60 px-4 text-xs font-medium text-muted-foreground transition-colors hover:border-border hover:text-foreground"
                    >
                      <BarChart3 className="size-3.5" />
                      {t("scoring.scoringModel")}
                    </Link>
                    <Link
                      href="/docs/specification/recommendations"
                      className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border/60 px-4 text-xs font-medium text-muted-foreground transition-colors hover:border-border hover:text-foreground"
                    >
                      {t("scoring.recommendations")} <ArrowRight className="size-3" />
                    </Link>
                  </div>
                </div>
                <div className="flex flex-col justify-center gap-2">
                  {SCORE_STATUSES.map(({ label, score, color }) => (
                    <div
                      key={label}
                      className="flex items-center justify-between rounded-lg border border-border/40 bg-background/60 px-4 py-2.5 dark:border-white/6 dark:bg-white/3"
                    >
                      <code className={`font-mono text-xs font-semibold ${color}`}>{label}</code>
                      <span className="text-xs text-muted-foreground/60">{score} pts</span>
                    </div>
                  ))}
                  <p className="mt-2 text-center text-xs text-muted-foreground/40">
                    {t("scoring.formula")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── GEO-ready definition ─────────────────────────────────────────── */}
        <section className="w-full px-4 py-12 sm:px-6 sm:py-16">
          <div className="mx-auto max-w-5xl">
            <div className="rounded-2xl border border-glow/20 bg-glow/5 p-8 sm:p-10">
              <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-glow">
                    {t("geoReady.label")}
                  </p>
                  <h2 className="mb-4 text-2xl font-bold tracking-tight sm:text-3xl">
                    {t("geoReady.title")}
                  </h2>
                  <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {t("geoReady.description")}
                  </p>
                </div>
                <ul className="flex flex-col justify-center gap-3">
                  {geoReadyItems.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-foreground/80">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-glow" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ── Packages ─────────────────────────────────────────────────────── */}
        <section className="w-full px-4 py-12 sm:px-6 sm:py-16">
          <div className="mx-auto max-w-5xl">
            <p className="mb-2 text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground/50">
              {t("packages.label")}
            </p>
            <h2 className="mb-4 text-center text-2xl font-bold tracking-tight sm:text-3xl">
              {t("packages.title")}
            </h2>
            <p className="mx-auto mb-10 max-w-lg text-center text-sm leading-relaxed text-muted-foreground">
              {t("packages.description")}
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {packageItems.map((pkg, i) => {
                const Icon = PACKAGE_ICONS[i];
                return (
                  <Link
                    key={PACKAGE_HREFS[i]}
                    href={PACKAGE_HREFS[i]}
                    className="group flex flex-col gap-3 rounded-xl border border-border/60 bg-card p-5 transition-all hover:border-border hover:shadow-md dark:border-white/8 dark:bg-white/4 dark:hover:border-white/14 dark:hover:bg-white/6"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/60 bg-background dark:border-white/10 dark:bg-white/6">
                        <Icon className="size-4 text-foreground/60 transition-colors group-hover:text-glow" />
                      </div>
                      <span className="rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide border border-border/40 text-muted-foreground/50">
                        {pkg.badge}
                      </span>
                    </div>
                    <div>
                      <p className="mb-0.5 text-sm font-bold">{pkg.label}</p>
                      <p className="font-mono text-[11px] text-muted-foreground/40">{PACKAGE_NAMES[i]}</p>
                    </div>
                    <p className="text-xs leading-relaxed text-muted-foreground/70">{pkg.description}</p>
                    <ArrowRight className="mt-auto size-3.5 text-muted-foreground/30 transition-all group-hover:translate-x-0.5 group-hover:text-glow" />
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Final CTA ────────────────────────────────────────────────────── */}
        <section className="w-full px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-5xl">
            <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card px-8 py-12 text-center dark:border-white/8 dark:bg-white/4 sm:px-12 sm:py-16">
              <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-px w-1/2 glow-line opacity-30" />
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-glow">
                {t("finalCta.label")}
              </p>
              <h2 className="mb-4 text-2xl font-bold tracking-tight sm:text-3xl">
                {t("finalCta.title")}
              </h2>
              <p className="mx-auto mb-8 max-w-md text-sm leading-relaxed text-muted-foreground">
                {t("finalCta.description")}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/analyze"
                  className="inline-flex h-10 items-center gap-2 rounded-lg bg-foreground px-5 text-sm font-medium text-background transition-all hover:opacity-90 dark:bg-white dark:text-black"
                >
                  {t("finalCta.checkSite")}
                  <ArrowRight className="size-3.5" />
                </Link>
                <Link
                  href="/docs/specification"
                  className="inline-flex h-10 items-center gap-2 rounded-lg border border-border/60 px-5 text-sm font-medium text-muted-foreground transition-colors hover:border-border hover:text-foreground"
                >
                  {t("finalCta.fullSpec")}
                </Link>
                <Link
                  href="/docs/getting-started/choose"
                  className="inline-flex h-10 items-center gap-2 rounded-lg border border-border/60 px-5 text-sm font-medium text-muted-foreground transition-colors hover:border-border hover:text-foreground"
                >
                  {t("finalCta.choosePackage")}
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
