"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="mb-3 text-2xl font-bold tracking-tight sm:text-3xl">
        Something went wrong
      </h1>
      <p className="mb-6 text-sm text-muted-foreground">
        An unexpected error occurred. Please try again.
      </p>
      <Button onClick={reset} variant="outline" className="rounded-full">
        Try again
      </Button>
    </div>
  );
}
