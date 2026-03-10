import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { DocSidebar } from "@/components/docs/doc-sidebar";
import { MobileDocNav } from "@/components/docs/mobile-nav";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      {/* Mobile nav bar — shown below header on small screens */}
      <div className="sticky top-[57px] z-30 flex items-center gap-3 border-b border-border/60 bg-background/95 px-4 py-2 backdrop-blur-sm lg:hidden">
        <MobileDocNav />
        <span className="text-sm text-muted-foreground/50">Documentation</span>
      </div>

      <div className="mx-auto flex w-full max-w-[1400px] flex-1 px-4 sm:px-6">
        {/* Left sidebar */}
        <aside className="hidden lg:block w-60 xl:w-64 shrink-0">
          <div className="sticky top-[57px] h-[calc(100vh-57px)] overflow-y-auto py-8 pr-4 scrollbar-hide">
            <DocSidebar />
          </div>
        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1 py-8 lg:px-8 xl:px-12">
          {children}
        </main>
      </div>

      <Footer />
    </div>
  );
}
