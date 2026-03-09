"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "framer-motion";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  BookOpen,
  Github as GithubIcon,
  Copy,
  Check,
  FileText,
  Tag,
  Bot,
  Database,
  ArrowRight,
  Zap,
  Shield,
} from "lucide-react";

function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value.includes("://") ? value : `https://${value}`);
    return (
      (url.protocol === "https:" || url.protocol === "http:") &&
      url.hostname.includes(".") &&
      !url.hostname.endsWith(".") &&
      !/\s/.test(url.hostname) &&
      !/\.(exe|bat|cmd|msi|dll|sh|bin|app|dmg|rpm|deb)$/i.test(url.hostname)
    );
  } catch {
    return false;
  }
}

const CHECK_CARDS = [
  {
    icon: FileText,
    key: "llmsTxt",
    color: "text-glow",
    bg: "bg-glow/8 border-glow/20 dark:bg-glow/5 dark:border-glow/15",
  },
  {
    icon: Tag,
    key: "aiMetadata",
    color: "text-blue-400",
    bg: "bg-blue-500/8 border-blue-500/20 dark:bg-blue-500/5 dark:border-blue-500/15",
  },
  {
    icon: Bot,
    key: "crawlerRules",
    color: "text-purple-400",
    bg: "bg-purple-500/8 border-purple-500/20 dark:bg-purple-500/5 dark:border-purple-500/15",
  },
  {
    icon: Database,
    key: "structuredSignals",
    color: "text-orange-400",
    bg: "bg-orange-500/8 border-orange-500/20 dark:bg-orange-500/5 dark:border-orange-500/15",
  },
] as const;

const HOW_IT_WORKS = [
  { step: "01", icon: ArrowRight },
  { step: "02", icon: Zap },
  { step: "03", icon: Shield },
] as const;

const TRUST_ITEMS = [
  { icon: Shield, key: "noSignup" },
  { icon: Zap, key: "runsInSeconds" },
  { icon: Check, key: "checksSpec" },
] as const;

export default function AnalyzePage() {
  const searchParams = useSearchParams();
  const paramUrl = searchParams.get("url");
  const [url, setUrl] = useState(paramUrl ?? "");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const t = useTranslations("analyze");

  function handleCopy() {
    navigator.clipboard.writeText("npm install geo-ai-core");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleAnalyze() {
    const trimmed = url.trim();
    if (!trimmed) {
      setError(t("errorEmpty"));
      setSubmitted(false);
      return;
    }
    if (!isValidUrl(trimmed)) {
      setError(t("errorInvalid"));
      setSubmitted(false);
      return;
    }
    setError("");
    setSubmitted(true);
  }

  return (
    <>
      <Navbar />
      <main id="main-content" className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center px-4 pb-24 pt-16 sm:px-6 sm:pt-24">
        <div className="mx-auto w-full max-w-2xl">

          {/* Hero section */}
          <motion.div
            className="mb-10 text-center"
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <h1 className="mb-3 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              {t("title")}
            </h1>
            <p className="text-sm text-muted-foreground sm:text-base">
              {t("description")}
            </p>
            <p className="mt-1 text-xs text-muted-foreground/70">
              {t("scope")}
            </p>
          </motion.div>

          {/* Input form */}
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          >
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="flex-1">
                <Input
                  id="analyze-url-input"
                  placeholder={t("placeholder")}
                  aria-label={t("placeholder")}
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value);
                    if (error) setError("");
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
                  aria-invalid={!!error}
                  aria-describedby={error ? "analyze-error" : undefined}
                  className="h-12 rounded-xl border-border/50 bg-surface/80 px-5 text-sm backdrop-blur-sm dark:border-white/6 dark:bg-white/4"
                />
              </div>
              <Button
                size="lg"
                className="h-12 w-full rounded-xl bg-foreground px-6 text-sm font-medium text-background dark:bg-white dark:text-black dark:hover:bg-white/90 sm:w-auto"
                onClick={handleAnalyze}
              >
                {t("button")}
              </Button>
            </div>

            {error && (
              <p id="analyze-error" role="alert" aria-live="assertive" className="mt-2 text-left text-sm text-destructive">
                {error}
              </p>
            )}

            {submitted && !error && (
              <p className="mt-3 text-center text-sm text-muted-foreground">
                {t("comingSoon")}
              </p>
            )}
          </motion.div>

          {/* Trust lines */}
          <motion.div
            className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5"
            initial={prefersReducedMotion ? {} : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {TRUST_ITEMS.map(({ icon: Icon, key }) => (
              <span key={key} className="flex items-center gap-1.5 text-xs text-muted-foreground/70">
                <Icon className="h-3 w-3 shrink-0" />
                {t(`trust.${key}`)}
              </span>
            ))}
          </motion.div>

          {/* Check cards */}
          <motion.div
            className="mt-10"
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25, ease: "easeOut" }}
          >
            <p className="mb-4 text-center text-xs font-medium uppercase tracking-widest text-muted-foreground/50">
              {t("checksLabel")}
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {CHECK_CARDS.map(({ icon: Icon, key, color, bg }) => (
                <div
                  key={key}
                  className={`flex flex-col gap-2 rounded-xl border p-4 ${bg}`}
                >
                  <Icon className={`h-4 w-4 ${color}`} />
                  <div>
                    <p className="text-xs font-semibold leading-tight text-foreground">
                      {t(`checks.${key}.name`)}
                    </p>
                    <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground/80">
                      {t(`checks.${key}.desc`)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* How it works */}
          <motion.div
            className="mt-10"
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35, ease: "easeOut" }}
          >
            <p className="mb-4 text-center text-xs font-medium uppercase tracking-widest text-muted-foreground/50">
              {t("howLabel")}
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {HOW_IT_WORKS.map(({ step, icon: Icon }, i) => (
                <div
                  key={step}
                  className="flex items-start gap-3 rounded-xl border border-border/40 bg-surface/30 p-4 dark:border-white/6 dark:bg-white/2"
                >
                  <span className="mt-0.5 font-mono text-xs font-bold text-muted-foreground/40">{step}</span>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-foreground">
                      {t(`how.${i}.title`)}
                    </p>
                    <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground/70">
                      {t(`how.${i}.desc`)}
                    </p>
                  </div>
                  <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground/30" />
                </div>
              ))}
            </div>
          </motion.div>

          {/* What you get */}
          <motion.div
            className="mt-10 rounded-xl border border-border/40 bg-surface/20 p-5 dark:border-white/6 dark:bg-white/2"
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45, ease: "easeOut" }}
          >
            <p className="mb-4 text-xs font-medium uppercase tracking-widest text-muted-foreground/50">
              {t("whatYouGetLabel")}
            </p>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-4">
              {(["score", "statuses", "issues", "recommendations"] as const).map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-glow" />
                  <span className="text-xs text-muted-foreground">{t(`whatYouGet.${item}`)}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Divider + secondary actions */}
          <motion.div
            className="mt-10 border-t border-border/40 pt-8"
            initial={prefersReducedMotion ? {} : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.55 }}
          >
            <p className="mb-4 text-center text-xs text-muted-foreground/60">
              {t("generateDescription")}
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <a
                href="https://github.com/madeburo/GEO-AI/blob/main/README.md"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-9 flex-1 items-center justify-center gap-2 rounded-lg border border-glow/30 bg-glow/8 px-4 text-xs font-medium text-foreground/80 backdrop-blur-sm transition-all hover:border-glow/50 hover:bg-glow/15 hover:text-foreground dark:border-glow/20 dark:bg-glow/5 dark:text-white/70 dark:hover:text-white"
              >
                <BookOpen className="h-3.5 w-3.5 shrink-0 text-glow" />
                {t("readDocs")}
              </a>
              <a
                href="https://github.com/madeburo/GEO-AI"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-9 flex-1 items-center justify-center gap-2 rounded-lg border border-border/50 bg-surface/40 px-4 text-xs font-medium text-muted-foreground backdrop-blur-sm transition-all hover:border-border hover:bg-surface/80 hover:text-foreground dark:border-white/8 dark:bg-white/3 dark:hover:border-white/15 dark:hover:text-white"
              >
                <GithubIcon className="h-3.5 w-3.5 shrink-0" />
                {t("viewOnGithub")}
              </a>
              <button
                onClick={handleCopy}
                aria-label="Copy install command"
                className="group flex h-9 flex-1 items-center justify-center gap-2 rounded-lg border border-border/50 bg-surface/40 px-4 font-mono text-xs text-muted-foreground backdrop-blur-sm transition-all hover:border-border hover:bg-surface/80 hover:text-foreground dark:border-white/8 dark:bg-white/3 dark:hover:border-white/15 dark:hover:text-white"
              >
                <span className="truncate">npm install geo-ai-core</span>
                {copied ? (
                  <Check className="h-3 w-3 shrink-0 text-glow" />
                ) : (
                  <Copy className="h-3 w-3 shrink-0 opacity-50 transition-opacity group-hover:opacity-100" />
                )}
              </button>
            </div>
          </motion.div>

        </div>
      </main>
      <Footer />
    </>
  );
}
