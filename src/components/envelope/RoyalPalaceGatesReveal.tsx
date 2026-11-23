'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ThemeId } from '@/types/database';
import { Sparkles, KeyRound } from 'lucide-react';

interface RoyalPalaceGatesRevealProps {
  themeId: ThemeId;
  guestName: string;
  waxSealInitial: string;
  coupleNames: { partner1: string; partner2: string };
  eventDateFormatted: string;
  stage: 'closed' | 'opening';
  isPreview?: boolean;
  onOpen: () => void;
}

export default function RoyalPalaceGatesReveal({
  guestName,
  waxSealInitial,
  coupleNames,
  eventDateFormatted,
  stage,
  isPreview = false,
  onOpen,
}: RoyalPalaceGatesRevealProps) {
  const isOpening = stage === 'opening';

  return (
    <div
      onClick={onOpen}
      className={`relative w-full ${
        isPreview ? 'h-[640px]' : 'h-[100dvh] max-h-[860px] min-h-[640px]'
      } overflow-hidden cursor-pointer select-none`}
      style={{
        perspective: '1600px',
        background: 'radial-gradient(circle at 50% 35%, #FFF8EC 0%, #F4E3C6 60%, #DEC39B 100%)',
      }}
    >
      {/* =====================================================================
          1. INNER SANCTUARY / CARD PREVIEW BEHIND THE PALACE DOORS
          (Revealed & Zooms Forward as the Double Doors Swing Open)
      ===================================================================== */}
      <motion.div
        initial={{ scale: 0.86, opacity: 0.6 }}
        animate={
          isOpening
            ? {
                scale: 1.02,
                opacity: 1,
                transition: { delay: 0.25, duration: 1.35, ease: [0.22, 1, 0.36, 1] },
              }
            : { scale: 0.86, opacity: 0.6 }
        }
        className="absolute inset-0 z-0 flex flex-col items-center justify-center p-6 text-center"
      >
        {/* Golden Sunburst Rays Behind Doors */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          className="absolute w-[520px] h-[520px] rounded-full opacity-35 pointer-events-none"
          style={{
            background:
              'conic-gradient(from 0deg, transparent 0deg, rgba(212,175,55,0.45) 20deg, transparent 40deg, rgba(212,175,55,0.45) 60deg, transparent 80deg, rgba(212,175,55,0.45) 100deg, transparent 120deg, rgba(212,175,55,0.45) 140deg, transparent 160deg, rgba(212,175,55,0.45) 180deg, transparent 200deg, rgba(212,175,55,0.45) 220deg, transparent 240deg, rgba(212,175,55,0.45) 260deg, transparent 280deg, rgba(212,175,55,0.45) 300deg, transparent 320deg, rgba(212,175,55,0.45) 340deg, transparent 360deg)',
          }}
        />

        <div className="relative w-full max-w-[310px] rounded-3xl bg-[#FFFDF9] border-2 border-[#D4AF37] shadow-[0_25px_70px_rgba(94,43,56,0.35)] p-7 flex flex-col items-center">
          <div className="w-11 h-11 rounded-full bg-[#6E2E3A]/10 border border-[#D4AF37] flex items-center justify-center mb-3">
            <Sparkles className="w-5 h-5 text-[#9C762B]" />
          </div>
          <span className="text-[9px] font-sans tracking-[0.28em] uppercase text-[#8C6D46] font-semibold">
            WELCOME TO THE ROYAL PALACE
          </span>
          <h3 className="font-serif text-2xl tracking-[0.1em] text-[#2C221E] uppercase mt-3">
            {coupleNames.partner1}
          </h3>
          <span className="font-great-vibes text-2xl text-[#6E2E3A] -my-1">weds</span>
          <h3 className="font-serif text-2xl tracking-[0.1em] text-[#2C221E] uppercase">
            {coupleNames.partner2}
          </h3>
          <div className="w-16 h-[1px] bg-[#D4AF37] my-3" />
          <span className="font-serif text-xs tracking-[0.22em] text-[#6E5D53]">
            {eventDateFormatted}
          </span>
        </div>
      </motion.div>

      {/* =====================================================================
          2. TOP ROYAL PALACE JHAROKHA ARCH HEADER (Stationary Outer Arch)
      ===================================================================== */}
      <motion.div
        animate={
          isOpening
            ? { y: -30, opacity: 0, transition: { delay: 0.9, duration: 0.7 } }
            : { y: 0, opacity: 1 }
        }
        className="absolute top-0 inset-x-0 z-30 pt-5 pb-4 px-4 text-center pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, rgba(46,16,24,0.96) 0%, rgba(74,26,38,0.88) 78%, transparent 100%)',
        }}
      >
        <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full border border-[#E5C17B]/40 bg-[#3B131D]/80 mb-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E5C17B] animate-ping" />
          <span className="text-[9px] uppercase tracking-[0.25em] text-[#F5DEB3] font-semibold">
            3D Shahi Palace Gate Invitation
          </span>
        </div>
        <p className="font-great-vibes text-[23px] sm:text-[25px] text-[#FDF6E9] leading-tight drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)]">
          For {guestName}
        </p>
      </motion.div>

      {/* =====================================================================
          3. LEFT & RIGHT 3D CARVED PALACE DOORS (Swing Open 108° on Tap)
      ===================================================================== */}
      <div
        className="absolute inset-0 z-20 flex"
        style={{ perspective: '1600px', transformStyle: 'preserve-3d' }}
      >
        {/* --------------------- LEFT PALACE DOOR --------------------- */}
        <motion.div
          initial={{ rotateY: 0 }}
          animate={
            isOpening
              ? {
                  rotateY: -108,
                  transition: { delay: 0.22, duration: 1.45, ease: [0.22, 1, 0.36, 1] },
                }
              : { rotateY: 0 }
          }
          style={{
            transformOrigin: 'left center',
            transformStyle: 'preserve-3d',
            background: 'linear-gradient(135deg, #5E2230 0%, #441621 55%, #300E16 100%)',
          }}
          className="relative w-1/2 h-full border-r-2 border-[#E5C17B] shadow-[10px_0_35px_rgba(0,0,0,0.6)] overflow-hidden"
        >
          {/* Ornate Gold Filigree Door Panel Frame */}
          <div className="absolute inset-3 border border-[#E5C17B]/60 rounded-tl-[48px] rounded-bl-xl pointer-events-none flex flex-col justify-between p-3">
            {/* Upper Carved Jharokha Jaali Lattice SVG */}
            <div className="w-full h-44 border border-[#E5C17B]/40 rounded-tl-[36px] bg-[#2A0B12]/60 p-2 flex items-center justify-center relative overflow-hidden">
              <svg viewBox="0 0 120 160" className="w-full h-full opacity-75">
                <path
                  d="M10 150 L10 65 C10 30, 60 10, 60 10 C60 10, 110 30, 110 65 L110 150 Z"
                  fill="none"
                  stroke="#E5C17B"
                  strokeWidth="2"
                />
                {/* Jaali Diamond Lattice */}
                <pattern id="jaali-left" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path
                    d="M10 0 L20 10 L10 20 L0 10 Z"
                    fill="none"
                    stroke="#E5C17B"
                    strokeWidth="0.9"
                    strokeOpacity="0.65"
                  />
                  <circle cx="10" cy="10" r="2.5" fill="#E5C17B" fillOpacity="0.45" />
                </pattern>
                <path
                  d="M14 146 L14 65 C14 34, 60 15, 60 15 C60 15, 106 34, 106 65 L106 146 Z"
                  fill="url(#jaali-left)"
                />
              </svg>
            </div>

            {/* Middle Royal Floral Medallion Panel */}
            <div className="w-full h-36 border border-[#E5C17B]/45 bg-[#38111A]/80 rounded-lg flex items-center justify-center p-3">
              <svg viewBox="0 0 100 100" className="w-24 h-24">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#E5C17B" strokeWidth="1.5" strokeDasharray="3 3" />
                <circle cx="50" cy="50" r="28" fill="none" stroke="#E5C17B" strokeWidth="1.2" />
                <path
                  d="M50 14 C60 34, 66 40, 86 50 C66 60, 60 66, 50 86 C40 66, 34 60, 14 50 C34 40, 40 34, 50 14 Z"
                  fill="#E5C17B"
                  fillOpacity="0.22"
                  stroke="#E5C17B"
                  strokeWidth="1.4"
                />
                <circle cx="50" cy="50" r="6" fill="#E5C17B" />
              </svg>
            </div>

            {/* Lower Carved Arch Panel */}
            <div className="w-full h-32 border border-[#E5C17B]/40 rounded-bl-lg bg-[#2A0B12]/50 flex items-center justify-center">
              <div className="w-3/4 h-3/4 border border-dashed border-[#E5C17B]/45 rounded flex items-center justify-center">
                <span className="font-serif text-[10px] tracking-[0.25em] text-[#E5C17B]/80 uppercase">
                  {coupleNames.partner1}
                </span>
              </div>
            </div>
          </div>

          {/* Brass Door Handle Ring on Left Door */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-12 rounded-full bg-gradient-to-b from-[#F5DEB3] via-[#D4AF37] to-[#8C6D23] shadow-md" />
        </motion.div>

        {/* --------------------- RIGHT PALACE DOOR --------------------- */}
        <motion.div
          initial={{ rotateY: 0 }}
          animate={
            isOpening
              ? {
                  rotateY: 108,
                  transition: { delay: 0.22, duration: 1.45, ease: [0.22, 1, 0.36, 1] },
                }
              : { rotateY: 0 }
          }
          style={{
            transformOrigin: 'right center',
            transformStyle: 'preserve-3d',
            background: 'linear-gradient(225deg, #5E2230 0%, #441621 55%, #300E16 100%)',
          }}
          className="relative w-1/2 h-full border-l-2 border-[#E5C17B] shadow-[-10px_0_35px_rgba(0,0,0,0.6)] overflow-hidden"
        >
          {/* Ornate Gold Filigree Door Panel Frame */}
          <div className="absolute inset-3 border border-[#E5C17B]/60 rounded-tr-[48px] rounded-br-xl pointer-events-none flex flex-col justify-between p-3">
            {/* Upper Carved Jharokha Jaali Lattice SVG */}
            <div className="w-full h-44 border border-[#E5C17B]/40 rounded-tr-[36px] bg-[#2A0B12]/60 p-2 flex items-center justify-center relative overflow-hidden">
              <svg viewBox="0 0 120 160" className="w-full h-full opacity-75">
                <path
                  d="M10 150 L10 65 C10 30, 60 10, 60 10 C60 10, 110 30, 110 65 L110 150 Z"
                  fill="none"
                  stroke="#E5C17B"
                  strokeWidth="2"
                />
                <pattern id="jaali-right" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path
                    d="M10 0 L20 10 L10 20 L0 10 Z"
                    fill="none"
                    stroke="#E5C17B"
                    strokeWidth="0.9"
                    strokeOpacity="0.65"
                  />
                  <circle cx="10" cy="10" r="2.5" fill="#E5C17B" fillOpacity="0.45" />
                </pattern>
                <path
                  d="M14 146 L14 65 C14 34, 60 15, 60 15 C60 15, 106 34, 106 65 L106 146 Z"
                  fill="url(#jaali-right)"
                />
              </svg>
            </div>

            {/* Middle Royal Floral Medallion Panel */}
            <div className="w-full h-36 border border-[#E5C17B]/45 bg-[#38111A]/80 rounded-lg flex items-center justify-center p-3">
              <svg viewBox="0 0 100 100" className="w-24 h-24">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#E5C17B" strokeWidth="1.5" strokeDasharray="3 3" />
                <circle cx="50" cy="50" r="28" fill="none" stroke="#E5C17B" strokeWidth="1.2" />
                <path
                  d="M50 14 C60 34, 66 40, 86 50 C66 60, 60 66, 50 86 C40 66, 34 60, 14 50 C34 40, 40 34, 50 14 Z"
                  fill="#E5C17B"
                  fillOpacity="0.22"
                  stroke="#E5C17B"
                  strokeWidth="1.4"
                />
                <circle cx="50" cy="50" r="6" fill="#E5C17B" />
              </svg>
            </div>

            {/* Lower Carved Arch Panel */}
            <div className="w-full h-32 border border-[#E5C17B]/40 rounded-br-lg bg-[#2A0B12]/50 flex items-center justify-center">
              <div className="w-3/4 h-3/4 border border-dashed border-[#E5C17B]/45 rounded flex items-center justify-center">
                <span className="font-serif text-[10px] tracking-[0.25em] text-[#E5C17B]/80 uppercase">
                  {coupleNames.partner2}
                </span>
              </div>
            </div>
          </div>

          {/* Brass Door Handle Ring on Right Door */}
          <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-12 rounded-full bg-gradient-to-b from-[#F5DEB3] via-[#D4AF37] to-[#8C6D23] shadow-md" />
        </motion.div>
      </div>

      {/* =====================================================================
          4. CENTER GOLDEN ROYAL LOCK & MONOGRAM CREST (Rotates & Unlocks)
      ===================================================================== */}
      <div className="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none">
        <motion.div
          animate={
            isOpening
              ? {
                  rotate: 90,
                  scale: [1, 1.18, 0],
                  opacity: [1, 1, 0],
                  transition: { duration: 0.55, ease: 'easeInOut' },
                }
              : {
                  scale: [1, 1.04, 1],
                  transition: { duration: 2.6, repeat: Infinity, ease: 'easeInOut' },
                }
          }
          className="relative w-28 h-28 rounded-full flex items-center justify-center shadow-[0_12px_35px_rgba(0,0,0,0.75)]"
          style={{
            background: 'radial-gradient(circle at 35% 30%, #FFF6D6 0%, #E5C168 45%, #9E741D 100%)',
            border: '3px solid #FFF8E7',
          }}
        >
          {/* Outer Scalloped Gold Rim */}
          <div className="absolute inset-1.5 rounded-full border-2 border-dashed border-[#5E2230]/50" />
          <div className="w-20 h-20 rounded-full bg-[#4A1722] border border-[#E5C17B] flex flex-col items-center justify-center text-center shadow-inner">
            <KeyRound className="w-3.5 h-3.5 text-[#E5C17B] mb-0.5" />
            <span className="font-serif text-lg font-bold tracking-wider text-[#FFF6D6] leading-none">
              {waxSealInitial}
            </span>
            <span className="text-[7px] uppercase tracking-[0.22em] text-[#E5C17B] mt-1">
              UNLOCK
            </span>
          </div>
        </motion.div>
      </div>

      {/* =====================================================================
          5. BOTTOM INSTRUCTION BAR
      ===================================================================== */}
      <motion.div
        animate={
          isOpening
            ? { y: 20, opacity: 0, transition: { duration: 0.4 } }
            : { y: 0, opacity: 1 }
        }
        className="absolute bottom-5 inset-x-0 z-30 flex flex-col items-center text-center px-4 pointer-events-none"
      >
        <div className="px-4 py-2 rounded-full bg-[#2A0B12]/90 border border-[#E5C17B]/60 backdrop-blur-md shadow-lg">
          <span className="text-[10px] uppercase tracking-[0.22em] text-[#F5DEB3] font-semibold">
            Tap Royal Lock to Open Palace Gates
          </span>
        </div>
      </motion.div>
    </div>
  );
}
