import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { SidebarTitle } from '@/components/chrome';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: SidebarTitle,
    },
    searchToggle: { enabled: false },
    themeSwitch: { enabled: false },
  };
}
