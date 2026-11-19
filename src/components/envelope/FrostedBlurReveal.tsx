'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ThemeId } from '@/types/database';
import { Sparkles, Eye } from 'lucide-react';

interface FrostedBlurRevealProps {
  themeId: ThemeId;
  guestName: string;
  waxSealInitial: string;
  coupleNames: { partner1: string; partner2: string };
  eventDateFormatted: string;
  stage: 'closed' | 'opening';
  isPreview?: boolean;
  onOpen: () => void;
}

export default function FrostedBlurReveal({
  themeId,
  guestName,
  waxSealInitial,
  coupleNames,
  eventDateFormatted,
  stage,
  isPreview = false,
  onOpen,
}: FrostedBlurRevealProps) {
  const isOpening = stage === 'opening';

  const heroImage =
    themeId === 'pearl-veil'
      ? '/assets/invitecraft/hero-pearl-botanical.jpg'
      : themeId === 'royal-emerald'
      ? '/assets/invitecraft/hero-mughal-emerald.jpg'
      : themeId === 'midnight-minimalist'
      ? '/assets/invitecraft/hero-starlight-midnight.jpg'
      : themeId === 'blush-floral'
      ? '/assets/invitecraft/venue-royal-palace.jpg'
      : '/assets/invitecraft/hero-palace-sunset.jpg';

  return (
    <div
      onClick={onOpen}
      className={`relative w-full ${
        isPreview ? 'h-[640px]' : 'h-[100dvh] max-h-[860px] min-h-[640px]'
      } overflow-hidden cursor-pointer select-none bg-[#FAF7F2]`}
    >
      {/* =====================================================================
          1. UNDERLYING FULL CARD SCENE — STARTS HEAVILY BLURRED, MELTS TO HD
      ===================================================================== */}
      <motion.div
        initial={{ filter: 'blur(24px)', scale: 1.09 }}
        animate={
          isOpening
            ? {
                filter: 'blur(0px)',
                scale: 1,
                transition: { duration: 1.55, ease: [0.22, 1, 0.36, 1] },
              }
            : { filter: 'blur(24px)', scale: 1.09 }
        }
        className="absolute inset-0 z-0"
      >
        <img
          src={heroImage}
          alt="Wedding Invitation Artwork"
          className="w-full h-full object-cover pointer-events-none"
        />

        {/* Couple Names underneath the blur — come sharply into focus as blur dissolves */}
        <div className="absolute inset-x-0 top-14 px-6 text-center flex flex-col items-center">
          <span className="font-serif text-[30px] tracking-[0.12em] uppercase text-[#2C221E] leading-tight">
            {coupleNames.partner1}
          </span>
          <span className="font-great-vibes text-[24px] text-[#7A6142] -my-1">and</span>
          <span className="font-serif text-[30px] tracking-[0.12em] uppercase text-[#2C221E] leading-tight">
            {coupleNames.partner2}
          </span>
          <div className="w-16 h-[1px] bg-[#C5A059] my-2.5" />
          <span className="font-serif text-xs tracking-[0.22em] text-[#5C4D42]">
            {eventDateFormatted}
          </span>
        </div>
      </motion.div>

      {/* =====================================================================
          2. FROSTED PEARL MIST VEIL OVERLAY (Dissolves smoothly on tap)
      ===================================================================== */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={
          isOpening
            ? {
                opacity: 0,
                transition: { duration: 1.35, ease: 'easeOut' },
              }
            : { opacity: 1 }
        }
        className="absolute inset-0 z-10 backdrop-blur-md"
        style={{
          background:
            'radial-gradient(circle at 50% 45%, rgba(253,251,247,0.45) 0%, rgba(244,238,228,0.68) 65%, rgba(235,226,212,0.82) 100%)',
        }}
      />

      {/* =====================================================================
          3. EXPANDING LUMINOUS RIPPLE WAVE ON CLICK
      ===================================================================== */}
      {isOpening && (
        <motion.div
          initial={{ scale: 0.2, opacity: 0.95 }}
          animate={{ scale: 4.8, opacity: 0 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full z-20 pointer-events-none"
          style={{
            border: '3px solid rgba(229, 193, 123, 0.95)',
            boxShadow: '0 0 60px 20px rgba(255, 245, 220, 0.75)',
          }}
        />
      )}

      {/* =====================================================================
          4. FLOATING AMBIENT PEARL BOKEH ORBS
      ===================================================================== */}
      {!isOpening && (
        <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
          {[
            { left: '16%', top: '22%', size: 68, delay: 0 },
            { left: '74%', top: '18%', size: 54, delay: 0.6 },
            { left: '22%', top: '74%', size: 82, delay: 1.1 },
            { left: '78%', top: '68%', size: 60, delay: 0.3 },
          ].map((orb, i) => (
            <motion.div
              key={i}
              animate={{ y: [-8, 10, -8], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 4.5 + i, repeat: Infinity, delay: orb.delay, ease: 'easeInOut' }}
              className="absolute rounded-full"
              style={{
                left: orb.left,
                top: orb.top,
                width: orb.size,
                height: orb.size,
                background: 'radial-gradient(circle, rgba(255,255,255,0.85) 0%, rgba(229,193,123,0.18) 65%, transparent 100%)',
              }}
            />
          ))}
        </div>
      )}

      {/* =====================================================================
          5. CENTER FROSTED CRYSTAL MEDALLION & GUEST INVITATION PROMPT
      ===================================================================== */}
      <motion.div
        animate={
          isOpening
            ? {
                scale: 1.25,
                opacity: 0,
                filter: 'blur(8px)',
                transition: { duration: 0.65, ease: 'easeIn' },
              }
            : { scale: 1, opacity: 1, filter: 'blur(0px)' }
        }
        className="absolute inset-0 z-30 flex flex-col items-center justify-between py-12 px-6 text-center pointer-events-none"
      >
        {/* Top Personalized Greeting */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/80 backdrop-blur-md border border-[#D4AF37]/40 shadow-xs">
            <Sparkles className="w-3 h-3 text-[#B89038]" />
            <span className="text-[9px] uppercase tracking-[0.26em] text-[#5C4D42] font-semibold">
              Cinematic Frosted Veil Reveal
            </span>
          </div>
          <p className="font-great-vibes text-[28px] text-[#2C221E] leading-tight pt-1 drop-shadow-xs">
            For {guestName}
          </p>
        </div>

        {/* Center Glassmorphic Reveal Medallion */}
        <div className="flex flex-col items-center">
          <div className="relative w-36 h-36 rounded-full flex items-center justify-center animate-pulse-ring">
            {/* Rotating Outer Golden Filament */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 rounded-full border border-dashed border-[#B89038]/80"
            />
            <div className="w-28 h-28 rounded-full bg-white/80 backdrop-blur-xl border-2 border-[#E5C17B] shadow-[0_18px_45px_rgba(44,34,30,0.16)] flex flex-col items-center justify-center px-2">
              <Eye className="w-4 h-4 text-[#6E2E3A] mb-1" />
              <span className="font-serif text-xl font-bold tracking-widest text-[#2C221E] leading-none">
                {waxSealInitial}
              </span>
              <span className="text-[8px] uppercase tracking-[0.22em] text-[#8C6D46] font-semibold mt-1.5">
                UNVEIL CARD
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Interactive Instruction Pill */}
        <div className="space-y-2">
          <div className="px-5 py-2.5 rounded-full bg-[#2C221E]/90 text-[#FDFBF7] border border-[#E5C17B]/50 shadow-lg backdrop-blur-md">
            <span className="text-[10px] uppercase tracking-[0.22em] font-semibold">
              Tap Anywhere to Reveal Invitation
            </span>
          </div>
          <p className="text-[10px] text-[#5C4D42] font-medium">
            Watch the frosted veil melt into full clarity
          </p>
        </div>
      </motion.div>
    </div>
  );
}
