import { RootProvider } from 'fumadocs-ui/provider/next';
import './global.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Analytics } from '@/components/analytics';
import { siteUrl } from '@/lib/shared';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: 'Spotlight Docs', template: 'Docs | %s' },
};

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <Analytics />
        <RootProvider theme={{ defaultTheme: 'dark' }} search={{ options: { type: 'static' } }}>{children}</RootProvider>
      </body>
    </html>
  );
}
