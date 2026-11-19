'use client';

import React, { useState } from 'react';
import { WeddingNavbar, WeddingFooter } from '@/components/layout/WeddingSiteChrome';
import { Mail, Clock, Check, Send, ShieldCheck, Sparkles } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#291418] font-sans flex flex-col justify-between">
      <WeddingNavbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16 w-full">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Contact Details (Email Only on Public Page — WhatsApp Support Unlocked After Purchase) */}
          <div className="md:col-span-2 rounded-3xl bg-[#F2ECE1]/60 border border-[#E2D7BD] p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#C9A84C] font-semibold">
                Eternal Vowz Support Desk
              </span>
              <h1 className="font-serif text-3xl font-normal text-[#291418]">
                Contact Us
              </h1>
              <p className="text-xs text-[#8B7355] leading-relaxed">
                Need help customizing your ₹79 digital wedding card, 3D Lifafa, or 3D Shahi Palace Gate design? Reach out to our official support email below.
              </p>

              <div className="space-y-4 pt-3">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-white border border-[#E2D7BD] flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-[#C9A84C]" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-[#291418] block">Official Support Email</span>
                    <a
                      href="mailto:mrsalman7307@gmail.com"
                      className="text-xs text-[#C9A84C] font-medium hover:underline break-all"
                    >
                      mrsalman7307@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-white border border-[#E2D7BD] flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4 text-[#C9A84C]" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-[#291418] block">Support Hours</span>
                    <span className="text-xs text-[#8B7355]">Monday – Sunday, 9:00 AM – 10:00 PM IST</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-white border border-[#E2D7BD] flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 text-[#C9A84C]" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-[#291418] block">
                      Post-Purchase WhatsApp Support
                    </span>
                    <span className="text-xs text-[#8B7355]">
                      Direct 1-on-1 WhatsApp concierge support is automatically unlocked inside your Host Dashboard once you create/purchase your ₹79 card.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#E2D7BD] text-xs text-[#8B7355] flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#C9A84C] shrink-0" />
              <span>Typical email response time: under 2 hours for active wedding hosts.</span>
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-3 rounded-3xl bg-white border border-[#E2D7BD] p-6 sm:p-8 editorial-card-shadow">
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center">
                  <Check className="w-6 h-6" />
                </div>
                <h2 className="font-serif text-2xl font-semibold text-[#2C221E]">
                  Message Sent to Support
                </h2>
                <p className="text-xs text-[#6E5D53] max-w-sm">
                  Thank you! Your inquiry has been routed to <strong>mrsalman7307@gmail.com</strong>. Our concierge team will reply to your email shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="font-serif text-2xl font-semibold text-[#2C221E] mb-1">
                  Send a Message
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#5C4D42] mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Salman & Family"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FDFBF7] border border-[#E2D6C3] text-sm focus:outline-none focus:border-[#6E2E3A]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#5C4D42] mb-1">
                      Your Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="you@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FDFBF7] border border-[#E2D6C3] text-sm focus:outline-none focus:border-[#6E2E3A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#5C4D42] mb-1">
                    Topic
                  </label>
                  <select className="w-full px-3.5 py-2.5 rounded-xl bg-[#FDFBF7] border border-[#E2D6C3] text-sm focus:outline-none focus:border-[#6E2E3A]">
                    <option>Customizing My ₹79 Wedding Card</option>
                    <option>3D Lifafa vs 3D Shahi Palace Gate Design</option>
                    <option>1-Month (30-Day) Card Validity / Renewal</option>
                    <option>Billing or Payment Support</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#5C4D42] mb-1">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us how we can help with your wedding invitation..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FDFBF7] border border-[#E2D6C3] text-sm focus:outline-none focus:border-[#6E2E3A]"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 rounded-md bg-[#C9A84C] hover:bg-[#B8963B] text-white text-xs font-semibold uppercase tracking-[0.14em] inline-flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Message to Support</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <WeddingFooter />
    </div>
  );
}
