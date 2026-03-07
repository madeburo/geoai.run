"use client";

import { useEffect, useRef, useCallback } from "react";

// --- Types ---

interface Particle {
  // Orbital
  angle: number;
  baseRadius: number;
  radius: number;
  speed: number;
  // Physics
  x: number;
  y: number;
  vx: number;
  vy: number;
  // Visual
  size: number;
  baseOpacity: number;
  layer: 0 | 1 | 2;
  // Breathing
  breathPhase: number;
}

interface SmoothedMouse {
  x: number;
  y: number;
  rawX: number;
  rawY: number;
  active: boolean;
}

// --- Config ---

const LAYER_CONFIG = [
  { count: 100, sizeMin: 0.6, sizeMax: 1.0, speedMin: 0.0004, speedMax: 0.0012, opacityMin: 0.15, opacityMax: 0.3, mouseStrength: 0.003 },
  { count: 120, sizeMin: 0.9, sizeMax: 1.4, speedMin: 0.0008, speedMax: 0.002, opacityMin: 0.25, opacityMax: 0.5, mouseStrength: 0.008 },
  { count: 40,  sizeMin: 1.1, sizeMax: 1.6, speedMin: 0.001,  speedMax: 0.0025, opacityMin: 0.3, opacityMax: 0.55, mouseStrength: 0.015 },
] as const;

const MOUSE_RADIUS = 250;
const DAMPING = 0.97;
const MOUSE_SMOOTH = 0.04;
const BREATH_PERIOD = 480; // frames (~8s at 60fps)

// --- Particle creation ---

function createParticle(w: number, h: number, layerIdx: 0 | 1 | 2): Particle {
  const cfg = LAYER_CONFIG[layerIdx];
  const cx = w / 2;
  const cy = h / 2;
  const angle = Math.random() * Math.PI * 2;

  // Distribution: sparse center, dense ring, sparse outer
  const minR = Math.min(w, h) * (layerIdx === 0 ? 0.08 : 0.14);
  const maxR = Math.max(w, h) * (layerIdx === 2 ? 0.72 : 0.6);
  const baseRadius = minR + Math.random() * (maxR - minR);

  const x = cx + Math.cos(angle) * baseRadius;
  const y = cy + Math.sin(angle) * baseRadius * 0.55;

  return {
    angle,
    baseRadius,
    radius: baseRadius,
    speed: cfg.speedMin + Math.random() * (cfg.speedMax - cfg.speedMin),
    x,
    y,
    vx: 0,
    vy: 0,
    size: cfg.sizeMin + Math.random() * (cfg.sizeMax - cfg.sizeMin),
    baseOpacity: cfg.opacityMin + Math.random() * (cfg.opacityMax - cfg.opacityMin),
    layer: layerIdx,
    breathPhase: Math.random() * Math.PI * 2,
  };
}

function createAllParticles(w: number, h: number): Particle[] {
  const particles: Particle[] = [];
  for (let l = 0; l < 3; l++) {
    const cfg = LAYER_CONFIG[l];
    for (let i = 0; i < cfg.count; i++) {
      particles.push(createParticle(w, h, l as 0 | 1 | 2));
    }
  }
  return particles;
}

// --- Component ---

export function HeroParticleField({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef<SmoothedMouse>({ x: 0, y: 0, rawX: 0, rawY: 0, active: false });
  const sizeRef = useRef({ w: 0, h: 0 });
  const timeRef = useRef(0);
  const isDarkRef = useRef(false);
  const isVisibleRef = useRef(true);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    mouseRef.current.rawX = e.clientX - rect.left;
    mouseRef.current.rawY = e.clientY - rect.top;
    mouseRef.current.active = true;
  }, []);

  const handleMouseLeave = useCallback(() => {
    mouseRef.current.active = false;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      sizeRef.current.w = rect.width;
      sizeRef.current.h = rect.height;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particlesRef.current = createAllParticles(sizeRef.current.w, sizeRef.current.h);
    };

    // Observe dark mode changes on <html>
    isDarkRef.current = document.documentElement.classList.contains("dark");
    const observer = new MutationObserver(() => {
      isDarkRef.current = document.documentElement.classList.contains("dark");
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    resize();
    window.addEventListener("resize", resize);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    // Pause animation when canvas is off-screen (saves CPU/battery on mobile)
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
        // Resume loop when scrolling back into view
        if (entry.isIntersecting && animationRef.current === 0) {
          animationRef.current = requestAnimationFrame(draw);
        }
      },
      { threshold: 0 }
    );
    visibilityObserver.observe(canvas);

    particlesRef.current = createAllParticles(sizeRef.current.w, sizeRef.current.h);

    // Initialize smoothed mouse to center
    mouseRef.current.x = sizeRef.current.w / 2;
    mouseRef.current.y = sizeRef.current.h / 2;
    mouseRef.current.rawX = sizeRef.current.w / 2;
    mouseRef.current.rawY = sizeRef.current.h / 2;

    if (prefersReducedMotion) {
      const { w, h } = sizeRef.current;
      const cx = w / 2;
      const cy = h / 2;
      ctx.clearRect(0, 0, w, h);
      for (const p of particlesRef.current) {
        const x = cx + Math.cos(p.angle) * p.radius;
        const y = cy + Math.sin(p.angle) * p.radius * 0.55;
        ctx.globalAlpha = p.baseOpacity * 0.5;
        ctx.fillStyle = isDarkRef.current ? "rgba(180, 195, 230, 0.5)" : "rgba(15, 20, 50, 0.5)";
        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      return () => {
        window.removeEventListener("resize", resize);
        canvas.removeEventListener("mousemove", handleMouseMove);
        canvas.removeEventListener("mouseleave", handleMouseLeave);
      };
    }

    const draw = () => {
      const { w, h } = sizeRef.current;
      const cx = w / 2;
      const cy = h / 2;
      const mouse = mouseRef.current;
      timeRef.current += 1;
      const t = timeRef.current;

      // Smooth mouse interpolation
      if (mouse.active) {
        mouse.x += (mouse.rawX - mouse.x) * MOUSE_SMOOTH;
        mouse.y += (mouse.rawY - mouse.y) * MOUSE_SMOOTH;
      } else {
        // Ease back to center when mouse leaves
        mouse.x += (cx - mouse.x) * 0.01;
        mouse.y += (cy - mouse.y) * 0.01;
      }

      // Global breathing
      const breath = Math.sin((t / BREATH_PERIOD) * Math.PI * 2);

      // Clear
      ctx.clearRect(0, 0, w, h);

      // Disable canvas shadow — we draw glow manually
      ctx.shadowBlur = 0;
      ctx.shadowColor = "transparent";

      for (const p of particlesRef.current) {
        const cfg = LAYER_CONFIG[p.layer];

        // Breathing: modulate radius and opacity
        const breathOffset = breath * 0.03 * Math.sin(p.breathPhase + t * 0.002);
        p.radius = p.baseRadius * (1 + breathOffset);

        // Advance orbital angle
        p.angle += p.speed;

        // Target position on elliptical orbit
        const targetX = cx + Math.cos(p.angle) * p.radius;
        const targetY = cy + Math.sin(p.angle) * p.radius * 0.55;

        // Mouse force (using smoothed position)
        const dx = targetX - mouse.x;
        const dy = targetY - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        let forceX = 0;
        let forceY = 0;
        if (dist < MOUSE_RADIUS && dist > 0) {
          const falloff = (1 - dist / MOUSE_RADIUS);
          const strength = falloff * falloff * cfg.mouseStrength;
          forceX = (dx / dist) * strength * 60;
          forceY = (dy / dist) * strength * 60;
        }

        // Spring toward orbital target + mouse force
        const springX = (targetX - p.x) * 0.04;
        const springY = (targetY - p.y) * 0.04;

        p.vx += springX + forceX;
        p.vy += springY + forceY;

        // Damping
        p.vx *= DAMPING;
        p.vy *= DAMPING;

        p.x += p.vx;
        p.y += p.vy;

        // Breathing opacity
        const opacityBreath = 1 + breath * 0.08 * Math.sin(p.breathPhase);
        const opacity = p.baseOpacity * opacityBreath;

        // Theme-aware colors
        const dark = isDarkRef.current;
        const glowColor = dark ? "rgba(160, 180, 220, 1)" : "rgba(15, 20, 50, 1)";
        const coreColor = dark ? "rgba(180, 195, 230, 0.7)" : "rgba(15, 20, 50, 0.55)";

        // Soft glow (faint larger circle)
        ctx.globalAlpha = opacity * 0.08;
        ctx.fillStyle = glowColor;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 5, 0, Math.PI * 2);
        ctx.fill();

        // Core dot
        ctx.globalAlpha = opacity;
        ctx.fillStyle = coreColor;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      if (isVisibleRef.current) {
        animationRef.current = requestAnimationFrame(draw);
      } else {
        animationRef.current = 0;
      }
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationRef.current);
      observer.disconnect();
      visibilityObserver.disconnect();
    };
  }, [handleMouseMove, handleMouseLeave]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: "100%", height: "100%" }}
      aria-hidden="true"
    />
  );
}
