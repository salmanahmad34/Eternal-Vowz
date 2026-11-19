'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const LUXURY_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const IN_VIEW_OPTIONS = { once: true, amount: 0.2 as const };

interface ScrollInkHeadingProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'span' | 'div';
  className?: string;
  delay?: number;
  duration?: number;
  /** When true, animates immediately on mount (e.g. Hero names right after card opens) instead of waiting for scroll */
  immediate?: boolean;
}

/**
 * Calligraphy / Heading reveal that sweeps left-to-right like ink writing across parchment.
 * Uses an UNCLIPPED outer ref for IntersectionObserver (`useInView`) so Chromium never
 * treats the 100%-clipped initial state as 0px wide!
 */
export function ScrollInkHeading({
  text,
  as = 'h2',
  className = '',
  delay = 0,
  duration = 0.9,
  immediate = false,
}: ScrollInkHeadingProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, IN_VIEW_OPTIONS);
  const shouldReveal = immediate || inView;

  const MotionTag = motion[as];

  const initialState = {
    opacity: 0,
    clipPath: 'inset(-25% 100% -25% 0%)',
    x: -10,
    filter: 'blur(3px)',
  };

  const visibleState = {
    opacity: 1,
    clipPath: 'inset(-25% 0% -25% 0%)',
    x: 0,
    filter: 'blur(0px)',
  };

  return (
    <div ref={containerRef} className="w-full">
      <MotionTag
        initial={initialState}
        animate={shouldReveal ? visibleState : initialState}
        transition={{ duration, delay, ease: LUXURY_EASE }}
        className={className}
      >
        {text}
      </MotionTag>
    </div>
  );
}

interface ScrollWordRevealProps {
  text: string;
  as?: 'p' | 'span' | 'h3' | 'div';
  className?: string;
  delay?: number;
  stagger?: number;
  immediate?: boolean;
}

/**
 * Word-by-word animated text reveal triggered as each text block scrolls into view.
 * Text starts completely hidden and writes/materializes smoothly word by word.
 */
export function ScrollWordReveal({
  text,
  as = 'p',
  className = '',
  delay = 0.08,
  stagger = 0.042,
  immediate = false,
}: ScrollWordRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, IN_VIEW_OPTIONS);
  const shouldReveal = immediate || inView;

  const words = text.trim().split(/\s+/).filter(Boolean);
  const MotionContainer = motion[as];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  const wordVariants = {
    hidden: {
      opacity: 0,
      y: 12,
      filter: 'blur(4px)',
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.45,
        ease: LUXURY_EASE,
      },
    },
  };

  return (
    <div ref={containerRef}>
      <MotionContainer
        variants={containerVariants}
        initial="hidden"
        animate={shouldReveal ? 'visible' : 'hidden'}
        className={className}
      >
        {words.map((word, index) => (
          <React.Fragment key={`${word}-${index}`}>
            <motion.span variants={wordVariants} className="inline-block">
              {word}
            </motion.span>
            {index < words.length - 1 ? ' ' : ''}
          </React.Fragment>
        ))}
      </MotionContainer>
    </div>
  );
}

interface ScrollOrnamentDividerProps {
  className?: string;
  lineColorClass?: string;
  dotColorClass?: string;
  diamond?: boolean;
  immediate?: boolean;
  delay?: number;
}

/**
 * Ornamental horizontal divider whose left & right lines draw outward from the center gem on scroll.
 */
export function ScrollOrnamentDivider({
  className = 'flex items-center justify-center gap-3 mb-5 opacity-45',
  lineColorClass = 'bg-[#7a6855]',
  dotColorClass = 'bg-[#7a6855]',
  diamond = false,
  immediate = false,
  delay = 0.05,
}: ScrollOrnamentDividerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, IN_VIEW_OPTIONS);
  const shouldReveal = immediate || inView;

  return (
    <div ref={containerRef} className={className}>
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={shouldReveal ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
        transition={{ duration: 0.7, delay, ease: LUXURY_EASE }}
        style={{ transformOrigin: 'right center' }}
        className={`h-[1px] w-14 ${lineColorClass}`}
      />
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={shouldReveal ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
        transition={{ duration: 0.45, delay: delay + 0.1, ease: LUXURY_EASE }}
        className={`w-1.5 h-1.5 ${diamond ? 'rotate-45' : 'rounded-full'} ${dotColorClass}`}
      />
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={shouldReveal ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
        transition={{ duration: 0.7, delay, ease: LUXURY_EASE }}
        style={{ transformOrigin: 'left center' }}
        className={`h-[1px] w-14 ${lineColorClass}`}
      />
    </div>
  );
}

interface ScrollRevealBlockProps {
  children: React.ReactNode;
  className?: string;
  direction?: 'up' | 'left' | 'right' | 'scale';
  delay?: number;
  duration?: number;
  immediate?: boolean;
}

/**
 * Smooth scroll-triggered reveal wrapper for illustrations, badges, buttons, and cards.
 */
export function ScrollRevealBlock({
  children,
  className = '',
  direction = 'up',
  delay = 0,
  duration = 0.65,
  immediate = false,
}: ScrollRevealBlockProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, IN_VIEW_OPTIONS);
  const shouldReveal = immediate || inView;

  const initialMap = {
    up: { opacity: 0, y: 24, scale: 0.98 },
    left: { opacity: 0, x: -24, y: 6 },
    right: { opacity: 0, x: 24, y: 6 },
    scale: { opacity: 0, scale: 0.9, y: 10 },
  };

  const visibleState = { opacity: 1, x: 0, y: 0, scale: 1 };

  return (
    <div ref={containerRef}>
      <motion.div
        initial={initialMap[direction]}
        animate={shouldReveal ? visibleState : initialMap[direction]}
        transition={{ duration, delay, ease: LUXURY_EASE }}
        className={className}
      >
        {children}
      </motion.div>
    </div>
  );
}
