import { H1, H2, H3, Lead, P, IC, UL, LI, DocTable, THead, TBody, TR, TH, TD } from "@/components/docs/doc-heading";
import { CodeBlock } from "@/components/docs/code-block";
import { Callout } from "@/components/docs/callout";
import { type TocItem } from "@/components/docs/doc-toc";

const toc: TocItem[] = [
  { id: "what-is-llms-txt", title: "What is llms.txt?", level: 2 },
  { id: "format", title: "File format", level: 2 },
  { id: "llms-full-txt", title: "llms-full.txt", level: 2 },
  { id: "generating", title: "Generating with GEO AI", level: 2 },
  { id: "content-provider", title: "ContentProvider interface", level: 3 },
];

const content = (
  <article>
    <H1>llms.txt</H1>
    <Lead>
      The structured file that gives AI crawlers a readable index of your site content.
    </Lead>

    <H2 id="what-is-llms-txt">What is llms.txt?</H2>
    <P>
      <IC>llms.txt</IC> is a plain-text file placed at the root of your site (
      <IC>https://yoursite.com/llms.txt</IC>). It follows the{" "}
      <a href="https://llmstxt.org" target="_blank" rel="noopener noreferrer">
        llms.txt standard
      </a>{" "}
      and gives AI search engines a structured, machine-readable index of your site&apos;s content.
    </P>
    <P>
      Think of it as a sitemap designed for LLMs — instead of XML with URLs, it&apos;s Markdown
      with titles, URLs, and human-readable descriptions that AI models can actually understand.
    </P>

    <Callout type="tip" title="Why both files?">
      AI crawlers fetch <IC>llms.txt</IC> first for a quick overview. When they need more detail —
      for example to answer a product question — they fetch <IC>llms-full.txt</IC>. Serving both
      maximizes your visibility.
    </Callout>

    <H2 id="format">File format</H2>
    <P>
      The file uses a simple Markdown structure with a site header and named sections:
    </P>
    <CodeBlock
      filename="/llms.txt"
      code={`# Site Name

> Site description — one or two sentences about what this site is.

## Pages

- [Home](https://example.com/): Welcome to Example
- [About](https://example.com/about): Our story and mission
- [Contact](https://example.com/contact): Get in touch

## Products

- [Widget Pro](https://example.com/products/widget-pro): Our flagship widget — $29.99
- [Widget Lite](https://example.com/products/widget-lite): Entry-level widget — $9.99

## Blog

- [Getting Started](https://example.com/blog/getting-started): How to get started with widgets`}
    />

    <DocTable>
      <THead>
        <TR>
          <TH>Element</TH>
          <TH>Description</TH>
        </TR>
      </THead>
      <TBody>
        <TR>
          <TD mono># Site Name</TD>
          <TD>H1 heading — your site name</TD>
        </TR>
        <TR>
          <TD mono>{"> Description"}</TD>
          <TD>Blockquote — short site description for AI context</TD>
        </TR>
        <TR>
          <TD mono>## Section</TD>
          <TD>H2 heading — content category (Pages, Products, Blog, etc.)</TD>
        </TR>
        <TR>
          <TD mono>- [Title](url): desc</TD>
          <TD>List item — resource with title, URL, and description</TD>
        </TR>
      </TBody>
    </DocTable>

    <H2 id="llms-full-txt">llms-full.txt</H2>
    <P>
      <IC>llms-full.txt</IC> extends the standard file with full content for each resource. For
      products, this includes pricing, availability, and variants. For pages and posts, it includes
      the full body text.
    </P>
    <CodeBlock
      filename="/llms-full.txt (product section)"
      code={`## Products

### Widget Pro

URL: https://example.com/products/widget-pro
Price: $29.99
Available: true
Category: Widgets

Our flagship widget. Built for professionals who need reliability and performance.
Available in three sizes: small, medium, large.

Variants:
- Small — $24.99 — In stock
- Medium — $29.99 — In stock
- Large — $34.99 — Low stock`}
    />

    <H2 id="generating">Generating with GEO AI</H2>
    <P>
      GEO AI generates both files from your content data. The simplest approach is a static object:
    </P>
    <CodeBlock
      language="typescript"
      code={`import { createGeoAI } from 'geo-ai-core';

const geo = createGeoAI({
  siteName: 'My Site',
  siteUrl: 'https://example.com',
  provider: {
    Pages: [
      { title: 'Home', url: '/', description: 'Welcome' },
    ],
    Products: [
      {
        title: 'Widget Pro',
        url: '/products/widget-pro',
        description: 'Our flagship widget',
        price: '$29.99',
        available: true,
      },
    ],
  },
});

const llmsTxt = await geo.generateLlms(false);      // llms.txt
const llmsFullTxt = await geo.generateLlms(true);   // llms-full.txt`}
    />

    <H3 id="content-provider">ContentProvider interface</H3>
    <P>
      For dynamic data sources — databases, CMS APIs, headless commerce — implement the{" "}
      <IC>ContentProvider</IC> interface:
    </P>
    <CodeBlock
      language="typescript"
      code={`import { createGeoAI, type ContentProvider, type Section } from 'geo-ai-core';

class MyProvider implements ContentProvider {
  async getSections(options?: { locale?: string }): Promise<Section[]> {
    const [products, posts] = await Promise.all([
      fetchProducts(options?.locale),
      fetchBlogPosts(options?.locale),
    ]);

    return [
      {
        name: 'Products',
        type: 'product',
        resources: products.map((p) => ({
          title: p.name,
          url: p.slug,
          description: p.summary,
          price: p.price,
          available: p.inStock,
        })),
      },
      {
        name: 'Blog',
        type: 'page',
        resources: posts.map((p) => ({
          title: p.title,
          url: p.slug,
          description: p.excerpt,
        })),
      },
    ];
  }
}

const geo = createGeoAI({
  siteName: 'My Site',
  siteUrl: 'https://example.com',
  provider: new MyProvider(),
});`}
    />

    <Callout type="note">
      The <IC>type</IC> field on each section (<IC>&apos;product&apos;</IC>, <IC>&apos;page&apos;</IC>,{" "}
      <IC>&apos;article&apos;</IC>) controls how GEO AI formats the content in{" "}
      <IC>llms-full.txt</IC> and which JSON-LD schema it generates.
    </Callout>
  </article>
);

export const LlmsTxtPage = { content, toc };
