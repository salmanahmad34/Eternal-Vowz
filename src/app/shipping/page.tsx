import React from 'react';
import { WeddingNavbar, WeddingFooter } from '@/components/layout/WeddingSiteChrome';
import { Truck, CheckCircle2, Clock, Mail, ShieldCheck, Zap } from 'lucide-react';
import { SITE_CONFIG } from '@/config/site';

export const metadata = {
  title: `Shipping & Delivery Policy — ${SITE_CONFIG.name} (${SITE_CONFIG.shortName})`,
  description: `Instant digital delivery terms and timeline for ${SITE_CONFIG.name} digital wedding cards.`,
  alternates: {
    canonical: `${SITE_CONFIG.url}/shipping`,
  },
};

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#291418] font-sans flex flex-col justify-between">
      <WeddingNavbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16 w-full">
        <div className="rounded-3xl bg-white border border-[#E2D7BD] p-6 sm:p-10 editorial-card-shadow space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F6EEDB] border border-[#E2D7BD] text-xs font-semibold text-[#8B7355]">
            <Truck className="w-3.5 h-3.5 text-[#C9A84C]" />
            <span>Digital Fulfillment &amp; Delivery</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#2C221E]">
            Shipping &amp; Delivery Policy
          </h1>
          <p className="text-xs text-[#7A6A5E]">
            Last Updated: November 2026 &bull; Eternal Vowz (E&amp;V) Digital Platform
          </p>

          <div className="space-y-6 text-sm text-[#4A3D34] leading-relaxed">
            {/* Quick Summary Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8DFD1]">
              <div className="flex items-start gap-2.5">
                <Zap className="w-4 h-4 text-[#C9A84C] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-xs text-[#2C221E] block">Instant Delivery</span>
                  <span className="text-[11px] text-[#7A6A5E]">0 to 5 minutes online</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#C9A84C] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-xs text-[#2C221E] block">Shipping Charges</span>
                  <span className="text-[11px] text-[#7A6A5E]">₹0 (Free / No courier fee)</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#C9A84C] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-xs text-[#2C221E] block">Availability</span>
                  <span className="text-[11px] text-[#7A6A5E]">24/7 Access worldwide</span>
                </div>
              </div>
            </div>

            <section className="space-y-2">
              <h2 className="font-serif text-xl font-semibold text-[#2C221E]">
                1. Nature of Products &amp; Services
              </h2>
              <p>
                <strong>Eternal Vowz (E&amp;V)</strong> operates as an online digital platform providing interactive 3D digital wedding invitation suites, animated Lifafa &amp; Palace Gate reveal experiences, personalized guest RSVP links, and host management dashboards.
              </p>
              <p>
                All products and services sold on our platform are <strong>100% digital goods and cloud-hosted web services</strong>. We do not manufacture, sell, or ship physical paper invitation cards, tangible envelopes, or postal courier parcels.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-xl font-semibold text-[#2C221E]">
                2. Mode of Delivery
              </h2>
              <p>
                Upon successful payment of <strong>₹99 per card</strong> via our authorized payment partner (Razorpay), your digital wedding card is delivered electronically through the following methods:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
                <li>
                  <strong>Instant Web Access:</strong> Your unique wedding invitation URL (e.g., <code>eternal-vowz-in.vercel.app/invite/[your-slug]</code>) is activated and accessible immediately.
                </li>
                <li>
                  <strong>Host Dashboard Delivery:</strong> You are automatically provided access to your card management dashboard, where you can view live RSVP responses, copy personalized guest links, and perform unlimited real-time edits.
                </li>
                <li>
                  <strong>Email Confirmation:</strong> A payment receipt and card activation confirmation with your direct invitation link are sent to your registered email address.
                </li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-xl font-semibold text-[#2C221E]">
                3. Delivery Timeline &amp; Turnaround Time (TAT)
              </h2>
              <p>
                Delivery is <strong>instantaneous</strong>. In 99.9% of cases, your digital wedding card and dashboard features are activated within <strong>0 to 5 minutes</strong> of transaction completion.
              </p>
              <p>
                In the rare event of a server delay or bank confirmation latency, activation will be finalized within a maximum of <strong>2 hours</strong>.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-xl font-semibold text-[#2C221E]">
                4. Shipping Costs &amp; Handling Fees
              </h2>
              <p>
                Because our services are delivered 100% digitally through the internet, there are <strong>zero (₹0) shipping or delivery charges</strong>. The price displayed at checkout (₹99 flat inclusive of applicable taxes) is the final amount payable.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-xl font-semibold text-[#2C221E]">
                5. Access Issues &amp; Customer Support
              </h2>
              <p>
                If you have completed your payment but have not received access to your published card within 15 minutes, please reach out to our dedicated support desk with your payment ID and registered email:
              </p>
              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8DFD1] text-xs space-y-1">
                <p><strong>Customer Support Desk:</strong> {SITE_CONFIG.name}</p>
                <p><strong>Email:</strong> <a href={`mailto:${SITE_CONFIG.contactEmail}`} className="text-[#C9A84C] font-semibold underline">{SITE_CONFIG.contactEmail}</a></p>
                <p><strong>Support Window:</strong> Monday – Sunday, 9:00 AM – 10:00 PM IST</p>
                <p><strong>Resolution SLA:</strong> Under 2 hours</p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <WeddingFooter />
    </div>
  );
}
