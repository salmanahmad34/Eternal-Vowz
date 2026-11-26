'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PartyPopper, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ScratchCountdownBoxesProps {
  timeLeft: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  };
  invitationSlug?: string;
  isDarkPalace?: boolean;
  isPreview?: boolean;
  resetTrigger?: number;
  eventDate?: string;
  readableDate?: string;
  onAllScratched?: () => void;
  onResetScratch?: () => void;
  onExploreNext?: () => void;
}

interface BoxUnit {
  id: 'days' | 'hours' | 'minutes';
  label: string;
  value: number;
}

// Synthesize authentic party popper sound via Web Audio API
function playPartyPopperSound() {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    const now = ctx.currentTime;

    // 1. Popper "POP" transient (low thump)
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.12);

    oscGain.gain.setValueAtTime(0.85, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.14);

    // 2. Confetti fizzle noise burst
    const bufferSize = ctx.sampleRate * 0.22;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1800, now);
    filter.Q.setValueAtTime(1.2, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.4, now + 0.02);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start(now + 0.02);
    noise.stop(now + 0.24);

    // 3. Harmonious joyful chime (chord)
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const chime = ctx.createOscillator();
      const chimeGain = ctx.createGain();
      const startAt = now + 0.08 + idx * 0.04;

      chime.type = 'sine';
      chime.frequency.setValueAtTime(freq, startAt);

      chimeGain.gain.setValueAtTime(0.25, startAt);
      chimeGain.gain.exponentialRampToValueAtTime(0.001, startAt + 0.45);

      chime.connect(chimeGain);
      chimeGain.connect(ctx.destination);
      chime.start(startAt);
      chime.stop(startAt + 0.45);
    });
  } catch {
    // Audio context may be restricted before interaction
  }
}

// Single Scratchable Countdown Box Component
function SingleScratchBox({
  unit,
  isScratched,
  onScratched,
  onFirstInteract,
  isDarkPalace,
}: {
  unit: BoxUnit;
  isScratched: boolean;
  onScratched: () => void;
  onFirstInteract?: () => void;
  isDarkPalace: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const strokeCountRef = useRef(0);
  const [fading, setFading] = useState(false);

  // Reset internal draw counters whenever box returns to unscratched state
  useEffect(() => {
    if (!isScratched) {
      setFading(false);
      strokeCountRef.current = 0;
      lastPointRef.current = null;
      isDrawingRef.current = false;
    }
  }, [isScratched]);

  // Initialize and paint clean metallic gold scratch foil (zero text, zero icons/logos)
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || isScratched) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const width = rect.width || 80;
    const height = rect.height || 80;

    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Pure normal metallic gold / champagne scratch-off foil surface
    const grad = ctx.createLinearGradient(0, 0, width, height);
    if (isDarkPalace) {
      grad.addColorStop(0, '#C9A23F');
      grad.addColorStop(0.28, '#F4E3AD');
      grad.addColorStop(0.55, '#D2AA48');
      grad.addColorStop(0.82, '#AA832E');
      grad.addColorStop(1, '#8C6820');
    } else {
      grad.addColorStop(0, '#E2BE74');
      grad.addColorStop(0.32, '#FFF4D4');
      grad.addColorStop(0.65, '#D4AC53');
      grad.addColorStop(1, '#B38832');
    }

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Subtle metallic foil micro-grain lines (purely tactile texture, no text or logo)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
    ctx.lineWidth = 0.75;
    for (let i = -height; i < width + height; i += 6) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + height * 0.5, height);
      ctx.stroke();
    }

    // Minimal clean inner hairline frame
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.lineWidth = 1;
    ctx.strokeRect(3, 3, width - 6, height - 6);
  }, [isDarkPalace, isScratched]);

  useEffect(() => {
    initCanvas();
  }, [initCanvas]);

  // Check how much percentage of the foil has been scratched
  const checkScratchPercentage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || isScratched) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      const w = canvas.width;
      const h = canvas.height;
      const imgData = ctx.getImageData(0, 0, w, h);
      const data = imgData.data;

      let transparentPixels = 0;
      const step = 20; // sample every 20th pixel for instant performance
      let sampled = 0;

      for (let i = 3; i < data.length; i += 4 * step) {
        sampled++;
        if (data[i] === 0) {
          transparentPixels++;
        }
      }

      const ratio = transparentPixels / sampled;
      // Auto complete reveal when ~18% is scratched or user has scratched 6+ strokes
      if (ratio >= 0.18 || strokeCountRef.current >= 6) {
        setFading(true);
        setTimeout(() => {
          onScratched();
        }, 160);
      }
    } catch {
      // Fallback
    }
  }, [isScratched, onScratched]);

  // Scratch action
  const doScratch = useCallback(
    (clientX: number, clientY: number) => {
      const canvas = canvasRef.current;
      if (!canvas || isScratched) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = 28;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();
      if (lastPointRef.current) {
        ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
        ctx.lineTo(x, y);
      } else {
        ctx.arc(x, y, 14, 0, Math.PI * 2);
      }
      ctx.stroke();

      lastPointRef.current = { x, y };
      strokeCountRef.current++;

      checkScratchPercentage();
    },
    [checkScratchPercentage, isScratched]
  );

  // Mouse Handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    onFirstInteract?.();
    isDrawingRef.current = true;
    lastPointRef.current = null;
    doScratch(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    doScratch(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    isDrawingRef.current = false;
    lastPointRef.current = null;
    checkScratchPercentage();
  };

  // Touch Handlers
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    onFirstInteract?.();
    isDrawingRef.current = true;
    lastPointRef.current = null;
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      doScratch(touch.clientX, touch.clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || e.touches.length === 0) return;
    const touch = e.touches[0];
    doScratch(touch.clientX, touch.clientY);
  };

  const handleTouchEnd = () => {
    isDrawingRef.current = false;
    lastPointRef.current = null;
    checkScratchPercentage();
  };

  return (
    <div ref={containerRef} className="relative flex flex-col items-center select-none">
      {/* Box container — compact & refined */}
      <div
        className={`w-full aspect-square rounded-xl relative overflow-hidden transition-all duration-300 flex flex-col items-center justify-center p-1.5 shadow-md ${
          isDarkPalace
            ? 'bg-gradient-to-b from-[#24170E] to-[#160E08] border border-[#E5C17B]/60 shadow-[0_4px_16px_rgba(0,0,0,0.55)]'
            : 'bg-gradient-to-b from-[#FFFDF9] to-[#F5ECE0] border border-[#D4AF37]/50 shadow-[0_4px_14px_rgba(197,160,89,0.15)]'
        } ${isScratched ? 'ring-1.5 ring-[#D4AF37]/50 ring-offset-1 ring-offset-transparent' : ''}`}
      >
        {/* Subtle decorative background watermark */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle at center, #D4AF37 1px, transparent 1px)`,
            backgroundSize: '10px 10px',
          }}
        />

        {/* Revealed Number and Live Digits (Hidden behind opaque foil until scratched) */}
        <div className="relative z-0 flex flex-col items-center justify-center">
          <span
            className={`font-serif font-bold tabular-nums text-[20px] sm:text-[22px] leading-none tracking-tight drop-shadow-sm transition-transform duration-300 ${
              isDarkPalace ? 'text-[#FFF4CF]' : 'text-[#2C1F14]'
            } ${isScratched ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
          >
            {String(unit.value).padStart(2, '0')}
          </span>
          <span
            className={`font-sans font-bold text-[7px] sm:text-[7.5px] tracking-[0.2em] uppercase mt-0.5 transition-all ${
              isDarkPalace ? 'text-[#E5C17B]' : 'text-[#8C6430]'
            } ${isScratched ? 'opacity-100' : 'opacity-0'}`}
          >
            {unit.label}
          </span>
        </div>

        {/* Clean Scratch Foil Canvas (Zero Text & Zero Logo on top) */}
        {!isScratched && (
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className={`absolute inset-0 w-full h-full cursor-pointer touch-none z-10 transition-opacity duration-300 rounded-xl ${
              fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
          />
        )}
      </div>
    </div>
  );
}

export default function ScratchCountdownBoxes({
  timeLeft,
  invitationSlug = 'wedding',
  isDarkPalace = true,
  isPreview = false,
  resetTrigger = 0,
  eventDate,
  readableDate,
  onAllScratched,
  onResetScratch,
}: ScratchCountdownBoxesProps) {
  const [scratchedState, setScratchedState] = useState<{
    days: boolean;
    hours: boolean;
    minutes: boolean;
  }>({
    days: false,
    hours: false,
    minutes: false,
  });

  const [hasCelebrated, setHasCelebrated] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Restore scratched state from localStorage on real invite pages
  useEffect(() => {
    if (isPreview) return;
    try {
      if (typeof window !== 'undefined' && invitationSlug) {
        const stored = localStorage.getItem(`ev_scratch_boxes_${invitationSlug}`);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && typeof parsed === 'object') {
            const anyDone = Boolean(parsed.days || parsed.hours || parsed.minutes);
            setScratchedState({
              days: !!parsed.days,
              hours: !!parsed.hours,
              minutes: !!parsed.minutes,
            });
            if (anyDone) setHasInteracted(true);
            if (parsed.days && parsed.hours && parsed.minutes) {
              setHasCelebrated(true);
              if (onAllScratched) onAllScratched();
            }
          }
        }
      }
    } catch {
      // Ignore storage errors in private mode
    }
  }, [invitationSlug, isPreview, onAllScratched]);

  // Reset when builder/studio triggers Replay Animation
  useEffect(() => {
    if (resetTrigger > 0) {
      setScratchedState({ days: false, hours: false, minutes: false });
      setHasCelebrated(false);
      setHasInteracted(false);
    }
  }, [resetTrigger]);

  const units: BoxUnit[] = [
    { id: 'days', label: 'DAYS', value: timeLeft.days },
    { id: 'hours', label: 'HOURS', value: timeLeft.hours },
    { id: 'minutes', label: 'MINUTES', value: timeLeft.minutes },
  ];

  // Fire Party Popper fireworks & audio celebration confined strictly to phone screen
  const triggerCelebration = useCallback(() => {
    playPartyPopperSound();

    try {
      const localCanvas = document.getElementById('card-confetti-canvas') as HTMLCanvasElement | null;
      const fire = localCanvas
        ? confetti.create(localCanvas, { resize: true, useWorker: false })
        : confetti;

      // 1. Center & high spread party popper
      fire({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.62 },
        colors: ['#FFD700', '#FFDF73', '#FF2D55', '#FFFFFF', '#4CD964', '#5856D6'],
        disableForReducedMotion: true,
      });

      // 2. Left and Right synchronized cannons
      setTimeout(() => {
        fire({
          particleCount: 40,
          angle: 55,
          spread: 50,
          origin: { x: 0.2, y: 0.7 },
          colors: ['#FFD700', '#FFDF73', '#FFFFFF', '#FF3B30'],
        });
        fire({
          particleCount: 40,
          angle: 125,
          spread: 50,
          origin: { x: 0.8, y: 0.7 },
          colors: ['#FFD700', '#FFDF73', '#FFFFFF', '#FF3B30'],
        });
      }, 200);

      // 3. Falling gold star shower
      setTimeout(() => {
        fire({
          particleCount: 25,
          spread: 90,
          origin: { y: 0.35 },
          shapes: ['circle'],
          colors: ['#FFD700', '#FFF2D1', '#FFFFFF'],
        });
      }, 450);
    } catch {
      // Confetti fallback
    }

    setHasCelebrated(true);
    if (onAllScratched) {
      onAllScratched();
    }
  }, [onAllScratched]);

  // Handle box scratch completion
  const handleBoxScratched = useCallback(
    (boxId: 'days' | 'hours' | 'minutes') => {
      setHasInteracted(true);
      setScratchedState((prev) => {
        const next = { ...prev, [boxId]: true };
        try {
          if (!isPreview && typeof window !== 'undefined' && invitationSlug) {
            localStorage.setItem(`ev_scratch_boxes_${invitationSlug}`, JSON.stringify(next));
          }
        } catch {}

        // Check if all 3 are now scratched
        if (next.days && next.hours && next.minutes && !hasCelebrated) {
          setTimeout(() => {
            triggerCelebration();
          }, 260);
        }

        return next;
      });
    },
    [hasCelebrated, invitationSlug, isPreview, triggerCelebration]
  );

  // Reset Handler for replayability
  const handleResetScratch = () => {
    const fresh = { days: false, hours: false, minutes: false };
    setScratchedState(fresh);
    setHasCelebrated(false);
    setHasInteracted(false);
    try {
      if (typeof window !== 'undefined' && invitationSlug) {
        localStorage.removeItem(`ev_scratch_boxes_${invitationSlug}`);
        localStorage.removeItem(`ev_date_scratched_${invitationSlug}`);
      }
    } catch {}
    if (onResetScratch) {
      onResetScratch();
    }
  };

  const scratchedCount =
    (scratchedState.days ? 1 : 0) +
    (scratchedState.hours ? 1 : 0) +
    (scratchedState.minutes ? 1 : 0);

  const allScratched = scratchedCount === 3;
  const displayDate = readableDate || eventDate || 'Sunday, 24 October 2027';

  return (
    <div className="w-full max-w-[215px] sm:max-w-[230px] mx-auto my-2 relative">
      {/* Subtle Replay Button shown ONLY after reveal */}
      {allScratched && (
        <div className="flex items-center justify-end px-1 mb-1.5">
          <button
            type="button"
            onClick={handleResetScratch}
            className={`flex items-center gap-1 text-[9px] font-sans font-semibold tracking-wider transition-opacity hover:opacity-100 cursor-pointer ${
              isDarkPalace ? 'text-[#C5A059] opacity-80' : 'text-[#8C6D46] opacity-75'
            }`}
            title="Scratch again"
          >
            <RotateCcw className="w-2.5 h-2.5" />
            <span>Replay</span>
          </button>
        </div>
      )}

      {/* 3 Clean Metallic Gold Scratch Boxes (No text or logo on foil) */}
      <div className="relative">
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
          {units.map((unit) => (
            <SingleScratchBox
              key={unit.id}
              unit={unit}
              isScratched={scratchedState[unit.id]}
              onScratched={() => handleBoxScratched(unit.id)}
              onFirstInteract={() => setHasInteracted(true)}
              isDarkPalace={isDarkPalace}
            />
          ))}
        </div>

        {/* First-Time Animated Scratch Gesture Hint ONLY (No text, no logo — vanishes on first touch/drag) */}
        <AnimatePresence>
          {!hasInteracted && !allScratched && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.25 } }}
              className="pointer-events-none absolute inset-0 z-20 overflow-hidden rounded-xl flex items-center justify-center"
            >
              {/* Soft Diagonal Shimmer Reflection Passing Over Foil */}
              <motion.div
                animate={{ x: ['-120%', '220%'] }}
                transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 0.9, ease: 'easeInOut' }}
                className="absolute inset-y-0 w-16 -skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent"
              />

              {/* Subtle Animated Scratch Finger Gesture Sweeping Left-to-Right */}
              <motion.div
                animate={{
                  x: [-52, 52, -52],
                  y: [5, -5, 5],
                  rotate: [-8, 8, -8],
                }}
                transition={{
                  duration: 2.0,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="relative flex items-center justify-center drop-shadow-[0_3px_6px_rgba(0,0,0,0.45)]"
              >
                {/* Soft glowing rub halo */}
                <span className="absolute -inset-2 rounded-full bg-white/45 blur-[4px] animate-pulse" />
                {/* Clean minimalist hand/finger pointer silhouette (no logo, no text) */}
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6 text-white relative z-10"
                >
                  <path d="M9 11.24V7.5C9 6.12 10.12 5 11.5 5S14 6.12 14 7.5v3.74c1.21-.81 2-2.18 2-3.74C16 5.01 13.99 3 11.5 3S7 5.01 7 7.5c0 1.56.79 2.93 2 3.74zm9.84 4.63-4.54-2.26c-.17-.07-.35-.11-.54-.11H13v-6c0-.83-.67-1.5-1.5-1.5S10 6.67 10 7.5v10.74l-3.43-.72c-.08-.01-.15-.03-.24-.03-.31 0-.59.13-.79.33l-.79.8 4.94 4.94c.27.27.65.44 1.06.44h6.79c.75 0 1.33-.55 1.44-1.28l.75-5.27c.01-.07.02-.14.02-.2 0-.62-.38-1.16-.91-1.38z" />
                </svg>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Live seconds shown only after boxes are scratched */}
      {allScratched && (
        <div className="text-center mt-2.5">
          <span
            className={`font-mono text-[9.5px] tracking-[0.22em] uppercase tabular-nums ${
              isDarkPalace ? 'text-[#E5C17B]/60' : 'text-[#8C6D46]/70'
            }`}
          >
            ⏱ {String(timeLeft.seconds).padStart(2, '0')}s ticking
          </span>
        </div>
      )}

      {/* ===============================================================
          INLINE CELEBRATION DATE REVEAL
          Appears right below the boxes when scratched, with party popper
      =============================================================== */}
      <AnimatePresence>
        {allScratched && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ type: 'spring', damping: 18, stiffness: 240 }}
            className={`mt-3.5 p-3 rounded-xl text-center border relative overflow-hidden shadow-sm ${
              isDarkPalace
                ? 'bg-gradient-to-b from-[#24170E]/95 via-[#1A1009]/95 to-[#120B06]/95 border-[#D4AF37]/50 text-[#FFF4CF]'
                : 'bg-gradient-to-b from-[#FFFDF9] via-[#FAF5EC] to-[#F2E8D7] border-[#C5A059]/45 text-[#2C1F14]'
            }`}
          >
            <div className="flex items-center justify-center gap-1.5 mb-1 text-[#D4AF37]">
              <PartyPopper className="w-4 h-4 animate-bounce" />
              <span className="font-serif font-bold text-xs sm:text-sm tracking-wide">
                🎉 Wedding Date Revealed! 🎉
              </span>
            </div>
            <div
              className={`font-serif text-base sm:text-lg font-bold tracking-wider leading-snug my-0.5 ${
                isDarkPalace ? 'text-[#FFF2D1]' : 'text-[#2A1706]'
              }`}
            >
              ✦ {displayDate} ✦
            </div>
            <p
              className={`font-sans text-[9.5px] tracking-wider uppercase mt-1 ${
                isDarkPalace ? 'text-[#E5C17B]/80' : 'text-[#8C6430]/90'
              }`}
            >
              Counting every moment until we celebrate together
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
