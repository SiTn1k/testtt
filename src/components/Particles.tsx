import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  velocity: { x: number; y: number };
  type: 'spark' | 'confetti' | 'star' | 'xp';
  value?: number;
}

interface ParticleSystemProps {
  particles: Particle[];
  onComplete?: () => void;
}

const ParticleItem: React.FC<{ particle: Particle }> = ({ particle }) => {
  const colors = {
    spark: ['#ffd700', '#ffaa00', '#ff8800'],
    confetti: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96e6a1', '#dda0dd', '#f7dc6f'],
    star: ['#ffd700', '#fff700', '#ffaa00'],
    xp: ['#00ff88', '#00ffaa', '#00ffcc'],
  };

  const particleColors = colors[particle.type];

  return (
    <motion.div
      initial={{
        x: particle.x,
        y: particle.y,
        scale: particle.type === 'xp' ? 1 : 0,
        opacity: 1,
      }}
      animate={{
        x: particle.x + particle.velocity.x * 100,
        y: particle.y + particle.velocity.y * 100 - (particle.type === 'xp' ? 150 : 0),
        scale: particle.type === 'xp' ? 1.5 : [0, 1, 1, 0],
        opacity: particle.type === 'xp' ? [1, 1, 0] : [0, 1, 1, 0],
        rotate: particle.type === 'confetti' ? [0, 360, 720] : 0,
      }}
      transition={{
        duration: particle.type === 'xp' ? 1.5 : 1,
        ease: particle.type === 'xp' ? 'easeOut' : 'easeOut',
      }}
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    >
      {particle.type === 'spark' && (
        <div
          style={{
            width: particle.size,
            height: particle.size,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${particleColors[0]}, transparent)`,
            boxShadow: `0 0 ${particle.size * 2}px ${particleColors[0]}`,
          }}
        />
      )}
      {particle.type === 'confetti' && (
        <div
          style={{
            width: particle.size,
            height: particle.size * 1.5,
            borderRadius: 2,
            background: particleColors[Math.floor(Math.random() * particleColors.length)],
          }}
        />
      )}
      {particle.type === 'star' && (
        <svg width={particle.size * 2} height={particle.size * 2} viewBox="0 0 24 24" fill={particleColors[0]}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      )}
      {particle.type === 'xp' && (
        <div
          style={{
            fontSize: particle.size,
            fontWeight: 'bold',
            color: particleColors[0],
            textShadow: `0 0 10px ${particleColors[0]}, 0 2px 4px rgba(0,0,0,0.5)`,
            whiteSpace: 'nowrap',
          }}
        >
          +{particle.value} XP
        </div>
      )}
    </motion.div>
  );
};

export const ParticleSystem: React.FC<ParticleSystemProps> = ({ particles, onComplete }) => {
  useEffect(() => {
    if (particles.length > 0) {
      const timer = setTimeout(() => {
        onComplete?.();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [particles, onComplete]);

  return (
    <AnimatePresence>
      {particles.map((particle) => (
        <ParticleItem key={particle.id} particle={particle} />
      ))}
    </AnimatePresence>
  );
};

let particleId = 0;

export const createTapParticles = (x: number, y: number, xpGained: number): Particle[] => {
  const particles: Particle[] = [];

  for (let i = 0; i < 8; i++) {
    const angle = (Math.PI * 2 * i) / 8;
    const speed = 0.5 + Math.random() * 0.5;
    particles.push({
      id: particleId++,
      x,
      y,
      color: '#ffd700',
      size: 4 + Math.random() * 4,
      velocity: { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed },
      type: 'spark',
    });
  }

  particles.push({
    id: particleId++,
    x,
    y,
    color: '#00ff88',
    size: 18,
    velocity: { x: 0, y: -0.5 },
    type: 'xp',
    value: xpGained,
  });

  return particles;
};

export const createConfettiExplosion = (x: number, y: number): Particle[] => {
  const particles: Particle[] = [];
  const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96e6a1', '#dda0dd', '#f7dc6f', '#ffd700'];

  for (let i = 0; i < 50; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.3 + Math.random() * 1.2;
    particles.push({
      id: particleId++,
      x,
      y,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 6 + Math.random() * 6,
      velocity: { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed - 0.5 },
      type: 'confetti',
    });
  }

  for (let i = 0; i < 10; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.5 + Math.random() * 0.8;
    particles.push({
      id: particleId++,
      x,
      y,
      color: '#ffd700',
      size: 10 + Math.random() * 10,
      velocity: { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed - 0.3 },
      type: 'star',
    });
  }

  return particles;
};

export default ParticleSystem;
