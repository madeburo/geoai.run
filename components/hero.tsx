"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useTranslations } from "next-intl";
import { HeroParticleField } from "@/components/hero-particle-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

  // Scroll-based fade out
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.7], [1, 0.97]);

  // Parallax mouse tracking for depth layers
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

  const parallax = (strength: number) =>
    prefersReducedMotion
      ? {}
      : {
          transform: `translate(${mouseOffset.x * strength}px, ${mouseOffset.y * strength}px)`,
          transition: "transform 0.3s ease-out",
        };

  return (
    <motion.section
      ref={sectionRef}
      style={{ opacity: heroOpacity, scale: heroScale }}
      className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden"
    >
      {/* Atmospheric background */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(245,247,252,1)_0%,rgba(238,241,247,1)_50%,rgba(232,236,243,1)_100%)] dark:bg-[radial-gradient(circle_at_50%_45%,rgba(18,22,38,1)_0%,rgba(14,18,32,1)_50%,rgba(10,14,28,1)_100%)]"
      />

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

      {/* Layer 4: Hero content */}
      <div
        className="relative z-10 flex flex-col items-center gap-8 px-4 text-center sm:gap-6 sm:px-6"
        style={parallax(-6)}
      >
        {/* Title */}
        <motion.h1
          className="text-6xl font-bold tracking-tight sm:text-7xl md:text-8xl lg:text-9xl"
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 30, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <span className="text-foreground">
            {t("title")}
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-sm text-muted-foreground uppercase sm:text-base tracking-tight"
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
        >
          {t("subtitle")}
        </motion.p>

        {/* Description */}
        <motion.p
          className="max-w-md text-base text-muted-foreground sm:max-w-lg"
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
        >
          {t("description")}
        </motion.p>

        {/* Analyzer form */}
        <motion.div
          className="flex w-full max-w-xl flex-col gap-3 pt-4 sm:flex-row"
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
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
            className="h-11 flex-1 rounded-full px-5 backdrop-blur-sm"
          />
          <Link href={heroUrl.trim() ? `/analyze?url=${encodeURIComponent(heroUrl.trim())}` : "/analyze"}>
            <Button
              size="lg"
              className="w-full rounded-full bg-foreground px-6 text-background shadow-lg shadow-black/10 transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:shadow-black/20 sm:w-auto"
            >
              {t("analyze")}
            </Button>
          </Link>
        </motion.div>

        {/* GitHub link */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <a
            href="https://github.com/madeburo/GEO-AI"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
          >
            {t("viewOnGithub")}
          </a>
        </motion.div>

        {/* AI Logos — infinite marquee */}
        <motion.div
          className="w-full max-w-2xl overflow-hidden pt-8 sm:pt-10 mask-[linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]"
          initial={prefersReducedMotion ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <motion.div
            className="flex w-max gap-8 sm:gap-12"
            animate={prefersReducedMotion ? {} : { x: ["0%", "-50%"] }}
            transition={{ x: { duration: 20, ease: "linear", repeat: Infinity } }}
          >
            {[...AI_LOGOS, ...AI_LOGOS].map((logo, i) => (
              <span
                key={`${logo.name}-${i}`}
                className="text-xs tracking-wide text-muted-foreground/40 select-none whitespace-nowrap sm:text-sm"
              >
                {logo.name}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}
