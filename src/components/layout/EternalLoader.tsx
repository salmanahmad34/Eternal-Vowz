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
      {/* Inner Editorial Cream & Gold Medallion with Circular Monogram */}
      <motion.div
        animate={animated ? { scale: [1, 1.04, 1] } : undefined}
        transition={animated ? { duration: 2.2, repeat: Infinity, ease: 'easeInOut' } : undefined}
        className="w-[84%] h-[84%] rounded-full overflow-hidden shadow-xs flex items-center justify-center bg-[#FAF7F2]"
      >
        <img
          src="/assets/logo-circle.png"
          alt="Eternal Vowz (E&V)"
          className="w-full h-full object-cover rounded-full"
        />
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
        fullScreen ? 'fixed inset-0 z-[100]' : 'w-full py-10'
      } bg-[#FAF7F2] flex flex-col items-center justify-center p-4 text-center select-none`}
    >
      <div className="relative w-14 h-14 flex items-center justify-center mb-3">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-full border-[1.5px] border-dashed border-[#C9A84C]"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-1 rounded-full border border-[#E2D7BD]"
        />
        <motion.div
          animate={{ scale: [0.95, 1.04, 0.95] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="w-10 h-10 rounded-full overflow-hidden border-[1.5px] border-[#C9A84C] shadow-xs flex items-center justify-center bg-[#FAF7F2]"
        >
          <img
            src="/assets/logo-circle.png"
            alt="Eternal Vowz (E&V)"
            className="w-full h-full object-cover rounded-full"
          />
        </motion.div>
      </div>

      <motion.p
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        className="font-serif text-base font-normal text-[#291418] tracking-wide"
      >
        Eternal Vowz
      </motion.p>
      <p className="text-[10px] uppercase tracking-[0.2em] text-[#8B7355] mt-0.5">
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
    }, 550);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="eternal-vowz-splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.35, ease: 'easeOut' } }}
          className="fixed inset-0 z-[120] bg-[#FAF7F2] flex flex-col items-center justify-center pointer-events-none p-4"
        >
          <div className="relative w-14 h-14 flex items-center justify-center mb-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 rounded-full border-[1.5px] border-dashed border-[#C9A84C]"
            />
            <motion.div
              animate={{ scale: [0.94, 1.04, 0.94] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
              className="w-10 h-10 rounded-full overflow-hidden border-[1.5px] border-[#C9A84C] shadow-xs flex items-center justify-center bg-[#FAF7F2]"
            >
              <img
                src="/assets/logo-circle.png"
                alt="Eternal Vowz (E&V)"
                className="w-full h-full object-cover rounded-full"
              />
            </motion.div>
          </div>
          <span className="font-serif text-base font-normal text-[#291418] tracking-wide">
            Eternal Vowz
          </span>
          <span className="text-[9px] uppercase tracking-[0.22em] text-[#8B7355] mt-0.5">
            Bespoke 3D Digital Wedding Invitations
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
