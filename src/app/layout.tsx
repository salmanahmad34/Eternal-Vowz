import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import { InitialSplashOverlay } from '@/components/layout/EternalLoader';
import { SITE_CONFIG } from '@/config/site';
import { SHARED_FAQS } from '@/data/faqs';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: 'Eternal Vowz (E&V) — Bespoke 3D Digital Wedding Invitations & RSVP Platform',
  description:
    'Create royal 3D Lifafa and 3D Shahi Palace Gate digital wedding cards at flat ₹99 per card with live RSVP tracking and personalized WhatsApp links.',
  alternates: {
    canonical: SITE_CONFIG.url,
  },
  openGraph: {
    title: 'Eternal Vowz (E&V) — Bespoke 3D Digital Wedding Invitations & RSVP Platform',
    description:
      'Create royal 3D Lifafa and 3D Shahi Palace Gate digital wedding cards at flat ₹99 per card with live RSVP tracking and personalized WhatsApp links.',
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    images: [
      {
        url: `${SITE_CONFIG.url}/assets/logo-circle.png`,
        width: 1024,
        height: 1024,
        alt: 'Eternal Vowz (E&V) Monogram Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Eternal Vowz — Bespoke 3D Digital Wedding Invitations',
    description:
      'Create royal 3D Lifafa and 3D Shahi Palace Gate digital wedding invitations at just ₹99 per card.',
    images: [`${SITE_CONFIG.url}/assets/logo-circle.png`],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: [{ url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  verification: {
    google: 'google9d1eb35adfd63784',
  },
};

const jsonLdSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_CONFIG.url}/#organization`,
      name: SITE_CONFIG.name,
      alternateName: SITE_CONFIG.shortName,
      url: SITE_CONFIG.url,
      logo: `${SITE_CONFIG.url}/assets/logo-circle.png`,
      description:
        'Bespoke 3D Digital Wedding Invitations and RSVP Tracking Platform created by Salman Ahmad',
      founder: {
        '@type': 'Person',
        '@id': `${SITE_CONFIG.url}/about#salman`,
        name: SITE_CONFIG.founder.name,
        jobTitle: SITE_CONFIG.founder.role,
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Azamgarh',
          addressRegion: 'Uttar Pradesh',
          addressCountry: 'India',
        },
      },
      contactPoint: {
        '@type': 'ContactPoint',
        email: SITE_CONFIG.contactEmail,
        contactType: 'customer support',
      },
    },
    {
      '@type': 'WebApplication',
      '@id': `${SITE_CONFIG.url}/#webapp`,
      name: 'Eternal Vowz 3D Digital Wedding Invitation Suite',
      url: SITE_CONFIG.url,
      applicationCategory: 'LifestyleApplication',
      operatingSystem: 'All modern web browsers (iOS, Android, macOS, Windows)',
      description:
        'Create bespoke royal 3D Lifafa and 3D Shahi Palace Gate digital wedding cards at flat ₹99 with live RSVP tracking.',
      offers: {
        '@type': 'Offer',
        price: '99',
        priceCurrency: 'INR',
        availability: 'https://schema.org/InStock',
        validFrom: '2026-01-01',
      },
    },
    {
      '@type': 'FAQPage',
      '@id': `${SITE_CONFIG.url}/#faq`,
      mainEntity: SHARED_FAQS.map((faq) => ({
        '@type': 'Question',
        name: faq.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.a,
        },
      })),
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Great+Vibes&family=Inter:wght@400;500;600;700&family=Petit+Formal+Script&family=Pinyon+Script&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
        />
        {/* Google Analytics 4 (GA4) & Google Tag Manager */}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID || 'G-24RY3NY9GB'}`}
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_ID || 'G-24RY3NY9GB'}', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
        <Script
          id="google-tag-manager"
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtm.js?id=GTM-KJBXPSBW"
        />
      </head>
      <body className="font-sans bg-[#FAF7F2] text-[#291418] antialiased selection:bg-[#C9A84C]/20 selection:text-[#291418]">
        <InitialSplashOverlay />
        {children}
      </body>
    </html>
  );
}
