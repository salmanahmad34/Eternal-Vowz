import React from 'react';
import { WeddingNavbar, WeddingFooter } from '@/components/layout/WeddingSiteChrome';
import { ShieldCheck } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#291418] font-sans flex flex-col justify-between">
      <WeddingNavbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="rounded-3xl bg-white border border-[#E2D7BD] p-6 sm:p-10 editorial-card-shadow space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F6EEDB] border border-[#E2D7BD] text-xs font-semibold text-[#8B7355]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C9A84C]" />
            <span>Legal &amp; Data Protection</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#2C221E]">
            Privacy Policy
          </h1>
          <p className="text-xs text-[#7A6A5E]">
            Last Updated: November 2026 &bull; Eternal Vowz (E&amp;V) Wedding Platform
          </p>

          <div className="space-y-5 text-sm text-[#4A3D34] leading-relaxed">
            <section className="space-y-2">
              <h2 className="font-serif text-xl font-semibold text-[#2C221E]">
                1. Information We Collect
              </h2>
              <p>
                When you create a digital wedding invitation card on <strong>Eternal Vowz</strong>, we collect only the details necessary to build and host your wedding suite:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
                <li><strong>Host Account Details:</strong> Name and email address provided during registration.</li>
                <li><strong>Wedding Card Content:</strong> Bride and groom names, ceremony dates, venue locations, and any optional sections (schedule, dress code, halal menu, or gift notes) you choose to fill in.</li>
                <li><strong>Guest RSVP Data:</strong> Guest names, attendance confirmations, headcount, meal preferences, and blessings submitted through your invitation links.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-xl font-semibold text-[#2C221E]">
                2. 30-Day Card Lifecycle &amp; Data Privacy
              </h2>
              <p>
                Your wedding details and guest lists are strictly private to your celebration. Each published wedding card remains active for <strong>1 Month (30 Days)</strong> from the date of creation, after which public guest access automatically expires to protect your family&apos;s privacy. We never sell, rent, or share guest contact details with third-party advertisers.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-xl font-semibold text-[#2C221E]">
                3. API &amp; Payment Security
              </h2>
              <p>
                Eternal Vowz uses 256-bit SSL/TLS encryption, strict HTTP security headers, and server-side HMAC signature verification for payment and API integrations. We do not store raw credit/debit card numbers or UPI PINs on our servers.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-xl font-semibold text-[#2C221E]">
                4. Contact for Privacy Inquiries
              </h2>
              <p>
                For any questions regarding this Privacy Policy or data removal requests, please email our support desk at{' '}
                <a href="mailto:mrsalman7307@gmail.com" className="text-[#6E2E3A] font-semibold underline">
                  mrsalman7307@gmail.com
                </a>.
              </p>
            </section>
          </div>
        </div>
      </main>

      <WeddingFooter />
    </div>
  );
}
