import React from 'react';
import { WeddingNavbar, WeddingFooter } from '@/components/layout/WeddingSiteChrome';
import { RotateCcw } from 'lucide-react';

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#291418] font-sans flex flex-col justify-between">
      <WeddingNavbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="rounded-3xl bg-white border border-[#E2D7BD] p-6 sm:p-10 editorial-card-shadow space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F6EEDB] border border-[#E2D7BD] text-xs font-semibold text-[#8B7355]">
            <RotateCcw className="w-3.5 h-3.5 text-[#C9A84C]" />
            <span>Billing &amp; Refund Assurance</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#2C221E]">
            Refund &amp; Cancellation Policy
          </h1>
          <p className="text-xs text-[#7A6A5E]">
            Applies to all ₹79 Digital Wedding Cards on Eternal Vowz (E&amp;V)
          </p>

          <div className="space-y-5 text-sm text-[#4A3D34] leading-relaxed">
            <section className="space-y-2">
              <h2 className="font-serif text-xl font-semibold text-[#2C221E]">
                1. Free Live Preview Before Purchase
              </h2>
              <p>
                Eternal Vowz allows you to preview all 4 signature 3D Lifafa and 3D Shahi Palace Gate designs on full-screen dedicated sample pages before paying the <strong>₹79 per card</strong> fee.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-xl font-semibold text-[#2C221E]">
                2. 24-Hour Satisfaction Guarantee
              </h2>
              <p>
                If you experience any technical issue with your ₹79 digital wedding card or made a duplicate payment by mistake, you may request a full refund within <strong>24 hours of purchase</strong>, provided the invitation link has not yet been shared with more than 5 guests.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-xl font-semibold text-[#2C221E]">
                3. 1-Month (30-Day) Active Duration
              </h2>
              <p>
                Each ₹79 card license includes 1 full month (30 days) of active hosting and unlimited edits. If your wedding date is postponed, you can edit your date anytime during the 30-day window or renew the card for an additional 30 days.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-xl font-semibold text-[#2C221E]">
                4. How to Request a Refund
              </h2>
              <p>
                Email us at{' '}
                <a href="mailto:mrsalman7307@gmail.com" className="text-[#6E2E3A] font-semibold underline">
                  mrsalman7307@gmail.com
                </a>{' '}
                with your registered email address and card slug. Approved refunds are processed back to your original payment method (UPI / Card / NetBanking) within 5–7 business days.
              </p>
            </section>
          </div>
        </div>
      </main>

      <WeddingFooter />
    </div>
  );
}
