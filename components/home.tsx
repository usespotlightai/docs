import Link from 'next/link';
import type { ReactNode } from 'react';

export function HomeSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="sl-home-section">
      <h2>{title}</h2>
      <div className="sl-card-grid">{children}</div>
    </section>
  );
}

export function HomeCard({
  href,
  icon,
  title,
  children,
}: {
  href: string;
  icon: ReactNode;
  title: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} className="sl-card">
      <div className="sl-card-icon">{icon}</div>
      <div className="sl-card-body">
        <h3>{title}</h3>
        <div className="sl-card-text">{children}</div>
      </div>
    </Link>
  );
}
