import { H1, H2, H3, Lead, P, IC, UL, LI } from "@/components/docs/doc-heading";
import { Callout } from "@/components/docs/callout";
import { type TocItem } from "@/components/docs/doc-toc";

const toc: TocItem[] = [
  { id: "installation", title: "Installation", level: 2 },
  { id: "features", title: "Features", level: 2 },
  { id: "configuration", title: "Configuration", level: 2 },
  { id: "woocommerce", title: "WooCommerce", level: 2 },
  { id: "multilingual", title: "Multilingual", level: 2 },
  { id: "requirements", title: "Requirements", level: 2 },
];

const content = (
  <article>
    <H1>GEO AI Woo</H1>
    <Lead>
      WordPress and WooCommerce plugin for AI Search Optimization. Zero-config setup,
      WooCommerce-first.
    </Lead>

    <div className="my-6 flex flex-wrap gap-2">
      <a
        href="https://github.com/madeburo/geo-ai-woo"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 rounded-md border border-border/60 bg-card/40 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        GitHub ↗
      </a>
    </div>

    <H2 id="installation">Installation</H2>
    <P>
      Install like any WordPress plugin — no Node.js required on the server.
    </P>
    <UL>
      <LI>Download the latest release from the GitHub repository</LI>
      <LI>
        Unzip and upload to <IC>/wp-content/plugins/geo-ai-woo/</IC>
      </LI>
      <LI>Activate in the WordPress admin panel</LI>
      <LI>
        Go to <IC>Settings → GEO AI Woo</IC> to configure
      </LI>
    </UL>

    <Callout type="tip" title="Zero-config defaults">
      After activation the plugin works immediately — all public posts, pages, and products are
      included in llms.txt, and all supported AI crawlers are allowed by default.
    </Callout>

    <H2 id="features">Features</H2>
    <UL>
      <LI>
        Generates static <IC>/llms.txt</IC> and <IC>/llms-full.txt</IC> at the WordPress root
      </LI>
      <LI>AI meta box on every post, page, and product for per-content AI descriptions</LI>
      <LI>
        One-click AI description generation via Claude or OpenAI (bulk up to 50 items)
      </LI>
      <LI>
        <IC>meta name=&quot;llms&quot;</IC>, <IC>Link</IC> header, and JSON-LD Schema.org in page head
      </LI>
      <LI>Per-bot robots.txt directives for 16+ AI crawlers</LI>
      <LI>REST API at <IC>/wp-json/geo-ai-woo/v1/</IC></LI>
      <LI>WP-CLI commands: <IC>regenerate</IC>, <IC>status</IC>, <IC>export</IC>, <IC>import</IC></LI>
      <LI>GDPR-compliant crawl tracking with SHA-256 IP anonymization</LI>
      <LI>Bulk Edit and Quick Edit support for AI fields in list tables</LI>
    </UL>

    <H2 id="configuration">Configuration</H2>
    <P>
      Navigate to <IC>Settings → GEO AI Woo</IC> to configure:
    </P>
    <UL>
      <LI>Post Types — select which content types to include in llms.txt</LI>
      <LI>Bot Rules — allow or disallow specific AI crawlers</LI>
      <LI>Cache — set regeneration frequency (1, 6, 12, 24, or 48 hours)</LI>
      <LI>AI Generation — provider, API key, model, and prompt template</LI>
    </UL>

    <H3 id="ai-meta-box">AI meta box</H3>
    <P>
      Edit any post, page, or product to find the GEO AI Woo meta box. Fields:
    </P>
    <UL>
      <LI>AI Description — concise summary for LLMs (max 200 characters)</LI>
      <LI>AI Keywords — topics and context hints</LI>
      <LI>Exclude from AI — opt this content out of llms.txt entirely</LI>
      <LI>Generate with AI — one-click description generation</LI>
    </UL>

    <H2 id="woocommerce">WooCommerce</H2>
    <P>
      When WooCommerce is active, GEO AI Woo automatically enriches product data in llms.txt:
    </P>
    <UL>
      <LI>Price ranges and sale prices (regular vs. sale)</LI>
      <LI>Stock status and availability</LI>
      <LI>Product ratings and attributes</LI>
      <LI>Variable product support with available variations</LI>
      <LI>Enhanced Schema.org Product markup</LI>
      <LI>Dedicated GEO AI tab in the product data panel</LI>
    </UL>

    <H2 id="multilingual">Multilingual</H2>
    <P>
      Compatible with WPML, Polylang, and TranslatePress. Generates separate llms.txt files per
      language and adds hreflang alternate links in SEO meta tags and HTTP headers.
    </P>

    <H2 id="requirements">Requirements</H2>
    <UL>
      <LI>PHP 7.4 or higher</LI>
      <LI>WordPress 6.2 or higher</LI>
      <LI>WooCommerce 7.0+ (optional, for e-commerce features)</LI>
    </UL>
  </article>
);

export const WooPackagePage = { content, toc };
