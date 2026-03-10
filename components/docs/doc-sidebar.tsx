"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { docsNavigation } from "@/lib/docs/navigation";

interface DocSidebarProps {
  onNavigate?: () => void;
}

export function DocSidebar({ onNavigate }: DocSidebarProps) {
  const pathname = usePathname();

  return (
    <nav className="w-full">
      {docsNavigation.map((section) => (
        <div key={section.title} className="mb-6">
          <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/50">
            {section.title}
          </p>
          <ul className="space-y-0.5">
            {section.items.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    className={cn(
                      "group flex items-center justify-between rounded-md px-3 py-1.5 text-sm transition-colors",
                      isActive
                        ? "bg-glow/10 text-glow font-medium"
                        : "text-muted-foreground hover:bg-white/4 hover:text-foreground"
                    )}
                  >
                    <span>{item.title}</span>
                    {item.badge && (
                      <span
                        className={cn(
                          "rounded px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide",
                          item.badge === "soon"
                            ? "bg-white/6 text-muted-foreground/60"
                            : "bg-glow/15 text-glow"
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
