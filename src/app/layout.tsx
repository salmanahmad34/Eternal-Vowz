import type { Metadata } from "next";
import "./globals.css";
import { InitialSplashOverlay } from "@/components/layout/EternalLoader";

export const metadata: Metadata = {
  metadataBase: new URL('https://eternal-vowz.onrender.com'),
  title: "Eternal Vowz (E&V) — Bespoke 3D Digital Wedding Invitations & RSVP Platform",
  description: "Create royal 3D Lifafa and 3D Shahi Palace Gate digital wedding invitations at just ₹99 per card with live RSVP tracking and personalized WhatsApp links.",
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
      </head>
      <body className="font-sans bg-[#FAF7F2] text-[#291418] antialiased selection:bg-[#C9A84C]/20 selection:text-[#291418]">
        <InitialSplashOverlay />
        {children}
      </body>
    </html>
  );
}
