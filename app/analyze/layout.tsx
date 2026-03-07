import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Search Analyzer — GEO AI",
  description:
    "Check how visible your website is to AI search engines like ChatGPT, Claude, Gemini, and Perplexity.",
  alternates: {
    canonical: "https://www.geoai.run/analyze",
  },
  openGraph: {
    title: "AI Search Analyzer — GEO AI",
    description:
      "Check how visible your website is to AI search engines like ChatGPT, Claude, Gemini, and Perplexity.",
    type: "website",
    url: "https://www.geoai.run/analyze",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "GEO AI — AI Search Analyzer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Search Analyzer — GEO AI",
    description:
      "Check how visible your website is to AI search engines like ChatGPT, Claude, Gemini, and Perplexity.",
    images: ["/og.png"],
  },
};

export default function AnalyzeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
