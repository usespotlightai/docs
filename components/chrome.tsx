'use client';

import { getBreadcrumbItems } from 'fumadocs-core/breadcrumb';
import { useSearchContext } from 'fumadocs-ui/contexts/search';
import { useTreeContext } from 'fumadocs-ui/contexts/tree';
import { useDocsLayout } from 'fumadocs-ui/layouts/docs';
import { MarkdownCopyButton } from 'fumadocs-ui/layouts/docs/page';
import { BookText, Moon, PanelLeft, Search, Sun } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Fragment, type ComponentProps, useEffect, useState } from 'react';
import { SpotlightMark } from './logo';

export const APP_URL = 'https://app.usespotlight.ai';

export function SearchButton(props: ComponentProps<'button'>) {
  const { setOpenSearch } = useSearchContext();
  return (
    <button
      type="button"
      aria-label="Search"
      className="sl-icon-button"
      onClick={() => setOpenSearch(true)}
      {...props}
    >
      <Search />
    </button>
  );
}

export function SidebarTitle() {
  return (
    <div className="sl-sidebar-title">
      <Link href="/docs" className="sl-brand" aria-label="Spotlight docs home">
        <SpotlightMark className="sl-brand-mark" />
        <span className="sl-brand-divider" aria-hidden />
        <span>Docs</span>
      </Link>
      <SearchButton />
    </div>
  );
}

export function SidebarFooter() {
  return (
    <nav className="sl-sidebar-footer" aria-label="More">
      <Link href="/docs">
        <BookText />
        Docs
      </Link>
      <a href={APP_URL} target="_blank" rel="noreferrer">
        <SpotlightMark />
        Open Spotlight
      </a>
    </nav>
  );
}

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const dark = mounted ? resolvedTheme === 'dark' : true;
  return (
    <button
      type="button"
      aria-label="Toggle theme"
      className="sl-icon-button"
      onClick={() => setTheme(dark ? 'light' : 'dark')}
    >
      {dark ? <Sun /> : <Moon />}
    </button>
  );
}

function Breadcrumb() {
  const pathname = usePathname();
  const { root } = useTreeContext();
  if (pathname === '/docs' || pathname === '/docs/') {
    return <span className="sl-crumb-current">Home</span>;
  }
  const items = getBreadcrumbItems(pathname, root, { includePage: true, includeRoot: false });
  return (
    <ol className="sl-crumbs">
      {items.map((item, i) => (
        <Fragment key={i}>
          {i > 0 && <li aria-hidden className="sl-crumb-sep">/</li>}
          <li className={i === items.length - 1 ? 'sl-crumb-current' : undefined}>
            {item.url && i < items.length - 1 ? <Link href={item.url}>{item.name}</Link> : item.name}
          </li>
        </Fragment>
      ))}
    </ol>
  );
}

export function TopBar(props: ComponentProps<'header'>) {
  const pathname = usePathname();
  const { slots } = useDocsLayout();
  const isHome = pathname === '/docs' || pathname === '/docs/';
  const markdownUrl = `/llms.mdx${pathname}/content.md`;
  return (
    <header {...props} id="sl-topbar" className="sl-topbar">
      {slots.sidebar && (
        <slots.sidebar.trigger className="sl-icon-button sl-mobile-only" aria-label="Open navigation">
          <PanelLeft />
        </slots.sidebar.trigger>
      )}
      <nav aria-label="Breadcrumb" className="sl-breadcrumb">
        <Breadcrumb />
      </nav>
      <div className="sl-topbar-actions">
        <span className="sl-mobile-only">
          <SearchButton />
        </span>
        <ThemeToggle />
        {!isHome && <MarkdownCopyButton markdownUrl={markdownUrl} className="sl-copy-button">
            Copy page
          </MarkdownCopyButton>}
        <a href={APP_URL} target="_blank" rel="noreferrer" className="sl-pill">
          Open Spotlight
        </a>
      </div>
    </header>
  );
}
