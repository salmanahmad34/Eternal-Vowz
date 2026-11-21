'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ThemeId } from '@/types/database';
import { Sparkles } from 'lucide-react';

interface OriginalEmbossedLifafaProps {
  themeId: ThemeId;
  guestName: string;
  waxSealInitial: string;
  coupleNames: { partner1: string; partner2: string };
  eventDateFormatted: string;
  stage: 'closed' | 'opening';
  isPreview?: boolean;
  onOpen: () => void;
}

interface LifafaPalette {
  baseBg: string;
  flapTopBg: string;
  flapSideBg: string;
  flapBottomBg: string;
  innerLining: string;
  embossStroke: string;
  embossFill: string;
  goldFoil: string;
  sealOuter: string;
  sealInner: string;
  sealText: string;
}

const LIFAFA_PALETTES: Record<ThemeId, LifafaPalette> = {
  'tuscan-sunset': {
    baseBg: '#3D151B',
    flapTopBg: 'linear-gradient(180deg, #4D1B22 0%, #381217 100%)',
    flapSideBg: 'linear-gradient(135deg, #45181E 0%, #2E0E13 100%)',
    flapBottomBg: 'linear-gradient(0deg, #4A1A21 0%, #341116 100%)',
    innerLining: 'radial-gradient(circle at 50% 30%, #63242C 0%, #260B0E 100%)',
    embossStroke: '#7A353F',
    embossFill: '#562028',
    goldFoil: '#E8C57B',
    sealOuter: '#F4EFE6',
    sealInner: '#E5DEC9',
    sealText: '#8C6D3F',
  },
  'royal-emerald': {
    baseBg: '#072E22',
    flapTopBg: 'linear-gradient(180deg, #0C3F2F 0%, #06281E 100%)',
    flapSideBg: 'linear-gradient(135deg, #093628 0%, #041F17 100%)',
    flapBottomBg: 'linear-gradient(0deg, #0B3B2C 0%, #05231A 100%)',
    innerLining: 'radial-gradient(circle at 50% 30%, #11523E 0%, #031912 100%)',
    embossStroke: '#1B5E48',
    embossFill: '#0E4433',
    goldFoil: '#E5C168',
    sealOuter: '#D4AF37',
    sealInner: '#B89024',
    sealText: '#2A1E04',
  },
  'blush-floral': {
    baseBg: '#5E2B38',
    flapTopBg: 'linear-gradient(180deg, #723645 0%, #542531 100%)',
    flapSideBg: 'linear-gradient(135deg, #68303E 0%, #481E29 100%)',
    flapBottomBg: 'linear-gradient(0deg, #6E3442 0%, #4E222D 100%)',
    innerLining: 'radial-gradient(circle at 50% 30%, #854253 0%, #38161F 100%)',
    embossStroke: '#965364',
    embossFill: '#783A4A',
    goldFoil: '#F3D6A4',
    sealOuter: '#FBF7F2',
    sealInner: '#EDE3D5',
    sealText: '#8E6545',
  },
  'midnight-minimalist': {
    baseBg: '#0F172A',
    flapTopBg: 'linear-gradient(180deg, #1E293B 0%, #0F172A 100%)',
    flapSideBg: 'linear-gradient(135deg, #172033 0%, #090E1A 100%)',
    flapBottomBg: 'linear-gradient(0deg, #1B253B 0%, #0D1324 100%)',
    innerLining: 'radial-gradient(circle at 50% 30%, #283754 0%, #070B14 100%)',
    embossStroke: '#334155',
    embossFill: '#1E293B',
    goldFoil: '#E2C275',
    sealOuter: '#E8D8B9',
    sealInner: '#D4C098',
    sealText: '#3B2F18',
  },
  'pearl-veil': {
    baseBg: '#3D4B3E',
    flapTopBg: 'linear-gradient(180deg, #4B5C4C 0%, #344135 100%)',
    flapSideBg: 'linear-gradient(135deg, #445445 0%, #2B362C 100%)',
    flapBottomBg: 'linear-gradient(0deg, #485849 0%, #303C31 100%)',
    innerLining: 'radial-gradient(circle at 50% 30%, #5A6E5B 0%, #242E25 100%)',
    embossStroke: '#738A74',
    embossFill: '#4E604F',
    goldFoil: '#E8C57B',
    sealOuter: '#F8F4EC',
    sealInner: '#E9E0D0',
    sealText: '#536454',
  },
  'jodhpur-sapphire': {
    baseBg: '#0B1E3D',
    flapTopBg: 'linear-gradient(180deg, #132D59 0%, #0B1E3D 100%)',
    flapSideBg: 'linear-gradient(135deg, #0F274E 0%, #07162E 100%)',
    flapBottomBg: 'linear-gradient(0deg, #112B54 0%, #081933 100%)',
    innerLining: 'radial-gradient(circle at 50% 30%, #1A3E7A 0%, #051021 100%)',
    embossStroke: '#2A5699',
    embossFill: '#122B52',
    goldFoil: '#E5C17B',
    sealOuter: '#B45309',
    sealInner: '#D97706',
    sealText: '#FEF3C7',
  },
  'shahi-crimson': {
    baseBg: '#4A0A11',
    flapTopBg: 'linear-gradient(180deg, #5E1018 0%, #42080E 100%)',
    flapSideBg: 'linear-gradient(135deg, #520D14 0%, #35050A 100%)',
    flapBottomBg: 'linear-gradient(0deg, #580E16 0%, #3A060C 100%)',
    innerLining: 'radial-gradient(circle at 50% 30%, #751520 0%, #280307 100%)',
    embossStroke: '#8A222D',
    embossFill: '#591119',
    goldFoil: '#D4AF37',
    sealOuter: '#8A1C14',
    sealInner: '#70140D',
    sealText: '#FDE68A',
  },
  'kashmir-lotus': {
    baseBg: '#5A4D6B',
    flapTopBg: 'linear-gradient(180deg, #6B5D7E 0%, #4F4360 100%)',
    flapSideBg: 'linear-gradient(135deg, #625574 0%, #433852 100%)',
    flapBottomBg: 'linear-gradient(0deg, #67597A 0%, #473B56 100%)',
    innerLining: 'radial-gradient(circle at 50% 30%, #827299 0%, #352B42 100%)',
    embossStroke: '#9484AC',
    embossFill: '#6D5F82',
    goldFoil: '#E8C57B',
    sealOuter: '#DDD6E8',
    sealInner: '#C4B7D6',
    sealText: '#3B2E4A',
  },
};

// Reusable 3D Embossed Botanical Peony & Vine Corner Cluster SVG
function EmbossedBotanicalCluster({
  strokeColor,
  fillColor,
  goldColor,
  isGlowing,
  className = '',
}: {
  strokeColor: string;
  fillColor: string;
  goldColor: string;
  isGlowing: boolean;
  className?: string;
}) {
  const activeStroke = isGlowing ? goldColor : strokeColor;
  return (
    <svg
      viewBox="0 0 220 340"
      fill="none"
      className={`pointer-events-none transition-all duration-700 ${className}`}
      style={{
        filter: isGlowing
          ? 'drop-shadow(0px 0px 8px rgba(232, 197, 123, 0.55)) drop-shadow(2px 3px 4px rgba(0,0,0,0.65))'
          : 'drop-shadow(1px 2px 3px rgba(0,0,0,0.75)) drop-shadow(-1px -1px 1px rgba(255,255,255,0.12))',
      }}
    >
      {/* Large Embossed Peony Bloom 1 */}
      <g stroke={activeStroke} fill={fillColor} strokeWidth="1.6">
        <circle cx="55" cy="110" r="38" fillOpacity="0.85" />
        <path d="M55 72 C72 82, 82 95, 55 110 C28 95, 38 82, 55 72 Z" />
        <path d="M93 110 C83 127, 70 137, 55 110 C70 83, 83 93, 93 110 Z" />
        <path d="M55 148 C38 138, 28 125, 55 110 C82 125, 72 138, 55 148 Z" />
        <path d="M17 110 C27 93, 40 83, 55 110 C40 137, 27 127, 17 110 Z" />
        <path d="M28 83 C48 83, 62 92, 55 110 C37 103, 28 98, 28 83 Z" />
        <path d="M82 83 C82 98, 73 103, 55 110 C48 92, 62 83, 82 83 Z" />
        <path d="M82 137 C62 137, 48 128, 55 110 C73 117, 82 122, 82 137 Z" />
        <path d="M28 137 C28 122, 37 117, 55 110 C62 128, 48 137, 28 137 Z" />
        <circle cx="55" cy="110" r="12" strokeDasharray="2 2" />
        <circle cx="55" cy="110" r="5" fill={activeStroke} />
      </g>

      {/* Embossed Peony Bloom 2 (Lower) */}
      <g stroke={activeStroke} fill={fillColor} strokeWidth="1.6">
        <circle cx="48" cy="235" r="34" fillOpacity="0.85" />
        <path d="M48 201 C63 211, 73 222, 48 235 C23 222, 33 211, 48 201 Z" />
        <path d="M82 235 C72 250, 60 260, 48 235 C60 210, 72 220, 82 235 Z" />
        <path d="M48 269 C33 259, 23 248, 48 235 C73 248, 63 259, 48 269 Z" />
        <path d="M14 235 C24 220, 36 210, 48 235 C36 260, 24 250, 14 235 Z" />
        <circle cx="48" cy="235" r="10" strokeDasharray="2 2" />
        <circle cx="48" cy="235" r="4" fill={activeStroke} />
      </g>

      {/* Curved Botanical Vines & Embossed Leaves */}
      <path
        d="M25 20 C55 55, 95 140, 75 185 C60 220, 95 275, 130 325"
        stroke={activeStroke}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M78 135 C105 125, 125 140, 102 156 C85 164, 78 148, 78 135 Z"
        fill={fillColor}
        stroke={activeStroke}
        strokeWidth="1.5"
      />
      <path
        d="M68 175 C95 170, 112 188, 88 200 C72 205, 65 188, 68 175 Z"
        fill={fillColor}
        stroke={activeStroke}
        strokeWidth="1.5"
      />
      <path
        d="M75 268 C108 260, 125 280, 98 296 C80 302, 72 282, 75 268 Z"
        fill={fillColor}
        stroke={activeStroke}
        strokeWidth="1.5"
      />
      <path
        d="M38 158 C12 152, 5 172, 28 182 C44 186, 45 168, 38 158 Z"
        fill={fillColor}
        stroke={activeStroke}
        strokeWidth="1.5"
      />
    </svg>
  );
}

export default function OriginalEmbossedLifafa({
  themeId,
  guestName,
  waxSealInitial,
  coupleNames,
  eventDateFormatted,
  stage,
  isPreview = false,
  onOpen,
}: OriginalEmbossedLifafaProps) {
  const palette = LIFAFA_PALETTES[themeId] || LIFAFA_PALETTES['tuscan-sunset'];
  const isOpening = stage === 'opening';

  return (
    <div
      onClick={onOpen}
      className={`relative w-full ${
        isPreview ? 'h-[640px]' : 'h-[100dvh] max-h-[844px] min-h-[660px]'
      } overflow-hidden cursor-pointer select-none perspective-1500`}
      style={{ backgroundColor: palette.baseBg }}
    >
      {/* =====================================================================
          1. INNER ENVELOPE POCKET LINING (Revealed when Top Flap Opens)
      ===================================================================== */}
      <div
        className="absolute inset-0 z-0"
        style={{ background: palette.innerLining }}
      >
        {/* Subtle Gold Damask Pattern Inside Pocket */}
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `radial-gradient(${palette.goldFoil} 1px, transparent 1px)`,
            backgroundSize: '20px 20px',
          }}
        />
      </div>

      {/* =====================================================================
          2. INNER LUXURY CARD (Slides Upward Out of Pocket During Opening)
      ===================================================================== */}
      <motion.div
        initial={{ y: 90, scale: 0.92, opacity: 0.85 }}
        animate={
          isOpening
            ? {
                y: -170,
                scale: 0.98,
                opacity: 1,
                transition: { delay: 0.55, duration: 1.15, ease: [0.22, 1, 0.36, 1] },
              }
            : { y: 90, scale: 0.92, opacity: 0.85 }
        }
        className="absolute inset-x-6 top-20 h-[440px] rounded-t-3xl bg-[#FAF6EE] border-2 shadow-2xl z-10 p-6 flex flex-col items-center justify-start text-center overflow-hidden"
        style={{ borderColor: palette.goldFoil }}
      >
        {/* Inner Card Gold Filigree Frame */}
        <div
          className="absolute inset-2.5 rounded-2xl border border-dashed pointer-events-none opacity-50"
          style={{ borderColor: '#B89040' }}
        />
        <div className="w-10 h-10 rounded-full bg-[#C5A059]/15 border border-[#C5A059] flex items-center justify-center mt-2 mb-3">
          <Sparkles className="w-4 h-4 text-[#9C762B]" />
        </div>
        <span className="text-[9px] font-sans tracking-[0.28em] uppercase text-[#7A6855] font-semibold">
          WEDDING CELEBRATION
        </span>
        <h3 className="font-serif text-2xl tracking-[0.1em] text-[#2F2A24] uppercase mt-3">
          {coupleNames.partner1}
        </h3>
        <span className="font-great-vibes text-xl text-[#9C762B] -my-1">&amp;</span>
        <h3 className="font-serif text-2xl tracking-[0.1em] text-[#2F2A24] uppercase">
          {coupleNames.partner2}
        </h3>
        <div className="h-[1px] w-16 bg-[#C5A059]/60 my-3" />
        <span className="font-serif text-sm tracking-[0.15em] text-[#5C5246]">
          {eventDateFormatted}
        </span>
      </motion.div>

      {/* =====================================================================
          3. LEFT & RIGHT 3D EMBOSSED SIDE FLAPS
      ===================================================================== */}
      {/* Left Side Flap */}
      <div
        className="absolute inset-y-0 left-0 w-[62%] z-20 pointer-events-none"
        style={{
          background: palette.flapSideBg,
          clipPath: 'polygon(0 0, 100% 50%, 0 100%)',
          boxShadow: '10px 0 25px rgba(0,0,0,0.65)',
        }}
      >
        <EmbossedBotanicalCluster
          strokeColor={palette.embossStroke}
          fillColor={palette.embossFill}
          goldColor={palette.goldFoil}
          isGlowing={isOpening}
          className="absolute left-0 top-[14%] w-48 h-80 opacity-95"
        />
      </div>

      {/* Right Side Flap */}
      <div
        className="absolute inset-y-0 right-0 w-[62%] z-20 pointer-events-none"
        style={{
          background: palette.flapSideBg,
          clipPath: 'polygon(100% 0, 0 50%, 100% 100%)',
        }}
      >
        <EmbossedBotanicalCluster
          strokeColor={palette.embossStroke}
          fillColor={palette.embossFill}
          goldColor={palette.goldFoil}
          isGlowing={isOpening}
          className="absolute right-0 top-[14%] w-48 h-80 opacity-95 scale-x-[-1]"
        />
      </div>

      {/* Diagonal Gold-Trimmed Crease Lines for Side Flaps */}
      <svg
        viewBox="0 0 390 844"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full z-20 pointer-events-none"
      >
        <line
          x1="0"
          y1="0"
          x2="195"
          y2="422"
          stroke={isOpening ? palette.goldFoil : palette.embossStroke}
          strokeWidth="1.5"
          strokeOpacity="0.6"
        />
        <line
          x1="390"
          y1="0"
          x2="195"
          y2="422"
          stroke={isOpening ? palette.goldFoil : palette.embossStroke}
          strokeWidth="1.5"
          strokeOpacity="0.6"
        />
      </svg>

      {/* =====================================================================
          4. BOTTOM 3D EMBOSSED POCKET FLAP
      ===================================================================== */}
      <div
        className="absolute inset-x-0 bottom-0 h-[56%] z-30 pointer-events-none flex flex-col items-center justify-end pb-10"
        style={{
          background: palette.flapBottomBg,
          clipPath: 'polygon(0 100%, 50% 4%, 100% 100%)',
        }}
      >
        {/* Central Rising Botanical Vine on Bottom Flap */}
        <svg
          viewBox="0 0 260 260"
          fill="none"
          className="w-60 h-60 mb-4 transition-all duration-700"
          style={{
            filter: isOpening
              ? 'drop-shadow(0px 0px 10px rgba(232, 197, 123, 0.7))'
              : 'drop-shadow(1px 2px 3px rgba(0,0,0,0.8)) drop-shadow(-1px -1px 1px rgba(255,255,255,0.12))',
          }}
        >
          <path
            d="M130 245 C130 185, 105 145, 130 95 C145 65, 118 45, 130 25"
            stroke={isOpening ? palette.goldFoil : palette.embossStroke}
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          {/* Left & Right Symmetrical Embossed Ferns */}
          <path
            d="M128 195 C90 175, 55 200, 35 235"
            stroke={isOpening ? palette.goldFoil : palette.embossStroke}
            strokeWidth="1.8"
          />
          <path
            d="M132 195 C170 175, 205 200, 225 235"
            stroke={isOpening ? palette.goldFoil : palette.embossStroke}
            strokeWidth="1.8"
          />
          {/* Embossed Leaves along the stems */}
          {[
            'M118 140 C95 130, 85 148, 110 156 Z',
            'M142 140 C165 130, 175 148, 150 156 Z',
            'M122 105 C100 92, 92 110, 115 118 Z',
            'M138 105 C160 92, 168 110, 145 118 Z',
            'M85 190 C65 180, 58 198, 78 205 Z',
            'M175 190 C195 180, 202 198, 182 205 Z',
          ].map((d, i) => (
            <path
              key={i}
              d={d}
              fill={palette.embossFill}
              stroke={isOpening ? palette.goldFoil : palette.embossStroke}
              strokeWidth="1.5"
            />
          ))}
        </svg>

        {/* Bottom Flap Beveled Edge Highlight */}
        <svg
          viewBox="0 0 390 470"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full pointer-events-none"
        >
          <polyline
            points="0,470 195,20 390,470"
            fill="none"
            stroke={isOpening ? palette.goldFoil : palette.embossStroke}
            strokeWidth="2.5"
            strokeOpacity="0.85"
          />
        </svg>
      </div>

      {/* =====================================================================
          5. TOP 3D HINGED ROYAL FLAP (Rotates Open 180° in 3D on Click)
      ===================================================================== */}
      <motion.div
        initial={{ rotateX: 0 }}
        animate={
          isOpening
            ? {
                rotateX: 180,
                zIndex: 5,
                transition: { delay: 0.35, duration: 0.95, ease: [0.4, 0, 0.2, 1] },
              }
            : { rotateX: 0, zIndex: 40 }
        }
        style={{
          transformOrigin: 'top center',
          transformStyle: 'preserve-3d',
        }}
        className="absolute inset-x-0 top-0 h-[53%] z-40 pointer-events-none"
      >
        <div
          className="relative w-full h-full flex flex-col items-center pt-12"
          style={{
            background: palette.flapTopBg,
            clipPath: 'polygon(0 0, 100% 0, 100% 12%, 50% 100%, 0 12%)',
          }}
        >
          {/* Top Gold Foil Border Line */}
          <div
            className="w-44 h-[1px] opacity-50 mb-4"
            style={{
              background: `linear-gradient(90deg, transparent, ${palette.goldFoil}, transparent)`,
            }}
          />

          {/* Personalized Guest Name in Luxury Cursive Calligraphy */}
          <div className="px-6 text-center">
            <span
              className="block text-[9px] font-sans uppercase tracking-[0.3em] opacity-75 mb-1"
              style={{ color: palette.goldFoil }}
            >
              ✦ EXCLUSIVELY INVITED ✦
            </span>
            <div
              className="font-great-vibes italic leading-relaxed text-[#fffdfd] drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
              style={{ fontSize: '26px' }}
            >
              For {guestName}
            </div>
          </div>

          {/* Embossed Botanical Sprig on Top Flap */}
          <svg
            viewBox="0 0 120 140"
            fill="none"
            className="w-24 h-28 mt-4 transition-all duration-700"
            style={{
              filter: isOpening
                ? 'drop-shadow(0px 0px 8px rgba(232, 197, 123, 0.75))'
                : 'drop-shadow(1px 2px 3px rgba(0,0,0,0.75)) drop-shadow(-1px -1px 1px rgba(255,255,255,0.14))',
            }}
          >
            <path
              d="M60 115 C60 85, 45 55, 60 20"
              stroke={isOpening ? palette.goldFoil : palette.embossStroke}
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M56 85 C35 75, 28 92, 48 98 Z"
              fill={palette.embossFill}
              stroke={isOpening ? palette.goldFoil : palette.embossStroke}
              strokeWidth="1.5"
            />
            <path
              d="M64 70 C85 60, 92 77, 72 83 Z"
              fill={palette.embossFill}
              stroke={isOpening ? palette.goldFoil : palette.embossStroke}
              strokeWidth="1.5"
            />
            <path
              d="M57 50 C38 40, 32 56, 50 62 Z"
              fill={palette.embossFill}
              stroke={isOpening ? palette.goldFoil : palette.embossStroke}
              strokeWidth="1.5"
            />
            <circle
              cx="60"
              cy="18"
              r="5"
              fill={isOpening ? palette.goldFoil : palette.embossFill}
              stroke={isOpening ? palette.goldFoil : palette.embossStroke}
              strokeWidth="1.5"
            />
          </svg>

          {/* Top Flap V-Edge Bevel Line */}
          <svg
            viewBox="0 0 390 447"
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full pointer-events-none"
          >
            <polyline
              points="0,53 195,445 390,53"
              fill="none"
              stroke={isOpening ? palette.goldFoil : palette.embossStroke}
              strokeWidth="3"
            />
          </svg>
        </div>
      </motion.div>

      {/* =====================================================================
          6. BESPOKE 3D ROYAL SCALLOPED WAX SEAL (Center Interactive Trigger)
      ===================================================================== */}
      <div className="absolute inset-x-0 top-[50%] -translate-y-1/2 flex items-center justify-center z-50">
        <motion.button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpen();
          }}
          animate={
            isOpening
              ? {
                  scale: [1, 1.16, 0],
                  opacity: [1, 1, 0],
                  rotate: [0, -8, 25],
                  transition: { duration: 0.65, times: [0, 0.4, 1], ease: 'easeInOut' },
                }
              : { scale: 1, opacity: 1 }
          }
          whileHover={{ scale: 1.07 }}
          whileTap={{ scale: 0.94 }}
          aria-label="Tap Wax Seal to Open Invitation"
          className="relative w-28 h-28 flex items-center justify-center focus:outline-none cursor-pointer group"
        >
          {/* Golden Aura Burst Behind Seal */}
          <motion.div
            animate={
              isOpening
                ? { scale: [1, 2.4], opacity: [0.9, 0] }
                : { scale: [1, 1.15, 1], opacity: [0.25, 0.55, 0.25] }
            }
            transition={
              isOpening
                ? { duration: 0.7 }
                : { duration: 2.5, repeat: Infinity, ease: 'easeInOut' }
            }
            className="absolute inset-1 rounded-full pointer-events-none"
            style={{
              background: `radial-gradient(circle, ${palette.goldFoil} 0%, transparent 70%)`,
            }}
          />

          {/* Scalloped 3D Melted Wax Seal SVG */}
          <svg
            viewBox="0 0 140 140"
            className="w-28 h-28 drop-shadow-[0_12px_20px_rgba(0,0,0,0.65)]"
          >
            <defs>
              <radialGradient id="waxOuterGrad" cx="35%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="45%" stopColor={palette.sealOuter} />
                <stop offset="100%" stopColor={palette.sealInner} />
              </radialGradient>
              <radialGradient id="waxInnerGrad" cx="65%" cy="70%" r="65%">
                <stop offset="0%" stopColor={palette.sealOuter} />
                <stop offset="100%" stopColor={palette.sealInner} />
              </radialGradient>
            </defs>

            {/* Organic Wavy Melted Wax Outer Rim */}
            <path
              d="M70 8
                 C82 8, 90 13, 100 16
                 C112 19, 121 28, 124 40
                 C127 50, 132 58, 132 70
                 C132 82, 127 90, 124 100
                 C121 112, 112 121, 100 124
                 C90 127, 82 132, 70 132
                 C58 132, 50 127, 40 124
                 C28 121, 19 112, 16 100
                 C13 90, 8 82, 8 70
                 C8 58, 13 50, 16 40
                 C19 28, 28 19, 40 16
                 C50 13, 58 8, 70 8 Z"
              fill="url(#waxOuterGrad)"
              stroke={palette.sealInner}
              strokeWidth="1.5"
            />

            {/* Inner Recessed Stamp Circle */}
            <circle
              cx="70"
              cy="70"
              r="45"
              fill="url(#waxInnerGrad)"
              stroke={palette.sealText}
              strokeWidth="1.2"
              strokeOpacity="0.45"
            />
            <circle
              cx="70"
              cy="70"
              r="41"
              fill="none"
              stroke={palette.sealText}
              strokeWidth="0.9"
              strokeDasharray="3 2"
              strokeOpacity="0.55"
            />

            {/* Embossed Botanical Laurel & Monogram Crest */}
            <g stroke={palette.sealText} fill={palette.sealText} opacity="0.85">
              {/* Left & Right Olive Branches */}
              <path
                d="M45 88 C36 74, 38 54, 52 44"
                fill="none"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
              <path
                d="M95 88 C104 74, 102 54, 88 44"
                fill="none"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
              {/* Tiny Crown / Star at Top */}
              <polygon points="70,35 72,40 77,40 73,43 74,48 70,45 66,48 67,43 63,40 68,40" />
            </g>

            {/* Couple Monogram Initials in Center */}
            <text
              x="70"
              y="76"
              textAnchor="middle"
              fill={palette.sealText}
              className="font-serif font-bold"
              style={{ fontSize: '21px', letterSpacing: '0.04em' }}
            >
              {waxSealInitial}
            </text>
          </svg>
        </motion.button>
      </div>

      {/* =====================================================================
          7. BOTTOM "TAP TO OPEN" CALLIGRAPHY PROMPT
      ===================================================================== */}
      <motion.div
        animate={isOpening ? { opacity: 0 } : { opacity: [0.65, 1, 0.65] }}
        transition={
          isOpening
            ? { duration: 0.25 }
            : { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }
        }
        className="absolute bottom-8 inset-x-0 flex flex-col items-center justify-center z-40 pointer-events-none"
      >
        <div
          className="font-great-vibes italic tracking-[0.12em] text-[#fffdfd]"
          style={{
            fontSize: '22px',
            textShadow: '0px 2px 6px rgba(0, 0, 0, 0.6)',
          }}
        >
          Tap to open
        </div>
      </motion.div>
    </div>
  );
}
