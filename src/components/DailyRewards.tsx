import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gift, Flame, Star, Zap, Timer, Check } from 'lucide-react';
import { createConfettiExplosion, ParticleSystem, Particle } from './Particles';
import { triggerHapticFeedback, triggerHapticNotification } from '../lib/telegram';

interface DailyReward {
  day: number;
  xp: number;
  bonus?: { type: 'stars' | 'autoclicker'; value: number };
}

const DAILY_REWARDS: DailyReward[] = [
  { day: 1, xp: 50 },
  { day: 2, xp: 100 },
  { day: 3, xp: 150 },
  { day: 4, xp: 200 },
  { day: 5, xp: 300, bonus: { type: 'stars', value: 5 } },
  { day: 6, xp: 400 },
  { day: 7, xp: 500, bonus: { type: 'autoclicker', value: 3600 } },
];

const STREAK_BONUS_MULTIPLIER = 0.1;

interface DailyRewardsProps {
  lang: 'ua' | 'en';
  consecutiveDays: number;
  lastClaimDate: string | null;
  onClaim: (reward: DailyReward) => void;
  onClose: () => void;
}

export const DailyRewards: React.FC<DailyRewardsProps> = ({
  lang,
  consecutiveDays,
  lastClaimDate,
  onClaim,
  onClose,
}) => {
  const [canClaim, setCanClaim] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!lastClaimDate) {
      setCanClaim(true);
      return;
    }

    const lastClaim = new Date(lastClaimDate);
    const now = new Date();
    const hoursSinceClaim = (now.getTime() - lastClaim.getTime()) / (1000 * 60 * 60);

    if (hoursSinceClaim >= 20) {
      setCanClaim(true);
    }

    if (hoursSinceClaim > 48) {
      setCanClaim(true);
    }
  }, [lastClaimDate]);

  const currentDay = canClaim
    ? (consecutiveDays >= 7 ? 1 : consecutiveDays + 1)
    : ((consecutiveDays - 1 + 7) % 7 || 7);

  const getRewardForDay = (day: number): DailyReward => {
    return DAILY_REWARDS.find(r => r.day === day) || DAILY_REWARDS[0];
  };

  const calculateTotalXP = (day: number): number => {
    const baseReward = getRewardForDay(day);
    const streakBonus = Math.floor(baseReward.xp * (consecutiveDays * STREAK_BONUS_MULTIPLIER));
    return baseReward.xp + streakBonus;
  };

  const handleClaim = useCallback(() => {
    if (!canClaim) return;

    triggerHapticFeedback('heavy');
    const reward = getRewardForDay(currentDay);
    const totalXP = calculateTotalXP(currentDay);
    const fullReward = { ...reward, xp: totalXP };

    setSelectedDay(currentDay);
    setShowResult(true);

    if (currentDay === 7) {
      triggerHapticNotification('success');
      setParticles(createConfettiExplosion(window.innerWidth / 2, window.innerHeight / 2));
    }

    setTimeout(() => {
      onClaim(fullReward);
    }, 1500);
  }, [canClaim, currentDay, consecutiveDays, onClaim]);

  const getTimeUntilNextClaim = (): string | null => {
    if (canClaim) return null;
    if (!lastClaimDate) return null;

    const lastClaim = new Date(lastClaimDate);
    const nextClaim = new Date(lastClaim.getTime() + 20 * 60 * 60 * 1000);
    const now = new Date();
    const diff = nextClaim.getTime() - now.getTime();

    if (diff <= 0) return null;

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
  };

  const texts = {
    title: { ua: 'Щоденні Нагороди', en: 'Daily Rewards' },
    claim: { ua: 'Забрати', en: 'Claim' },
    streak: { ua: 'Серія', en: 'Streak' },
    days: { ua: 'днів', en: 'days' },
    today: { ua: 'Сьогодні', en: 'Today' },
    claimed: { ua: 'Забрано', en: 'Claimed' },
    bonus: { ua: 'Бонус серії', en: 'Streak bonus' },
    nextClaim: { ua: 'Наступна нагорода через', en: 'Next reward in' },
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
        className="relative bg-gradient-to-br from-[#1a1a2e] to-[#16213e] rounded-3xl p-6 shadow-2xl border border-white/10 max-w-sm w-full mx-4"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white/60 hover:text-white text-2xl"
        >
          ×
        </button>

        <div className="flex items-center justify-center gap-2 mb-2">
          <Gift className="w-6 h-6 text-yellow-400" />
          <h2 className="text-xl font-bold text-white">{texts.title[lang]}</h2>
        </div>

        <div className="flex items-center justify-center gap-2 mb-4">
          <Flame className="w-5 h-5 text-orange-400" />
          <span className="text-white/80">{texts.streak[lang]}:</span>
          <span className="text-lg font-bold text-orange-400">{consecutiveDays} {texts.days[lang]}</span>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-4">
          {DAILY_REWARDS.map((reward) => {
            const isToday = reward.day === currentDay;
            const isPast = reward.day < currentDay || (!canClaim && reward.day <= consecutiveDays);
            const isSelected = selectedDay === reward.day;

            return (
              <motion.div
                key={reward.day}
                className={`relative flex flex-col items-center rounded-xl p-2 transition-all ${
                  isToday && canClaim
                    ? 'bg-gradient-to-br from-yellow-400/20 to-orange-500/20 border-2 border-yellow-400'
                    : isPast
                    ? 'bg-green-500/20 border border-green-500/40'
                    : 'bg-white/5 border border-white/10'
                }`}
                whileHover={isToday && canClaim ? { scale: 1.05 } : {}}
                whileTap={isToday && canClaim ? { scale: 0.95 } : {}}
              >
                {isPast && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Check className="w-6 h-6 text-green-400" />
                  </div>
                )}

                <span className={`text-xs font-bold mb-1 ${isPast ? 'text-green-400' : isToday ? 'text-yellow-400' : 'text-white/40'}`}>
                  {reward.day}
                </span>

                {!isPast && (
                  <>
                    <Zap className="w-4 h-4 text-yellow-400 mb-1" />
                    <span className="text-[10px] text-white/60">{reward.xp} XP</span>
                    {reward.bonus && (
                      <Star className="w-3 h-3 text-yellow-400 mt-1" />
                    )}
                  </>
                )}
              </motion.div>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {showResult && selectedDay ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4"
            >
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="flex flex-col items-center gap-2"
              >
                <Zap className="w-10 h-10 text-yellow-400" />
                <div className="text-3xl font-bold text-yellow-400">
                  +{calculateTotalXP(selectedDay)} XP
                </div>
                <div className="text-sm text-white/60">
                  (+{Math.floor(getRewardForDay(selectedDay).xp * consecutiveDays * STREAK_BONUS_MULTIPLIER)} {texts.bonus[lang]})
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {canClaim ? (
                <motion.button
                  onClick={handleClaim}
                  className="w-full py-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl font-bold text-black flex items-center justify-center gap-2"
                  whileTap={{ scale: 0.98 }}
                >
                  <Gift className="w-5 h-5" />
                  {texts.claim[lang]} {texts.today[lang]}
                </motion.button>
              ) : (
                <div className="text-center py-4">
                  <div className="flex items-center justify-center gap-2 text-white/60">
                    <Timer className="w-5 h-5" />
                    <span>
                      {texts.nextClaim[lang]}: {getTimeUntilNextClaim()}
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <ParticleSystem particles={particles} onComplete={() => setParticles([])} />
    </motion.div>
  );
};

export default DailyRewards;
