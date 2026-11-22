import React from 'react';
import { WeddingNavbar, WeddingFooter } from '@/components/layout/WeddingSiteChrome';
import { FileText, ShieldCheck, CreditCard, Scale, HelpCircle } from 'lucide-react';

export const metadata = {
  title: 'Terms & Conditions — Eternal Vowz (E&V)',
  description: 'Official terms and conditions governing the use of Eternal Vowz digital wedding invitation services.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#291418] font-sans flex flex-col justify-between">
      <WeddingNavbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16 w-full">
        <div className="rounded-3xl bg-white border border-[#E2D7BD] p-6 sm:p-10 editorial-card-shadow space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F6EEDB] border border-[#E2D7BD] text-xs font-semibold text-[#8B7355]">
            <FileText className="w-3.5 h-3.5 text-[#C9A84C]" />
            <span>Legal Agreement</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#2C221E]">
            Terms &amp; Conditions
          </h1>
          <p className="text-xs text-[#7A6A5E]">
            Effective Date: November 2026 &bull; Eternal Vowz (E&amp;V)
          </p>

          <div className="space-y-6 text-sm text-[#4A3D34] leading-relaxed">
            <section className="space-y-2">
              <h2 className="font-serif text-xl font-semibold text-[#2C221E]">
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing, browsing, registering on, or purchasing digital wedding cards through <strong>Eternal Vowz (E&amp;V)</strong> (accessible at <code>https://eternal-vowz-in.vercel.app/</code>), you agree to be bound by these Terms and Conditions and our Privacy Policy. If you do not agree with any part of these terms, you must not use our platform.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-xl font-semibold text-[#2C221E]">
                2. Platform Services &amp; Digital Deliverables
              </h2>
              <p>
                Eternal Vowz provides an online web platform enabling users (&quot;Hosts&quot;) to create, customize, and share interactive 3D digital wedding invitations. The service includes:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
                <li>3D animated opening reveals (Royal Embossed Lifafa, Shahi Palace Double-Gates, and Frosted-Blur Veil suites).</li>
                <li>Unlimited unique personalized guest URL links for WhatsApp, SMS, and email sharing.</li>
                <li>Real-time RSVP tracking, headcount consolidation, and catering preference summaries.</li>
                <li>Interactive features including Scratch-to-Reveal wedding dates and background music synchronization.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-xl font-semibold text-[#2C221E]">
                3. Pricing, Billing &amp; Payment Gateway (Razorpay)
              </h2>
              <p>
                Each digital wedding card created on Eternal Vowz is priced at a flat fee of <strong>₹99 (Ninety-Nine Indian Rupees)</strong> per card (inclusive of applicable taxes).
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
                <li>
                  <strong>Payment Processing:</strong> All online financial transactions are processed securely through our authorized payment partner, <strong>Razorpay Software Private Limited</strong>.
                </li>
                <li>
                  <strong>Supported Modes:</strong> UPI (Google Pay, PhonePe, Paytm, BHIM), Credit/Debit Cards (Visa, Mastercard, RuPay), NetBanking, and authorized wallets.
                </li>
                <li>
                  <strong>Security:</strong> Eternal Vowz does not store or process your banking passwords, CVV, or UPI MPIN on its servers. All payments adhere to PCI-DSS Level 1 compliance standards.
                </li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-xl font-semibold text-[#2C221E]">
                4. Validity &amp; 30-Day Card Lifecycle
              </h2>
              <p>
                Each activated ₹99 digital card license includes <strong>1 full month (30 days)</strong> of active hosting starting from the moment of publication.
              </p>
              <p>
                During this 30-day window, hosts enjoy unlimited live edits (updating venues, times, or dress codes) and unlimited guest RSVPs. After 30 days, the public guest link will automatically expire to protect personal wedding information, with an option to extend hosting inside your Host Dashboard.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-xl font-semibold text-[#2C221E]">
                5. User Conduct &amp; Prohibited Activities
              </h2>
              <p>
                You agree not to use the platform to:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
                <li>Upload defamatory, abusive, offensive, unlawful, or sexually explicit content.</li>
                <li>Impersonate any person or couple without their explicit prior written consent.</li>
                <li>Attempt to bypass platform rate limits, tamper with payment verification signatures, or probe security endpoints.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-xl font-semibold text-[#2C221E]">
                6. Intellectual Property Rights
              </h2>
              <p>
                All proprietary 3D envelope code, animations, watercolor assets, design templates, icons, and software used on Eternal Vowz are the exclusive intellectual property of Eternal Vowz. You are granted a personal, non-exclusive, non-transferable license to use the generated card for your wedding event.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-xl font-semibold text-[#2C221E]">
                7. Limitation of Liability
              </h2>
              <p>
                Eternal Vowz is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis. Under no circumstances shall Eternal Vowz or its operators be liable for indirect, incidental, or consequential damages resulting from third-party network outages or telecommunications failures. Our maximum aggregate liability shall not exceed the amount actually paid by you for the specific card license (₹99).
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-xl font-semibold text-[#2C221E]">
                8. Governing Law &amp; Dispute Resolution
              </h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of the Republic of India. Any legal dispute or claim arising under these terms shall be subject to the exclusive jurisdiction of the competent courts in India.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-xl font-semibold text-[#2C221E]">
                9. Contact &amp; Grievance Redressal
              </h2>
              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8DFD1] text-xs space-y-1">
                <p><strong>Merchant Entity:</strong> Eternal Vowz (Operating under Salman Ahmad)</p>
                <p><strong>Grievance Officer:</strong> Salman Ahmad</p>
                <p><strong>Official Email:</strong> <a href="mailto:mrsalman7307@gmail.com" className="text-[#C9A84C] font-semibold underline">mrsalman7307@gmail.com</a></p>
                <p><strong>Hours of Operation:</strong> Monday – Sunday, 9:00 AM – 10:00 PM IST</p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <WeddingFooter />
    </div>
  );
}
