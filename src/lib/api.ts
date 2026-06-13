import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase env vars.");
}

const supabase = createClient(supabaseUrl, supabaseKey);

export interface UserProfile {
  id: number;
  telegram_id: number;
  username: string | null;
  first_name: string;
  last_name: string | null;
  photo_url: string | null;
  language_code: string;
  total_xp: number;
  created_at: string;
  last_visit: string;
}

export interface TapGameState {
  id: number;
  user_id: number;
  tap_level: number;
  total_taps: number;
  autoclicker_until: string | null;
  active_artifact: string;
}

// 20-level progression: upgradeCostXP = cost to leave this level (go to next)
export const TAP_LEVELS = [
  { level: 1,  xpPerTap: 1,  upgradeCostXP: 100     },
  { level: 2,  xpPerTap: 2,  upgradeCostXP: 300     },
  { level: 3,  xpPerTap: 3,  upgradeCostXP: 700     },
  { level: 4,  xpPerTap: 4,  upgradeCostXP: 1500    },
  { level: 5,  xpPerTap: 5,  upgradeCostXP: 3000    },
  { level: 6,  xpPerTap: 6,  upgradeCostXP: 6000    },
  { level: 7,  xpPerTap: 7,  upgradeCostXP: 12000   },
  { level: 8,  xpPerTap: 8,  upgradeCostXP: 24000   },
  { level: 9,  xpPerTap: 9,  upgradeCostXP: 50000   },
  { level: 10, xpPerTap: 10, upgradeCostXP: 80000   },
  { level: 11, xpPerTap: 12, upgradeCostXP: 120000  },
  { level: 12, xpPerTap: 15, upgradeCostXP: 180000  },
  { level: 13, xpPerTap: 18, upgradeCostXP: 250000  },
  { level: 14, xpPerTap: 22, upgradeCostXP: 350000  },
  { level: 15, xpPerTap: 27, upgradeCostXP: 500000  },
  { level: 16, xpPerTap: 33, upgradeCostXP: 700000  },
  { level: 17, xpPerTap: 40, upgradeCostXP: 1000000 },
  { level: 18, xpPerTap: 50, upgradeCostXP: 1500000 },
  { level: 19, xpPerTap: 65, upgradeCostXP: 2500000 },
  { level: 20, xpPerTap: 80, upgradeCostXP: 0       },
];
export const MAX_TAP_LEVEL = 20;

export interface AutoclikerOption {
  key: string;
  durationMin: number;
  costStars: number;
  label: { ua: string; en: string };
}

export const AUTOCLICKER_OPTIONS: AutoclikerOption[] = [
  { key: "15min",  durationMin: 15,   costStars: 25,  label: { ua: "15 хвилин", en: "15 minutes" } },
  { key: "1hour",  durationMin: 60,   costStars: 75,  label: { ua: "1 година",  en: "1 hour"     } },
  { key: "6hours", durationMin: 360,  costStars: 250, label: { ua: "6 годин",   en: "6 hours"    } },
  { key: "24hours",durationMin: 1440, costStars: 500, label: { ua: "24 години", en: "24 hours"   } },
];

export interface TapArtifact {
  key: string;
  name: { ua: string; en: string };
  xpBonus: number;
  costXP: number;
  costStars: number;
  isStarter?: boolean;
  image: string;
  effects?: {
    autoclickerSpeed?: number; // multiplier (e.g. 1.5 = 50% faster autoclicker)
    doubleRewardChance?: number; // 0.05 = 5% chance to double XP on tap
    streakBonus?: number; // extra XP per day of streak
    energyRecovery?: number; // % faster energy recovery (future use)
  };
}

export const TAP_ARTIFACTS: TapArtifact[] = [
  {
    key: "kyiv_coin",
    name: { ua: "Київська Монета", en: "Kyiv Coin" },
    xpBonus: 2,
    costXP: 0,
    costStars: 0,
    isStarter: true,
    image: "https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    key: "cossack_saber",
    name: { ua: "Козацька Шабля", en: "Cossack Saber" },
    xpBonus: 3,
    costXP: 800,
    costStars: 0,
    image: "https://images.pexels.com/photos/6045028/pexels-photo-6045028.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    key: "vyshyvanka_amulet",
    name: { ua: "Оберіг Вишиванки", en: "Vyshyvanka Amulet" },
    xpBonus: 5,
    costXP: 0,
    costStars: 25,
    image: "https://images.pexels.com/photos/3621188/pexels-photo-3621188.jpeg?auto=compress&cs=tinysrgb&w=400",
    effects: { streakBonus: 2 },
  },
  {
    key: "pysanka_power",
    name: { ua: "Сила Писанки", en: "Pysanka Power" },
    xpBonus: 10,
    costXP: 0,
    costStars: 50,
    image: "https://images.pexels.com/photos/3817526/pexels-photo-3817526.jpeg?auto=compress&cs=tinysrgb&w=400",
    effects: { doubleRewardChance: 0.03 },
  },
  {
    key: "golden_crown",
    name: { ua: "Золота Корона", en: "Golden Crown" },
    xpBonus: 20,
    costXP: 0,
    costStars: 100,
    image: "https://images.pexels.com/photos/3109671/pexels-photo-3109671.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    key: "hetman_mace",
    name: { ua: "Булава Гетьмана", en: "Hetman's Mace" },
    xpBonus: 50,
    costXP: 0,
    costStars: 250,
    image: "https://images.pexels.com/photos/3889742/pexels-photo-3889742.jpeg?auto=compress&cs=tinysrgb&w=400",
    effects: { autoclickerSpeed: 1.25 },
  },
  {
    key: "trident_independence",
    name: { ua: "Тризуб Незалежності", en: "Trident of Independence" },
    xpBonus: 100,
    costXP: 0,
    costStars: 500,
    image: "https://images.pexels.com/photos/1543793/pexels-photo-1543793.jpeg?auto=compress&cs=tinysrgb&w=400",
    effects: { doubleRewardChance: 0.05 },
  },
  {
    key: "orlyk_constitution",
    name: { ua: "Конституція Орлика", en: "Orlyk Constitution" },
    xpBonus: 150,
    costXP: 0,
    costStars: 750,
    image: "https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg?auto=compress&cs=tinysrgb&w=400",
    effects: { streakBonus: 5 },
  },
  {
    key: "peresopnytsia",
    name: { ua: "Пересопницьке Євангеліє", en: "Peresopnytsia Gospel" },
    xpBonus: 250,
    costXP: 0,
    costStars: 1000,
    image: "https://images.pexels.com/photos/1906658/pexels-photo-1906658.jpeg?auto=compress&cs=tinysrgb&w=400",
    effects: { autoclickerSpeed: 1.5 },
  },
  {
    key: "hetman_treasure",
    name: { ua: "Скарб Гетьмана", en: "Hetman's Treasure" },
    xpBonus: 500,
    costXP: 0,
    costStars: 1500,
    image: "https://images.pexels.com/photos/1545587/pexels-photo-1545587.jpeg?auto=compress&cs=tinysrgb&w=400",
    effects: { doubleRewardChance: 0.10 },
  },
  {
    key: "indestructible_symbol",
    name: { ua: "Символ Незламності", en: "Symbol of Indestructibility" },
    xpBonus: 1000,
    costXP: 0,
    costStars: 2500,
    image: "https://images.pexels.com/photos/1209843/pexels-photo-1209843.jpeg?auto=compress&cs=tinysrgb&w=400",
    effects: { autoclickerSpeed: 2.0, doubleRewardChance: 0.15 },
  },
];

// Key of the free starter artifact
export const STARTER_ARTIFACT = "kyiv_coin";

export interface UserStats {
  totalMinutes: number;
  visitCount: number;
  artifactsViewed: number;
  totalDonated: number;
  totalXP: number;
  level: number;
  rankKey: string;
  rankName: string;
  nextLevelXP: number;
  achievements: string[];
}

// ── Stage 2&3 Types ────────────────────────────────────────────────────────────

export type ArtifactCategory = "kyivan_rus" | "cossack_era" | "unr" | "modern_ukraine";
export type ArtifactRarity = "common" | "rare" | "epic" | "legendary" | "mythic";

export interface Guild {
  id: number;
  name: string;
  icon: string;
  color: string;
  leader_id: number;
  total_xp: number;
  weekly_xp: number;
  max_members: number;
  description?: string;
  join_type?: "open" | "invite" | "closed";
  required_xp?: number;
  trophies?: number;
}

export interface GuildMember {
  user_id: number;
  guild_id: number;
  role: "leader" | "coleader" | "elder" | "member";
  weekly_xp: number;
  total_contribution: number;
  first_name?: string;
  photo_url?: string;
}

export interface GuildWithMembers extends Guild {
  member_count: number;
  members?: GuildMember[];
}

export interface SpinResult {
  freeSpins: number;
  lastFreeSpinDate: string | null;
}

export interface Season {
  id: string;
  name_ua: string;
  name_en: string;
  start_date: string;
  end_date: string;
  total_tiers: number;
}

export interface UserSeasonProgress {
  id: number;
  user_id: number;
  season_id: string;
  current_xp: number;
  has_premium: boolean;
}

export interface SeasonTierClaim {
  id: number;
  user_season_id: number;
  tier: number;
  claim_type: "free" | "premium";
}

export interface MuseumArtifact {
  id: string;
  category: ArtifactCategory;
  rarity: ArtifactRarity;
  title_ua: string;
  title_en: string;
  description_ua: string;
  description_en: string;
  history_ua: string;
  history_en: string;
  image: string;
  year: number;
  sort_order: number;
}

export interface MuseumArticle {
  id: string;
  category: ArtifactCategory;
  title_ua: string;
  title_en: string;
  content_ua: string;
  content_en: string;
  required_views: number;
  sort_order: number;
}

export interface MuseumProgress {
  user_id: number;
  category: ArtifactCategory;
  artifacts_viewed: number;
  articles_unlocked: number;
  collection_completed: boolean;
}

export interface DailyQuest {
  id: number;
  quest_key: string;
  target_count: number;
  reward_xp: number;
  title_ua: string;
  title_en: string;
  quest_date: string;
}

export interface DailyQuestProgress {
  id: number;
  user_id: number;
  daily_quest_id: number;
  current_count: number;
  completed: boolean;
  claimed: boolean;
}

export const DAILY_QUEST_TEMPLATES: Array<{
  quest_key: string;
  targetRange: [number, number];
  rewardRange: [number, number];
  title_ua: string;
  title_en: string;
}> = [
  { quest_key: "daily_taps", targetRange: [500, 2000], rewardRange: [25, 75], title_ua: "Зроби {n} тапів", title_en: "Make {n} taps" },
  { quest_key: "daily_view_artifacts", targetRange: [3, 8], rewardRange: [25, 50], title_ua: "Переглянь {n} артефактів", title_en: "View {n} artifacts" },
  { quest_key: "daily_read_articles", targetRange: [1, 3], rewardRange: [25, 50], title_ua: "Прочитай {n} статей", title_en: "Read {n} articles" },
  { quest_key: "daily_spin", targetRange: [1, 1], rewardRange: [50, 50], title_ua: "Зроби 1 спін", title_en: "Do 1 spin" },
  { quest_key: "daily_claim", targetRange: [1, 1], rewardRange: [25, 25], title_ua: "Забери щоденну нагороду", title_en: "Claim daily reward" },
];

export interface ReferralStats {
  invitedCount: number;
  rewards: ReferralReward[];
  nextMilestone: number | null;
}

export interface ReferralReward {
  milestone: number;
  reward_type: string;
  reward_key: string;
}

export interface DailyStreak {
  current_streak: number;
  longest_streak: number;
  last_login_date: string;
}

export interface DailyClaim {
  claim_date: string;
  streak_day: number;
  reward_type: string;
  reward_amount: number;
}

export interface WeeklyQuest {
  id: string;
  quest_type: string;
  target_count: number;
  reward_xp: number;
  title_ua: string;
  title_en: string;
  week_start: string;
  week_end: string;
}

export interface QuestProgress {
  quest_id: string;
  current_count: number;
  completed: boolean;
  claimed: boolean;
}

export interface LeaderboardEntry {
  user_id: number;
  first_name: string;
  username: string | null;
  total_xp: number;
  artifacts_viewed: number;
  rank: number;
}

export const CATEGORY_META: Record<ArtifactCategory, { ua: string; en: string; icon: string; color: string }> = {
  kyivan_rus: { ua: "Київська Русь", en: "Kyivan Rus", icon: "👑", color: "#ffd700" },
  cossack_era: { ua: "Козацька Доба", en: "Cossack Era", icon: "⚔️", color: "#c0392b" },
  unr: { ua: "УНР", en: "UNR", icon: "📜", color: "#0057b7" },
  modern_ukraine: { ua: "Сучасна Україна", en: "Modern Ukraine", icon: "🇺🇦", color: "#ffd700" },
};

export const RARITY_META: Record<ArtifactRarity, { ua: string; en: string; color: string; glow: string }> = {
  common: { ua: "Звичайний", en: "Common", color: "#9ca3af", glow: "" },
  rare: { ua: "Рідкісний", en: "Rare", color: "#3b82f6", glow: "0 0 8px rgba(59,130,246,0.4)" },
  epic: { ua: "Епічний", en: "Epic", color: "#a855f7", glow: "0 0 12px rgba(168,85,247,0.4)" },
  legendary: { ua: "Легендарний", en: "Legendary", color: "#ffd700", glow: "0 0 16px rgba(255,215,0,0.5)" },
  mythic: { ua: "Міфічний", en: "Mythic", color: "#ef4444", glow: "0 0 20px rgba(239,68,68,0.6)" },
};

export const UNIFIED_ACHIEVEMENTS: Array<{
  key: string;
  ua: string;
  en: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  xpReward: number;
  condition?: { type: string; value: number };
}> = [
  // Museum achievements (from ProfileScreen)
  { key: "FIRST_VISIT", ua: "Перший візит", en: "First Visit", rarity: "common", xpReward: 10 },
  { key: "FIRST_ARTIFACT_VIEW", ua: "Перший артефакт", en: "First Artifact", rarity: "common", xpReward: 25 },
  { key: "ONE_HOUR", ua: "Година в музеї", en: "One Hour", rarity: "rare", xpReward: 100 },
  { key: "TEN_ARTIFACTS", ua: "10 артефактів", en: "10 Artifacts", rarity: "rare", xpReward: 100 },
  { key: "ALL_ARTIFACTS", ua: "Всі артефакти", en: "All Artifacts", rarity: "legendary", xpReward: 500 },
  { key: "FIRST_ARTICLE", ua: "Перша стаття", en: "First Article", rarity: "rare", xpReward: 50 },
  // Tap achievements (from Achievements.tsx)
  { key: "FIRST_TAP", ua: "Перший Крок", en: "First Step", rarity: "common", xpReward: 10, condition: { type: "taps", value: 1 } },
  { key: "TAP_100", ua: "Початківець", en: "Beginner", rarity: "common", xpReward: 50, condition: { type: "taps", value: 100 } },
  { key: "TAP_1000", ua: "Енергетик", en: "Energetic", rarity: "rare", xpReward: 200, condition: { type: "taps", value: 1000 } },
  { key: "TAP_10000", ua: "Тап-Майстер", en: "Tap Master", rarity: "epic", xpReward: 500, condition: { type: "taps", value: 10000 } },
  // XP achievements
  { key: "XP_1000", ua: "Колекціонер", en: "Collector", rarity: "rare", xpReward: 100, condition: { type: "xp", value: 1000 } },
  { key: "XP_10000", ua: "Мільйонер XP", en: "XP Millionaire", rarity: "legendary", xpReward: 1000, condition: { type: "xp", value: 10000 } },
  // Artifact purchase achievements
  { key: "ARTIFACTS_5", ua: "Збирач", en: "Gatherer", rarity: "common", xpReward: 100, condition: { type: "artifacts", value: 5 } },
  { key: "ARTIFACTS_ALL", ua: "Повна Колекція", en: "Full Collection", rarity: "legendary", xpReward: 2000, condition: { type: "artifacts", value: 11 } },
  // Social achievements
  { key: "FIRST_REFERRAL", ua: "Перший Друг", en: "First Friend", rarity: "rare", xpReward: 200, condition: { type: "referrals", value: 1 } },
  { key: "REFERRALS_10", ua: "Інфлюенсер", en: "Influencer", rarity: "epic", xpReward: 500, condition: { type: "referrals", value: 10 } },
  // Donation achievements
  { key: "FIRST_DONATION", ua: "Перший Внесок", en: "First Contribution", rarity: "common", xpReward: 50, condition: { type: "donated", value: 1 } },
  { key: "DONATED_100", ua: "Меценат 100", en: "Patron 100", rarity: "rare", xpReward: 200, condition: { type: "donated", value: 100 } },
  { key: "DONATED_1000", ua: "Меценат 1000", en: "Patron 1000", rarity: "epic", xpReward: 500, condition: { type: "donated", value: 1000 } },
  // Streak achievements
  { key: "STREAK_7", ua: "Серія 7 днів", en: "7-Day Streak", rarity: "rare", xpReward: 300, condition: { type: "streak", value: 7 } },
  { key: "STREAK_30", ua: "Серія 30 днів", en: "30-Day Streak", rarity: "legendary", xpReward: 1000, condition: { type: "streak", value: 30 } },
  // Collection achievements
  { key: "COLLECTION_KYIVAN_RUS", ua: "Колекція: Київська Русь", en: "Collection: Kyivan Rus", rarity: "epic", xpReward: 200 },
  { key: "COLLECTION_COSSACK_ERA", ua: "Колекція: Козацька Доба", en: "Collection: Cossack Era", rarity: "epic", xpReward: 200 },
  { key: "COLLECTION_UNR", ua: "Колекція: УНР", en: "Collection: UNR", rarity: "epic", xpReward: 200 },
  { key: "COLLECTION_MODERN_UKRAINE", ua: "Колекція: Сучасна", en: "Collection: Modern", rarity: "epic", xpReward: 200 },
];

export const REFERRAL_MILESTONES = [
  { count: 1, reward_type: "artifact", reward_key: "ref_common_1", label: { ua: "Артефакт", en: "Artifact" } },
  { count: 5, reward_type: "xp_boost", reward_key: "x2_xp_15min", label: { ua: "x2 XP 15хв", en: "x2 XP 15min" } },
  { count: 10, reward_type: "autoclicker", reward_key: "free_1hr", label: { ua: "Автоклікер 1год", en: "Autoclicker 1hr" } },
  { count: 25, reward_type: "artifact", reward_key: "ref_rare_1", label: { ua: "Рідкісний артефакт", en: "Rare Artifact" } },
  { count: 50, reward_type: "artifact", reward_key: "ref_epic_1", label: { ua: "Епічний артефакт", en: "Epic Artifact" } },
  { count: 100, reward_type: "artifact", reward_key: "ref_legendary_1", label: { ua: "Легендарний артефакт", en: "Legendary Artifact" } },
];

export const DAILY_REWARDS = [
  { day: 1, reward_type: "xp", amount: 25, label: { ua: "25 XP", en: "25 XP" } },
  { day: 3, reward_type: "xp", amount: 100, label: { ua: "100 XP", en: "100 XP" } },
  { day: 7, reward_type: "xp_boost", amount: 2, label: { ua: "x2 XP 15хв", en: "x2 XP 15min" } },
  { day: 14, reward_type: "artifact", amount: 1, label: { ua: "Рідкісний артефакт", en: "Rare Artifact" } },
  { day: 30, reward_type: "artifact", amount: 1, label: { ua: "Епічний артефакт", en: "Epic Artifact" } },
];

const RANK_THRESHOLDS = [
  { minXP: 0,        key: "novice",      ua: "Новачок",              en: "Novice",              nextXP: 100     },
  { minXP: 100,      key: "explorer",    ua: "Дослідник",            en: "Explorer",            nextXP: 500     },
  { minXP: 500,      key: "seeker",      ua: "Шукач",               en: "Seeker",              nextXP: 1500    },
  { minXP: 1500,     key: "historian",   ua: "Історик",             en: "Historian",           nextXP: 5000    },
  { minXP: 5000,     key: "curator",     ua: "Зберігач",            en: "Curator",             nextXP: 15000   },
  { minXP: 15000,    key: "patron",      ua: "Патрон",              en: "Patron",              nextXP: 50000   },
  { minXP: 50000,    key: "guardian",    ua: "Охоронець",           en: "Guardian",            nextXP: 150000  },
  { minXP: 150000,   key: "legend",      ua: "Легенда музею",       en: "Museum Legend",       nextXP: 500000  },
  { minXP: 500000,   key: "hero",        ua: "Герой",               en: "Hero",                nextXP: 1500000 },
  { minXP: 1500000,  key: "champion",    ua: "Чемпіон",             en: "Champion",            nextXP: 5000000 },
  { minXP: 5000000,  key: "immortal",    ua: "Безсмертний",         en: "Immortal",            nextXP: 15000000},
  { minXP: 15000000, key: "founder",     ua: "Засновник",           en: "Founder",             nextXP: 50000000},
];

function getRank(totalXP: number, lang: "ua" | "en") {
  let rank = RANK_THRESHOLDS[0];
  for (const r of RANK_THRESHOLDS) {
    if (totalXP >= r.minXP) rank = r;
  }
  return {
    key: rank.key,
    name: lang === "ua" ? rank.ua : rank.en,
    nextLevelXP: rank.nextXP,
  };
}

export class MuseumAPI {
  // ── Auth ──────────────────────────────────────────────────────────────────

  async authUser(telegramUser: {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    language_code?: string;
    photo_url?: string;
  }): Promise<UserProfile> {
    const { data: existing, error: findError } = await supabase
      .from("users")
      .select("*")
      .eq("telegram_id", telegramUser.id)
      .maybeSingle();

    if (findError) {
      console.error("Find user error:", findError.message, findError.details);
    }

    if (existing) {
      const { data, error } = await supabase
        .from("users")
        .update({ last_visit: new Date().toISOString() })
        .eq("id", existing.id)
        .select()
        .single();
      if (error) console.error("Update user error:", error.message);
      return data || existing;
    }

    const { data, error } = await supabase
      .from("users")
      .insert([{
        telegram_id: telegramUser.id,
        first_name: telegramUser.first_name,
        last_name: telegramUser.last_name || null,
        username: telegramUser.username || null,
        language_code: telegramUser.language_code || "en",
        photo_url: telegramUser.photo_url || null,
        total_xp: 0,
      }])
      .select()
      .single();

    if (error) {
      console.error("Create user error:", error.message, error.details, error.hint);
      throw error;
    }

    await this.awardAchievement(data.id, "FIRST_VISIT");
    return data;
  }

  // ── Profile & Stats ───────────────────────────────────────────────────────

  async getProfile(telegramId: number): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("telegram_id", telegramId)
      .maybeSingle();
    if (error) console.error("Get profile error:", error);
    return data;
  }

  async getStats(userId: number, lang: "ua" | "en"): Promise<UserStats> {
    const { data: sessions } = await supabase
      .from("activity_sessions")
      .select("minutes_spent")
      .eq("user_id", userId);

    const totalMinutes = (sessions || []).reduce(
      (sum: number, s: { minutes_spent: number | null }) => sum + (s.minutes_spent || 0),
      0
    );
    const visitCount = (sessions || []).length;

    const { data: views } = await supabase
      .from("artifact_views")
      .select("artifact_id")
      .eq("user_id", userId);

    const artifactsViewed = new Set((views || []).map((v: { artifact_id: string }) => v.artifact_id)).size;

    const { data: dons } = await supabase
      .from("donations")
      .select("amount")
      .eq("user_id", userId)
      .eq("status", "completed");

    const totalDonated = (dons || []).reduce(
      (sum: number, d: { amount: number }) => sum + Number(d.amount),
      0
    );

    const { data: achs } = await supabase
      .from("achievements")
      .select("achievement_key")
      .eq("user_id", userId);

    const achievements = (achs || []).map((a: { achievement_key: string }) => a.achievement_key);

    const { data: user } = await supabase
      .from("users")
      .select("total_xp")
      .eq("id", userId)
      .maybeSingle();

    const liveXP = user?.total_xp || 0;
    const rank = getRank(liveXP, lang);

    return {
      totalMinutes,
      visitCount,
      artifactsViewed,
      totalDonated,
      totalXP: liveXP,
      level: RANK_THRESHOLDS.findIndex((r) => liveXP >= r.minXP) + 1,
      rankKey: rank.key,
      rankName: rank.name,
      nextLevelXP: rank.nextLevelXP,
      achievements,
    };
  }

  // ── Sessions ───────────────────────────────────────────────────────────────

  async startSession(userId: number): Promise<number | null> {
    const { data, error } = await supabase
      .from("activity_sessions")
      .insert([{ user_id: userId, session_start: new Date().toISOString() }])
      .select("id")
      .single();

    if (error) {
      console.error("Start session error:", error);
      return null;
    }
    return data.id;
  }

  async updateSessionProgress(sessionId: number, sessionStartIso: string): Promise<void> {
    const minutesSpent = Math.max(1, Math.floor((Date.now() - new Date(sessionStartIso).getTime()) / 60000));
    await supabase
      .from("activity_sessions")
      .update({ minutes_spent: minutesSpent })
      .eq("id", sessionId);
  }

  async endSession(sessionId: number, userId: number): Promise<void> {
    const { data: session } = await supabase
      .from("activity_sessions")
      .select("session_start")
      .eq("id", sessionId)
      .maybeSingle();

    if (!session) return;

    const minutesSpent = Math.max(
      1,
      Math.floor((Date.now() - new Date(session.session_start).getTime()) / 60000)
    );

    await supabase
      .from("activity_sessions")
      .update({
        session_end: new Date().toISOString(),
        minutes_spent: minutesSpent,
      })
      .eq("id", sessionId);

    await this.addXPAtomic(userId, minutesSpent);

    if (minutesSpent >= 60) {
      await this.awardAchievement(userId, "ONE_HOUR");
    }
  }

  // ── Artifact Views ─────────────────────────────────────────────────────────

  async trackArtifactView(userId: number, artifactId: string): Promise<void> {
    const { data: existing } = await supabase
      .from("artifact_views")
      .select("id")
      .eq("user_id", userId)
      .eq("artifact_id", artifactId)
      .maybeSingle();

    if (existing) return;

    await supabase.from("artifact_views").insert([
      { user_id: userId, artifact_id: artifactId, viewed_at: new Date().toISOString() },
    ]);

    await this.addXPAtomic(userId, 5);

    const { data: views } = await supabase
      .from("artifact_views")
      .select("artifact_id")
      .eq("user_id", userId);

    const uniqueArtifacts = new Set((views || []).map((v: { artifact_id: string }) => v.artifact_id));
    if (uniqueArtifacts.size >= 10) {
      await this.awardAchievement(userId, "TEN_ARTIFACTS");
    }
  }

  // ── Donations ──────────────────────────────────────────────────────────────

  async createDonation(
    userId: number,
    amount: number,
    currency: string = "XTR",
    paymentMethod: string = "telegram_stars",
    transactionId?: string
  ): Promise<void> {
    const { error } = await supabase.from("donations").insert([
      {
        user_id: userId,
        amount,
        currency,
        payment_method: paymentMethod,
        transaction_id: transactionId || `stars_${Date.now()}`,
        status: "completed",
      },
    ]);

    if (error) {
      console.error("Create donation error:", error);
      throw error;
    }

    // Diminishing XP from Stars: first 50 = 1:1, then 0.5:1
    const xpFromDonation = Math.floor(amount <= 50 ? amount : 50 + (amount - 50) * 0.5);
    await this.addXPAtomic(userId, xpFromDonation);
    await this.awardAchievement(userId, "FIRST_DONATION");

    const { data: dons } = await supabase
      .from("donations")
      .select("amount")
      .eq("user_id", userId)
      .eq("status", "completed");

    const total = (dons || []).reduce((s: number, d: { amount: number }) => s + Number(d.amount), 0);
    if (total >= 100) await this.awardAchievement(userId, "DONATED_100");
    if (total >= 1000) await this.awardAchievement(userId, "DONATED_1000");
  }

  async getGlobalDonationStats(): Promise<{ totalRaised: number; donorsCount: number; totalUsers: number }> {
    const [donationsResult, usersResult] = await Promise.all([
      supabase.from("donations").select("amount, user_id").eq("status", "completed"),
      supabase.from("users").select("id", { count: "exact", head: true }),
    ]);

    const data = donationsResult.data || [];
    const totalRaised = data.reduce((sum: number, d: { amount: number }) => sum + Number(d.amount), 0);
    const donorsCount = new Set(data.map((d: { user_id: number }) => d.user_id)).size;
    const totalUsers = usersResult.count || 0;

    return { totalRaised, donorsCount, totalUsers };
  }

  async getDonationHistory(userId: number) {
    const { data, error } = await supabase
      .from("donations")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) console.error("Get donations error:", error);
    return data || [];
  }

  // ── Tap Game ──────────────────────────────────────────────────────────────

  async getTapState(userId: number): Promise<TapGameState | null> {
    const { data, error } = await supabase
      .from("tap_game_state")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("Get tap state error:", error.message);
      return null;
    }
    return data;
  }

  async initTapState(userId: number): Promise<TapGameState> {
    const existing = await this.getTapState(userId);
    if (existing) return existing;

    const { data, error } = await supabase
      .from("tap_game_state")
      .insert([{ user_id: userId, tap_level: 1, total_taps: 0, active_artifact: STARTER_ARTIFACT }])
      .select()
      .single();

    if (error) {
      console.error("Init tap state error:", error.message);
      throw error;
    }

    // Give free starter artifact (ignore duplicate if already exists)
    const { error: artifactError } = await supabase
      .from("tap_artifacts")
      .upsert(
        [{ user_id: userId, artifact_key: STARTER_ARTIFACT }],
        { onConflict: "user_id,artifact_key" }
      );
    if (artifactError) console.error("Starter artifact upsert error:", artifactError.message);

    return data;
  }

  async recordTapBatch(userId: number, count: number, totalXP: number): Promise<{ newTaps: number; newXp: number }> {
    const { data: xpResult } = await supabase.rpc("atomic_add_xp", {
      p_user_id: userId,
      p_xp: totalXP,
    });

    const { data: tapResult } = await supabase.rpc("atomic_add_taps", {
      p_user_id: userId,
      p_count: count,
    });

    // Update quest progress for tap_count
    await this.updateQuestProgress(userId, "tap_count", count);
    await this.updateDailyQuestProgress(userId, "daily_taps", count);

    return { newTaps: tapResult || 0, newXp: xpResult || 0 };
  }

  async upgradeTapLevel(userId: number): Promise<{ success: boolean; newLevel: number; xpSpent: number }> {
    const state = await this.getTapState(userId);
    if (!state) throw new Error("Tap state not found");

    if (state.tap_level >= MAX_TAP_LEVEL) return { success: false, newLevel: MAX_TAP_LEVEL, xpSpent: 0 };

    const currentConfig = TAP_LEVELS.find(l => l.level === state.tap_level);
    if (!currentConfig || !currentConfig.upgradeCostXP) return { success: false, newLevel: state.tap_level, xpSpent: 0 };

    const nextLevel = state.tap_level + 1;
    const costXP = currentConfig.upgradeCostXP;

    const { data: user } = await supabase
      .from("users")
      .select("total_xp")
      .eq("id", userId)
      .maybeSingle();

    const currentXP = user?.total_xp || 0;
    if (currentXP < costXP) return { success: false, newLevel: state.tap_level, xpSpent: 0 };

    // Deduct XP first, then update level - rollback XP if level update fails
    const { error: xpError } = await supabase.rpc("atomic_add_xp", { p_user_id: userId, p_xp: -costXP });
    if (xpError) {
      console.error("Deduct XP for upgrade error:", xpError);
      return { success: false, newLevel: state.tap_level, xpSpent: 0 };
    }

    const { error: updateError } = await supabase
      .from("tap_game_state")
      .update({ tap_level: nextLevel, updated_at: new Date().toISOString() })
      .eq("user_id", userId);

    if (updateError) {
      console.error("Update tap level error:", updateError);
      // Rollback XP
      await supabase.rpc("atomic_add_xp", { p_user_id: userId, p_xp: costXP });
      return { success: false, newLevel: state.tap_level, xpSpent: 0 };
    }

    return { success: true, newLevel: nextLevel, xpSpent: costXP };
  }

  // ── Autoclicker ───────────────────────────────────────────────────────────

  async buyAutoclicker(userId: number, durationMin: number): Promise<{ success: boolean; until: string | null }> {
    const now = Date.now();
    const currentState = await this.getTapState(userId);

    // Extend if already active
    const base = currentState?.autoclicker_until && new Date(currentState.autoclicker_until).getTime() > now
      ? new Date(currentState.autoclicker_until).getTime()
      : now;

    const until = new Date(base + durationMin * 60 * 1000).toISOString();

    const { error } = await supabase
      .from("tap_game_state")
      .update({ autoclicker_until: until, updated_at: new Date().toISOString() })
      .eq("user_id", userId);

    if (error) {
      console.error("Buy autoclicker error:", error.message);
      return { success: false, until: null };
    }

    return { success: true, until };
  }

  // ── Tap Artifacts ────────────────────────────────────────────────────────

  async getOwnedArtifacts(userId: number): Promise<string[]> {
    const { data, error } = await supabase
      .from("tap_artifacts")
      .select("artifact_key")
      .eq("user_id", userId);

    if (error) {
      console.error("Get owned artifacts error:", error);
      return [];
    }
    return (data || []).map((a: { artifact_key: string }) => a.artifact_key);
  }

  async buyArtifactXP(userId: number, artifactKey: string, costXP: number): Promise<{ success: boolean }> {
    const { data: user } = await supabase
      .from("users")
      .select("total_xp")
      .eq("id", userId)
      .maybeSingle();

    const currentXP = user?.total_xp || 0;
    if (currentXP < costXP) return { success: false };

    await supabase.rpc("atomic_add_xp", { p_user_id: userId, p_xp: -costXP });

    const { error } = await supabase
      .from("tap_artifacts")
      .insert([{ user_id: userId, artifact_key: artifactKey }]);

    if (error) {
      console.error("Buy artifact error:", error);
      await supabase.rpc("atomic_add_xp", { p_user_id: userId, p_xp: costXP });
      return { success: false };
    }

    await supabase
      .from("tap_game_state")
      .update({ active_artifact: artifactKey, updated_at: new Date().toISOString() })
      .eq("user_id", userId);

    return { success: true };
  }

  async buyArtifactStars(userId: number, artifactKey: string): Promise<{ success: boolean }> {
    const { error } = await supabase
      .from("tap_artifacts")
      .insert([{ user_id: userId, artifact_key: artifactKey }]);

    if (error) {
      console.error("Buy artifact stars error:", error);
      return { success: false };
    }

    await supabase
      .from("tap_game_state")
      .update({ active_artifact: artifactKey, updated_at: new Date().toISOString() })
      .eq("user_id", userId);

    return { success: true };
  }

  async equipArtifact(userId: number, artifactKey: string): Promise<void> {
    await supabase
      .from("tap_game_state")
      .update({ active_artifact: artifactKey, updated_at: new Date().toISOString() })
      .eq("user_id", userId);
  }

  // ── XP (atomic via RPC) ───────────────────────────────────────────────────

  private async addXPAtomic(userId: number, xpToAdd: number): Promise<void> {
    const { error } = await supabase.rpc("atomic_add_xp", {
      p_user_id: userId,
      p_xp: xpToAdd,
    });
    if (error) console.error("Atomic add XP error:", error);

    // Also add to active season progress
    if (xpToAdd > 0) {
      try {
        const { data: activeSeason } = await supabase
          .from("seasons")
          .select("id")
          .eq("is_active", true)
          .lte("start_date", new Date().toISOString())
          .gte("end_date", new Date().toISOString())
          .maybeSingle();

        if (activeSeason) {
          const { data: seasonProgress } = await supabase
            .from("user_season_progress")
            .select("id, current_xp")
            .eq("user_id", userId)
            .eq("season_id", activeSeason.id)
            .maybeSingle();

          if (seasonProgress) {
            await supabase
              .from("user_season_progress")
              .update({
                current_xp: (seasonProgress.current_xp || 0) + xpToAdd,
                updated_at: new Date().toISOString(),
              })
              .eq("id", seasonProgress.id);
          }
        }
      } catch {
        // Season progress update is non-critical, don't block XP addition
      }
    }
  }

  // ── Achievements ───────────────────────────────────────────────────────────

  private async awardAchievement(userId: number, key: string): Promise<void> {
    const { data: existing } = await supabase
      .from("achievements")
      .select("id")
      .eq("user_id", userId)
      .eq("achievement_key", key)
      .maybeSingle();

    if (existing) return;

    const { error } = await supabase
      .from("achievements")
      .insert([{ user_id: userId, achievement_key: key }]);

    if (error) console.error("Award achievement error:", error);
  }

  // ── Stage 2: Museum Artifacts ───────────────────────────────────────────────

  async getMuseumArtifacts(category?: ArtifactCategory): Promise<MuseumArtifact[]> {
    let query = supabase.from("museum_artifacts").select("*").order("sort_order");
    if (category) query = query.eq("category", category);
    const { data, error } = await query;
    if (error) { console.error("Get museum artifacts error:", error); return []; }
    return data || [];
  }

  async viewMuseumArtifact(userId: number, artifactId: string): Promise<{ xpEarned: number; newViews: number }> {
    const { data: existing } = await supabase
      .from("artifact_views")
      .select("id")
      .eq("user_id", userId)
      .eq("artifact_id", artifactId)
      .maybeSingle();

    if (existing) return { xpEarned: 0, newViews: 0 };

    await supabase.from("artifact_views").insert([
      { user_id: userId, artifact_id: artifactId, viewed_at: new Date().toISOString() },
    ]);

    await this.addXPAtomic(userId, 10);

    const { data: artifact } = await supabase
      .from("museum_artifacts")
      .select("category")
      .eq("id", artifactId)
      .maybeSingle();

    if (artifact) {
      await this.updateMuseumProgress(userId, artifact.category as ArtifactCategory);
    }

    const { data: views } = await supabase
      .from("artifact_views")
      .select("artifact_id")
      .eq("user_id", userId);
    const uniqueViews = new Set((views || []).map((v: { artifact_id: string }) => v.artifact_id)).size;

    if (uniqueViews >= 1) await this.awardAchievement(userId, "FIRST_ARTIFACT_VIEW");
    if (uniqueViews >= 10) await this.awardAchievement(userId, "TEN_ARTIFACTS");
    if (uniqueViews >= 56) await this.awardAchievement(userId, "ALL_ARTIFACTS");

    // Update quest progress
    await this.updateQuestProgress(userId, "view_artifacts", 1);
    await this.updateDailyQuestProgress(userId, "daily_view_artifacts", 1);

    return { xpEarned: 10, newViews: uniqueViews };
  }

  private async updateMuseumProgress(userId: number, category: ArtifactCategory): Promise<void> {
    const { data: existing } = await supabase
      .from("user_museum_progress")
      .select("artifacts_viewed, collection_completed")
      .eq("user_id", userId)
      .eq("category", category)
      .maybeSingle();

    const viewed = (existing?.artifacts_viewed || 0) + 1;
    const { count: totalInCategory } = await supabase
      .from("museum_artifacts")
      .select("*", { count: "exact", head: true })
      .eq("category", category);

    const completed = !!(totalInCategory && viewed >= totalInCategory);

    if (existing) {
      await supabase
        .from("user_museum_progress")
        .update({ artifacts_viewed: viewed, collection_completed: completed })
        .eq("user_id", userId)
        .eq("category", category);
    } else {
      await supabase
        .from("user_museum_progress")
        .insert([{ user_id: userId, category, artifacts_viewed: viewed, articles_unlocked: 0, collection_completed: completed }]);
    }

    if (completed && !existing?.collection_completed) {
      await this.awardAchievement(userId, "COLLECTION_" + category.toUpperCase());
      await this.addXPAtomic(userId, 200);
    }
  }

  async getMuseumProgress(userId: number): Promise<MuseumProgress[]> {
    const { data, error } = await supabase
      .from("user_museum_progress")
      .select("*")
      .eq("user_id", userId);
    if (error) { console.error("Get museum progress error:", error); return []; }
    return data || [];
  }

  // ── Stage 2: Articles ───────────────────────────────────────────────────────

  async getArticles(category?: ArtifactCategory): Promise<MuseumArticle[]> {
    let query = supabase.from("museum_articles").select("*").order("sort_order");
    if (category) query = query.eq("category", category);
    const { data, error } = await query;
    if (error) { console.error("Get articles error:", error); return []; }
    return data || [];
  }

  async readArticle(userId: number, articleId: string): Promise<{ unlocked: boolean; xpEarned: number }> {
    const { data: article } = await supabase
      .from("museum_articles")
      .select("category, required_views")
      .eq("id", articleId)
      .maybeSingle();

    if (!article) return { unlocked: false, xpEarned: 0 };

    const { data: progress } = await supabase
      .from("user_museum_progress")
      .select("artifacts_viewed, articles_unlocked")
      .eq("user_id", userId)
      .eq("category", article.category)
      .maybeSingle();

    const viewed = progress?.artifacts_viewed || 0;
    if (viewed < article.required_views) return { unlocked: false, xpEarned: 0 };

    const newUnlocked = (progress?.articles_unlocked || 0) + 1;
    if (progress) {
      await supabase
        .from("user_museum_progress")
        .update({ articles_unlocked: newUnlocked })
        .eq("user_id", userId)
        .eq("category", article.category);
    }

    await this.addXPAtomic(userId, 25);
    await this.awardAchievement(userId, "FIRST_ARTICLE");

    // Update quest progress
    await this.updateQuestProgress(userId, "read_articles", 1);
    await this.updateDailyQuestProgress(userId, "daily_read_articles", 1);

    return { unlocked: true, xpEarned: 25 };
  }

  // ── Stage 2: Referrals ──────────────────────────────────────────────────────

  async processReferral(referrerTelegramId: number, referredUserId: number): Promise<void> {
    const { data: referrer } = await supabase
      .from("users")
      .select("id")
      .eq("telegram_id", referrerTelegramId)
      .maybeSingle();

    if (!referrer) return;
    const referrerId = referrer.id;
    if (referrerId === referredUserId) return;

    const { data: existing } = await supabase
      .from("referrals")
      .select("id")
      .eq("referred_id", referredUserId)
      .maybeSingle();
    if (existing) return;

    await supabase.from("referrals").insert([{ referrer_id: referrerId, referred_id: referredUserId }]);
    await this.addXPAtomic(referrerId, 50);
    await this.awardAchievement(referrerId, "FIRST_REFERRAL");

    // Update quest progress for invite_friends
    await this.updateQuestProgress(referrerId, "invite_friends", 1);

    const { count } = await supabase
      .from("referrals")
      .select("*", { count: "exact", head: true })
      .eq("referrer_id", referrerId);

    const invitedCount = count || 0;
    for (const ms of REFERRAL_MILESTONES) {
      if (invitedCount >= ms.count) {
        const { data: already } = await supabase
          .from("referral_rewards")
          .select("id")
          .eq("user_id", referrerId)
          .eq("milestone", ms.count)
          .maybeSingle();
        if (!already) {
          await supabase.from("referral_rewards").insert([{
            user_id: referrerId, milestone: ms.count,
            reward_type: ms.reward_type, reward_key: ms.reward_key,
          }]);
        }
      }
    }
  }

  async getReferralStats(userId: number): Promise<ReferralStats> {
    const { count } = await supabase
      .from("referrals")
      .select("*", { count: "exact", head: true })
      .eq("referrer_id", userId);

    const { data: rewards } = await supabase
      .from("referral_rewards")
      .select("milestone, reward_type, reward_key")
      .eq("user_id", userId);

    const invitedCount = count || 0;
    const nextMilestone = REFERRAL_MILESTONES.find(m => m.count > invitedCount)?.count ?? null;

    return {
      invitedCount,
      rewards: (rewards || []) as ReferralReward[],
      nextMilestone,
    };
  }

  // ── Stage 3: Daily Rewards / Login Streak ──────────────────────────────────────

  async claimDailyReward(userId: number): Promise<{ claimed: boolean; streakDay: number; reward: typeof DAILY_REWARDS[number] | null }> {
    const today = new Date().toISOString().slice(0, 10);

    const { data: existingClaim } = await supabase
      .from("daily_reward_claims")
      .select("id")
      .eq("user_id", userId)
      .eq("claim_date", today)
      .maybeSingle();

    if (existingClaim) return { claimed: false, streakDay: 0, reward: null };

    let streak: DailyStreak;
    const { data: existingStreak } = await supabase
      .from("daily_login_streak")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (existingStreak) {
      const lastDate = existingStreak.last_login_date;
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      const isConsecutive = lastDate === yesterday;
      const current_streak = isConsecutive ? existingStreak.current_streak + 1 : 1;
      const longest_streak = Math.max(current_streak, existingStreak.longest_streak);

      await supabase
        .from("daily_login_streak")
        .update({ current_streak, longest_streak, last_login_date: today })
        .eq("user_id", userId);

      streak = { current_streak, longest_streak, last_login_date: today };
    } else {
      await supabase
        .from("daily_login_streak")
        .insert([{ user_id: userId, current_streak: 1, longest_streak: 1, last_login_date: today }]);
      streak = { current_streak: 1, longest_streak: 1, last_login_date: today };
    }

    const applicableReward = [...DAILY_REWARDS].reverse().find(r => streak.current_streak >= r.day) || DAILY_REWARDS[0];
    const streakDay = streak.current_streak;

    await supabase.from("daily_reward_claims").insert([{
      user_id: userId, claim_date: today, streak_day: streakDay,
      reward_type: applicableReward.reward_type, reward_amount: applicableReward.amount,
    }]);

    if (applicableReward.reward_type === "xp") {
      let xpAmount = applicableReward.amount;
      // Apply streak bonus from owned artifacts
      const { data: ownedArts } = await supabase
        .from("tap_artifacts")
        .select("artifact_key")
        .eq("user_id", userId);
      const ownedKeys = new Set((ownedArts || []).map((a: { artifact_key: string }) => a.artifact_key));
      const streakBonus = TAP_ARTIFACTS
        .filter(a => ownedKeys.has(a.key) && a.effects?.streakBonus)
        .reduce((sum, a) => sum + (a.effects?.streakBonus || 0), 0);
      xpAmount += streakBonus * streak.current_streak;
      await this.addXPAtomic(userId, xpAmount);
    }

    if (streak.current_streak >= 7) await this.awardAchievement(userId, "STREAK_7");
    if (streak.current_streak >= 30) await this.awardAchievement(userId, "STREAK_30");

    await this.updateDailyQuestProgress(userId, "daily_claim", 1);

    return { claimed: true, streakDay, reward: applicableReward };
  }

  async getDailyStreak(userId: number): Promise<DailyStreak | null> {
    const { data, error } = await supabase
      .from("daily_login_streak")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();
    if (error) { console.error("Get daily streak error:", error); return null; }
    return data;
  }

  async getTodayClaim(userId: number): Promise<DailyClaim | null> {
    const today = new Date().toISOString().slice(0, 10);
    const { data, error } = await supabase
      .from("daily_reward_claims")
      .select("*")
      .eq("user_id", userId)
      .eq("claim_date", today)
      .maybeSingle();
    if (error) { console.error("Get today claim error:", error); return null; }
    return data;
  }

  // ── Stage 3: Weekly Quests ───────────────────────────────────────────────────

  async getWeeklyQuests(): Promise<WeeklyQuest[]> {
    const { data, error } = await supabase
      .from("weekly_quests")
      .select("*")
      .order("id");
    if (error) { console.error("Get weekly quests error:", error); return []; }
    return data || [];
  }

  async getQuestProgress(userId: number): Promise<QuestProgress[]> {
    const { data, error } = await supabase
      .from("user_quest_progress")
      .select("*")
      .eq("user_id", userId);
    if (error) { console.error("Get quest progress error:", error); return []; }
    return data || [];
  }

  async updateQuestProgress(userId: number, questType: string, increment: number = 1): Promise<void> {
    const { data: quests } = await supabase
      .from("weekly_quests")
      .select("id, quest_type, target_count")
      .eq("quest_type", questType);

    if (!quests || quests.length === 0) return;

    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay() + 1);
    const weekStartStr = weekStart.toISOString().split("T")[0];

    for (const quest of quests) {
      const { data: existing } = await supabase
        .from("user_quest_progress")
        .select("*")
        .eq("user_id", userId)
        .eq("quest_id", quest.id)
        .maybeSingle();

      if (existing) {
        if (existing.claimed) continue;
        const newCount = Math.min((existing.current_count || 0) + increment, quest.target_count);
        const completed = newCount >= quest.target_count;
        await supabase
          .from("user_quest_progress")
          .update({ current_count: newCount, completed })
          .eq("id", existing.id);
      } else {
        const completed = increment >= quest.target_count;
        await supabase
          .from("user_quest_progress")
          .insert([{
            user_id: userId,
            quest_id: quest.id,
            current_count: Math.min(increment, quest.target_count),
            completed,
          }]);
      }
    }
  }

  async claimQuestReward(userId: number, questId: string): Promise<{ claimed: boolean; xpEarned: number }> {
    const { data: progress } = await supabase
      .from("user_quest_progress")
      .select("completed, claimed, current_count")
      .eq("user_id", userId)
      .eq("quest_id", questId)
      .maybeSingle();

    if (!progress || !progress.completed || progress.claimed) return { claimed: false, xpEarned: 0 };

    const { data: quest } = await supabase
      .from("weekly_quests")
      .select("reward_xp")
      .eq("id", questId)
      .maybeSingle();

    const xpEarned = quest?.reward_xp || 0;

    await supabase
      .from("user_quest_progress")
      .update({ claimed: true })
      .eq("user_id", userId)
      .eq("quest_id", questId);

    await this.addXPAtomic(userId, xpEarned);
    return { claimed: true, xpEarned };
  }

  // ── Stage 3: Leaderboard ─────────────────────────────────────────────────────

  async getLeaderboard(limit: number = 20): Promise<LeaderboardEntry[]> {
    const { data: users, error } = await supabase
      .from("users")
      .select("id, first_name, username, total_xp")
      .order("total_xp", { ascending: false })
      .limit(limit);

    if (error) { console.error("Get leaderboard error:", error); return []; }

    const entries: LeaderboardEntry[] = [];
    for (let i = 0; i < (users || []).length; i++) {
      const u = (users || [])[i];
      const { count } = await supabase
        .from("artifact_views")
        .select("*", { count: "exact", head: true })
        .eq("user_id", u.id);
      entries.push({
        user_id: u.id,
        first_name: u.first_name,
        username: u.username,
        total_xp: u.total_xp,
        artifacts_viewed: count || 0,
        rank: i + 1,
      });
    }
    return entries;
  }

  // ── Stage 3: Collection Claims ───────────────────────────────────────────────

  async claimCollectionReward(userId: number, category: ArtifactCategory): Promise<{ claimed: boolean; xpEarned: number }> {
    const { data: existing } = await supabase
      .from("collection_claims")
      .select("id")
      .eq("user_id", userId)
      .eq("category", category)
      .maybeSingle();

    if (existing) return { claimed: false, xpEarned: 0 };

    const { data: progress } = await supabase
      .from("user_museum_progress")
      .select("collection_completed")
      .eq("user_id", userId)
      .eq("category", category)
      .maybeSingle();

    if (!progress?.collection_completed) return { claimed: false, xpEarned: 0 };

    await supabase.from("collection_claims").insert([{ user_id: userId, category, reward_key: `collection_${category}` }]);
    await this.addXPAtomic(userId, 500);

    return { claimed: true, xpEarned: 500 };
  }

  async getCollectionClaims(userId: number): Promise<string[]> {
    const { data, error } = await supabase
      .from("collection_claims")
      .select("category")
      .eq("user_id", userId);
    if (error) { console.error("Get collection claims error:", error); return []; }
    return (data || []).map((c: { category: string }) => c.category);
  }

  // ── Utility: viewed artifact IDs ────────────────────────────────────────────

  async getViewedArtifactIds(userId: number): Promise<Set<string>> {
    const { data, error } = await supabase
      .from("artifact_views")
      .select("artifact_id")
      .eq("user_id", userId);
    if (error) { console.error("Get viewed artifacts error:", error); return new Set(); }
    return new Set((data || []).map((v: { artifact_id: string }) => v.artifact_id));
  }

  // ── Public XP ─────────────────────────────────────────────────────────────────

  async addXP(userId: number, xpToAdd: number): Promise<number> {
    const { data, error } = await supabase.rpc("atomic_add_xp", {
      p_user_id: userId,
      p_xp: xpToAdd,
    });
    if (error) console.error("Add XP error:", error);
    return data || 0;
  }

  // ── Achievement Keys (public) ─────────────────────────────────────────────────

  async getAchievementKeys(userId: number): Promise<string[]> {
    const { data, error } = await supabase
      .from("achievements")
      .select("achievement_key")
      .eq("user_id", userId);
    if (error) { console.error("Get achievement keys error:", error); return []; }
    return (data || []).map((a: { achievement_key: string }) => a.achievement_key);
  }

  async checkAndAwardTapAchievements(userId: number, totalTaps: number, totalXP: number, ownedCount: number): Promise<void> {
    const checks: Array<[number, string]> = [
      [1, "FIRST_TAP"], [100, "TAP_100"], [1000, "TAP_1000"], [10000, "TAP_10000"],
    ];
    for (const [threshold, key] of checks) {
      if (totalTaps >= threshold) await this.awardAchievement(userId, key);
    }
    if (totalXP >= 1000) await this.awardAchievement(userId, "XP_1000");
    if (totalXP >= 10000) await this.awardAchievement(userId, "XP_10000");
    if (ownedCount >= 5) await this.awardAchievement(userId, "ARTIFACTS_5");
    if (ownedCount >= 11) await this.awardAchievement(userId, "ARTIFACTS_ALL");
  }

  // ── Guilds ────────────────────────────────────────────────────────────────────

  async getGuilds(): Promise<GuildWithMembers[]> {
    const { data, error } = await supabase
      .from("guilds")
      .select("*")
      .order("total_xp", { ascending: false })
      .limit(20);
    if (error) { console.error("Get guilds error:", error); return []; }

    const guilds = data || [];
    const result: GuildWithMembers[] = [];
    for (const g of guilds) {
      const { count } = await supabase
        .from("guild_members")
        .select("*", { count: "exact", head: true })
        .eq("guild_id", g.id);
      result.push({ ...g, member_count: count || 0 });
    }
    return result;
  }

  async getUserGuild(userId: number): Promise<GuildWithMembers | null> {
    const { data: membership } = await supabase
      .from("guild_members")
      .select("guild_id")
      .eq("user_id", userId)
      .maybeSingle();
    if (!membership) return null;

    const { data: guild } = await supabase
      .from("guilds")
      .select("*")
      .eq("id", membership.guild_id)
      .maybeSingle();
    if (!guild) return null;

    const { data: members } = await supabase
      .from("guild_members")
      .select("*, users(first_name, photo_url)")
      .eq("guild_id", guild.id);

    const { count } = await supabase
      .from("guild_members")
      .select("*", { count: "exact", head: true })
      .eq("guild_id", guild.id);

    return {
      ...guild,
      member_count: count || 0,
      members: (members || []).map((m: GuildMember & { users?: { first_name: string; photo_url: string | null } }) => ({
        ...m,
        first_name: m.users?.first_name,
        photo_url: m.users?.photo_url,
      })),
    };
  }

  async joinGuild(userId: number, guildId: number): Promise<{ success: boolean }> {
    const { error } = await supabase
      .from("guild_members")
      .upsert([{ guild_id: guildId, user_id: userId, role: "member" }], { onConflict: "user_id" });
    if (error) { console.error("Join guild error:", error); return { success: false }; }
    return { success: true };
  }

  async createGuild(userId: number, name: string, icon: string, color: string): Promise<{ success: boolean; guildId?: number }> {
    const { data: user } = await supabase
      .from("users")
      .select("total_xp")
      .eq("id", userId)
      .maybeSingle();
    if (!user || user.total_xp < 5000) return { success: false };

    const { data: guild, error } = await supabase
      .from("guilds")
      .insert([{ name, icon, color, leader_id: userId }])
      .select()
      .single();
    if (error) { console.error("Create guild error:", error); return { success: false }; }

    await supabase
      .from("guild_members")
      .upsert([{ guild_id: guild.id, user_id: userId, role: "leader" }], { onConflict: "user_id" });
    await supabase.rpc("atomic_add_xp", { p_user_id: userId, p_xp: -5000 });
    return { success: true, guildId: guild.id };
  }

  async leaveGuild(userId: number): Promise<void> {
    await supabase.from("guild_members").delete().eq("user_id", userId);
  }

  // ── Lucky Spin ────────────────────────────────────────────────────────────────

  async getLuckySpins(userId: number): Promise<SpinResult> {
    const { data } = await supabase
      .from("lucky_spins")
      .select("free_spins, last_free_spin_date")
      .eq("user_id", userId)
      .maybeSingle();

    if (!data) {
      await supabase.from("lucky_spins").upsert(
        [{ user_id: userId, free_spins: 1, last_free_spin_date: null }],
        { onConflict: "user_id" }
      );
      return { freeSpins: 1, lastFreeSpinDate: null };
    }

    const today = new Date().toISOString().slice(0, 10);
    const lastSpinDate = data.last_free_spin_date ? String(data.last_free_spin_date).slice(0, 10) : null;
    if (lastSpinDate && lastSpinDate < today && (data.free_spins || 0) === 0) {
      await supabase.from("lucky_spins").update({ free_spins: 1 }).eq("user_id", userId);
      return { freeSpins: 1, lastFreeSpinDate: lastSpinDate };
    }

    return { freeSpins: data.free_spins || 0, lastFreeSpinDate: lastSpinDate };
  }

  async consumeSpin(userId: number): Promise<void> {
    const today = new Date().toISOString().slice(0, 10);
    await supabase
      .from("lucky_spins")
      .upsert([{ user_id: userId, free_spins: 0, last_free_spin_date: today }], { onConflict: "user_id" });
  }

  async recordSpinReward(userId: number, rewardType: string, rewardValue: number): Promise<void> {
    await supabase
      .from("spin_rewards_log")
      .insert([{ user_id: userId, reward_type: rewardType, reward_value: rewardValue }]);
    if (rewardType === "xp") {
      await this.addXP(userId, rewardValue);
    }
    await this.updateDailyQuestProgress(userId, "daily_spin", 1);
  }

  // ── Season Pass ───────────────────────────────────────────────────────────────

  async getActiveSeason(): Promise<Season | null> {
    const today = new Date().toISOString();
    const { data, error } = await supabase
      .from("seasons")
      .select("*")
      .lte("start_date", today)
      .gte("end_date", today)
      .maybeSingle();
    if (error) { console.error("Get active season error:", error); return null; }
    return data;
  }

  async getUserSeasonProgress(userId: number, seasonId: string): Promise<UserSeasonProgress> {
    const { data: existing } = await supabase
      .from("user_season_progress")
      .select("*")
      .eq("user_id", userId)
      .eq("season_id", seasonId)
      .maybeSingle();
    if (existing) return existing;

    const { data, error } = await supabase
      .from("user_season_progress")
      .insert([{ user_id: userId, season_id: seasonId, current_xp: 0, has_premium: false }])
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async getSeasonTierClaims(userSeasonId: number): Promise<SeasonTierClaim[]> {
    const { data, error } = await supabase
      .from("season_tier_claims")
      .select("*")
      .eq("user_season_id", userSeasonId);
    if (error) { console.error("Get tier claims error:", error); return []; }
    return data || [];
  }

  async claimSeasonTier(userId: number, userSeasonId: number, tier: number, claimType: "free" | "premium"): Promise<{ claimed: boolean; xpEarned: number }> {
    const { data: existing } = await supabase
      .from("season_tier_claims")
      .select("id")
      .eq("user_season_id", userSeasonId)
      .eq("tier", tier)
      .eq("claim_type", claimType)
      .maybeSingle();
    if (existing) return { claimed: false, xpEarned: 0 };

    const { error } = await supabase
      .from("season_tier_claims")
      .insert([{ user_season_id: userSeasonId, tier, claim_type: claimType }]);
    if (error) { console.error("Claim season tier error:", error); return { claimed: false, xpEarned: 0 }; }

    const xpEarned = tier * (claimType === "premium" ? 100 : 50);
    await this.addXP(userId, xpEarned);
    return { claimed: true, xpEarned };
  }

  async buySeasonPremium(userId: number, seasonId: string): Promise<{ success: boolean }> {
    const { error } = await supabase
      .from("user_season_progress")
      .update({ has_premium: true })
      .eq("user_id", userId)
      .eq("season_id", seasonId);
    if (error) { console.error("Buy season premium error:", error); return { success: false }; }
    return { success: true };
  }

  // ── Daily Quests ────────────────────────────────────────────────────────────────

  async getDailyQuests(): Promise<DailyQuest[]> {
    const today = new Date().toISOString().slice(0, 10);

    const { data: existing, error } = await supabase
      .from("daily_quests")
      .select("*")
      .eq("quest_date", today);

    if (error) { console.error("Get daily quests error:", error); return []; }

    if (existing && existing.length > 0) return existing;

    // Generate new daily quests for today
    const seededRandom = (seed: number) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };

    const daySeed = new Date(today).getTime() / 86400000;
    const selected: Array<{ quest_key: string; target_count: number; reward_xp: number; title_ua: string; title_en: string }> = [];

    const shuffledTemplates = [...DAILY_QUEST_TEMPLATES].sort((a, b) =>
      seededRandom(daySeed + a.quest_key.charCodeAt(0)) - seededRandom(daySeed + b.quest_key.charCodeAt(0))
    );

    for (let i = 0; i < Math.min(3, shuffledTemplates.length); i++) {
      const template = shuffledTemplates[i];
      const r = seededRandom(daySeed + i * 7 + 13);
      const target = Math.round(template.targetRange[0] + r * (template.targetRange[1] - template.targetRange[0]));
      const reward = Math.round(template.rewardRange[0] + (target - template.targetRange[0]) / (template.targetRange[1] - template.targetRange[0]) * (template.rewardRange[1] - template.rewardRange[0]));
      const replaceN = (str: string) => str.replace("{n}", String(target));
      selected.push({
        quest_key: template.quest_key,
        target_count: target,
        reward_xp: reward,
        title_ua: replaceN(template.title_ua),
        title_en: replaceN(template.title_en),
      });
    }

    const { data: inserted, error: insertError } = await supabase
      .from("daily_quests")
      .insert(selected.map(q => ({ ...q, quest_date: today })))
      .select();

    if (insertError) { console.error("Insert daily quests error:", insertError); return []; }
    return inserted || [];
  }

  async getDailyQuestProgress(userId: number): Promise<DailyQuestProgress[]> {
    const { data, error } = await supabase
      .from("user_daily_quest_progress")
      .select("*")
      .eq("user_id", userId);
    if (error) { console.error("Get daily quest progress error:", error); return []; }
    return data || [];
  }

  async updateDailyQuestProgress(userId: number, questKey: string, increment: number = 1): Promise<void> {
    const today = new Date().toISOString().slice(0, 10);
    const { data: quests } = await supabase
      .from("daily_quests")
      .select("id, quest_key, target_count")
      .eq("quest_key", questKey)
      .eq("quest_date", today);

    if (!quests || quests.length === 0) return;

    for (const quest of quests) {
      const { data: existing } = await supabase
        .from("user_daily_quest_progress")
        .select("*")
        .eq("user_id", userId)
        .eq("daily_quest_id", quest.id)
        .maybeSingle();

      if (existing) {
        if (existing.claimed) continue;
        const newCount = Math.min((existing.current_count || 0) + increment, quest.target_count);
        const completed = newCount >= quest.target_count;
        await supabase
          .from("user_daily_quest_progress")
          .update({ current_count: newCount, completed })
          .eq("id", existing.id);
      } else {
        const completed = increment >= quest.target_count;
        await supabase
          .from("user_daily_quest_progress")
          .insert([{
            user_id: userId,
            daily_quest_id: quest.id,
            current_count: Math.min(increment, quest.target_count),
            completed,
          }]);
      }
    }
  }

  async claimDailyQuestReward(userId: number, questId: number): Promise<{ claimed: boolean; xpEarned: number }> {
    const { data: progress } = await supabase
      .from("user_daily_quest_progress")
      .select("completed, claimed")
      .eq("user_id", userId)
      .eq("daily_quest_id", questId)
      .maybeSingle();

    if (!progress || !progress.completed || progress.claimed) return { claimed: false, xpEarned: 0 };

    const { data: quest } = await supabase
      .from("daily_quests")
      .select("reward_xp")
      .eq("id", questId)
      .maybeSingle();

    const xpEarned = quest?.reward_xp || 0;

    await supabase
      .from("user_daily_quest_progress")
      .update({ claimed: true })
      .eq("user_id", userId)
      .eq("daily_quest_id", questId);

    await this.addXPAtomic(userId, xpEarned);
    return { claimed: true, xpEarned };
  }

  // ── Limited Artifacts ────────────────────────────────────────────────────────

  async getLimitedArtifacts(userId: number): Promise<Array<{
    id: string; name: { ua: string; en: string }; description: { ua: string; en: string };
    image: string; xpBonus: number; rarity: string; availableUntil: string;
    totalSupply: number; claimedCount: number; costStars: number; isOwned: boolean;
  }>> {
    const { data, error } = await supabase
      .from("limited_artifacts")
      .select("*")
      .gt("available_until", new Date().toISOString())
      .order("cost_stars", { ascending: true });

    if (error) { console.error("Get limited artifacts error:", error); return []; }

    const { data: owned } = await supabase
      .from("user_limited_artifacts")
      .select("limited_artifact_id")
      .eq("user_id", userId);

    const ownedIds = new Set((owned || []).map((o: { limited_artifact_id: number }) => o.limited_artifact_id));

    return (data || []).map(a => ({
      id: String(a.id),
      name: { ua: a.name_ua, en: a.name_en },
      description: { ua: a.description_ua || '', en: a.description_en || '' },
      image: a.image_url || '',
      xpBonus: a.xp_bonus,
      rarity: a.rarity,
      availableUntil: a.available_until,
      totalSupply: a.total_supply,
      claimedCount: a.claimed_count,
      costStars: a.cost_stars,
      isOwned: ownedIds.has(a.id),
    }));
  }

  async claimLimitedArtifact(userId: number, artifactId: string): Promise<{ success: boolean }> {
    const { data: artifact } = await supabase
      .from("limited_artifacts")
      .select("claimed_count, total_supply, xp_bonus")
      .eq("id", parseInt(artifactId))
      .maybeSingle();

    if (!artifact || artifact.claimed_count >= artifact.total_supply) return { success: false };

    const { error } = await supabase
      .from("user_limited_artifacts")
      .insert([{ user_id: userId, limited_artifact_id: parseInt(artifactId) }]);

    if (error) { console.error("Claim limited artifact error:", error); return { success: false }; }

    await supabase
      .from("limited_artifacts")
      .update({ claimed_count: artifact.claimed_count + 1 })
      .eq("id", parseInt(artifactId));

    await this.addXPAtomic(userId, artifact.xp_bonus);
    return { success: true };
  }
}

export const museumAPI = new MuseumAPI();
