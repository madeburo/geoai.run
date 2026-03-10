import { H1, H2, H3, Lead, P, IC, UL, LI, DocTable, THead, TBody, TR, TH, TD } from "@/components/docs/doc-heading";
import { Callout } from "@/components/docs/callout";
import { type TocItem } from "@/components/docs/doc-toc";

const toc: TocItem[] = [
  { id: "recommendation-interface", title: "Recommendation interface", level: 2 },
  { id: "recommendation-codes", title: "Recommendation codes", level: 2 },
  { id: "prioritization", title: "Prioritization", level: 2 },
];

const content = (
  <article>
    <H1>Recommendations Specification</H1>
    <Lead>
      How the Analyzer generates, categorizes, and surfaces actionable recommendations — the{" "}
      <IC>Recommendation</IC> interface, all 15 recommendation codes grouped by category, and
      guidance on which fixes to tackle first.
    </Lead>

    <H2 id="recommendation-interface">Recommendation interface</H2>
    <P>
      Each checker emits zero or more <IC>Recommendation</IC> objects. The Analyzer aggregates
      them into the <IC>AIReadinessReport.recommendations</IC> array. The interface is defined
      in <IC>lib/analyzer/types.ts</IC>:
    </P>
    <DocTable>
      <THead>
        <TR>
          <TH>Field</TH>
          <TH>Type</TH>
          <TH>Description</TH>
        </TR>
      </THead>
      <TBody>
        <TR>
          <TD mono>code</TD>
          <TD mono>string</TD>
          <TD>
            A stable, uppercase snake_case identifier for the recommendation (e.g.{" "}
            <IC>ADD_LLMS_TXT</IC>). Use this field to programmatically identify and act on
            specific recommendations.
          </TD>
        </TR>
        <TR>
          <TD mono>category</TD>
          <TD mono>AnalysisCategory</TD>
          <TD>
            The analysis category that produced this recommendation:{" "}
            <IC>llmsTxt</IC>, <IC>aiMetadata</IC>, <IC>crawlerRules</IC>, or{" "}
            <IC>structuredSignals</IC>.
          </TD>
        </TR>
        <TR>
          <TD mono>title</TD>
          <TD mono>string</TD>
          <TD>
            A short, human-readable title suitable for display in a report or UI (e.g.{" "}
            &ldquo;Create an llms.txt file&rdquo;).
          </TD>
        </TR>
        <TR>
          <TD mono>description</TD>
          <TD mono>string</TD>
          <TD>
            A detailed explanation of the issue and the corrective action to take. May include
            URLs, field names, or implementation guidance.
          </TD>
        </TR>
      </TBody>
    </DocTable>
    <Callout type="note" title="Recommendations are per-category">
      Each checker independently decides which recommendations to emit based on its own check
      result. A single analysis run can produce zero recommendations (all categories passing)
      or up to several recommendations if multiple categories have issues.
    </Callout>

    <H2 id="recommendation-codes">Recommendation codes</H2>
    <P>
      The following 15 codes are emitted by the four checkers. Codes are grouped by{" "}
      <IC>AnalysisCategory</IC>.
    </P>

    <H3>llmsTxt</H3>
    <DocTable>
      <THead>
        <TR>
          <TH>Code</TH>
          <TH>Trigger condition</TH>
        </TR>
      </THead>
      <TBody>
        <TR>
          <TD mono>ADD_LLMS_TXT</TD>
          <TD>
            <IC>/llms.txt</IC> returns HTTP 404. The file does not exist.
          </TD>
        </TR>
        <TR>
          <TD mono>POPULATE_LLMS_TXT</TD>
          <TD>
            <IC>/llms.txt</IC> returns HTTP 200 but the response body is empty.
          </TD>
        </TR>
        <TR>
          <TD mono>FIX_LLMS_TXT_CONTENT_TYPE</TD>
          <TD>
            <IC>/llms.txt</IC> is served with a non-text content type (not{" "}
            <IC>text/*</IC> or JSON).
          </TD>
        </TR>
        <TR>
          <TD mono>IMPROVE_LLMS_TXT</TD>
          <TD>
            <IC>/llms.txt</IC> body is fewer than 100 characters, or contains no informative
            signals (no URLs, paths, or site description pattern).
          </TD>
        </TR>
        <TR>
          <TD mono>FIX_LLMS_TXT_ACCESS</TD>
          <TD>
            <IC>/llms.txt</IC> returns an unexpected HTTP status other than 200 or 404 (e.g.
            403, 500).
          </TD>
        </TR>
      </TBody>
    </DocTable>

    <H3>aiMetadata</H3>
    <DocTable>
      <THead>
        <TR>
          <TH>Code</TH>
          <TH>Trigger condition</TH>
        </TR>
      </THead>
      <TBody>
        <TR>
          <TD mono>COMPLETE_CRITICAL_METADATA</TD>
          <TD>
            At least one critical tag is present but one or more are missing (partial{" "}
            <IC>warn</IC> state).
          </TD>
        </TR>
        <TR>
          <TD mono>ADD_CRITICAL_METADATA</TD>
          <TD>
            All four critical tags (<IC>&lt;title&gt;</IC>,{" "}
            <IC>meta[name=&quot;description&quot;]</IC>,{" "}
            <IC>meta[property=&quot;og:title&quot;]</IC>,{" "}
            <IC>meta[property=&quot;og:description&quot;]</IC>) are absent (<IC>fail</IC>{" "}
            state).
          </TD>
        </TR>
        <TR>
          <TD mono>IMPROVE_SUPPLEMENTAL_METADATA</TD>
          <TD>
            One or more non-critical tags are missing and the overall status is{" "}
            <IC>warn</IC>. Emitted alongside <IC>COMPLETE_CRITICAL_METADATA</IC> when
            applicable.
          </TD>
        </TR>
      </TBody>
    </DocTable>

    <H3>crawlerRules</H3>
    <DocTable>
      <THead>
        <TR>
          <TH>Code</TH>
          <TH>Trigger condition</TH>
        </TR>
      </THead>
      <TBody>
        <TR>
          <TD mono>ADD_ROBOTS_TXT</TD>
          <TD>
            <IC>/robots.txt</IC> returns HTTP 404. No crawler rules are in place.
          </TD>
        </TR>
        <TR>
          <TD mono>ALLOW_AI_CRAWLERS</TD>
          <TD>
            A global <IC>Disallow: /</IC> rule exists, or all 10 AI crawlers are explicitly
            blocked (<IC>fail</IC> state).
          </TD>
        </TR>
        <TR>
          <TD mono>REVIEW_AI_CRAWLER_ACCESS</TD>
          <TD>
            A majority of AI crawlers (≥6 of 10) are blocked, or ≥5 are unspecified and ≥1
            is blocked (<IC>warn</IC> state).
          </TD>
        </TR>
      </TBody>
    </DocTable>

    <H3>structuredSignals</H3>
    <DocTable>
      <THead>
        <TR>
          <TH>Code</TH>
          <TH>Trigger condition</TH>
        </TR>
      </THead>
      <TBody>
        <TR>
          <TD mono>ADD_JSONLD</TD>
          <TD>
            No JSON-LD blocks found, but microdata or RDFa markup is present on the page.
          </TD>
        </TR>
        <TR>
          <TD mono>ADD_STRUCTURED_DATA</TD>
          <TD>
            No structured data markup of any kind (JSON-LD, microdata, RDFa) is found.
            Emitted in both <IC>warn</IC> (sitemap present) and <IC>fail</IC> (no sitemap)
            states.
          </TD>
        </TR>
        <TR>
          <TD mono>ADD_SITEMAP</TD>
          <TD>
            No structured data markup and no valid <IC>/sitemap.xml</IC> found (<IC>fail</IC>{" "}
            state only).
          </TD>
        </TR>
        <TR>
          <TD mono>FIX_INVALID_JSONLD</TD>
          <TD>
            One or more <IC>&lt;script type=&quot;application/ld+json&quot;&gt;</IC> blocks
            contain invalid JSON that cannot be parsed.
          </TD>
        </TR>
      </TBody>
    </DocTable>

    <H2 id="prioritization">Prioritization</H2>
    <P>
      Because each <IC>AnalysisCategory</IC> contributes equally (25%) to the overall score,
      fixing a category from <IC>not_found</IC> (10 points) to <IC>pass</IC> (100 points)
      adds 22.5 points to the overall score. The order in which you address recommendations
      affects how quickly your score improves.
    </P>
    <UL>
      <LI>
        <strong>Start with llmsTxt and aiMetadata.</strong> Together they account for 50% of
        the score. Both are typically fast to implement — an <IC>llms.txt</IC> file and a
        complete <IC>&lt;head&gt;</IC> can be added in minutes. Address{" "}
        <IC>ADD_LLMS_TXT</IC> and <IC>ADD_CRITICAL_METADATA</IC> first.
      </LI>
      <LI>
        <strong>Fix fail conditions before warn conditions.</strong> A <IC>fail</IC> result
        scores 20 points; a <IC>warn</IC> result scores 65 points. Moving from <IC>fail</IC>{" "}
        to <IC>pass</IC> gains 80 points in that category; moving from <IC>warn</IC> to{" "}
        <IC>pass</IC> gains only 35. Prioritize <IC>ALLOW_AI_CRAWLERS</IC> and{" "}
        <IC>ADD_CRITICAL_METADATA</IC> over <IC>REVIEW_AI_CRAWLER_ACCESS</IC> or{" "}
        <IC>IMPROVE_LLMS_TXT</IC>.
      </LI>
      <LI>
        <strong>Address not_found before unknown.</strong> A <IC>not_found</IC> result (10
        points) scores lower than <IC>unknown</IC> (40 points) because a 404 is a definitive
        signal that the resource is absent. Fix <IC>ADD_LLMS_TXT</IC>,{" "}
        <IC>ADD_ROBOTS_TXT</IC>, and <IC>ADD_STRUCTURED_DATA</IC> before investigating
        transient network issues.
      </LI>
      <LI>
        <strong>Supplemental improvements last.</strong> Recommendations like{" "}
        <IC>IMPROVE_SUPPLEMENTAL_METADATA</IC>, <IC>ADD_JSONLD</IC>, and{" "}
        <IC>IMPROVE_LLMS_TXT</IC> refine an already-partial implementation. Address them
        after all <IC>fail</IC> and <IC>not_found</IC> conditions are resolved.
      </LI>
    </UL>
    <Callout type="tip" title="Use recommendation codes to automate fixes">
      GEO AI packages (<IC>@geo-ai/core</IC>, <IC>@geo-ai/next</IC>, etc.) generate the
      artifacts that resolve these recommendations. If your report contains{" "}
      <IC>ADD_LLMS_TXT</IC>, run the GEO AI generator to produce a compliant{" "}
      <IC>llms.txt</IC>. If it contains <IC>ADD_JSONLD</IC>, use the structured data
      generator to emit the correct JSON-LD blocks.
    </Callout>
  </article>
);

export const SpecRecommendationsPage = { content, toc };
