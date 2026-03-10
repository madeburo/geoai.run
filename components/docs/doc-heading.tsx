import { cn } from "@/lib/utils";

interface HeadingProps {
  id?: string;
  className?: string;
  children: React.ReactNode;
}

export function H1({ id, className, children }: HeadingProps) {
  return (
    <h1
      id={id}
      className={cn("mb-3 scroll-mt-24 text-3xl font-bold tracking-tight text-foreground sm:text-4xl", className)}
    >
      {children}
    </h1>
  );
}

export function H2({ id, className, children }: HeadingProps) {
  return (
    <h2
      id={id}
      className={cn(
        "mb-4 mt-10 scroll-mt-24 border-b border-border/60 pb-2 text-xl font-bold tracking-tight text-foreground first:mt-0",
        className
      )}
    >
      {children}
    </h2>
  );
}

export function H3({ id, className, children }: HeadingProps) {
  return (
    <h3
      id={id}
      className={cn("mb-3 mt-7 scroll-mt-24 text-base font-semibold text-foreground", className)}
    >
      {children}
    </h3>
  );
}

export function Lead({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("mb-8 text-base leading-7 text-muted-foreground", className)}>{children}</p>
  );
}

export function P({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("my-4 leading-7 text-foreground/80", className)}>{children}</p>
  );
}

export function UL({ children }: { children: React.ReactNode }) {
  return <ul className="my-4 space-y-1.5 pl-5 text-foreground/80">{children}</ul>;
}

export function LI({ children }: { children: React.ReactNode }) {
  return (
    <li className="relative leading-7 before:absolute before:-left-4 before:text-glow before:content-['–']">
      {children}
    </li>
  );
}

export function IC({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded px-1.5 py-0.5 text-[0.875em] font-mono bg-white/6 text-glow border border-white/8">
      {children}
    </code>
  );
}

export function DocTable({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-6 overflow-x-auto rounded-lg border border-border/60">
      <table className="w-full text-sm">{children}</table>
    </div>
  );
}

export function THead({ children }: { children: React.ReactNode }) {
  return <thead className="border-b border-border/60 bg-white/2">{children}</thead>;
}

export function TBody({ children }: { children: React.ReactNode }) {
  return <tbody className="divide-y divide-border/40">{children}</tbody>;
}

export function TR({ children }: { children: React.ReactNode }) {
  return <tr>{children}</tr>;
}

export function TH({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground/60">
      {children}
    </th>
  );
}

export function TD({ children, mono }: { children: React.ReactNode; mono?: boolean }) {
  return (
    <td className={cn("px-4 py-2.5 text-foreground/75", mono && "font-mono text-xs text-glow")}>
      {children}
    </td>
  );
}
