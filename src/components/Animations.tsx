import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gift, Star, Sparkles, Zap, Crown } from 'lucide-react';
import { createConfettiExplosion, ParticleSystem, Particle } from './Particles';
import { triggerHapticNotification } from '../lib/telegram';
import soundManager from '../lib/sounds';

interface OpenableObject {
  id: string;
  name: { ua: string; en: string };
  image: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface OpeningAnimationProps {
  isOpen: boolean;
  object: OpenableObject | null;
  lang: 'ua' | 'en';
  onComplete: () => void;
}

const RARITY_GLOW: Record<string, string> = {
  common: 'rgba(156, 163, 175, 0.5)',
  rare: 'rgba(59, 130, 246, 0.5)',
  epic: 'rgba(168, 85, 247, 0.5)',
  legendary: 'rgba(251, 191, 36, 0.5)',
};

const RARITY_RAYS: Record<string, string[]> = {
  common: ['#94a3b8', '#64748b'],
  rare: ['#3b82f6', '#60a5fa'],
  epic: ['#a855f7', '#c084fc'],
  legendary: ['#eab308', '#fbbf24', '#f59e0b'],
};

export const OpeningAnimation: React.FC<OpeningAnimationProps> = ({
  isOpen,
  object,
  lang,
  onComplete,
}) => {
  const [phase, setPhase] = useState<'idle' | 'opening' | 'glow' | 'preview' | 'complete'>('idle');
  const [particles, setParticles] = useState<Particle[]>([]);
  const [rotate, setRotate] = useState(0);
  const [scale, setScale] = useState(0.8);

  useEffect(() => {
    if (isOpen && object) {
      setPhase('opening');
      soundManager.play('spin');
      setTimeout(() => {
        setPhase('glow');
        soundManager.play('whoosh');
      }, 800);
      setTimeout(() => {
        setPhase('preview');
        soundManager.play('achievement');
        triggerHapticNotification('success');
        if (object.rarity === 'epic' || object.rarity === 'legendary') {
          setParticles(createConfettiExplosion(window.innerWidth / 2, window.innerHeight / 2));
        }
      }, 1800);
      setTimeout(() => {
        setPhase('complete');
        soundManager.play('claim');
      }, 3000);
    } else {
      setPhase('idle');
      setParticles([]);
    }
  }, [isOpen, object]);

  useEffect(() => {
    if (phase === 'opening') {
      const interval = setInterval(() => {
        setRotate(r => r + 15);
        setScale(s => Math.min(1.5, s + 0.05));
      }, 50);
      return () => clearInterval(interval);
    } else if (phase === 'glow') {
      setRotate(0);
      setScale(1.2);
    }
  }, [phase]);

  if (!object) return null;

  const texts = {
    newArtifact: { ua: 'Новий Артефакт!', en: 'New Artifact!' },
    continue: { ua: 'Продовжити', en: 'Continue' },
    rarity: {
      common: { ua: 'Звичайний', en: 'Common' },
      rare: { ua: 'Рідкісний', en: 'Rare' },
      epic: { ua: 'Епічний', en: 'Epic' },
      legendary: { ua: 'Легендарний', en: 'Legendary' },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={phase === 'complete' ? onComplete : undefined}
        >
          <div className="relative">
            {phase === 'opening' && (
              <motion.div
                animate={{ rotate: rotate, scale: scale }}
                className="relative w-48 h-64"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl shadow-2xl">
                  <div className="absolute inset-1 bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-xl flex items-center justify-center">
                    <Gift className="w-20 h-20 text-white/80" />
                  </div>
                  <div className="absolute inset-x-0 top-4 h-1 bg-white/20" />
                  <div className="absolute inset-x-0 bottom-4 h-1 bg-white/20" />
                  <div className="absolute left-0 top-0 w-1 h-full bg-white/20" />
                  <div className="absolute right-0 top-0 w-1 h-full bg-white/20" />
                </div>
              </motion.div>
            )}

            {phase === 'glow' && (
              <motion.div
                initial={{ scale: 1, opacity: 1 }}
                animate={{ scale: 1.3, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full"
                style={{
                  background: `radial-gradient(circle, ${RARITY_GLOW[object.rarity]}, transparent 70%)`,
                }}
              />
            )}

            {(phase === 'glow' || phase === 'preview' || phase === 'complete') && (
              <motion.div
                initial={{ scale: 1.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                className="relative flex flex-col items-center"
              >
                <div className="relative">
                  {object.rarity === 'legendary' && (
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                    >
                      <div className="w-80 h-80 rounded-full" style={{ background: `conic-gradient(from 0deg, ${RARITY_RAYS.legendary.join(', ')}, ${RARITY_RAYS.legendary[0]})`, transform: 'scale(1)', opacity: 0.3 }} />
                    </motion.div>
                  )}

                  <motion.div
                    className={`w-48 h-48 rounded-2xl overflow-hidden border-4 ${
                      object.rarity === 'legendary' ? 'border-yellow-400' :
                      object.rarity === 'epic' ? 'border-purple-500' :
                      object.rarity === 'rare' ? 'border-blue-500' : 'border-gray-400'
                    }`}
                    animate={{ boxShadow: ['0 0 20px ' + RARITY_GLOW[object.rarity], '0 0 40px ' + RARITY_GLOW[object.rarity], '0 0 20px ' + RARITY_GLOW[object.rarity]] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <img
                      src={object.image}
                      alt={object.name[lang]}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>

                  {(object.rarity === 'epic' || object.rarity === 'legendary') && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3 }}
                      className="absolute -top-2 -right-2"
                    >
                      <Sparkles className="w-8 h-8 text-yellow-400" />
                    </motion.div>
                  )}
                </div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mt-6 text-center"
                >
                  <div className={`text-sm font-bold uppercase mb-2 ${
                    object.rarity === 'legendary' ? 'text-yellow-400' :
                    object.rarity === 'epic' ? 'text-purple-400' :
                    object.rarity === 'rare' ? 'text-blue-400' : 'text-gray-400'
                  }`}>
                    {texts.rarity[object.rarity][lang]}
                  </div>
                  <h2 className="text-2xl font-bold text-white">{texts.newArtifact[lang]}</h2>
                  <div className="text-xl text-green-400 mt-2">{object.name[lang]}</div>
                </motion.div>

                {phase === 'complete' && (
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={onComplete}
                    className="mt-8 px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-bold text-white"
                    whileTap={{ scale: 0.95 }}
                  >
                    {texts.continue[lang]}
                  </motion.button>
                )}
              </motion.div>
            )}
          </div>

          <ParticleSystem particles={particles} onComplete={() => setParticles([])} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OpeningAnimation;
