'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, PartyPopper, RotateCcw } from 'lucide-react';
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
  eventDate?: string;
  readableDate?: string;
  onAllScratched?: () => void;
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
  isDarkPalace,
}: {
  unit: BoxUnit;
  isScratched: boolean;
  onScratched: () => void;
  isDarkPalace: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const strokeCountRef = useRef(0);
  const [fading, setFading] = useState(false);

  // Initialize and paint metallic gold scratch foil on the canvas
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

    // Luxurious gold shimmer gradient
    const grad = ctx.createLinearGradient(0, 0, width, height);
    if (isDarkPalace) {
      grad.addColorStop(0, '#D4AF37');
      grad.addColorStop(0.25, '#FFF2D1');
      grad.addColorStop(0.5, '#C5A059');
      grad.addColorStop(0.75, '#9C7A38');
      grad.addColorStop(1, '#5C4015');
    } else {
      grad.addColorStop(0, '#E5C17B');
      grad.addColorStop(0.3, '#FFF7E6');
      grad.addColorStop(0.65, '#D4AF37');
      grad.addColorStop(1, '#A67C2E');
    }

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Elegant inner border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.lineWidth = 1.2;
    ctx.strokeRect(3, 3, width - 6, height - 6);

    ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.lineWidth = 0.8;
    ctx.strokeRect(5, 5, width - 10, height - 10);

    // Sparkle icon
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✨', width / 2, height / 2 - 12);

    // "SCRATCH" text
    ctx.fillStyle = isDarkPalace ? '#2A1706' : '#3E250A';
    ctx.font = 'bold 9.5px system-ui, -apple-system, sans-serif';
    ctx.letterSpacing = '1px';
    ctx.fillText('SCRATCH', width / 2, height / 2 + 4);

    // Unit label hint (DAYS, HOURS, MINUTES)
    ctx.font = '600 8px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = isDarkPalace ? '#4A2F0F' : '#6A441B';
    ctx.letterSpacing = '0.8px';
    ctx.fillText(unit.label, width / 2, height / 2 + 16);
  }, [isDarkPalace, isScratched, unit.label]);

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

        {/* Revealed Number and Live Digits */}
        <div className="relative z-0 flex flex-col items-center justify-center">
          <span
            className={`font-serif font-bold tabular-nums text-[26px] sm:text-[30px] leading-none tracking-tight drop-shadow-sm transition-transform duration-300 ${
              isDarkPalace ? 'text-[#FFF4CF]' : 'text-[#2C1F14]'
            } ${isScratched ? 'scale-100' : 'scale-95 blur-[0.5px]'}`}
          >
            {String(unit.value).padStart(2, '0')}
          </span>
          <span
            className={`font-sans font-bold text-[8.5px] sm:text-[9px] tracking-[0.2em] uppercase mt-1 transition-colors ${
              isDarkPalace ? 'text-[#E5C17B]' : 'text-[#8C6430]'
            }`}
          >
            {unit.label}
          </span>
        </div>

        {/* Scratch Canvas Overlay */}
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

      {/* Helper text below each box (NO check tick!) */}
      <span
        className={`text-[8.5px] font-sans font-medium mt-1 tracking-wider uppercase transition-opacity ${
          isScratched
            ? 'text-[#D4AF37] opacity-90'
            : isDarkPalace
            ? 'text-[#C5A059]/75'
            : 'text-[#8C6D46]/80'
        }`}
      >
        {isScratched ? '✦ Revealed' : 'Scratch Me'}
      </span>
    </div>
  );
}

export default function ScratchCountdownBoxes({
  timeLeft,
  invitationSlug = 'wedding',
  isDarkPalace = true,
  eventDate,
  readableDate,
  onAllScratched,
  onExploreNext,
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

  // Restore scratched state from localStorage
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && invitationSlug) {
        const stored = localStorage.getItem(`ev_scratch_boxes_${invitationSlug}`);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && typeof parsed === 'object') {
            setScratchedState({
              days: !!parsed.days,
              hours: !!parsed.hours,
              minutes: !!parsed.minutes,
            });
            if (parsed.days && parsed.hours && parsed.minutes) {
              setHasCelebrated(true);
            }
          }
        }
      }
    } catch {
      // Ignore storage errors in private mode
    }
  }, [invitationSlug]);

  const units: BoxUnit[] = [
    { id: 'days', label: 'DAYS', value: timeLeft.days },
    { id: 'hours', label: 'HOURS', value: timeLeft.hours },
    { id: 'minutes', label: 'MINUTES', value: timeLeft.minutes },
  ];

  // Fire Party Popper fireworks & audio celebration (party bom burst!)
  const triggerCelebration = useCallback(() => {
    playPartyPopperSound();

    // 1. Center & high spread party popper
    try {
      confetti({
        particleCount: 110,
        spread: 95,
        origin: { y: 0.62 },
        colors: ['#FFD700', '#FFDF73', '#FF2D55', '#FFFFFF', '#4CD964', '#5856D6'],
        disableForReducedMotion: true,
      });

      // 2. Left and Right synchronized cannons
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 55,
          spread: 60,
          origin: { x: 0.15, y: 0.72 },
          colors: ['#FFD700', '#FFDF73', '#FFFFFF', '#FF3B30'],
        });
        confetti({
          particleCount: 50,
          angle: 125,
          spread: 60,
          origin: { x: 0.85, y: 0.72 },
          colors: ['#FFD700', '#FFDF73', '#FFFFFF', '#FF3B30'],
        });
      }, 240);

      // 3. Falling gold star shower
      setTimeout(() => {
        confetti({
          particleCount: 35,
          spread: 120,
          origin: { y: 0.35 },
          shapes: ['circle'],
          colors: ['#FFD700', '#FFF2D1', '#FFFFFF'],
        });
      }, 550);
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
      setScratchedState((prev) => {
        const next = { ...prev, [boxId]: true };
        try {
          if (typeof window !== 'undefined' && invitationSlug) {
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
    [hasCelebrated, invitationSlug, triggerCelebration]
  );

  // Scratch All / Reset Handler for replayability
  const handleResetScratch = () => {
    const fresh = { days: false, hours: false, minutes: false };
    setScratchedState(fresh);
    setHasCelebrated(false);
    try {
      if (typeof window !== 'undefined' && invitationSlug) {
        localStorage.removeItem(`ev_scratch_boxes_${invitationSlug}`);
      }
    } catch {}
  };

  const scratchedCount =
    (scratchedState.days ? 1 : 0) +
    (scratchedState.hours ? 1 : 0) +
    (scratchedState.minutes ? 1 : 0);

  const allScratched = scratchedCount === 3;
  const displayDate = readableDate || eventDate || 'Sunday, 24 October 2027';

  return (
    <div className="w-full max-w-[290px] sm:max-w-[320px] mx-auto my-2.5 relative">
      {/* Scratch Progress & Instruction Prompt */}
      <div className="flex items-center justify-between px-1 mb-2">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-[#D4AF37] animate-pulse" />
          <span
            className={`font-sans text-[10px] font-semibold tracking-wider uppercase ${
              isDarkPalace ? 'text-[#E5C17B]' : 'text-[#7A5828]'
            }`}
          >
            {allScratched ? '✦ All 3 Moments Unlocked ✦' : `Scratch 3 Boxes (${scratchedCount}/3)`}
          </span>
        </div>

        {allScratched && (
          <button
            type="button"
            onClick={handleResetScratch}
            className={`flex items-center gap-1 text-[9.5px] font-sans font-semibold tracking-wider transition-opacity hover:opacity-100 ${
              isDarkPalace ? 'text-[#C5A059] opacity-80' : 'text-[#8C6D46] opacity-75'
            }`}
            title="Scratch again"
          >
            <RotateCcw className="w-2.5 h-2.5" />
            <span>Replay</span>
          </button>
        )}
      </div>

      {/* 3 Interactive Compact Scratch Boxes */}
      <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
        {units.map((unit) => (
          <SingleScratchBox
            key={unit.id}
            unit={unit}
            isScratched={scratchedState[unit.id]}
            onScratched={() => handleBoxScratched(unit.id)}
            isDarkPalace={isDarkPalace}
          />
        ))}
      </div>

      {/* Live seconds ticking subtle reminder */}
      <div className="text-center mt-2.5">
        <span
          className={`font-mono text-[9.5px] tracking-[0.22em] uppercase tabular-nums ${
            isDarkPalace ? 'text-[#E5C17B]/60' : 'text-[#8C6D46]/70'
          }`}
        >
          ⏱ {String(timeLeft.seconds).padStart(2, '0')}s ticking
        </span>
      </div>

      {/* ===============================================================
          INLINE CELEBRATION DATE REVEAL (NO BLOCKING POPUP DIALOG!)
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
                🎉 Countdown Unlocked! 🎉
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
