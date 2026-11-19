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
import { 
  CheckCircle2, 
  XCircle, 
  QrCode,
  Edit3,
  AlertTriangle,
  Music
} from 'lucide-react';

interface RsvpSectionProps {
  guest: GuestWithRsvp | null;
  accentColor?: string;
  onRsvpSuccess?: () => void;
}

const DIETARY_OPTIONS = [
  'Gluten-free / Celiac',
  'Lactose-free',
  'Vegetarian',
  'Vegan',
  'Nut allergy',
  'Seafood allergy',
];

const MAIN_COURSES = [
  'Royal Halal Chicken & Biryani',
  'Halal Mutton Rogan Josh',
  'Halal Grilled Fish',
  'Shahi Vegetarian',
];

export default function RsvpSection({
  guest,
  onRsvpSuccess,
}: RsvpSectionProps) {
  const maxGuests = guest?.max_allowed_guests || 4;
  const existingRsvp = guest?.rsvp;

  const [fullName, setFullName] = useState<string>(guest?.guest_name || '');
  const [phone, setPhone] = useState<string>(guest?.phone || '');
  const [email, setEmail] = useState<string>(guest?.email || '');
  const [status, setStatus] = useState<RsvpStatus>(existingRsvp?.status || 'attending');
  const [headcount, setHeadcount] = useState<number>(existingRsvp?.headcount || 1);
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
  const [otherAllergies, setOtherAllergies] = useState<string>('');
  const [mealChoice, setMealChoice] = useState<string>(existingRsvp?.meal_choice || MAIN_COURSES[0]);
  const [songRequest, setSongRequest] = useState<string>('');
  const [message, setMessage] = useState<string>(existingRsvp?.message || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(Boolean(existingRsvp));
  const [isEditing, setIsEditing] = useState(false);

  const toggleDietary = (item: string) => {
    setSelectedDietary((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const combinedMeal = [
        mealChoice,
        ...selectedDietary,
        otherAllergies ? `Note: ${otherAllergies}` : '',
      ]
        .filter(Boolean)
        .join(' • ');

      const combinedMessage = [
        message,
        songRequest ? `🎵 Song: ${songRequest}` : '',
      ]
        .filter(Boolean)
        .join(' | ');

      if (guest) {
        await DataService.submitRsvp(guest.id, {
          status,
          headcount: status === 'attending' ? headcount : 0,
          meal_choice: status === 'attending' ? combinedMeal : undefined,
          message: combinedMessage,
        });
      }

      if (status === 'attending') {
        try {
          confetti({
            particleCount: 90,
            spread: 75,
            origin: { y: 0.65 },
            colors: ['#C5A059', '#D88C9A', '#FAF8F5', '#8B1E1E', '#B3989B'],
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

  return (
    <div className="w-full py-10 px-3 relative" id="rsvp">
      {/* Section Header — Scroll Animated */}
      <div className="text-center mb-8">
        <ScrollOrnamentDivider className="flex items-center justify-center gap-3 mb-4 opacity-50" />
        <ScrollInkHeading
          text="RSVP"
          className="font-display text-[26px] tracking-[0.08em] text-[#2f2a24] uppercase font-normal"
        />
        <ScrollWordReveal
          text="We can't wait!"
          delay={0.1}
          className="font-serif italic text-[14px] text-[#4a4238] mt-1"
        />
        <ScrollWordReveal
          text="Please kindly confirm your presence below"
          delay={0.2}
          className="font-great-vibes text-[22px] text-[#2f2a24] mt-1"
        />
      </div>

      {/* Main Cream Parchment RSVP Card with Original Watercolor Floral Corners */}
      <ScrollRevealBlock
        direction="up"
        delay={0.08}
        className="relative bg-[#fbf9f5] rounded-2xl p-6 sm:p-7 shadow-lg border border-[#e6dec8] text-left text-[#2f2a24] overflow-hidden"
      >
        {/* Top-Right Original Watercolor Floral Bouquet */}
        <img
          src="/assets/invitecraft/floral-garland-corner.jpg"
          alt=""
          aria-hidden="true"
          className="absolute -top-2 -right-2 w-36 h-36 object-contain pointer-events-none select-none z-0 scale-x-[-1] mix-blend-multiply opacity-90"
        />

        {/* Bottom-Left Original Watercolor Floral Bouquet */}
        <img
          src="/assets/invitecraft/floral-garland-corner.jpg"
          alt=""
          aria-hidden="true"
          className="absolute -bottom-2 -left-2 w-36 h-36 object-contain pointer-events-none select-none z-0 -scale-y-100 mix-blend-multiply opacity-90"
        />

        {isSubmitted && !isEditing ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-5 relative z-10 py-4 text-center"
          >
            <div
              className="w-14 h-14 mx-auto rounded-full flex items-center justify-center"
              style={{ backgroundColor: status === 'attending' ? '#ECFDF5' : '#FEF2F2' }}
            >
              {status === 'attending' ? (
                <CheckCircle2 className="w-8 h-8 text-emerald-700" />
              ) : (
                <XCircle className="w-8 h-8 text-rose-600" />
              )}
            </div>

            <div>
              <h4 className="font-great-vibes text-3xl text-[#2f2a24]">
                {status === 'attending' ? 'Thank You for Celebrating With Us!' : 'We Will Miss You Dearly'}
              </h4>
              <p className="font-serif italic text-sm text-[#5c5246] mt-1">
                {status === 'attending'
                  ? `Confirmed for ${headcount} ${headcount === 1 ? 'Guest' : 'Guests'} (${fullName || guest?.guest_name || 'VIP Guest'})`
                  : 'Your response has been recorded. Thank you for letting us know.'}
              </p>
            </div>

            {status === 'attending' && (
              <div className="p-4 rounded-xl bg-[#f5f0e6] border border-[#d6cbb9] text-left flex items-center justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-sans uppercase tracking-widest text-[#8c734b] font-bold block">
                    VIP DIGITAL ENTRY PASS
                  </span>
                  <p className="font-serif font-bold text-base text-[#2f2a24]">
                    {fullName || guest?.guest_name || 'Honored Guest'}
                  </p>
                  <p className="font-serif italic text-xs text-[#5c5246]">
                    Admit {headcount} &bull; {mealChoice}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-white border border-[#e2d9c8] flex items-center justify-center shrink-0">
                  <QrCode className="w-7 h-7 text-[#2f2a24]" />
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-1.5 text-xs font-serif italic text-[#7a6855] hover:text-[#2f2a24] underline"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Modify RSVP Response</span>
            </button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 relative z-10 font-serif italic text-[15px]">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="block text-[#2f2a24]">
                Full name <span className="text-rose-700">*</span>
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your name"
                className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#dfd7c8] text-[#2f2a24] placeholder:text-[#a89f91] focus:outline-none focus:border-[#b3989b] text-sm font-serif italic"
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-1.5">
              <label className="block text-[#2f2a24]">Phone number</label>
              <div className="flex gap-2">
                <div className="px-3 py-2.5 rounded-lg bg-white border border-[#dfd7c8] text-xs font-sans not-italic text-[#4a4238] flex items-center gap-1 shrink-0">
                  <span>🇺🇸 +1</span>
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="201 555 0123"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#dfd7c8] text-[#2f2a24] placeholder:text-[#a89f91] focus:outline-none focus:border-[#b3989b] text-sm font-serif italic"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-[#2f2a24]">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#dfd7c8] text-[#2f2a24] placeholder:text-[#a89f91] focus:outline-none focus:border-[#b3989b] text-sm font-serif italic"
              />
            </div>

            {/* Will you attend? */}
            <div className="space-y-2 pt-1">
              <label className="block text-[#2f2a24]">
                Will you attend? <span className="text-rose-700">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="radio"
                    name="attendance"
                    checked={status === 'attending'}
                    onChange={() => setStatus('attending')}
                    className="w-4 h-4 accent-[#5c3a3e]"
                  />
                  <span className="text-sm leading-tight">Yes, I will attend</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="radio"
                    name="attendance"
                    checked={status === 'declined'}
                    onChange={() => setStatus('declined')}
                    className="w-4 h-4 accent-[#5c3a3e]"
                  />
                  <span className="text-sm leading-tight">No, I can&apos;t attend</span>
                </label>
              </div>
            </div>

            {status === 'attending' && (
              <>
                {/* Number of guests stepper */}
                <div className="space-y-2 pt-1">
                  <label className="block text-[#2f2a24]">
                    Number of guests (including yourself)
                  </label>
                  <div className="inline-flex items-center rounded-lg bg-white border border-[#dfd7c8] overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setHeadcount(Math.max(1, headcount - 1))}
                      disabled={headcount <= 1}
                      className="px-3.5 py-1.5 text-base text-[#5c5246] hover:bg-[#f5f0e6] disabled:opacity-40 transition-colors"
                    >
                      &minus;
                    </button>
                    <span className="px-4 py-1.5 text-sm font-medium text-[#2f2a24] min-w-[36px] text-center">
                      {headcount}
                    </span>
                    <button
                      type="button"
                      onClick={() => setHeadcount(Math.min(maxGuests, headcount + 1))}
                      disabled={headcount >= maxGuests}
                      className="px-3.5 py-1.5 text-base text-[#5c5246] hover:bg-[#f5f0e6] disabled:opacity-40 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Food allergies and intolerances */}
                <div className="space-y-2.5 pt-2">
                  <div className="flex items-center gap-1.5 text-[#2f2a24]">
                    <AlertTriangle className="w-4 h-4 text-[#7a6855] shrink-0" />
                    <span>Food allergies and intolerances</span>
                  </div>
                  <p className="text-xs text-[#6e6254] leading-relaxed">
                    It is very important for us to know any dietary restrictions. Select all that apply:
                  </p>
                  <div className="grid grid-cols-2 gap-2.5 pt-1">
                    {DIETARY_OPTIONS.map((item) => (
                      <label key={item} className="flex items-center gap-2 cursor-pointer text-sm">
                        <input
                          type="checkbox"
                          checked={selectedDietary.includes(item)}
                          onChange={() => toggleDietary(item)}
                          className="w-4 h-4 rounded border-[#c7bca9] accent-[#7a4b52]"
                        />
                        <span className="leading-tight">{item}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Other allergies */}
                <div className="space-y-1.5">
                  <label className="block text-[#2f2a24] text-sm">
                    Other allergies or restrictions:
                  </label>
                  <input
                    type="text"
                    value={otherAllergies}
                    onChange={(e) => setOtherAllergies(e.target.value)}
                    placeholder="E.g. egg allergy, fructose intolerance..."
                    className="w-full px-3.5 py-2 rounded-lg bg-white border border-[#dfd7c8] text-[#2f2a24] placeholder:text-[#a89f91] focus:outline-none focus:border-[#b3989b] text-xs font-serif italic"
                  />
                </div>

                {/* Main Course Choice */}
                <div className="space-y-2 pt-1">
                  <label className="block text-[#2f2a24]">
                    Which main course would you prefer?
                  </label>
                  <div className="space-y-2">
                    {MAIN_COURSES.map((course) => (
                      <label key={course} className="flex items-center gap-2.5 cursor-pointer text-sm">
                        <input
                          type="radio"
                          name="mainCourse"
                          checked={mealChoice === course}
                          onChange={() => setMealChoice(course)}
                          className="w-4 h-4 accent-[#5c3a3e]"
                        />
                        <span>{course}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Song Request */}
                <div className="space-y-1.5 pt-1">
                  <label className="flex items-center gap-1.5 text-[#2f2a24]">
                    <Music className="w-4 h-4 text-[#5c3a3e]" />
                    <span>Song request for the party</span>
                  </label>
                  <input
                    type="text"
                    value={songRequest}
                    onChange={(e) => setSongRequest(e.target.value)}
                    placeholder='E.g. "Dancing Queen" by ABBA'
                    className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#dfd7c8] text-[#2f2a24] placeholder:text-[#a89f91] focus:outline-none focus:border-[#b3989b] text-sm font-serif italic"
                  />
                </div>
              </>
            )}

            {/* Message for the couple */}
            <div className="space-y-1.5 pt-1">
              <label className="block text-[#2f2a24]">
                Message for the couple (optional)
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write us a few words..."
                className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#dfd7c8] text-[#2f2a24] placeholder:text-[#a89f91] focus:outline-none focus:border-[#b3989b] text-sm font-serif italic resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-[#b3989b] hover:bg-[#9e8285] text-white font-serif italic text-base tracking-wide shadow-sm transition-all cursor-pointer disabled:opacity-60"
              >
                {isSubmitting ? 'Sending RSVP...' : 'Send RSVP'}
              </button>
            </div>
          </form>
        )}
      </ScrollRevealBlock>
    </div>
  );
}
