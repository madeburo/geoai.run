"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, Github as GithubIcon, Copy, Check } from "lucide-react";

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

export default function AnalyzePage() {
  const searchParams = useSearchParams();
  const paramUrl = searchParams.get("url");
  const [url, setUrl] = useState(paramUrl ?? "");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
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
      <main id="main-content" className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto w-full max-w-xl text-center">
          <h1 className="mb-3 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {t("title")}
          </h1>
          <p className="mb-10 text-sm text-muted-foreground sm:mb-12 sm:text-base">
            {t("description")}
          </p>

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
            <Button size="lg" className="h-12 w-full rounded-xl bg-foreground px-6 text-sm font-medium text-background dark:bg-white dark:text-black dark:hover:bg-white/90 sm:w-auto" onClick={handleAnalyze}>
              {t("button")}
            </Button>
          </div>

          {error && (
            <p id="analyze-error" role="alert" aria-live="assertive" className="mt-2 text-left text-sm text-destructive">{error}</p>
          )}

          {submitted && !error && (
            <p className="mt-8 text-sm text-muted-foreground">
              {t("comingSoon")}
            </p>
          )}

          {/* Divider */}
          <div className="mt-12 border-t border-border/40 pt-10">
            <p className="mb-6 text-xs text-muted-foreground">
              {t("generateDescription")}
            </p>

            {/* Secondary action row */}
            <div className="flex flex-col gap-2 sm:flex-row">
              {/* Read docs */}
              <a
                href="https://github.com/madeburo/GEO-AI/blob/main/README.md"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-9 flex-1 items-center justify-center gap-2 rounded-lg border border-glow/30 bg-glow/8 px-4 text-xs font-medium text-foreground/80 backdrop-blur-sm transition-all hover:border-glow/50 hover:bg-glow/15 hover:text-foreground dark:border-glow/20 dark:bg-glow/5 dark:text-white/70 dark:hover:text-white"
              >
                <BookOpen className="h-3.5 w-3.5 shrink-0 text-glow" />
                {t("readDocs")}
              </a>

              {/* View on GitHub */}
              <a
                href="https://github.com/madeburo/GEO-AI"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-9 flex-1 items-center justify-center gap-2 rounded-lg border border-border/50 bg-surface/40 px-4 text-xs font-medium text-muted-foreground backdrop-blur-sm transition-all hover:border-border hover:bg-surface/80 hover:text-foreground dark:border-white/8 dark:bg-white/3 dark:hover:border-white/15 dark:hover:text-white"
              >
                <GithubIcon className="h-3.5 w-3.5 shrink-0" />
                {t("viewOnGithub")}
              </a>

              {/* npm install chip */}
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
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
