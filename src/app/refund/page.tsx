import React from 'react';
import { WeddingNavbar, WeddingFooter } from '@/components/layout/WeddingSiteChrome';
import { RotateCcw, CheckCircle2, Clock, Mail, ShieldAlert, CreditCard } from 'lucide-react';

export const metadata = {
  title: 'Cancellation & Refund Policy — Eternal Vowz (E&V)',
  description: 'Official cancellation and refund policy for Eternal Vowz digital wedding card services with 100% money-back SLA and 24-hour window.',
  alternates: {
    canonical: 'https://eternal-vowz.onrender.com/refund',
  },
  openGraph: {
    title: 'Cancellation & Refund Policy — Eternal Vowz',
    description: 'Official cancellation and refund policy for Eternal Vowz digital wedding card services.',
    url: 'https://eternal-vowz.onrender.com/refund',
    siteName: 'Eternal Vowz',
  },
};

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#291418] font-sans flex flex-col justify-between">
      <WeddingNavbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16 w-full">
        <div className="rounded-3xl bg-white border border-[#E2D7BD] p-6 sm:p-10 editorial-card-shadow space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F6EEDB] border border-[#E2D7BD] text-xs font-semibold text-[#8B7355]">
            <RotateCcw className="w-3.5 h-3.5 text-[#C9A84C]" />
            <span>Billing, Cancellations &amp; Refunds</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#2C221E]">
            Cancellation &amp; Refund Policy
          </h1>
          <p className="text-xs text-[#7A6A5E]">
            Last Updated: November 2026 &bull; Eternal Vowz (E&amp;V) Digital Platform
          </p>

          <div className="space-y-6 text-sm text-[#4A3D34] leading-relaxed">
            {/* Quick SLA Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8DFD1]">
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#C9A84C] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-xs text-[#2C221E] block">Request Window</span>
                  <span className="text-[11px] text-[#7A6A5E]">Within 24 hours of payment</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <CreditCard className="w-4 h-4 text-[#C9A84C] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-xs text-[#2C221E] block">Refund Timeline (TAT)</span>
                  <span className="text-[11px] text-[#7A6A5E]">5 to 7 working business days</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#C9A84C] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-xs text-[#2C221E] block">Payout Mode</span>
                  <span className="text-[11px] text-[#7A6A5E]">Original Payment Source</span>
                </div>
              </div>
            </div>

            <section className="space-y-2">
              <h2 className="font-serif text-xl font-semibold text-[#2C221E]">
                1. Free Pre-Purchase Inspection
              </h2>
              <p>
                At <strong>Eternal Vowz (E&amp;V)</strong>, customer satisfaction and trust are our top priorities. We provide full, interactive, unwatermarked demo previews for all 8 signature 3D digital wedding cards (including Lifafa animations, Shahi Palace Gate reveals, and Frosted Veil suites) so hosts can thoroughly experience each design before deciding to pay the flat <strong>₹99 per card</strong> activation fee.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-xl font-semibold text-[#2C221E]">
                2. Cancellation Policy
              </h2>
              <p>
                Because our digital card generation and cloud hosting are delivered instantaneously upon payment confirmation, cancellation requests must be made within <strong>24 hours of purchase</strong>.
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
                <li>
                  <strong>Eligible for Cancellation:</strong> Any order where you requested cancellation within 24 hours and the generated invitation link has not been shared with or accessed by more than 5 guest recipients.
                </li>
                <li>
                  <strong>Ineligible for Cancellation:</strong> Cancellation cannot be accepted once the invitation link has been actively distributed to your wedding guest list and live RSVPs have been logged.
                </li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-xl font-semibold text-[#2C221E]">
                3. Refund Eligibility &amp; Criteria
              </h2>
              <p>
                A 100% full refund will be granted in the following scenarios:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
                <li>
                  <strong>Duplicate Transactions:</strong> If your account was charged twice for the same card due to a network glitch or bank timeout.
                </li>
                <li>
                  <strong>Technical Non-Delivery:</strong> If the platform failed to generate your digital card URL or provide access to your dashboard within 2 hours of payment, and our support team is unable to resolve it.
                </li>
                <li>
                  <strong>Payment Deducted but Order Failed:</strong> If your bank account or UPI was debited but Razorpay marked the transaction as failed, the funds will be automatically reversed by your issuing bank within 3–5 working days.
                </li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-xl font-semibold text-[#2C221E]">
                4. Refund Processing Timeframe (TAT)
              </h2>
              <p>
                Once an authorized refund request is approved by our billing desk:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
                <li>
                  The refund is initiated immediately through <strong>Razorpay</strong> back to your original payment method (UPI account, Credit/Debit Card, or NetBanking).
                </li>
                <li>
                  The funds typically reflect in your bank account or card balance within <strong>5 to 7 business working days</strong>, subject to your issuing bank&apos;s settlement cycle.
                </li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-xl font-semibold text-[#2C221E]">
                5. How to Initiate a Refund or Cancellation Request
              </h2>
              <p>
                To request a refund, please send an email to our support team with the subject line <code>Refund Request — [Your Order ID / Registered Email]</code>:
              </p>
              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8DFD1] text-xs space-y-1">
                <p><strong>Official Billing Desk:</strong> Eternal Vowz</p>
                <p><strong>Email:</strong> <a href="mailto:mrsalman7307@gmail.com" className="text-[#C9A84C] font-semibold underline">mrsalman7307@gmail.com</a></p>
                <p><strong>Required Information:</strong> Registered Email Address, Razorpay Payment ID / Transaction ID, and Reason for Refund.</p>
                <p><strong>Acknowledgement Time:</strong> Under 2 hours</p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <WeddingFooter />
    </div>
  );
}
