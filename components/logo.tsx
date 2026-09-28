import type { SVGProps } from 'react';

export function SpotlightMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="11.5 11.5 25 25" fill="none" aria-hidden {...props}>
      <circle cx="24" cy="24" r="8.1" fill="currentColor" />
      <path d="M12.81 23.61A11.2 11.2 0 0 1 23.61 12.81" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
      <path d="M35.19 24.39A11.2 11.2 0 0 1 24.39 35.19" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
    </svg>
  );
}
