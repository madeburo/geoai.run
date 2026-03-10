import { H1, Lead, P, IC } from "@/components/docs/doc-heading";
import { Callout } from "@/components/docs/callout";
import { type TocItem } from "@/components/docs/doc-toc";

const toc: TocItem[] = [];

const content = (
  <article>
    <H1>Laravel</H1>
    <Lead>Laravel integration for GEO AI — coming soon.</Lead>

    <Callout type="note" title="Planned">
      A Laravel package is planned. It will provide a service provider, facade, and Artisan
      commands for generating llms.txt, AI metadata, and crawler rules in Laravel applications.
    </Callout>

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

export const LaravelPage = { content, toc };
