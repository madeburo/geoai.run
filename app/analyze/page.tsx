"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { AIReadinessReport, CheckStatus } from "@/lib/analyzer/types";
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
  Loader2,
  AlertCircle,
  CheckCircle2,
  XCircle,
  MinusCircle,
  HelpCircle,
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
    key: "llmsTxt" as const,
    color: "text-glow",
    bg: "bg-glow/8 border-glow/20 dark:bg-glow/5 dark:border-glow/15",
  },
  {
    icon: Tag,
    key: "aiMetadata" as const,
    color: "text-blue-400",
    bg: "bg-blue-500/8 border-blue-500/20 dark:bg-blue-500/5 dark:border-blue-500/15",
  },
  {
    icon: Bot,
    key: "crawlerRules" as const,
    color: "text-purple-400",
    bg: "bg-purple-500/8 border-purple-500/20 dark:bg-purple-500/5 dark:border-purple-500/15",
  },
  {
    icon: Database,
    key: "structuredSignals" as const,
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

function statusIcon(status: CheckStatus) {
  switch (status) {
    case "pass":
      return <CheckCircle2 className="h-4 w-4 text-glow" />;
    case "warn":
      return <AlertCircle className="h-4 w-4 text-yellow-400" />;
    case "fail":
      return <XCircle className="h-4 w-4 text-red-400" />;
    case "not_found":
      return <MinusCircle className="h-4 w-4 text-muted-foreground" />;
    default:
      return <HelpCircle className="h-4 w-4 text-muted-foreground/50" />;
  }
}

function statusColor(status: CheckStatus): string {
  switch (status) {
    case "pass":    return "text-glow";
    case "warn":    return "text-yellow-400";
    case "fail":    return "text-red-400";
    case "not_found": return "text-muted-foreground";
    default:        return "text-muted-foreground/50";
  }
}

function scoreBg(score: number): string {
  if (score >= 80) return "text-glow";
  if (score >= 50) return "text-yellow-400";
  return "text-red-400";
}

export default function AnalyzePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const paramUrl = searchParams.get("url") ?? "";
  const [url, setUrl] = useState(paramUrl);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<AIReadinessReport | null>(null);
  const [apiError, setApiError] = useState("");
  const [copied, setCopied] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const t = useTranslations("analyze");

  const runAnalysis = useCallback(async (targetUrl: string) => {
    setLoading(true);
    setReport(null);
    setApiError("");
    try {
      const res = await fetch(`/api/analyze?url=${encodeURIComponent(targetUrl)}`);
      if (res.status === 429) {
        setApiError(t("errorRateLimit"));
        return;
      }
      if (!res.ok) {
        setApiError(t("errorApi"));
        return;
      }
      const data: AIReadinessReport = await res.json();
      setReport(data);
    } catch {
      setApiError(t("errorApi"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  // Auto-run if url param is present on mount
  useEffect(() => {
    if (paramUrl && isValidUrl(paramUrl)) {
      runAnalysis(paramUrl);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleCopy() {
    navigator.clipboard.writeText("npm install geo-ai-core");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleAnalyze() {
    const trimmed = url.trim();
    if (!trimmed) {
      setError(t("errorEmpty"));
      return;
    }
    if (!isValidUrl(trimmed)) {
      setError(t("errorInvalid"));
      return;
    }
    setError("");
    router.replace(`/analyze?url=${encodeURIComponent(trimmed)}`);
    runAnalysis(trimmed);
  }

  const showLanding = !loading && !report && !apiError;

  return (
    <>
      <Navbar />
      <main id="main-content" className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center px-4 pb-24 pt-16 sm:px-6 sm:pt-24">
        <div className="mx-auto w-full max-w-2xl">

          {/* Hero */}
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
                disabled={loading}
                className="h-12 w-full rounded-xl bg-foreground px-6 text-sm font-medium text-background dark:bg-white dark:text-black dark:hover:bg-white/90 sm:w-auto"
                onClick={handleAnalyze}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  t("button")
                )}
              </Button>
            </div>

            {error && (
              <p id="analyze-error" role="alert" aria-live="assertive" className="mt-2 text-left text-sm text-destructive">
                {error}
              </p>
            )}
            {apiError && (
              <p role="alert" aria-live="assertive" className="mt-2 text-center text-sm text-destructive">
                {apiError}
              </p>
            )}
          </motion.div>

          {/* Trust lines — only on landing */}
          {showLanding && (
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
          )}

          {/* Loading state */}
          <AnimatePresence>
            {loading && (
              <motion.div
                key="loading"
                className="mt-12 flex flex-col items-center gap-4 text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <Loader2 className="h-8 w-8 animate-spin text-glow" />
                <p className="text-sm text-muted-foreground">{t("analyzing")}</p>
                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {CHECK_CARDS.map(({ icon: Icon, key, color }) => (
                    <div key={key} className="flex items-center gap-2 rounded-lg border border-border/30 bg-surface/20 px-3 py-2 dark:border-white/5 dark:bg-white/2">
                      <Icon className={`h-3.5 w-3.5 shrink-0 ${color} opacity-60`} />
                      <span className="text-[11px] text-muted-foreground/60">{t(`checks.${key}.name`)}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results */}
          <AnimatePresence>
            {report && !loading && (
              <motion.div
                key="results"
                className="mt-10 space-y-6"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                {/* Score header */}
                <div className="flex items-center justify-between rounded-xl border border-border/40 bg-surface/30 px-5 py-4 dark:border-white/6 dark:bg-white/2">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground/50">
                      {t("whatYouGet.score")}
                    </p>
                    <p className={`mt-1 text-4xl font-bold tabular-nums ${scoreBg(report.score.overall)}`}>
                      {report.score.overall}
                      <span className="ml-1 text-lg font-normal text-muted-foreground/50">/100</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground/50">{report.finalUrl ?? report.normalizedUrl ?? report.inputUrl}</p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground/30">{new Date(report.timestamp).toLocaleTimeString()}</p>
                  </div>
                </div>

                {/* Category cards */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {CHECK_CARDS.map(({ icon: Icon, key, color, bg }) => {
                    const check = report.checks[key];
                    return (
                      <div key={key} className={`flex flex-col gap-2 rounded-xl border p-4 ${bg}`}>
                        <div className="flex items-center justify-between">
                          <Icon className={`h-4 w-4 ${color}`} />
                          {statusIcon(check.status)}
                        </div>
                        <div>
                          <p className="text-xs font-semibold leading-tight text-foreground">
                            {t(`checks.${key}.name`)}
                          </p>
                          <p className={`mt-0.5 text-[11px] font-medium ${statusColor(check.status)}`}>
                            {check.status}
                          </p>
                        </div>
                        <p className="text-[10px] leading-snug text-muted-foreground/70 line-clamp-2">
                          {check.summary}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Issues */}
                {report.issues.length > 0 && (
                  <div className="rounded-xl border border-border/40 bg-surface/20 p-5 dark:border-white/6 dark:bg-white/2">
                    <p className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground/50">
                      {t("whatYouGet.issues")} ({report.issues.length})
                    </p>
                    <ul className="space-y-2">
                      {report.issues.map((issue, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <span className={`mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full ${
                            issue.severity === "high" ? "bg-red-400" :
                            issue.severity === "medium" ? "bg-yellow-400" : "bg-muted-foreground/40"
                          }`} />
                          <span className="text-xs text-muted-foreground">{issue.message}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Recommendations */}
                {report.recommendations.length > 0 && (
                  <div className="rounded-xl border border-border/40 bg-surface/20 p-5 dark:border-white/6 dark:bg-white/2">
                    <p className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground/50">
                      {t("whatYouGet.recommendations")} ({report.recommendations.length})
                    </p>
                    <ul className="space-y-3">
                      {report.recommendations.map((rec, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-glow" />
                          <div>
                            <p className="text-xs font-semibold text-foreground">{rec.title}</p>
                            <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground/70">{rec.description}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Landing content — only when no results */}
          {showLanding && (
            <>
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
                    <div key={key} className={`flex flex-col gap-2 rounded-xl border p-4 ${bg}`}>
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
                        <p className="text-xs font-semibold text-foreground">{t(`how.${i}.title`)}</p>
                        <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground/70">{t(`how.${i}.desc`)}</p>
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
            </>
          )}

          {/* Secondary actions */}
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
