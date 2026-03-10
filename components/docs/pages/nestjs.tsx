import { H1, Lead, P, IC } from "@/components/docs/doc-heading";
import { Callout } from "@/components/docs/callout";
import { type TocItem } from "@/components/docs/doc-toc";

const toc: TocItem[] = [];

const content = (
  <article>
    <H1>NestJS</H1>
    <Lead>NestJS integration for GEO AI — coming soon.</Lead>

    <Callout type="note" title="Planned">
      The NestJS integration is planned. It will provide a NestJS module wrapping{" "}
      <IC>geo-ai-core</IC> with decorators, interceptors, and dependency injection support.
    </Callout>

    <P>
      In the meantime, you can use <IC>geo-ai-core</IC> directly in any NestJS service — it works
      with any Node.js 20+ runtime.
    </P>
    <P>
      Follow the{" "}
      <a
        href="https://github.com/madeburo/GEO-AI"
        target="_blank"
        rel="noopener noreferrer"
        className="text-glow hover:underline"
      >
        GitHub repository
      </a>{" "}
      for updates.
    </P>
  </article>
);

export const NestJsPage = { content, toc };
