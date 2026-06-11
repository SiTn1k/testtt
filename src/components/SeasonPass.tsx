import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Crown, Star, Zap, Gift, Lock, ChevronRight, Sparkles } from 'lucide-react';
import { createConfettiExplosion, ParticleSystem, Particle } from './Particles';
import { triggerHapticFeedback, triggerHapticNotification } from '../lib/telegram';

interface SeasonReward {
  tier: number;
  freeReward: { type: 'xp' | 'artifact'; value: number; name?: { ua: string; en: string } };
  premiumReward: { type: 'xp' | 'artifact'; value: number; name?: { ua: string; en: string } };
  claimedFree: boolean;
  claimedPremium: boolean;
}

interface Season {
  id: string;
  name: { ua: string; en: string };
  description: string;
  startDate: string;
  endDate: string;
  totalTiers: number;
  rewards: SeasonReward[];
  hasPremium: boolean;
  currentProgress: number;
  totalProgress: number;
  premiumCost: number;
}

interface SeasonPassProps {
  lang: 'ua' | 'en';
  season: Season;
  onClaimReward: (tier: number, type: 'free' | 'premium') => void;
  onBuyPremium: () => void;
  onClose: () => void;
}

export const SeasonPass: React.FC<SeasonPassProps> = ({
  lang,
  season,
  onClaimReward,
  onBuyPremium,
  onClose,
}) => {
  const [selectedTier, setSelectedTier] = useState<number | null>(null);
  const [particles, setParticles] = useState<Particle[]>([]);

  const currentTier = Math.floor(season.currentProgress / (season.totalProgress / season.totalTiers));

  const daysRemaining = (() => {
    const end = new Date(season.endDate).getTime();
    const now = Date.now();
    const diff = end - now;
    if (diff <= 0) return 0;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  })();

  const handleClaim = (tier: number, type: 'free' | 'premium') => {
    triggerHapticNotification('success');
    if (tier === season.totalTiers) {
      setParticles(createConfettiExplosion(window.innerWidth / 2, window.innerHeight / 2));
    }
    onClaimReward(tier, type);
  };

  const texts = {
    title: { ua: 'Сезонний Пропуск', en: 'Season Pass' },
    daysLeft: { ua: 'днів залишилось', en: 'days left' },
    level: { ua: 'Рівень', en: 'Level' },
    free: { ua: 'Безкоштовно', en: 'Free' },
    premium: { ua: 'Преміум', en: 'Premium' },
    claim: { ua: 'Забрати', en: 'Claim' },
    claimed: { ua: 'Отримано', en: 'Claimed' },
    unlockedAt: { ua: 'Розблоковується на рівні', en: 'Unlocks at level' },
    upgradePremium: { ua: 'Оновити до Преміум', en: 'Upgrade to Premium' },
    xpProgress: { ua: 'XP прогрес', en: 'XP progress' },
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
        className="relative bg-gradient-to-br from-[#1a1a2e] to-[#16213e] rounded-3xl shadow-2xl border border-white/10 max-w-md w-full mx-4 max-h-[85vh] overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-gradient-to-b from-[#1a1a2e] to-transparent pb-2 z-10">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-white/60 hover:text-white text-2xl"
          >
            ×
          </button>

          <div className="flex items-center justify-between px-5 pt-4">
            <div>
              <h2 className="text-xl font-bold text-white">{season.name[lang]}</h2>
              <div className="text-xs text-white/40">{daysRemaining} {texts.daysLeft[lang]}</div>
            </div>
            {!season.hasPremium && (
              <motion.button
                onClick={() => {
                  triggerHapticFeedback('heavy');
                  onBuyPremium();
                }}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg text-black font-bold text-sm"
                whileTap={{ scale: 0.95 }}
              >
                <Crown className="w-4 h-4" />
                <Star className="w-4 h-4" />
                {texts.upgradePremium[lang]}
              </motion.button>
            )}
          </div>

          <div className="px-5 py-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-white/60">{texts.level[lang]} {currentTier}/{season.totalTiers}</span>
              <span className="text-sm text-white/60">{texts.xpProgress[lang]}: {season.currentProgress}/{season.totalProgress}</span>
            </div>
            <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(season.currentProgress / season.totalProgress) * 100}%` }}
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
              />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-5">
          <div className="space-y-3">
            {season.rewards.map((reward, index) => {
              const isCurrent = reward.tier <= currentTier;
              const isLocked = reward.tier > currentTier;
              const canClaimFree = isCurrent && !reward.claimedFree;
              const canClaimPremium = isCurrent && season.hasPremium && !reward.claimedPremium;

              return (
                <motion.div
                  key={reward.tier}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`relative flex item-center gap-3 p-3 rounded-xl border ${
                    isLocked
                      ? 'bg-white/5 border-white/10'
                      : 'bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/30'
                  }`}
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 text-white font-bold">
                    {reward.tier}
                  </div>

                  <div className="flex-1 flex gap-3">
                    <div
                      className={`flex-1 p-2 rounded-lg ${
                        canClaimFree
                          ? 'bg-gray-500/30 border-2 border-gray-400 animate-pulse'
                          : 'bg-white/5 border border-white/10'
                      }`}
                    >
                      <div className="text-xs text-gray-400 mb-1">{texts.free[lang]}</div>
                      <div className="flex items-center gap-2">
                        {reward.freeReward.type === 'xp' ? (
                          <>
                            <Zap className="w-5 h-5 text-yellow-400" />
                            <span className="text-white font-bold">+{reward.freeReward.value} XP</span>
                          </>
                        ) : (
                          <>
                            <Gift className="w-5 h-5 text-purple-400" />
                            <span className="text-sm text-white">{reward.freeReward.name?.[lang] || 'Artifact'}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div
                      className={`flex-1 p-2 rounded-lg ${
                        canClaimPremium
                          ? 'bg-yellow-500/30 border-2 border-yellow-400 animate-pulse'
                          : season.hasPremium
                          ? 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30'
                          : 'bg-white/5 border border-white/10 opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        {!season.hasPremium && <Lock className="w-3 h-3 text-white/30" />}
                        <span className="text-xs text-yellow-400">{texts.premium[lang]}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {reward.premiumReward.type === 'xp' ? (
                          <>
                            <Zap className="w-5 h-5 text-yellow-400" />
                            <span className="text-white font-bold">+{reward.premiumReward.value} XP</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-5 h-5 text-purple-400" />
                            <span className="text-sm text-white">{reward.premiumReward.name?.[lang] || 'Artifact'}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 justify-center">
                    {canClaimFree && (
                      <motion.button
                        onClick={() => handleClaim(reward.tier, 'free')}
                        className="px-3 py-1.5 bg-gray-500 rounded-lg text-white text-xs font-medium"
                        whileTap={{ scale: 0.95 }}
                      >
                        {texts.claim[lang]}
                      </motion.button>
                    )}
                    {canClaimPremium && (
                      <motion.button
                        onClick={() => handleClaim(reward.tier, 'premium')}
                        className="px-3 py-1.5 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg text-black text-xs font-medium"
                        whileTap={{ scale: 0.95 }}
                      >
                        {texts.claim[lang]}
                      </motion.button>
                    )}
                    {reward.claimedFree && reward.claimedPremium && (
                      <span className="text-xs text-green-400 text-center">{texts.claimed[lang]}</span>
                    )}
                    {isLocked && (
                      <span className="text-xs text-white/30 text-center">🔒</span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>

      <ParticleSystem particles={particles} onComplete={() => setParticles([])} />
    </motion.div>
  );
};

export default SeasonPass;
