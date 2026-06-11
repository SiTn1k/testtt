import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Crown, Shield, Star, Trophy, MessageCircle, Plus, Search, LogOut, Sword, Coins } from 'lucide-react';
import { triggerHapticFeedback, triggerHapticNotification } from '../lib/telegram';

interface GuildMember {
  userId: string;
  telegramId: number;
  firstName: string;
  photoUrl?: string;
  role: 'leader' | 'coleader' | 'elder' | 'member';
  totalXP: number;
  weeklyXP: number;
}

interface Guild {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  leaderId: string;
  totalMembers: number;
  maxMembers: number;
  totalXP: number;
  weeklyXP: number;
  rank: number;
  trophies: number;
  members?: GuildMember[];
  joinType: 'open' | 'invite' | 'closed';
  requiredXP?: number;
}

interface GuildsProps {
  lang: 'ua' | 'en';
  currentGuild?: Guild;
  guilds: Guild[];
  onJoinGuild: (guildId: string) => void;
  onCreateGuild: (name: string, icon: string, color: string) => void;
  onLeaveGuild: () => void;
  onClose: () => void;
}

const GUILD_COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4',
  '#3b82f6', '#8b5cf6', '#ec4899', '#f43f5e',
];

const GUILD_ICONS = ['🏛️', '⚔️', '🛡️', '🔥', '⭐', '👑', '🐉', '🦅', '🐺', '🦁'];

export const Guilds: React.FC<GuildsProps> = ({
  lang,
  currentGuild,
  guilds,
  onJoinGuild,
  onCreateGuild,
  onLeaveGuild,
  onClose,
}) => {
  const [tab, setTab] = useState<'my' | 'discover' | 'create'>('my');
  const [searchQuery, setSearchQuery] = useState('');
  const [newGuildName, setNewGuildName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(GUILD_ICONS[0]);
  const [selectedColor, setSelectedColor] = useState(GUILD_COLORS[0]);
  const [expandedGuild, setExpandedGuild] = useState<string | null>(null);

  const filteredGuilds = guilds.filter(g =>
    g.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const texts = {
    title: { ua: 'Гільдії', en: 'Guilds' },
    myGuild: { ua: 'Моя Гільдія', en: 'My Guild' },
    discover: { ua: 'Пошук', en: 'Discover' },
    create: { ua: 'Створити', en: 'Create' },
    search: { ua: 'Пошук гільдії...', en: 'Search guild...' },
    members: { ua: 'учасників', en: 'members' },
    trophies: { ua: 'Трофеї', en: 'Trophies' },
    weeklyXP: { ua: 'Тижневий XP', en: 'Weekly XP' },
    join: { ua: 'Приєднатись', en: 'Join' },
    leave: { ua: 'Покинути', en: 'Leave' },
    enterName: { ua: 'Назва гільдії', en: 'Guild name' },
    createGuild: { ua: 'Створити Гільдію', en: 'Create Guild' },
    noGuild: { ua: 'Ви не в гільдії', en: 'You are not in a guild' },
    joinOrCreate: { ua: 'Приєднайтесь або створіть нову', en: 'Join or create a new one' },
    open: { ua: 'Відкрита', en: 'Open' },
    invite: { ua: 'За запрошенням', en: 'Invite only' },
    closed: { ua: 'Закрита', en: 'Closed' },
    requiredXP: { ua: 'Мінімум XP', en: 'Required XP' },
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
          <Shield className="w-6 h-6 text-purple-400" />
          <h2 className="text-xl font-bold text-white">{texts.title[lang]}</h2>
        </div>

        <div className="flex gap-2 mb-4">
          {(['my', 'discover', 'create'] as const).map(t => (
            <motion.button
              key={t}
              onClick={() => {
                triggerHapticFeedback('light');
                setTab(t);
              }}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                tab === t
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'text-white/60 hover:text-white bg-white/5'
              }`}
              whileTap={{ scale: 0.95 }}
            >
              {texts[t][lang]}
            </motion.button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {tab === 'my' && (
              <motion.div
                key="my"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                {currentGuild ? (
                  <>
                    <div
                      className="rounded-2xl p-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30"
                      style={{ borderColor: `${currentGuild.color}40` }}
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div
                          className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl"
                          style={{ backgroundColor: currentGuild.color + '30' }}
                        >
                          {currentGuild.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-bold text-white">{currentGuild.name}</h3>
                            <Crown className="w-4 h-4 text-yellow-400" />
                          </div>
                          <p className="text-sm text-white/60">{currentGuild.description}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className="text-center bg-black/20 rounded-lg py-2">
                          <div className="text-2xl font-bold text-white">{currentGuild.totalMembers}</div>
                          <div className="text-xs text-white/40">{texts.members[lang]}</div>
                        </div>
                        <div className="text-center bg-black/20 rounded-lg py-2">
                          <div className="text-2xl font-bold text-yellow-400">{currentGuild.trophies}</div>
                          <div className="text-xs text-white/40">{texts.trophies[lang]}</div>
                        </div>
                        <div className="text-center bg-black/20 rounded-lg py-2">
                          <div className="text-2xl font-bold text-green-400">{currentGuild.weeklyXP.toLocaleString()}</div>
                          <div className="text-xs text-white/40">{texts.weeklyXP[lang]}</div>
                        </div>
                      </div>

                      <motion.button
                        onClick={() => {
                          triggerHapticFeedback('medium');
                          onLeaveGuild();
                        }}
                        className="w-full py-2 bg-red-500/20 text-red-400 rounded-lg flex items-center justify-center gap-2"
                        whileTap={{ scale: 0.98 }}
                      >
                        <LogOut className="w-4 h-4" />
                        {texts.leave[lang]}
                      </motion.button>
                    </div>

                    {currentGuild.members && (
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-white/60 px-1">{texts.members[lang]}</div>
                        {currentGuild.members.map(member => (
                          <div
                            key={member.userId}
                            className="flex items-center gap-3 p-3 bg-white/5 rounded-xl"
                          >
                            {member.photoUrl ? (
                              <img src={member.photoUrl} className="w-10 h-10 rounded-full object-cover" alt={member.firstName} />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-white/10" />
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-white truncate">{member.firstName}</span>
                                {member.role === 'leader' && <Crown className="w-3 h-3 text-yellow-400" />}
                                {member.role === 'coleader' && <Shield className="w-3 h-3 text-purple-400" />}
                              </div>
                              <div className="text-xs text-white/40">{member.weeklyXP.toLocaleString()} XP {texts.weeklyXP[lang]}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-green-400 font-bold">{member.totalXP.toLocaleString()}</div>
                              <div className="text-xs text-white/40">XP</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 text-white/20 mx-auto mb-4" />
                    <div className="text-xl font-medium text-white mb-2">{texts.noGuild[lang]}</div>
                    <div className="text-white/40">{texts.joinOrCreate[lang]}</div>
                  </div>
                )}
              </motion.div>
            )}

            {tab === 'discover' && (
              <motion.div
                key="discover"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-3"
              >
                <div className="relative">
                  <Search className="w-5 h-5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder={texts.search[lang]}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-white/40 focus:outline-none focus:border-purple-500"
                  />
                </div>

                {filteredGuilds.map(guild => {
                  const isExpanded = expandedGuild === guild.id;
                  const canJoin = !guild.requiredXP || guild.requiredXP <= 1000;

                  return (
                    <motion.div
                      key={guild.id}
                      className="bg-white/5 rounded-xl p-4 border border-white/10"
                      onClick={() => {
                        triggerHapticFeedback('light');
                        setExpandedGuild(isExpanded ? null : guild.id);
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                          style={{ backgroundColor: guild.color + '30' }}
                        >
                          {guild.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white truncate">{guild.name}</span>
                            {guild.joinType === 'open' && (
                              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
                                {texts.open[lang]}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-white/40">
                            {guild.totalMembers}/{guild.maxMembers} • #{guild.rank}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-yellow-400 font-bold">{guild.trophies}</div>
                          <div className="text-xs text-white/40">{texts.trophies[lang]}</div>
                        </div>
                      </div>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="pt-3"
                          >
                            <p className="text-sm text-white/60 mb-3">{guild.description}</p>
                            {guild.requiredXP && (
                              <div className="text-xs text-white/40 mb-3">
                                {texts.requiredXP[lang]}: {guild.requiredXP.toLocaleString()} XP
                              </div>
                            )}
                            <motion.button
                              onClick={e => {
                                e.stopPropagation();
                                if (guild.joinType === 'open') {
                                  triggerHapticNotification('success');
                                  onJoinGuild(guild.id);
                                }
                              }}
                              disabled={guild.joinType !== 'open' || !canJoin}
                              className={`w-full py-2 rounded-lg font-medium ${
                                guild.joinType === 'open' && canJoin
                                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                                  : 'bg-white/10 text-white/40 cursor-not-allowed'
                              }`}
                              whileTap={{ scale: 0.98 }}
                            >
                              {guild.joinType === 'open' ? texts.join[lang] : texts.invite[lang]}
                            </motion.button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}

            {tab === 'create' && (
              <motion.div
                key="create"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                <div>
                  <label className="text-sm text-white/60 mb-2 block">{texts.enterName[lang]}</label>
                  <input
                    type="text"
                    value={newGuildName}
                    onChange={e => setNewGuildName(e.target.value)}
                    maxLength={20}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-white/40 focus:outline-none focus:border-purple-500"
                    placeholder={texts.enterName[lang]}
                  />
                </div>

                <div>
                  <label className="text-sm text-white/60 mb-2 block">Icon</label>
                  <div className="flex flex-wrap gap-2">
                    {GUILD_ICONS.map(icon => (
                      <button
                        key={icon}
                        onClick={() => {
                          triggerHapticFeedback('light');
                          setSelectedIcon(icon);
                        }}
                        className={`w-12 h-12 rounded-xl text-2xl flex items-center justify-center transition-all ${
                          selectedIcon === icon
                            ? 'bg-purple-500/30 border-2 border-purple-500'
                            : 'bg-white/5 border border-white/10'
                        }`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm text-white/60 mb-2 block">Color</label>
                  <div className="flex flex-wrap gap-2">
                    {GUILD_COLORS.map(color => (
                      <button
                        key={color}
                        onClick={() => {
                          triggerHapticFeedback('light');
                          setSelectedColor(color);
                        }}
                        className={`w-8 h-8 rounded-full transition-all ${
                          selectedColor === color
                            ? 'ring-2 ring-white ring-offset-2 ring-offset-[#1a1a2e]'
                            : ''
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div
                  className="rounded-xl p-4 bg-white/5 border border-white/10"
                  style={{ borderColor: selectedColor + '40' }}
                >
                  <div className="text-xs text-white/40 mb-2">{texts.create[lang]}</div>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                      style={{ backgroundColor: selectedColor + '30' }}
                    >
                      {selectedIcon}
                    </div>
                    <div className="font-bold text-white text-lg">
                      {newGuildName || 'My Guild'}
                    </div>
                  </div>
                </div>

                <motion.button
                  onClick={() => {
                    if (newGuildName.trim()) {
                      triggerHapticNotification('success');
                      onCreateGuild(newGuildName.trim(), selectedIcon, selectedColor);
                    }
                  }}
                  disabled={!newGuildName.trim()}
                  className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 ${
                    newGuildName.trim()
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : 'bg-white/10 text-white/40 cursor-not-allowed'
                  }`}
                  whileTap={{ scale: 0.98 }}
                >
                  <Plus className="w-5 h-5" />
                  {texts.createGuild[lang]} (5000 XP)
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Guilds;
