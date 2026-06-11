import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, Star, Zap, Crown, Flame, Gift, Lock, AlertTriangle } from 'lucide-react';
import { createConfettiExplosion, ParticleSystem, Particle } from './Particles';
import { triggerHapticFeedback, triggerHapticNotification } from '../lib/telegram';

interface LimitedArtifact {
  id: string;
  name: { ua: string; en: string };
  description: { ua: string; en: string };
  image: string;
  xpBonus: number;
  rarity: 'rare' | 'epic' | 'legendary';
  availableUntil: string;
  totalSupply: number;
  claimedCount: number;
  costStars: number;
  isOwned?: boolean;
}

interface LimitedArtifactsModalProps {
  lang: 'ua' | 'en';
  artifacts: LimitedArtifact[];
  userXP: number;
  userStars: number;
  onClaim: (artifactId: string, method: 'stars') => void;
  onClose: () => void;
}

const RARITY_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  rare: { bg: 'from-blue-500/20 to-cyan-500/20', border: 'border-blue-500/40', text: 'text-blue-400' },
  epic: { bg: 'from-purple-500/20 to-pink-500/20', border: 'border-purple-500/40', text: 'text-purple-400' },
  legendary: { bg: 'from-yellow-500/20 to-orange-500/20', border: 'border-yellow-500/40', text: 'text-yellow-400' },
};

const rarityColors: Record<string, { bg: string; border: string; text: string }> = RARITY_COLORS;

const getTimeRemaining = (endDate: string): { hours: number; minutes: number; total: number } => {
  const end = new Date(endDate).getTime();
  const now = Date.now();
  const diff = end - now;

  if (diff <= 0) return { hours: 0, minutes: 0, total: 0 };

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return { hours, minutes, total: diff };
};

export const LimitedArtifactsModal: React.FC<LimitedArtifactsModalProps> = ({
  lang,
  artifacts,
  userXP,
  userStars,
  onClaim,
  onClose,
}) => {
  const [selectedArtifact, setSelectedArtifact] = useState<LimitedArtifact | null>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [timeLeft, setTimeLeft] = useState<Record<string, { hours: number; minutes: number }>>({});

  useState(() => {
    const interval = setInterval(() => {
      const newTimeLeft: Record<string, { hours: number; minutes: number }> = {};
      artifacts.forEach(a => {
        newTimeLeft[a.id] = getTimeRemaining(a.availableUntil);
      });
      setTimeLeft(newTimeLeft);
    }, 1000);

    return () => clearInterval(interval);
  });

  const handleClaim = (artifact: LimitedArtifact) => {
    triggerHapticNotification('success');
    if (artifact.rarity === 'legendary') {
      setParticles(createConfettiExplosion(window.innerWidth / 2, window.innerHeight / 2));
    }
    onClaim(artifact.id, 'stars');
  };

  const texts = {
    title: { ua: 'Обмежені Артефакти', en: 'Limited Artifacts' },
    timeLeft: { ua: 'Залишилось', en: 'Time left' },
    available: { ua: 'Доступно', en: 'Available' },
    owned: { ua: 'У вас є', en: 'Owned' },
    claim: { ua: 'Отримати', en: 'Claim' },
    soldOut: { ua: 'Розпродано', en: 'Sold Out' },
    expired: { ua: 'Закінчилось', en: 'Expired' },
    getNow: { ua: 'Придбати', en: 'Get Now' },
    limited: { ua: 'Обмежена серія', en: 'Limited Edition' },
    remaining: { ua: 'залишилось', en: 'remaining' },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.5, opacity: 0 }}
        className="relative bg-gradient-to-br from-[#1a1a2e] to-[#16213e] rounded-3xl p-5 shadow-2xl border border-white/10 max-w-md w-full mx-4 max-h-[85vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white/60 hover:text-white text-2xl z-10"
        >
          ×
        </button>

        <div className="flex items-center justify-center gap-2 mb-2">
          <Clock className="w-5 h-5 text-orange-400" />
          <h2 className="text-xl font-bold text-white">{texts.title[lang]}</h2>
        </div>

        <div className="text-xs text-center text-white/40 mb-4">
          {texts.limited[lang]}
        </div>

        <div className="space-y-4">
          {artifacts.map(artifact => {
            const colors = rarityColors[artifact.rarity];
            const remaining = artifact.totalSupply - artifact.claimedCount;
            const isSoldOut = remaining <= 0;
            const isExpired = timeLeft[artifact.id]?.hours === 0 && timeLeft[artifact.id]?.minutes === 0;

            return (
              <motion.div
                key={artifact.id}
                className={`rounded-2xl overflow-hidden border ${colors.border} ${
                  artifact.isOwned ? 'ring-2 ring-green-500/40' : ''
                }`}
                onClick={() => setSelectedArtifact(artifact)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className={`bg-gradient-to-r ${colors.bg} p-4`}>
                  <div className="flex gap-4">
                    <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 relative">
                      <img
                        src={artifact.image}
                        alt={artifact.name[lang]}
                        className="w-full h-full object-cover"
                      />
                      {artifact.isOwned && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <Crown className="w-8 h-8 text-yellow-400" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className={`text-sm font-bold ${colors.text} uppercase mb-1`}>
                        {artifact.rarity}
                      </div>
                      <h3 className="text-lg font-bold text-white truncate">{artifact.name[lang]}</h3>
                      <p className="text-xs text-white/50 line-clamp-2">{artifact.description[lang]}</p>

                      <div className="flex items-center gap-2 mt-2">
                        <Zap className="w-4 h-4 text-yellow-400" />
                        <span className="text-yellow-400 font-bold">+{artifact.xpBonus} XP</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-black/20 px-4 py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-white/40" />
                      <span className="text-sm text-white/60">
                        {timeLeft[artifact.id]?.hours || 0}h {timeLeft[artifact.id]?.minutes || 0}m
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-white/60">
                        {remaining} {texts.remaining[lang]}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="text-yellow-400 font-bold">{artifact.costStars}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {artifact.isOwned ? (
                  <div className="bg-green-500/20 px-4 py-2 flex items-center justify-center gap-2 text-green-400">
                    <Crown className="w-4 h-4" />
                    {texts.owned[lang]}
                  </div>
                ) : (
                  <motion.button
                    onClick={e => {
                      e.stopPropagation();
                      if (!isSoldOut && !isExpired && userStars >= artifact.costStars) {
                        handleClaim(artifact);
                      }
                    }}
                    disabled={isSoldOut || isExpired || userStars < artifact.costStars}
                    className={`w-full py-3 flex items-center justify-center gap-2 font-bold ${
                      isSoldOut
                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        : isExpired
                        ? 'bg-red-900/30 text-red-400 cursor-not-allowed'
                        : userStars < artifact.costStars
                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black'
                    }`}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isSoldOut ? (
                      <>
                        <Lock className="w-4 h-4" />
                        {texts.soldOut[lang]}
                      </>
                    ) : isExpired ? (
                      <>
                        <AlertTriangle className="w-4 h-4" />
                        {texts.expired[lang]}
                      </>
                    ) : (
                      <>
                        <Star className="w-4 h-4" />
                        {texts.getNow[lang]}
                      </>
                    )}
                  </motion.button>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      <ParticleSystem particles={particles} onComplete={() => setParticles([])} />
    </motion.div>
  );
};

export default LimitedArtifactsModal;
