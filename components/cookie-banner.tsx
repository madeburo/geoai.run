"use client";

import { useEffect, useState } from "react";
import { useReducedMotion, motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";

const STORAGE_KEY = "cookie-consent";

type ConsentValue = "accepted" | "rejected" | null;

function loadClarity(id: string) {
  if (typeof window === "undefined" || !id) return;
  if ((window as unknown as Record<string, unknown>)["clarity"]) return;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.clarity.ms/tag/${id}`;
  document.head.appendChild(script);

  // Init clarity queue
  const w = window as unknown as Record<string, unknown>;
  w["clarity"] = w["clarity"] || function (...args: unknown[]) {
    ((w["clarity"] as { q?: unknown[] }).q = (w["clarity"] as { q?: unknown[] }).q || []).push(args);
  };
}

export function CookieBanner({ clarityId }: { clarityId: string }) {
  const t = useTranslations("cookies");
  const [consent, setConsent] = useState<ConsentValue>(() => {
    if (typeof window === "undefined") return null;
    return (localStorage.getItem(STORAGE_KEY) as ConsentValue) ?? null;
  });
  const [visible, setVisible] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (consent === "accepted") {
      loadClarity(clarityId);
    } else if (consent === null) {
      setVisible(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function accept() {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setConsent("accepted");
    setVisible(false);
    loadClarity(clarityId);
  }

  function reject() {
    localStorage.setItem(STORAGE_KEY, "rejected");
    setConsent("rejected");
    setVisible(false);
  }

  function reopen() {
    setVisible(true);
  }

  return (
    <>
      <AnimatePresence>
        {visible && (
          <motion.div
            key="banner"
            initial={reduced ? { opacity: 1 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-4 right-4 z-50 max-w-xs w-full"
          >
            <div className="rounded-xl border border-black/10 dark:border-white/10 bg-white/50 dark:bg-black/50 backdrop-blur-md px-4 py-3 text-xs text-foreground transition-all duration-300 hover:border-black/15 dark:hover:border-white/15 [box-shadow:0_1px_12px_-2px_oklch(0_0_0/8%),0_0_0_1px_oklch(0_0_0/4%)] dark:[box-shadow:inset_0_1px_0_0_oklch(0.90_0.01_255/5%),0_0_0_1px_oklch(0.90_0.01_255/6%),0_2px_20px_-4px_oklch(0_0_0/30%)] hover:[box-shadow:0_2px_16px_-2px_oklch(0_0_0/12%),0_0_0_1px_oklch(0_0_0/6%)] dark:hover:[box-shadow:inset_0_1px_0_0_oklch(0.90_0.01_255/8%),0_0_0_1px_oklch(0.72_0.17_162/12%),0_4px_32px_-4px_oklch(0_0_0/40%),0_0_24px_-8px_oklch(0.72_0.17_162/10%)]">
              <p className="mb-3 leading-relaxed">
                {t("message")}
              </p>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={reject}
                  className="px-3 py-1 rounded-md text-foreground/40 hover:text-foreground/70 transition-colors"
                >
                  {t("reject")}
                </button>
                <button
                  onClick={accept}
                  className="px-3 py-1 rounded-md bg-foreground/10 hover:bg-foreground/15 text-foreground transition-colors"
                >
                  {t("accept")}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Small re-open trigger when consent was set */}
      {consent !== null && !visible && (
        <button
          onClick={reopen}
          aria-label={t("settings")}
          className="fixed bottom-4 right-4 z-50 text-[10px] text-foreground/20 hover:text-foreground/50 transition-colors"
        >
          cookies
        </button>
      )}
    </>
  );
}
