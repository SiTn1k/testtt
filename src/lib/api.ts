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
}

// All images use confirmed-working Unsplash photo IDs from the museum ARTIFACTS array
export const TAP_ARTIFACTS: TapArtifact[] = [
  {
    key: "kyiv_coin",
    name: { ua: "Київська Монета", en: "Kyiv Coin" },
    xpBonus: 2,
    costXP: 0,
    costStars: 0,
    isStarter: true,
    image: "https://images.unsplash.com/photo-1561542320-ec5c88087ab4?w=200&h=200&fit=crop",
  },
  {
    key: "cossack_saber",
    name: { ua: "Козацька Шабля", en: "Cossack Saber" },
    xpBonus: 3,
    costXP: 800,
    costStars: 0,
    image: "https://images.unsplash.com/photo-1766081816102-e8d70da3a2b1?w=200&h=200&fit=crop",
  },
  {
    key: "vyshyvanka_amulet",
    name: { ua: "Оберіг Вишиванки", en: "Vyshyvanka Amulet" },
    xpBonus: 5,
    costXP: 0,
    costStars: 25,
    image: "https://images.unsplash.com/photo-1655678204995-0e1eb3d2fdbc?w=200&h=200&fit=crop",
  },
  {
    key: "pysanka_power",
    name: { ua: "Сила Писанки", en: "Pysanka Power" },
    xpBonus: 10,
    costXP: 0,
    costStars: 50,
    image: "https://images.unsplash.com/photo-1617191574040-c57e8af59ddb?w=200&h=200&fit=crop",
  },
  {
    key: "golden_crown",
    name: { ua: "Золота Корона", en: "Golden Crown" },
    xpBonus: 20,
    costXP: 0,
    costStars: 100,
    image: "https://images.unsplash.com/photo-1770112095032-693a32cace1d?w=200&h=200&fit=crop",
  },
  {
    key: "hetman_mace",
    name: { ua: "Булава Гетьмана", en: "Hetman's Mace" },
    xpBonus: 50,
    costXP: 0,
    costStars: 250,
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200&h=200&fit=crop",
  },
  {
    key: "trident_independence",
    name: { ua: "Тризуб Незалежності", en: "Trident of Independence" },
    xpBonus: 100,
    costXP: 0,
    costStars: 500,
    image: "https://images.unsplash.com/photo-1605991362090-47188b84d40a?w=200&h=200&fit=crop",
  },
  {
    key: "orlyk_constitution",
    name: { ua: "Конституція Орлика", en: "Orlyk Constitution" },
    xpBonus: 150,
    costXP: 0,
    costStars: 750,
    image: "https://images.unsplash.com/photo-1705769945723-10ecbe1f7df8?w=200&h=200&fit=crop",
  },
  {
    key: "peresopnytsia",
    name: { ua: "Пересопницьке Євангеліє", en: "Peresopnytsia Gospel" },
    xpBonus: 250,
    costXP: 0,
    costStars: 1000,
    image: "https://images.unsplash.com/photo-1561542320-ec5c88087ab4?w=200&h=200&fit=crop",
  },
  {
    key: "hetman_treasure",
    name: { ua: "Скарб Гетьмана", en: "Hetman's Treasure" },
    xpBonus: 500,
    costXP: 0,
    costStars: 1500,
    image: "https://images.unsplash.com/photo-1770112095032-693a32cace1d?w=200&h=200&fit=crop",
  },
  {
    key: "indestructible_symbol",
    name: { ua: "Символ Незламності", en: "Symbol of Indestructibility" },
    xpBonus: 1000,
    costXP: 0,
    costStars: 2500,
    image: "https://images.unsplash.com/photo-1605991362090-47188b84d40a?w=200&h=200&fit=crop",
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

const RANK_THRESHOLDS = [
  { minXP: 0,       key: "novice",    ua: "Новачок",        en: "Novice",        nextXP: 100    },
  { minXP: 100,     key: "explorer",  ua: "Дослідник",      en: "Explorer",      nextXP: 500    },
  { minXP: 500,     key: "historian", ua: "Історик",        en: "Historian",     nextXP: 2000   },
  { minXP: 2000,    key: "patron",    ua: "Патрон",         en: "Patron",        nextXP: 5000   },
  { minXP: 5000,    key: "legend",    ua: "Легенда музею",  en: "Museum Legend", nextXP: 10000  },
  { minXP: 10000,   key: "hero",      ua: "Герой",          en: "Hero",          nextXP: 50000  },
  { minXP: 50000,   key: "champion",  ua: "Чемпіон",        en: "Champion",      nextXP: 200000 },
  { minXP: 200000,  key: "immortal",  ua: "Безсмертний",    en: "Immortal",      nextXP: 1000000},
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
      nextLevelXP: rank.nextXP,
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

    await this.addXPAtomic(userId, Math.floor(amount));
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

    await supabase.rpc("atomic_add_xp", { p_user_id: userId, p_xp: -costXP });
    await supabase
      .from("tap_game_state")
      .update({ tap_level: nextLevel, updated_at: new Date().toISOString() })
      .eq("user_id", userId);

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
}

export const museumAPI = new MuseumAPI();
