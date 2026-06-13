import { useState, useEffect, useCallback, useRef } from "react";
import { initTelegram, getTelegramUser, getStartParam, triggerHapticFeedback, triggerHapticNotification } from "./lib/telegram";
import { museumAPI, TAP_LEVELS, MAX_TAP_LEVEL, AUTOCLICKER_OPTIONS, TAP_ARTIFACTS } from "./lib/api";
import type { UserStats, TapGameState, TapArtifact, AutoclikerOption, DailyStreak, DailyClaim, GuildWithMembers, Season, UserSeasonProgress, SeasonTierClaim } from "./lib/api";
import { TIMELINE_EVENT_DETAILS } from "./lib/timeline-data";
import type { TimelineEventDetail } from "./lib/timeline-data";
import { motion, AnimatePresence } from "motion/react";
import {
  Home as HomeIcon,
  Landmark,
  User,
  Heart,
  ChevronRight,
  X,
  Share2,
  Bookmark,
  Play,
  ChevronLeft,
  Shield,
  Crown,
  Sword,
  Building2,
  Sparkles,
  Star,
  Zap,
  Palette,
  TrendingUp,
  CheckCircle2,
  Loader2,
  MousePointerClick,
  ArrowUpCircle,
  Timer,
  ShoppingBag,
  BookOpen,
  Send,
  Dices,
  Gift,
  Trophy,
  Users,
  Clock,
  Award,
} from "lucide-react";
import { MuseumScreen as NewMuseumScreen } from "./screens/MuseumScreen";
import { ProfileScreen as NewProfileScreen } from "./screens/ProfileScreen";
import { ParticleSystem, createTapParticles, createConfettiExplosion } from "./components/Particles";
import { LuckySpin } from "./components/LuckySpin";
import { DailyRewards } from "./components/DailyRewards";
import { AchievementsModal, ACHIEVEMENTS_LIST } from "./components/Achievements";
import { Leaderboard } from "./components/Leaderboard";
import { Guilds } from "./components/Guilds";
import { LimitedArtifactsModal } from "./components/LimitedArtifacts";
import { SeasonPass } from "./components/SeasonPass";
import { soundManager, initSounds } from "./lib/sounds";
import type { Particle } from "./components/Particles";

// ─── Types ─────────────────────────────────────────────────────────────────────

type Screen = "home" | "tap" | "museum" | "timeline" | "profile" | "support";
type Lang = "ua" | "en";

interface Artifact {
  id: string;
  title: { ua: string; en: string };
  era: string;
  year: string;
  description: { ua: string; en: string };
  image: string;
  category: string;
}

interface TelegramUserData {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  photo_url?: string;
}

interface DbUser {
  id: number;
  telegram_id: number;
  username: string | null;
  first_name: string;
  last_name: string | null;
  photo_url: string | null;
  total_xp: number;
}

// ─── Data ──────────────────────────────────────────────────────────────────────

const ARTIFACTS: Artifact[] = [
  {
    id: "sophia",
    title: { ua: "Собор Святої Софії", en: "Saint Sophia Cathedral" },
    era: "Київська Русь",
    year: "1037",
    description: {
      ua: "Архітектурний шедевр Київської Русі, збудований за часів Ярослава Мудрого. Собор є одним із найважливіших символів української культури та історії.",
      en: "Architectural masterpiece of Kyivan Rus, built during the reign of Yaroslav the Wise. The cathedral is one of the most important symbols of Ukrainian culture and history.",
    },
    image: "https://images.pexels.com/photos/1678808/pexels-photo-1678808.jpeg?auto=compress&cs=tinysrgb&w=600",
    category: "Архітектура",
  },
  {
    id: "vyshyvanka",
    title: { ua: "Вишиванка", en: "Vyshyvanka" },
    era: "Традиції",
    year: "XVII ст.",
    description: {
      ua: "Національний символ України - вишита сорочка з унікальними орнаментами. Кожен регіон має власні візерунки та символіку.",
      en: "National symbol of Ukraine - embroidered shirt with unique ornaments. Each region has its own patterns and symbolism.",
    },
    image: "https://images.pexels.com/photos/3621188/pexels-photo-3621188.jpeg?auto=compress&cs=tinysrgb&w=600",
    category: "Культура",
  },
  {
    id: "pysanka",
    title: { ua: "Писанка", en: "Pysanka" },
    era: "Народне мистецтво",
    year: "X ст.",
    description: {
      ua: "Давнє українське мистецтво розпису великодніх яєць символічними орнаментами. Кожен символ несе глибоке духовне значення.",
      en: "Ancient Ukrainian art of painting Easter eggs with symbolic ornaments. Each symbol carries deep spiritual meaning.",
    },
    image: "https://images.pexels.com/photos/3817526/pexels-photo-3817526.jpeg?auto=compress&cs=tinysrgb&w=600",
    category: "Мистецтво",
  },
  {
    id: "cossack",
    title: { ua: "Запорозька Січ", en: "Zaporizhian Sich" },
    era: "Козацька доба",
    year: "1552",
    description: {
      ua: "Фортеця козацької демократії та символ української свободи. Тут народжувалася перша демократична республіка в Європі.",
      en: "Fortress of Cossack democracy and symbol of Ukrainian freedom. The first democratic republic in Europe was born here.",
    },
    image: "https://images.pexels.com/photos/6045028/pexels-photo-6045028.jpeg?auto=compress&cs=tinysrgb&w=600",
    category: "Історія",
  },
  {
    id: "bandura",
    title: { ua: "Бандура", en: "Bandura" },
    era: "Музична спадщина",
    year: "XVI ст.",
    description: {
      ua: "Національний український музичний інструмент з 60+ струнами. Кобзарі співали епічні думи про героїв та історію народу.",
      en: "National Ukrainian musical instrument with 60+ strings. Kobzars sang epic ballads about heroes and the history of the people.",
    },
    image: "https://images.pexels.com/photos/164769/pexels-photo-164769.jpeg?auto=compress&cs=tinysrgb&w=600",
    category: "Музика",
  },
  {
    id: "kyiv",
    title: { ua: "Київ", en: "Kyiv" },
    era: "Сучасність",
    year: "2024",
    description: {
      ua: "Столиця України - місто з тисячолітньою історією та сучасною культурою. Центр технологій, мистецтва та інновацій.",
      en: "Capital of Ukraine - city with thousand-year history and modern culture. Center of technology, art and innovation.",
    },
    image: "https://images.pexels.com/photos/1840421/pexels-photo-1840421.jpeg?auto=compress&cs=tinysrgb&w=600",
    category: "Місто",
  },
  {
    id: "lavra",
    title: { ua: "Києво-Печерська Лавра", en: "Kyiv Pechersk Lavra" },
    era: "Київська Русь",
    year: "1051",
    description: {
      ua: "Монастир у печерах, заснований у 1051 р. Одне з найсвятіших місць Східного Православ'я з унікальними підземними лабіринтами.",
      en: "Cave monastery founded in 1051. One of the holiest sites of Eastern Orthodoxy with unique underground labyrinths.",
    },
    image: "https://images.pexels.com/photos/1624959/pexels-photo-1624959.jpeg?auto=compress&cs=tinysrgb&w=600",
    category: "Архітектура",
  },
  {
    id: "petrykivka",
    title: { ua: "Петриківський Розпис", en: "Petrykivka Painting" },
    era: "Народне мистецтво",
    year: "XVIII ст.",
    description: {
      ua: "Традиція квіткового народного розпису, внесена ЮНЕСКО до списку нематеріальної спадщини. Яскраві квіти та птахи символізують життя.",
      en: "Floral folk painting tradition inscribed on UNESCO's intangible heritage list. Vivid flowers and birds symbolize life.",
    },
    image: "https://images.pexels.com/photos/3266700/pexels-photo-3266700.jpeg?auto=compress&cs=tinysrgb&w=600",
    category: "Мистецтво",
  },
];

const TEXT: Record<Lang, Record<string, unknown>> = {
  ua: {
    home: { title: "Віртуальний Музей України", subtitle: "Подорож крізь тисячоліття історії", featured: "Рекомендовані", explore: "Досліджуйте", artifacts: "артефактів", viewAll: "Дивитись всі" },
    tap: { title: "Тапалка", perClick: "XP за клік", totalTaps: "Всього тапів", level: "Рівень", upgrade: "Покращити", upgradeCost: "Вартість", maxLevel: `Макс рівень ${MAX_TAP_LEVEL}!`, autoclicker: "Автоклікер", autoclickerActive: "Автоклікер!", autoclickerTimeLeft: "Залишилось", autoclickerBuy: "Купити автоклікер", autoclickerExtends: "Час додається до поточного", notEnoughXP: "Недостатньо XP", noTable: "Таблиця tap_game_state не знайдена.", shop: "Прокачка", shopDesc: "Бонуси від усіх куплених артефактів складаються", buyXP: "Купити за XP", buyStars: "Купити за Stars", owned: "Куплено", equip: "Образ", equipped: "Образ", artifactBonus: "бонус" },
    museum: { title: "Колекція", search: "Пошук артефактів...", all: "Всі" },
    timeline: { title: "Хронологія", subtitle: "Ключові події української історії" },
    profile: { title: "Профіль", rank: "Ранг", timeSpent: "Час у музеї", totalVisits: "Візитів", viewedArtifacts: "Переглянуто", achievements: "Досягнення", donations: "Донати", nextRank: "Наступний ранг" },
    support: { title: "Підтримка", selectAmount: "Оберіть суму", customAmount: "Інша сума", payStars: "Оплатити Stars", thankYou: "Дякуємо за підтримку!", supportMessage: "Ваш внесок допомагає зберігати історію України.", totalRaised: "Зібрано разом", donorsCount: "Доброчинців", totalUsers: "Учасників боту", version: "Версія 1.0.0", paymentError: "Платіж не вдався. Спробуйте ще раз." },
    nav: { home: "Головна", tap: "Тап", museum: "Музей", timeline: "Час", profile: "Профіль", support: "Підтримка" },
  },
  en: {
    home: { title: "Virtual Museum of Ukraine", subtitle: "Journey through millennia of history", featured: "Featured", explore: "Explore", artifacts: "artifacts", viewAll: "View all" },
    tap: { title: "Tap Game", perClick: "XP per click", totalTaps: "Total taps", level: "Level", upgrade: "Upgrade", upgradeCost: "Cost", maxLevel: `Max Level ${MAX_TAP_LEVEL}!`, autoclicker: "Autoclicker", autoclickerActive: "Autoclicker!", autoclickerTimeLeft: "Time left", autoclickerBuy: "Buy autoclicker", autoclickerExtends: "Time adds to current", notEnoughXP: "Not enough XP", noTable: "tap_game_state table not found.", shop: "Upgrade Shop", shopDesc: "All purchased artifact bonuses stack", buyXP: "Buy for XP", buyStars: "Buy for Stars", owned: "Owned", equip: "Set Look", equipped: "Look", artifactBonus: "bonus" },
    museum: { title: "Collection", search: "Search artifacts...", all: "All" },
    timeline: { title: "Timeline", subtitle: "Key events in Ukrainian history" },
    profile: { title: "Profile", rank: "Rank", timeSpent: "Time in Museum", totalVisits: "Visits", viewedArtifacts: "Artifacts Viewed", achievements: "Achievements", donations: "Donations", nextRank: "Next Rank" },
    support: { title: "Support", selectAmount: "Select Amount", customAmount: "Custom Amount", payStars: "Pay with Stars", thankYou: "Thank you for support!", supportMessage: "Your contribution helps preserve Ukraine's history.", totalRaised: "Total Raised", donorsCount: "Donors", totalUsers: "Bot Members", version: "Version 1.0.0", paymentError: "Payment failed. Please try again." },
    nav: { home: "Home", tap: "Tap", museum: "Museum", timeline: "Timeline", profile: "Profile", support: "Support" },
  },
};

// ─── Components ────────────────────────────────────────────────────────────────

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

function GlassCard({ children, className = "", onClick, hover = true }: GlassCardProps) {
  return (
    <motion.div
      whileHover={onClick && hover ? { y: -4, scale: 1.02 } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      onClick={onClick}
      className={`relative overflow-hidden bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[24px] shadow-2xl ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent pointer-events-none" />
      {children}
    </motion.div>
  );
}

function ArtifactCard({ artifact, lang, onClick }: { artifact: Artifact; lang: Lang; onClick: () => void }) {
  return (
    <GlassCard onClick={onClick} className="h-full group">
      <div className="relative aspect-[4/5] overflow-hidden">
        <motion.img initial={{ scale: 1 }} whileHover={{ scale: 1.1 }} transition={{ duration: 0.6 }} src={artifact.image} alt={artifact.title[lang]} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/20 to-transparent opacity-90" />
        <div className="absolute top-3 right-3">
          <div className="px-2.5 py-1 bg-black/40 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-bold text-white/90 tracking-wider">{artifact.year}</div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ffd700]" />
              <span className="text-[10px] text-[#ffd700] font-bold uppercase tracking-widest opacity-80">{artifact.category}</span>
            </div>
            <h3 className="text-white font-bold text-base leading-tight group-hover:text-[#ffd700] transition-colors">{artifact.title[lang]}</h3>
            <p className="text-white/40 text-[10px] font-medium tracking-wide truncate">{artifact.era}</p>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

// ─── Screens ───────────────────────────────────────────────────────────────────

function HomeScreen({ lang, setSelectedArtifact, setScreen, stats, dbUser }: { lang: Lang; setSelectedArtifact: (a: Artifact) => void; setScreen: (s: Screen) => void; stats: UserStats | null; dbUser: DbUser | null }) {
  const t = TEXT[lang].home;

  const historicalEras = [
    { id: "kyivan-rus", title: { ua: "Київська Русь", en: "Kyivan Rus" }, period: "882-1240", icon: Crown, image: "https://images.pexels.com/photos/1678808/pexels-photo-1678808.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { id: "cossack", title: { ua: "Козацька Доба", en: "Cossack Era" }, period: "1648-1775", icon: Sword, image: "https://images.pexels.com/photos/6045028/pexels-photo-6045028.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { id: "modern", title: { ua: "Сучасна Україна", en: "Modern Ukraine" }, period: "1991-Present", icon: Building2, image: "https://images.pexels.com/photos/1840421/pexels-photo-1840421.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { id: "future", title: { ua: "Майбутнє", en: "Future Vision" }, period: "2050+", icon: Sparkles, image: "https://images.pexels.com/photos/355748/pexels-photo-355748.jpeg?auto=compress&cs=tinysrgb&w=400" },
  ];

  const featuredCollections = [
    { title: { ua: "Мистецтво", en: "Art" }, count: "45", icon: Palette, color: "#ffd700" },
    { title: { ua: "Архітектура", en: "Architecture" }, count: "32", icon: Building2, color: "#0057b7" },
    { title: { ua: "Культура", en: "Culture" }, count: "58", icon: Star, color: "#ffd700" },
    { title: { ua: "Історія", en: "History" }, count: "67", icon: Shield, color: "#0057b7" },
  ];

  return (
    <div className="space-y-10 pb-32">
      {/* Cinematic Hero */}
      <div className="relative h-[520px] -mx-4 -mt-4 overflow-hidden">
        <motion.img initial={{ scale: 1.2 }} animate={{ scale: 1 }} transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }} src="https://images.pexels.com/photos/1678808/pexels-photo-1678808.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Museum hero" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/40 to-transparent" />

        <div className="absolute top-10 left-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2.5 px-4 py-2 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-full shadow-2xl">
            <div className="w-6 h-4 rounded-[3px] overflow-hidden flex flex-col border border-white/20">
              <div className="flex-1 bg-[#0057b7]" />
              <div className="flex-1 bg-[#ffd700]" />
            </div>
            <span className="text-[10px] text-white/80 font-black uppercase tracking-[0.25em]">Ukraine Museum</span>
          </motion.div>
        </div>

        <div className="absolute inset-0 flex flex-col justify-end p-8 pb-12">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }} className="space-y-5">
            <h1 className="text-6xl font-black text-white leading-[0.85] tracking-tighter">
              {lang === "ua" ? "УКРАЇНА" : "UKRAINE"}<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffd700] via-white to-[#0057b7]">{lang === "ua" ? "КРІЗЬ ЧАС" : "THROUGH TIME"}</span>
            </h1>
            <p className="text-lg text-white/70 max-w-[320px] leading-relaxed font-medium tracking-tight">{t.subtitle}</p>
            <div className="flex items-center gap-4 pt-6">
              <motion.button whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(255, 215, 0, 0.3)" }} whileTap={{ scale: 0.95 }} onClick={() => setScreen("museum")} className="px-10 py-5 bg-gradient-to-r from-[#ffd700] to-[#ffd700]/80 text-[#0a0a0f] rounded-full font-black text-sm uppercase tracking-widest shadow-2xl">
                {t.explore}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-2">
        <div className="grid grid-cols-4 gap-3">
          {[{ value: "3K+", label: lang === "ua" ? "Років" : "Years" }, { value: "150+", label: lang === "ua" ? "Предметів" : "Items" }, { value: "12", label: lang === "ua" ? "Епох" : "Eras" }, { value: "50K", label: lang === "ua" ? "Візитів" : "Views" }].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.1 }}>
              <GlassCard className="py-5 text-center group" hover={false}>
                <div className="text-xl font-black text-white mb-1 tracking-tighter group-hover:text-[#ffd700] transition-colors">{stat.value}</div>
                <div className="text-[9px] text-white/40 font-black uppercase tracking-widest">{stat.label}</div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>

      {/* What To Do Next */}
      {stats && dbUser && (() => {
        const nextAction = (() => {
          if (stats.artifactsViewed < 3) return { icon: Landmark, label: lang === "ua" ? "Переглянь артефакти" : "View artifacts", screen: "museum" as Screen, color: "#ffd700" };
          if (stats.totalXP < stats.nextLevelXP) return { icon: MousePointerClick, label: lang === "ua" ? `Набери ${stats.nextLevelXP - stats.totalXP} XP до наступного рангу` : `Earn ${stats.nextLevelXP - stats.totalXP} XP for next rank`, screen: "tap" as Screen, color: "#0057b7" };
          return { icon: Sparkles, label: lang === "ua" ? "Обери наступну ціль!" : "Choose your next goal!", screen: "tap" as Screen, color: "#ffd700" };
        })();
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <GlassCard onClick={() => setScreen(nextAction.screen)} className="p-4 flex items-center gap-4 cursor-pointer group">
              <div className="p-3 rounded-2xl" style={{ backgroundColor: `${nextAction.color}15`, border: `1px solid ${nextAction.color}30` }}>
                <nextAction.icon className="w-5 h-5" style={{ color: nextAction.color }} />
              </div>
              <div className="flex-1">
                <div className="text-[10px] text-white/40 font-bold uppercase tracking-wider">{lang === "ua" ? "Наступна мета" : "Next Goal"}</div>
                <div className="text-sm text-white font-bold">{nextAction.label}</div>
              </div>
              <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-white/60 transition-colors" />
            </GlassCard>
          </motion.div>
        );
      })()}

      {/* Museum Progress */}
      {stats && stats.artifactsViewed > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <GlassCard onClick={() => setScreen("museum")} className="p-4 cursor-pointer group">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Landmark className="w-4 h-4 text-[#ffd700]" />
                <span className="text-xs font-bold text-white">{lang === "ua" ? "Прогрес музею" : "Museum Progress"}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/60 transition-colors" />
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <div className="flex justify-between text-[10px] text-white/50 mb-1">
                  <span>{stats.artifactsViewed}/56 {lang === "ua" ? "артефактів" : "artifacts"}</span>
                  <span>{Math.round(stats.artifactsViewed / 56 * 100)}%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(stats.artifactsViewed / 56) * 100}%` }}
                    className="h-full bg-gradient-to-r from-[#0057b7] to-[#ffd700] rounded-full"
                  />
                </div>
              </div>
              <div className="text-center px-2">
                <div className="text-lg font-black text-[#ffd700]">{stats.level}</div>
                <div className="text-[9px] text-white/40">{lang === "ua" ? "Ранг" : "Rank"}</div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* Eras */}
      <div className="space-y-8">
        <div className="flex items-end justify-between px-3">
          <div className="space-y-1">
            <h2 className="text-[10px] font-black text-[#ffd700] uppercase tracking-[0.4em]">The Journey</h2>
            <h3 className="text-3xl font-black text-white tracking-tighter">Timeline Eras</h3>
          </div>
          <motion.button whileHover={{ x: 5 }} onClick={() => setScreen("timeline")} className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] flex items-center gap-2">
            VIEW ALL <ChevronRight className="w-3 h-3" />
          </motion.button>
        </div>
        <div className="flex gap-5 overflow-x-auto pb-8 no-scrollbar -mx-4 px-6">
          {historicalEras.map((era, i) => (
            <motion.div key={era.id} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.1 }} className="flex-shrink-0 w-[280px]">
              <GlassCard onClick={() => setScreen("timeline")} className="group cursor-pointer overflow-hidden p-0 border-white/5 h-[400px]">
                <div className="relative h-full">
                  <img src={era.image} alt={era.title[lang]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s] ease-out" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/40 to-transparent" />
                  <div className="absolute top-6 left-6 p-3 bg-white/10 backdrop-blur-2xl rounded-[20px] border border-white/20 shadow-2xl"><era.icon className="w-6 h-6 text-white" /></div>
                  <div className="absolute bottom-8 left-8 right-8">
                    <div className="text-[10px] font-black text-[#ffd700] uppercase tracking-[0.3em] mb-2">{era.period}</div>
                    <h4 className="text-2xl font-black text-white mb-3 tracking-tight leading-none group-hover:translate-x-2 transition-transform duration-500">{era.title[lang]}</h4>
                    <div className="h-1 w-12 bg-white/20 rounded-full group-hover:w-full group-hover:bg-gradient-to-r group-hover:from-[#ffd700] group-hover:to-transparent transition-all duration-700" />
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Collections */}
      <div className="space-y-8 px-2">
        <h3 className="text-3xl font-black text-white tracking-tighter px-1">Collections</h3>
        <div className="grid grid-cols-2 gap-5">
          {featuredCollections.map((col, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 + i * 0.1 }}>
              <GlassCard onClick={() => setScreen("museum")} className="p-6 group">
                <div className="flex flex-col gap-5">
                  <div className="w-14 h-14 rounded-[22px] flex items-center justify-center transition-all group-hover:scale-110 group-hover:rotate-6 duration-500 shadow-2xl" style={{ backgroundColor: `${col.color}15`, border: `1px solid ${col.color}30` }}>
                    <col.icon className="w-7 h-7" style={{ color: col.color }} />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-white mb-1 tracking-tight">{col.title[lang]}</h4>
                    <p className="text-[10px] text-white/30 font-black uppercase tracking-widest">{col.count} {t.artifacts}</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Telegram Channel */}
      <div className="px-2 flex justify-center">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => window.open("https://t.me/SITNIK_BLOG", "_blank")}
          className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-gradient-to-r from-[#0057b7]/10 to-[#ffd700]/10 border border-white/10 hover:border-[#0057b7]/50 transition-all group"
        >
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-[#0057b7] flex items-center justify-center group-hover:bg-[#0057b7]/80 transition-colors">
              <Send className="w-7 h-7 text-white" />
            </div>
            <ChevronRight className="absolute -right-1 -bottom-1 w-5 h-5 text-[#ffd700]" />
          </div>
          <span className="text-[10px] font-bold text-white/60 uppercase tracking-wider">
            {lang === "ua" ? "Більше новин та оновлень" : "More news & updates"}
          </span>
        </motion.button>
      </div>

      {/* Featured Artifacts */}
      <div className="space-y-8">
        <div className="flex items-center justify-between px-3">
          <h3 className="text-3xl font-black text-white tracking-tighter">{t.featured}</h3>
          <motion.button whileHover={{ x: 5 }} onClick={() => setScreen("museum")} className="text-[10px] font-black text-[#ffd700] uppercase tracking-[0.2em] flex items-center gap-2">
            EXPLORE ALL <ChevronRight className="w-3 h-3" />
          </motion.button>
        </div>
        <div className="grid grid-cols-2 gap-5 px-2">
          {ARTIFACTS.slice(0, 4).map((art, i) => (
            <motion.div key={art.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 + i * 0.1 }}>
              <ArtifactCard artifact={art} lang={lang} onClick={() => setSelectedArtifact(art)} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TimelineScreen({ lang }: { lang: Lang }) {
  const t = TEXT[lang].timeline;
  const [selectedEvent, setSelectedEvent] = useState<TimelineEventDetail | null>(null);

  return (
    <div className="space-y-8 pb-32 pt-4 px-1">
      <div className="space-y-1">
        <h2 className="text-[10px] font-black text-[#ffd700] uppercase tracking-[0.4em]">Chronicle</h2>
        <h1 className="text-4xl font-black text-white tracking-tighter">{t.title}</h1>
        <p className="text-sm text-white/40 font-medium tracking-tight leading-relaxed">{t.subtitle}</p>
      </div>

      <div className="flex justify-center py-2">
        <div className="w-[120px] h-1 rounded-full overflow-hidden flex">
          <div className="flex-1 bg-[#0057b7]" />
          <div className="flex-1 bg-[#ffd700]" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {TIMELINE_EVENT_DETAILS.map((event, i) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
          >
            <GlassCard
              onClick={() => setSelectedEvent(event)}
              className="cursor-pointer overflow-hidden p-0 h-full flex flex-col"
            >
              <div className="h-1 rounded-t-[24px]" style={{ backgroundColor: event.accentColor }} />
              <div className="p-5 flex flex-col flex-1">
                <span className="text-xs font-black text-[#ffd700] uppercase tracking-[0.15em] mb-2">{event.year}</span>
                <h3 className="text-base font-black text-white mb-2 tracking-tight leading-tight">{event.title[lang]}</h3>
                <p className="text-[11px] text-white/40 leading-relaxed font-medium tracking-tight mb-4 line-clamp-2">{event.description[lang]}</p>
                <div className="mt-auto pt-3 border-t border-white/5 flex items-center gap-2 text-[11px] text-[#ffd700] font-bold">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{lang === "ua" ? "Детальніше" : "Read more"}</span>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#050505]/95 backdrop-blur-xl flex items-start justify-center overflow-y-auto"
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-2xl bg-[#0a0a0f] border border-white/10 rounded-3xl my-6 mx-4 overflow-hidden"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-white/5">
                <span className="text-xs font-black text-[#ffd700] uppercase tracking-[0.15em]">{selectedEvent.year}</span>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-[#ffd700] hover:text-[#0a0a0f] transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <h2 className="text-2xl font-black text-white tracking-tight leading-tight">{selectedEvent.title[lang]}</h2>

                {selectedEvent.images.length > 0 && (
                  <div className="space-y-3">
                    <div className="rounded-2xl overflow-hidden bg-white/5">
                      <img
                        src={selectedEvent.images[0]}
                        alt={selectedEvent.title[lang]}
                        className="w-full max-h-[300px] object-cover"
                        onError={(e: React.SyntheticEvent<HTMLImageElement>) => { e.currentTarget.style.display = "none"; }}
                      />
                    </div>
                    {selectedEvent.images.length > 1 && (
                      <div className="flex gap-2 overflow-x-auto pb-1">
                        {selectedEvent.images.slice(1).map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt=""
                            className="w-16 h-16 rounded-xl object-cover flex-shrink-0 border-2 border-white/10"
                            onError={(e: React.SyntheticEvent<HTMLImageElement>) => { e.currentTarget.style.display = "none"; }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div
                  className="prose prose-invert prose-sm max-w-none [&_h3]:text-[#ffd700] [&_h3]:text-lg [&_h3]:font-bold [&_h3]:mt-6 [&_h3]:mb-3 [&_h4]:text-[#ffd700] [&_h4]:text-base [&_h4]:font-bold [&_h4]:mt-5 [&_h4]:mb-2 [&_h5]:text-[#ffd700]/80 [&_h5]:text-sm [&_h5]:font-bold [&_h5]:mt-4 [&_h5]:mb-2 [&_p]:text-white/60 [&_p]:text-sm [&_p]:leading-relaxed [&_p]:mb-3 [&_strong]:text-[#ffd700] [&_strong]:font-semibold [&_ul]:space-y-1 [&_ul]:mb-3 [&_li]:text-white/60 [&_li]:text-sm [&_blockquote]:border-l-[3px] [&_blockquote]:border-[#ffd700] [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-white/70 [&_blockquote]:text-sm [&_blockquote]:my-4 [&_table]:w-full [&_table]:text-sm [&_th]:text-[#ffd700] [&_th]:p-3 [&_th]:text-left [&_th]:border [&_th]:border-white/10 [&_th]:bg-white/5 [&_td]:text-white/60 [&_td]:p-3 [&_td]:border [&_td]:border-white/10"
                  dangerouslySetInnerHTML={{ __html: lang === "ua" ? selectedEvent.contentUA : selectedEvent.contentEN }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SupportScreen({ lang, dbUser, onDonated }: { lang: Lang; dbUser: DbUser | null; onDonated: () => void }) {
  const t = TEXT[lang].support;
  const [selectedAmount, setSelectedAmount] = useState<number | null>(50);
  const [customAmount, setCustomAmount] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [globalStats, setGlobalStats] = useState<{ totalRaised: number; donorsCount: number; totalUsers: number }>({ totalRaised: 0, donorsCount: 0, totalUsers: 0 });
  const successAmountRef = useRef<number>(0);

  const amounts = [10, 25, 50, 100];

  useEffect(() => {
    const loadStats = async () => {
      try {
        const stats = await museumAPI.getGlobalDonationStats();
        setGlobalStats(stats);
      } catch (err) {
        console.error("Load donation stats error:", err);
      }
    };
    loadStats();
  }, []);

  const refreshGlobalStats = async () => {
    const stats = await museumAPI.getGlobalDonationStats();
    setGlobalStats(stats);
  };

  const getAmount = () => {
    const amt = customAmount ? parseFloat(customAmount) : selectedAmount;
    return amt && amt > 0 ? amt : 0;
  };

  // ── Telegram Stars payment ──────────────────────────────────────────────

  const handleStarsPayment = async () => {
    if (!dbUser) return;
    const amount = getAmount();
    if (amount <= 0) return;

    setIsProcessing(true);
    setPaymentError("");
    successAmountRef.current = amount;

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      const invoiceRes = await fetch(`${supabaseUrl}/functions/v1/stars-invoice`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${supabaseKey}`,
          apikey: supabaseKey,
        },
        body: JSON.stringify({
          title: lang === "ua" ? "Донат музею" : "Museum Donation",
          description: lang === "ua"
            ? `Підтримка музею — ${amount} Stars`
            : `Support the museum — ${amount} Stars`,
          prices: [{ label: "Donation", amount: Math.round(amount) }],
          payload: `donation_${dbUser.id}_${Date.now()}`,
        }),
      });

      const invoiceData = await invoiceRes.json();
      if (!invoiceRes.ok || invoiceData.error || !invoiceData.invoice_link) {
        console.error("Invoice creation failed:", invoiceData.error);
        setPaymentError(t.paymentError);
        setIsProcessing(false);
        return;
      }

      const { invoice_link } = invoiceData;

      if (window.Telegram?.WebApp) {
        const WebApp = window.Telegram.WebApp;
        WebApp.openInvoice(invoice_link, async (status: string) => {
          try {
            if (status === "paid") {
              await museumAPI.createDonation(dbUser.id, amount, "XTR", "telegram_stars");
              await refreshGlobalStats();
              onDonated();
              setIsSuccess(true);
              setTimeout(() => setIsSuccess(false), 4000);
              if (WebApp.HapticFeedback) {
                WebApp.HapticFeedback.notificationOccurred("success");
              }
            } else if (status === "failed") {
              setPaymentError(t.paymentError);
            }
          } catch (err) {
            console.error("Payment callback error:", err);
            setPaymentError(t.paymentError);
          } finally {
            setIsProcessing(false);
          }
        });
      } else {
        // Outside Telegram — test mode
        await museumAPI.createDonation(dbUser.id, amount, "XTR", "telegram_stars");
        await refreshGlobalStats();
        onDonated();
        setIsSuccess(true);
        setTimeout(() => setIsSuccess(false), 4000);
        setIsProcessing(false);
      }
    } catch (err) {
      console.error("Stars payment failed:", err);
      setPaymentError(t.paymentError);
      setIsProcessing(false);
    }
  };

  // ── Success screen ──────────────────────────────────────────────────────

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-6">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 12 }} className="w-24 h-24 bg-gradient-to-br from-[#0057b7] to-[#ffd700] rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-12 h-12 text-white" />
        </motion.div>
        <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-bold text-white mb-2">{t.thankYou}</motion.h2>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-center">
          <p className="text-[#ffd700] font-bold text-lg mb-1">{successAmountRef.current} Stars</p>
          <p className="text-white/60 leading-relaxed max-w-xs">{t.supportMessage}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      {/* Real Stats from DB */}
      <div className="grid grid-cols-3 gap-3">
        <GlassCard className="p-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2 opacity-10"><TrendingUp className="w-10 h-10 text-[#ffd700]" /></div>
          <div className="text-[9px] uppercase tracking-wider text-white/40 mb-1">{t.totalRaised}</div>
          <div className="text-lg font-bold text-white">{globalStats.totalRaised.toLocaleString()}</div>
          <div className="text-[9px] text-white/30 mt-0.5">Stars</div>
        </GlassCard>
        <GlassCard className="p-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2 opacity-10"><Heart className="w-10 h-10 text-[#0057b7]" /></div>
          <div className="text-[9px] uppercase tracking-wider text-white/40 mb-1">{t.donorsCount}</div>
          <div className="text-lg font-bold text-white">{globalStats.donorsCount.toLocaleString()}</div>
          <div className="text-[9px] text-white/30 mt-0.5">{lang === "ua" ? "осіб" : "people"}</div>
        </GlassCard>
        <GlassCard className="p-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2 opacity-10"><User className="w-10 h-10 text-[#ffd700]" /></div>
          <div className="text-[9px] uppercase tracking-wider text-white/40 mb-1">{t.totalUsers}</div>
          <div className="text-lg font-bold text-white">{globalStats.totalUsers.toLocaleString()}</div>
          <div className="text-[9px] text-white/30 mt-0.5">{lang === "ua" ? "учасників" : "members"}</div>
        </GlassCard>
      </div>

      {/* Amount Selector */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider px-1">{t.selectAmount}</h3>
        <div className="grid grid-cols-4 gap-2">
          {amounts.map((amt) => (
            <button key={amt} onClick={() => { setSelectedAmount(amt); setCustomAmount(""); }} className={`py-3 rounded-xl border transition-all ${selectedAmount === amt ? "bg-[#0057b7]/20 border-[#0057b7] text-white shadow-lg shadow-blue-500/10" : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"}`}>
              <div className="text-lg font-bold">{amt}</div>
              <div className="text-[9px] font-medium opacity-50">Stars</div>
            </button>
          ))}
        </div>
        <input type="number" placeholder={t.customAmount} value={customAmount} onChange={(e) => { setCustomAmount(e.target.value); setSelectedAmount(null); }} className={`w-full py-3 px-4 rounded-xl border transition-all text-sm font-bold outline-none ${customAmount !== "" ? "bg-[#0057b7]/20 border-[#0057b7] text-white" : "bg-white/5 border-white/10 text-white/60"}`} />
      </div>

      {/* Payment Methods */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider px-1">
          {lang === "ua" ? "Спосіб оплати" : "Payment Method"}
        </h3>
        <div className="space-y-3">
          {/* Telegram Stars */}
          <motion.button whileTap={{ scale: 0.98 }} onClick={handleStarsPayment} disabled={isProcessing || getAmount() <= 0} className="w-full p-4 rounded-2xl bg-gradient-to-r from-[#0088cc] to-[#00aaff] flex items-center justify-between group shadow-lg shadow-blue-500/20 disabled:opacity-50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl"><Star className="w-6 h-6 text-white fill-white" /></div>
              <div className="text-left">
                <div className="text-white font-bold">{t.payStars}</div>
                <div className="text-white/70 text-[10px]">
                  {isProcessing
                    ? (lang === "ua" ? "Обробка..." : "Processing...")
                    : `${getAmount() || 0} Stars ≈ $${((getAmount() || 0) * 0.013).toFixed(2)}`}
                </div>
              </div>
            </div>
            {isProcessing ? <Loader2 className="w-5 h-5 text-white animate-spin" /> : <ChevronRight className="w-5 h-5 text-white/60" />}
          </motion.button>
          {paymentError && (
            <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="mt-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400 text-center font-medium">
              {paymentError}
            </motion.div>
          )}
        </div>
      </div>

      {/* Info */}
      <GlassCard className="p-5">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-[#ffd700]/10 rounded-lg"><Shield className="w-4 h-4 text-[#ffd700]" /></div>
          <p className="text-xs text-white/60 leading-relaxed">{t.supportMessage}</p>
        </div>
      </GlassCard>

      <div className="pt-4 text-center">
        <p className="text-[10px] text-white/20 uppercase tracking-[0.2em]">{t.version}</p>
      </div>
    </div>
  );
}

// ─── Tap Screen ────────────────────────────────────────────────────────────────

function TapScreen({ lang, dbUser, stats, onRefresh }: { lang: Lang; dbUser: DbUser | null; stats: UserStats | null; onRefresh: () => void }) {
  const t = TEXT[lang].tap;
  const [tapState, setTapState] = useState<TapGameState | null>(null);
  const [tableExists, setTableExists] = useState(true);
  const [taps, setTaps] = useState(0);
  const [floatingXPs, setFloatingXPs] = useState<{ id: number; x: string; y: number; value: string }[]>([]);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [isBuyingAutoclicker, setIsBuyingAutoclicker] = useState(false);
  const [upgradeMsg, setUpgradeMsg] = useState("");
  const tapIdRef = useRef(0);
  const [localXP, setLocalXP] = useState(stats?.totalXP || 0);
  const [ownedArtifacts, setOwnedArtifacts] = useState<string[]>([]);
  const [showShop, setShowShop] = useState(false);
  const [showAutoclicker, setShowAutoclicker] = useState(false);
  const [buyingArtifact, setBuyingArtifact] = useState<string | null>(null);
  const [autoclickerTimeLeft, setAutoclickerTimeLeft] = useState<string | null>(null);
  const handleTapRef = useRef<() => void>(() => {});

  // Batch tap tracking — accumulate locally, flush to DB every 2 seconds
  const pendingTapsRef = useRef<{ count: number; totalXP: number }>({ count: 0, totalXP: 0 });

  // Keep localXP in sync with stats — but add pending taps' XP so they don't get wiped
  useEffect(() => {
    if (stats?.totalXP !== undefined) {
      setLocalXP(stats.totalXP + pendingTapsRef.current.totalXP);
    }
  }, [stats?.totalXP]);

  // Load tap state + owned artifacts
  useEffect(() => {
    if (!dbUser) return;
    const load = async () => {
      try {
        const state = await museumAPI.initTapState(dbUser.id);
        setTapState(state);
        setTaps(state.total_taps || 0);
        const owned = await museumAPI.getOwnedArtifacts(dbUser.id);
        setOwnedArtifacts(owned);
      } catch (err: unknown) {
        console.error("Tap state init error:", err);
        const error = err as { message?: string; code?: string; details?: string };
        if (error?.message?.includes("Could not find") || error?.code === "PGRST205" || error?.details?.includes("not found")) {
          setTableExists(false);
        }
      }
    };
    load();
  }, [dbUser]);

  // Flush pending taps to DB periodically
  const flushTaps = useCallback(async () => {
    if (!dbUser || pendingTapsRef.current.count === 0) return;
    const batch = { ...pendingTapsRef.current };
    pendingTapsRef.current = { count: 0, totalXP: 0 };
    try {
      await museumAPI.recordTapBatch(dbUser.id, batch.count, batch.totalXP);
    } catch (err) {
      console.error("Batch tap flush error:", err);
      pendingTapsRef.current.count += batch.count;
      pendingTapsRef.current.totalXP += batch.totalXP;
    }
  }, [dbUser]);

  useEffect(() => {
    const interval = setInterval(flushTaps, 2000);
    return () => {
      clearInterval(interval);
      flushTaps();
    };
  }, [flushTaps]);

  // Move artifact bonus calculations BEFORE useEffects that use them
  // This fixes a hoisting issue where autoclickerSpeedMultiplier was used before it was defined
  const totalArtifactBonus = TAP_ARTIFACTS
    .filter(a => ownedArtifacts.includes(a.key))
    .reduce((sum, a) => sum + a.xpBonus, 0);

  const totalDoubleRewardChance = TAP_ARTIFACTS
    .filter(a => ownedArtifacts.includes(a.key) && a.effects?.doubleRewardChance)
    .reduce((sum, a) => sum + (a.effects?.doubleRewardChance || 0), 0);

  const autoclickerSpeedMultiplier = TAP_ARTIFACTS
    .filter(a => ownedArtifacts.includes(a.key) && a.effects?.autoclickerSpeed)
    .reduce((max, a) => Math.max(max, a.effects?.autoclickerSpeed || 1), 1);

  // Autoclicker tick — auto-tap every second when active
  useEffect(() => {
    const acUntil = tapState?.autoclicker_until;
    if (!acUntil) {
      setAutoclickerTimeLeft(null);
      return;
    }

    const tick = () => {
      const diff = new Date(acUntil).getTime() - Date.now();
      if (diff <= 0) {
        setAutoclickerTimeLeft(null);
        return;
      }
      const hrs = Math.floor(diff / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      if (hrs > 0) {
        setAutoclickerTimeLeft(`${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`);
      } else {
        setAutoclickerTimeLeft(`${mins}:${secs.toString().padStart(2, "0")}`);
      }
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [tapState?.autoclicker_until]);

  // Autoclicker auto-tap
  useEffect(() => {
    const acUntil = tapState?.autoclicker_until;
    if (!acUntil) return;

    const interval = setInterval(() => {
      if (new Date(acUntil).getTime() <= Date.now()) return;
      handleTapRef.current();
    }, Math.max(200, Math.floor(1000 / autoclickerSpeedMultiplier)));

    return () => clearInterval(interval);
  }, [tapState?.autoclicker_until, dbUser, autoclickerSpeedMultiplier]);

  // Refresh tap state periodically
  useEffect(() => {
    if (!dbUser || !tapState) return;
    const interval = setInterval(async () => {
      const state = await museumAPI.getTapState(dbUser.id);
      if (state) setTapState(state);
      onRefresh();
    }, 10000);
    return () => clearInterval(interval);
  }, [dbUser, tapState]);

  if (!tableExists) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 space-y-4">
        <div className="p-4 bg-red-500/10 rounded-2xl border border-red-500/20">
          <X className="w-8 h-8 text-red-400 mx-auto mb-2" />
          <p className="text-sm text-red-300 leading-relaxed">{t.noTable}</p>
        </div>
      </div>
    );
  }

  const levelConfig = TAP_LEVELS.find(l => l.level === (tapState?.tap_level || 1)) || TAP_LEVELS[0];

  const xpPerTap = levelConfig.xpPerTap + totalArtifactBonus;

  // Active artifact determines tap area image only
  const activeArtifact = TAP_ARTIFACTS.find(a => a.key === tapState?.active_artifact);

  const handleTap = async () => {
    if (!dbUser || !tapState) return;

    const id = ++tapIdRef.current;
    const x = 50 + Math.random() * 60 - 30;
    const y = 10 + Math.random() * 20;
    const isDouble = Math.random() < totalDoubleRewardChance;
    const earned = isDouble ? xpPerTap * 2 : xpPerTap;
    const label = isDouble ? `+${earned} XP x2!` : `+${earned} XP`;
    setFloatingXPs(prev => [...prev, { id, x: x + "%", y, value: label }]);
    setTaps(prev => prev + 1);
    setLocalXP(prev => prev + earned);

    pendingTapsRef.current.count += 1;
    pendingTapsRef.current.totalXP += earned;

    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred("light");
    }

    setTimeout(() => setFloatingXPs(prev => prev.filter(f => f.id !== id)), 800);
  };
  handleTapRef.current = handleTap;

  const handleUpgrade = async () => {
    if (!dbUser || !tapState || tapState.tap_level >= MAX_TAP_LEVEL || isUpgrading) return;
    setIsUpgrading(true);
    setUpgradeMsg("");
    await flushTaps();

    try {
      const result = await museumAPI.upgradeTapLevel(dbUser.id);
      if (result.success) {
        setTapState(prev => prev ? { ...prev, tap_level: result.newLevel } : prev);
        setUpgradeMsg(lang === "ua" ? `Рівень ${result.newLevel}!` : `Level ${result.newLevel}!`);
        onRefresh();
      } else {
        setUpgradeMsg(t.notEnoughXP);
      }
    } catch (err) {
      console.error("Upgrade error:", err);
    } finally {
      setIsUpgrading(false);
      setTimeout(() => setUpgradeMsg(""), 2000);
    }
  };

  const handleBuyAutoclicker = async (option: AutoclikerOption) => {
    if (!dbUser || isBuyingAutoclicker) return;
    setIsBuyingAutoclicker(true);

    try {
      if (window.Telegram?.WebApp) {
        const WebApp = window.Telegram.WebApp;
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
        const invoiceRes = await fetch(`${supabaseUrl}/functions/v1/stars-invoice`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${supabaseKey}`,
            apikey: supabaseKey,
          },
          body: JSON.stringify({
            title: lang === "ua" ? `Автоклікер — ${option.label.ua}` : `Autoclicker — ${option.label.en}`,
            description: lang === "ua"
              ? `${option.label.ua} автоматичного тапання`
              : `${option.label.en} of auto-tapping`,
            prices: [{ label: option.label.en, amount: option.costStars }],
            payload: `autoclicker_${option.key}_${dbUser.id}_${Date.now()}`,
          }),
        });

        if (!invoiceRes.ok) {
          console.error("Invoice creation failed");
          setIsBuyingAutoclicker(false);
          return;
        }

        const { invoice_link, error: invError } = await invoiceRes.json();
        if (invError || !invoice_link) {
          console.error("No invoice link:", invError);
          setIsBuyingAutoclicker(false);
          return;
        }

        WebApp.openInvoice(invoice_link, async (status: string) => {
          try {
            if (status === "paid") {
              const result = await museumAPI.buyAutoclicker(dbUser.id, option.durationMin);
              if (result.success) {
                setTapState(prev => prev ? { ...prev, autoclicker_until: result.until } : prev);
                await museumAPI.createDonation(dbUser.id, option.costStars, "XTR", `telegram_stars_autoclicker_${option.key}`);
                onRefresh();
                if (WebApp.HapticFeedback) {
                  WebApp.HapticFeedback.notificationOccurred("success");
                }
              }
            }
          } catch (err) {
            console.error("Autoclicker payment callback error:", err);
          } finally {
            setIsBuyingAutoclicker(false);
          }
        });
      } else {
        // Test mode outside Telegram
        const result = await museumAPI.buyAutoclicker(dbUser.id, option.durationMin);
        if (result.success) {
          setTapState(prev => prev ? { ...prev, autoclicker_until: result.until } : prev);
          onRefresh();
        }
        setIsBuyingAutoclicker(false);
      }
    } catch (err) {
      console.error("Buy autoclicker error:", err);
      setIsBuyingAutoclicker(false);
    }
  };

  // Buy artifact for XP
  const handleBuyArtifactXP = async (artifact: TapArtifact) => {
    if (!dbUser || buyingArtifact) return;
    setBuyingArtifact(artifact.key);
    // Flush buffered taps first so DB has up-to-date XP before spending
    await flushTaps();
    try {
      const result = await museumAPI.buyArtifactXP(dbUser.id, artifact.key, artifact.costXP);
      if (result.success) {
        setOwnedArtifacts(prev => [...prev, artifact.key]);
        setTapState(prev => prev ? { ...prev, active_artifact: artifact.key } : prev);
        setLocalXP(prev => prev - artifact.costXP);
        onRefresh();
      } else {
        setUpgradeMsg(t.notEnoughXP);
        setTimeout(() => setUpgradeMsg(""), 2000);
      }
    } catch (err) {
      console.error("Buy artifact error:", err);
    } finally {
      setBuyingArtifact(null);
    }
  };

  // Buy artifact for Stars
  const handleBuyArtifactStars = async (artifact: TapArtifact) => {
    if (!dbUser || buyingArtifact) return;
    setBuyingArtifact(artifact.key);
    try {
      if (window.Telegram?.WebApp) {
        const WebApp = window.Telegram.WebApp;
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
        const invoiceRes = await fetch(`${supabaseUrl}/functions/v1/stars-invoice`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${supabaseKey}`,
            apikey: supabaseKey,
          },
          body: JSON.stringify({
            title: artifact.name[lang as "ua" | "en"],
            description: `${artifact.name[lang as "ua" | "en"]} — +${artifact.xpBonus} XP bonus`,
            prices: [{ label: artifact.name.en, amount: artifact.costStars }],
            payload: `artifact_${artifact.key}_${dbUser.id}_${Date.now()}`,
          }),
        });

        if (!invoiceRes.ok) {
          console.error("Invoice creation failed");
          setBuyingArtifact(null);
          return;
        }

        const { invoice_link, error: invError } = await invoiceRes.json();
        if (invError || !invoice_link) {
          console.error("No invoice link:", invError);
          setBuyingArtifact(null);
          return;
        }

        WebApp.openInvoice(invoice_link, async (status: string) => {
          try {
            if (status === "paid") {
              const result = await museumAPI.buyArtifactStars(dbUser.id, artifact.key);
              if (result.success) {
                setOwnedArtifacts(prev => [...prev, artifact.key]);
                setTapState(prev => prev ? { ...prev, active_artifact: artifact.key } : prev);
                await museumAPI.createDonation(dbUser.id, artifact.costStars, "XTR", `telegram_stars_artifact_${artifact.key}`);
                onRefresh();
                if (WebApp.HapticFeedback) {
                  WebApp.HapticFeedback.notificationOccurred("success");
                }
              }
            }
          } catch (err) {
            console.error("Artifact payment callback error:", err);
          } finally {
            setBuyingArtifact(null);
          }
        });
      } else {
        // Test mode
        const result = await museumAPI.buyArtifactStars(dbUser.id, artifact.key);
        if (result.success) {
          setOwnedArtifacts(prev => [...prev, artifact.key]);
          setTapState(prev => prev ? { ...prev, active_artifact: artifact.key } : prev);
          onRefresh();
        }
        setBuyingArtifact(null);
      }
    } catch (err) {
      console.error("Buy artifact stars error:", err);
      setBuyingArtifact(null);
    }
  };

  // Equip artifact
  const handleEquipArtifact = async (artifactKey: string) => {
    if (!dbUser) return;
    await museumAPI.equipArtifact(dbUser.id, artifactKey);
    setTapState(prev => prev ? { ...prev, active_artifact: artifactKey } : prev);
  };

  // Get active artifact image for tap area
  const tapImage = activeArtifact?.image || "https://images.pexels.com/photos/1678808/pexels-photo-1678808.jpeg?auto=compress&cs=tinysrgb&w=400";

  return (
    <div className="space-y-6 pb-32">
      {/* Header Stats */}
      <div className="grid grid-cols-3 gap-3 pt-4">
        <GlassCard className="p-3 text-center" hover={false}>
          <MousePointerClick className="w-4 h-4 text-[#ffd700]/60 mx-auto mb-1" />
          <div className="text-lg font-bold text-white">{taps}</div>
          <div className="text-[9px] text-white/40">{t.totalTaps}</div>
        </GlassCard>
        <GlassCard className="p-3 text-center" hover={false}>
          <Zap className="w-4 h-4 text-[#ffd700]/60 mx-auto mb-1" />
          <div className="text-lg font-bold text-white">{xpPerTap}</div>
          <div className="text-[9px] text-white/40">{t.perClick}</div>
        </GlassCard>
        <GlassCard className="p-3 text-center" hover={false}>
          <Star className="w-4 h-4 text-[#ffd700]/60 mx-auto mb-1" />
          <div className="text-lg font-bold text-white">{Math.floor(localXP)}</div>
          <div className="text-[9px] text-white/40">XP</div>
        </GlassCard>
      </div>

      {/* Autoclicker Banner */}
      {autoclickerTimeLeft && (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <GlassCard className="p-3 flex items-center justify-between bg-gradient-to-r from-[#0057b7]/10 to-transparent border-[#0057b7]/20">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#0057b7] animate-pulse" />
              <span className="text-sm font-bold text-[#0057b7]">{t.autoclickerActive}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Timer className="w-3.5 h-3.5 text-[#0057b7]/60" />
              <span className="text-sm font-mono font-bold text-[#0057b7]">{autoclickerTimeLeft}</span>
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* TAP AREA - Artifact centered */}
      <div className="flex flex-col items-center py-6">
        <motion.div
          whileTap={{ scale: 0.92 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
          onClick={handleTap}
          className="relative cursor-pointer select-none"
        >
          <div className="relative w-56 h-56 rounded-full overflow-hidden border-4 border-[#ffd700]/20 shadow-[0_0_60px_rgba(255,215,0,0.15)] active:shadow-[0_0_80px_rgba(255,215,0,0.3)] transition-shadow">
            <img
              src={tapImage}
              alt="Tap"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0a0f]/80" />
            {/* Glow ring */}
            <div className="absolute inset-0 rounded-full ring-2 ring-[#ffd700]/10" />
          </div>

          {/* Level badge */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-gradient-to-r from-[#0057b7] to-[#ffd700] rounded-full shadow-lg">
            <span className="text-xs font-black text-white tracking-wider">{t.level} {tapState?.tap_level || 1}</span>
          </div>

          {/* XP per tap indicator */}
          <div className="absolute -top-2 -right-2 px-3 py-1.5 bg-[#0a0a0f]/90 border border-[#ffd700]/30 rounded-full">
            <span className="text-xs font-bold text-[#ffd700]">+{xpPerTap} XP</span>
          </div>

          {/* Floating XP numbers */}
          {floatingXPs.map(f => (
            <motion.div
              key={f.id}
              initial={{ opacity: 1, y: 0, scale: 1 }}
              animate={{ opacity: 0, y: -80, scale: 1.5 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute font-black text-[#ffd700] text-lg drop-shadow-lg pointer-events-none"
              style={{ left: f.x, top: f.y }}
            >
              {f.value}
            </motion.div>
          ))}
        </motion.div>

        <p className="text-white/30 text-xs mt-6 uppercase tracking-widest">
          {lang === "ua" ? "Натискай для XP" : "Tap for XP"}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 px-1">
        {/* Upgrade Button */}
        {tapState && tapState.tap_level < MAX_TAP_LEVEL ? (() => {
          // upgradeCostXP on the CURRENT level = how much it costs to leave it
          const upgradeCost = TAP_LEVELS.find(l => l.level === tapState.tap_level)?.upgradeCostXP ?? 0;
          const nextLevelXP  = TAP_LEVELS.find(l => l.level === tapState.tap_level + 1)?.xpPerTap ?? 0;
          const canAfford = localXP >= upgradeCost;
          return (
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleUpgrade}
              disabled={isUpgrading || !canAfford}
              className={`w-full p-4 rounded-2xl border flex items-center justify-between transition-colors disabled:opacity-50 ${canAfford ? "bg-white/5 border-white/10 hover:bg-white/10" : "bg-white/[0.02] border-white/5"}`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#0057b7]/20 rounded-xl">
                  <ArrowUpCircle className="w-6 h-6 text-[#0057b7]" />
                </div>
                <div className="text-left">
                  <div className="text-white font-bold text-sm">
                    {t.upgrade} → {t.level} {tapState.tap_level + 1} / {MAX_TAP_LEVEL}
                  </div>
                  <div className="text-white/40 text-[10px]">
                    {nextLevelXP} XP/{lang === "ua" ? "клік" : "click"} {lang === "ua" ? "(базово)" : "(base)"}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={`font-bold text-sm ${canAfford ? "text-[#ffd700]" : "text-white/30"}`}>
                  {upgradeCost} XP
                </div>
                <div className="text-white/30 text-[10px]">{t.upgradeCost}</div>
              </div>
            </motion.button>
          );
        })() : (
          <GlassCard className="p-4 flex items-center justify-center gap-2" hover={false}>
            <Crown className="w-5 h-5 text-[#ffd700]" />
            <span className="text-[#ffd700] font-bold text-sm">{t.maxLevel}</span>
          </GlassCard>
        )}

        {/* Upgrade message */}
        {upgradeMsg && (
          <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="text-center text-sm font-bold text-[#ffd700]">
            {upgradeMsg}
          </motion.div>
        )}

        {/* Autoclicker Toggle */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowAutoclicker(!showAutoclicker)}
          className="w-full p-4 rounded-2xl bg-gradient-to-r from-[#0057b7]/20 to-[#0057b7]/5 border border-[#0057b7]/20 flex items-center justify-between hover:from-[#0057b7]/30 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#0057b7]/20 rounded-xl">
              <Zap className="w-6 h-6 text-[#0057b7]" />
            </div>
            <div className="text-left">
              <div className="text-white font-bold text-sm">{t.autoclicker}</div>
              <div className="text-white/40 text-[10px]">{t.autoclickerExtends}</div>
            </div>
          </div>
          <ChevronRight className={`w-5 h-5 text-white/40 transition-transform ${showAutoclicker ? "rotate-90" : ""}`} />
        </motion.button>

        {/* Autoclicker Options */}
        <AnimatePresence>
          {showAutoclicker && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <div className="grid grid-cols-2 gap-2 pt-2">
                {AUTOCLICKER_OPTIONS.map((option) => (
                  <motion.button
                    key={option.key}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleBuyAutoclicker(option)}
                    disabled={isBuyingAutoclicker}
                    className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 flex flex-col items-center gap-1.5 hover:bg-white/[0.06] transition-colors disabled:opacity-50"
                  >
                    <Timer className="w-5 h-5 text-[#0057b7]" />
                    <span className="text-white font-bold text-xs">{option.label[lang as "ua" | "en"]}</span>
                    <span className="text-[10px] font-bold text-white/50">{option.costStars} ★</span>
                    {isBuyingAutoclicker && <Loader2 className="w-3 h-3 animate-spin text-white/50" />}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Upgrade Shop Toggle */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowShop(!showShop)}
          className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between hover:bg-white/10 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#0057b7]/20 rounded-xl">
              <ShoppingBag className="w-6 h-6 text-[#0057b7]" />
            </div>
            <div className="text-left">
              <div className="text-white font-bold text-sm">{t.shop}</div>
              <div className="text-white/40 text-[10px]">{t.shopDesc}</div>
            </div>
          </div>
          <ChevronRight className={`w-5 h-5 text-white/40 transition-transform ${showShop ? "rotate-90" : ""}`} />
        </motion.button>

        {/* Shop Items */}
        <AnimatePresence>
          {showShop && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              {/* Bonus summary */}
              {(totalArtifactBonus > 0 || totalDoubleRewardChance > 0 || autoclickerSpeedMultiplier > 1) && (
                <div className="mb-2 space-y-1">
                  {totalArtifactBonus > 0 && (
                    <div className="px-1 py-2 rounded-xl bg-[#ffd700]/5 border border-[#ffd700]/15 flex items-center justify-between">
                      <span className="text-[10px] text-white/50">{lang === "ua" ? "Бонус артефактів" : "Artifact bonus"}</span>
                      <span className="text-[#ffd700] font-black text-sm">+{totalArtifactBonus} XP/{lang === "ua" ? "клік" : "tap"}</span>
                    </div>
                  )}
                  {totalDoubleRewardChance > 0 && (
                    <div className="px-1 py-2 rounded-xl bg-cyan-500/5 border border-cyan-500/15 flex items-center justify-between">
                      <span className="text-[10px] text-white/50">{lang === "ua" ? "Шанс подвійної нагороди" : "Double reward chance"}</span>
                      <span className="text-cyan-400 font-black text-sm">{Math.round(totalDoubleRewardChance * 100)}%</span>
                    </div>
                  )}
                  {autoclickerSpeedMultiplier > 1 && (
                    <div className="px-1 py-2 rounded-xl bg-blue-500/5 border border-blue-500/15 flex items-center justify-between">
                      <span className="text-[10px] text-white/50">{lang === "ua" ? "Швидкість автоклікера" : "Autoclicker speed"}</span>
                      <span className="text-blue-400 font-black text-sm">x{autoclickerSpeedMultiplier}</span>
                    </div>
                  )}
                </div>
              )}
              <div className="space-y-2 pt-1">
                {TAP_ARTIFACTS.map((artifact) => {
                  const owned = ownedArtifacts.includes(artifact.key);
                  const equipped = tapState?.active_artifact === artifact.key;
                  const canAffordXP = artifact.costXP > 0 && localXP >= artifact.costXP;

                  return (
                    <div key={artifact.key} className={`p-3 rounded-2xl border flex items-center gap-3 transition-colors ${owned ? "bg-[#ffd700]/5 border-[#ffd700]/20" : "bg-white/[0.03] border-white/5"}`}>
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                        <img
                          src={artifact.image}
                          alt={artifact.name[lang as "ua" | "en"]}
                          className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).src = "https://images.pexels.com/photos/1678808/pexels-photo-1678808.jpeg?auto=compress&cs=tinysrgb&w=400"; }}
                        />
                        {owned && (
                          <div className="absolute inset-0 bg-[#ffd700]/20 flex items-center justify-center">
                            <CheckCircle2 className="w-5 h-5 text-[#ffd700]" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white font-bold text-xs truncate">{artifact.name[lang as "ua" | "en"]}</div>
                        <div className="text-[#ffd700] text-[10px] font-bold">+{artifact.xpBonus} XP/{lang === "ua" ? "клік" : "click"}</div>
                        {artifact.effects?.doubleRewardChance && (
                          <div className="text-cyan-400 text-[9px] font-semibold">{lang === "ua" ? `Шанс x2: ${Math.round(artifact.effects.doubleRewardChance * 100)}%` : `x2 chance: ${Math.round(artifact.effects.doubleRewardChance * 100)}%`}</div>
                        )}
                        {artifact.effects?.autoclickerSpeed && (
                          <div className="text-blue-400 text-[9px] font-semibold">{lang === "ua" ? `Автоклікер x${artifact.effects.autoclickerSpeed}` : `Autoclicker x${artifact.effects.autoclickerSpeed}`}</div>
                        )}
                        {artifact.effects?.streakBonus && (
                          <div className="text-orange-400 text-[9px] font-semibold">{lang === "ua" ? `Бонус серії: +${artifact.effects.streakBonus} XP/день` : `Streak bonus: +${artifact.effects.streakBonus} XP/day`}</div>
                        )}
                        {owned && (
                          <div className="text-[#4ade80] text-[9px] font-semibold mt-0.5">{lang === "ua" ? "▲ активний бонус" : "▲ bonus active"}</div>
                        )}
                      </div>
                      <div className="flex-shrink-0">
                        {owned ? (
                          equipped ? (
                            <span className="text-[10px] font-bold text-[#ffd700] bg-[#ffd700]/10 px-2 py-1.5 rounded-lg">{t.equipped}</span>
                          ) : (
                            <motion.button whileTap={{ scale: 0.95 }} onClick={() => handleEquipArtifact(artifact.key)} className="text-[10px] font-bold text-white bg-[#0057b7] px-2 py-1.5 rounded-lg">
                              {t.equip}
                            </motion.button>
                          )
                        ) : (
                          <div className="flex flex-col gap-1">
                            {artifact.costXP > 0 && (
                              <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleBuyArtifactXP(artifact)}
                                disabled={buyingArtifact !== null || !canAffordXP}
                                className={`text-[10px] font-bold px-2 py-1.5 rounded-lg ${canAffordXP ? "text-[#ffd700] bg-[#ffd700]/10 hover:bg-[#ffd700]/20" : "text-white/30 bg-white/5"} disabled:opacity-50`}
                              >
                                {buyingArtifact === artifact.key ? <Loader2 className="w-3 h-3 animate-spin" /> : `${artifact.costXP} XP`}
                              </motion.button>
                            )}
                            {artifact.costStars > 0 && (
                              <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleBuyArtifactStars(artifact)}
                                disabled={buyingArtifact !== null}
                                className="text-[10px] font-bold text-white bg-[#0088cc] px-2 py-1.5 rounded-lg hover:bg-[#0099dd] disabled:opacity-50"
                              >
                                {buyingArtifact === artifact.key ? <Loader2 className="w-3 h-3 animate-spin" /> : `${artifact.costStars} ★`}
                              </motion.button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Main App ──────────────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [lang, setLang] = useState<Lang>("ua");
  const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(null);
  const [telegramUser, setTelegramUser] = useState<TelegramUserData | null>(null);
  const [dbUser, setDbUser] = useState<DbUser | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const sessionIdRef = useRef<number | null>(null);
  const sessionStartIsoRef = useRef<string | null>(null);
  // Ref always holds the latest dbUser to avoid stale closure in cleanup/intervals
  const dbUserRef = useRef<DbUser | null>(null);

  // Gamification modal state
  const [particles, setParticles] = useState<Particle[]>([]);
  const [showLuckySpin, setShowLuckySpin] = useState(false);
  const [showDailyRewards, setShowDailyRewards] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showGuilds, setShowGuilds] = useState(false);
  const [showLimitedArtifacts, setShowLimitedArtifacts] = useState(false);
  const [limitedArtifactsData, setLimitedArtifactsData] = useState<Array<{
    id: string; name: { ua: string; en: string }; description: { ua: string; en: string };
    image: string; xpBonus: number; rarity: string; availableUntil: string;
    totalSupply: number; claimedCount: number; costStars: number; isOwned: boolean;
  }>>([]);
  const [showSeasonPass, setShowSeasonPass] = useState(false);
  const [freeSpins, setFreeSpins] = useState(0);

  // Real gamification data
  const [dailyStreak, setDailyStreak] = useState<DailyStreak | null>(null);
  const [todayClaim, setTodayClaim] = useState<DailyClaim | null>(null);
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);
  const [allGuilds, setAllGuilds] = useState<GuildWithMembers[]>([]);
  const [userGuild, setUserGuild] = useState<GuildWithMembers | null>(null);
  const [leaderboardEntries, setLeaderboardEntries] = useState<{ rank: number; userId: string; telegramId: number; firstName: string; totalXP: number; totalTaps: number; streak: number; }[]>([]);
  const [activeSeason, setActiveSeason] = useState<Season | null>(null);
  const [userSeasonProgress, setUserSeasonProgress] = useState<UserSeasonProgress | null>(null);
  const [seasonTierClaims, setSeasonTierClaims] = useState<SeasonTierClaim[]>([]);

  // Initialize sounds on first interaction
  useEffect(() => {
    initSounds();
  }, []);

  useEffect(() => {
    dbUserRef.current = dbUser;
  }, [dbUser]);

  // ── Init Telegram + Auth + Session ────────────────────────────────────────

  useEffect(() => {
    const init = async () => {
      try {
        initTelegram();

        const user = getTelegramUser();

        if (user) {
          setTelegramUser(user);
          if (user.language_code === "uk" || user.language_code === "ua") setLang("ua");

          const profile = await museumAPI.authUser(user);
          setDbUser(profile);
          dbUserRef.current = profile;

          // Handle referral from start_param
          const startParam = getStartParam();
          if (startParam?.startsWith("ref_")) {
            const referrerTelegramId = parseInt(startParam.slice(4), 10);
            if (referrerTelegramId && referrerTelegramId !== user.id) {
              museumAPI.processReferral(referrerTelegramId, profile.id).catch(console.error);
            }
          }

          const sid = await museumAPI.startSession(profile.id);
          sessionIdRef.current = sid;
          sessionStartIsoRef.current = new Date().toISOString();

          const [s, spinData, achKeys] = await Promise.all([
            museumAPI.getStats(profile.id, lang),
            museumAPI.getLuckySpins(profile.id),
            museumAPI.getAchievementKeys(profile.id),
          ]);
          setStats(s);
          setFreeSpins(spinData.freeSpins);
          setUnlockedAchievements(achKeys);
        }
      } catch (err) {
        console.error("Init error:", err);
      } finally {
        setLoading(false);
      }
    };

    init();

    return () => {
      const sid = sessionIdRef.current;
      const user = dbUserRef.current;
      if (sid && user) {
        museumAPI.endSession(sid, user.id).catch(console.error);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Periodic session progress save (every 60s) ────────────────────────────

  useEffect(() => {
    const interval = setInterval(() => {
      const sid = sessionIdRef.current;
      const startIso = sessionStartIsoRef.current;
      if (sid && startIso) {
        museumAPI.updateSessionProgress(sid, startIso).catch(console.error);
      }
    }, 60_000);

    return () => clearInterval(interval);
  }, []);

  // ── Refresh stats when screen changes to profile ─────────────────────────

  const refreshStats = useCallback(async () => {
    if (!dbUser) return;
    try {
      const s = await museumAPI.getStats(dbUser.id, lang);
      setStats(s);
    } catch (err) {
      console.error("Refresh stats error:", err);
    }
  }, [dbUser, lang]);

  useEffect(() => {
    if (screen === "profile") refreshStats();
  }, [screen, refreshStats]);

  // ── Artifact view tracking ───────────────────────────────────────────────

  const handleArtifactView = useCallback(
    (artifactId: string) => {
      if (!dbUser) return;
      museumAPI.trackArtifactView(dbUser.id, artifactId).catch(console.error);
    },
    [dbUser]
  );

  // ── Donation callback ────────────────────────────────────────────────────

  const handleDonated = useCallback(() => {
    refreshStats();
  }, [refreshStats]);

  // ── Loading screen ───────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="w-12 h-12 border-[3px] border-[#ffd700]/30 border-t-[#ffd700] rounded-full" />
      </div>
    );
  }

  const navItems = [
    { id: "home" as Screen, icon: HomeIcon, label: TEXT[lang].nav.home },
    { id: "tap" as Screen, icon: MousePointerClick, label: TEXT[lang].nav.tap },
    { id: "museum" as Screen, icon: Landmark, label: TEXT[lang].nav.museum },
    { id: "profile" as Screen, icon: User, label: TEXT[lang].nav.profile },
    { id: "support" as Screen, icon: Heart, label: TEXT[lang].nav.support },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white relative overflow-x-hidden">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#0057b7]/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#ffd700]/5 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[#0a0a0f]/20 backdrop-blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-md mx-auto min-h-screen flex flex-col">
        {/* Content */}
        <div className="flex-1 p-4 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div key={screen} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
              {screen === "home" && <HomeScreen lang={lang} setSelectedArtifact={setSelectedArtifact} setScreen={setScreen} stats={stats} dbUser={dbUser} />}
              {screen === "tap" && <TapScreen lang={lang} dbUser={dbUser} stats={stats} onRefresh={refreshStats} />}
              {screen === "museum" && <NewMuseumScreen lang={lang} dbUser={dbUser} onRefresh={refreshStats} />}
              {screen === "timeline" && <TimelineScreen lang={lang} />}
              {screen === "profile" && <NewProfileScreen lang={lang} setLang={setLang} telegramUser={telegramUser} dbUser={dbUser} stats={stats} onRefresh={refreshStats} sessionStartIso={sessionStartIsoRef.current} onOpenLuckySpin={async () => { triggerHapticFeedback('light'); if (dbUser) { const spinData = await museumAPI.getLuckySpins(dbUser.id); setFreeSpins(spinData.freeSpins); } setShowLuckySpin(true); }} onOpenGuilds={async () => { triggerHapticFeedback('light'); if (dbUser) { const [myGuild, guilds] = await Promise.all([museumAPI.getUserGuild(dbUser.id), museumAPI.getGuilds()]); setUserGuild(myGuild); setAllGuilds(guilds); } setShowGuilds(true); }} onOpenSeasonPass={async () => { triggerHapticFeedback('light'); if (dbUser) { const season = await museumAPI.getActiveSeason(); setActiveSeason(season); if (season) { const progress = await museumAPI.getUserSeasonProgress(dbUser.id, season.id); setUserSeasonProgress(progress); const claims = await museumAPI.getSeasonTierClaims(progress.id); setSeasonTierClaims(claims); } } setShowSeasonPass(true); }} onOpenLimitedArtifacts={async () => { triggerHapticFeedback('light'); if (dbUser) { const data = await museumAPI.getLimitedArtifacts(dbUser.id); setLimitedArtifactsData(data); } setShowLimitedArtifacts(true); }} />}
              {screen === "support" && <SupportScreen lang={lang} dbUser={dbUser} onDonated={handleDonated} />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 z-50 px-6 pb-8">
          <div className="max-w-md mx-auto relative">
            <div className="absolute inset-0 bg-white/[0.03] backdrop-blur-[40px] border border-white/10 rounded-[32px] shadow-2xl" />
            <div className="relative flex items-center justify-around px-4 py-4">
              {navItems.map((item) => {
                const isActive = screen === item.id;
                return (
                  <button key={item.id} onClick={() => setScreen(item.id)} className="relative flex flex-col items-center gap-1.5 px-4 group">
                    <motion.div animate={isActive ? { y: -8, scale: 1.1 } : { y: 0, scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 20 }} className={`relative z-10 transition-colors duration-300 ${isActive ? "text-[#ffd700]" : "text-white/30 group-hover:text-white/60"}`}>
                      <item.icon className="w-6 h-6" />
                      {isActive && <motion.div layoutId="nav-glow" className="absolute -inset-4 bg-[#ffd700]/10 blur-xl rounded-full" />}
                    </motion.div>
                    {isActive && <motion.span initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="text-[10px] font-black text-[#ffd700] uppercase tracking-widest leading-none">{item.label}</motion.span>}
                    {isActive && <motion.div layoutId="nav-indicator" className="absolute -bottom-1 w-1 h-1 bg-[#ffd700] rounded-full shadow-[0_0_10px_#ffd700]" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Artifact Detail Modal */}
      <AnimatePresence>
        {selectedArtifact && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-[#0a0a0f]">
            <div className="h-full overflow-y-auto">
              <div className="max-w-md mx-auto">
                <div className="relative h-96">
                  <img src={selectedArtifact.image} alt={selectedArtifact.title[lang]} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/60 to-transparent" />
                  <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between">
                    <button onClick={() => setSelectedArtifact(null)} className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white"><ChevronLeft className="w-5 h-5" /></button>
                    <div className="flex items-center gap-2">
                      <button className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white"><Share2 className="w-4 h-4" /></button>
                      <button className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white"><Bookmark className="w-4 h-4" /></button>
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <GlassCard className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="px-2 py-1 rounded-full bg-[#ffd700]/20 text-[#ffd700] text-xs font-medium">{selectedArtifact.year}</div>
                        <div className="px-2 py-1 rounded-full bg-[#0057b7]/20 text-[#0057b7] text-xs font-medium">{selectedArtifact.category}</div>
                      </div>
                      <h1 className="text-2xl font-bold text-white mb-1">{selectedArtifact.title[lang]}</h1>
                      <p className="text-sm text-white/60">{selectedArtifact.era}</p>
                    </GlassCard>
                  </div>
                </div>
                <div className="p-4 space-y-5 pb-8">
                  <div>
                    <h2 className="text-xs uppercase tracking-wider text-white/50 mb-3 font-semibold">{lang === "ua" ? "Опис" : "Description"}</h2>
                    <p className="text-sm text-white/80 leading-relaxed">{selectedArtifact.description[lang]}</p>
                  </div>
                  {/* Related Artifacts */}
                  <div>
                    <h2 className="text-xs uppercase tracking-wider text-white/50 mb-3 font-semibold">{lang === "ua" ? "Схожі артефакти" : "Related Artifacts"}</h2>
                    <div className="grid grid-cols-2 gap-3">
                      {ARTIFACTS.filter((a) => a.id !== selectedArtifact.id && (a.era === selectedArtifact.era || a.category === selectedArtifact.category))
                        .slice(0, 4)
                        .map((artifact) => (
                          <div key={artifact.id} onClick={() => { setSelectedArtifact(artifact); handleArtifactView(artifact.id); }} className="cursor-pointer">
                            <GlassCard className="overflow-hidden hover:border-white/20 transition-all">
                              <div className="relative h-28 overflow-hidden">
                                <img src={artifact.image} alt={artifact.title[lang]} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                <div className="absolute bottom-2 left-2 right-2">
                                  <h3 className="text-white font-semibold text-xs mb-0.5 line-clamp-1">{artifact.title[lang]}</h3>
                                  <p className="text-white/60 text-[10px]">{artifact.year}</p>
                                </div>
                              </div>
                            </GlassCard>
                          </div>
                        ))}
                    </div>
                  </div>
                  <button className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#0057b7] to-[#ffd700] text-white font-semibold text-sm shadow-lg active:scale-95 flex items-center justify-center gap-2">
                    <Play className="w-4 h-4" />
                    {lang === "ua" ? "Віртуальний 3D перегляд" : "Virtual 3D View"}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gamification Modals */}
      <ParticleSystem particles={particles} onComplete={() => setParticles([])} />

      <AnimatePresence>
        {showLuckySpin && (
          <LuckySpin
            lang={lang}
            canSpin={freeSpins > 0}
            costXP={100}
            onSpin={async (reward) => {
              triggerHapticNotification('success');
              setFreeSpins(prev => Math.max(0, prev - 1));
              if (dbUser) {
                await museumAPI.consumeSpin(dbUser.id);
                await museumAPI.recordSpinReward(dbUser.id, reward.type, reward.value);
                refreshStats();
              }
            }}
            onPurchaseSpin={async () => {
              if (dbUser && stats && stats.totalXP >= 100) {
                await museumAPI.addXP(dbUser.id, -100);
                setFreeSpins(1);
                refreshStats();
              }
            }}
            onClose={() => setShowLuckySpin(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDailyRewards && dbUser && (
          <DailyRewards
            lang={lang}
            consecutiveDays={dailyStreak?.current_streak || 0}
            lastClaimDate={todayClaim?.claim_date || dailyStreak?.last_login_date || null}
            onClaim={async () => {
              const result = await museumAPI.claimDailyReward(dbUser.id);
              if (result.claimed) {
                const [streak, claim] = await Promise.all([
                  museumAPI.getDailyStreak(dbUser.id),
                  museumAPI.getTodayClaim(dbUser.id),
                ]);
                setDailyStreak(streak);
                setTodayClaim(claim);
                refreshStats();
              }
            }}
            onClose={() => setShowDailyRewards(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAchievements && (
          <AchievementsModal
            lang={lang}
            unlockedKeys={unlockedAchievements}
            stats={{ totalTaps: stats?.totalTaps || 0, totalXP: stats?.totalXP || 0, artifactsCount: stats?.artifactsViewed || 0, referralsCount: 0, streak: dailyStreak?.current_streak || 0 }}
            onClose={() => setShowAchievements(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showLeaderboard && (
          <Leaderboard
            lang={lang}
            myRank={leaderboardEntries.find(e => e.telegramId === (telegramUser?.id || 0))?.rank || 0}
            entries={leaderboardEntries}
            onClose={() => setShowLeaderboard(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showGuilds && (
          <Guilds
            lang={lang}
            currentGuild={userGuild ? {
              id: String(userGuild.id),
              name: userGuild.name,
              description: userGuild.description || '',
              icon: userGuild.icon,
              color: userGuild.color,
              leaderId: String(userGuild.leader_id),
              totalMembers: userGuild.member_count,
              maxMembers: userGuild.max_members || 50,
              totalXP: userGuild.total_xp,
              weeklyXP: userGuild.weekly_xp,
              rank: 1,
              trophies: Math.floor(userGuild.total_xp / 1000),
              joinType: (userGuild.join_type as 'open' | 'invite' | 'closed') || 'open',
              members: (userGuild.members || []).map(m => ({
                userId: String(m.user_id),
                telegramId: m.user_id,
                firstName: m.first_name || 'User',
                photoUrl: m.photo_url || undefined,
                role: m.role,
                totalXP: m.total_contribution,
                weeklyXP: m.weekly_xp,
              })),
            } : undefined}
            guilds={allGuilds.map((g, i) => ({
              id: String(g.id),
              name: g.name,
              description: g.description || '',
              icon: g.icon,
              color: g.color,
              leaderId: String(g.leader_id),
              totalMembers: g.member_count,
              maxMembers: g.max_members || 50,
              totalXP: g.total_xp,
              weeklyXP: g.weekly_xp,
              rank: i + 1,
              trophies: Math.floor(g.total_xp / 1000),
              joinType: (g.join_type as 'open' | 'invite' | 'closed') || 'open',
            }))}
            onJoinGuild={async (guildId) => {
              if (!dbUser) return;
              const result = await museumAPI.joinGuild(dbUser.id, parseInt(guildId));
              if (result.success) {
                const [myGuild, guilds] = await Promise.all([
                  museumAPI.getUserGuild(dbUser.id),
                  museumAPI.getGuilds(),
                ]);
                setUserGuild(myGuild);
                setAllGuilds(guilds);
              }
            }}
            onCreateGuild={async (name, icon, color) => {
              if (!dbUser) return;
              const result = await museumAPI.createGuild(dbUser.id, name, icon, color);
              if (result.success) {
                const [myGuild, guilds] = await Promise.all([
                  museumAPI.getUserGuild(dbUser.id),
                  museumAPI.getGuilds(),
                ]);
                setUserGuild(myGuild);
                setAllGuilds(guilds);
                refreshStats();
              }
            }}
            onLeaveGuild={async () => {
              if (!dbUser) return;
              await museumAPI.leaveGuild(dbUser.id);
              setUserGuild(null);
              const guilds = await museumAPI.getGuilds();
              setAllGuilds(guilds);
            }}
            onClose={() => setShowGuilds(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showLimitedArtifacts && dbUser && (
          <LimitedArtifactsModal
            lang={lang}
            artifacts={limitedArtifactsData}
            userXP={dbUser.total_xp || 0}
            userStars={0}
            onClaim={async (artifactId) => {
              const result = await museumAPI.claimLimitedArtifact(dbUser.id, artifactId);
              if (result.success) {
                const data = await museumAPI.getLimitedArtifacts(dbUser.id);
                setLimitedArtifactsData(data);
                refreshStats();
              }
            }}
            onClose={() => setShowLimitedArtifacts(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSeasonPass && (
          <SeasonPass
            lang={lang}
            season={activeSeason ? {
              id: activeSeason.id,
              name: { ua: activeSeason.name_ua, en: activeSeason.name_en },
              description: activeSeason.name_en,
              startDate: activeSeason.start_date,
              endDate: activeSeason.end_date,
              totalTiers: activeSeason.total_tiers,
              rewards: Array.from({ length: activeSeason.total_tiers }, (_, i) => {
                const tier = i + 1;
                const claimedFree = seasonTierClaims.some(c => c.tier === tier && c.claim_type === 'free');
                const claimedPremium = seasonTierClaims.some(c => c.tier === tier && c.claim_type === 'premium');
                return {
                  tier,
                  freeReward: { type: 'xp' as const, value: tier * 50 },
                  premiumReward: { type: 'xp' as const, value: tier * 100 },
                  claimedFree,
                  claimedPremium,
                };
              }),
              hasPremium: userSeasonProgress?.has_premium || false,
              currentProgress: userSeasonProgress?.current_xp || 0,
              totalProgress: activeSeason.total_tiers * 1000,
              premiumCost: 500,
            } : {
              id: 'default',
              name: { ua: 'Сезон Відродження', en: 'Season of Revival' },
              description: 'Season of Revival',
              startDate: new Date().toISOString(),
              endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
              totalTiers: 10,
              rewards: Array.from({ length: 10 }, (_, i) => ({
                tier: i + 1,
                freeReward: { type: 'xp' as const, value: 50 * (i + 1) },
                premiumReward: { type: 'xp' as const, value: 100 * (i + 1) },
                claimedFree: false,
                claimedPremium: false,
              })),
              hasPremium: false,
              currentProgress: stats?.totalXP || 0,
              totalProgress: 10000,
              premiumCost: 500,
            }}
            onClaimReward={async (tier, type) => {
              if (!dbUser || !userSeasonProgress) return;
              const result = await museumAPI.claimSeasonTier(dbUser.id, userSeasonProgress.id, tier, type);
              if (result.claimed) {
                const claims = await museumAPI.getSeasonTierClaims(userSeasonProgress.id);
                setSeasonTierClaims(claims);
                refreshStats();
              }
            }}
            onBuyPremium={async () => {
              if (!dbUser || !activeSeason) return;
              const costStars = 500;

              try {
                if (window.Telegram?.WebApp) {
                  const WebApp = window.Telegram.WebApp;
                  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
                  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
                  const invoiceRes = await fetch(`${supabaseUrl}/functions/v1/stars-invoice`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${supabaseKey}`,
                      apikey: supabaseKey,
                    },
                    body: JSON.stringify({
                      title: lang === "ua" ? "Сезон Преміум" : "Season Premium",
                      description: lang === "ua"
                        ? `Преміум доступ на сезон — ${costStars} Stars`
                        : `Premium access for the season — ${costStars} Stars`,
                      prices: [{ label: "Season Premium", amount: costStars }],
                      payload: `season_premium_${activeSeason.id}_${dbUser.id}_${Date.now()}`,
                    }),
                  });

                  if (!invoiceRes.ok) {
                    console.error("Invoice creation failed");
                    return;
                  }

                  const { invoice_link, error: invError } = await invoiceRes.json();
                  if (invError || !invoice_link) {
                    console.error("No invoice link:", invError);
                    return;
                  }

                  WebApp.openInvoice(invoice_link, async (status: string) => {
                    try {
                      if (status === "paid") {
                        const result = await museumAPI.buySeasonPremium(dbUser.id, activeSeason.id);
                        if (result.success) {
                          const progress = await museumAPI.getUserSeasonProgress(dbUser.id, activeSeason.id);
                          setUserSeasonProgress(progress);
                          await museumAPI.createDonation(dbUser.id, costStars, "XTR", `telegram_stars_season_premium_${activeSeason.id}`);
                          refreshStats();
                          if (WebApp.HapticFeedback) {
                            WebApp.HapticFeedback.notificationOccurred("success");
                          }
                        }
                      }
                    } catch (err) {
                      console.error("Season premium payment callback error:", err);
                    }
                  });
                } else {
                  // Test mode
                  const result = await museumAPI.buySeasonPremium(dbUser.id, activeSeason.id);
                  if (result.success) {
                    const progress = await museumAPI.getUserSeasonProgress(dbUser.id, activeSeason.id);
                    setUserSeasonProgress(progress);
                  }
                }
              } catch (err) {
                console.error("Buy season premium error:", err);
              }
            }}
            onClose={() => setShowSeasonPass(false)}
          />
        )}
      </AnimatePresence>

    </div>
  );
}

