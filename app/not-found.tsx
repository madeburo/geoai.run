import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="mb-2 text-6xl font-bold tracking-tight sm:text-8xl">
        404
      </h1>
      <p className="mb-6 text-sm text-muted-foreground sm:text-base">
        Page not found. The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link href="/">
        <Button variant="outline" className="rounded-full">
          Back to home
        </Button>
      </Link>
    </div>
  );
}
