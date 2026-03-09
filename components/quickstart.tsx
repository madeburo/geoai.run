"use client";

import { useState } from "react";
import { Check, Copy, Terminal, FileCode } from "lucide-react";
import { useTranslations } from "next-intl";
import { ScrollReveal } from "@/components/scroll-reveal";

const INSTALL_COMMAND = "npm install geo-ai-core";

const USAGE_CODE = `import { createGeoAI } from "geo-ai-core";

const geoai = createGeoAI({
  siteUrl: "https://example.com",
  outputDir: "./public",
});

await geoai.generateLlmsTxt();
await geoai.generateCrawlerRules();
await geoai.generateMetadata();`;

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={handleCopy}
      aria-label={label}
      className="flex h-7 w-7 items-center justify-center rounded-md border border-transparent text-muted-foreground/60 transition-all hover:border-border/60 hover:bg-muted/40 hover:text-foreground dark:hover:border-white/10 dark:hover:bg-white/8"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-glow" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
}

function CodeBlock({ code, label, icon }: { code: string; label?: string; icon?: React.ReactNode }) {
  const t = useTranslations("quickstart");
  return (
    <div className="group relative overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm backdrop-blur-sm dark:border-white/15 dark:bg-[#0f1424]">
      {label && (
        <div className="flex items-center justify-between border-b border-border/50 bg-muted/30 px-4 py-2.5 dark:border-white/10 dark:bg-white/5">
          <div className="flex items-center gap-2">
            {icon && <span className="text-muted-foreground/60">{icon}</span>}
            <span className="font-mono text-[11px] font-semibold tracking-wide text-muted-foreground/80">
              {label}
            </span>
          </div>
          <CopyButton text={code} label={t("copyToClipboard")} />
        </div>
      )}
      {!label && (
        <div className="absolute top-2 right-2 z-10">
          <CopyButton text={code} label={t("copyToClipboard")} />
        </div>
      )}
      <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-[1.7] text-foreground/90">
        <code>{highlightSyntax(code)}</code>
      </pre>
    </div>
  );
}

function highlightSyntax(code: string): React.ReactNode[] {
  const lines = code.split("\n");
  return lines.map((line, i) => (
    <span key={i}>
      {tokenizeLine(line)}
      {i < lines.length - 1 ? "\n" : null}
    </span>
  ));
}

function tokenizeLine(line: string): React.ReactNode[] {
  const tokens: React.ReactNode[] = [];
  const patterns: [RegExp, string][] = [
    [/\b(import|from|const|await|export|let|var|return|async|function)\b/g, "text-[#0e7490] dark:text-[#5eead4]"],
    [/(?<=\.)\w+(?=\s*\()/g, "text-[#0369a1] dark:text-[#7dd3fc]"],
    [/\b[A-Z]\w*(?=\s*\()/g, "text-[#0369a1] dark:text-[#7dd3fc]"],
    [/"[^"]*"/g, "text-[#15803d] dark:text-[#86efac]"],
    [/\/\/.*/g, "text-[#6b7280] dark:text-[#4b5563]"],
    [/\b(true|false|null|undefined)\b/g, "text-[#be185d] dark:text-[#f9a8d4]"],
  ];

  let remaining = line;
  let pos = 0;

  while (remaining.length > 0) {
    let earliest: { index: number; length: number; className: string } | null = null;

    for (const [pattern, className] of patterns) {
      pattern.lastIndex = 0;
      const match = pattern.exec(remaining);
      if (match && (!earliest || match.index < earliest.index)) {
        earliest = { index: match.index, length: match[0].length, className };
      }
    }

    if (!earliest) {
      tokens.push(remaining);
      break;
    }

    if (earliest.index > 0) {
      tokens.push(remaining.slice(0, earliest.index));
    }

    tokens.push(
      <span key={`${pos}-${earliest.index}`} className={earliest.className}>
        {remaining.slice(earliest.index, earliest.index + earliest.length)}
      </span>
    );

    remaining = remaining.slice(earliest.index + earliest.length);
    pos++;
  }

  return tokens;
}

export function QuickStart() {
  const t = useTranslations("quickstart");
  return (
    <section className="relative w-full px-4 py-16 sm:px-6 md:py-20 lg:py-24">
      {/* Subtle section divider glow */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-px w-2/3 max-w-xl glow-line opacity-20" />

      <div className="mx-auto max-w-4xl">
        <ScrollReveal>
          <h2 className="mb-4 text-center text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {t("title")}
          </h2>
          <p className="mb-12 text-center text-sm text-muted-foreground sm:mb-16 sm:text-base">
            {t("description")}
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="flex flex-col gap-4">
            <CodeBlock code={INSTALL_COMMAND} label="Terminal" icon={<Terminal className="h-3.5 w-3.5" />} />
            <CodeBlock code={USAGE_CODE} label="index.ts" icon={<FileCode className="h-3.5 w-3.5" />} />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}