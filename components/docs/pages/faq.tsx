import { H1, H2, Lead, P, IC } from "@/components/docs/doc-heading";
import { type TocItem } from "@/components/docs/doc-toc";
import Link from "next/link";

const toc: TocItem[] = [
  { id: "what-is-geo-ai", title: "What is GEO AI?", level: 2 },
  { id: "llms-txt-vs-sitemap", title: "llms.txt vs sitemap.xml", level: 2 },
  { id: "which-package", title: "Which package do I need?", level: 2 },
  { id: "does-it-affect-seo", title: "Does it affect SEO?", level: 2 },
  { id: "how-often-regenerate", title: "How often to regenerate?", level: 2 },
  { id: "open-source", title: "Is it open source?", level: 2 },
  { id: "analyzer-status", title: "Is the Analyzer ready?", level: 2 },
];

const faqs: { id: string; q: string; a: React.ReactNode }[] = [
  {
    id: "what-is-geo-ai",
    q: "What is GEO AI?",
    a: (
      <P>
        GEO AI is an open-source AI Search Optimization platform. It helps website and ecommerce
        owners make their sites visible to AI search engines — ChatGPT, Claude, Gemini, Perplexity,
        Grok, and others. It generates <IC>llms.txt</IC> files, AI crawler rules, metadata, and
        structured signals that these engines use to discover and understand your content.
      </P>
    ),
  },
  {
    id: "llms-txt-vs-sitemap",
    q: "What's the difference between llms.txt and sitemap.xml?",
    a: (
      <P>
        <IC>sitemap.xml</IC> is a machine-readable list of URLs for traditional search engine
        crawlers. <IC>llms.txt</IC> is a human-and-machine-readable Markdown file designed for
        LLMs — it includes titles, descriptions, and structured content that AI models can
        understand directly. They serve different audiences and complement each other.
      </P>
    ),
  },
  {
    id: "which-package",
    q: "Which package do I need?",
    a: (
      <>
        <P>It depends on your stack:</P>
        <ul className="my-3 space-y-1.5 pl-5 text-foreground/80 text-sm">
          <li className="relative leading-7 before:absolute before:-left-4 before:text-glow before:content-['–']">
            Next.js → <IC>geo-ai-next</IC>
          </li>
          <li className="relative leading-7 before:absolute before:-left-4 before:text-glow before:content-['–']">
            Any Node.js framework → <IC>geo-ai-core</IC>
          </li>
          <li className="relative leading-7 before:absolute before:-left-4 before:text-glow before:content-['–']">
            WordPress / WooCommerce → <IC>geo-ai-woo</IC> plugin
          </li>
          <li className="relative leading-7 before:absolute before:-left-4 before:text-glow before:content-['–']">
            Shopify → <IC>geo-ai-shopify</IC> app
          </li>
        </ul>
        <P>
          See the{" "}
          <Link href="/docs/getting-started/choose" className="text-glow hover:underline">
            Choose Your Package
          </Link>{" "}
          guide for a full comparison.
        </P>
      </>
    ),
  },
  {
    id: "does-it-affect-seo",
    q: "Does implementing GEO AI affect my existing SEO?",
    a: (
      <P>
        No. GEO AI adds new signals — it doesn&apos;t modify or remove anything your existing SEO
        setup relies on. The <IC>llms.txt</IC> file is a new endpoint, the meta tags use new{" "}
        <IC>name</IC> values that traditional crawlers ignore, and the robots.txt block only adds
        AI-specific directives. Your existing Google/Bing SEO is unaffected.
      </P>
    ),
  },
  {
    id: "how-often-regenerate",
    q: "How often should I regenerate llms.txt?",
    a: (
      <P>
        For most sites, regenerating at build time (before each deployment) is sufficient. If your
        content changes frequently — e.g. a high-volume ecommerce store — use the middleware or
        route handler with a cache TTL of <IC>1h</IC> or <IC>24h</IC>. The cache ensures AI
        crawlers always get fresh content without hitting your database on every request.
      </P>
    ),
  },
  {
    id: "open-source",
    q: "Is GEO AI open source?",
    a: (
      <P>
        Yes. All GEO AI packages are open source under the GPL v2 license. The source code is on{" "}
        <a
          href="https://github.com/madeburo/GEO-AI"
          target="_blank"
          rel="noopener noreferrer"
          className="text-glow hover:underline"
        >
          GitHub
        </a>
        . Contributions are welcome.
      </P>
    ),
  },
  {
    id: "analyzer-status",
    q: "Is the Analyzer ready to use?",
    a: (
      <P>
        The Analyzer UI is live at{" "}
        <Link href="/analyze" className="text-glow hover:underline">
          /analyze
        </Link>
        . Full backend scoring is in active development. The current version shows the interface —
        complete scoring and recommendations will be available in an upcoming release.
      </P>
    ),
  },
];

const content = (
  <article>
    <H1>FAQ</H1>
    <Lead>Frequently asked questions about GEO AI.</Lead>

    <div className="mt-8 space-y-8">
      {faqs.map((faq) => (
        <div key={faq.id} className="scroll-mt-24">
          <H2 id={faq.id}>{faq.q}</H2>
          {faq.a}
        </div>
      ))}
    </div>
  </article>
);

export const FaqPage = { content, toc };
