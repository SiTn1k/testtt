import { supabase } from './supabase';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ArtifactRarity = 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';

export interface TapArtifact {
  key: string;
  name: { ua: string; en: string };
  description: { ua: string; en: string };
  icon: string;
  rarity: ArtifactRarity;
  tapBonus: number;
  xpBonus: number;
  cost: number;
  effects?: {
    autoclickerSpeed?: number;
    doubleRewardChance?: number;
    streakBonus?: number;
    energyRecovery?: number;
  };
}

export interface DBUser {
  id: number;
  telegram_id: number;
  username?: string;
  first_name: string;
  last_name?: string;
  photo_url?: string;
  language_code: string;
  total_xp: number;
  total_taps: number;
  weekly_taps: number;
  weekly_xp: number;
  current_streak: number;
  longest_streak: number;
  consecutive_days: number;
  last_login_date?: string;
  daily_claim_date?: string;
  created_at: string;
}

export interface DailyQuest {
  id: string;
  quest_key: string;
  target_count: number;
  reward_xp: number;
  title_ua: string;
  title_en: string;
  quest_date: string;
}

export interface DailyQuestProgress {
  id: string;
  user_id: number;
  daily_quest_id: string;
  current_count: number;
  completed: boolean;
  claimed: boolean;
}

// ─── Constants ────────────────────────────────────────────────────────────────

export const RARITY_META: Record<ArtifactRarity, { label: string; color: string; glow: string }> = {
  common:    { label: 'Звичайний',    color: '#4ade80', glow: 'rgba(74,222,128,0.3)' },
  rare:      { label: 'Рідкісний',    color: '#22d3ee', glow: 'rgba(34,211,238,0.3)' },
  epic:      { label: 'Епічний',      color: '#a78bfa', glow: 'rgba(167,139,250,0.3)' },
  legendary: { label: 'Легендарний',  color: '#fbbf24', glow: 'rgba(251,191,36,0.3)' },
  mythic:    { label: 'Міфічний',     color: '#f43f5e', glow: 'rgba(244,63,94,0.3)' },
};

export const RANK_THRESHOLDS = [
  { rank: 'Новачок',      minXP: 0,         icon: '🌱', color: '#6b7280' },
  { rank: 'Дослідник',    minXP: 100,        icon: '🔍', color: '#22d3ee' },
  { rank: 'Шукач',        minXP: 500,        icon: '🗺️', color: '#34d399' },
  { rank: 'Історик',      minXP: 1500,       icon: '📜', color: '#60a5fa' },
  { rank: 'Куратор',      minXP: 5000,       icon: '🏛️', color: '#a78bfa' },
  { rank: 'Покровитель',  minXP: 15000,      icon: '💎', color: '#f472b6' },
  { rank: 'Захисник',     minXP: 50000,      icon: '🛡️', color: '#fbbf24' },
  { rank: 'Легенда',      minXP: 150000,     icon: '⚡', color: '#fb923c' },
  { rank: 'Герой',        minXP: 500000,     icon: '🦅', color: '#f43f5e' },
  { rank: 'Чемпіон',      minXP: 1500000,    icon: '👑', color: '#e11d48' },
  { rank: 'Безсмертний',  minXP: 5000000,    icon: '🌟', color: '#7c3aed' },
  { rank: 'Засновник',    minXP: 15000000,   icon: '🏆', color: '#d97706' },
];

export function getRank(xp: number) {
  let current = RANK_THRESHOLDS[0];
  for (const t of RANK_THRESHOLDS) {
    if (xp >= t.minXP) current = t;
    else break;
  }
  const idx = RANK_THRESHOLDS.indexOf(current);
  const next = RANK_THRESHOLDS[idx + 1];
  return { ...current, next, idx };
}

export const TAP_ARTIFACTS: TapArtifact[] = [
  {
    key: 'vyshyvanka_amulet',
    name: { ua: 'Вишиванка-Амулет', en: 'Vyshyvanka Amulet' },
    description: { ua: '+2 XP за тап + бонус до стріку', en: '+2 XP per tap + streak bonus' },
    icon: '🧵',
    rarity: 'common',
    tapBonus: 2,
    xpBonus: 10,
    cost: 500,
    effects: { streakBonus: 2 },
  },
  {
    key: 'pysanka_power',
    name: { ua: 'Сила Писанки', en: 'Pysanka Power' },
    description: { ua: '+3 XP за тап + 3% шанс подвійної нагороди', en: '+3 XP per tap + 3% double reward' },
    icon: '🥚',
    rarity: 'common',
    tapBonus: 3,
    xpBonus: 15,
    cost: 800,
    effects: { doubleRewardChance: 0.03 },
  },
  {
    key: 'hetman_mace',
    name: { ua: 'Гетьманська Булава', en: 'Hetman Mace' },
    description: { ua: '+5 XP за тап + 1.25x автокліктер', en: '+5 XP per tap + 1.25x autoclicker' },
    icon: '⚜️',
    rarity: 'rare',
    tapBonus: 5,
    xpBonus: 25,
    cost: 2000,
    effects: { autoclickerSpeed: 1.25 },
  },
  {
    key: 'trident_independence',
    name: { ua: 'Тризуб Незалежності', en: 'Trident of Independence' },
    description: { ua: '+8 XP за тап + 5% подвійна нагорода', en: '+8 XP per tap + 5% double reward' },
    icon: '🔱',
    rarity: 'rare',
    tapBonus: 8,
    xpBonus: 40,
    cost: 5000,
    effects: { doubleRewardChance: 0.05 },
  },
  {
    key: 'orlyk_constitution',
    name: { ua: 'Конституція Орлика', en: "Orlyk's Constitution" },
    description: { ua: '+12 XP за тап + 5 бонус стріку', en: '+12 XP per tap + streak +5' },
    icon: '📜',
    rarity: 'epic',
    tapBonus: 12,
    xpBonus: 60,
    cost: 10000,
    effects: { streakBonus: 5 },
  },
  {
    key: 'peresopnytsia',
    name: { ua: 'Пересопницьке Євангеліє', en: 'Peresopnytsia Gospel' },
    description: { ua: '+15 XP за тап + 1.5x автокліктер', en: '+15 XP per tap + 1.5x autoclicker' },
    icon: '📖',
    rarity: 'epic',
    tapBonus: 15,
    xpBonus: 75,
    cost: 20000,
    effects: { autoclickerSpeed: 1.5 },
  },
  {
    key: 'hetman_treasure',
    name: { ua: 'Скарби Гетьманщини', en: 'Hetmanate Treasure' },
    description: { ua: '+20 XP за тап + 10% подвійна нагорода', en: '+20 XP per tap + 10% double reward' },
    icon: '💰',
    rarity: 'legendary',
    tapBonus: 20,
    xpBonus: 100,
    cost: 50000,
    effects: { doubleRewardChance: 0.10 },
  },
  {
    key: 'indestructible_symbol',
    name: { ua: 'Незнищенний Символ', en: 'Indestructible Symbol' },
    description: { ua: '+30 XP за тап + 2x автокліктер + 15% подвійна нагорода', en: '+30 XP per tap + 2x autoclicker + 15% double reward' },
    icon: '🌟',
    rarity: 'mythic',
    tapBonus: 30,
    xpBonus: 150,
    cost: 150000,
    effects: { autoclickerSpeed: 2.0, doubleRewardChance: 0.15 },
  },
];

export const UNIFIED_ACHIEVEMENTS = [
  { key: 'FIRST_VISIT',          ua: 'Перший візит',          en: 'First Visit',           rarity: 'common'    as AchievementRarity, xpReward: 50  },
  { key: 'FIRST_ARTIFACT_VIEW',  ua: 'Перший артефакт',       en: 'First Artifact View',   rarity: 'common'    as AchievementRarity, xpReward: 25  },
  { key: 'ONE_HOUR',             ua: '1 година в музеї',      en: '1 Hour in Museum',      rarity: 'common'    as AchievementRarity, xpReward: 100 },
  { key: 'TEN_ARTIFACTS',        ua: '10 артефактів',         en: '10 Artifacts Viewed',   rarity: 'common'    as AchievementRarity, xpReward: 75  },
  { key: 'ALL_ARTIFACTS',        ua: 'Всі артефакти',         en: 'All Artifacts Viewed',  rarity: 'legendary' as AchievementRarity, xpReward: 1000 },
  { key: 'FIRST_ARTICLE',        ua: 'Перша стаття',          en: 'First Article Read',    rarity: 'common'    as AchievementRarity, xpReward: 30  },
  { key: 'FIRST_TAP',            ua: 'Перший тап',            en: 'First Tap',             rarity: 'common'    as AchievementRarity, xpReward: 10  },
  { key: 'TAP_100',              ua: '100 тапів',             en: '100 Taps',              rarity: 'common'    as AchievementRarity, xpReward: 50, condition: { type: 'taps', value: 100 } },
  { key: 'TAP_1000',             ua: '1000 тапів',            en: '1000 Taps',             rarity: 'rare'      as AchievementRarity, xpReward: 200, condition: { type: 'taps', value: 1000 } },
  { key: 'TAP_10000',            ua: '10000 тапів',           en: '10000 Taps',            rarity: 'epic'      as AchievementRarity, xpReward: 500, condition: { type: 'taps', value: 10000 } },
  { key: 'XP_1000',              ua: '1000 XP',               en: '1000 XP Earned',        rarity: 'rare'      as AchievementRarity, xpReward: 100, condition: { type: 'xp', value: 1000 } },
  { key: 'XP_10000',             ua: '10000 XP',              en: '10000 XP Earned',       rarity: 'epic'      as AchievementRarity, xpReward: 500, condition: { type: 'xp', value: 10000 } },
  { key: 'FIRST_REFERRAL',       ua: 'Перший реферал',        en: 'First Referral',        rarity: 'rare'      as AchievementRarity, xpReward: 200 },
  { key: 'REFERRALS_10',         ua: '10 рефералів',          en: '10 Referrals',          rarity: 'epic'      as AchievementRarity, xpReward: 500, condition: { type: 'referrals', value: 10 } },
  { key: 'FIRST_DONATION',       ua: 'Перша пожертва',        en: 'First Donation',        rarity: 'rare'      as AchievementRarity, xpReward: 150 },
  { key: 'DONATED_100',          ua: '100 зірок пожертвовано',en: '100 Stars Donated',     rarity: 'epic'      as AchievementRarity, xpReward: 400, condition: { type: 'donated', value: 100 } },
  { key: 'DONATED_1000',         ua: '1000 зірок',            en: '1000 Stars Donated',    rarity: 'legendary' as AchievementRarity, xpReward: 2000, condition: { type: 'donated', value: 1000 } },
  { key: 'STREAK_7',             ua: '7 днів поспіль',        en: '7-Day Streak',          rarity: 'rare'      as AchievementRarity, xpReward: 200, condition: { type: 'streak', value: 7 } },
  { key: 'STREAK_30',            ua: '30 днів поспіль',       en: '30-Day Streak',         rarity: 'legendary' as AchievementRarity, xpReward: 1000, condition: { type: 'streak', value: 30 } },
  { key: 'COLLECTION_KYIVAN_RUS',ua: 'Колекція Київська Русь',en: 'Kyivan Rus Collection', rarity: 'epic'      as AchievementRarity, xpReward: 500 },
  { key: 'COLLECTION_COSSACK_ERA',ua:'Колекція Козацька доба',en: 'Cossack Era Collection',rarity: 'epic'      as AchievementRarity, xpReward: 500 },
  { key: 'COLLECTION_UNR',       ua: 'Колекція УНР',          en: 'UNR Collection',        rarity: 'epic'      as AchievementRarity, xpReward: 500 },
  { key: 'COLLECTION_MODERN_UKRAINE', ua: 'Сучасна Україна',  en: 'Modern Ukraine Coll.',  rarity: 'epic'      as AchievementRarity, xpReward: 500 },
  { key: 'ARTIFACTS_5',          ua: '5 артефактів у магазині',en: '5 Shop Artifacts',     rarity: 'rare'      as AchievementRarity, xpReward: 150, condition: { type: 'shop_artifacts', value: 5 } },
  { key: 'ARTIFACTS_ALL',        ua: 'Всі артефакти у магазині',en: 'All Shop Artifacts',   rarity: 'legendary' as AchievementRarity, xpReward: 2000 },
];

type AchievementRarity = 'common' | 'rare' | 'epic' | 'legendary';

export const DAILY_QUEST_TEMPLATES = [
  { key: 'daily_taps',            title_ua: 'Зробіть 50 тапів',          title_en: 'Make 50 taps',          target: 50,  xp: 25  },
  { key: 'daily_view_artifacts',  title_ua: 'Перегляньте 3 артефакти',    title_en: 'View 3 artifacts',      target: 3,   xp: 30  },
  { key: 'daily_read_articles',   title_ua: 'Прочитайте 1 статтю',       title_en: 'Read 1 article',        target: 1,   xp: 40  },
  { key: 'daily_claim',           title_ua: 'Отримайте щоденну нагороду', title_en: 'Claim daily reward',    target: 1,   xp: 20  },
  { key: 'daily_spin',            title_ua: 'Крутіть колесо фортуни',     title_en: 'Spin the wheel',        target: 1,   xp: 35  },
];

// ─── User API ──────────────────────────────────────────────────────────────────

export const museumAPI = {
  async getOrCreateUser(telegramId: number, userData: {
    username?: string;
    first_name: string;
    last_name?: string;
    photo_url?: string;
    language_code?: string;
  }): Promise<DBUser | null> {
    try {
      const { data: existing } = await supabase
        .from('users')
        .select('*')
        .eq('telegram_id', telegramId)
        .maybeSingle();

      if (existing) {
        await supabase.from('users').update({ last_visit: new Date().toISOString() }).eq('telegram_id', telegramId);
        return existing as DBUser;
      }

      const { data: created, error } = await supabase
        .from('users')
        .insert({
          telegram_id: telegramId,
          username: userData.username,
          first_name: userData.first_name,
          last_name: userData.last_name,
          photo_url: userData.photo_url,
          language_code: userData.language_code || 'en',
          total_xp: 0,
          total_taps: 0,
        })
        .select()
        .single();

      if (error) throw error;
      return created as DBUser;
    } catch (e) {
      console.error('getOrCreateUser error:', e);
      return null;
    }
  },

  async addXPAtomic(userId: number, amount: number): Promise<number> {
    try {
      const { data, error } = await supabase.rpc('atomic_add_xp', { p_user_id: userId, p_xp: amount });
      if (error) throw error;
      const newXP = (data as number) ?? 0;

      // Sync season XP
      const { data: season } = await supabase.from('seasons').select('id').eq('is_active', true).maybeSingle();
      if (season) {
        const { data: sp } = await supabase
          .from('user_season_progress')
          .select('id, current_xp')
          .eq('user_id', userId)
          .eq('season_id', season.id)
          .maybeSingle();

        if (sp) {
          await supabase
            .from('user_season_progress')
            .update({ current_xp: sp.current_xp + amount })
            .eq('id', sp.id);
        } else {
          await supabase
            .from('user_season_progress')
            .insert({ user_id: userId, season_id: season.id, current_xp: amount });
        }
      }
      return newXP;
    } catch (e) {
      console.error('addXPAtomic error:', e);
      return 0;
    }
  },

  async getMuseumArtifacts(lang: 'ua' | 'en' = 'en') {
    const { data } = await supabase.from('museum_artifacts').select('*').order('sort_order');
    if (!data) return [];
    return data.map(a => ({
      id: a.id,
      category: a.category,
      rarity: a.rarity as ArtifactRarity,
      title: lang === 'ua' ? a.title_ua : a.title_en,
      description: lang === 'ua' ? a.description_ua : a.description_en,
      history: lang === 'ua' ? a.history_ua : a.history_en,
      image: a.image,
      year: a.year,
    }));
  },

  async getMuseumArticles(lang: 'ua' | 'en' = 'en') {
    const { data } = await supabase.from('museum_articles').select('*').order('sort_order');
    if (!data) return [];
    return data.map(a => ({
      id: a.id,
      category: a.category,
      title: lang === 'ua' ? a.title_ua : a.title_en,
      content: lang === 'ua' ? a.content_ua : a.content_en,
      required_views: a.required_views,
    }));
  },

  async viewMuseumArtifact(userId: number, artifactId: string): Promise<number> {
    try {
      const { data: existing } = await supabase
        .from('artifact_views')
        .select('id')
        .eq('user_id', userId)
        .eq('artifact_id', artifactId)
        .maybeSingle();

      if (!existing) {
        await supabase.from('artifact_views').insert({ user_id: userId, artifact_id: artifactId });
        await this.updateDailyQuestProgress(userId, 'daily_view_artifacts', 1);
        return await this.addXPAtomic(userId, 15);
      }
      return 0;
    } catch (e) {
      console.error('viewMuseumArtifact error:', e);
      return 0;
    }
  },

  async getArtifactViews(userId: number): Promise<string[]> {
    const { data } = await supabase.from('artifact_views').select('artifact_id').eq('user_id', userId);
    return data?.map(v => v.artifact_id) ?? [];
  },

  async readArticle(userId: number, _articleId: string): Promise<number> {
    await this.updateDailyQuestProgress(userId, 'daily_read_articles', 1);
    return await this.addXPAtomic(userId, 20);
  },

  async getTapGameState(userId: number) {
    const { data } = await supabase.from('tap_game_state').select('*').eq('user_id', userId).maybeSingle();
    if (data) return data;
    const { data: created } = await supabase
      .from('tap_game_state')
      .insert({ user_id: userId, tap_level: 1, total_taps: 0, active_artifact: 'default' })
      .select()
      .single();
    return created;
  },

  async getOwnedArtifacts(userId: number): Promise<string[]> {
    const { data } = await supabase.from('tap_artifacts').select('artifact_key').eq('user_id', userId);
    return data?.map(a => a.artifact_key) ?? [];
  },

  async purchaseArtifact(userId: number, artifactKey: string): Promise<boolean> {
    try {
      const artifact = TAP_ARTIFACTS.find(a => a.key === artifactKey);
      if (!artifact) return false;

      const { data: user } = await supabase.from('users').select('total_xp').eq('id', userId).single();
      if (!user || user.total_xp < artifact.cost) return false;

      await supabase.from('users').update({ total_xp: user.total_xp - artifact.cost }).eq('id', userId);
      const { error } = await supabase.from('tap_artifacts').insert({ user_id: userId, artifact_key: artifactKey });
      if (error) {
        await supabase.from('users').update({ total_xp: user.total_xp }).eq('id', userId);
        return false;
      }
      return true;
    } catch (e) {
      console.error('purchaseArtifact error:', e);
      return false;
    }
  },

  async upgradeTapLevel(userId: number): Promise<{ success: boolean; newLevel: number; cost: number }> {
    try {
      const gameState = await this.getTapGameState(userId);
      if (!gameState) return { success: false, newLevel: 1, cost: 0 };

      const level = gameState.tap_level ?? 1;
      const cost = level * 200;

      const { data: user } = await supabase.from('users').select('total_xp').eq('id', userId).single();
      if (!user || user.total_xp < cost) return { success: false, newLevel: level, cost };

      const newXP = user.total_xp - cost;
      await supabase.from('users').update({ total_xp: newXP }).eq('id', userId);

      const { error } = await supabase
        .from('tap_game_state')
        .update({ tap_level: level + 1 })
        .eq('user_id', userId);

      if (error) {
        await supabase.from('users').update({ total_xp: user.total_xp }).eq('id', userId);
        return { success: false, newLevel: level, cost };
      }

      return { success: true, newLevel: level + 1, cost };
    } catch (e) {
      console.error('upgradeTapLevel error:', e);
      return { success: false, newLevel: 1, cost: 0 };
    }
  },

  async recordTapBatch(userId: number, taps: number, xp: number): Promise<void> {
    try {
      await supabase.rpc('atomic_add_taps', { p_user_id: userId, p_taps: taps });
      await this.addXPAtomic(userId, xp);
      await this.updateDailyQuestProgress(userId, 'daily_taps', taps);
    } catch (e) {
      console.error('recordTapBatch error:', e);
    }
  },

  async claimDailyReward(userId: number, streak: number): Promise<{ success: boolean; xp: number; streak: number }> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data: existing } = await supabase
        .from('daily_reward_claims')
        .select('id')
        .eq('user_id', userId)
        .eq('claim_date', today)
        .maybeSingle();

      if (existing) return { success: false, xp: 0, streak };

      const { data: ownedArtifacts } = await supabase
        .from('tap_artifacts')
        .select('artifact_key')
        .eq('user_id', userId);

      const keys = ownedArtifacts?.map(a => a.artifact_key) ?? [];
      let streakBonusXP = 0;
      for (const key of keys) {
        const artifact = TAP_ARTIFACTS.find(a => a.key === key);
        if (artifact?.effects?.streakBonus) {
          streakBonusXP += artifact.effects.streakBonus * streak;
        }
      }

      const baseXP = 50 + streak * 10;
      const totalXP = baseXP + streakBonusXP;

      await supabase.from('daily_reward_claims').insert({
        user_id: userId,
        claim_date: today,
        streak_day: streak,
        reward_type: 'xp',
        reward_amount: totalXP,
      });

      const newStreak = streak + 1;
      await supabase.from('users').update({ current_streak: newStreak, daily_claim_date: today }).eq('id', userId);
      await this.addXPAtomic(userId, totalXP);
      await this.updateDailyQuestProgress(userId, 'daily_claim', 1);

      return { success: true, xp: totalXP, streak: newStreak };
    } catch (e) {
      console.error('claimDailyReward error:', e);
      return { success: false, xp: 0, streak };
    }
  },

  async getUnlockedAchievements(userId: number): Promise<string[]> {
    const { data } = await supabase.from('achievements').select('achievement_key').eq('user_id', userId);
    return data?.map(a => a.achievement_key) ?? [];
  },

  async unlockAchievement(userId: number, key: string): Promise<boolean> {
    try {
      const { data: existing } = await supabase
        .from('achievements')
        .select('id')
        .eq('user_id', userId)
        .eq('achievement_key', key)
        .maybeSingle();
      if (existing) return false;
      await supabase.from('achievements').insert({ user_id: userId, achievement_key: key });
      const ach = UNIFIED_ACHIEVEMENTS.find(a => a.key === key);
      if (ach) await this.addXPAtomic(userId, ach.xpReward);
      return true;
    } catch (e) {
      console.error('unlockAchievement error:', e);
      return false;
    }
  },

  async getWeeklyQuests(userId: number) {
    try {
      const now = new Date();
      const day = now.getDay();
      const diff = now.getDate() - day + (day === 0 ? -6 : 1);
      const monday = new Date(now.setDate(diff));
      const weekStart = monday.toISOString().split('T')[0];

      const { data: quests } = await supabase
        .from('weekly_quests')
        .select('*')
        .gte('week_end', weekStart)
        .order('created_at');

      if (!quests || quests.length === 0) return [];

      const questIds = quests.map(q => q.id);
      const { data: progress } = await supabase
        .from('user_quest_progress')
        .select('*')
        .eq('user_id', userId)
        .in('quest_id', questIds);

      return quests.map(q => {
        const p = progress?.find(p => p.quest_id === q.id);
        return {
          ...q,
          current_count: p?.current_count ?? 0,
          completed: p?.completed ?? false,
          claimed: p?.claimed ?? false,
        };
      });
    } catch (e) {
      console.error('getWeeklyQuests error:', e);
      return [];
    }
  },

  async getDailyQuests(userId: number): Promise<Array<DailyQuest & { current_count: number; completed: boolean; claimed: boolean }>> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data: quests } = await supabase
        .from('daily_quests')
        .select('*')
        .eq('quest_date', today);

      if (!quests || quests.length === 0) return [];

      const questIds = quests.map(q => q.id);
      const { data: progress } = await supabase
        .from('user_daily_quest_progress')
        .select('*')
        .eq('user_id', userId)
        .in('daily_quest_id', questIds);

      return quests.map(q => {
        const p = progress?.find(p => p.daily_quest_id === q.id);
        return {
          ...q,
          current_count: p?.current_count ?? 0,
          completed: p?.completed ?? false,
          claimed: p?.claimed ?? false,
        };
      });
    } catch (e) {
      console.error('getDailyQuests error:', e);
      return [];
    }
  },

  async updateDailyQuestProgress(userId: number, questKey: string, increment: number): Promise<void> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data: quest } = await supabase
        .from('daily_quests')
        .select('id, target_count')
        .eq('quest_key', questKey)
        .eq('quest_date', today)
        .maybeSingle();
      if (!quest) return;

      const { data: existing } = await supabase
        .from('user_daily_quest_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('daily_quest_id', quest.id)
        .maybeSingle();

      if (existing) {
        const newCount = Math.min(existing.current_count + increment, quest.target_count);
        const completed = newCount >= quest.target_count;
        await supabase
          .from('user_daily_quest_progress')
          .update({ current_count: newCount, completed })
          .eq('id', existing.id);
      } else {
        const newCount = Math.min(increment, quest.target_count);
        await supabase.from('user_daily_quest_progress').insert({
          user_id: userId,
          daily_quest_id: quest.id,
          current_count: newCount,
          completed: newCount >= quest.target_count,
          claimed: false,
        });
      }
    } catch (e) {
      console.error('updateDailyQuestProgress error:', e);
    }
  },

  async claimDailyQuestReward(userId: number, questId: string): Promise<number> {
    try {
      const { data: progress } = await supabase
        .from('user_daily_quest_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('daily_quest_id', questId)
        .maybeSingle();

      if (!progress || !progress.completed || progress.claimed) return 0;

      const { data: quest } = await supabase
        .from('daily_quests')
        .select('reward_xp')
        .eq('id', questId)
        .single();

      if (!quest) return 0;

      await supabase
        .from('user_daily_quest_progress')
        .update({ claimed: true })
        .eq('id', progress.id);

      return await this.addXPAtomic(userId, quest.reward_xp);
    } catch (e) {
      console.error('claimDailyQuestReward error:', e);
      return 0;
    }
  },

  async getLuckySpinState(userId: number) {
    const { data } = await supabase.from('lucky_spins').select('*').eq('user_id', userId).maybeSingle();
    if (data) return data;
    const { data: created } = await supabase
      .from('lucky_spins')
      .insert({ user_id: userId, free_spins: 1 })
      .select()
      .single();
    return created;
  },

  async recordSpinReward(userId: number, rewardType: string, rewardValue: number): Promise<void> {
    try {
      await supabase.from('spin_rewards_log').insert({ user_id: userId, reward_type: rewardType, reward_value: rewardValue });
      await supabase
        .from('lucky_spins')
        .update({ free_spins: 0, last_free_spin_date: new Date().toISOString(), total_spins: supabase.rpc as unknown as number })
        .eq('user_id', userId);
      if (rewardType === 'xp') await this.addXPAtomic(userId, rewardValue);
      await this.updateDailyQuestProgress(userId, 'daily_spin', 1);
    } catch (e) {
      console.error('recordSpinReward error:', e);
    }
  },

  async getLeaderboard(limit = 50) {
    const { data } = await supabase
      .from('users')
      .select('telegram_id, first_name, last_name, username, photo_url, total_xp, total_taps, current_streak')
      .order('total_xp', { ascending: false })
      .limit(limit);
    return data ?? [];
  },

  async getReferralCount(userId: number): Promise<number> {
    const { count } = await supabase
      .from('referrals')
      .select('*', { count: 'exact', head: true })
      .eq('referrer_id', userId);
    return count ?? 0;
  },

  async processReferral(referrerId: number, referredId: number): Promise<void> {
    try {
      const { data: existing } = await supabase
        .from('referrals')
        .select('id')
        .eq('referred_id', referredId)
        .maybeSingle();
      if (existing) return;

      await supabase.from('referrals').insert({ referrer_id: referrerId, referred_id: referredId });
      await this.addXPAtomic(referrerId, 100);
    } catch (e) {
      console.error('processReferral error:', e);
    }
  },

  async getSeasonData(userId: number) {
    try {
      const { data: season } = await supabase.from('seasons').select('*').eq('is_active', true).maybeSingle();
      if (!season) return null;

      const { data: progress } = await supabase
        .from('user_season_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('season_id', season.id)
        .maybeSingle();

      return {
        season,
        progress: progress ?? { current_xp: 0, has_premium: false },
      };
    } catch (e) {
      console.error('getSeasonData error:', e);
      return null;
    }
  },

  async donateStars(userId: number, amount: number, transactionId?: string): Promise<number> {
    try {
      await supabase.from('donations').insert({
        user_id: userId,
        amount,
        currency: 'XTR',
        payment_method: 'telegram_stars',
        transaction_id: transactionId,
        status: 'completed',
      });
      const xpFromDonation = Math.floor(amount <= 50 ? amount : 50 + (amount - 50) * 0.5);
      return await this.addXPAtomic(userId, xpFromDonation);
    } catch (e) {
      console.error('donateStars error:', e);
      return 0;
    }
  },

  async getLimitedArtifacts() {
    const { data } = await supabase
      .from('limited_artifacts')
      .select('*')
      .gte('available_until', new Date().toISOString());
    return data ?? [];
  },

  async claimLimitedArtifact(userId: number, artifactId: number): Promise<boolean> {
    try {
      const { data: artifact } = await supabase
        .from('limited_artifacts')
        .select('*')
        .eq('id', artifactId)
        .single();
      if (!artifact) return false;

      const { data: existing } = await supabase
        .from('user_limited_artifacts')
        .select('id')
        .eq('user_id', userId)
        .eq('limited_artifact_id', artifactId)
        .maybeSingle();
      if (existing) return false;

      await supabase.from('user_limited_artifacts').insert({ user_id: userId, limited_artifact_id: artifactId });
      await supabase
        .from('limited_artifacts')
        .update({ claimed_count: artifact.claimed_count + 1 })
        .eq('id', artifactId);
      await this.addXPAtomic(userId, artifact.xp_bonus);
      return true;
    } catch (e) {
      console.error('claimLimitedArtifact error:', e);
      return false;
    }
  },

  async getGuilds() {
    const { data } = await supabase
      .from('guilds')
      .select(`*, guild_members(count)`)
      .order('total_xp', { ascending: false })
      .limit(20);
    return data ?? [];
  },

  async getUserGuild(userId: number) {
    const { data } = await supabase
      .from('guild_members')
      .select(`*, guilds(*)`)
      .eq('user_id', userId)
      .maybeSingle();
    return data;
  },

  async startActivitySession(userId: number): Promise<number> {
    const { data } = await supabase
      .from('activity_sessions')
      .insert({ user_id: userId })
      .select('id')
      .single();
    return data?.id ?? 0;
  },

  async endActivitySession(sessionId: number): Promise<void> {
    const { data: session } = await supabase
      .from('activity_sessions')
      .select('session_start')
      .eq('id', sessionId)
      .maybeSingle();
    if (!session) return;
    const minutes = Math.floor((Date.now() - new Date(session.session_start).getTime()) / 60000);
    await supabase
      .from('activity_sessions')
      .update({ session_end: new Date().toISOString(), minutes_spent: minutes })
      .eq('id', sessionId);
  },

  async checkAndUnlockAchievements(userId: number, stats: {
    totalTaps: number;
    totalXP: number;
    streak: number;
    artifactsViewed: number;
    referrals: number;
  }): Promise<string[]> {
    const unlocked: string[] = [];
    const existing = await this.getUnlockedAchievements(userId);

    const check = async (key: string, condition: boolean) => {
      if (condition && !existing.includes(key)) {
        const ok = await this.unlockAchievement(userId, key);
        if (ok) unlocked.push(key);
      }
    };

    await check('FIRST_TAP', stats.totalTaps >= 1);
    await check('TAP_100', stats.totalTaps >= 100);
    await check('TAP_1000', stats.totalTaps >= 1000);
    await check('TAP_10000', stats.totalTaps >= 10000);
    await check('XP_1000', stats.totalXP >= 1000);
    await check('XP_10000', stats.totalXP >= 10000);
    await check('STREAK_7', stats.streak >= 7);
    await check('STREAK_30', stats.streak >= 30);
    await check('TEN_ARTIFACTS', stats.artifactsViewed >= 10);
    await check('ALL_ARTIFACTS', stats.artifactsViewed >= 56);
    await check('FIRST_REFERRAL', stats.referrals >= 1);
    await check('REFERRALS_10', stats.referrals >= 10);

    return unlocked;
  },
};
