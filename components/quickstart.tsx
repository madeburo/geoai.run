"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
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
      // Fallback for older browsers / non-HTTPS
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
      className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
    >
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
    </button>
  );
}

function CodeBlock({ code, label }: { code: string; label?: string }) {
  const t = useTranslations("quickstart");
  return (
    <div className="group relative overflow-hidden rounded-lg border border-border bg-[#0f1432] dark:bg-linear-to-b dark:from-[rgba(20,28,55,0.8)] dark:to-[#03070f]">
      {label && (
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
          <span className="font-mono text-xs text-muted-foreground">
            {label}
          </span>
          <CopyButton text={code} label={t("copyToClipboard")} />
        </div>
      )}
      {!label && (
        <div className="absolute top-2 right-2 z-10">
          <CopyButton text={code} label={t("copyToClipboard")} />
        </div>
      )}
      <pre className="overflow-x-auto p-4 font-mono text-sm leading-relaxed text-[#e4e4e7]">
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
  // Simple CSS-based syntax highlighting
  const patterns: [RegExp, string][] = [
    [/\b(import|from|const|await|export|let|var|return|async|function)\b/g, "text-[#c084fc]"],   // keywords — purple
    [/(?<=\.)\w+(?=\s*\()/g, "text-[#60a5fa]"],  // method calls — blue
    [/\b[A-Z]\w*(?=\s*\()/g, "text-[#60a5fa]"],  // PascalCase function calls — blue
    [/"[^"]*"/g, "text-[#86efac]"],   // strings — green
    [/\/\/.*/g, "text-[#6b7280]"],    // comments — gray
    [/\b(true|false|null|undefined)\b/g, "text-[#f9a8d4]"], // literals — pink
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
    <section className="w-full px-4 py-16 sm:px-6 md:py-24 lg:py-32">
      <div className="mx-auto max-w-3xl">
        <ScrollReveal>
          <h2 className="mb-4 text-center text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
            {t("title")}
          </h2>
          <p className="mb-10 text-center text-sm text-muted-foreground sm:mb-12 sm:text-base">
            {t("description")}
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="flex flex-col gap-4">
            <CodeBlock code={INSTALL_COMMAND} label="Terminal" />
            <CodeBlock code={USAGE_CODE} label="index.ts" />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
