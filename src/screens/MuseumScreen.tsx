import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { LucideIcon } from "lucide-react";
import {
  Globe, Crown, Sword, Scroll, Building2,
  ChevronLeft, BookOpen, Lock,
  Sparkles, Shield, CheckCircle2,
} from "lucide-react";
import { GlassCard } from "./GlassCard";
import {
  museumAPI,
  CATEGORY_META,
  RARITY_META,
  type MuseumArtifact,
  type MuseumArticle,
  type MuseumProgress,
  type ArtifactCategory,
} from "../lib/api";

const CATEGORY_ICONS: Record<ArtifactCategory, LucideIcon> = {
  kyivan_rus: Crown,
  cossack_era: Sword,
  unr: Scroll,
  modern_ukraine: Building2,
};

export function MuseumScreen({ lang, dbUser, onRefresh }: { lang: "ua" | "en"; dbUser: { id: string } | null; onRefresh: () => void }) {
  const t = {
    ua: { title: "Колекція", search: "Пошук артефактів...", all: "Всі", articles: "Статті", progress: "Прогрес", viewed: "Переглянуто", history: "Історія", unlockReq: "Потрібно переглянути", unlocked: "Розблоковано", read: "Прочитати", collection: "Колекція", complete: "Завершено", claimReward: "Отримати нагороду", claimed: "Отримано", artifactsViewed: "Артефактів переглянуто", xpEarned: "XP отримано", close: "Закрити", rarity: "Рідкість", category: "Категорія", year: "Рік" },
    en: { title: "Collection", search: "Search artifacts...", all: "All", articles: "Articles", progress: "Progress", viewed: "Viewed", history: "History", unlockReq: "Need to view", unlocked: "Unlocked", read: "Read", collection: "Collection", complete: "Complete", claimReward: "Claim Reward", claimed: "Claimed", artifactsViewed: "Artifacts viewed", xpEarned: "XP earned", close: "Close", rarity: "Rarity", category: "Category", year: "Year" },
  }[lang];

  const [artifacts, setArtifacts] = useState<MuseumArtifact[]>([]);
  const [articles, setArticles] = useState<MuseumArticle[]>([]);
  const [progress, setProgress] = useState<MuseumProgress[]>([]);
  const [filter, setFilter] = useState<ArtifactCategory | "all">("all");
  const [selectedArtifact, setSelectedArtifact] = useState<MuseumArtifact | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<MuseumArticle | null>(null);
  const [showArticles, setShowArticles] = useState(false);
  const [viewedIds, setViewedIds] = useState<Set<string>>(new Set());
  const [xpPopup, setXpPopup] = useState<{ xp: number; key: number } | null>(null);

  useEffect(() => {
    museumAPI.getMuseumArtifacts().then(setArtifacts);
    museumAPI.getArticles().then(setArticles);
    if (dbUser) {
      museumAPI.getMuseumProgress(dbUser.id).then(setProgress);
      museumAPI.getViewedArtifactIds(dbUser.id).then(setViewedIds);
    }
  }, [dbUser]);

  const handleViewArtifact = async (artifact: MuseumArtifact) => {
    if (!dbUser) return;
    const wasViewed = viewedIds.has(artifact.id);
    setSelectedArtifact(artifact);
    if (!wasViewed) {
      const result = await museumAPI.viewMuseumArtifact(dbUser.id, artifact.id);
      if (result.xpEarned > 0) {
        setXpPopup({ xp: result.xpEarned, key: Date.now() });
        setTimeout(() => setXpPopup(null), 1500);
        setViewedIds(prev => new Set([...prev, artifact.id]));
        museumAPI.getMuseumProgress(dbUser.id).then(setProgress);
        onRefresh();
      }
    }
  };

  const handleReadArticle = async (article: MuseumArticle) => {
    if (!dbUser) return;
    const result = await museumAPI.readArticle(dbUser.id, article.id);
    if (result.unlocked) {
      setXpPopup({ xp: result.xpEarned, key: Date.now() });
      setTimeout(() => setXpPopup(null), 1500);
      onRefresh();
    }
  };

  const getCategoryProgress = (cat: ArtifactCategory) => {
    const p = progress.find(p => p.category === cat);
    const total = artifacts.filter(a => a.category === cat).length;
    const viewed = p?.artifacts_viewed || 0;
    return { viewed, total, completed: p?.collection_completed || false };
  };

  const filteredArtifacts = artifacts.filter(a => filter === "all" || a.category === filter);
  const filteredArticles = articles.filter(a => filter === "all" || a.category === filter);

  const categories: { id: ArtifactCategory | "all"; label: string; icon: LucideIcon }[] = [
    { id: "all", label: t.all, icon: Globe },
    ...Object.entries(CATEGORY_META).map(([key, meta]) => ({
      id: key as ArtifactCategory,
      label: lang === "ua" ? meta.ua : meta.en,
      icon: CATEGORY_ICONS[key as ArtifactCategory],
    })),
  ];

  const totalViewed = viewedIds.size;
  const totalArtifacts = artifacts.length;
  const overallPercent = totalArtifacts > 0 ? Math.round((totalViewed / totalArtifacts) * 100) : 0;

  const progressMilestone = overallPercent >= 100 ? "100%" : overallPercent >= 75 ? "75%" : overallPercent >= 50 ? "50%" : overallPercent >= 25 ? "25%" : overallPercent >= 10 ? "10%" : null;

  return (
    <div className="space-y-6 pb-32">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <h1 className="text-4xl font-black text-white tracking-tighter">{t.title}</h1>
        <button
          onClick={() => setShowArticles(!showArticles)}
          className={`p-3 rounded-xl transition-all ${showArticles ? "bg-[#ffd700] text-[#0a0a0f]" : "bg-white/5 text-white/40"}`}
        >
          <BookOpen className="w-5 h-5" />
        </button>
      </div>

      {/* Overall Progress */}
      <GlassCard className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-white/50">{t.progress}: {totalViewed}/{totalArtifacts}</span>
          {progressMilestone && (
            <span className="text-xs font-bold text-[#ffd700]">{progressMilestone}</span>
          )}
        </div>
        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${overallPercent}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-[#0057b7] to-[#ffd700]"
          />
        </div>
      </GlassCard>

      {/* Category Filter */}
      <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar -mx-4 px-4">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = filter === cat.id;
          return (
            <motion.button
              key={cat.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(cat.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-full border whitespace-nowrap transition-all font-black text-[10px] uppercase tracking-widest ${
                isActive
                  ? "bg-[#ffd700] border-[#ffd700] text-[#0a0a0f] shadow-[0_0_20px_rgba(255,215,0,0.3)]"
                  : "bg-white/5 border-white/5 text-white/40 hover:bg-white/10"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {cat.label}
              {cat.id !== "all" && (
                <span className="text-[9px] opacity-60">
                  {getCategoryProgress(cat.id as ArtifactCategory).viewed}/{getCategoryProgress(cat.id as ArtifactCategory).total}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Articles or Artifacts */}
      <AnimatePresence mode="wait">
        {showArticles ? (
          <motion.div
            key="articles"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {filteredArticles.map((article, i) => {
              const catProgress = getCategoryProgress(article.category);
              const isUnlocked = catProgress.viewed >= article.required_views;
              return (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <GlassCard
                    className={`p-5 cursor-pointer ${isUnlocked ? "hover:border-[#ffd700]/30" : "opacity-60"}`}
                    onClick={() => isUnlocked && setSelectedArticle(article)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-2xl bg-white/5">
                        {isUnlocked ? <BookOpen className="w-5 h-5 text-[#ffd700]" /> : <Lock className="w-5 h-5 text-white/30" />}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-bold text-sm mb-1">
                          {lang === "ua" ? article.title_ua : article.title_en}
                        </h3>
                        <p className="text-white/40 text-xs">
                          {CATEGORY_META[article.category][lang === "ua" ? "ua" : "en"]}
                        </p>
                        {!isUnlocked && (
                          <p className="text-white/30 text-[10px] mt-1">
                            {t.unlockReq} {article.required_views} {lang === "ua" ? "артефактів" : "artifacts"} ({catProgress.viewed}/{article.required_views})
                          </p>
                        )}
                        {isUnlocked && (
                          <button
                            onClick={(e) => { e.stopPropagation(); handleReadArticle(article); }}
                            className="mt-2 text-[10px] font-bold text-[#ffd700] uppercase tracking-widest"
                          >
                            {t.read} +25 XP
                          </button>
                        )}
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            key="artifacts"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-2 gap-4"
          >
            {filteredArtifacts.map((artifact, i) => {
              const rarity = RARITY_META[artifact.rarity];
              const isViewed = viewedIds.has(artifact.id);
              return (
                <motion.div
                  key={artifact.id}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <GlassCard
                    onClick={() => handleViewArtifact(artifact)}
                    className="h-full group cursor-pointer"
                    hover
                  >
                    <div className="relative aspect-[4/5] overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-white/[0.03] to-white/[0.01]" style={{ boxShadow: rarity.glow ? `inset ${rarity.glow}` : undefined }}>
                        {artifact.image.startsWith("http") ? (
                          <img src={artifact.image} alt={artifact.title_ua} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-6xl">{artifact.image}</span>
                        )}
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/20 to-transparent opacity-90" />

                      {/* Rarity Badge */}
                      <div className="absolute top-2.5 right-2.5">
                        <span
                          className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border"
                          style={{ color: rarity.color, borderColor: rarity.color + "40", background: rarity.color + "15" }}
                        >
                          {rarity[lang === "ua" ? "ua" : "en"]}
                        </span>
                      </div>

                      {/* Viewed indicator */}
                      {isViewed && (
                        <div className="absolute top-2.5 left-2.5">
                          <div className="w-5 h-5 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center">
                            <CheckCircle2 className="w-3 h-3 text-green-400" />
                          </div>
                        </div>
                      )}

                      {/* Year badge */}
                      <div className="absolute top-2.5 left-2.5" style={{ left: isViewed ? "2rem" : undefined }}>
                        {!isViewed && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold text-white/70 bg-black/40 backdrop-blur-md">
                            {artifact.year}
                          </span>
                        )}
                      </div>

                      {/* Bottom info */}
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: CATEGORY_META[artifact.category].color }} />
                          <span className="text-[9px] font-bold uppercase tracking-widest opacity-70" style={{ color: CATEGORY_META[artifact.category].color }}>
                            {CATEGORY_META[artifact.category][lang === "ua" ? "ua" : "en"]}
                          </span>
                        </div>
                        <h3 className="text-white font-bold text-sm leading-tight group-hover:text-[#ffd700] transition-colors">
                          {lang === "ua" ? artifact.title_ua : artifact.title_en}
                        </h3>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collection Progress per Category */}
      {filter !== "all" && !showArticles && (
        <GlassCard className="p-5 mt-2">
          <h3 className="text-xs font-bold text-white/60 uppercase tracking-wider mb-3">{t.collection}</h3>
          {(() => {
            const cp = getCategoryProgress(filter as ArtifactCategory);
            const percent = cp.total > 0 ? Math.round((cp.viewed / cp.total) * 100) : 0;
            return (
              <>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-white/50">{cp.viewed}/{cp.total} {t.viewed}</span>
                  <span className="text-[#ffd700] font-bold">{percent}%</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percent}%` }}
                    transition={{ duration: 1 }}
                    className="h-full"
                    style={{ background: CATEGORY_META[filter as ArtifactCategory].color }}
                  />
                </div>
                {cp.completed && (
                  <div className="mt-3 flex items-center gap-2 text-green-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-xs font-bold">{t.complete}</span>
                  </div>
                )}
              </>
            );
          })()}
        </GlassCard>
      )}

      {/* Artifact Detail Modal */}
      <AnimatePresence>
        {selectedArtifact && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#0a0a0f]"
          >
            <div className="h-full overflow-y-auto">
              <div className="max-w-md mx-auto">
                {/* Header area */}
                <div className="relative h-64 flex items-center justify-center" style={{ boxShadow: RARITY_META[selectedArtifact.rarity].glow ? `0 0 60px ${RARITY_META[selectedArtifact.rarity].color}20` : undefined }}>
                  <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent" />
                  {selectedArtifact.image.startsWith("http") ? (
                    <motion.img
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      src={selectedArtifact.image}
                      alt={selectedArtifact.title_ua}
                      className="w-full h-full object-cover relative z-10"
                    />
                  ) : (
                    <motion.span
                      initial={{ scale: 0.5 }}
                      animate={{ scale: 1 }}
                      className="text-[120px] relative z-10"
                    >
                      {selectedArtifact.image}
                    </motion.span>
                  )}
                  <button
                    onClick={() => setSelectedArtifact(null)}
                    className="absolute top-4 left-4 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white z-20"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-5 space-y-5 pb-8">
                  {/* Rarity + Category + Year */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border"
                      style={{ color: RARITY_META[selectedArtifact.rarity].color, borderColor: RARITY_META[selectedArtifact.rarity].color + "40", background: RARITY_META[selectedArtifact.rarity].color + "15" }}
                    >
                      {RARITY_META[selectedArtifact.rarity][lang === "ua" ? "ua" : "en"]}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-white/5 text-white/60 text-[10px] font-bold uppercase tracking-widest">
                      {CATEGORY_META[selectedArtifact.category][lang === "ua" ? "ua" : "en"]}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-[#ffd700]/10 text-[#ffd700] text-[10px] font-bold">
                      {selectedArtifact.year}
                    </span>
                  </div>

                  {/* Title */}
                  <h1 className="text-2xl font-bold text-white">
                    {lang === "ua" ? selectedArtifact.title_ua : selectedArtifact.title_en}
                  </h1>

                  {/* Description */}
                  <div>
                    <p className="text-sm text-white/70 leading-relaxed">
                      {lang === "ua" ? selectedArtifact.description_ua : selectedArtifact.description_en}
                    </p>
                  </div>

                  {/* Historical Note */}
                  <GlassCard className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-4 h-4 text-[#ffd700]" />
                      <h3 className="text-xs font-bold text-[#ffd700] uppercase tracking-wider">{t.history}</h3>
                    </div>
                    <p className="text-sm text-white/60 leading-relaxed">
                      {lang === "ua" ? selectedArtifact.history_ua : selectedArtifact.history_en}
                    </p>
                  </GlassCard>

                  {/* Close */}
                  <button
                    onClick={() => setSelectedArtifact(null)}
                    className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white/60 font-semibold text-sm active:scale-95 transition-all"
                  >
                    {t.close}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Article Detail Modal */}
      <AnimatePresence>
        {selectedArticle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#0a0a0f]"
          >
            <div className="h-full overflow-y-auto">
              <div className="max-w-md mx-auto p-5 space-y-5 pb-8">
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#ffd700]" />
                  <span className="text-xs font-bold text-[#ffd700] uppercase tracking-wider">
                    {CATEGORY_META[selectedArticle.category][lang === "ua" ? "ua" : "en"]}
                  </span>
                </div>

                <h1 className="text-2xl font-bold text-white">
                  {lang === "ua" ? selectedArticle.title_ua : selectedArticle.title_en}
                </h1>

                <div className="prose prose-invert prose-sm max-w-none">
                  <p className="text-sm text-white/70 leading-relaxed whitespace-pre-line">
                    {lang === "ua" ? selectedArticle.content_ua : selectedArticle.content_en}
                  </p>
                </div>

                <button
                  onClick={() => { handleReadArticle(selectedArticle); setSelectedArticle(null); }}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#0057b7] to-[#ffd700] text-white font-semibold text-sm shadow-lg active:scale-95 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  {t.read} +25 XP
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* XP popup */}
      <AnimatePresence>
        {xpPopup && (
          <motion.div
            key={xpPopup.key}
            initial={{ opacity: 0, y: 20, scale: 0.5 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30 }}
            className="fixed top-1/3 left-1/2 -translate-x-1/2 z-[60] px-6 py-3 bg-[#ffd700] text-[#0a0a0f] rounded-2xl font-black text-lg shadow-2xl"
          >
            +{xpPopup.xp} XP
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
