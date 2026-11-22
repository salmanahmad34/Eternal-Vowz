import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/config/site';

export const metadata: Metadata = {
  title: 'Live 3D Digital Wedding Invitation Demo • Sophia & Alexander | Eternal Vowz',
  description:
    'Experience our interactive 3D Royal Lifafa & Shahi Palace Gate wedding invitation demo. Features wax-seal animation, event timeline, and live RSVP tracking.',
  alternates: {
    canonical: `${SITE_CONFIG.url}/demo`,
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Live 3D Digital Wedding Invitation Demo | Eternal Vowz',
    description:
      'Tap to experience a live royal 3D digital wedding invitation with animated reveal and RSVP tracking.',
    url: `${SITE_CONFIG.url}/demo`,
    siteName: SITE_CONFIG.name,
    images: [
      {
        url: `${SITE_CONFIG.url}/assets/tuscan-haveli/hero-haveli-courtyard.jpg`,
        width: 1200,
        height: 630,
        alt: 'Eternal Vowz 3D Digital Wedding Card Demo',
      },
    ],
    type: 'website',
  },
};

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
