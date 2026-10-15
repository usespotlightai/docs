import { source } from '@/lib/source';
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/layouts/docs/page';
import { notFound } from 'next/navigation';
import { getMDXComponents } from '@/components/mdx';
import type { Metadata } from 'next';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import { getPageImageUrl } from '@/lib/shared';
import { findNeighbour } from 'fumadocs-core/page-tree';
import { PageFooter } from '@/components/page-footer';

export default async function Page(props: PageProps<'/docs/[[...slug]]'>) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;

  const isHome = page.url === '/docs';
  const neighbours = findNeighbour(source.getPageTree(), page.url);

  return (
    <DocsPage
      toc={page.data.toc}
      full={isHome || page.data.full}
      breadcrumb={{ enabled: false }}
      footer={{ enabled: false }}
      tableOfContent={{ enabled: !isHome, style: 'clerk' }}
      className={isHome ? 'sl-home' : undefined}
    >
      <DocsTitle className={/^spotlight_[a-z_]+$/.test(page.data.title) ? 'sl-code-title' : undefined}>
        {page.data.title}
      </DocsTitle>
      {isHome && <DocsDescription className="sl-lead">{page.data.description}</DocsDescription>}
      <DocsBody>
        <MDX
          components={getMDXComponents({
            a: createRelativeLink(source, page),
          })}
        />
      </DocsBody>
      {!isHome && <PageFooter previous={neighbours.previous} next={neighbours.next} />}
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: PageProps<'/docs/[[...slug]]'>): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  return {
    title: params.slug?.length ? page.data.title : { absolute: page.data.title },
    description: page.data.description,
    openGraph: {
      images: getPageImageUrl(page).url,
    },
  };
}
