import { H1, H2, Lead, P, IC, UL, LI, DocTable, THead, TBody, TR, TH, TD } from "@/components/docs/doc-heading";
import { Callout } from "@/components/docs/callout";
import { CodeBlock } from "@/components/docs/code-block";
import { type TocItem } from "@/components/docs/doc-toc";

const toc: TocItem[] = [
  { id: "critical-fields", title: "Critical fields", level: 2 },
  { id: "non-critical-fields", title: "Non-critical fields", level: 2 },
  { id: "complete-example", title: "Complete example", level: 2 },
  { id: "analyzer-checks", title: "Analyzer checks", level: 2 },
  { id: "common-mistakes", title: "Common mistakes", level: 2 },
];

const content = (
  <article>
    <H1>AI Metadata Specification</H1>
    <Lead>
      The set of <IC>{"<head>"}</IC> tags that tell AI search engines what your page is about —
      four critical fields that determine your metadata score, plus nine supplemental fields that
      improve context and social sharing.
    </Lead>

    <H2 id="critical-fields">Critical fields</H2>
    <P>
      The Analyzer evaluates four tags as critical. All four must be present for a{" "}
      <IC>pass</IC> status. Missing any one of them produces a <IC>warn</IC>; missing all four
      produces a <IC>fail</IC>.
    </P>
    <DocTable>
      <THead>
        <TR>
          <TH>Field</TH>
          <TH>Selector</TH>
          <TH>Criticality</TH>
          <TH>Purpose</TH>
        </TR>
      </THead>
      <TBody>
        <TR>
          <TD>Page title</TD>
          <TD mono>title</TD>
          <TD>Critical</TD>
          <TD>Primary label used by AI engines to identify and cite the page</TD>
        </TR>
        <TR>
          <TD>Meta description</TD>
          <TD mono>{`meta[name="description"]`}</TD>
          <TD>Critical</TD>
          <TD>Plain-text summary used in AI-generated answers and search snippets</TD>
        </TR>
        <TR>
          <TD>OG title</TD>
          <TD mono>{`meta[property="og:title"]`}</TD>
          <TD>Critical</TD>
          <TD>Open Graph title — used by AI crawlers that parse OG data for page context</TD>
        </TR>
        <TR>
          <TD>OG description</TD>
          <TD mono>{`meta[property="og:description"]`}</TD>
          <TD>Critical</TD>
          <TD>Open Graph description — reinforces the meta description for OG-aware crawlers</TD>
        </TR>
      </TBody>
    </DocTable>
    <Callout type="note" title="Why Open Graph tags are critical">
      Many AI crawlers parse Open Graph metadata in addition to standard HTML meta tags. A page
      with a <IC>{"<title>"}</IC> and <IC>{`meta[name="description"]`}</IC> but no OG equivalents
      will still receive a <IC>warn</IC> from the Analyzer.
    </Callout>

    <H2 id="non-critical-fields">Non-critical fields</H2>
    <P>
      The nine non-critical fields do not affect the <IC>CheckStatus</IC> result, but missing
      them is reported as low-severity issues. They improve how AI engines and social platforms
      represent your content.
    </P>
    <DocTable>
      <THead>
        <TR>
          <TH>Field</TH>
          <TH>Selector</TH>
          <TH>Criticality</TH>
          <TH>Purpose</TH>
        </TR>
      </THead>
      <TBody>
        <TR>
          <TD>Canonical URL</TD>
          <TD mono>{`link[rel="canonical"]`}</TD>
          <TD>Non-critical</TD>
          <TD>Prevents duplicate-content issues by declaring the authoritative URL</TD>
        </TR>
        <TR>
          <TD>Robots directive</TD>
          <TD mono>{`meta[name="robots"]`}</TD>
          <TD>Non-critical</TD>
          <TD>Controls indexing and following behavior for all crawlers</TD>
        </TR>
        <TR>
          <TD>OG URL</TD>
          <TD mono>{`meta[property="og:url"]`}</TD>
          <TD>Non-critical</TD>
          <TD>Canonical URL for Open Graph — used when the page is shared or cited</TD>
        </TR>
        <TR>
          <TD>OG type</TD>
          <TD mono>{`meta[property="og:type"]`}</TD>
          <TD>Non-critical</TD>
          <TD>Content type hint (website, article, product) for OG-aware consumers</TD>
        </TR>
        <TR>
          <TD>OG image</TD>
          <TD mono>{`meta[property="og:image"]`}</TD>
          <TD>Non-critical</TD>
          <TD>Preview image used in social shares and AI-generated rich results</TD>
        </TR>
        <TR>
          <TD>Twitter card</TD>
          <TD mono>{`meta[name="twitter:card"]`}</TD>
          <TD>Non-critical</TD>
          <TD>Card format for Twitter/X previews (summary, summary_large_image, etc.)</TD>
        </TR>
        <TR>
          <TD>Twitter title</TD>
          <TD mono>{`meta[name="twitter:title"]`}</TD>
          <TD>Non-critical</TD>
          <TD>Title override for Twitter/X card display</TD>
        </TR>
        <TR>
          <TD>Twitter description</TD>
          <TD mono>{`meta[name="twitter:description"]`}</TD>
          <TD>Non-critical</TD>
          <TD>Description override for Twitter/X card display</TD>
        </TR>
        <TR>
          <TD>Twitter image</TD>
          <TD mono>{`meta[name="twitter:image"]`}</TD>
          <TD>Non-critical</TD>
          <TD>Image override for Twitter/X card display</TD>
        </TR>
      </TBody>
    </DocTable>

    <H2 id="complete-example">Complete example</H2>
    <P>
      The following <IC>{"<head>"}</IC> block includes all thirteen fields — four critical and
      nine non-critical — populated with realistic values.
    </P>
    <CodeBlock
      filename="index.html"
      language="html"
      code={`<head>
  <!-- Critical fields -->
  <title>Widget Pro — Professional-Grade Widgets</title>
  <meta name="description" content="Widget Pro is the fastest, most reliable widget for modern development teams. Free shipping on orders over $50." />
  <meta property="og:title" content="Widget Pro — Professional-Grade Widgets" />
  <meta property="og:description" content="Widget Pro is the fastest, most reliable widget for modern development teams. Free shipping on orders over $50." />

  <!-- Non-critical fields -->
  <link rel="canonical" href="https://example.com/products/widget-pro" />
  <meta name="robots" content="index, follow" />
  <meta property="og:url" content="https://example.com/products/widget-pro" />
  <meta property="og:type" content="product" />
  <meta property="og:image" content="https://example.com/images/widget-pro-og.jpg" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Widget Pro — Professional-Grade Widgets" />
  <meta name="twitter:description" content="The fastest, most reliable widget for modern development teams." />
  <meta name="twitter:image" content="https://example.com/images/widget-pro-twitter.jpg" />
</head>`}
    />
    <Callout type="tip" title="Keep title and OG title in sync">
      The <IC>{"<title>"}</IC> and <IC>{`meta[property="og:title"]`}</IC> values do not need to
      be identical, but they should describe the same page. Significant divergence can confuse AI
      engines that compare both fields.
    </Callout>

    <H2 id="analyzer-checks">Analyzer checks</H2>
    <P>
      The <IC>checkMetadata</IC> function parses the homepage HTML using Cheerio and evaluates
      the presence of the four critical tags:
    </P>
    <DocTable>
      <THead>
        <TR>
          <TH>Condition</TH>
          <TH>Status</TH>
          <TH>Recommendation code</TH>
        </TR>
      </THead>
      <TBody>
        <TR>
          <TD>All four critical tags present</TD>
          <TD mono>pass</TD>
          <TD>—</TD>
        </TR>
        <TR>
          <TD>At least one critical tag present, but not all four</TD>
          <TD mono>warn</TD>
          <TD mono>COMPLETE_CRITICAL_METADATA</TD>
        </TR>
        <TR>
          <TD>All four critical tags absent</TD>
          <TD mono>fail</TD>
          <TD mono>ADD_CRITICAL_METADATA</TD>
        </TR>
        <TR>
          <TD>Empty or unparseable HTML</TD>
          <TD mono>unknown</TD>
          <TD>—</TD>
        </TR>
      </TBody>
    </DocTable>
    <P>
      Non-critical tag gaps are reported as low-severity issues and may trigger the{" "}
      <IC>IMPROVE_SUPPLEMENTAL_METADATA</IC> recommendation when the overall status is{" "}
      <IC>warn</IC>, but they do not change the <IC>CheckStatus</IC> value.
    </P>

    <H2 id="common-mistakes">Common mistakes</H2>
    <UL>
      <LI>
        <strong>Missing OG tags on pages that have a title and description.</strong> A page with{" "}
        <IC>{"<title>"}</IC> and <IC>{`meta[name="description"]`}</IC> but no{" "}
        <IC>{`meta[property="og:title"]`}</IC> or <IC>{`meta[property="og:description"]`}</IC>{" "}
        still returns <IC>warn</IC>. All four critical tags must be present.
      </LI>
      <LI>
        <strong>Empty content attributes.</strong> A tag like{" "}
        <IC>{`<meta name="description" content="">`}</IC> is present in the DOM but has no value.
        The Analyzer treats an empty <IC>content</IC> attribute as absent and counts it as a
        missing field.
      </LI>
      <LI>
        <strong>Duplicate tags with conflicting values.</strong> Some CMS plugins inject a second{" "}
        <IC>{"<title>"}</IC> or <IC>{`meta[name="description"]`}</IC>. Cheerio selects the first
        occurrence; if the first tag is empty and the second has content, the Analyzer will still
        report the field as missing.
      </LI>
      <LI>
        <strong>Metadata injected only by JavaScript.</strong> The Analyzer fetches raw HTML
        before any client-side rendering. Tags added by React, Vue, or other frameworks after
        hydration are not visible to the checker. Use server-side rendering or static generation
        to ensure tags are present in the initial HTML response.
      </LI>
      <LI>
        <strong>No <IC>{"<head>"}</IC> element.</strong> If the HTML response has no{" "}
        <IC>{"<head>"}</IC> element — for example, a bare JSON response or a redirect page — the
        Analyzer returns <IC>unknown</IC> and cannot evaluate any metadata fields.
      </LI>
    </UL>
  </article>
);

export const SpecAiMetadataPage = { content, toc };
