'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { GuestWithRsvp, RsvpStatus } from '@/types/database';
import { DataService } from '@/lib/data-service';
import {
  ScrollInkHeading,
  ScrollWordReveal,
  ScrollOrnamentDivider,
  ScrollRevealBlock,
} from './ScrollRevealText';
import { CheckCircle2, XCircle, QrCode, Edit3 } from 'lucide-react';

interface RsvpSectionProps {
  guest: GuestWithRsvp | null;
  accentColor?: string;
  darkPalace?: boolean;
  onRsvpSuccess?: () => void;
}

export default function RsvpSection({
  guest,
  darkPalace = false,
  onRsvpSuccess,
}: RsvpSectionProps) {
  const maxGuests = guest?.max_allowed_guests || 6;
  const existingRsvp = guest?.rsvp;

  const [fullName, setFullName] = useState<string>(guest?.guest_name || '');
  const [phone, setPhone] = useState<string>(guest?.phone || '');
  const [status, setStatus] = useState<RsvpStatus>(existingRsvp?.status || 'attending');
  const [headcount, setHeadcount] = useState<number>(existingRsvp?.headcount || 1);
  const [message, setMessage] = useState<string>(existingRsvp?.message || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(Boolean(existingRsvp));
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const combinedMessage = [
        message.trim(),
        phone.trim() ? `Phone: ${phone.trim()}` : '',
      ]
        .filter(Boolean)
        .join(' | ');

      if (guest) {
        await DataService.submitRsvp(guest.id, {
          status,
          headcount: status === 'attending' ? headcount : 0,
          message: combinedMessage || undefined,
        });
      }

      if (status === 'attending') {
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.65 },
            colors: ['#C5A059', '#D88C9A', '#FAF8F5', '#8B1E1E', '#E5C17B'],
          });
        } catch (err) {
          console.warn('Confetti error:', err);
        }
      }

      setIsSubmitted(true);
      setIsEditing(false);
      if (onRsvpSuccess) onRsvpSuccess();
    } catch (err) {
      console.error('RSVP submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputCls = darkPalace
    ? 'w-full px-3.5 py-2 rounded-lg bg-[#281A12] border border-[#E5C17B]/35 text-[#FFF4CF] placeholder:text-[#A99272] focus:outline-none focus:border-[#E5C17B] text-sm font-serif italic'
    : 'w-full px-3.5 py-2 rounded-lg bg-white border border-[#dfd7c8] text-[#2f2a24] placeholder:text-[#a89f91] focus:outline-none focus:border-[#b3989b] text-sm font-serif italic';

  const labelCls = darkPalace
    ? 'block text-xs uppercase tracking-wider font-sans not-italic text-[#E5C17B]'
    : 'block text-xs uppercase tracking-wider font-sans not-italic text-[#6e5d4b]';

  return (
    <div className="w-full py-8 px-3 relative" id="rsvp">
      {/* Compact Section Header */}
      <div className="text-center mb-5">
        <ScrollOrnamentDivider
          className={`flex items-center justify-center gap-3 mb-3 ${darkPalace ? 'opacity-80' : 'opacity-50'}`}
          lineColorClass={darkPalace ? 'bg-[#E5C17B]/70' : undefined}
          dotColorClass={darkPalace ? 'bg-[#E5C17B]' : undefined}
        />
        <ScrollInkHeading
          text="RSVP"
          className={`font-display text-[24px] tracking-[0.1em] uppercase font-normal ${
            darkPalace ? 'text-[#FFF4CF] drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)]' : 'text-[#2f2a24]'
          }`}
        />
        <ScrollWordReveal
          text="Kindly confirm your presence"
          delay={0.12}
          className={`font-great-vibes text-[22px] mt-0.5 ${
            darkPalace ? 'text-[#E5C17B]' : 'text-[#4a4238]'
          }`}
        />
      </div>

      {/* Compact RSVP Card */}
      <ScrollRevealBlock
        direction="up"
        delay={0.06}
        className={`relative rounded-2xl p-5 text-left overflow-hidden ${
          darkPalace
            ? 'bg-[#1B120C]/90 backdrop-blur-sm shadow-[0_18px_48px_rgba(0,0,0,0.68)] border border-[#E5C17B]/40 text-[#FFF4CF]'
            : 'bg-[#fbf9f5] shadow-lg border border-[#e6dec8] text-[#2f2a24]'
        }`}
      >
        {darkPalace ? (
          <>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-2 rounded-xl border border-[#E5C17B]/20 z-0"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-12 -right-12 w-36 h-36 rounded-full opacity-20 z-0"
              style={{
                background: 'radial-gradient(circle, rgba(229,193,123,0.65) 0%, transparent 70%)',
              }}
            />
          </>
        ) : (
          <>
            <img
              src="/assets/invitecraft/floral-garland-corner.jpg"
              alt=""
              aria-hidden="true"
              className="absolute -top-2 -right-2 w-28 h-28 object-contain pointer-events-none select-none z-0 scale-x-[-1] mix-blend-multiply brightness-[1.07] opacity-85"
            />
            <img
              src="/assets/invitecraft/floral-garland-corner.jpg"
              alt=""
              aria-hidden="true"
              className="absolute -bottom-2 -left-2 w-28 h-28 object-contain pointer-events-none select-none z-0 -scale-y-100 mix-blend-multiply brightness-[1.07] opacity-85"
            />
          </>
        )}

        {isSubmitted && !isEditing ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4 relative z-10 py-3 text-center"
          >
            <div
              className="w-12 h-12 mx-auto rounded-full flex items-center justify-center"
              style={{
                backgroundColor: darkPalace
                  ? status === 'attending'
                    ? 'rgba(16,185,129,0.16)'
                    : 'rgba(244,63,94,0.16)'
                  : status === 'attending'
                  ? '#ECFDF5'
                  : '#FEF2F2',
              }}
            >
              {status === 'attending' ? (
                <CheckCircle2 className={`w-7 h-7 ${darkPalace ? 'text-emerald-400' : 'text-emerald-700'}`} />
              ) : (
                <XCircle className={`w-7 h-7 ${darkPalace ? 'text-rose-400' : 'text-rose-600'}`} />
              )}
            </div>

            <div>
              <h4 className={`font-great-vibes text-[28px] leading-tight ${darkPalace ? 'text-[#FFF4CF]' : 'text-[#2f2a24]'}`}>
                {status === 'attending' ? 'Thank You for Confirming!' : 'We Will Miss You Dearly'}
              </h4>
              <p className={`font-serif italic text-xs mt-1 ${darkPalace ? 'text-[#E8D7B9]' : 'text-[#5c5246]'}`}>
                {status === 'attending'
                  ? `Confirmed for ${headcount} ${headcount === 1 ? 'Guest' : 'Guests'} (${fullName || guest?.guest_name || 'VIP Guest'})`
                  : 'Your response has been recorded.'}
              </p>
            </div>

            {status === 'attending' && (
              <div
                className={`p-3.5 rounded-xl text-left flex items-center justify-between gap-3 ${
                  darkPalace
                    ? 'bg-[#26180F] border border-[#E5C17B]/35'
                    : 'bg-[#f5f0e6] border border-[#d6cbb9]'
                }`}
              >
                <div className="space-y-0.5">
                  <span
                    className={`text-[9.5px] font-sans uppercase tracking-widest font-bold block ${
                      darkPalace ? 'text-[#E5C17B]' : 'text-[#8c734b]'
                    }`}
                  >
                    VIP ENTRY PASS
                  </span>
                  <p className={`font-serif font-bold text-sm ${darkPalace ? 'text-[#FFF4CF]' : 'text-[#2f2a24]'}`}>
                    {fullName || guest?.guest_name || 'Honored Guest'}
                  </p>
                  <p className={`font-serif italic text-xs ${darkPalace ? 'text-[#E8D7B9]' : 'text-[#5c5246]'}`}>
                    Admit {headcount} {headcount === 1 ? 'Guest' : 'Guests'}
                  </p>
                </div>
                <div
                  className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 ${
                    darkPalace
                      ? 'bg-[#1A110B] border border-[#E5C17B]/40 text-[#E5C17B]'
                      : 'bg-white border border-[#e2d9c8] text-[#2f2a24]'
                  }`}
                >
                  <QrCode className="w-6 h-6" />
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className={`inline-flex items-center gap-1.5 text-xs font-serif italic underline cursor-pointer ${
                darkPalace ? 'text-[#E5C17B] hover:text-[#FFF4CF]' : 'text-[#7a6855] hover:text-[#2f2a24]'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit RSVP</span>
            </button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5 relative z-10 font-serif italic text-sm">
            {/* Full Name */}
            <div className="space-y-1">
              <label className={labelCls}>
                Full Name <span className={darkPalace ? 'text-[#E5C17B]' : 'text-rose-700'}>*</span>
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your name"
                className={inputCls}
              />
            </div>

            {/* Phone / WhatsApp */}
            <div className="space-y-1">
              <label className={labelCls}>Phone / WhatsApp</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className={inputCls}
              />
            </div>

            {/* Attendance Toggle Pills */}
            <div className="space-y-1.5">
              <label className={labelCls}>
                Will You Attend? <span className={darkPalace ? 'text-[#E5C17B]' : 'text-rose-700'}>*</span>
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setStatus('attending')}
                  className={`py-2 px-3 rounded-lg text-xs font-sans not-italic font-medium border transition-all cursor-pointer ${
                    status === 'attending'
                      ? darkPalace
                        ? 'bg-[#E5C17B]/20 border-[#E5C17B] text-[#FFF4CF]'
                        : 'bg-[#6E2E3A] border-[#6E2E3A] text-white'
                      : darkPalace
                      ? 'bg-[#281A12] border-[#E5C17B]/25 text-[#D8C398]'
                      : 'bg-white border-[#dfd7c8] text-[#5c5246]'
                  }`}
                >
                  ✓ Yes, Attending
                </button>
                <button
                  type="button"
                  onClick={() => setStatus('declined')}
                  className={`py-2 px-3 rounded-lg text-xs font-sans not-italic font-medium border transition-all cursor-pointer ${
                    status === 'declined'
                      ? darkPalace
                        ? 'bg-[#E5C17B]/20 border-[#E5C17B] text-[#FFF4CF]'
                        : 'bg-[#6E2E3A] border-[#6E2E3A] text-white'
                      : darkPalace
                      ? 'bg-[#281A12] border-[#E5C17B]/25 text-[#D8C398]'
                      : 'bg-white border-[#dfd7c8] text-[#5c5246]'
                  }`}
                >
                  ✕ Can&apos;t Attend
                </button>
              </div>
            </div>

            {/* Compact Guests Stepper (Inline) */}
            {status === 'attending' && (
              <div className="flex items-center justify-between pt-0.5">
                <label className={labelCls}>Total Guests</label>
                <div
                  className={`inline-flex items-center rounded-lg overflow-hidden ${
                    darkPalace
                      ? 'bg-[#281A12] border border-[#E5C17B]/35'
                      : 'bg-white border border-[#dfd7c8]'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setHeadcount(Math.max(1, headcount - 1))}
                    disabled={headcount <= 1}
                    className={`px-3 py-1 text-base disabled:opacity-40 transition-colors cursor-pointer ${
                      darkPalace
                        ? 'text-[#E5C17B] hover:bg-[#3A2618]'
                        : 'text-[#5c5246] hover:bg-[#f5f0e6]'
                    }`}
                  >
                    &minus;
                  </button>
                  <span
                    className={`px-3.5 py-1 text-sm font-sans not-italic font-semibold min-w-[32px] text-center ${
                      darkPalace ? 'text-[#FFF4CF]' : 'text-[#2f2a24]'
                    }`}
                  >
                    {headcount}
                  </span>
                  <button
                    type="button"
                    onClick={() => setHeadcount(Math.min(maxGuests, headcount + 1))}
                    disabled={headcount >= maxGuests}
                    className={`px-3 py-1 text-base disabled:opacity-40 transition-colors cursor-pointer ${
                      darkPalace
                        ? 'text-[#E5C17B] hover:bg-[#3A2618]'
                        : 'text-[#5c5246] hover:bg-[#f5f0e6]'
                    }`}
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Short Wishes / Message */}
            <div className="space-y-1">
              <label className={labelCls}>Wishes / Message (Optional)</label>
              <textarea
                rows={2}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your blessings for the couple..."
                className={`${inputCls} resize-none`}
              />
            </div>

            {/* Submit Button */}
            <div className="pt-1">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-2.5 rounded-xl font-sans text-sm tracking-wide shadow-sm transition-all cursor-pointer disabled:opacity-60 ${
                  darkPalace
                    ? 'bg-gradient-to-r from-[#D5AE5C] via-[#E8C97E] to-[#C99B3B] hover:brightness-105 text-[#1A110B] font-semibold shadow-[0_8px_22px_rgba(201,155,59,0.32)]'
                    : 'bg-[#6E2E3A] hover:bg-[#58222C] text-white font-medium'
                }`}
              >
                {isSubmitting ? 'Sending RSVP...' : 'Confirm RSVP'}
              </button>
            </div>
          </form>
        )}
      </ScrollRevealBlock>
    </div>
  );
}
