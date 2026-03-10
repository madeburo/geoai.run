import { H1, H2, Lead, P, IC, UL, LI } from "@/components/docs/doc-heading";
import { Callout } from "@/components/docs/callout";
import { type TocItem } from "@/components/docs/doc-toc";
import Link from "next/link";

const toc: TocItem[] = [
  { id: "what-it-does", title: "What it does", level: 2 },
  { id: "how-to-use", title: "How to use", level: 2 },
  { id: "what-it-checks", title: "What it checks", level: 2 },
  { id: "scoring", title: "Scoring", level: 2 },
];

const content = (
  <article>
    <H1>Analyzer</H1>
    <Lead>
      The GEO AI Analyzer checks your site&apos;s AI search visibility and produces a score with
      actionable recommendations.
    </Lead>

    <div className="my-6">
      <Link
        href="/analyze"
        className="inline-flex items-center gap-2 rounded-lg border border-glow/25 bg-glow/5 px-4 py-2.5 text-sm font-medium text-glow transition-colors hover:border-glow/40 hover:bg-glow/10"
      >
        Open the Analyzer →
      </Link>
    </div>

    <Callout type="note" title="Early access">
      The Analyzer UI is live at <IC>/analyze</IC>. Full backend scoring is in active development.
    </Callout>

    <H2 id="what-it-does">What it does</H2>
    <P>
      Enter any URL and the Analyzer fetches the page, inspects its AI optimization signals, and
      returns a visibility score from 0 to 100 with a breakdown by category.
    </P>

    <H2 id="how-to-use">How to use</H2>
    <UL>
      <LI>
        Go to <Link href="/analyze" className="text-glow hover:underline">/analyze</Link>
      </LI>
      <LI>Enter your site URL</LI>
      <LI>Click Analyze — results appear in seconds</LI>
      <LI>Review the score breakdown and follow the recommendations</LI>
    </UL>

    <H2 id="what-it-checks">What it checks</H2>
    <P>The Analyzer inspects four signal categories:</P>
    <UL>
      <LI>
        <strong className="text-foreground">llms.txt</strong> — is the file present, valid, and
        well-structured?
      </LI>
      <LI>
        <strong className="text-foreground">AI metadata</strong> — are the meta tags and Link
        header present?
      </LI>
      <LI>
        <strong className="text-foreground">Crawler rules</strong> — are AI bots allowed in
        robots.txt?
      </LI>
      <LI>
        <strong className="text-foreground">Structured signals</strong> — is JSON-LD Schema.org
        markup present and valid?
      </LI>
    </UL>

    <H2 id="scoring">Scoring</H2>
    <P>
      Each category contributes to the overall score. A site with all four pillars fully
      implemented scores 100. Missing or malformed signals reduce the score proportionally.
    </P>
    <P>
      See the{" "}
      <Link href="/docs/analyzer/scoring" className="text-glow hover:underline">
        Scoring
      </Link>{" "}
      and{" "}
      <Link href="/docs/analyzer/recommendations" className="text-glow hover:underline">
        Recommendations
      </Link>{" "}
      pages for the full breakdown.
    </P>
  </article>
);

export const AnalyzerPage = { content, toc };
