import { H1, H2, Lead, P, IC, UL, LI } from "@/components/docs/doc-heading";
import { Callout } from "@/components/docs/callout";
import { type TocItem } from "@/components/docs/doc-toc";

const toc: TocItem[] = [
  { id: "how-recs-work", title: "How recommendations work", level: 2 },
  { id: "llms-txt-recs", title: "llms.txt", level: 2 },
  { id: "metadata-recs", title: "AI metadata", level: 2 },
  { id: "crawler-recs", title: "Crawler rules", level: 2 },
  { id: "signals-recs", title: "Structured signals", level: 2 },
];

const content = (
  <article>
    <H1>Recommendations</H1>
    <Lead>
      Actionable fixes the Analyzer surfaces for each signal category.
    </Lead>

    <H2 id="how-recs-work">How recommendations work</H2>
    <P>
      After scoring your site, the Analyzer generates a prioritized list of recommendations — one
      per missing or malformed signal. Each recommendation includes a description of the issue, the
      expected fix, and a link to the relevant documentation.
    </P>
    <Callout type="tip">
      Fix the highest-weight categories first — llms.txt and AI metadata together account for 60%
      of the total score.
    </Callout>

    <H2 id="llms-txt-recs">llms.txt recommendations</H2>
    <UL>
      <LI>
        <strong className="text-foreground">Missing llms.txt</strong> — no file found at{" "}
        <IC>/llms.txt</IC>. Generate one with <IC>geo-ai-generate</IC> or{" "}
        <IC>createGeoAI().generateLlms()</IC>.
      </LI>
      <LI>
        <strong className="text-foreground">Invalid format</strong> — file exists but does not
        follow the llms.txt standard. Check that it starts with an H1 heading and uses the correct
        Markdown structure.
      </LI>
      <LI>
        <strong className="text-foreground">Missing llms-full.txt</strong> — the extended file is
        not present. Pass <IC>true</IC> to <IC>generateLlms()</IC> to generate it.
      </LI>
      <LI>
        <strong className="text-foreground">Empty sections</strong> — llms.txt has no resource
        entries. Add pages, products, or other content to your provider.
      </LI>
    </UL>

    <H2 id="metadata-recs">AI metadata recommendations</H2>
    <UL>
      <LI>
        <strong className="text-foreground">Missing meta tags</strong> — add{" "}
        <IC>meta name=&quot;llms&quot;</IC> and <IC>meta name=&quot;llms-full&quot;</IC> to your page head.
      </LI>
      <LI>
        <strong className="text-foreground">Missing Link header</strong> — add the{" "}
        <IC>Link: &lt;/llms.txt&gt;; rel=&quot;ai-content-index&quot;</IC> HTTP header. Use{" "}
        <IC>injectLinkHeader: true</IC> in the GEO AI middleware.
      </LI>
      <LI>
        <strong className="text-foreground">Broken meta tag URL</strong> — the URL in the meta tag
        returns a non-200 response. Verify your llms.txt is publicly accessible.
      </LI>
    </UL>

    <H2 id="crawler-recs">Crawler rules recommendations</H2>
    <UL>
      <LI>
        <strong className="text-foreground">No robots.txt</strong> — create a robots.txt file and
        add explicit allow rules for AI crawlers.
      </LI>
      <LI>
        <strong className="text-foreground">AI bots blocked</strong> — one or more AI crawlers are
        disallowed. Update your crawler config to allow the bots you want to index your site.
      </LI>
      <LI>
        <strong className="text-foreground">No explicit AI rules</strong> — robots.txt exists but
        has no AI-specific directives. Add them with <IC>geo.generateRobotsTxt()</IC>.
      </LI>
    </UL>

    <H2 id="signals-recs">Structured signals recommendations</H2>
    <UL>
      <LI>
        <strong className="text-foreground">No JSON-LD</strong> — no{" "}
        <IC>application/ld+json</IC> script found. Add Schema.org markup with{" "}
        <IC>geo.generateJsonLd()</IC>.
      </LI>
      <LI>
        <strong className="text-foreground">Missing required fields</strong> — JSON-LD is present
        but missing <IC>name</IC>, <IC>url</IC>, or <IC>description</IC>. Ensure your provider
        supplies these fields for all resources.
      </LI>
      <LI>
        <strong className="text-foreground">Unknown schema type</strong> — the{" "}
        <IC>@type</IC> is not recognized by AI search engines. Use <IC>WebSite</IC>,{" "}
        <IC>Product</IC>, or <IC>Article</IC>.
      </LI>
    </UL>
  </article>
);

export const AnalyzerRecommendationsPage = { content, toc };
