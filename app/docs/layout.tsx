import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { SidebarFooter, TopBar } from '@/components/chrome';
import { baseOptions } from '@/lib/layout.shared';

export default function Layout({ children }: LayoutProps<'/docs'>) {
  return (
    <DocsLayout
      tree={source.getPageTree()}
      {...baseOptions()}
      sidebar={{ collapsible: false, footer: <SidebarFooter key="footer" /> }}
      slots={{ header: TopBar }}
    >
      {children}
    </DocsLayout>
  );
}
