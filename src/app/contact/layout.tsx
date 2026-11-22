import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us & Official Support Desk — Eternal Vowz (E&V)',
  description:
    'Reach out to Salman Ahmad and the official Eternal Vowz support desk for inquiries regarding 3D digital wedding cards, payments, and custom stationery.',
  alternates: {
    canonical: 'https://eternal-vowz.onrender.com/contact',
  },
  openGraph: {
    title: 'Contact Us — Eternal Vowz',
    description: 'Get in touch with Salman Ahmad at Eternal Vowz (Azamgarh, UP, India).',
    url: 'https://eternal-vowz.onrender.com/contact',
    siteName: 'Eternal Vowz',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
