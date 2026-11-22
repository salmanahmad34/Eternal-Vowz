import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/config/site';

export const metadata: Metadata = {
  title: `Contact Us & Official Support Desk — ${SITE_CONFIG.name} (${SITE_CONFIG.shortName})`,
  description:
    `Reach out to ${SITE_CONFIG.founder.name} and the official ${SITE_CONFIG.name} support desk for inquiries regarding 3D digital wedding cards, payments, and custom stationery.`,
  alternates: {
    canonical: `${SITE_CONFIG.url}/contact`,
  },
  openGraph: {
    title: `Contact Us — ${SITE_CONFIG.name}`,
    description: `Get in touch with ${SITE_CONFIG.founder.name} at ${SITE_CONFIG.name} (${SITE_CONFIG.founder.location}).`,
    url: `${SITE_CONFIG.url}/contact`,
    siteName: SITE_CONFIG.name,
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
