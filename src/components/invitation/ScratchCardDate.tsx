'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Calendar, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { luxuryAudio } from '@/lib/audio';

interface ScratchCardDateProps {
  eventDate: string;
  dotDate: string;
  invitationSlug: string;
  isDarkPalace: boolean;
  isRevealed: boolean;
  onRevealed: () => void;
}

// Particle interface for celebratory party popper
interface ConfettiParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  rotation: number;
  rotationSpeed: number;
  shape: 'rect' | 'circle' | 'star';
}

const CONFETTI_COLORS = [
  '#FFD700', // Gold
  '#E5C17B', // Champagne Gold
  '#F5E8C8', // Ivory Light
  '#E0115F', // Ruby Crimson
  '#B76E79', // Rose Gold
  '#4E8752', // Soft Emerald
  '#FFFFFF', // Pearl White
];

export default function ScratchCardDate({
  eventDate,
  dotDate,
  invitationSlug,
  isDarkPalace,
  isRevealed,
  onRevealed,
}: ScratchCardDateProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const strokeCountRef = useRef(0);
  const [scratchProgress, setScratchProgress] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiParticles, setConfettiParticles] = useState<ConfettiParticle[]>([]);
  const [canvasFading, setCanvasFading] = useState(false);

  // Format the full readable date (e.g. "Sunday, 24 October 2027")
  const dateObj = new Date(eventDate);
  const isValidDate = !isNaN(dateObj.getTime());

  const dayOfWeek = isValidDate
    ? dateObj.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase()
    : 'SUNDAY';

  const fullDateText = isValidDate
    ? dateObj.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : dotDate;

  // Trigger celebration party popper
  const triggerPartyPopper = useCallback(() => {
    luxuryAudio.playWaxSealCrack();

    // Fire authentic full-screen festive party popper confetti cannon
    try {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.65 },
        colors: ['#D4AF37', '#FFDF73', '#FF2D55', '#FFFFFF', '#4CD964', '#5856D6'],
        disableForReducedMotion: true,
      });

      // Secondary delayed burst for fireworks effect
      setTimeout(() => {
        confetti({
          particleCount: 45,
          angle: 60,
          spread: 55,
          origin: { x: 0.2, y: 0.7 },
          colors: ['#D4AF37', '#FFDF73', '#FFFFFF'],
        });
        confetti({
          particleCount: 45,
          angle: 120,
          spread: 55,
          origin: { x: 0.8, y: 0.7 },
          colors: ['#D4AF37', '#FFDF73', '#FFFFFF'],
        });
      }, 250);
    } catch {}

    // Spawn dynamic HTML confetti particles as fallback & continuous ambient glow
    const particles: ConfettiParticle[] = [];
    for (let i = 0; i < 55; i++) {
      const angle = (Math.PI * 2 * i) / 55 + (Math.random() - 0.5) * 0.4;
      const speed = 4 + Math.random() * 8;
      particles.push({
        id: i,
        x: 0,
        y: 0,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 6, // Biased upward burst
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        size: 5 + Math.random() * 7,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 18,
        shape: i % 4 === 0 ? 'star' : i % 2 === 0 ? 'circle' : 'rect',
      });
    }

    setConfettiParticles(particles);
    setShowConfetti(true);

    // Auto cleanup confetti after 3.5 seconds
    setTimeout(() => {
      setShowConfetti(false);
    }, 3500);
  }, []);

  // Complete the scratch reveal
  const completeReveal = useCallback(() => {
    if (isRevealed) return;
    setCanvasFading(true);

    try {
      if (typeof window !== 'undefined' && invitationSlug) {
        localStorage.setItem(`ev_date_scratched_${invitationSlug}`, 'true');
      }
    } catch {
      // Ignore storage errors in private browsing
    }

    triggerPartyPopper();
    onRevealed();
  }, [invitationSlug, isRevealed, onRevealed, triggerPartyPopper]);

  // Paint the metallic scratch canvas
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const width = rect.width || 310;
    const height = rect.height || 136;

    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Pure metallic gold foil gradient (no text, no logo)
    const grad = ctx.createLinearGradient(0, 0, width, height);
    if (isDarkPalace) {
      grad.addColorStop(0, '#C9A23F');
      grad.addColorStop(0.3, '#F5E3A9');
      grad.addColorStop(0.6, '#D2AA48');
      grad.addColorStop(1, '#8C6721');
    } else {
      grad.addColorStop(0, '#E2BE74');
      grad.addColorStop(0.3, '#FFF4D4');
      grad.addColorStop(0.6, '#D4AC53');
      grad.addColorStop(1, '#9C7A38');
    }

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Subtle metallic diagonal texture lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
    ctx.lineWidth = 0.8;
    for (let i = -height; i < width + height; i += 7) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + height * 0.5, height);
      ctx.stroke();
    }

    // Minimal clean hairline frame
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(5, 5, width - 10, height - 10);
  }, [isDarkPalace, isRevealed]);

  useEffect(() => {
    initCanvas();
  }, [initCanvas]);

  // Check scratch percentage
  const checkScratchPercentage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
      const w = canvas.width;
      const h = canvas.height;
      const imgData = ctx.getImageData(0, 0, w, h);
      const data = imgData.data;

      let transparentPixels = 0;
      const sampleStep = 32; // Fast sampling
      let totalSampled = 0;

      for (let i = 3; i < data.length; i += 4 * sampleStep) {
        totalSampled++;
        if (data[i] === 0) {
          transparentPixels++;
        }
      }

      const progress = transparentPixels / totalSampled;
      setScratchProgress(Math.round(progress * 100));

      if (progress >= 0.36) {
        completeReveal();
      }
    } catch {
      // Fallback
    }
  }, [completeReveal, isRevealed]);

  // Erase drawing stroke
  const scratchAt = useCallback(
    (x: number, y: number) => {
      const canvas = canvasRef.current;
      if (!canvas || isRevealed) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();

      const lastPoint = lastPointRef.current;
      if (lastPoint) {
        ctx.lineWidth = 42;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.moveTo(lastPoint.x, lastPoint.y);
        ctx.lineTo(x, y);
        ctx.stroke();
      }

      ctx.arc(x, y, 22, 0, Math.PI * 2);
      ctx.fill();

      lastPointRef.current = { x, y };
      strokeCountRef.current++;

      if (strokeCountRef.current % 12 === 0) {
        checkScratchPercentage();
      }
    },
    [checkScratchPercentage, isRevealed]
  );

  const getCanvasCoords = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isRevealed) return;
    isDrawingRef.current = true;
    const { x, y } = getCanvasCoords(e);
    lastPointRef.current = { x, y };
    scratchAt(x, y);
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || isRevealed) return;
    const { x, y } = getCanvasCoords(e);
    scratchAt(x, y);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDrawingRef.current = false;
    lastPointRef.current = null;
    checkScratchPercentage();
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-[325px] mx-auto my-3 select-none">
      {/* =======================================================================
          PARTY POPPER CONFETTI BURST OVERLAY
      ======================================================================= */}
      <AnimatePresence>
        {showConfetti && (
          <div className="absolute -inset-16 pointer-events-none z-50 overflow-visible flex items-center justify-center">
            {confettiParticles.map((p) => (
              <motion.div
                key={p.id}
                initial={{
                  x: 0,
                  y: 0,
                  scale: 0.2,
                  opacity: 1,
                  rotate: 0,
                }}
                animate={{
                  x: p.vx * 24,
                  y: p.vy * 20 + 70, // arcs upward then falls
                  scale: [0.2, 1.2, 0.8],
                  opacity: [1, 1, 0],
                  rotate: p.rotation + p.rotationSpeed * 30,
                }}
                transition={{
                  duration: 2.4 + Math.random() * 0.8,
                  ease: 'easeOut',
                }}
                className="absolute"
                style={{
                  width: p.size,
                  height: p.shape === 'rect' ? p.size * 1.8 : p.size,
                  backgroundColor: p.color,
                  borderRadius: p.shape === 'circle' ? '50%' : '2px',
                  boxShadow: `0 0 8px ${p.color}`,
                }}
              />
            ))}

            {/* Celebratory Banner Toast */}
            <motion.div
              initial={{ scale: 0.6, y: -20, opacity: 0 }}
              animate={{ scale: 1, y: -50, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 14 }}
              className="px-4 py-2 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#FFF2D1] to-[#D4AF37] text-[#2C1802] font-serif font-bold text-xs shadow-2xl border border-white/60 flex items-center gap-1.5 whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#8B6508]" />
              <span>🎉 Date Unlocked &amp; Revealed! 🎉</span>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =======================================================================
          CARD CONTAINER (Hidden Date Revealed Beneath Canvas)
      ======================================================================= */}
      <div
        className={`relative w-full rounded-2xl p-4 overflow-hidden border shadow-md transition-all duration-500 ${
          isDarkPalace
            ? 'bg-gradient-to-b from-[#25170F] to-[#170E08] border-[#E5C17B]/45'
            : 'bg-gradient-to-b from-[#FFFDF9] to-[#F7EFE1] border-[#E2D5BE]'
        }`}
      >
        {/* Subtle Ornamental Corner Filigree */}
        <div className="absolute top-1.5 left-2 text-[#C5A059]/30 text-[10px] font-serif">❖</div>
        <div className="absolute top-1.5 right-2 text-[#C5A059]/30 text-[10px] font-serif">❖</div>
        <div className="absolute bottom-1.5 left-2 text-[#C5A059]/30 text-[10px] font-serif">❖</div>
        <div className="absolute bottom-1.5 right-2 text-[#C5A059]/30 text-[10px] font-serif">❖</div>

        {/* Revealed Content Underneath */}
        <div className="text-center py-1">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <Calendar className={`w-3.5 h-3.5 ${isDarkPalace ? 'text-[#E5C17B]' : 'text-[#8C6D3F]'}`} />
            <span
              className={`font-serif tracking-[0.2em] uppercase text-[10px] font-semibold ${
                isDarkPalace ? 'text-[#E5C17B]' : 'text-[#8C6D3F]'
              }`}
            >
              {isRevealed ? '✦ The Sacred Wedding Date ✦' : 'The Sacred Date'}
            </span>
          </div>

          <div
            className={`font-serif text-[11px] tracking-[0.18em] uppercase mb-0.5 ${
              isDarkPalace ? 'text-[#D9C4A1]' : 'text-[#7A644D]'
            }`}
          >
            {dayOfWeek}
          </div>

          <div
            className={`font-serif text-[24px] font-bold tracking-wider leading-tight ${
              isDarkPalace
                ? 'text-[#FFF4CF] drop-shadow-[0_2px_10px_rgba(229,193,123,0.35)]'
                : 'text-[#2C2016]'
            }`}
          >
            {fullDateText}
          </div>

          <div className="mt-1 flex items-center justify-center gap-2">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9.5px] font-sans tracking-wide ${
                isDarkPalace
                  ? 'bg-[#E5C17B]/20 text-[#F5E8C8] border border-[#E5C17B]/35'
                  : 'bg-[#C5A059]/15 text-[#5A4526] border border-[#C5A059]/30'
              }`}
            >
              <Sparkles className="w-2.5 h-2.5 text-[#D4AF37]" />
              <span>Mark Your Calendar</span>
            </span>
          </div>
        </div>

        {/* =====================================================================
            SCRATCH CANVAS (Overlays and hides the date until scratched)
        ===================================================================== */}
        {!isRevealed && (
          <canvas
            ref={canvasRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className={`absolute inset-0 w-full h-full cursor-crosshair touch-none transition-opacity duration-500 rounded-2xl ${
              canvasFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
          />
        )}
      </div>

      {/* Helper cue under scratch card */}
      {!isRevealed && (
        <div className="flex items-center justify-between px-1 mt-1.5 text-[9.5px]">
          <span className={isDarkPalace ? 'text-[#E8D7B9]/70' : 'text-[#7A644D]/75'}>
            Scratch progress: {scratchProgress}%
          </span>
          <button
            type="button"
            onClick={completeReveal}
            className={`underline decoration-dotted cursor-pointer transition-colors ${
              isDarkPalace
                ? 'text-[#E5C17B] hover:text-[#FFF4CF]'
                : 'text-[#8C6D3F] hover:text-[#2C2016]'
            }`}
          >
            Tap to reveal instantly
          </button>
        </div>
      )}
    </div>
  );
}
