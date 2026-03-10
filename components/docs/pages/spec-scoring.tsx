import { H1, H2, Lead, P, IC, UL, LI, DocTable, THead, TBody, TR, TH, TD } from "@/components/docs/doc-heading";
import { Callout } from "@/components/docs/callout";
import { type TocItem } from "@/components/docs/doc-toc";

const toc: TocItem[] = [
  { id: "check-status-values", title: "Check status values", level: 2 },
  { id: "category-weights", title: "Category weights", level: 2 },
  { id: "score-formula", title: "Score formula", level: 2 },
  { id: "grade-scale", title: "Grade scale", level: 2 },
  { id: "interpretation", title: "Interpretation", level: 2 },
];

const content = (
  <article>
    <H1>Scoring Specification</H1>
    <Lead>
      How the Analyzer converts four category check results into a single overall score — the{" "}
      <IC>STATUS_SCORES</IC> mapping, equal category weights, the rounding formula, and the
      grade scale used to interpret the result.
    </Lead>

    <H2 id="check-status-values">Check status values</H2>
    <P>
      Every checker returns a <IC>CheckStatus</IC> value for its category. The Analyzer maps
      each status to a numeric score using the <IC>STATUS_SCORES</IC> constant defined in{" "}
      <IC>lib/analyzer/types.ts</IC>:
    </P>
    <DocTable>
      <THead>
        <TR>
          <TH>Status</TH>
          <TH>Score</TH>
          <TH>Meaning</TH>
        </TR>
      </THead>
      <TBody>
        <TR>
          <TD mono>pass</TD>
          <TD>100</TD>
          <TD>The category is fully implemented and meets all Analyzer criteria.</TD>
        </TR>
        <TR>
          <TD mono>warn</TD>
          <TD>65</TD>
          <TD>
            The category is partially implemented or has a recoverable issue (e.g. thin content,
            missing optional fields, or implicit rather than explicit configuration).
          </TD>
        </TR>
        <TR>
          <TD mono>fail</TD>
          <TD>20</TD>
          <TD>
            The category has a critical implementation error that actively harms AI visibility
            (e.g. all crawlers blocked, all critical metadata absent).
          </TD>
        </TR>
        <TR>
          <TD mono>not_found</TD>
          <TD>10</TD>
          <TD>
            The required resource was not found (HTTP 404). The category is not implemented.
          </TD>
        </TR>
        <TR>
          <TD mono>unknown</TD>
          <TD>40</TD>
          <TD>
            The Analyzer could not evaluate the category due to a network error or unparseable
            response. The score is penalized but less severely than a confirmed failure.
          </TD>
        </TR>
      </TBody>
    </DocTable>
    <Callout type="note" title="not_found scores lower than unknown">
      A <IC>not_found</IC> result (score 10) is penalized more heavily than <IC>unknown</IC>{" "}
      (score 40) because a 404 is a definitive signal that the resource does not exist, whereas{" "}
      <IC>unknown</IC> may reflect a transient network condition rather than a missing
      implementation.
    </Callout>

    <H2 id="category-weights">Category weights</H2>
    <P>
      The four <IC>AnalysisCategory</IC> values each contribute equally to the overall score.
      No category is weighted more heavily than another:
    </P>
    <DocTable>
      <THead>
        <TR>
          <TH>Category</TH>
          <TH>Weight</TH>
          <TH>Checker function</TH>
        </TR>
      </THead>
      <TBody>
        <TR>
          <TD mono>llmsTxt</TD>
          <TD>25%</TD>
          <TD mono>checkLlmsTxt</TD>
        </TR>
        <TR>
          <TD mono>aiMetadata</TD>
          <TD>25%</TD>
          <TD mono>checkMetadata</TD>
        </TR>
        <TR>
          <TD mono>crawlerRules</TD>
          <TD>25%</TD>
          <TD mono>checkCrawlerRules</TD>
        </TR>
        <TR>
          <TD mono>structuredSignals</TD>
          <TD>25%</TD>
          <TD mono>checkStructuredSignals</TD>
        </TR>
      </TBody>
    </DocTable>
    <Callout type="tip" title="llms.txt and AI metadata together account for 50%">
      Because each category contributes 25%, fixing <IC>llmsTxt</IC> and <IC>aiMetadata</IC>{" "}
      from <IC>not_found</IC> to <IC>pass</IC> adds up to 45 points to the overall score. These
      two categories are the highest-leverage starting point for most sites.
    </Callout>

    <H2 id="score-formula">Score formula</H2>
    <P>
      The <IC>calculateScore</IC> function in <IC>lib/analyzer/score.ts</IC> computes the
      overall score by averaging the four category scores and rounding to the nearest integer:
    </P>
    <P>
      <IC>overall = round((llmsTxt + aiMetadata + crawlerRules + structuredSignals) / 4)</IC>
    </P>
    <P>
      Each category score is the <IC>STATUS_SCORES</IC> value for that category&apos;s{" "}
      <IC>CheckStatus</IC>. The result is a whole number between 0 and 100 inclusive.
    </P>
    <Callout type="note" title="Rounding uses standard half-up rounding">
      JavaScript&apos;s <IC>Math.round()</IC> rounds 0.5 up. A score of 48.75 rounds to 49; a
      score of 48.5 rounds to 49; a score of 48.25 rounds to 48.
    </Callout>

    <H2 id="grade-scale">Grade scale</H2>
    <P>
      The Analyzer maps the overall score to a grade label for display in reports and the
      analyzer UI:
    </P>
    <DocTable>
      <THead>
        <TR>
          <TH>Score range</TH>
          <TH>Grade</TH>
          <TH>Interpretation</TH>
        </TR>
      </THead>
      <TBody>
        <TR>
          <TD>90–100</TD>
          <TD>Excellent</TD>
          <TD>All four layers are implemented and passing. The site is fully GEO-ready.</TD>
        </TR>
        <TR>
          <TD>75–89</TD>
          <TD>Good</TD>
          <TD>
            Most layers are passing. One or two categories have minor issues or are returning{" "}
            <IC>warn</IC>.
          </TD>
        </TR>
        <TR>
          <TD>50–74</TD>
          <TD>Fair</TD>
          <TD>
            Some layers are implemented but others are missing or failing. Meaningful
            improvements are available.
          </TD>
        </TR>
        <TR>
          <TD>25–49</TD>
          <TD>Poor</TD>
          <TD>
            Most layers are missing or failing. The site has limited AI search visibility.
          </TD>
        </TR>
        <TR>
          <TD>0–24</TD>
          <TD>Not optimized</TD>
          <TD>
            No layers are implemented, or critical failures exist across multiple categories.
            The site is not visible to AI search engines.
          </TD>
        </TR>
      </TBody>
    </DocTable>

    <H2 id="interpretation">Interpretation</H2>
    <P>
      The overall score is a composite signal, not a precise measurement. Use it to track
      progress over time and to prioritize which categories to address first.
    </P>
    <UL>
      <LI>
        <strong>Excellent (90–100).</strong> All four categories are passing. The site exposes
        an <IC>llms.txt</IC> file, complete AI metadata, explicit AI crawler rules, and valid
        structured data. No high-priority recommendations are expected.
      </LI>
      <LI>
        <strong>Good (75–89).</strong> The site has implemented most of the specification. A
        score in this range typically means one category is returning <IC>warn</IC> — for
        example, an <IC>llms.txt</IC> file exists but has thin content, or structured data is
        present as microdata rather than JSON-LD. Address the <IC>warn</IC> category to reach
        Excellent.
      </LI>
      <LI>
        <strong>Fair (50–74).</strong> Two or more categories are returning <IC>warn</IC> or{" "}
        <IC>not_found</IC>. The site has partial AI optimization. Prioritize the categories
        with the lowest scores — <IC>not_found</IC> (10) and <IC>fail</IC> (20) have the most
        room for improvement.
      </LI>
      <LI>
        <strong>Poor (25–49).</strong> Most categories are missing or failing. The site is
        unlikely to appear in AI-generated answers. Start with <IC>llmsTxt</IC> and{" "}
        <IC>aiMetadata</IC> — together they account for 50% of the score and are typically the
        fastest to implement.
      </LI>
      <LI>
        <strong>Not optimized (0–24).</strong> No meaningful AI optimization is in place, or
        one or more categories are actively blocking AI access (e.g. all crawlers blocked via{" "}
        <IC>robots.txt</IC>). Fix any <IC>fail</IC> conditions first, then address{" "}
        <IC>not_found</IC> categories.
      </LI>
    </UL>
    <Callout type="warning" title="A high score does not guarantee AI citation">
      The Analyzer measures implementation completeness against the GEO Specification. It does
      not measure whether AI engines have actually indexed your site or whether your content
      appears in AI-generated answers. Those outcomes depend on content quality, crawl
      frequency, and AI engine behavior outside the scope of this specification.
    </Callout>
  </article>
);

export const SpecScoringPage = { content, toc };
