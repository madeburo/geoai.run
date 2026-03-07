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
          stroke="#c4c4c4"
          strokeWidth="1.2"
          transform={`rotate(${-15 + i * 15}, 100, 100)`}
          opacity={0.6 + i * 0.15}
        />
      ))}
      <circle cx="100" cy="100" r="4" fill="#a0a0a0" opacity="0.7" />
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
        r: 2.2 - ring * 0.25,
        opacity: 0.7 - ring * 0.08,
      });
    }
  }

  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      {dots.map((d, i) => (
        <circle key={i} cx={d.cx} cy={d.cy} r={d.r} fill="#b0b0b0" opacity={d.opacity} />
      ))}
      <circle cx="100" cy="100" r="3" fill="#a0a0a0" opacity="0.8" />
    </svg>
  );
}

function ParallelLinesIllustration({ className }: { className?: string }) {
  const lines = Array.from({ length: 12 }, (_, i) => ({
    y: 40 + i * 10,
    x1: 30 + (i % 3) * 8,
    x2: 170 - (i % 4) * 6,
    opacity: 0.3 + (i % 5) * 0.1,
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
          stroke="#c0c0c0"
          strokeWidth="1.2"
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
