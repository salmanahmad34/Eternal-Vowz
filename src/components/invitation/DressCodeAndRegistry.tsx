'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Gift, Heart, Copy, Check, Hotel, Shirt } from 'lucide-react';

interface DressCodeAndRegistryProps {
  accentColor?: string;
  venueName?: string;
}

const PALETTE = [
  { name: 'Champagne Gold', hex: '#C5A059', textColor: '#FFFFFF' },
  { name: 'Warm Terracotta', hex: '#B38B6D', textColor: '#FFFFFF' },
  { name: 'Dusty Rose', hex: '#DCAE96', textColor: '#2F2A24' },
  { name: 'Lavender Mist', hex: '#D4C5E2', textColor: '#2F2A24' },
  { name: 'Ivory Cream', hex: '#F9F6F0', textColor: '#2F2A24' },
];

export default function DressCodeAndRegistry({
  accentColor = '#C5A059',
  venueName = 'The Grand Beverly Gardens',
}: DressCodeAndRegistryProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showBankDetails, setShowBankDetails] = useState(false);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  return (
    <div className="w-full space-y-12 my-12">
      {/* 1. Dress Code & Color Palette */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative p-6 sm:p-8 rounded-2xl bg-stone-50/80 border border-stone-200/90 text-center"
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <Shirt className="w-4 h-4 text-[#C5A059]" />
          <span className="text-[10px] sm:text-xs font-sans font-semibold tracking-[0.25em] uppercase text-stone-500">
            DRESS CODE &amp; PALETTE
          </span>
        </div>
        <h3 className="font-serif text-2xl sm:text-3xl text-stone-900 font-medium mb-3">
          Formal &bull; Cocktail Elegance
        </h3>
        <p className="font-serif italic text-stone-600 text-sm max-w-md mx-auto mb-6">
          We invite you to celebrate with us in tones inspired by romantic sunset hues and timeless neutrals.
        </p>

        {/* Color Palette Swatches */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {PALETTE.map((color) => (
            <div key={color.name} className="flex flex-col items-center gap-1.5 group">
              <div
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white shadow-md transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg flex items-center justify-center relative cursor-default"
                style={{ backgroundColor: color.hex }}
              >
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[8px] font-sans font-bold" style={{ color: color.textColor }}>
                  ✦
                </span>
              </div>
              <span className="text-[10px] font-sans text-stone-600 font-medium tracking-tight">
                {color.name}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* 2. Honeymoon Fund & Registry */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-[#FAF8F5] to-stone-50 border border-[#C5A059]/30 text-center shadow-xs"
      >
        <div className="w-10 h-10 mx-auto rounded-full bg-[#C5A059]/15 flex items-center justify-center mb-3">
          <Gift className="w-5 h-5 text-[#C5A059]" />
        </div>
        <span className="text-[10px] sm:text-xs font-sans font-semibold tracking-[0.25em] uppercase text-stone-500 block mb-1">
          GIFT REGISTRY
        </span>
        <h3 className="font-serif text-2xl sm:text-3xl text-stone-900 font-medium mb-2">
          Honeymoon Fund
        </h3>
        <p className="font-serif italic text-stone-600 text-sm max-w-lg mx-auto leading-relaxed mb-6">
          Your warm presence and blessings on our special day are the greatest gifts we could ever ask for. 
          For those who have asked or wish to celebrate with a gift, a contribution toward our dream honeymoon adventure would be deeply appreciated.
        </p>

        <button
          onClick={() => setShowBankDetails(!showBankDetails)}
          className="px-6 py-2.5 rounded-full border border-[#C5A059] text-stone-800 hover:text-stone-950 font-sans text-xs tracking-wider uppercase font-semibold transition-all hover:bg-[#C5A059]/10 shadow-xs inline-flex items-center gap-2"
        >
          <Heart className="w-3.5 h-3.5 text-[#C5A059] fill-[#C5A059]" />
          {showBankDetails ? 'Hide Contribution Details' : 'View Direct Contribution Info'}
        </button>

        {showBankDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.4 }}
            className="mt-6 pt-6 border-t border-stone-200/80 max-w-md mx-auto text-left space-y-3 font-sans text-xs"
          >
            <div className="p-3.5 rounded-xl bg-white border border-stone-200 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase font-bold text-stone-400">Bank Transfer / Zelle</p>
                <p className="font-medium text-stone-800">sophia.alexander.wedding@gmail.com</p>
              </div>
              <button
                onClick={() => handleCopy('sophia.alexander.wedding@gmail.com', 'zelle')}
                className="p-2 rounded-lg hover:bg-stone-100 text-stone-500 hover:text-stone-900 transition-colors"
                title="Copy to clipboard"
              >
                {copiedKey === 'zelle' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-stone-200 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase font-bold text-stone-400">Account / IBAN</p>
                <p className="font-mono text-stone-800 font-medium">US89 3000 1204 9482 1093</p>
              </div>
              <button
                onClick={() => handleCopy('US89 3000 1204 9482 1093', 'iban')}
                className="p-2 rounded-lg hover:bg-stone-100 text-stone-500 hover:text-stone-900 transition-colors"
                title="Copy IBAN"
              >
                {copiedKey === 'iban' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* 3. Accommodations & Stay */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative p-6 sm:p-8 rounded-2xl bg-stone-50/80 border border-stone-200/90 text-center"
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <Hotel className="w-4 h-4 text-[#C5A059]" />
          <span className="text-[10px] sm:text-xs font-sans font-semibold tracking-[0.25em] uppercase text-stone-500">
            WHERE TO STAY
          </span>
        </div>
        <h3 className="font-serif text-2xl sm:text-3xl text-stone-900 font-medium mb-2">
          Recommended Accommodations
        </h3>
        <p className="font-serif italic text-stone-600 text-sm max-w-md mx-auto mb-6">
          We have reserved a courtesy room block nearby for our traveling family and honored guests.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-w-lg mx-auto">
          <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-xs">
            <h4 className="font-serif font-bold text-stone-900 text-base">The Beverly Hills Hotel</h4>
            <p className="text-xs text-stone-500 mt-0.5">5 mins from venue &bull; Complimentary shuttle</p>
            <p className="text-xs text-[#C5A059] font-medium mt-2 font-mono">Code: SOPHIA-ALEX</p>
          </div>
          <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-xs">
            <h4 className="font-serif font-bold text-stone-900 text-base">The Maybourne Beverly</h4>
            <p className="text-xs text-stone-500 mt-0.5">8 mins from venue &bull; Valet included</p>
            <p className="text-xs text-[#C5A059] font-medium mt-2 font-mono">Code: WEDDING2027</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
