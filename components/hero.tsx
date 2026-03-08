"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useTranslations } from "next-intl";
import { HeroParticleField } from "@/components/hero-particle-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";

const AI_LOGOS = [
  { name: "ChatGPT" },
  { name: "Claude" },
  { name: "Gemini" },
  { name: "Perplexity" },
  { name: "Grok" },
  { name: "Qwen" },
  { name: "DeepSeek" },
];

export function Hero() {
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [heroUrl, setHeroUrl] = useState("");
  const router = useRouter();
  const t = useTranslations("hero");

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.7], [1, 0.97]);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const handleMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      setMouseOffset({
        x: (e.clientX - cx) / cx,
        y: (e.clientY - cy) / cy,
      });
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [prefersReducedMotion]);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const parallax = (strength: number) =>
    prefersReducedMotion || isMobile
      ? {}
      : {
          transform: `translate(${mouseOffset.x * strength}px, ${mouseOffset.y * strength}px)`,
          transition: "transform 0.3s ease-out",
        };

  return (
    <motion.section
      ref={sectionRef}
      style={{ opacity: heroOpacity, scale: heroScale }}
      className="relative flex min-h-[80vh] w-full flex-col items-center justify-center overflow-hidden sm:min-h-[85vh]"
    >
      {/* Deep dark atmospheric background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(244,250,255,1)_0%,rgba(238,245,252,1)_50%,rgba(232,240,248,1)_100%)] dark:bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,oklch(0.20_0.04_162/25%),oklch(0.085_0.015_260)_70%)]" />

      {/* Subtle grid overlay */}
      <div className="pointer-events-none absolute inset-0 hidden dark:block grid-bg opacity-60" />

      {/* Vertical glow beam */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[60vh] w-px hidden dark:block">
        <div className="h-full w-full bg-linear-to-b from-glow/40 via-glow/10 to-transparent" />
      </div>

      {/* Horizontal glow line at hero midpoint */}
      <div className="pointer-events-none absolute top-[45%] left-0 right-0 h-px hidden dark:block glow-line opacity-30" />

      {/* Particle flow field */}
      <div
        className="pointer-events-auto absolute inset-0"
        style={parallax(4)}
      >
        <HeroParticleField className="h-full w-full" />
      </div>

      {/* Radial vignette overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 30%, var(--background) 80%)",
        }}
      />

      {/* Hero content */}
      <div
        className="relative z-10 flex w-full max-w-3xl flex-col items-center gap-6 px-5 text-center sm:gap-12 sm:px-12"
        style={parallax(-6)}
      >
        {/* Badge */}
        <motion.div
          className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-surface/50 px-4 py-1.5 text-xs text-muted-foreground backdrop-blur-sm dark:border-glow/15 dark:bg-glow/5 sm:text-[13px]"
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        >
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-glow glow-dot" />
          {t("subtitle")}
        </motion.div>

        {/* Title */}
        <motion.h1
          className="text-5xl font-bold tracking-tighter sm:text-7xl md:text-8xl lg:text-9xl"
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 30, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <span className="bg-linear-to-b from-foreground via-foreground to-foreground/50 bg-clip-text text-transparent dark:from-white dark:via-white/90 dark:to-white/40">
            {t("title")}
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          className="max-w-lg text-sm leading-relaxed text-muted-foreground sm:max-w-xl sm:text-lg"
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
        >
          {t("description")}
        </motion.p>

        {/* Analyzer form */}
        <motion.div
          className="flex w-full max-w-xl flex-col gap-3 pt-4 sm:flex-row"
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
        >
          <Input
            id="hero-url-input"
            placeholder={t("placeholder")}
            aria-label={t("placeholder")}
            value={heroUrl}
            onChange={(e) => setHeroUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && heroUrl.trim()) {
                router.push(`/analyze?url=${encodeURIComponent(heroUrl.trim())}`);
              }
            }}
            className="h-12 flex-1 rounded-xl border-border/50 bg-surface/80 px-5 py-3 text-sm backdrop-blur-sm transition-all focus-visible:border-glow/30 focus-visible:ring-glow/20 dark:border-white/6 dark:bg-white/4"
          />
          <Link href={heroUrl.trim() ? `/analyze?url=${encodeURIComponent(heroUrl.trim())}` : "/analyze"}>
            <Button
              size="lg"
              className="group/btn h-12 w-full rounded-xl bg-foreground px-6 text-sm font-medium text-background transition-all duration-300 hover:scale-[1.02] dark:bg-white dark:text-black dark:hover:bg-white/90 sm:w-auto"
            >
              {t("analyze")}
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" />
            </Button>
          </Link>
        </motion.div>

        {/* GitHub link */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <a
            href="https://github.com/madeburo/GEO-AI"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground/70 underline-offset-4 transition-colors hover:text-foreground hover:underline"
          >
            {t("viewOnGithub")}
          </a>
        </motion.div>

        {/* AI Logos — infinite marquee */}
        <motion.div
          className="w-full max-w-2xl overflow-hidden pt-8 sm:pt-10 mask-[linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]"
          initial={prefersReducedMotion ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          <motion.div
            className="flex w-max gap-10 sm:gap-14"
            animate={prefersReducedMotion ? {} : { x: ["0%", "-50%"] }}
            transition={{ x: { duration: 20, ease: "linear", repeat: Infinity } }}
          >
            {[...AI_LOGOS, ...AI_LOGOS].map((logo, i) => (
              <span
                key={`${logo.name}-${i}`}
                className="text-[12px] font-medium text-muted-foreground/80 uppercase select-none whitespace-nowrap sm:text-xs"
              >
                {logo.name}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom fade to next section */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-20 bg-linear-to-t from-background to-transparent" />
    </motion.section>
  );
}