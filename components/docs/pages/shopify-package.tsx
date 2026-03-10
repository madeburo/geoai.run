import { H1, H2, H3, Lead, P, IC, UL, LI } from "@/components/docs/doc-heading";
import { CodeBlock } from "@/components/docs/code-block";
import { Callout } from "@/components/docs/callout";
import { type TocItem } from "@/components/docs/doc-toc";

const toc: TocItem[] = [
  { id: "installation", title: "Installation", level: 2 },
  { id: "features", title: "Features", level: 2 },
  { id: "app-proxy", title: "App Proxy endpoints", level: 2 },
  { id: "configuration", title: "Configuration", level: 2 },
  { id: "security", title: "Security", level: 2 },
  { id: "requirements", title: "Requirements", level: 2 },
];

const content = (
  <article>
    <H1>GEO AI Shopify</H1>
    <Lead>
      Shopify embedded app for AI Search Optimization. Native metafields, App Proxy, multilingual
      support, zero-config setup.
    </Lead>

    <div className="my-6 flex flex-wrap gap-2">
      <a
        href="https://github.com/madeburo/geo-ai-shopify"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 rounded-md border border-border/60 bg-card/40 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        GitHub ↗
      </a>
    </div>

    <H2 id="installation">Installation</H2>
    <P>For development and self-hosting:</P>
    <CodeBlock
      language="bash"
      code={`git clone https://github.com/madeburo/geo-ai-shopify.git
cd geo-ai-shopify
npm install
npx prisma generate
npx prisma migrate dev
shopify app dev`}
    />

    <P>Create a <IC>.env</IC> file with your Shopify credentials:</P>
    <CodeBlock
      filename=".env"
      code={`SHOPIFY_API_KEY=your_api_key
SHOPIFY_API_SECRET=your_api_secret
ENCRYPTION_KEY=64_character_hex_string
DATABASE_URL=file:dev.db
SCOPES=read_products,write_products,read_content,write_content,read_themes,read_metafields,write_metafields,read_translations
SHOPIFY_APP_URL=https://your-app-url`}
    />

    <P>Generate an encryption key:</P>
    <CodeBlock
      language="bash"
      code={`node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`}
    />

    <Callout type="tip" title="Production (Docker)">
      <IC>docker build -t geo-ai-shopify .</IC> then{" "}
      <IC>docker run -p 3000:3000 --env-file .env geo-ai-shopify</IC>
    </Callout>

    <H2 id="features">Features</H2>
    <UL>
      <LI>
        llms.txt and llms-full.txt served via Shopify App Proxy at <IC>/apps/llms/</IC>
      </LI>
      <LI>
        AI metadata stored as Shopify Metafields (namespace: <IC>geo_ai</IC>) on products, pages,
        and collections
      </LI>
      <LI>One-click AI description generation via Claude or OpenAI</LI>
      <LI>Bulk generation for up to 50 resources (batched by 5)</LI>
      <LI>Theme Extension injecting meta tags and JSON-LD into storefront head</LI>
      <LI>Per-locale llms.txt via Shopify Translations API</LI>
      <LI>GDPR-compliant crawl tracking with SHA-256 IP anonymization</LI>
      <LI>Setup wizard and onboarding checklist</LI>
    </UL>

    <H2 id="app-proxy">App Proxy endpoints</H2>
    <P>
      The app serves llms.txt content through Shopify App Proxy — accessible from your storefront
      domain:
    </P>
    <CodeBlock
      code={`GET /apps/llms/              → llms.txt
GET /apps/llms/{locale}      → llms.txt (per locale)
GET /apps/llms/full          → llms-full.txt
GET /apps/llms/full/{locale} → llms-full.txt (per locale)`}
    />

    <H3 id="admin-api">Admin API endpoints</H3>
    <CodeBlock
      code={`GET  /api/status
POST /api/regenerate
GET  /api/settings
POST /api/settings
POST /api/ai-generate
POST /api/ai-bulk`}
    />

    <H2 id="configuration">Configuration</H2>
    <P>
      Navigate to the Settings tab in the embedded app to configure:
    </P>
    <UL>
      <LI>Content Types — toggle products, pages, collections, blog posts</LI>
      <LI>Bot Rules — allow or disallow specific AI crawlers</LI>
      <LI>Cache — set regeneration frequency (1, 6, 12, 24, or 48 hours)</LI>
      <LI>AI Generation — provider, API key, model, and prompt template</LI>
      <LI>Advanced — multilingual, crawl tracking</LI>
    </UL>

    <H2 id="security">Security</H2>
    <UL>
      <LI>HMAC-SHA256 signature verification on App Proxy routes using constant-time comparison</LI>
      <LI>
        Mandatory <IC>SHOPIFY_API_SECRET</IC> — app refuses to verify signatures with an empty
        secret
      </LI>
      <LI>
        Shop parameter validation on public API endpoints (must match <IC>*.myshopify.com</IC>)
      </LI>
      <LI>Rate limiting on public API endpoints (60 req/min per shop) with Retry-After header</LI>
      <LI>AES-256-GCM encrypted API key storage</LI>
    </UL>

    <H2 id="requirements">Requirements</H2>
    <UL>
      <LI>Node.js 20 or higher</LI>
      <LI>Shopify Partner account</LI>
      <LI>Shopify CLI</LI>
    </UL>
  </article>
);

export const ShopifyPackagePage = { content, toc };
