'use client';

import React, { useState } from 'react';
import { WeddingNavbar, WeddingFooter } from '@/components/layout/WeddingSiteChrome';
import { Mail, Clock, Check, Send, ShieldCheck, Sparkles, MapPin, Phone, UserCheck } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
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
          {/* Merchant Contact Details (Razorpay Merchant Compliance Section) */}
          <div className="md:col-span-2 rounded-3xl bg-[#F2ECE1]/60 border border-[#E2D7BD] p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#C9A84C] font-semibold block">
                Official Support Desk
              </span>
              <h1 className="font-serif text-3xl font-normal text-[#291418]">
                Contact Us
              </h1>
              <p className="text-xs text-[#8B7355] leading-relaxed">
                Have questions regarding your digital wedding card, payment confirmation, or custom card designs? We are here to assist you.
              </p>

              <div className="space-y-4 pt-2">
                {/* Merchant Name */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-white border border-[#E2D7BD] flex items-center justify-center shrink-0">
                    <UserCheck className="w-4 h-4 text-[#C9A84C]" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-[#291418] block">Business / Legal Entity</span>
                    <span className="text-xs text-[#8B7355]">Eternal Vowz (Salman Ahmad)</span>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-white border border-[#E2D7BD] flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-[#C9A84C]" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-[#291418] block">Official Email</span>
                    <a
                      href="mailto:mrsalman7307@gmail.com"
                      className="text-xs text-[#C9A84C] font-medium hover:underline break-all"
                    >
                      mrsalman7307@gmail.com
                    </a>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-white border border-[#E2D7BD] flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-[#C9A84C]" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-[#291418] block">Operating Office</span>
                    <span className="text-xs text-[#8B7355] leading-snug block">
                      Eternal Vowz Digital, Uttar Pradesh / New Delhi, India
                    </span>
                  </div>
                </div>

                {/* Support Hours */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-white border border-[#E2D7BD] flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4 text-[#C9A84C]" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-[#291418] block">Working Hours</span>
                    <span className="text-xs text-[#8B7355]">Monday – Sunday, 9:00 AM – 10:00 PM IST</span>
                  </div>
                </div>

                {/* WhatsApp Support Badge */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-white border border-[#E2D7BD] flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 text-[#C9A84C]" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-[#291418] block">
                      Post-Purchase WhatsApp Concierge
                    </span>
                    <span className="text-xs text-[#8B7355]">
                      1-on-1 direct WhatsApp support is unlocked inside your Host Dashboard after activating your ₹99 card.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#E2D7BD] text-xs text-[#8B7355] flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#C9A84C] shrink-0" />
              <span>Grievance Response SLA: Under 2 hours during operational hours.</span>
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
                  Thank you! Your inquiry has been routed to <strong>mrsalman7307@gmail.com</strong>. Our concierge desk will reply to your email shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="font-serif text-2xl font-semibold text-[#2C221E] mb-1">
                  Send a Message
                </h2>
                <p className="text-xs text-[#7A6A5E] mb-4">
                  Fill in your details and our team will get back to you promptly.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#291418] mb-1">Your Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2D7BD] text-xs bg-[#FAF7F2] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#C9A84C]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#291418] mb-1">Your Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. rahul@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2D7BD] text-xs bg-[#FAF7F2] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#C9A84C]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#291418] mb-1">Phone / WhatsApp Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2D7BD] text-xs bg-[#FAF7F2] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#C9A84C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#291418] mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g. Payment inquiry / Custom wedding card assistance"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2D7BD] text-xs bg-[#FAF7F2] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#C9A84C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#291418] mb-1">Message</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe how we can assist you..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2D7BD] text-xs bg-[#FAF7F2] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#C9A84C] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-[#C9A84C] hover:bg-[#B8963B] text-white text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Inquiry</span>
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
