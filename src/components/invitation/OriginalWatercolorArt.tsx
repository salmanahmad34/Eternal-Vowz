'use client';

import React from 'react';

// 1. Original Halal Wedding Timeline Watercolor-Style SVG Illustrations
export function TimelineIllustration({
  index,
  darkPalace = false,
  className = 'w-14 h-14 shrink-0',
}: {
  index: number;
  darkPalace?: boolean;
  className?: string;
}) {
  const type = index % 4;
  const strokeMain = darkPalace ? '#E5C17B' : '#8C6D46';
  const accentRose = darkPalace ? '#F6D992' : '#E5A8B2';
  const fillSoft = darkPalace ? '#2B1B11' : '#FFFDF9';

  if (type === 0) {
    // Golden Sparklers & Welcome Star Bursts
    return (
      <svg viewBox="0 0 90 90" fill="none" className={className}>
        <line x1="28" y1="78" x2="60" y2="25" stroke={strokeMain} strokeWidth="1.8" strokeLinecap="round" />
        <line x1="62" y1="78" x2="30" y2="25" stroke={strokeMain} strokeWidth="1.8" strokeLinecap="round" />
        {/* Golden Sparkle Rays */}
        <g stroke={darkPalace ? '#FFE39C' : '#D49B38'} strokeWidth="1.4" strokeLinecap="round">
          <line x1="30" y1="14" x2="30" y2="34" />
          <line x1="20" y1="24" x2="40" y2="24" />
          <line x1="23" y1="17" x2="37" y2="31" />
          <line x1="37" y1="17" x2="23" y2="31" />

          <line x1="60" y1="14" x2="60" y2="34" />
          <line x1="50" y1="24" x2="70" y2="24" />
          <line x1="53" y1="17" x2="67" y2="31" />
          <line x1="67" y1="17" x2="53" y2="31" />
        </g>
        <circle cx="30" cy="24" r="4" fill="#FCE592" />
        <circle cx="60" cy="24" r="4" fill="#FCE592" />
        <circle cx="45" cy="15" r="2" fill="#E5A93C" />
        <circle cx="16" cy="33" r="1.8" fill={accentRose} />
        <circle cx="74" cy="33" r="1.8" fill={accentRose} />
      </svg>
    );
  }

  if (type === 1) {
    // Blessed Nikah Floral Arch & Interlocking Golden Rings
    return (
      <svg viewBox="0 0 90 90" fill="none" className={className}>
        {/* Floral Arch */}
        <path
          d="M20 74 V42 C20 26, 70 26, 70 42 V74"
          stroke={strokeMain}
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        {/* Watercolor Roses on Arch */}
        <circle cx="24" cy="34" r="5" fill={darkPalace ? '#FFF2D6' : '#E5A8B2'} />
        <circle cx="33" cy="27" r="4.5" fill="#F4D58D" />
        <circle cx="45" cy="24" r="5.5" fill={darkPalace ? '#FFF2D6' : '#E5A8B2'} />
        <circle cx="57" cy="27" r="4.5" fill="#F4D58D" />
        <circle cx="66" cy="34" r="5" fill={darkPalace ? '#FFF2D6' : '#E5A8B2'} />
        {/* Interlocking Golden Wedding Rings */}
        <circle cx="39" cy="54" r="10" stroke={darkPalace ? '#F2CE74' : '#C59B38'} strokeWidth="2.2" fill={fillSoft} fillOpacity="0.4" />
        <circle cx="51" cy="54" r="10" stroke={darkPalace ? '#F2CE74' : '#C59B38'} strokeWidth="2.2" fill={fillSoft} fillOpacity="0.4" />
        {/* Diamond Top on Left Ring */}
        <polygon points="39,40 42,43 39,46 36,43" fill="#E5C168" stroke={strokeMain} strokeWidth="0.8" />
      </svg>
    );
  }

  if (type === 2) {
    // Royal Dawat / Walima Feast — Golden Kahwa / Rosewater Carafe & Domed Platter
    return (
      <svg viewBox="0 0 90 90" fill="none" className={className}>
        {/* Royal Cloche / Domed Dawat Platter */}
        <path
          d="M22 62 C22 44, 68 44, 68 62 Z"
          fill={darkPalace ? '#C99E48' : '#F2DCAB'}
          fillOpacity={darkPalace ? '0.35' : '0.8'}
          stroke={darkPalace ? '#E5C17B' : '#7A654E'}
          strokeWidth="1.6"
        />
        <circle cx="45" cy="45" r="3.5" fill="#D4AF37" stroke={darkPalace ? '#FFE39C' : '#7A654E'} strokeWidth="1.3" />
        <ellipse cx="45" cy="63" rx="28" ry="4" fill={darkPalace ? '#3B2718' : '#EAE3D5'} stroke={darkPalace ? '#E5C17B' : '#7A654E'} strokeWidth="1.5" />
        <path d="M26 67 H64" stroke={darkPalace ? '#E5C17B' : '#7A654E'} strokeWidth="1.5" strokeLinecap="round" />
        {/* Decorative Floral Sprig & Steam */}
        <path d="M36 36 Q38 30 35 25" stroke="#E5C17B" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M45 34 Q47 28 44 22" stroke="#E5C17B" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M54 36 Q56 30 53 25" stroke="#E5C17B" strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="38" cy="56" r="3" fill={darkPalace ? '#FFF2D6' : '#E5A8B2'} />
        <circle cx="45" cy="54" r="3.5" fill={darkPalace ? '#E5C17B' : '#89A878'} />
        <circle cx="52" cy="56" r="3" fill={darkPalace ? '#FFF2D6' : '#E5A8B2'} />
      </svg>
    );
  }

  // Vintage Royal Getaway Car with Floral Garland
  return (
    <svg viewBox="0 0 100 90" fill="none" className={className}>
      <path
        d="M20 52 C20 40, 28 36, 35 36 L65 36 C72 36, 80 40, 80 52 L84 56 L84 68 L16 68 L16 56 Z"
        fill={darkPalace ? '#3C2719' : '#E5B5BC'}
        fillOpacity={darkPalace ? '0.9' : '0.75'}
        stroke={darkPalace ? '#E5C17B' : '#6B484E'}
        strokeWidth="1.5"
      />
      <path d="M32 36 L37 24 L63 24 L68 36 Z" fill={darkPalace ? '#1F130B' : '#FFFDF9'} fillOpacity="0.8" stroke={darkPalace ? '#E5C17B' : '#6B484E'} strokeWidth="1.4" />
      <circle cx="24" cy="57" r="4.5" fill="#FFF7D6" stroke={darkPalace ? '#E5C17B' : '#6B484E'} strokeWidth="1.4" />
      <circle cx="76" cy="57" r="4.5" fill="#FFF7D6" stroke={darkPalace ? '#E5C17B' : '#6B484E'} strokeWidth="1.4" />
      <rect x="38" y="54" width="24" height="8" rx="3" fill={darkPalace ? '#26180F' : '#FAF6EE'} stroke={darkPalace ? '#E5C17B' : '#6B484E'} strokeWidth="1.3" />
      <rect x="20" y="66" width="10" height="9" rx="2" fill={darkPalace ? '#140C07' : '#4A3F35'} stroke={darkPalace ? '#E5C17B' : 'none'} strokeWidth={darkPalace ? '1' : '0'} />
      <rect x="70" y="66" width="10" height="9" rx="2" fill={darkPalace ? '#140C07' : '#4A3F35'} stroke={darkPalace ? '#E5C17B' : 'none'} strokeWidth={darkPalace ? '1' : '0'} />
      <circle cx="38" cy="54" r="3" fill={darkPalace ? '#FFF2D6' : '#D88C9A'} />
      <circle cx="44" cy="53" r="3.5" fill="#F4D58D" />
      <circle cx="50" cy="54" r="3" fill={darkPalace ? '#FFF2D6' : '#D88C9A'} />
      <circle cx="56" cy="53" r="3.5" fill={darkPalace ? '#E5C17B' : '#89A878'} />
      <circle cx="62" cy="54" r="3" fill={darkPalace ? '#FFF2D6' : '#D88C9A'} />
    </svg>
  );
}

// 2. Original Section Header Badges (Pocket Watch, Gift Box, Scroll FAQ)
export function SectionHeaderBadge({
  type,
  darkPalace = false,
}: {
  type: 'clock' | 'dress' | 'gift' | 'bellhop' | 'faq';
  darkPalace?: boolean;
}) {
  if (type === 'clock') {
    return (
      <svg viewBox="0 0 80 80" fill="none" className="w-16 h-16 mx-auto mb-2">
        <circle cx="40" cy="44" r="22" fill={darkPalace ? '#22150D' : '#FDFBF7'} stroke={darkPalace ? '#E5C17B' : '#8C6D46'} strokeWidth="1.8" />
        <circle cx="40" cy="44" r="18" stroke={darkPalace ? '#C9A84C' : '#C5A059'} strokeWidth="1" strokeDasharray="2 2" />
        <path d="M36 16 H44 M40 16 V22" stroke={darkPalace ? '#E5C17B' : '#8C6D46'} strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="40" cy="14" r="4" stroke={darkPalace ? '#E5C17B' : '#8C6D46'} strokeWidth="1.5" />
        <polyline points="40,32 40,44 49,49" stroke={darkPalace ? '#FFF4CF' : '#5C4934'} strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="23" cy="29" r="5" fill={darkPalace ? '#FFF2D6' : '#E5A8B2'} />
        <circle cx="57" cy="58" r="4.5" fill={darkPalace ? '#E5C17B' : '#E5A8B2'} />
      </svg>
    );
  }

  if (type === 'gift') {
    return (
      <svg viewBox="0 0 80 80" fill="none" className="w-16 h-16 mx-auto mb-2">
        <rect x="18" y="34" width="44" height="32" rx="3" fill={darkPalace ? '#24160D' : '#F8EFE4'} stroke={darkPalace ? '#E5C17B' : '#7A5C48'} strokeWidth="1.6" />
        <rect x="15" y="26" width="50" height="9" rx="2" fill={darkPalace ? '#321F12' : '#F2E4D4'} stroke={darkPalace ? '#E5C17B' : '#7A5C48'} strokeWidth="1.6" />
        <rect x="36" y="26" width="8" height="40" fill={darkPalace ? '#C9A84C' : '#D88C9A'} fillOpacity="0.9" />
        <rect x="18" y="46" width="44" height="7" fill={darkPalace ? '#C9A84C' : '#D88C9A'} fillOpacity="0.9" />
        <path
          d="M40 26 C30 14, 20 20, 32 26 M40 26 C50 14, 60 20, 48 26"
          stroke={darkPalace ? '#FFE39C' : '#B56576'}
          strokeWidth="2.2"
          fill={darkPalace ? '#C9A84C' : '#E5A8B2'}
          fillOpacity="0.65"
        />
      </svg>
    );
  }

  if (type === 'faq') {
    return (
      <svg viewBox="0 0 80 80" fill="none" className="w-14 h-14 mx-auto mb-2">
        <rect x="22" y="16" width="36" height="48" rx="4" fill={darkPalace ? '#22150D' : '#FAF3E6'} stroke={darkPalace ? '#E5C17B' : '#7A654E'} strokeWidth="1.6" />
        <line x1="18" y1="16" x2="62" y2="16" stroke={darkPalace ? '#E5C17B' : '#5C4934'} strokeWidth="3" strokeLinecap="round" />
        <line x1="18" y1="64" x2="62" y2="64" stroke={darkPalace ? '#E5C17B' : '#5C4934'} strokeWidth="3" strokeLinecap="round" />
        <text
          x="40"
          y="48"
          textAnchor="middle"
          fill={darkPalace ? '#FFF4CF' : '#7A654E'}
          className="font-serif italic font-bold"
          style={{ fontSize: '26px' }}
        >
          ?
        </text>
      </svg>
    );
  }

  return null;
}

// 3. Original Velvet & Gold Satin Ribbon Bow Menu Frame SVG
export function OriginalRibbonMenuFrame() {
  return (
    <svg
      viewBox="0 0 360 640"
      fill="none"
      preserveAspectRatio="none"
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
    >
      <path
        d="M180 46
           C125 36, 45 48, 36 95
           C28 140, 46 210, 34 290
           C22 370, 44 450, 34 525
           C26 575, 58 595, 115 592"
        stroke="#6B2232"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M180 46
           C125 36, 45 48, 36 95
           C28 140, 46 210, 34 290
           C22 370, 44 450, 34 525
           C26 575, 58 595, 115 592"
        stroke="#C5A059"
        strokeWidth="1.5"
        strokeOpacity="0.8"
      />

      <path
        d="M180 46
           C235 36, 315 48, 324 95
           C332 140, 314 210, 326 290
           C338 370, 316 450, 326 525
           C334 575, 302 595, 245 592"
        stroke="#6B2232"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M180 46
           C235 36, 315 48, 324 95
           C332 140, 314 210, 326 290
           C338 370, 316 450, 326 525
           C334 575, 302 595, 245 592"
        stroke="#C5A059"
        strokeWidth="1.5"
        strokeOpacity="0.8"
      />

      <g>
        <path
          d="M180 46 C148 18, 122 25, 132 48 C142 66, 165 55, 180 46 Z"
          fill="#7D293B"
          stroke="#4A121E"
          strokeWidth="2"
        />
        <path
          d="M180 46 C212 18, 238 25, 228 48 C218 66, 195 55, 180 46 Z"
          fill="#7D293B"
          stroke="#4A121E"
          strokeWidth="2"
        />
        <path
          d="M176 50 C162 68, 152 84, 146 96 L158 92 C165 78, 173 62, 179 52 Z"
          fill="#6B2232"
        />
        <path
          d="M184 50 C198 68, 208 84, 214 96 L202 92 C195 78, 187 62, 181 52 Z"
          fill="#6B2232"
        />
        <ellipse cx="180" cy="46" rx="8" ry="10" fill="#541623" stroke="#C5A059" strokeWidth="1.5" />
      </g>

      <g stroke="#7A4953" strokeWidth="1.2" opacity="0.85">
        <ellipse cx="180" cy="565" rx="48" ry="12" fill="#FBF4E8" />
        <path d="M132 565 L136 608 C155 615, 205 615, 224 608 L228 565" fill="#F6E8D5" fillOpacity="0.7" />
        <line x1="180" y1="530" x2="180" y2="562" />
        <line x1="168" y1="538" x2="168" y2="554" />
        <line x1="192" y1="538" x2="192" y2="554" />
        <path d="M168 554 Q180 560 192 554" fill="none" />
        <circle cx="180" cy="527" r="2.5" fill="#E8B954" stroke="none" />
        <circle cx="168" cy="535" r="2" fill="#E8B954" stroke="none" />
        <circle cx="192" cy="535" r="2" fill="#E8B954" stroke="none" />
      </g>
    </svg>
  );
}
