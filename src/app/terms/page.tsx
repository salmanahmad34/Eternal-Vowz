import React from 'react';
import { WeddingNavbar, WeddingFooter } from '@/components/layout/WeddingSiteChrome';
import { FileText } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#291418] font-sans flex flex-col justify-between">
      <WeddingNavbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="rounded-3xl bg-white border border-[#E2D7BD] p-6 sm:p-10 editorial-card-shadow space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F6EEDB] border border-[#E2D7BD] text-xs font-semibold text-[#8B7355]">
            <FileText className="w-3.5 h-3.5 text-[#C9A84C]" />
            <span>Terms of Service</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#2C221E]">
            Terms &amp; Conditions
          </h1>
          <p className="text-xs text-[#7A6A5E]">
            Effective Date: November 2026 &bull; Eternal Vowz (E&amp;V)
          </p>

          <div className="space-y-5 text-sm text-[#4A3D34] leading-relaxed">
            <section className="space-y-2">
              <h2 className="font-serif text-xl font-semibold text-[#2C221E]">
                1. Service Overview
              </h2>
              <p>
                <strong>Eternal Vowz (E&amp;V)</strong> provides an interactive 3D digital wedding invitation builder featuring 3D Embossed Lifafa animations, 3D Shahi Palace Double-Door Gate reveals, personalized guest URL generation, and real-time RSVP management tools.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-xl font-semibold text-[#2C221E]">
                2. Card Pricing (₹79 Per Card) &amp; 1-Month Validity
              </h2>
              <p>
                Each digital wedding invitation card created and published on Eternal Vowz is priced at a flat one-time fee of <strong>₹79 (Seventy-Nine Indian Rupees) per card</strong>. This includes:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
                <li>Unlimited personalized guest links &amp; WhatsApp sharing for that card</li>
                <li>Full access to 3D Embossed Lifafa &amp; 3D Shahi Palace Gate opening animations</li>
                <li>Live Read Receipts (Link Opened tracking) &amp; unlimited RSVP responses</li>
                <li>Unlimited live edits to event timings, venue details, and optional sections during the active period</li>
                <li><strong>1-Month (30 Days) Active Validity:</strong> Every card remains live and accessible for 30 days from creation, after which it automatically expires (with an option to renew inside your dashboard).</li>
                <li><strong>Post-Purchase Priority WhatsApp Support:</strong> Direct WhatsApp concierge support is unlocked inside your Host Dashboard after purchasing/activating a card.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-xl font-semibold text-[#2C221E]">
                3. Original Artwork &amp; Intellectual Property
              </h2>
              <p>
                All 3D Lifafa templates, 3D Shahi Palace Gate designs, watercolor palace illustrations, modest bridal artwork, and acoustic audio tracks provided inside Eternal Vowz are 100% original assets licensed for your personal wedding invitation use.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-xl font-semibold text-[#2C221E]">
                4. Support Contact
              </h2>
              <p>
                For any legal or account questions, please contact us via email at{' '}
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
