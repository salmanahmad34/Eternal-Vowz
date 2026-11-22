import type { Metadata } from "next";
import "./globals.css";
import { InitialSplashOverlay } from "@/components/layout/EternalLoader";

export const metadata: Metadata = {
  metadataBase: new URL('https://eternal-vowz.onrender.com'),
  title: "Eternal Vowz (E&V) — Bespoke 3D Digital Wedding Invitations & RSVP Platform",
  description: "Create royal 3D Lifafa and 3D Shahi Palace Gate digital wedding invitations at just ₹99 per card with live RSVP tracking and personalized WhatsApp links.",
  alternates: {
    canonical: 'https://eternal-vowz.onrender.com',
  },
  openGraph: {
    title: 'Eternal Vowz (E&V) — Bespoke 3D Digital Wedding Invitations & RSVP Platform',
    description: 'Create royal 3D Lifafa and 3D Shahi Palace Gate digital wedding invitations at just ₹99 per card with live RSVP tracking and personalized WhatsApp links.',
    url: 'https://eternal-vowz.onrender.com',
    siteName: 'Eternal Vowz',
    images: [
      {
        url: 'https://eternal-vowz.onrender.com/assets/logo-circle.png',
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
    description: 'Create royal 3D Lifafa and 3D Shahi Palace Gate digital wedding invitations at just ₹99 per card.',
    images: ['https://eternal-vowz.onrender.com/assets/logo-circle.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', type: 'image/png', sizes: '512x512' }
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }
    ],
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
      '@id': 'https://eternal-vowz.onrender.com/#organization',
      name: 'Eternal Vowz',
      alternateName: 'E&V',
      url: 'https://eternal-vowz.onrender.com',
      logo: 'https://eternal-vowz.onrender.com/assets/logo-circle.png',
      description: 'Bespoke 3D Digital Wedding Invitations and RSVP Tracking Platform created by Salman Ahmad',
      founder: {
        '@type': 'Person',
        name: 'Salman Ahmad',
        jobTitle: 'Founder & Software Developer',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Azamgarh',
          addressRegion: 'Uttar Pradesh',
          addressCountry: 'India',
        },
      },
      contactPoint: {
        '@type': 'ContactPoint',
        email: 'mrsalman7307@gmail.com',
        contactType: 'customer support',
      },
    },
    {
      '@type': 'WebApplication',
      '@id': 'https://eternal-vowz.onrender.com/#webapp',
      name: 'Eternal Vowz 3D Digital Wedding Invitation Suite',
      url: 'https://eternal-vowz.onrender.com',
      applicationCategory: 'LifestyleApplication',
      operatingSystem: 'All modern web browsers (iOS, Android, macOS, Windows)',
      description: 'Create bespoke royal 3D Lifafa and 3D Shahi Palace Gate digital wedding cards at flat ₹99 with live RSVP tracking.',
      offers: {
        '@type': 'Offer',
        price: '99',
        priceCurrency: 'INR',
        availability: 'https://schema.org/InStock',
        validFrom: '2026-01-01',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        reviewCount: '128',
      },
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://eternal-vowz.onrender.com/#faq',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Eternal Vowz kya hai aur card kitne din active rehta hai?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Eternal Vowz ek online platform hai jahan aap ₹99 me 3D digital wedding invitation bana sakte hain. Card 30 din active rehta hai, usme live RSVP dashboard milta hai, aur aap unlimited guests ko personalized WhatsApp link bhej sakte hain. Isme Lifafa opening, wax seal crack, aur background wedding music ka cinematic royal experience milta hai.',
          },
        },
        {
          '@type': 'Question',
          name: '3D Shahi Palace wedding invitation kya hai?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: '3D Shahi Palace wedding invitation ek royal digital card hai jisme mehmaan jab link kholte hain, toh unke phone par ek grand shahi mahal ke double-door darwaze animated roop se khulte hain. Isme 24K gold filigree, authentic shehnai ya dhol music, event schedule, venue Google Maps, aur RSVP button shamil hota hai jo bina kisi app ke browser me chalta hai.',
          },
        },
        {
          '@type': 'Question',
          name: 'India me WhatsApp digital RSVP kaise kaam karta hai?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'India me WhatsApp digital RSVP me host apne dashboard se har mehmaan ke naam ka personalized WhatsApp link bhejta hai. Mehmaan bina kisi app download ke link khol kar "Attending" ya "Declined" select karte hain aur kitne log aayenge likh dete hain. Host ke live dashboard par attendance count aur guest details real-time update ho jaati hain.',
          },
        },
        {
          '@type': 'Question',
          name: 'Digital wedding invitation paper card se sasta hai kya?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Haan, digital wedding invitation paper card se 99% sasta hai. Ek aam shaadi me 300 paper cards print aur courier karwane ka kharcha ₹15,000 se ₹50,000 tak aata hai. Eternal Vowz par sirf ₹99 me poora royal 3D digital card banta hai, jisme unlimited WhatsApp links, live RSVP tracking, aur Google Maps shamil hote hain, bina printing ya delivery ke jhanjhat ke.',
          },
        },
        {
          '@type': 'Question',
          name: 'How long is my wedding invitation valid?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Every wedding card remains active for 30 days from creation with full live guest RSVP tracking.',
          },
        },
        {
          '@type': 'Question',
          name: 'What makes the 8 animated designs different?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Eternal Vowz offers 3 distinct reveal experiences across 8 signature designs: (1) Classic 3D Embossed Royal Lifafa envelopes with wax seals, (2) 3D Shahi Palace Double-Door Gates that unlock with golden keys, and (3) Frosted Botanical Pearl Veils with floral flourishes.',
          },
        },
        {
          '@type': 'Question',
          name: 'How do I share my card & what is the price?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Every signature wedding invitation card on Eternal Vowz is priced at a flat ₹99 per card (one-time fee). You receive unlimited personalized guest links ("For Honored Guest & Family") to share instantly on WhatsApp.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can I fill only basic details & edit later?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes! Our Smart Conditional Card Builder only requires the main essentials — Couple Names, Event Date, and Venue. All other modules (Schedule, Dress Code, Halal Menu, Story, Gift Registry, Stay Info) are optional and stay hidden unless enabled. You can edit anytime live.',
          },
        },
        {
          '@type': 'Question',
          name: 'How do I reach support or WhatsApp concierge?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'For all pre-purchase or general inquiries, email our official support desk at mrsalman7307@gmail.com. Once you create or purchase a ₹99 card, direct Priority WhatsApp Support unlocks immediately inside your Host Dashboard.',
          },
        },
        {
          '@type': 'Question',
          name: 'Is my wedding data & ₹99 payment secure?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Eternal Vowz uses 256-bit SSL encryption, strict HTTP security headers, and server-side HMAC-SHA256 verification for payment and API integrations. We never sell or share guest data with third parties.',
          },
        },
      ],
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
      </head>
      <body className="font-sans bg-[#FAF7F2] text-[#291418] antialiased selection:bg-[#C9A84C]/20 selection:text-[#291418]">
        <InitialSplashOverlay />
        {children}
      </body>
    </html>
  );
}
