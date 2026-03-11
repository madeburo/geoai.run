"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";

const NAV_LINKS_CONFIG = [
  { key: "analyzer", href: "/analyze", external: false },
  { key: "documentation", href: "/docs", external: false },
  { key: "specification", href: "/specification", external: false },
  { key: "contact", href: "/contact", external: false },
];

export function Footer() {
  const tNav = useTranslations("nav");
  const tFooter = useTranslations("footer");

  return (
    <footer className="border-t border-border/80 bg-background px-4 sm:px-6 dark:border-white/12">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 py-12 text-center sm:py-16 md:flex-row md:justify-between md:text-left">
        <div className="flex flex-col items-center md:items-start gap-2">
          <Image src="/geo-ai.svg" alt="GEO AI" width={96} height={24} className="h-5 w-auto sm:h-6 logo-navy dark:invert" />
          <p className="text-xs text-muted-foreground/80 sm:text-sm">{tFooter("tagline")}</p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8">
          {NAV_LINKS_CONFIG.map((link) =>
            link.external ? (
              <a
                key={link.key}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-muted-foreground/80 transition-colors hover:text-foreground sm:text-sm"
              >
                {tNav(link.key as "analyzer" | "github" | "documentation" | "specification" | "contact")}
              </a>
            ) : (
              <Link
                key={link.key}
                href={link.href}
                className="text-xs text-muted-foreground/80 transition-colors hover:text-foreground sm:text-sm"
              >
                {tNav(link.key as "analyzer" | "github" | "documentation" | "specification" | "contact")}
              </Link>
            )
          )}
        </div>

        <p className="text-xs text-muted-foreground/60 sm:text-sm">{tFooter("copyright")}</p>
      </div>
    </footer>
  );
}