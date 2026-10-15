import type { SVGProps } from 'react';

export function SpotlightMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M0 0H24V24Z" />
      <path d="M0 0V24H9.6Z" />
    </svg>
  );
}
