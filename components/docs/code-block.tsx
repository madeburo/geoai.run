"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  className?: string;
}

export function CodeBlock({ code, language, filename, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(code.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("group relative my-5 overflow-hidden rounded-lg border border-white/8 bg-[oklch(0.09_0.015_260)] dark:bg-[oklch(0.09_0.015_260)]", className)}>
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-white/6 px-4 py-2">
        <div className="flex items-center gap-2">
          {filename ? (
            <span className="text-xs text-muted-foreground/60 font-mono">{filename}</span>
          ) : language ? (
            <span className="text-xs text-muted-foreground/40 uppercase tracking-wider font-mono">{language}</span>
          ) : null}
        </div>
        <button
          onClick={copy}
          aria-label="Copy code"
          className="flex items-center gap-1.5 rounded px-2 py-1 text-xs text-muted-foreground/50 transition-colors hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          {copied ? (
            <>
              <Check className="size-3 text-glow" />
              <span className="text-glow">Copied</span>
            </>
          ) : (
            <>
              <Copy className="size-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      {/* Code content */}
      <pre className="overflow-x-auto p-4 text-sm leading-relaxed">
        <code className={cn("font-mono text-[oklch(0.88_0.02_250)]", language && `language-${language}`)}>
          {code.trim()}
        </code>
      </pre>
    </div>
  );
}

interface InlineCodeProps {
  children: React.ReactNode;
}

export function InlineCode({ children }: InlineCodeProps) {
  return (
    <code className="rounded px-1.5 py-0.5 text-[0.875em] font-mono bg-white/6 dark:bg-white/6 text-glow border border-white/8">
      {children}
    </code>
  );
}
