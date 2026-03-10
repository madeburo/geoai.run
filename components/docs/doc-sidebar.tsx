"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { docsNavigation, flattenNav } from "@/lib/docs/navigation";

interface DocSidebarProps {
  onNavigate?: () => void;
}

export function DocSidebar({ onNavigate }: DocSidebarProps) {
  const pathname = usePathname();
  const [query, setQuery] = useState("");

  const allItems = useMemo(() => flattenNav(docsNavigation), []);

  const searchResults = useMemo(() => {
    if (!query.trim()) return null;
    const q = query.toLowerCase();
    return allItems.filter((item) => item.title.toLowerCase().includes(q));
  }, [query, allItems]);

  return (
    <nav className="w-full">
      {/* Search */}
      <div className="relative mb-5">
        <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/40" />
        <input
          type="text"
          placeholder="Search docs..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-md border border-border/60 bg-white/4 py-1.5 pl-8 pr-3 text-sm text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-glow/40 focus:bg-white/6 transition-colors"
        />
      </div>

      {/* Search results overlay */}
      {searchResults !== null ? (
        <ul className="space-y-0.5">
          {searchResults.length === 0 ? (
            <li className="px-3 py-2 text-xs text-muted-foreground/50">No results found</li>
          ) : (
            searchResults.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => { setQuery(""); onNavigate?.(); }}
                  className="flex items-center rounded-md px-3 py-1.5 text-sm text-foreground/60 hover:bg-white/5 hover:text-foreground transition-colors"
                >
                  {item.title}
                </Link>
              </li>
            ))
          )}
        </ul>
      ) : (
        /* Normal nav */
        <>
          {docsNavigation.map((section) => (
            <div key={section.title} className="mb-7">
              <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground/70">
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
                            ? "bg-glow/12 text-glow font-semibold border border-glow/20"
                            : "text-foreground/60 hover:bg-white/5 hover:text-foreground"
                        )}
                      >
                        <span>{item.title}</span>
                        {item.badge && (
                          <span
                            className={cn(
                              "rounded-sm px-1.5 py-px text-[9px] font-semibold uppercase tracking-wider",
                              item.badge === "soon"
                                ? "text-muted-foreground/40 border border-border/40"
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
        </>
      )}
    </nav>
  );
}
