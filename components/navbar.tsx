"use client";

import { useState, useEffect, useRef, useTransition, useSyncExternalStore, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { cn } from "@/lib/utils";

const LANGUAGES = [
  { code: "de", label: "DE" },
  { code: "en", label: "EN" },
  { code: "es", label: "ES" },
  { code: "fr", label: "FR" },
  { code: "ja", label: "JA" },
  { code: "ko", label: "KO" },
  { code: "pt", label: "PT" },
  { code: "ru", label: "RU" },
  { code: "zh", label: "ZH" },
];

const NAV_LINKS_CONFIG = [
  { key: "analyzer", href: "/analyze", external: false },
  { key: "github", href: "https://github.com/madeburo/GEO-AI", external: true },
  { key: "documentation", href: "#", external: true },
  { key: "specification", href: "#spec", external: false },
];

function ThemeToggle() {
  const t = useTranslations("nav");

  // Use useSyncExternalStore to read theme without setState-in-effect
  const subscribe = useCallback((cb: () => void) => {
    // Listen for storage events (cross-tab) and our custom event
    window.addEventListener("storage", cb);
    window.addEventListener("theme-change", cb);
    return () => {
      window.removeEventListener("storage", cb);
      window.removeEventListener("theme-change", cb);
    };
  }, []);

  const getSnapshot = useCallback(() => {
    return document.documentElement.classList.contains("dark");
  }, []);

  const getServerSnapshot = useCallback(() => true, []);

  const dark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggle = () => {
    const next = !dark;
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
    window.dispatchEvent(new Event("theme-change"));
  };

  return (
    <button
      onClick={toggle}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        dark ? "bg-white/8" : "bg-[rgba(15,20,50,0.12)]"
      )}
      role="switch"
      aria-checked={dark}
      aria-label={dark ? t("switchToLight") : t("switchToDark")}
    >
      <span
        className={cn(
          "pointer-events-none inline-block size-4 rounded-full shadow-sm ring-0 transition-transform duration-300",
          dark ? "translate-x-6 bg-glow" : "translate-x-1 bg-foreground"
        )}
      />
    </button>
  );
}

function LanguageSwitcher() {
  const [open, setOpen] = useState(false);
  const locale = useLocale();
  const router = useRouter();
  const [, startTransition] = useTransition();
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const t = useTranslations("nav");

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setOpen(false);
      buttonRef.current?.focus();
    }
    if (!open && (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      setOpen(true);
    }
    if (open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      e.preventDefault();
      const items = menuRef.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]');
      if (!items?.length) return;
      const current = Array.from(items).indexOf(document.activeElement as HTMLButtonElement);
      const next = e.key === "ArrowDown"
        ? (current + 1) % items.length
        : (current - 1 + items.length) % items.length;
      items[next].focus();
    }
  };

  const switchLocale = async (newLocale: string) => {
    await fetch("/api/locale", {
      method: "POST",
      body: JSON.stringify({ locale: newLocale }),
    });
    setOpen(false);
    buttonRef.current?.focus();
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <div className="relative" ref={menuRef} onKeyDown={handleKeyDown}>
      <button
        ref={buttonRef}
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1 rounded-md p-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        aria-label={t("changeLanguage")}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <Globe className="size-4" />
        <span className="text-xs uppercase">{locale}</span>
      </button>
      {open && (
        <div
          className="absolute right-0 top-full mt-1 min-w-[80px] rounded-xl border border-border/40 bg-background/95 py-1 shadow-xl backdrop-blur-xl dark:border-white/6 dark:bg-surface/95"
          role="menu"
          aria-label="Language selection"
        >
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              role="menuitem"
              tabIndex={0}
              onClick={() => switchLocale(l.code)}
              className={cn(
                "block w-full px-3 py-1.5 text-left text-xs transition-colors hover:bg-accent",
                locale === l.code ? "text-foreground font-medium" : "text-muted-foreground"
              )}
              aria-current={locale === l.code ? "true" : undefined}
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}


export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("nav");

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen || !mobileMenuRef.current) return;
    const menu = mobileMenuRef.current;
    const focusable = menu.querySelectorAll<HTMLElement>('a, button, [tabindex]:not([tabindex="-1"])');
    if (focusable.length) focusable[0].focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen]);

  const navLinks = NAV_LINKS_CONFIG.map((link) => ({
    ...link,
    label: t(link.key as "analyzer" | "github" | "documentation" | "specification"),
  }));

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:shadow-lg"
      >
        {t("skipToContent")}
      </a>
      <nav
        className={cn(
          "sticky top-0 z-50 w-full",
          "border-b border-border/30",
          "bg-background/70 backdrop-blur-xl backdrop-saturate-150",
          "px-4 sm:px-6",
          "transition-colors duration-300",
          "dark:border-white/4"
        )}
      >
        <div className="mx-auto flex h-14 max-w-6xl items-center">
          <Link href="/" className="flex shrink-0 items-center">
            <Image src="/geo-ai.svg" alt="GEO AI" width={96} height={24} className="h-5 w-auto sm:h-6 logo-navy dark:invert" />
          </Link>

          <div className="hidden flex-1 items-center justify-center gap-8 md:flex">
            {navLinks.map((link) =>
              link.external ? (
                <a key={link.key} href={link.href} target="_blank" rel="noopener noreferrer" className="text-[13px] text-muted-foreground transition-colors hover:text-foreground">{link.label}</a>
              ) : (
                <Link key={link.key} href={link.href} className="text-[13px] text-muted-foreground transition-colors hover:text-foreground">{link.label}</Link>
              )
            )}
          </div>

          <div className="ml-auto flex items-center gap-1 md:ml-0">
            <ThemeToggle />
            <LanguageSwitcher />
            <button
              className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground transition-colors hover:text-foreground md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? t("closeMenu") : t("openMenu")}
            >
              {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            ref={mobileMenuRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-60 flex flex-col justify-between bg-background px-6 pb-6 pt-6 md:hidden overflow-hidden"
            role="dialog"
            aria-label="Mobile navigation"
          >
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 inline-flex items-center justify-center rounded-md p-2 text-muted-foreground transition-colors hover:text-foreground"
              aria-label={t("closeMenu")}
            >
              <X className="size-5" />
            </button>
            <div>
              <Link href="/" onClick={() => setMobileOpen(false)} className="mb-6 inline-block">
                <Image src="/geo-ai.svg" alt="GEO AI" width={96} height={24} className="h-5 w-auto logo-navy dark:invert" />
              </Link>
              <div className="flex flex-col gap-5">
                {navLinks.map((link, i) =>
                  link.external ? (
                    <motion.a
                      key={link.key}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base font-medium text-muted-foreground transition-colors hover:text-foreground"
                      onClick={() => setMobileOpen(false)}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.25, delay: 0.05 + i * 0.05 }}
                    >
                      {link.label}
                    </motion.a>
                  ) : (
                    <motion.div
                      key={link.key}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.25, delay: 0.05 + i * 0.05 }}
                    >
                      <Link href={link.href} className="text-base font-medium text-muted-foreground transition-colors hover:text-foreground" onClick={() => setMobileOpen(false)}>{link.label}</Link>
                    </motion.div>
                  )
                )}
              </div>
            </div>
            <motion.a
              href="https://github.com/madeburo/GEO-AI"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0"
              onClick={() => setMobileOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Image src="/github-logo.svg" alt="GitHub" width={80} height={22} className="h-5 w-auto opacity-50 dark:invert" />
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}