"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";

const NAV_LINKS_CONFIG = [
  { key: "analyzer", href: "/analyze", external: false },
  { key: "github", href: "https://github.com/madeburo/GEO-AI", external: true },
  { key: "documentation", href: "#", external: true },
  { key: "specification", href: "#spec", external: false },
];

export function Footer() {
  const tNav = useTranslations("nav");
  const tFooter = useTranslations("footer");

  return (
    <footer className="border-t border-border/40 bg-background px-4 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 py-10 text-center sm:py-12 md:flex-row md:justify-between md:text-left">
        <div className="flex flex-col items-center md:items-start gap-1">
          <Image src="/geo-ai.svg" alt="GEO AI" width={96} height={24} className="h-5 w-auto sm:h-6 logo-navy dark:invert" />
          <p className="text-xs text-muted-foreground sm:text-sm">{tFooter("tagline")}</p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          {NAV_LINKS_CONFIG.map((link) =>
            link.external ? (
              <a
                key={link.key}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-muted-foreground transition-colors hover:text-foreground sm:text-sm"
              >
                {tNav(link.key as "analyzer" | "github" | "documentation" | "specification")}
              </a>
            ) : (
              <Link
                key={link.key}
                href={link.href}
                className="text-xs text-muted-foreground transition-colors hover:text-foreground sm:text-sm"
              >
                {tNav(link.key as "analyzer" | "github" | "documentation" | "specification")}
              </Link>
            )
          )}
        </div>

        <p className="text-xs text-muted-foreground sm:text-sm">{tFooter("copyright")}</p>
      </div>
    </footer>
  );
}
