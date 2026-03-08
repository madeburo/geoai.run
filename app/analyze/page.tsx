"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
  const t = useTranslations("analyze");

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
        </div>
      </main>
      <Footer />
    </>
  );
}
