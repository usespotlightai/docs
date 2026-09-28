import type * as PageTree from 'fumadocs-core/page-tree';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

type Neighbours = { previous?: PageTree.Item; next?: PageTree.Item };

export function PageFooter({ previous, next }: Neighbours) {
  if (!previous && !next) return null;
  return (
    <nav className="sl-page-footer" aria-label="Previous and next pages">
      {previous ? (
        <Link href={previous.url} className="sl-page-footer-card">
          <span className="sl-page-footer-label">
            <ChevronLeft />
            Previous
          </span>
          <span className="sl-page-footer-title">{previous.name}</span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link href={next.url} className="sl-page-footer-card sl-page-footer-next">
          <span className="sl-page-footer-label">
            Next
            <ChevronRight />
          </span>
          <span className="sl-page-footer-title">{next.name}</span>
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
