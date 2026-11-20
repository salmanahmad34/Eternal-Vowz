'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import FloatingParticles from './FloatingParticles';

interface CinemaVideoRevealProps {
  videoSrc: string;
  posterSrc: string;
  heroImageSrc?: string;
  guestName?: string;
  waxSealInitial?: string;
  coupleNames?: { partner1: string; partner2: string };
  eventDateFormatted?: string;
  stage: 'closed' | 'opening';
  isPreview?: boolean;
  onStartPlay: () => void;
  onVideoComplete: () => void;
}

/**
 * Full-bleed seamless 3D cinema intro that feels 100% like an interactive animation,
 * NOT a video player:
 * - Zero controls, zero text clutter — ONLY a clean "Tap Anywhere to Enter" pill at bottom
 * - Tapping ANYWHERE dissolves the pill immediately & glides smoothly through the animation
 * - Crossfades directly into the ALREADY-MOUNTED Hero image underneath with ZERO black flash
 */
export default function CinemaVideoReveal({
  videoSrc,
  posterSrc,
  heroImageSrc,
  stage,
  isPreview = false,
  onStartPlay,
  onVideoComplete,
}: CinemaVideoRevealProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const completedRef = useRef(false);
  const fallbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isPlaying = stage === 'opening';

  const clearFallbackTimer = () => {
    if (fallbackTimerRef.current) {
      clearTimeout(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }
  };

  const finishSequence = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    clearFallbackTimer();
    // Keep the bright final frame frozen (never fade to black) while parent crossfades straight into the Hero card
    const v = videoRef.current;
    if (v && !v.paused) {
      try {
        v.pause();
      } catch {
        // Ignore pause error
      }
    }
    onVideoComplete();
  };

  // Reset cleanly when replayed or remounted
  useEffect(() => {
    if (stage === 'closed') {
      completedRef.current = false;
      clearFallbackTimer();
      const v = videoRef.current;
      if (v) {
        try {
          v.pause();
          v.currentTime = 0;
        } catch {
          // Ignore seek error before metadata loads
        }
      }
    }
    return () => {
      clearFallbackTimer();
    };
  }, [stage]);

  const handleTapAnywhere = () => {
    if (stage !== 'closed') return;
    completedRef.current = false;
    onStartPlay();

    const v = videoRef.current;
    if (v) {
      try {
        v.muted = true;
        v.currentTime = 0;
        const playPromise = v.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            finishSequence();
          });
        }
      } catch {
        finishSequence();
      }
    }

    // Safety fallback timer in case onEnded is ever delayed by a mobile browser
    clearFallbackTimer();
    fallbackTimerRef.current = setTimeout(() => {
      finishSequence();
    }, 10500);
  };

  const handleTimeUpdate = () => {
    const v = videoRef.current;
    if (!v || !isPlaying || completedRef.current) return;
    // Trigger crossfade right before the end so any trailing black video frame is never shown
    if (v.duration && v.duration > 1 && v.currentTime >= v.duration - 0.35) {
      finishSequence();
    }
  };

  return (
    <div
      onClick={handleTapAnywhere}
      onContextMenu={(e) => e.preventDefault()}
      className={`relative w-full ${
        isPreview ? 'h-[640px]' : 'h-[100dvh] max-h-[860px] min-h-[640px]'
      } overflow-hidden cursor-pointer select-none`}
    >
      {/* Warm preloaded Hero/Poster safety backdrop underneath video so zero black ever flashes */}
      <img
        src={isPlaying && heroImageSrc ? heroImageSrc : posterSrc}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0"
      />

      {/* Seamless Full-Bleed Animated Scene Layer (zero controls, pointer-events-none) */}
      <div className="absolute inset-0 z-[1]">
        <video
          ref={videoRef}
          src={videoSrc}
          poster={posterSrc}
          muted
          playsInline
          preload="auto"
          controls={false}
          disablePictureInPicture
          disableRemotePlayback
          onTimeUpdate={handleTimeUpdate}
          onEnded={finishSequence}
          className="w-full h-full object-cover pointer-events-none"
        />
      </div>

      {/* Subtle Ambient Golden Motes while waiting for tap */}
      {!isPlaying && (
        <div className="absolute inset-0 z-10 pointer-events-none">
          <FloatingParticles count={isPreview ? 8 : 14} color="#F3D58D" />
          <div
            className="absolute inset-x-0 bottom-0 h-32"
            style={{
              background:
                'linear-gradient(180deg, rgba(18,12,8,0) 0%, rgba(18,12,8,0.55) 100%)',
            }}
          />
        </div>
      )}

      {/* Minimal Bottom Prompt ONLY — "Tap Anywhere to Enter" (dissolves cleanly on tap) */}
      <motion.div
        animate={
          isPlaying
            ? {
                opacity: 0,
                scale: 1.06,
                filter: 'blur(6px)',
                transition: { duration: 0.4, ease: 'easeIn' },
              }
            : { opacity: 1, scale: 1, filter: 'blur(0px)' }
        }
        className="absolute inset-x-0 bottom-10 z-20 flex justify-center px-6 pointer-events-none"
      >
        <motion.div
          animate={{ opacity: [0.85, 1, 0.85], y: [0, -3, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          className="px-6 py-2.5 rounded-full bg-[#1C140E]/85 text-[#FFF6E0] border border-[#E5C17B]/60 shadow-[0_10px_30px_rgba(0,0,0,0.45)] backdrop-blur-md"
        >
          <span className="text-[10px] uppercase tracking-[0.24em] font-semibold">
            Tap Anywhere to Enter
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
}
