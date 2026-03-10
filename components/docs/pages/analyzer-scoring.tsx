import { H1, H2, Lead, P, IC, DocTable, THead, TBody, TR, TH, TD } from "@/components/docs/doc-heading";
import { type TocItem } from "@/components/docs/doc-toc";

const toc: TocItem[] = [
  { id: "score-breakdown", title: "Score breakdown", level: 2 },
  { id: "categories", title: "Categories", level: 2 },
  { id: "grade-scale", title: "Grade scale", level: 2 },
];

const content = (
  <article>
    <H1>Scoring</H1>
    <Lead>How the GEO AI Analyzer calculates your site&apos;s AI visibility score.</Lead>

    <H2 id="score-breakdown">Score breakdown</H2>
    <P>
      The overall score is a weighted sum of four signal categories. Each category is scored
      independently and contributes a portion of the total 100 points.
    </P>

    <DocTable>
      <THead>
        <TR>
          <TH>Category</TH>
          <TH>Weight</TH>
          <TH>What is checked</TH>
        </TR>
      </THead>
      <TBody>
        <TR>
          <TD>llms.txt</TD>
          <TD>35 pts</TD>
          <TD>File presence, valid format, content sections, llms-full.txt</TD>
        </TR>
        <TR>
          <TD>AI Metadata</TD>
          <TD>25 pts</TD>
          <TD>
            <IC>meta name=&quot;llms&quot;</IC>, <IC>meta name=&quot;llms-full&quot;</IC>, Link header
          </TD>
        </TR>
        <TR>
          <TD>Crawler Rules</TD>
          <TD>20 pts</TD>
          <TD>robots.txt presence, AI bot allow rules, no blanket disallow</TD>
        </TR>
        <TR>
          <TD>Structured Signals</TD>
          <TD>20 pts</TD>
          <TD>JSON-LD presence, schema type, required fields</TD>
        </TR>
      </TBody>
    </DocTable>

    <H2 id="categories">Categories</H2>

    <H2 id="grade-scale">Grade scale</H2>
    <DocTable>
      <THead>
        <TR>
          <TH>Score</TH>
          <TH>Grade</TH>
          <TH>Meaning</TH>
        </TR>
      </THead>
      <TBody>
        {[
          ["90–100", "A", "Excellent — fully optimized for AI search"],
          ["75–89", "B", "Good — minor gaps to address"],
          ["50–74", "C", "Fair — significant improvements available"],
          ["25–49", "D", "Poor — most signals missing"],
          ["0–24", "F", "Not optimized — no AI signals detected"],
        ].map(([range, grade, meaning]) => (
          <TR key={grade}>
            <TD mono>{range}</TD>
            <TD>{grade}</TD>
            <TD>{meaning}</TD>
          </TR>
        ))}
      </TBody>
    </DocTable>
  </article>
);

export const AnalyzerScoringPage = { content, toc };
