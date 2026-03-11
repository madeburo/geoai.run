import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GEO AI CLI — Command-Line Tool",
  description:
    "Generate and validate llms.txt / llms-full.txt from the command line. Works with any Node.js project.",
};

export default function CliLayout({ children }: { children: React.ReactNode }) {
  return children;
}
