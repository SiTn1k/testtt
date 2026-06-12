import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Star, Zap, Target, Gift, Users, Crown, Flame, Sparkles, Award, Lock, Check, Clock, Landmark, BookOpen, Heart, Coins, Swords, Shield, Scroll } from 'lucide-react';
import { createConfettiExplosion, ParticleSystem, Particle } from './Particles';
import { triggerHapticFeedback, triggerHapticNotification } from '../lib/telegram';
import { UNIFIED_ACHIEVEMENTS } from '../lib/api';
import type { LucideIcon } from 'lucide-react';

export interface Achievement {
  id: string;
  key: string;
  title: { ua: string; en: string };
  description: { ua: string; en: string };
  icon: React.ReactNode;
  color: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  xpReward: number;
  condition?: { type: string; value: number };
}

const ICON_MAP: Record<string, LucideIcon> = {
  FIRST_VISIT: Award,
  FIRST_ARTIFACT_VIEW: Landmark,
  ONE_HOUR: Clock,
  TEN_ARTIFACTS: Landmark,
  ALL_ARTIFACTS: Crown,
  FIRST_ARTICLE: BookOpen,
  FIRST_TAP: Zap,
  TAP_100: Target,
  TAP_1000: Zap,
  TAP_10000: Star,
  XP_1000: Sparkles,
  XP_10000: Crown,
  ARTIFACTS_5: Gift,
  ARTIFACTS_ALL: Trophy,
  FIRST_REFERRAL: Users,
  REFERRALS_10: Users,
  FIRST_DONATION: Heart,
  DONATED_100: Coins,
  DONATED_1000: Crown,
  STREAK_7: Flame,
  STREAK_30: Flame,
  COLLECTION_KYIVAN_RUS: Crown,
  COLLECTION_COSSACK_ERA: Swords,
  COLLECTION_UNR: Scroll,
  COLLECTION_MODERN_UKRAINE: Shield,
};

const RARITY_COLOR: Record<string, string> = {
  common: '#4ade80',
  rare: '#22d3ee',
  epic: '#a78bfa',
  legendary: '#fbbf24',
};

const createIcon = (key: string): React.ReactNode => {
  const IconComp = ICON_MAP[key] || Star;
  return React.createElement(IconComp, { className: "w-8 h-8" });
};

export const ACHIEVEMENTS_LIST: Achievement[] = UNIFIED_ACHIEVEMENTS.map(a => ({
  id: a.key,
  key: a.key,
  title: { ua: a.ua, en: a.en },
  description: { ua: a.ua, en: a.en },
  icon: createIcon(a.key),
  color: RARITY_COLOR[a.rarity] || '#4ade80',
  rarity: a.rarity,
  xpReward: a.xpReward,
  condition: a.condition,
}));

const RARITY_COLORS: Record<string, string> = {
  common: 'from-gray-400 to-gray-500',
  rare: 'from-blue-400 to-blue-600',
  epic: 'from-purple-400 to-purple-600',
  legendary: 'from-yellow-400 to-orange-500',
};

const RARITY_BG: Record<string, string> = {
  common: 'rgba(156, 163, 175, 0.15)',
  rare: 'rgba(59, 130, 246, 0.15)',
  epic: 'rgba(168, 85, 247, 0.15)',
  legendary: 'rgba(251, 191, 36, 0.15)',
};

interface AchievementBadgeProps {
  achievement: Achievement;
  unlocked: boolean;
  showDetails?: boolean;
  onClick?: () => void;
  lang: 'ua' | 'en';
}

export const AchievementBadge: React.FC<AchievementBadgeProps> = ({
  achievement,
  unlocked,
  showDetails = false,
  onClick,
  lang,
}) => {
  const [showUnlock, setShowUnlock] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);

  const handleUnlock = () => {
    triggerHapticNotification('success');
    setShowUnlock(true);
    if (achievement.rarity === 'legendary') {
      setParticles(createConfettiExplosion(window.innerWidth / 2, window.innerHeight / 2));
    }
    setTimeout(() => {
      onClick?.();
    }, 1500);
  };

  return (
    <>
      <motion.div
        onClick={unlocked ? onClick : undefined}
        className={`relative flex items-center gap-3 p-3 rounded-xl transition-all ${
          unlocked
            ? `bg-gradient-to-r ${RARITY_COLORS[achievement.rarity]} bg-opacity-20`
            : 'bg-white/5 opacity-50'
        }`}
        style={{ backgroundColor: unlocked ? RARITY_BG[achievement.rarity] : undefined }}
        whileHover={unlocked ? { scale: 1.02 } : {}}
        whileTap={unlocked ? { scale: 0.98 } : {}}
      >
        <div
          className={`w-14 h-14 rounded-xl flex items-center justify-center ${
            unlocked
              ? `bg-gradient-to-br ${RARITY_COLORS[achievement.rarity]} shadow-lg`
              : 'bg-gray-700'
          }`}
          style={{
            boxShadow: unlocked ? `0 0 20px ${achievement.color}40` : undefined,
          }}
        >
          {unlocked ? (
            <div style={{ color: 'white' }}>{achievement.icon}</div>
          ) : (
            <Lock className="w-6 h-6 text-gray-500" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={`font-bold ${unlocked ? 'text-white' : 'text-gray-400'}`}>
              {achievement.title[lang]}
            </span>
            {unlocked && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-1 bg-green-500/20 px-2 py-0.5 rounded-full"
              >
                <Check className="w-3 h-3 text-green-400" />
                <span className="text-xs text-green-400">+{achievement.xpReward} XP</span>
              </motion.div>
            )}
          </div>
          <p className={`text-sm ${unlocked ? 'text-white/70' : 'text-gray-500'} truncate`}>
            {achievement.description[lang]}
          </p>
        </div>

        {showDetails && (
          <div className="text-xs text-white/40 capitalize px-2">
            {achievement.rarity}
          </div>
        )}
      </motion.div>

      <ParticleSystem particles={particles} onComplete={() => setParticles([])} />
    </>
  );
};

interface AchievementsModalProps {
  lang: 'ua' | 'en';
  unlockedKeys: string[];
  stats: { totalTaps: number; totalXP: number; artifactsCount: number; referralsCount: number; streak: number };
  onClose: () => void;
  onClaim?: (achievement: Achievement) => void;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  lang,
  unlockedKeys,
  stats,
  onClose,
}) => {
  const texts = {
    title: { ua: 'Досягнення', en: 'Achievements' },
    unlocked: { ua: 'Розблоковано', en: 'Unlocked' },
    progress: { ua: 'Прогрес', en: 'Progress' },
  };

  const categorizedAchievements = {
    common: ACHIEVEMENTS_LIST.filter(a => a.rarity === 'common'),
    rare: ACHIEVEMENTS_LIST.filter(a => a.rarity === 'rare'),
    epic: ACHIEVEMENTS_LIST.filter(a => a.rarity === 'epic'),
    legendary: ACHIEVEMENTS_LIST.filter(a => a.rarity === 'legendary'),
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
        className="relative bg-gradient-to-br from-[#1a1a2e] to-[#16213e] rounded-3xl p-5 shadow-2xl border border-white/10 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white/60 hover:text-white text-2xl"
        >
          ×
        </button>

        <div className="flex items-center justify-center gap-2 mb-4">
          <Award className="w-6 h-6 text-yellow-400" />
          <h2 className="text-xl font-bold text-white">{texts.title[lang]}</h2>
        </div>

        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">{unlockedKeys.length}</div>
            <div className="text-xs text-white/60">{texts.unlocked[lang]}</div>
          </div>
          <div className="w-px h-8 bg-white/20" />
          <div className="text-center">
            <div className="text-2xl font-bold text-white/60">{ACHIEVEMENTS_LIST.length}</div>
            <div className="text-xs text-white/60">{texts.progress[lang]}</div>
          </div>
        </div>

        <div className="space-y-4">
          {['legendary', 'epic', 'rare', 'common'].map(rarity => (
            <div key={rarity}>
              <div className="text-xs font-bold text-white/40 uppercase mb-2 px-1">
                {rarity}
              </div>
              <div className="space-y-2">
                {categorizedAchievements[rarity as keyof typeof categorizedAchievements].map(achievement => (
                  <AchievementBadge
                    key={achievement.id}
                    achievement={achievement}
                    unlocked={unlockedKeys.includes(achievement.key)}
                    lang={lang}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AchievementsModal;
