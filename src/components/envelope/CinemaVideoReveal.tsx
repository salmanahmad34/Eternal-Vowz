'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import FloatingParticles from './FloatingParticles';

interface CinemaVideoRevealProps {
  videoSrc: string;
  posterSrc: string;
  guestName: string;
  waxSealInitial: string;
  coupleNames: { partner1: string; partner2: string };
  eventDateFormatted: string;
  stage: 'closed' | 'opening';
  isPreview?: boolean;
  onStartPlay: () => void;
  onVideoComplete: () => void;
}

/**
 * Full-bleed seamless 3D cinema intro that feels 100% like an interactive animation,
 * NOT a video player:
 * - Zero controls, zero play-button UI, instant frame-0 poster with live golden dust motes
 * - Tapping ANYWHERE on the screen dissolves the prompt & glides smoothly through the lattice
 * - Automatically crossfades straight into the opened card & starts background music on finish
 */
export default function CinemaVideoReveal({
  videoSrc,
  posterSrc,
  guestName,
  waxSealInitial,
  coupleNames,
  eventDateFormatted,
  stage,
  isPreview = false,
  onStartPlay,
  onVideoComplete,
}: CinemaVideoRevealProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const completedRef = useRef(false);
  const fallbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isFadingOut, setIsFadingOut] = useState(false);

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
    setIsFadingOut(true);
    setTimeout(() => {
      onVideoComplete();
    }, 260);
  };

  // Reset cleanly when replayed or remounted
  useEffect(() => {
    if (stage === 'closed') {
      completedRef.current = false;
      setIsFadingOut(false);
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
    setIsFadingOut(false);
    onStartPlay();

    const v = videoRef.current;
    if (v) {
      try {
        v.muted = true;
        v.currentTime = 0;
        const playPromise = v.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // If headless/restricted browser refuses video playback, still gracefully reveal card
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
    if (v.duration && v.duration > 1 && v.currentTime >= v.duration - 0.28) {
      finishSequence();
    }
  };

  return (
    <div
      onClick={handleTapAnywhere}
      onContextMenu={(e) => e.preventDefault()}
      className={`relative w-full ${
        isPreview ? 'h-[640px]' : 'h-[100dvh] max-h-[860px] min-h-[640px]'
      } overflow-hidden cursor-pointer select-none bg-[#120D0A]`}
    >
      {/* Seamless Full-Bleed Animated Scene Layer (zero controls, pointer-events-none) */}
      <motion.div
        animate={{
          opacity: isFadingOut ? 0.15 : 1,
          scale: isFadingOut ? 1.03 : 1,
        }}
        transition={{ duration: 0.35, ease: 'easeInOut' }}
        className="absolute inset-0 z-0"
      >
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
      </motion.div>

      {/* Subtle Ambient Golden Motes while waiting for tap — keeps frame 0 alive like native 3D */}
      {!isPlaying && (
        <div className="absolute inset-0 z-10 pointer-events-none">
          <FloatingParticles count={isPreview ? 8 : 14} color="#F3D58D" />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg, rgba(18,12,8,0.52) 0%, rgba(18,12,8,0.08) 32%, rgba(18,12,8,0.08) 68%, rgba(18,12,8,0.62) 100%)',
            }}
          />
        </div>
      )}

      {/* Elegant Floating Invitation Overlay — Dissolves completely on tap anywhere */}
      <motion.div
        animate={
          isPlaying
            ? {
                opacity: 0,
                scale: 1.08,
                filter: 'blur(6px)',
                transition: { duration: 0.48, ease: 'easeIn' },
              }
            : { opacity: 1, scale: 1, filter: 'blur(0px)' }
        }
        className="absolute inset-0 z-20 flex flex-col items-center justify-between py-10 px-6 text-center pointer-events-none"
      >
        {/* Top Personalized Greeting */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#1C140E]/70 backdrop-blur-md border border-[#E5C17B]/45 shadow-md">
            <Sparkles className="w-3 h-3 text-[#E5C17B]" />
            <span className="text-[9px] uppercase tracking-[0.26em] text-[#F9EED7] font-semibold">
              Royal Wedding Invitation
            </span>
          </div>
          <p className="font-great-vibes text-[30px] text-[#FFF6DE] leading-tight pt-1 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
            For {guestName}
          </p>
        </div>

        {/* Subtle Glowing Gold Star Ring around the center lattice aperture */}
        <div className="relative flex flex-col items-center justify-center">
          <motion.div
            animate={{ scale: [0.96, 1.05, 0.96], opacity: [0.45, 0.85, 0.45] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
            className="w-28 h-28 rounded-full border border-[#F3D58D]/75 shadow-[0_0_35px_rgba(229,193,123,0.45)] flex items-center justify-center bg-[#1A120C]/25 backdrop-blur-[1px]"
          >
            <div className="flex flex-col items-center">
              <span className="font-serif text-lg font-semibold tracking-[0.2em] text-[#FFF6DC] drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)]">
                {waxSealInitial}
              </span>
              <span className="text-[8px] uppercase tracking-[0.24em] text-[#E5C17B] mt-1 font-medium">
                {eventDateFormatted}
              </span>
            </div>
          </motion.div>
        </div>

        {/* Bottom Interactive Prompt */}
        <div className="space-y-2">
          <p className="font-serif text-xs tracking-[0.22em] uppercase text-[#F8E7B8] drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
            {coupleNames.partner1} &amp; {coupleNames.partner2}
          </p>
          <motion.div
            animate={{ opacity: [0.85, 1, 0.85], y: [0, -2, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            className="px-6 py-2.5 rounded-full bg-[#1C140E]/85 text-[#FFF6E0] border border-[#E5C17B]/60 shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-md"
          >
            <span className="text-[10px] uppercase tracking-[0.24em] font-semibold">
              Tap Anywhere to Enter
            </span>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
