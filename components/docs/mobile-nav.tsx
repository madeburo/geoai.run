"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { DocSidebar } from "./doc-sidebar";
import { cn } from "@/lib/utils";

export function MobileDocNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-md border border-border/60 px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground lg:hidden"
        aria-label="Open navigation"
      >
        <Menu className="size-4" />
        <span>Menu</span>
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 overflow-y-auto bg-background border-r border-border/60 p-6 transition-transform duration-300 lg:hidden",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="mb-6 flex items-center justify-between">
          <span className="text-sm font-semibold text-foreground">Documentation</span>
          <button
            onClick={() => setOpen(false)}
            className="rounded-md p-1 text-muted-foreground hover:text-foreground"
            aria-label="Close navigation"
          >
            <X className="size-4" />
          </button>
        </div>
        <DocSidebar onNavigate={() => setOpen(false)} />
      </div>
    </>
  );
}
