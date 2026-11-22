import React from 'react';
import { WeddingNavbar, WeddingFooter } from '@/components/layout/WeddingSiteChrome';
import { ShieldCheck, Lock, Eye, Server, FileText } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy — Eternal Vowz (E&V)',
  description: 'Learn how Eternal Vowz collects, stores, and protects host and wedding guest data.',
  alternates: {
    canonical: 'https://eternal-vowz.onrender.com/privacy',
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#291418] font-sans flex flex-col justify-between">
      <WeddingNavbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16 w-full">
        <div className="rounded-3xl bg-white border border-[#E2D7BD] p-6 sm:p-10 editorial-card-shadow space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F6EEDB] border border-[#E2D7BD] text-xs font-semibold text-[#8B7355]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C9A84C]" />
            <span>Data Protection &amp; Confidentiality</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#2C221E]">
            Privacy Policy
          </h1>
          <p className="text-xs text-[#7A6A5E]">
            Last Updated: November 2026 &bull; Eternal Vowz (E&amp;V) Wedding Platform
          </p>

          <div className="space-y-6 text-sm text-[#4A3D34] leading-relaxed">
            <section className="space-y-2">
              <h2 className="font-serif text-xl font-semibold text-[#2C221E]">
                1. Introduction
              </h2>
              <p>
                <strong>Eternal Vowz (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;)</strong> is committed to safeguarding the privacy and security of your personal data. This Privacy Policy outlines our practices regarding the collection, storage, use, and disclosure of information when you use our website (<code>https://eternal-vowz-in.vercel.app/</code>) and digital wedding invitation services.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-xl font-semibold text-[#2C221E]">
                2. Information We Collect
              </h2>
              <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
                <li>
                  <strong>Account &amp; Host Information:</strong> When you register or purchase a card, we collect your name, email address, and authentication credentials.
                </li>
                <li>
                  <strong>Wedding Card Content:</strong> Couple names, ceremony dates, venue names, addresses, maps URLs, timelines, dress codes, menus, and custom love stories provided by you.
                </li>
                <li>
                  <strong>Guest RSVP Data:</strong> Guest names, attendance status (Attending / Declined / Pending), headcount, meal choices, and personal blessing messages submitted through your unique invitation links.
                </li>
                <li>
                  <strong>Technical Data:</strong> Anonymized read receipts (link opened timestamps), IP addresses for fraud prevention and rate limiting, and browser user-agent data.
                </li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-xl font-semibold text-[#2C221E]">
                3. Payment Processing via Razorpay
              </h2>
              <p>
                We integrate with <strong>Razorpay Software Private Limited (&quot;Razorpay&quot;)</strong> as our authorized third-party payment gateway partner for processing online payments (UPI, credit/debit cards, NetBanking).
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
                <li>
                  <strong>Zero Sensitive Storage:</strong> Eternal Vowz does not collect, record, or store any sensitive banking credentials, full credit card numbers, CVV codes, or UPI MPINs on its databases.
                </li>
                <li>
                  <strong>PCI-DSS Compliance:</strong> All payment transactions are encrypted and transmitted directly through Razorpay&apos;s PCI-DSS Level 1 certified gateway.
                </li>
                <li>
                  For more details on Razorpay&apos;s privacy practices, please review{' '}
                  <a href="https://razorpay.com/privacy/" target="_blank" rel="noopener noreferrer" className="text-[#C9A84C] font-semibold underline">
                    Razorpay Privacy Policy
                  </a>.
                </li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-xl font-semibold text-[#2C221E]">
                4. How We Use Your Information
              </h2>
              <p>
                We use collected information solely to:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
                <li>Generate and host your custom 3D digital wedding card suite.</li>
                <li>Track and organize live RSVP attendance and catering headcounts for your event.</li>
                <li>Send transactional receipts, card activation confirmations, and security alerts.</li>
                <li>Protect against unauthorized access, abusive spam, and fraudulent transactions.</li>
              </ul>
              <p className="font-semibold text-xs text-[#2C221E]">
                We NEVER sell, trade, or monetize your guest lists or personal data to third-party telemarketers or advertising networks.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-xl font-semibold text-[#2C221E]">
                5. Data Retention &amp; 30-Day Card Lifecycle
              </h2>
              <p>
                Each digital invitation card remains live for <strong>1 month (30 days)</strong> from publication. Upon expiration, public guest access is closed automatically to protect personal wedding details. Hosts may request permanent deletion of their account and all associated guest data at any time by contacting our support desk.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-xl font-semibold text-[#2C221E]">
                6. Security Measures
              </h2>
              <p>
                We implement industry-standard 256-bit SSL/TLS end-to-end transport encryption, strict HTTP Content Security Policies, cryptographic HMAC signature validation for payment webhooks, and Row-Level Security (RLS) data isolation on our PostgreSQL databases.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-xl font-semibold text-[#2C221E]">
                7. Grievance Officer &amp; Contact Information
              </h2>
              <p>
                In accordance with the Information Technology Act 2000 and the Digital Personal Data Protection Act (DPDPA 2023), the name and contact details of the Grievance Officer are provided below:
              </p>
              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8DFD1] text-xs space-y-1">
                <p><strong>Grievance Officer:</strong> Salman Ahmad</p>
                <p><strong>Entity Name:</strong> Eternal Vowz</p>
                <p><strong>Official Email:</strong> <a href="mailto:mrsalman7307@gmail.com" className="text-[#C9A84C] font-semibold underline">mrsalman7307@gmail.com</a></p>
                <p><strong>Address:</strong> India</p>
                <p><strong>Response Time:</strong> Within 48 hours</p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <WeddingFooter />
    </div>
  );
}
