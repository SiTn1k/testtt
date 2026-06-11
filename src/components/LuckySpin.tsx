import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Dices, Star, Gift, Zap, Crown, Sparkles, Trophy, Coins } from 'lucide-react';
import { createConfettiExplosion, ParticleSystem, Particle } from './Particles';
import { triggerHapticFeedback, triggerHapticNotification } from '../lib/telegram';

interface SpinReward {
  id: string;
  label: { ua: string; en: string };
  type: 'xp' | 'stars' | 'artifact' | 'autoclicker' | 'booster';
  value: number;
  color: string;
  probability: number;
}

const SPIN_REWARDS: SpinReward[] = [
  { id: 'xp_50', label: { ua: '50 XP', en: '50 XP' }, type: 'xp', value: 50, color: '#4ade80', probability: 30 },
  { id: 'xp_100', label: { ua: '100 XP', en: '100 XP' }, type: 'xp', value: 100, color: '#22d3ee', probability: 25 },
  { id: 'xp_250', label: { ua: '250 XP', en: '250 XP' }, type: 'xp', value: 250, color: '#a78bfa', probability: 15 },
  { id: 'xp_500', label: { ua: '500 XP', en: '500 XP' }, type: 'xp', value: 500, color: '#f472b6', probability: 10 },
  { id: 'autoclicker_1h', label: { ua: 'Автоклікер 1г', en: 'Autoclicker 1h' }, type: 'autoclicker', value: 3600, color: '#fbbf24', probability: 8 },
  { id: 'booster_2x', label: { ua: '2x XP на 30хв', en: '2x XP 30min' }, type: 'booster', value: 1800, color: '#fb923c', probability: 7 },
  { id: 'stars_10', label: { ua: '10 Stars', en: '10 Stars' }, type: 'stars', value: 10, color: '#ffd700', probability: 4 },
  { id: 'jackpot', label: { ua: 'ДЖЕКПОТ!', en: 'JACKPOT!' }, type: 'xp', value: 5000, color: '#dc2626', probability: 1 },
];

interface LuckySpinProps {
  lang: 'ua' | 'en';
  canSpin: boolean;
  costXP?: number;
  onSpin: (reward: SpinReward) => void;
  onPurchaseSpin?: () => void;
  onClose: () => void;
}

export const LuckySpin: React.FC<LuckySpinProps> = ({
  lang,
  canSpin,
  costXP = 100,
  onSpin,
  onPurchaseSpin,
  onClose,
}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedReward, setSelectedReward] = useState<SpinReward | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);

  const selectWeightedReward = useCallback((): SpinReward => {
    const totalWeight = SPIN_REWARDS.reduce((sum, r) => sum + r.probability, 0);
    let random = Math.random() * totalWeight;

    for (const reward of SPIN_REWARDS) {
      random -= reward.probability;
      if (random <= 0) return reward;
    }
    return SPIN_REWARDS[0];
  }, []);

  const spin = useCallback(() => {
    if (isSpinning || !canSpin) return;

    setIsSpinning(true);
    setSelectedReward(null);
    setShowResult(false);
    triggerHapticFeedback('heavy');

    const reward = selectWeightedReward();
    const rewardIndex = SPIN_REWARDS.findIndex(r => r.id === reward.id);
    const segmentAngle = 360 / SPIN_REWARDS.length;
    const targetAngle = 360 - (rewardIndex * segmentAngle + segmentAngle / 2);
    const spins = 5 + Math.floor(Math.random() * 3);
    const finalRotation = rotation + spins * 360 + targetAngle;

    setRotation(finalRotation);

    setTimeout(() => {
      setIsSpinning(false);
      setSelectedReward(reward);
      setShowResult(true);

      if (reward.id === 'jackpot') {
        triggerHapticNotification('success');
        setParticles(createConfettiExplosion(window.innerWidth / 2, window.innerHeight / 2));
      } else {
        triggerHapticFeedback('medium');
      }

      onSpin(reward);
    }, 4000);
  }, [isSpinning, canSpin, rotation, selectWeightedReward, onSpin]);

  const texts = {
    title: { ua: 'Щасливе Коло', en: 'Lucky Wheel' },
    spin: { ua: 'КРУТИТИ', en: 'SPIN' },
    free: { ua: 'Безкоштовно', en: 'Free' },
    cost: { ua: 'За', en: 'Cost' },
    won: { ua: 'Ви виграли!', en: 'You won!' },
    claim: { ua: 'Забрати', en: 'Claim' },
    close: { ua: 'Закрити', en: 'Close' },
    noSpins: { ua: 'Немає спроб', en: 'No spins' },
    buySpin: { ua: 'Купити спін', en: 'Buy spin' },
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
        className="relative bg-gradient-to-br from-[#1a1a2e] to-[#16213e] rounded-3xl p-6 shadow-2xl border border-white/10"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white/60 hover:text-white text-2xl"
        >
          ×
        </button>

        <h2 className="text-2xl font-bold text-center text-white mb-6 flex items-center justify-center gap-2">
          <Dices className="w-6 h-6 text-yellow-400" />
          {texts.title[lang]}
        </h2>

        <div className="relative w-72 h-72 mx-auto mb-6">
          <div
            className="absolute inset-0 rounded-full overflow-hidden"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: isSpinning ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none',
            }}
          >
            {SPIN_REWARDS.map((reward, index) => (
              <div
                key={reward.id}
                className="absolute w-1/2 h-1/2 origin-bottom-right"
                style={{
                  transform: `rotate(${index * (360 / SPIN_REWARDS.length)}deg) skewY(${-90 + 360 / SPIN_REWARDS.length}deg)`,
                  background: `linear-gradient(135deg, ${reward.color}40, ${reward.color}20)`,
                  borderRight: '1px solid rgba(255,255,255,0.2)',
                }}
              >
                <div
                  className="absolute left-1/2 top-1/2 flex items-center justify-center"
                  style={{
                    transform: `skewY(${90 - 360 / SPIN_REWARDS.length}deg) rotate(${-index * (360 / SPIN_REWARDS.length) - (360 / SPIN_REWARDS.length) / 2}deg) translateX(-50%)`,
                  }}
                >
                  <span className="text-xs font-bold text-white text-center" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                    {reward.label[lang]}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="absolute inset-4 rounded-full bg-gradient-to-br from-[#1a1a2e] to-[#16213e] shadow-inner" />

          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1">
            <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[20px] border-l-transparent border-r-transparent border-t-yellow-400 drop-shadow-lg" />
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <motion.button
              onClick={spin}
              disabled={isSpinning || !canSpin}
              className={`w-20 h-20 rounded-full flex items-center justify-center font-bold text-sm shadow-lg ${
                canSpin && !isSpinning
                  ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-black hover:scale-105 cursor-pointer'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
              whileTap={canSpin && !isSpinning ? { scale: 0.95 } : {}}
            >
              {isSpinning ? '...' : texts.spin[lang]}
            </motion.button>
          </div>
        </div>

        {!canSpin && !isSpinning && (
          <div className="text-center mb-4">
            <p className="text-white/60 text-sm mb-2">{texts.noSpins[lang]}</p>
            {onPurchaseSpin && (
              <motion.button
                onClick={onPurchaseSpin}
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg text-white font-medium flex items-center gap-2 mx-auto"
                whileTap={{ scale: 0.95 }}
              >
                <Zap className="w-4 h-4" />
                {texts.buySpin[lang]} ({costXP} XP)
              </motion.button>
            )}
          </div>
        )}

        <AnimatePresence>
          {showResult && selectedReward && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <div className="text-lg text-white/80 mb-2">{texts.won[lang]}</div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full"
                style={{
                  background: `linear-gradient(135deg, ${selectedReward.color}40, ${selectedReward.color}20)`,
                  border: `2px solid ${selectedReward.color}`,
                }}
              >
                {selectedReward.type === 'xp' && <Zap className="w-6 h-6 text-yellow-400" />}
                {selectedReward.type === 'stars' && <Star className="w-6 h-6 text-yellow-400" />}
                {selectedReward.type === 'autoclicker' && <Gift className="w-6 h-6 text-blue-400" />}
                {selectedReward.type === 'booster' && <Sparkles className="w-6 h-6 text-purple-400" />}
                <span className="text-xl font-bold text-white">{selectedReward.label[lang]}</span>
              </motion.div>

              {selectedReward.id === 'jackpot' && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="mt-4 flex justify-center"
                >
                  <Crown className="w-12 h-12 text-yellow-400" />
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <ParticleSystem particles={particles} onComplete={() => setParticles([])} />
    </motion.div>
  );
};

export default LuckySpin;
