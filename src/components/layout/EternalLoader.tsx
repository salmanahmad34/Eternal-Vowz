'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function EternalLogoBadge({
  size = 'md',
  animated = false,
}: {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
}) {
  const dims =
    size === 'sm'
      ? 'w-9 h-9 text-[11px]'
      : size === 'lg'
      ? 'w-14 h-14 text-base'
      : size === 'xl'
      ? 'w-20 h-20 text-xl'
      : 'w-11 h-11 text-xs';

  return (
    <div className={`relative ${dims} rounded-full flex items-center justify-center shrink-0 select-none`}>
      {/* Outer Animated Champagne Gold Filigree Ring */}
      <motion.div
        animate={animated ? { rotate: 360 } : undefined}
        transition={animated ? { duration: 10, repeat: Infinity, ease: 'linear' } : undefined}
        className="absolute inset-0 rounded-full border-[1.5px] border-dashed border-[#C9A84C]"
      />
      {/* Inner Editorial Cream & Gold Medallion */}
      <motion.div
        animate={animated ? { scale: [1, 1.04, 1] } : undefined}
        transition={animated ? { duration: 2.2, repeat: Infinity, ease: 'easeInOut' } : undefined}
        className="w-[84%] h-[84%] rounded-full bg-gradient-to-br from-[#FFFDF8] to-[#F6EEDB] border border-[#C9A84C] shadow-xs flex items-center justify-center"
      >
        <span className="font-serif font-bold tracking-wider text-[#C9A84C] leading-none">
          E&amp;V
        </span>
      </motion.div>
    </div>
  );
}

export function EternalLoader({
  fullScreen = true,
  label = 'Eternal Vowz • Crafting Your Digital Wedding Suite...',
}: {
  fullScreen?: boolean;
  label?: string;
}) {
  return (
    <div
      className={`${
        fullScreen ? 'fixed inset-0 z-[100]' : 'w-full py-16'
      } bg-[#FAF7F2] flex flex-col items-center justify-center p-6 text-center select-none`}
    >
      <div className="relative w-24 h-24 flex items-center justify-center mb-5">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-full border-2 border-dashed border-[#C9A84C]"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-2 rounded-full border border-[#E2D7BD]"
        />
        <motion.div
          animate={{ scale: [0.95, 1.05, 0.95] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FFFDF8] to-[#F6EEDB] border-2 border-[#C9A84C] shadow-md flex items-center justify-center"
        >
          <span className="font-serif text-lg font-bold tracking-widest text-[#C9A84C]">
            E&amp;V
          </span>
        </motion.div>
      </div>

      <motion.p
        animate={{ opacity: [0.55, 1, 0.55] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        className="font-serif text-2xl font-normal text-[#291418] tracking-wide"
      >
        Eternal Vowz
      </motion.p>
      <p className="text-[11px] uppercase tracking-[0.22em] text-[#8B7355] mt-1">
        {label}
      </p>
    </div>
  );
}

export function InitialSplashOverlay() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 650);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="eternal-vowz-splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.4, ease: 'easeOut' } }}
          className="fixed inset-0 z-[120] bg-[#FAF7F2] flex flex-col items-center justify-center pointer-events-none"
        >
          <div className="relative w-24 h-24 flex items-center justify-center mb-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 rounded-full border-2 border-dashed border-[#C9A84C]"
            />
            <motion.div
              animate={{ scale: [0.93, 1.05, 0.93] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
              className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FFFDF8] to-[#F6EEDB] border-2 border-[#C9A84C] shadow-md flex items-center justify-center"
            >
              <span className="font-serif text-lg font-bold tracking-widest text-[#C9A84C]">
                E&amp;V
              </span>
            </motion.div>
          </div>
          <span className="font-serif text-2xl font-normal text-[#291418] tracking-wide">
            Eternal Vowz
          </span>
          <span className="text-[10px] uppercase tracking-[0.24em] text-[#8B7355] mt-1">
            Bespoke 3D Digital Wedding Invitations
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
