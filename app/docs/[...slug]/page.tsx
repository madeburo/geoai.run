import { notFound } from "next/navigation";
import { getDocPage, DOC_PAGES } from "@/lib/docs/content";
import { getPrevNext } from "@/lib/docs/navigation";
import { Breadcrumbs } from "@/components/docs/breadcrumbs";
import { PrevNext } from "@/components/docs/prev-next";
import { DocToc } from "@/components/docs/doc-toc";
import { renderDocPage } from "@/components/docs/pages";

interface Props {
  params: Promise<{ slug: string[] }>;
}

export function generateStaticParams() {
  return Object.keys(DOC_PAGES)
    .filter((key) => key !== "")
    .map((key) => ({ slug: key.split("/") }));
}

export default async function DocPage({ params }: Props) {
  const { slug } = await params;
  const key = slug.join("/");
  const page = getDocPage(slug);
  if (!page) notFound();

  const href = `/docs/${key}`;
  const { prev, next } = getPrevNext(href);

  const crumbs = slug.map((segment, i) => ({
    title: segment
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" "),
    href: i < slug.length - 1 ? `/docs/${slug.slice(0, i + 1).join("/")}` : undefined,
  }));

  const { content, toc } = renderDocPage(page.content);

  return (
    <div className="flex gap-12 xl:gap-16">
      <article className="min-w-0 flex-1">
        <Breadcrumbs items={crumbs} />
        {content}
        <PrevNext prev={prev} next={next} />
      </article>

      {toc.length > 0 && (
        <aside className="hidden xl:block w-52 shrink-0">
          <div className="sticky top-[57px] pt-8">
            <DocToc items={toc} />
          </div>
        </aside>
      )}
    </div>
  );
}
