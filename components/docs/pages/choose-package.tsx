import { H1, H2, Lead, P, IC, UL, LI } from "@/components/docs/doc-heading";
import { Callout } from "@/components/docs/callout";
import { type TocItem } from "@/components/docs/doc-toc";

const toc: TocItem[] = [
  { id: "overview", title: "Overview", level: 2 },
  { id: "geo-ai-core", title: "geo-ai-core", level: 2 },
  { id: "geo-ai-next", title: "geo-ai-next", level: 2 },
  { id: "geo-ai-woo", title: "geo-ai-woo", level: 2 },
  { id: "geo-ai-shopify", title: "geo-ai-shopify", level: 2 },
];

const content = (
  <article>
    <H1>Choose Your Package</H1>
    <Lead>GEO AI is a multi-platform ecosystem. Pick the package that fits your stack.</Lead>

    <H2 id="overview">Overview</H2>
    <div className="my-6 grid gap-3 sm:grid-cols-2">
      {[
        {
          name: "geo-ai-core",
          label: "Any Node.js",
          desc: "Zero-dependency engine. Works with Express, Fastify, Hono, NestJS, or any Node.js runtime.",
        },
        {
          name: "geo-ai-next",
          label: "Next.js",
          desc: "Builds on core. Adds static file generation CLI, middleware, and App Router route handler.",
        },
        {
          name: "geo-ai-woo",
          label: "WordPress / WooCommerce",
          desc: "PHP plugin. Zero-config, WooCommerce-first, multilingual, REST API, WP-CLI.",
        },
        {
          name: "geo-ai-shopify",
          label: "Shopify",
          desc: "Embedded Shopify app. Native metafields, App Proxy, multilingual, crawl tracking.",
        },
      ].map((pkg) => (
        <div
          key={pkg.name}
          className="rounded-lg border border-border/60 bg-card/40 p-4"
        >
          <p className="mb-0.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground/50">
            {pkg.label}
          </p>
          <p className="mb-1 font-mono text-sm font-semibold text-glow">{pkg.name}</p>
          <p className="text-sm text-muted-foreground/70 leading-relaxed">{pkg.desc}</p>
        </div>
      ))}
    </div>

    <H2 id="geo-ai-core">geo-ai-core</H2>
    <P>
      The universal engine. Use this when you need GEO AI in a Node.js environment that isn&apos;t
      Next.js — or when you want full control without any framework abstractions.
    </P>
    <UL>
      <LI>Zero dependencies</LI>
      <LI>Works with any Node.js 20+ runtime</LI>
      <LI>
        Provides <IC>createGeoAI()</IC>, <IC>BotRulesEngine</IC>, <IC>CrawlTracker</IC>,{" "}
        <IC>SeoGenerator</IC>, cache adapters, and all types
      </LI>
      <LI>
        Optional AI description generation via <IC>geo-ai-core/ai</IC> (tree-shakeable)
      </LI>
    </UL>
    <Callout type="note">
      If you&apos;re on Next.js, use <IC>geo-ai-next</IC> instead — it re-exports everything from{" "}
      <IC>geo-ai-core</IC> so you only need one package.
    </Callout>

    <H2 id="geo-ai-next">geo-ai-next</H2>
    <P>
      The Next.js integration. Adds three things on top of <IC>geo-ai-core</IC>:
    </P>
    <UL>
      <LI>
        <IC>geo-ai-generate</IC> CLI — generates static <IC>public/llms.txt</IC> and{" "}
        <IC>public/llms-full.txt</IC> before build
      </LI>
      <LI>
        <IC>geoAIMiddleware</IC> — edge middleware for dynamic per-request content
      </LI>
      <LI>
        <IC>createLlmsHandler</IC> — App Router route handler
      </LI>
    </UL>
    <P>
      Peer dependency: <IC>next &gt;= 16</IC>. Re-exports all of <IC>geo-ai-core</IC>&apos;s public
      API — no need to install both.
    </P>

    <H2 id="geo-ai-woo">geo-ai-woo</H2>
    <P>
      A WordPress plugin for sites running WordPress 6.2+ and optionally WooCommerce 7.0+. Install
      it like any WordPress plugin — no Node.js required on the server.
    </P>
    <UL>
      <LI>Generates static llms.txt files at the WordPress root</LI>
      <LI>AI meta box on every post, page, and product</LI>
      <LI>WooCommerce product data with pricing, stock, and variants</LI>
      <LI>WPML, Polylang, and TranslatePress support</LI>
      <LI>REST API and WP-CLI commands</LI>
    </UL>

    <H2 id="geo-ai-shopify">geo-ai-shopify</H2>
    <P>
      An embedded Shopify app built with Remix. Install it from the Shopify Partner dashboard or
      self-host it.
    </P>
    <UL>
      <LI>Serves llms.txt via Shopify App Proxy</LI>
      <LI>AI metadata stored as native Shopify Metafields</LI>
      <LI>Per-locale llms.txt via Translations API</LI>
      <LI>Theme Extension for meta tags and JSON-LD</LI>
      <LI>GDPR-compliant crawl tracking</LI>
    </UL>
  </article>
);

export const ChoosePackagePage = { content, toc };
