import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const QUICK_LINKS = [
  { label: "Analyzer", href: "/analyze" },
  { label: "Documentation", href: "#" },
  { label: "Specification", href: "/#spec" },
  { label: "GitHub", href: "https://github.com/madeburo/GEO-AI" },
];

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-4 text-center overflow-hidden">
      {/* Subtle background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[700px] rounded-full bg-glow/5 blur-[120px]" />
      </div>

      {/* Badge */}
      <Link href="/" className="mb-8 inline-flex items-center">
        <Image
          src="/geo-ai.svg"
          alt="GEO AI"
          width={96}
          height={24}
          className="h-5 w-auto logo-navy dark:invert"
        />
      </Link>

      {/* Error block */}
      <div className="mb-2 text-[80px] font-bold leading-none tracking-tight text-foreground sm:text-[112px]">
        404
      </div>

      <h1 className="mb-3 text-xl font-semibold tracking-tight sm:text-2xl">
        Page not found
      </h1>

      <p className="mb-8 max-w-sm text-sm text-muted-foreground sm:text-base">
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
        Return to the homepage, analyze a website, or explore the docs.
      </p>

      {/* Primary CTAs */}
      <div className="mb-10 flex flex-wrap items-center justify-center gap-3">
        <Link href="/">
          <Button variant="default" className="rounded-full px-5">
            Go home
          </Button>
        </Link>
        <Link href="/analyze">
          <Button variant="outline" className="rounded-full px-5">
            Open analyzer
          </Button>
        </Link>
        <a href="#" rel="noopener noreferrer">
          <Button variant="ghost" className="rounded-full px-5 text-muted-foreground">
            Read docs
          </Button>
        </a>
      </div>

      {/* Quick links */}
      <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
        <span className="text-xs text-muted-foreground/60">Popular destinations</span>
        {QUICK_LINKS.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
