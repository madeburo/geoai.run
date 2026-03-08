export type IllustrationType = "rings" | "radial-burst" | "parallel-lines";

interface GeoIllustrationProps {
  type: IllustrationType;
  className?: string;
}

function RingsIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      {[70, 50, 30].map((r, i) => (
        <ellipse
          key={i}
          cx="100"
          cy="100"
          rx={r}
          ry={r * 0.4}
          fill="none"
          stroke="oklch(0.72 0.17 162 / 0.3)"
          strokeWidth="0.8"
          transform={`rotate(${-15 + i * 15}, 100, 100)`}
          opacity={0.5 + i * 0.15}
        />
      ))}
      <circle cx="100" cy="100" r="3" fill="oklch(0.72 0.17 162 / 0.5)" />
    </svg>
  );
}

function RadialBurstIllustration({ className }: { className?: string }) {
  const dots: { cx: string; cy: string; r: number; opacity: number }[] = [];
  for (let ring = 1; ring <= 5; ring++) {
    const radius = ring * 16;
    const count = ring * 6;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      dots.push({
        cx: (100 + Math.cos(angle) * radius).toFixed(2),
        cy: (100 + Math.sin(angle) * radius).toFixed(2),
        r: 1.8 - ring * 0.2,
        opacity: 0.5 - ring * 0.06,
      });
    }
  }

  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      {dots.map((d, i) => (
        <circle key={i} cx={d.cx} cy={d.cy} r={d.r} fill="oklch(0.72 0.17 162 / 0.4)" opacity={d.opacity} />
      ))}
      <circle cx="100" cy="100" r="2.5" fill="oklch(0.72 0.17 162 / 0.6)" />
    </svg>
  );
}

function ParallelLinesIllustration({ className }: { className?: string }) {
  const lines = Array.from({ length: 12 }, (_, i) => ({
    y: 40 + i * 10,
    x1: 30 + (i % 3) * 8,
    x2: 170 - (i % 4) * 6,
    opacity: 0.2 + (i % 5) * 0.06,
  }));

  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      {lines.map((l, i) => (
        <line
          key={i}
          x1={l.x1}
          y1={l.y}
          x2={l.x2}
          y2={l.y}
          stroke="oklch(0.72 0.17 162 / 0.3)"
          strokeWidth="0.8"
          opacity={l.opacity}
        />
      ))}
    </svg>
  );
}

export function GeoIllustration({ type, className }: GeoIllustrationProps) {
  switch (type) {
    case "rings":
      return <RingsIllustration className={className} />;
    case "radial-burst":
      return <RadialBurstIllustration className={className} />;
    case "parallel-lines":
      return <ParallelLinesIllustration className={className} />;
    default:
      return null;
  }
}