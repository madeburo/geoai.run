import { H1, H2, Lead, P, IC, UL, LI, DocTable, THead, TBody, TR, TH, TD } from "@/components/docs/doc-heading";
import { Callout } from "@/components/docs/callout";
import { CodeBlock } from "@/components/docs/code-block";
import { type TocItem } from "@/components/docs/doc-toc";

const toc: TocItem[] = [
  { id: "location-and-format", title: "Location and format", level: 2 },
  { id: "concise-form", title: "Concise form (llms.txt)", level: 2 },
  { id: "extended-form", title: "Extended form (llms-full.txt)", level: 2 },
  { id: "required-fields", title: "Required and optional fields", level: 2 },
  { id: "analyzer-checks", title: "Analyzer checks", level: 2 },
  { id: "common-mistakes", title: "Common mistakes", level: 2 },
];

const content = (
  <article>
    <H1>llms.txt Specification</H1>
    <Lead>
      The plain-text file at <IC>/llms.txt</IC> that gives AI crawlers a structured, Markdown-formatted
      index of your site — titles, URLs, and descriptions designed for LLM consumption.
    </Lead>

    <H2 id="location-and-format">Location and format</H2>
    <P>
      The file must be served at <IC>{"{origin}/llms.txt"}</IC> — for example,{" "}
      <IC>https://example.com/llms.txt</IC>. An optional extended form at{" "}
      <IC>{"{origin}/llms-full.txt"}</IC> provides full page content for deep indexing.
    </P>
    <P>
      Both files must be served with a <IC>text/plain</IC> content type. The format is Markdown:
      an H1 site name, a blockquote description, H2 section headings, and list items in{" "}
      <IC>[Title](url): description</IC> format.
    </P>
    <Callout type="note" title="Why text/plain?">
      AI crawlers parse <IC>llms.txt</IC> as raw text. Serving it as <IC>text/html</IC> or{" "}
      <IC>application/octet-stream</IC> causes some crawlers to skip or misparse the file.
    </Callout>

    <H2 id="concise-form">Concise form (llms.txt)</H2>
    <P>
      The concise form provides a lightweight index: one line per resource with a title, URL, and
      short description. AI crawlers fetch this first for a quick overview of your site.
    </P>
    <CodeBlock
      filename="/llms.txt"
      code={`# Example Site

> Example Site helps developers build faster with modern tooling and open-source libraries.

## Pages

- [Home](https://example.com/): Welcome to Example Site
- [About](https://example.com/about): Our story, mission, and team
- [Contact](https://example.com/contact): Get in touch with us

## Products

- [Widget Pro](https://example.com/products/widget-pro): Professional-grade widget — $29.99
- [Widget Lite](https://example.com/products/widget-lite): Entry-level widget — $9.99

## Blog

- [Getting Started](https://example.com/blog/getting-started): How to set up Widget Pro in five minutes
- [Advanced Configuration](https://example.com/blog/advanced-config): Fine-tuning Widget Pro for production`}
    />

    <H2 id="extended-form">Extended form (llms-full.txt)</H2>
    <P>
      The extended form includes full content for each resource. For products this means pricing,
      availability, and variant details. For pages and articles it means the full body text. AI
      crawlers fetch <IC>llms-full.txt</IC> when they need richer context — for example, to answer
      a product question or summarize an article.
    </P>
    <CodeBlock
      filename="/llms-full.txt"
      code={`# Example Site

> Example Site helps developers build faster with modern tooling and open-source libraries.

## Pages

- [Home](https://example.com/): Welcome to Example Site
- [About](https://example.com/about): Our story, mission, and team

## Products

### Widget Pro

URL: https://example.com/products/widget-pro
Price: $29.99
Available: true
Category: Widgets

Our flagship widget. Built for professionals who need reliability and performance.
Available in three sizes with free shipping on orders over $50.

Variants:
- Small — $24.99 — In stock
- Medium — $29.99 — In stock
- Large — $34.99 — Low stock

## Blog

### Getting Started

URL: https://example.com/blog/getting-started
Author: Jane Smith
Published: 2024-11-01

This guide walks you through setting up Widget Pro in a fresh project. You will need
Node.js 18 or later and a package manager of your choice.

Step 1: Install the package
Step 2: Configure your environment
Step 3: Run the development server`}
    />

    <H2 id="required-fields">Required and optional fields</H2>
    <P>
      The concise form has two required structural elements and one optional extended section.
    </P>
    <DocTable>
      <THead>
        <TR>
          <TH>Element</TH>
          <TH>Syntax</TH>
          <TH>Required</TH>
          <TH>Purpose</TH>
        </TR>
      </THead>
      <TBody>
        <TR>
          <TD>Site name</TD>
          <TD mono># Site Name</TD>
          <TD>Yes</TD>
          <TD>H1 heading — identifies the site to the AI model</TD>
        </TR>
        <TR>
          <TD>Site description</TD>
          <TD mono>{"> Description"}</TD>
          <TD>Yes</TD>
          <TD>Blockquote — one or two sentences describing the site</TD>
        </TR>
        <TR>
          <TD>Section heading</TD>
          <TD mono>## Section</TD>
          <TD>Yes (at least one)</TD>
          <TD>H2 heading — groups related resources (Pages, Products, Blog, etc.)</TD>
        </TR>
        <TR>
          <TD>Resource entry</TD>
          <TD mono>- [Title](url): desc</TD>
          <TD>Yes (at least one)</TD>
          <TD>List item — title, URL, and short description for one resource</TD>
        </TR>
        <TR>
          <TD>Extended resource block</TD>
          <TD mono>### Resource Title</TD>
          <TD>No</TD>
          <TD>H3 heading in llms-full.txt — introduces full content for a resource</TD>
        </TR>
      </TBody>
    </DocTable>
    <Callout type="tip" title="Minimum viable llms.txt">
      A valid file needs at minimum: an H1 site name, a blockquote description, one H2 section,
      and one list item. The body must be at least 100 characters and contain informative content
      (URLs, paths, or a site description) to pass the Analyzer.
    </Callout>

    <H2 id="analyzer-checks">Analyzer checks</H2>
    <P>
      The <IC>checkLlmsTxt</IC> function fetches <IC>{"{origin}/llms.txt"}</IC> and evaluates the
      response against the following conditions:
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
          <TD>HTTP 200 + <IC>text/plain</IC> content type + body ≥ 100 chars + informative content</TD>
          <TD mono>pass</TD>
          <TD>—</TD>
        </TR>
        <TR>
          <TD>HTTP 200 + empty body</TD>
          <TD mono>warn</TD>
          <TD mono>POPULATE_LLMS_TXT</TD>
        </TR>
        <TR>
          <TD>HTTP 200 + non-text content type</TD>
          <TD mono>warn</TD>
          <TD mono>FIX_LLMS_TXT_CONTENT_TYPE</TD>
        </TR>
        <TR>
          <TD>HTTP 200 + body &lt; 100 chars or no informative signals</TD>
          <TD mono>warn</TD>
          <TD mono>IMPROVE_LLMS_TXT</TD>
        </TR>
        <TR>
          <TD>HTTP 404</TD>
          <TD mono>not_found</TD>
          <TD mono>ADD_LLMS_TXT</TD>
        </TR>
        <TR>
          <TD>Any other HTTP status (403, 500, etc.)</TD>
          <TD mono>warn</TD>
          <TD mono>FIX_LLMS_TXT_ACCESS</TD>
        </TR>
        <TR>
          <TD>Network error (DNS failure, timeout, etc.)</TD>
          <TD mono>unknown</TD>
          <TD>—</TD>
        </TR>
      </TBody>
    </DocTable>
    <P>
      Informative content is detected by the presence of at least one of: an absolute URL
      matching <IC>https?://\S+</IC>, a path matching <IC>/[\w\-./]+</IC>, or a brand description
      pattern matching <IC>^#\s+\S+</IC> or <IC>[A-Z][a-z]+ is a </IC>.
    </P>

    <H2 id="common-mistakes">Common mistakes</H2>
    <UL>
      <LI>
        <strong>Wrong content type.</strong> Serving <IC>llms.txt</IC> as <IC>text/html</IC> (the
        default for many static site generators) causes the Analyzer to return <IC>warn</IC>. Set
        the content type explicitly to <IC>text/plain</IC> in your server or CDN configuration.
      </LI>
      <LI>
        <strong>Thin content.</strong> A file with only a site name and description but no resource
        list is fewer than 100 characters and will return <IC>warn</IC>. Include at least a few
        resource entries with URLs and descriptions.
      </LI>
      <LI>
        <strong>Missing blockquote description.</strong> Omitting the <IC>{">"}</IC> blockquote
        line means AI models have no site-level context. The Analyzer does not fail on this alone,
        but it reduces the quality of AI-generated summaries about your site.
      </LI>
      <LI>
        <strong>Blocking the file in robots.txt.</strong> A <IC>Disallow: /llms.txt</IC> rule
        prevents AI crawlers from fetching the file even if it exists. The Analyzer fetches
        directly and will return <IC>pass</IC>, but real crawlers will not see the file.
      </LI>
      <LI>
        <strong>Stale content.</strong> <IC>llms.txt</IC> is not automatically updated when you
        add pages or products. Use a GEO AI package or a build-time generation step to keep the
        file in sync with your content.
      </LI>
    </UL>
  </article>
);

export const SpecLlmsTxtPage = { content, toc };
