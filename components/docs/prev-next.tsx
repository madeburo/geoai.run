import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { type DocNavItem } from "@/lib/docs/navigation";

interface PrevNextProps {
  prev: DocNavItem | null;
  next: DocNavItem | null;
}

export function PrevNext({ prev, next }: PrevNextProps) {
  if (!prev && !next) return null;
  return (
    <div className="mt-12 flex items-center justify-between gap-4 border-t border-border/60 pt-8">
      {prev ? (
        <Link
          href={prev.href}
          className="group flex flex-col gap-1 rounded-lg border border-border/60 px-4 py-3 text-sm transition-colors hover:border-glow/30 hover:bg-glow/5 max-w-[48%]"
        >
          <span className="flex items-center gap-1 text-xs text-muted-foreground/60">
            <ChevronLeft className="size-3" />
            Previous
          </span>
          <span className="font-medium text-foreground/80 group-hover:text-foreground transition-colors line-clamp-1">
            {prev.title}
          </span>
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link
          href={next.href}
          className="group flex flex-col items-end gap-1 rounded-lg border border-border/60 px-4 py-3 text-sm transition-colors hover:border-glow/30 hover:bg-glow/5 max-w-[48%] ml-auto"
        >
          <span className="flex items-center gap-1 text-xs text-muted-foreground/60">
            Next
            <ChevronRight className="size-3" />
          </span>
          <span className="font-medium text-foreground/80 group-hover:text-foreground transition-colors line-clamp-1">
            {next.title}
          </span>
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
}
