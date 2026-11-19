'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface FloatingParticlesProps {
  count?: number;
  color?: string;
}

export default function FloatingParticles({ count = 28, color = '#C5A059' }: FloatingParticlesProps) {
  const particles = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1.5,
      duration: Math.random() * 8 + 6,
      delay: Math.random() * 4,
      opacity: Math.random() * 0.5 + 0.2,
    }));
  }, [count]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: color,
            boxShadow: `0 0 ${p.size * 2}px ${color}`,
          }}
          animate={{
            y: ['0%', '-30%', '10%', '0%'],
            x: ['0%', '20%', '-20%', '0%'],
            opacity: [p.opacity, p.opacity * 1.5, p.opacity * 0.4, p.opacity],
            scale: [1, 1.3, 0.8, 1],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
