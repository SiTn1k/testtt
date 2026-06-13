import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Zap, Star, Trophy, Clock, Landmark, ImageIcon,
  Heart, TrendingUp, Crown, Award, CheckCircle2,
  Gift, Flame, Users, Target, Medal, ChevronRight, ChevronLeft,
  Send, Dices,
} from "lucide-react";
import { GlassCard } from "./GlassCard";
import {
  museumAPI,
  CATEGORY_META,
  REFERRAL_MILESTONES,
  DAILY_REWARDS,
  UNIFIED_ACHIEVEMENTS,
  type DailyStreak,
  type DailyClaim,
  type ReferralStats,
  type LeaderboardEntry,
  type WeeklyQuest,
  type QuestProgress,
  type MuseumProgress,
  type ArtifactCategory,
  type UserStats,
  type DailyQuest,
  type DailyQuestProgress,
} from "../lib/api";

interface TelegramUserData {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  photo_url?: string;
  is_premium?: boolean;
}

interface DbUser {
  id: number;
  telegram_id: number;
  username?: string | null;
  first_name?: string;
  total_xp?: number;
}

const RARITY_COLOR: Record<string, string> = {
  common: "#4ade80",
  rare: "#22d3ee",
  epic: "#a855f7",
  legendary: "#ffd700",
};

type ProfileTab = "main" | "daily" | "referral" | "leaderboard" | "quests" | "collection";

export function ProfileScreen({
  lang, setLang, telegramUser, dbUser, stats, onRefresh, sessionStartIso,
  onOpenLuckySpin, onOpenGuilds, onOpenSeasonPass, onOpenLimitedArtifacts,
}: {
  lang: "ua" | "en"; setLang: (l: "ua" | "en") => void;
  telegramUser: TelegramUserData | null; dbUser: DbUser | null; stats: UserStats | null;
  onRefresh: () => void; sessionStartIso: string | null;
  onOpenLuckySpin?: () => void;
  onOpenGuilds?: () => void;
  onOpenSeasonPass?: () => void;
  onOpenLimitedArtifacts?: () => void;
}) {
  const [tab, setTab] = useState<ProfileTab>("main");
  const [liveMinutes, setLiveMinutes] = useState(0);

  const [dailyStreak, setDailyStreak] = useState<DailyStreak | null>(null);
  const [todayClaim, setTodayClaim] = useState<DailyClaim | null>(null);
  const [referralStats, setReferralStats] = useState<ReferralStats | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [quests, setQuests] = useState<WeeklyQuest[]>([]);
  const [questProgress, setQuestProgress] = useState<QuestProgress[]>([]);
  const [museumProgress, setMuseumProgress] = useState<MuseumProgress[]>([]);
  const [dailyQuests, setDailyQuests] = useState<DailyQuest[]>([]);
  const [dailyQuestProgress, setDailyQuestProgress] = useState<DailyQuestProgress[]>([]);

  useEffect(() => {
    const calc = () => {
      if (!sessionStartIso) return;
      setLiveMinutes(Math.floor((Date.now() - new Date(sessionStartIso).getTime()) / 60000));
    };
    calc();
    const iv = setInterval(calc, 30_000);
    return () => clearInterval(iv);
  }, [sessionStartIso]);

  useEffect(() => {
    if (!dbUser) return;
    if (tab === "daily") {
      museumAPI.getDailyStreak(dbUser.id).then(setDailyStreak);
      museumAPI.getTodayClaim(dbUser.id).then(setTodayClaim);
    }
    if (tab === "referral") {
      museumAPI.getReferralStats(dbUser.id).then(setReferralStats);
    }
    if (tab === "leaderboard") {
      museumAPI.getLeaderboard(20).then(setLeaderboard);
    }
    if (tab === "quests") {
      museumAPI.getWeeklyQuests().then(setQuests);
      museumAPI.getQuestProgress(dbUser.id).then(setQuestProgress);
      museumAPI.getDailyQuests().then(setDailyQuests);
      museumAPI.getDailyQuestProgress(dbUser.id).then(setDailyQuestProgress);
    }
    if (tab === "collection") {
      museumAPI.getMuseumProgress(dbUser.id).then(setMuseumProgress);
    }
  }, [tab, dbUser]);

  const totalMinutesLive = (stats?.totalMinutes || 0) + liveMinutes;
  const formatTime = (mins: number) => {
    if (mins < 60) return `${mins}${lang === "ua" ? "хв" : "m"}`;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m > 0 ? `${h}${lang === "ua" ? "г" : "h"} ${m}${lang === "ua" ? "хв" : "m"}` : `${h}${lang === "ua" ? "г" : "h"}`;
  };

  const xpPercent = stats ? Math.min((stats.totalXP / stats.nextLevelXP) * 100, 100) : 0;

  const handleClaimDaily = async () => {
    if (!dbUser) return;
    const result = await museumAPI.claimDailyReward(dbUser.id);
    if (result.claimed) {
      museumAPI.getDailyStreak(dbUser.id).then(setDailyStreak);
      museumAPI.getTodayClaim(dbUser.id).then(setTodayClaim);
      onRefresh();
    }
  };

  const handleClaimQuest = async (questId: string) => {
    if (!dbUser) return;
    const result = await museumAPI.claimQuestReward(dbUser.id, questId);
    if (result.claimed) {
      museumAPI.getQuestProgress(dbUser.id).then(setQuestProgress);
      onRefresh();
    }
  };

  const handleClaimDailyQuest = async (questId: number) => {
    if (!dbUser) return;
    const result = await museumAPI.claimDailyQuestReward(dbUser.id, questId);
    if (result.claimed) {
      museumAPI.getDailyQuestProgress(dbUser.id).then(setDailyQuestProgress);
      onRefresh();
    }
  };

  const handleClaimCollection = async (category: ArtifactCategory) => {
    if (!dbUser) return;
    const result = await museumAPI.claimCollectionReward(dbUser.id, category);
    if (result.claimed) {
      museumAPI.getMuseumProgress(dbUser.id).then(setMuseumProgress);
      onRefresh();
    }
  };

  // Sub-screens
  if (tab === "daily") {
    return <DailyRewardsScreen lang={lang} onBack={() => setTab("main")} streak={dailyStreak} todayClaim={todayClaim} onClaim={handleClaimDaily} />;
  }
  if (tab === "referral") {
    return <ReferralScreen lang={lang} onBack={() => setTab("main")} stats={referralStats} dbUser={dbUser} />;
  }
  if (tab === "leaderboard") {
    return <LeaderboardScreen lang={lang} onBack={() => setTab("main")} entries={leaderboard} dbUser={dbUser} />;
  }
  if (tab === "quests") {
    return <QuestsScreen lang={lang} onBack={() => setTab("main")} quests={quests} progress={questProgress} dailyQuests={dailyQuests} dailyProgress={dailyQuestProgress} onClaimWeekly={handleClaimQuest} onClaimDaily={handleClaimDailyQuest} />;
  }
  if (tab === "collection") {
    return <CollectionScreen lang={lang} onBack={() => setTab("main")} progress={museumProgress} onClaim={handleClaimCollection} />;
  }

  // Main profile
  const avatarUrl = telegramUser?.photo_url || "https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=200";

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="relative pt-8 pb-4">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-gradient-to-br from-[#0057b7]/20 to-[#ffd700]/20 blur-3xl -z-10" />
        <div className="flex flex-col items-center">
          <div className="relative">
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="w-28 h-28 rounded-full p-1 bg-gradient-to-tr from-[#0057b7] via-[#22c55e] to-[#ffd700]">
              <div className="w-full h-full rounded-full border-4 border-[#0a0a0f] overflow-hidden">
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              </div>
            </motion.div>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 }} className="absolute -bottom-1 -right-1 bg-gradient-to-tr from-[#0057b7] to-[#ffd700] p-2 rounded-full shadow-lg">
              <Zap className="w-4 h-4 text-white" />
            </motion.div>
          </div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-center mt-4">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <h1 className="text-2xl font-bold text-white">{telegramUser?.first_name || "Guest"}</h1>
              <Star className="w-5 h-5 text-[#ffd700] fill-[#ffd700]" />
            </div>
            <p className="text-sm text-white/50 tracking-wide">@{telegramUser?.username || "guest"}</p>
          </motion.div>
        </div>
      </div>

      {/* Rank */}
      <GlassCard className="p-5 overflow-hidden relative">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-white/40 mb-1">{lang === "ua" ? "Ранг" : "Rank"}</div>
            <div className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#0057b7] to-[#ffd700]">
              {stats?.rankName} &bull; LVL {stats?.level || 1}
            </div>
          </div>
          <div className="p-2 bg-white/5 rounded-xl"><Trophy className="w-5 h-5 text-[#ffd700]" /></div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-white/60">{stats?.totalXP || 0} XP</span>
            <span className="text-white/60">{stats?.nextLevelXP || 100} XP</span>
          </div>
          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${xpPercent}%` }} transition={{ duration: 1, ease: "easeOut" }} className="h-full bg-gradient-to-r from-[#0057b7] to-[#ffd700]" />
          </div>
        </div>
      </GlassCard>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Clock, label: lang === "ua" ? "Час" : "Time", value: formatTime(totalMinutesLive) },
          { icon: Landmark, label: lang === "ua" ? "Візитів" : "Visits", value: stats?.visitCount || 0 },
          { icon: ImageIcon, label: lang === "ua" ? "Переглянуто" : "Viewed", value: stats?.artifactsViewed || 0 },
        ].map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.1 }}>
            <GlassCard className="p-3 text-center flex flex-col items-center gap-1.5 h-full">
              <stat.icon className="w-4 h-4 text-[#ffd700]/60" />
              <div className="text-sm font-bold text-white">{stat.value}</div>
              <div className="text-[9px] text-white/40 leading-tight">{stat.label}</div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { icon: Gift, label: lang === "ua" ? "Щоденні нагороди" : "Daily Rewards", tab: "daily" as ProfileTab, color: "#22c55e" },
          { icon: Users, label: lang === "ua" ? "Реферали" : "Referrals", tab: "referral" as ProfileTab, color: "#3b82f6" },
          { icon: Medal, label: lang === "ua" ? "Рейтинг" : "Leaderboard", tab: "leaderboard" as ProfileTab, color: "#ffd700" },
          { icon: Target, label: lang === "ua" ? "Квести" : "Quests", tab: "quests" as ProfileTab, color: "#a855f7" },
        ].map((item, i) => (
          <motion.div key={i} whileTap={{ scale: 0.97 }}>
            <GlassCard onClick={() => setTab(item.tab)} className="p-4 cursor-pointer hover:border-white/20">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl" style={{ background: item.color + "15" }}>
                  <item.icon className="w-5 h-5" style={{ color: item.color }} />
                </div>
                <div className="flex-1">
                  <span className="text-xs font-bold text-white">{item.label}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-white/20" />
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Collection Access */}
      <motion.div whileTap={{ scale: 0.97 }}>
        <GlassCard onClick={() => setTab("collection")} className="p-5 cursor-pointer hover:border-[#ffd700]/20">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#ffd700]/10">
              <Crown className="w-5 h-5 text-[#ffd700]" />
            </div>
            <div className="flex-1">
              <span className="text-sm font-bold text-white">{lang === "ua" ? "Колекції" : "Collections"}</span>
              <p className="text-[10px] text-white/40">{lang === "ua" ? "Завершуйте категорії артефактів" : "Complete artifact categories"}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-white/20" />
          </div>
        </GlassCard>
      </motion.div>

      {/* Extra Features Grid */}
      <div className="grid grid-cols-2 gap-3">
        <motion.div whileTap={{ scale: 0.97 }}>
          <GlassCard onClick={onOpenLuckySpin} className="p-4 cursor-pointer hover:border-purple-500/20">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                <Dices className="w-5 h-5 text-purple-400" />
              </div>
              <div className="flex-1">
                <span className="text-xs font-bold text-white">{lang === "ua" ? "Щасливий спін" : "Lucky Spin"}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-white/20" />
            </div>
          </GlassCard>
        </motion.div>
        <motion.div whileTap={{ scale: 0.97 }}>
          <GlassCard onClick={onOpenGuilds} className="p-4 cursor-pointer hover:border-violet-500/20">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-600/20">
                <Users className="w-5 h-5 text-violet-400" />
              </div>
              <div className="flex-1">
                <span className="text-xs font-bold text-white">{lang === "ua" ? "Гільдії" : "Guilds"}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-white/20" />
            </div>
          </GlassCard>
        </motion.div>
        <motion.div whileTap={{ scale: 0.97 }}>
          <GlassCard onClick={onOpenSeasonPass} className="p-4 cursor-pointer hover:border-amber-500/20">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-gradient-to-br from-amber-500/20 to-yellow-500/20">
                <Crown className="w-5 h-5 text-amber-400" />
              </div>
              <div className="flex-1">
                <span className="text-xs font-bold text-white">{lang === "ua" ? "Сезонпас" : "Season Pass"}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-white/20" />
            </div>
          </GlassCard>
        </motion.div>
        <motion.div whileTap={{ scale: 0.97 }}>
          <GlassCard onClick={onOpenLimitedArtifacts} className="p-4 cursor-pointer hover:border-rose-500/20">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-gradient-to-br from-rose-500/20 to-red-500/20">
                <Clock className="w-5 h-5 text-rose-400" />
              </div>
              <div className="flex-1">
                <span className="text-xs font-bold text-white">{lang === "ua" ? "Лімітки" : "Limited"}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-white/20" />
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Telegram Channel */}
      <motion.div
        whileTap={{ scale: 0.95 }}
        className="flex justify-center"
      >
        <button
          onClick={() => window.open("https://t.me/SITNIK_BLOG", "_blank")}
          className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-gradient-to-r from-[#0057b7]/10 to-[#ffd700]/10 border border-white/10 hover:border-[#0057b7]/50 transition-all group"
        >
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-[#0057b7] flex items-center justify-center group-hover:bg-[#0057b7]/80 transition-colors">
              <Send className="w-6 h-6 text-white" />
            </div>
            <ChevronRight className="absolute -right-1 -bottom-1 w-4 h-4 text-[#ffd700]" />
          </div>
          <span className="text-[10px] font-bold text-white/60 uppercase tracking-wider">
            {lang === "ua" ? "Більше новин та оновлень" : "More news & updates"}
          </span>
        </button>
      </motion.div>

      {/* Total Donated */}
      <GlassCard className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#ffd700]/10 rounded-lg"><Heart className="w-4 h-4 text-[#ffd700]" /></div>
          <div>
            <div className="text-[10px] text-white/40">{lang === "ua" ? "Загальний донат" : "Total Donated"}</div>
            <div className="text-lg font-bold text-white">{stats?.totalDonated || 0} Stars</div>
          </div>
        </div>
        <TrendingUp className="w-4 h-4 text-[#ffd700]/40" />
      </GlassCard>

      {/* Achievements */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">{lang === "ua" ? "Досягнення" : "Achievements"}</h3>
          <span className="text-[10px] text-[#ffd700] font-bold">{stats?.achievements?.length || 0}/{UNIFIED_ACHIEVEMENTS.length}</span>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar">
          {UNIFIED_ACHIEVEMENTS.map((ach) => {
            const unlocked = stats?.achievements?.includes(ach.key);
            const color = RARITY_COLOR[ach.rarity] || "#4ade80";
            return (
              <motion.div key={ach.key} whileTap={{ scale: 0.95 }} className="flex-shrink-0">
                <GlassCard className={`p-3 flex flex-col items-center gap-2 w-28 ${unlocked ? "" : "opacity-40"}`}>
                  <div className="p-2.5 rounded-2xl bg-white/5" style={{ color: unlocked ? color : "#555" }}>
                    <Award className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-semibold text-white/80 text-center">{ach[lang]}</span>
                  {unlocked && <CheckCircle2 className="w-3 h-3 text-green-400" />}
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center space-y-2 pt-4">
        <button onClick={() => setLang(lang === "ua" ? "en" : "ua")} className="text-xs text-white/40 hover:text-white transition-colors">
          {lang === "ua" ? "English" : "Українська"}
        </button>
        <p className="text-[10px] text-white/20">ID: {telegramUser?.id || "guest"}</p>
      </div>
    </div>
  );
}

// ── Daily Rewards Sub-screen ────────────────────────────────────────────────────

function DailyRewardsScreen({ lang, onBack, streak, todayClaim, onClaim }: { lang: "ua" | "en"; onBack: () => void; streak: DailyStreak | null; todayClaim: DailyClaim | null; onClaim: () => void }) {
  const t: { title: string; streak: string; longest: string; claim: string; claimed: string; day: string } = {
    ua: { title: "Щоденні нагороди", streak: "Серія", longest: "Найкраща серія", claim: "Забрати нагороду", claimed: "Отримано сьогодні", day: "День" },
    en: { title: "Daily Rewards", streak: "Streak", longest: "Longest Streak", claim: "Claim Reward", claimed: "Claimed today", day: "Day" },
  }[lang as "ua" | "en"];

  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-white">{t.title}</h1>
      </div>

      {/* Streak info */}
      <GlassCard className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-[10px] text-white/40 uppercase tracking-wider">{t.streak}</div>
            <div className="text-2xl font-bold text-[#ffd700] flex items-center gap-2">
              <Flame className="w-6 h-6" />
              {streak?.current_streak || 0}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-white/40 uppercase tracking-wider">{t.longest}</div>
            <div className="text-lg font-bold text-white/60">{streak?.longest_streak || 0}</div>
          </div>
        </div>
      </GlassCard>

      {/* Daily rewards timeline */}
      <div className="space-y-3">
        {DAILY_REWARDS.map((reward) => {
          const isCurrentOrPast = (streak?.current_streak || 0) >= reward.day;
          return (
            <GlassCard key={reward.day} className={`p-4 ${isCurrentOrPast ? "border-[#ffd700]/20" : "opacity-50"}`}>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black ${isCurrentOrPast ? "bg-[#ffd700]/20 text-[#ffd700]" : "bg-white/5 text-white/30"}`}>
                  {reward.day}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold text-white">{t.day} {reward.day}</div>
                  <div className="text-xs text-white/40">{reward.label[lang as "ua" | "en"]}</div>
                </div>
                {isCurrentOrPast && <CheckCircle2 className="w-5 h-5 text-green-400" />}
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Claim button */}
      <button
        onClick={onClaim}
        disabled={!!todayClaim}
        className={`w-full py-4 rounded-2xl font-bold text-sm active:scale-95 transition-all ${
          todayClaim
            ? "bg-white/5 text-white/30 border border-white/10"
            : "bg-gradient-to-r from-[#0057b7] to-[#ffd700] text-white shadow-lg"
        }`}
      >
        {todayClaim ? t.claimed : t.claim}
      </button>
    </div>
  );
}

// ── Referral Sub-screen ─────────────────────────────────────────────────────────

function ReferralScreen({ lang, onBack, stats, dbUser }: { lang: "ua" | "en"; onBack: () => void; stats: ReferralStats | null; dbUser: DbUser | null }) {
  const t: { title: string; invited: string; link: string; copy: string; copied: string; nextReward: string; milestones: string; rewards: string } = {
    ua: { title: "Реферали", invited: "Запрошено", link: "Ваше реферальне посилання", copy: "Копіювати", copied: "Скопійовано!", nextReward: "Наступна нагорода", milestones: "Етапи", rewards: "Отримані нагороди" },
    en: { title: "Referrals", invited: "Invited", link: "Your referral link", copy: "Copy", copied: "Copied!", nextReward: "Next Reward", milestones: "Milestones", rewards: "Received Rewards" },
  }[lang as "ua" | "en"];

  const [copied, setCopied] = useState(false);
  // Main Mini App referral link format (works when bot has menu button mini app configured in BotFather)
  const referralLink = dbUser ? `https://t.me/test_museum_2026_bot?startapp=ref_${dbUser.telegram_id}` : "";

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-white">{t.title}</h1>
      </div>

      {/* Invite count */}
      <GlassCard className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] text-white/40 uppercase tracking-wider">{t.invited}</div>
            <div className="text-3xl font-bold text-[#ffd700]">{stats?.invitedCount || 0}</div>
          </div>
          <div className="p-3 rounded-2xl bg-[#ffd700]/10">
            <Users className="w-6 h-6 text-[#ffd700]" />
          </div>
        </div>
      </GlassCard>

      {/* Referral link */}
      <GlassCard className="p-4">
        <div className="text-[10px] text-white/40 uppercase tracking-wider mb-2">{t.link}</div>
        <div className="flex gap-2">
          <div className="flex-1 px-3 py-2 bg-white/5 rounded-xl text-xs text-white/60 font-mono truncate">
            {referralLink}
          </div>
          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-[#ffd700] text-[#0a0a0f] rounded-xl font-bold text-xs active:scale-95 transition-all"
          >
            {copied ? t.copied : t.copy}
          </button>
        </div>
      </GlassCard>

      {/* Milestones */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-white/50 uppercase tracking-wider">{t.milestones}</h3>
        {REFERRAL_MILESTONES.map((ms) => {
          const achieved = (stats?.invitedCount || 0) >= ms.count;
          const rewardClaimed = stats?.rewards?.some((r: { milestone: number }) => r.milestone === ms.count);
          return (
            <GlassCard key={ms.count} className={`p-4 ${achieved ? "border-[#ffd700]/20" : "opacity-60"}`}>
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm ${achieved ? "bg-[#ffd700]/20 text-[#ffd700]" : "bg-white/5 text-white/30"}`}>
                  {ms.count}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold text-white">{ms.label[lang as "ua" | "en"]}</div>
                  <div className="text-[10px] text-white/40">{ms.count} {lang === "ua" ? "друзів" : "friends"}</div>
                </div>
                {achieved && (rewardClaimed ? <CheckCircle2 className="w-5 h-5 text-green-400" /> : <Gift className="w-5 h-5 text-[#ffd700]" />)}
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}

// ── Leaderboard Sub-screen ──────────────────────────────────────────────────────

function LeaderboardScreen({ lang, onBack, entries, dbUser }: { lang: "ua" | "en"; onBack: () => void; entries: LeaderboardEntry[]; dbUser: DbUser | null }) {
  const t: { title: string; rank: string; xp: string; artifacts: string; you: string } = {
    ua: { title: "Рейтинг", rank: "Місце", xp: "XP", artifacts: "Артефактів", you: "Ви" },
    en: { title: "Leaderboard", rank: "Rank", xp: "XP", artifacts: "Artifacts", you: "You" },
  }[lang as "ua" | "en"];

  const rankColors = ["#ffd700", "#c0c0c0", "#cd7f32"];

  return (
    <div className="space-y-4 pb-24">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-white">{t.title}</h1>
      </div>

      {/* Top 3 podium */}
      {entries.length >= 3 && (
        <div className="flex items-end justify-center gap-4 py-4">
          {[1, 0, 2].map((idx) => {
            const e = entries[idx];
            if (!e) return null;
            const isTop = idx === 0;
            const height = isTop ? "h-32" : "h-24";
            const color = rankColors[isTop ? 0 : idx === 1 ? 1 : 2];
            return (
              <motion.div
                key={e.user_id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="flex flex-col items-center gap-2"
              >
                <span className="text-xs font-bold" style={{ color }}>{e.first_name}</span>
                <div
                  className={`w-20 ${height} rounded-2xl flex flex-col items-center justify-end p-3 border`}
                  style={{ background: color + "15", borderColor: color + "30" }}
                >
                  <span className="text-2xl font-black" style={{ color }}>#{e.rank}</span>
                  <span className="text-[10px] text-white/50 mt-1">{e.total_xp} XP</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Full list */}
      <div className="space-y-2">
        {entries.map((e: LeaderboardEntry) => {
          const isMe = dbUser && e.user_id === dbUser.id;
          return (
            <GlassCard key={e.user_id} className={`p-3 ${isMe ? "border-[#ffd700]/30" : ""}`}>
              <div className="flex items-center gap-3">
                <span
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black"
                  style={{
                    color: e.rank <= 3 ? rankColors[e.rank - 1] : "white/40",
                    background: e.rank <= 3 ? rankColors[e.rank - 1] + "15" : "white/5",
                  }}
                >
                  {e.rank}
                </span>
                <div className="flex-1">
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    {e.first_name}
                    {isMe && <span className="text-[9px] text-[#ffd700] font-bold">({t.you})</span>}
                  </div>
                  <div className="text-[10px] text-white/40">{e.artifacts_viewed} {t.artifacts}</div>
                </div>
                <div className="text-sm font-bold text-[#ffd700]">{e.total_xp} XP</div>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}

// ── Quests Sub-screen ────────────────────────────────────────────────────────────

function QuestsScreen({ lang, onBack, quests, progress, dailyQuests, dailyProgress, onClaimWeekly, onClaimDaily }: {
  lang: "ua" | "en";
  onBack: () => void;
  quests: WeeklyQuest[];
  progress: QuestProgress[];
  dailyQuests: DailyQuest[];
  dailyProgress: DailyQuestProgress[];
  onClaimWeekly: (questId: string) => void;
  onClaimDaily: (questId: number) => void;
}) {
  const t: { weeklyTitle: string; dailyTitle: string; progress: string; claim: string; claimed: string; reward: string } = {
    ua: { weeklyTitle: "Тижневі квести", dailyTitle: "Щоденні квести", progress: "Прогрес", claim: "Забрати", claimed: "Отримано", reward: "Нагорода" },
    en: { weeklyTitle: "Weekly Quests", dailyTitle: "Daily Quests", progress: "Progress", claim: "Claim", claimed: "Claimed", reward: "Reward" },
  }[lang as "ua" | "en"];

  const getQuestProgress = (questId: string) => progress.find((p: QuestProgress) => p.quest_id === questId);
  const getDailyProgress = (questId: number) => dailyProgress.find((p: DailyQuestProgress) => p.daily_quest_id === questId);

  const renderQuest = (id: string | number, title: string, currentCount: number, targetCount: number, rewardXP: number, completed: boolean, claimed: boolean, onClaim: () => void, accentColor: string) => {
    const percent = Math.min(100, (currentCount / targetCount) * 100);
    return (
      <GlassCard key={id} className={`p-4 ${completed ? "border-green-500/20" : ""}`}>
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-2xl ${completed ? "bg-green-500/20" : "bg-white/5"}`}>
            <Target className={`w-5 h-5 ${completed ? "text-green-400" : "text-white/40"}`} />
          </div>
          <div className="flex-1 space-y-2">
            <h3 className="text-sm font-bold text-white">{title}</h3>
            <div className="flex items-center gap-2 text-[10px] text-white/40">
              <span>{t.progress}: {currentCount}/{targetCount}</span>
              <span>&bull;</span>
              <span>{t.reward}: +{rewardXP} XP</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percent}%` }}
                className={`h-full bg-gradient-to-r ${accentColor}`}
              />
            </div>
            {completed && !claimed && (
              <button onClick={onClaim} className="mt-1 text-[10px] font-bold text-[#ffd700] uppercase tracking-widest">
                {t.claim} +{rewardXP} XP
              </button>
            )}
            {claimed && (
              <div className="mt-1 flex items-center gap-1 text-green-400">
                <CheckCircle2 className="w-3 h-3" />
                <span className="text-[10px] font-bold">{t.claimed}</span>
              </div>
            )}
          </div>
        </div>
      </GlassCard>
    );
  };

  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-white">{lang === "ua" ? "Квести" : "Quests"}</h1>
      </div>

      {/* Daily Quests */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-cyan-400 uppercase tracking-wider">{t.dailyTitle}</h2>
        {dailyQuests.map((dq: DailyQuest) => {
          const dp = getDailyProgress(dq.id);
          return renderQuest(
            dq.id, lang === "ua" ? dq.title_ua : dq.title_en,
            dp?.current_count || 0, dq.target_count, dq.reward_xp,
            dp?.completed || false, dp?.claimed || false,
            () => onClaimDaily(dq.id),
            "from-cyan-500 to-blue-500"
          );
        })}
      </div>

      {/* Weekly Quests */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-[#ffd700] uppercase tracking-wider">{t.weeklyTitle}</h2>
        {quests.map((quest: WeeklyQuest) => {
          const qp = getQuestProgress(quest.id);
          return renderQuest(
            quest.id, lang === "ua" ? quest.title_ua : quest.title_en,
            qp?.current_count || 0, quest.target_count, quest.reward_xp,
            qp?.completed || false, qp?.claimed || false,
            () => onClaimWeekly(quest.id),
            "from-[#0057b7] to-[#ffd700]"
          );
        })}
      </div>
    </div>
  );
}

// ── Collection Sub-screen ───────────────────────────────────────────────────────

function CollectionScreen({ lang, onBack, progress, onClaim }: { lang: "ua" | "en"; onBack: () => void; progress: MuseumProgress[]; onClaim: (category: ArtifactCategory) => void }) {
  const t: { title: string; artifacts: string; complete: string; claimReward: string; claimed: string; incomplete: string } = {
    ua: { title: "Колекції", artifacts: "Артефактів", complete: "Завершено!", claimReward: "Забрати нагороду", claimed: "Отримано", incomplete: "Не завершено" },
    en: { title: "Collections", artifacts: "Artifacts", complete: "Complete!", claimReward: "Claim Reward", claimed: "Claimed", incomplete: "Incomplete" },
  }[lang as "ua" | "en"];

  const categories: ArtifactCategory[] = ["kyivan_rus", "cossack_era", "unr", "modern_ukraine"];

  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-white">{t.title}</h1>
      </div>

      <div className="space-y-4">
        {categories.map((cat) => {
          const meta = CATEGORY_META[cat];
          const p = progress.find((pr: MuseumProgress) => pr.category === cat);
          const viewed = p?.artifacts_viewed || 0;
          const total = 14;
          const completed = p?.collection_completed || false;
          const percent = Math.round((viewed / total) * 100);

          return (
            <GlassCard key={cat} className={`p-5 ${completed ? "border-[#ffd700]/30" : ""}`}>
              <div className="flex items-center gap-4 mb-3">
                <span className="text-3xl">{meta.icon}</span>
                <div className="flex-1">
                  <h3 className="text-base font-bold text-white">{meta[lang === "ua" ? "ua" : "en"]}</h3>
                  <p className="text-[10px] text-white/40">{viewed}/{total} {t.artifacts}</p>
                </div>
                <div className="text-lg font-bold" style={{ color: completed ? "#22c55e" : meta.color }}>{percent}%</div>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden mb-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percent}%` }}
                  className="h-full rounded-full"
                  style={{ background: meta.color }}
                />
              </div>
              {completed ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-xs font-bold">{t.complete}</span>
                  </div>
                  <button
                    onClick={() => onClaim(cat)}
                    className="text-[10px] font-bold text-[#ffd700] uppercase tracking-widest"
                  >
                    {t.claimReward} +500 XP
                  </button>
                </div>
              ) : (
                <p className="text-[10px] text-white/30">{t.incomplete}</p>
              )}
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}

