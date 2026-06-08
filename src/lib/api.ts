import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase env vars. VITE_SUPABASE_URL:", supabaseUrl, "VITE_SUPABASE_ANON_KEY:", supabaseKey ? "present" : "MISSING");
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
  x2_boost_until: string | null;
  active_artifact: string;
}

export const TAP_LEVELS = [
  { level: 1, xpPerTap: 1, upgradeCostXP: 100, label: { ua: "Рівень 1", en: "Level 1" } },
  { level: 2, xpPerTap: 2, upgradeCostXP: 500, label: { ua: "Рівень 2", en: "Level 2" } },
  { level: 3, xpPerTap: 3, upgradeCostXP: 2000, label: { ua: "Рівень 3 (Макс)", en: "Level 3 (Max)" } },
];

export const BOOST_COST_STARS = 25;
export const BOOST_DURATION_MIN = 15;

// Tap artifacts that can be purchased — each gives more XP per click
export interface TapArtifact {
  key: string;
  name: { ua: string; en: string };
  description: { ua: string; en: string };
  xpBonus: number; // additional XP per tap
  costXP: number;  // price in XP (0 = Stars only)
  costStars: number; // price in Stars (0 = XP only)
  image: string;
}

export const TAP_ARTIFACTS: TapArtifact[] = [
  {
    key: "kyiv_coin",
    name: { ua: "Київська Монета", en: "Kyiv Coin" },
    description: { ua: "Давня монета Київської Русі +2 XP/клік", en: "Ancient coin of Kyivan Rus +2 XP/click" },
    xpBonus: 2,
    costXP: 300,
    costStars: 0,
    image: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=200&h=200&fit=crop",
  },
  {
    key: "cossack_saber",
    name: { ua: "Козацька Шабля", en: "Cossack Saber" },
    description: { ua: "Шабля запорізького козака +3 XP/клік", en: "Saber of a Zaporizhian Cossack +3 XP/click" },
    xpBonus: 3,
    costXP: 800,
    costStars: 0,
    image: "https://images.unsplash.com/photo-1595437111809-3b0ac8707b27?w=200&h=200&fit=crop",
  },
  {
    key: "vyshyvanka_amulet",
    name: { ua: "Оберіг Вишиванки", en: "Vyshyvanka Amulet" },
    description: { ua: "Магічний оберіг з орнаментами +5 XP/клік", en: "Magical amulet with ornaments +5 XP/click" },
    xpBonus: 5,
    costXP: 0,
    costStars: 50,
    image: "https://images.unsplash.com/photo-1655678204995-0e1eb3d2fdbc?w=200&h=200&fit=crop",
  },
  {
    key: "pysanka_power",
    name: { ua: "Сила Писанки", en: "Pysanka Power" },
    description: { ua: "Давня сила писанки +7 XP/клік", en: "Ancient power of pysanka +7 XP/click" },
    xpBonus: 7,
    costXP: 0,
    costStars: 100,
    image: "https://images.unsplash.com/photo-1617191574040-c57e8af59ddb?w=200&h=200&fit=crop",
  },
  {
    key: "golden_crown",
    name: { ua: "Золота Корона", en: "Golden Crown" },
    description: { ua: "Корона Ярослава Мудрого +10 XP/клік", en: "Crown of Yaroslav the Wise +10 XP/click" },
    xpBonus: 10,
    costXP: 3000,
    costStars: 0,
    image: "https://images.unsplash.com/photo-1596181938181-6a00051c5746?w=200&h=200&fit=crop",
  },
  {
    key: "trident_relic",
    name: { ua: "Реліквія Тризуба", en: "Trident Relic" },
    description: { ua: "Священна реліквія України +15 XP/клік", en: "Sacred relic of Ukraine +15 XP/click" },
    xpBonus: 15,
    costXP: 0,
    costStars: 200,
    image: "https://images.unsplash.com/photo-1605991362090-47188b84d40a?w=200&h=200&fit=crop",
  },
];

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
  { minXP: 0, key: "novice", ua: "Новачок", en: "Novice", nextXP: 100 },
  { minXP: 100, key: "explorer", ua: "Дослідник", en: "Explorer", nextXP: 500 },
  { minXP: 500, key: "historian", ua: "Історик", en: "Historian", nextXP: 2000 },
  { minXP: 2000, key: "patron", ua: "Патрон", en: "Patron", nextXP: 5000 },
  { minXP: 5000, key: "legend", ua: "Легенда музею", en: "Museum Legend", nextXP: 10000 },
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

  async getProfile(telegramId: number, lang: "ua" | "en"): Promise<UserProfile | null> {
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

  // ── Global donation stats ────────────────────────────────────────────────

  async getGlobalDonationStats(): Promise<{ totalRaised: number; donorsCount: number }> {
    const { data, error } = await supabase
      .from("donations")
      .select("amount, user_id")
      .eq("status", "completed");

    if (error) {
      console.error("Get global donation stats error:", error);
      return { totalRaised: 0, donorsCount: 0 };
    }

    const totalRaised = (data || []).reduce((sum: number, d: { amount: number }) => sum + Number(d.amount), 0);
    const donorsCount = new Set((data || []).map((d: { user_id: number }) => d.user_id)).size;

    return { totalRaised, donorsCount };
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
    const { data: existing } = await supabase
      .from("tap_game_state")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (existing) return existing;

    const { data, error } = await supabase
      .from("tap_game_state")
      .insert([{ user_id: userId, tap_level: 1, total_taps: 0, active_artifact: "default" }])
      .select()
      .single();

    if (error) {
      console.error("Init tap state error:", error.message);
      throw error;
    }
    return data;
  }

  async recordTapBatch(userId: number, count: number, totalXP: number): Promise<{ newTaps: number; newXp: number }> {
    // Atomic XP increment
    const { data: xpResult } = await supabase.rpc("atomic_add_xp", {
      p_user_id: userId,
      p_xp: totalXP,
    });

    // Atomic tap count increment
    const { data: tapResult } = await supabase.rpc("atomic_add_taps", {
      p_user_id: userId,
      p_count: count,
    });

    return { newTaps: tapResult || 0, newXp: xpResult || 0 };
  }

  async upgradeTapLevel(userId: number): Promise<{ success: boolean; newLevel: number; xpSpent: number }> {
    const state = await this.getTapState(userId);
    if (!state) throw new Error("Tap state not found");

    if (state.tap_level >= 3) return { success: false, newLevel: 3, xpSpent: 0 };

    const nextLevel = state.tap_level + 1;
    const nextConfig = TAP_LEVELS.find(l => l.level === nextLevel);
    if (!nextConfig || !nextConfig.upgradeCostXP) return { success: false, newLevel: state.tap_level, xpSpent: 0 };

    // Atomic: subtract XP and upgrade level in one go
    // First check if enough XP
    const { data: user } = await supabase
      .from("users")
      .select("total_xp")
      .eq("id", userId)
      .maybeSingle();

    const currentXP = user?.total_xp || 0;
    if (currentXP < nextConfig.upgradeCostXP) return { success: false, newLevel: state.tap_level, xpSpent: 0 };

    // Use negative atomic increment to spend XP
    await supabase.rpc("atomic_add_xp", { p_user_id: userId, p_xp: -nextConfig.upgradeCostXP });

    await supabase
      .from("tap_game_state")
      .update({ tap_level: nextLevel, updated_at: new Date().toISOString() })
      .eq("user_id", userId);

    return { success: true, newLevel: nextLevel, xpSpent: nextConfig.upgradeCostXP };
  }

  async buyBoost(userId: number): Promise<{ success: boolean; boostUntil: string | null }> {
    const boostUntil = new Date(Date.now() + BOOST_DURATION_MIN * 60 * 1000).toISOString();

    const { error } = await supabase
      .from("tap_game_state")
      .update({ x2_boost_until: boostUntil, updated_at: new Date().toISOString() })
      .eq("user_id", userId);

    if (error) {
      console.error("Buy boost error:", error.message);
      return { success: false, boostUntil: null };
    }

    return { success: true, boostUntil };
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
    // Check enough XP
    const { data: user } = await supabase
      .from("users")
      .select("total_xp")
      .eq("id", userId)
      .maybeSingle();

    const currentXP = user?.total_xp || 0;
    if (currentXP < costXP) return { success: false };

    // Spend XP atomically
    await supabase.rpc("atomic_add_xp", { p_user_id: userId, p_xp: -costXP });

    // Add artifact ownership
    const { error } = await supabase
      .from("tap_artifacts")
      .insert([{ user_id: userId, artifact_key: artifactKey }]);

    if (error) {
      console.error("Buy artifact error:", error);
      // Refund XP
      await supabase.rpc("atomic_add_xp", { p_user_id: userId, p_xp: costXP });
      return { success: false };
    }

    // Auto-equip the new artifact
    await supabase
      .from("tap_game_state")
      .update({ active_artifact: artifactKey, updated_at: new Date().toISOString() })
      .eq("user_id", userId);

    return { success: true };
  }

  async buyArtifactStars(userId: number, artifactKey: string): Promise<{ success: boolean }> {
    // Called after Stars payment confirmed
    const { error } = await supabase
      .from("tap_artifacts")
      .insert([{ user_id: userId, artifact_key: artifactKey }]);

    if (error) {
      console.error("Buy artifact stars error:", error);
      return { success: false };
    }

    // Auto-equip
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

  // ── XP (atomic via RPC) ────────────────────────────────────────────────────

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
