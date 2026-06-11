import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Crown, Medal, Flame, TrendingUp, User } from 'lucide-react';
import { triggerHapticFeedback } from '../lib/telegram';

interface LeaderboardEntry {
  rank: number;
  userId: string;
  telegramId: number;
  firstName: string;
  photoUrl?: string;
  totalXP: number;
  totalTaps: number;
  streak: number;
  guildName?: string;
}

interface LeaderboardProps {
  lang: 'ua' | 'en';
  myRank?: number;
  entries: LeaderboardEntry[];
  onUserClick?: (userId: string) => void;
  onClose: () => void;
}

const RANK_ICONS: Record<number, { icon: React.ReactNode; color: string }> = {
  1: { icon: <Crown className="w-6 h-6" />, color: 'from-yellow-400 to-amber-500' },
  2: { icon: <Medal className="w-6 h-6" />, color: 'from-gray-300 to-gray-400' },
  3: { icon: <Medal className="w-6 h-6" />, color: 'from-orange-400 to-orange-600' },
};

export const Leaderboard: React.FC<LeaderboardProps> = ({
  lang,
  myRank = 0,
  entries,
  onUserClick,
  onClose,
}) => {
  const [selectedTab, setSelectedTab] = useState<'xp' | 'taps' | 'streak'>('xp');
  const [animatedEntries, setAnimatedEntries] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    setAnimatedEntries([]);
    const timer = setTimeout(() => {
      setAnimatedEntries(entries);
    }, 100);
    return () => clearTimeout(timer);
  }, [entries, selectedTab]);

  const sortedEntries = [...entries].sort((a, b) => {
    if (selectedTab === 'xp') return b.totalXP - a.totalXP;
    if (selectedTab === 'taps') return b.totalTaps - a.totalTaps;
    return b.streak - a.streak;
  }).slice(0, 50);

  const texts = {
    title: { ua: 'Таблиця Лідерів', en: 'Leaderboard' },
    xp: { ua: 'XP', en: 'XP' },
    taps: { ua: 'Тапи', en: 'Taps' },
    streak: { ua: 'Серія', en: 'Streak' },
    rank: { ua: 'Ваше місце', en: 'Your rank' },
    days: { ua: 'днів', en: 'days' },
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
        className="relative bg-gradient-to-br from-[#1a1a2e] to-[#16213e] rounded-3xl p-5 shadow-2xl border border-white/10 max-w-md w-full mx-4 max-h-[85vh] overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white/60 hover:text-white text-2xl z-10"
        >
          ×
        </button>

        <div className="flex items-center justify-center gap-2 mb-4">
          <Trophy className="w-6 h-6 text-yellow-400" />
          <h2 className="text-xl font-bold text-white">{texts.title[lang]}</h2>
        </div>

        {myRank > 0 && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex items-center justify-center gap-2 mb-4"
          >
            <span className="text-white/60 text-sm">{texts.rank[lang]}:</span>
            <span className="text-lg font-bold text-yellow-400">#{myRank}</span>
          </motion.div>
        )}

        <div className="flex gap-2 mb-4 bg-white/5 p-1 rounded-xl">
          {(['xp', 'taps', 'streak'] as const).map(tab => (
            <motion.button
              key={tab}
              onClick={() => {
                triggerHapticFeedback('light');
                setSelectedTab(tab);
              }}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                selectedTab === tab
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black'
                  : 'text-white/60 hover:text-white'
              }`}
              whileTap={{ scale: 0.95 }}
            >
              {texts[tab][lang]}
            </motion.button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          <AnimatePresence mode="popLayout">
            {sortedEntries.map((entry, index) => {
              const isTop3 = index < 3;
              const rankIcon = RANK_ICONS[index + 1];

              return (
                <motion.div
                  key={entry.userId}
                  layout
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 100, opacity: 0 }}
                  transition={{ delay: index * 0.03 }}
                  onClick={() => onUserClick?.(entry.userId)}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                    isTop3
                      ? `bg-gradient-to-r ${rankIcon?.color || 'from-blue-400 to-blue-600'} bg-opacity-20`
                      : 'bg-white/5 hover:bg-white/10'
                  }`}
                  whileHover={{ scale: isTop3 ? 1.02 : 1.01 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isTop3
                        ? `bg-gradient-to-br ${rankIcon?.color || ''} shadow-lg`
                        : 'bg-white/10'
                    }`}
                    style={isTop3 ? { boxShadow: '0 0 15px rgba(251, 191, 36, 0.3)' } : undefined}
                  >
                    {isTop3 ? (
                      <span className="text-white">{rankIcon?.icon}</span>
                    ) : (
                      <span className="text-white/60 font-bold">#{index + 1}</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {entry.photoUrl ? (
                        <img
                          src={entry.photoUrl}
                          alt={entry.firstName}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                          <User className="w-4 h-4 text-white/40" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-white truncate">{entry.firstName}</div>
                        {entry.guildName && (
                          <div className="text-xs text-white/40 truncate">{entry.guildName}</div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-bold text-white">
                      {selectedTab === 'xp' && `${entry.totalXP.toLocaleString()} XP`}
                      {selectedTab === 'taps' && `${entry.totalTaps.toLocaleString()}`}
                      {selectedTab === 'streak' && (
                        <span className="flex items-center gap-1 justify-end">
                          <Flame className="w-4 h-4 text-orange-400" />
                          {entry.streak} {texts.days[lang]}
                        </span>
                      )}
                    </div>
                    {selectedTab === 'taps' && (
                      <div className="text-xs text-white/40">
                        {entry.totalXP.toLocaleString()} XP
                      </div>
                    )}
                  </div>

                  {entry.streak > 3 && selectedTab !== 'streak' && (
                    <div className="flex items-center gap-1 text-xs text-orange-400">
                      <Flame className="w-3 h-3" />
                      {entry.streak}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Leaderboard;
