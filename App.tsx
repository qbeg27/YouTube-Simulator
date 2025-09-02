
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { VideoList } from './components/VideoList';
import { UploadModal } from './components/UploadModal';
import { UploadShortModal } from './components/UploadShortModal';
import { VideoDetailModal } from './components/VideoDetailModal';
import { SponsorshipModal } from './components/SponsorshipModal';
import { EventModal } from './components/EventModal';
import { AchievementsModal } from './components/AchievementsModal';
import { CommunityTab } from './components/CommunityTab';
import { CommunityPostModal } from './components/CommunityPostModal';
import { LiveStreamModal } from './components/LiveStreamModal';
import { TalentTreeModal } from './components/TalentTreeModal';
import { CollabModal } from './components/CollabModal';
import { DashboardTab } from './components/DashboardTab';
import { AnalyticsTab } from './components/AnalyticsTab';
import { MonetizationTab } from './components/MonetizationTab';
import { StaffTab } from './components/StaffTab';
import { ChannelTab } from './components/ChannelTab';
import { RivalsTab } from './components/RivalsTab';
import { AwardShowModal } from './components/AwardShowModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import { HomeIcon } from './components/icons/HomeIcon';
import { PlayIcon } from './components/icons/PlayIcon';
import { UsersIcon } from './components/icons/UsersIcon';
import { ChartPieIcon } from './components/icons/ChartPieIcon';
import { DollarSignIcon } from './components/icons/DollarSignIcon';
import { BriefcaseIcon } from './components/icons/BriefcaseIcon';
import { PaintBrushIcon } from './components/icons/PaintBrushIcon';
import { MegaphoneIcon } from './components/icons/MegaphoneIcon';
// Fix: Changed type-only import to a regular import to allow enums like VideoCategory to be used as values.
import { ChannelStats, Video, VideoCategory, Upgrade, Sponsorship, Comment, GameEvent, Achievement, CommunityPost, TalentBranch, Collaborator, User, StaffMember, TrendingTopic, ChannelBrand, RivalChannel, Award } from './types';
import { MONETIZATION_SUBSCRIBERS_REQ, MONETIZATION_WATCH_HOURS_REQ, BASE_CPM, SHORTS_CPM_MULTIPLIER, GAME_TICK_MS, UPGRADES_CONFIG, SPONSORSHIPS_CONFIG, FAKE_USERNAMES, TRENDING_DURATION_MS, TRENDING_MULTIPLIER, VIRAL_MULTIPLIER, VIRAL_INSTANT_VIEWS, ACHIEVEMENTS_CONFIG, EVENTS_CONFIG, MAX_CREATIVE_ENERGY, ENERGY_REGEN_RATE, UPLOAD_VIDEO_COST, UPLOAD_SHORT_COST, VIRAL_BOOST_COST, GO_LIVE_COST, COMMUNITY_POST_COST, TICKS_PER_WEEK, WEEKLY_EXPENSES_AMOUNT, SUBSCRIBER_MILESTONES_FOR_TALENT_POINTS, TALENT_TREE_CONFIG, COLLAB_COST, COLLAB_COOLDOWN_MS, VIDEOS_SUBSCRIBER_CONVERSION_DIVISOR, SHORTS_SUBSCRIBER_CONVERSION_DIVISOR, STAFF_CONFIG, STAFF_UNLOCK_REQ, TRENDING_TOPIC_DURATION_MS, TRENDING_TOPIC_UPDATE_INTERVAL_MS, VIDEO_CATEGORIES, SERIES_MOMENTUM_BONUS, ALGORITHM_REDISCOVERY_CHANCE, REDISCOVERY_MULTIPLIER, REDISCOVERY_DURATION_MS, TICKS_PER_YEAR, AWARDS_CONFIG, PRESTIGE_PER_AWARD, CHANNEL_NICHES_CONFIG, NUMBER_OF_RIVALS, RIVAL_UPDATE_CHANCE, MAX_CHANNEL_STRIKES, SUSPENSION_DURATION_MS, GAME_OVER_MONEY_THRESHOLD } from './constants';
import * as api from './services/api';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

type NotificationType = 'default' | 'achievement' | 'expense' | 'talent' | 'award';
type MainTab = 'dashboard' | 'videos' | 'community' | 'analytics' | 'monetization' | 'staff' | 'channel' | 'rivals';
type GameState = 'loading' | 'playing';

interface Notification { message: string; type: NotificationType; }
const initialStats: ChannelStats = { subscribers: 0, totalWatchHours: 0, money: 100, creativeEnergy: MAX_CREATIVE_ENERGY, talentPoints: 0, prestige: 0, channelStrikes: 0, suspendedUntil: 0 };
const defaultUser: User = { id: 'default-player', username: 'Creator' };

const GameOverModal: React.FC<{stats: ChannelStats, onReset: () => void}> = ({ stats, onReset }) => (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[102]">
        <div className="bg-gray-800 p-8 rounded-lg text-center border-2 border-red-500 shadow-2xl">
            <h2 className="text-5xl font-bold text-red-500 mb-4">GAME OVER</h2>
            <p className="text-gray-300 mb-2">You've gone bankrupt and can no longer run your channel.</p>
            <div className="my-6 space-y-2 text-lg">
                <p><span className="font-semibold text-gray-400">Final Subscribers:</span> <span className="font-bold text-white">{stats.subscribers.toLocaleString()}</span></p>
                <p><span className="font-semibold text-gray-400">Lifetime Earnings:</span> <span className="font-bold text-white">${stats.money.toLocaleString()}</span></p>
            </div>
            <button onClick={onReset} className="mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg">
                Start Over
            </button>
        </div>
    </div>
);

const SuspensionBanner: React.FC<{ suspendedUntil: number }> = ({ suspendedUntil }) => {
    const [timeLeft, setTimeLeft] = useState("");
    useEffect(() => {
        const timer = setInterval(() => {
            const remaining = suspendedUntil - Date.now();
            if (remaining <= 0) {
                setTimeLeft("Suspension Lifted!");
                clearInterval(timer);
            } else {
                const minutes = Math.floor((remaining / 1000) / 60);
                const seconds = Math.floor((remaining / 1000) % 60);
                setTimeLeft(`${minutes}:${seconds.toString().padStart(2, '0')}`);
            }
        }, 1000);
        return () => clearInterval(timer);
    }, [suspendedUntil]);

    return (
        <div className="fixed top-0 left-0 right-0 bg-red-800 text-white p-3 text-center z-[101] shadow-lg">
            <p><span className="font-bold">CHANNEL SUSPENDED!</span> You cannot upload content or post. Suspension lifts in: {timeLeft}</p>
        </div>
    );
};


const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('loading');
  const [stats, setStats] = useState<ChannelStats>(initialStats);
  const [videos, setVideos] = useState<Video[]>([]);
  const [isMonetized, setIsMonetized] = useState<boolean>(false);
  const [isUploadModalOpen, setUploadModalOpen] = useState<boolean>(false);
  const [isUploadShortModalOpen, setUploadShortModalOpen] = useState<boolean>(false);
  const [viewingVideo, setViewingVideo] = useState<Video | null>(null);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [upgrades, setUpgrades] = useState<Upgrade[]>(UPGRADES_CONFIG);
  const [activeSponsorship, setActiveSponsorship] = useState<Sponsorship | null>(null);
  const [completedSponsorshipIds, setCompletedSponsorshipIds] = useState<string[]>([]);
  const [viralBoostsAvailable, setViralBoostsAvailable] = useState<number>(2);
  const [activeEvent, setActiveEvent] = useState<GameEvent | null>(null);
  const [isAchievementsModalOpen, setAchievementsModalOpen] = useState<boolean>(false);
  const [unlockedAchievements, setUnlockedAchievements] = useState<Set<string>>(new Set());
  const [totalMoneyEarned, setTotalMoneyEarned] = useState<number>(0);
  const [ticksUntilBill, setTicksUntilBill] = useState(TICKS_PER_WEEK);
  const [activeTab, setActiveTab] = useState<MainTab>('dashboard');
  const [isCommunityPostModalOpen, setCommunityPostModalOpen] = useState(false);
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>([]);
  const [isLiveStreamModalOpen, setLiveStreamModalOpen] = useState(false);
  const [isTalentModalOpen, setTalentModalOpen] = useState(false);
  const [unlockedTalentIds, setUnlockedTalentIds] = useState<Set<string>>(new Set());
  const [awardedMilestones, setAwardedMilestones] = useState<Set<number>>(new Set());
  const [isCollabModalOpen, setCollabModalOpen] = useState(false);
  const [collabOptions, setCollabOptions] = useState<Collaborator[]>([]);
  const [isGeneratingCollabs, setIsGeneratingCollabs] = useState(false);
  const [collabCooldownUntil, setCollabCooldownUntil] = useState(0);
  const [collabCooldown, setCollabCooldown] = useState(0);
  const [statsHistory, setStatsHistory] = useState<ChannelStats[]>([]);
  const [hiredStaff, setHiredStaff] = useState<StaffMember[]>([]);
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([]);
  const [lastTrendUpdate, setLastTrendUpdate] = useState(0);
  // --- BIG UPDATE STATE ---
  const [channelBrand, setChannelBrand] = useState<ChannelBrand | null>(null);
  const [rivals, setRivals] = useState<RivalChannel[]>([]);
  const [ticksUntilAwards, setTicksUntilAwards] = useState(TICKS_PER_YEAR);
  const [isAwardModalOpen, setIsAwardModalOpen] = useState(false);
  const [awardsThisYear, setAwardsThisYear] = useState<Award[]>([]);
  // --- NEW MECHANICS STATE ---
  const [isGameOver, setIsGameOver] = useState(false);
  // --- ADMIN STATE ---
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);

  const showNotification = useCallback((message: string, type: NotificationType = 'default') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  }, []);

  // Handler for admin panel actions
  const handleAdminAction = useCallback((action: string, value: number | string) => {
    switch(action) {
      case 'add_subs':
        setStats(s => ({ ...s, subscribers: s.subscribers + Number(value) }));
        break;
      case 'add_money':
        setStats(s => ({ ...s, money: s.money + Number(value) }));
        break;
      case 'max_energy':
        setStats(s => ({ ...s, creativeEnergy: MAX_CREATIVE_ENERGY }));
        break;
      case 'add_talent':
        setStats(s => ({ ...s, talentPoints: s.talentPoints + Number(value) }));
        break;
      case 'add_boosts':
        setViralBoostsAvailable(v => v + Number(value));
        break;
      case 'reset_collab':
        setCollabCooldownUntil(0);
        break;
      case 'trigger_event':
        {
          const randomEvent: GameEvent = { ...EVENTS_CONFIG[Math.floor(Math.random() * EVENTS_CONFIG.length)]};
          const randomVideo = videos.length > 0 ? videos[Math.floor(Math.random() * videos.length)] : null;
          if (randomVideo) {
              randomEvent.videoId = randomVideo.id;
              randomEvent.description = randomEvent.description.replace('one of your videos', `"${randomVideo.title}"`).replace('Your latest video', `"${randomVideo.title}"`).replace('Your video', `"${randomVideo.title}"`);
          }
          setActiveEvent(randomEvent);
        }
        break;
      default:
        break;
    }
    showNotification(`Admin action '${action}' executed.`, "default");
  }, [videos, showNotification]);

  const resetGameState = useCallback(() => {
    setStats(initialStats);
    setVideos([]);
    setIsMonetized(false);
    setUpgrades(UPGRADES_CONFIG.map(u => ({...u, level: 0})));
    setCompletedSponsorshipIds([]);
    setViralBoostsAvailable(2);
    setUnlockedAchievements(new Set());
    setTotalMoneyEarned(0);
    setTicksUntilBill(TICKS_PER_WEEK);
    setCommunityPosts([]);
    setUnlockedTalentIds(new Set());
    setAwardedMilestones(new Set());
    setCollabCooldownUntil(0);
    setStatsHistory([]);
    setHiredStaff([]);
    setTrendingTopics([]);
    setLastTrendUpdate(0);
    // --- BIG UPDATE RESET ---
    setChannelBrand(null);
    setRivals([]);
    setTicksUntilAwards(TICKS_PER_YEAR);
    setIsAwardModalOpen(false);
    setAwardsThisYear([]);
    // --- NEW MECHANICS RESET ---
    setIsGameOver(false);
  }, []);

  useEffect(() => {
    const loadGame = async () => {
        const savedState = await api.getGameState(defaultUser.id);
        if (savedState) {
          try {
              setStats(savedState.stats);
              setVideos(savedState.videos.map((v: any) => ({...v, uploadedAt: new Date(v.uploadedAt), type: v.type || 'video'})));
              setCommunityPosts(savedState.communityPosts.map((p: any) => ({...p, postedAt: new Date(p.postedAt)})));
              setIsMonetized(savedState.isMonetized);
              setUpgrades(savedState.upgrades);
              setCompletedSponsorshipIds(savedState.completedSponsorshipIds);
              setViralBoostsAvailable(savedState.viralBoostsAvailable);
              setUnlockedAchievements(new Set(savedState.unlockedAchievements));
              setTotalMoneyEarned(savedState.totalMoneyEarned);
              setTicksUntilBill(savedState.ticksUntilBill);
              setUnlockedTalentIds(new Set(savedState.unlockedTalentIds));
              setAwardedMilestones(new Set(savedState.awardedMilestones));
              setCollabCooldownUntil(savedState.collabCooldownUntil || 0);
              setStatsHistory(savedState.statsHistory || []);
              setHiredStaff(savedState.hiredStaff || []);
              setTrendingTopics(savedState.trendingTopics || []);
              setLastTrendUpdate(savedState.lastTrendUpdate || 0);
              setChannelBrand(savedState.channelBrand || null);
              setRivals(savedState.rivals || []);
              setTicksUntilAwards(savedState.ticksUntilAwards || TICKS_PER_YEAR);
              showNotification(`Welcome back, ${defaultUser.username}!`, 'default');
          } catch (e) { console.error("Failed to parse saved state, starting fresh.", e); resetGameState(); }
        } else { resetGameState(); showNotification(`Welcome, ${defaultUser.username}! Let's get started.`, 'default'); }
        setGameState('playing');
    };
    loadGame();
  }, [resetGameState, showNotification]);

  useEffect(() => {
    if (gameState === 'playing') {
      const saveInterval = setInterval(() => {
        api.saveGameState(defaultUser.id, {
            stats, videos, isMonetized, upgrades, completedSponsorshipIds, viralBoostsAvailable, 
            unlockedAchievements: Array.from(unlockedAchievements),
            totalMoneyEarned, ticksUntilBill, communityPosts, 
            unlockedTalentIds: Array.from(unlockedTalentIds),
            awardedMilestones: Array.from(awardedMilestones),
            collabCooldownUntil, statsHistory, hiredStaff, trendingTopics, lastTrendUpdate,
            channelBrand, rivals, ticksUntilAwards,
            version: 1.5
        });
      }, 10000);
      return () => clearInterval(saveInterval);
    }
  }, [gameState, stats, videos, isMonetized, upgrades, completedSponsorshipIds, viralBoostsAvailable, unlockedAchievements, totalMoneyEarned, ticksUntilBill, communityPosts, unlockedTalentIds, awardedMilestones, collabCooldownUntil, statsHistory, hiredStaff, trendingTopics, lastTrendUpdate, channelBrand, rivals, ticksUntilAwards]);

  const talentBonuses = useMemo(() => {
    const bonuses = { subGainMultiplier: 1, communityPostEnergyCost: COMMUNITY_POST_COST, communityPostSubMultiplier: 1, audienceRetentionBonus: 0, goLiveEnergyCost: GO_LIVE_COST, streamDonationMultiplier: 1, viewMultiplier: 1, upgradeQualityMultiplier: 1, trendingChanceMultiplier: 1, viralBoostEnergyCost: VIRAL_BOOST_COST, viralBoostEffectiveness: 1, trendingDurationMultiplier: 1, monetizationMultiplier: 1, weeklyExpensesMultiplier: 1, sponsorshipOfferMultiplier: 1, merchIncome: 0, };
    unlockedTalentIds.forEach(id => {
        switch(id) {
            case 'CREATOR_1': bonuses.subGainMultiplier += 0.05; break;
            case 'CREATOR_2': bonuses.communityPostEnergyCost -= 5; bonuses.communityPostSubMultiplier += 0.25; break;
            case 'CREATOR_3': bonuses.audienceRetentionBonus += 5; break;
            case 'CREATOR_4': bonuses.goLiveEnergyCost -= 10; bonuses.streamDonationMultiplier += 0.2; break;
            case 'CREATOR_5': bonuses.subGainMultiplier += 1; break;
            case 'PRODUCER_1': bonuses.viewMultiplier += 0.1; break;
            case 'PRODUCER_2': bonuses.upgradeQualityMultiplier += 0.1; break;
            case 'PRODUCER_3': bonuses.trendingChanceMultiplier += 1; break;
            case 'PRODUCER_4': bonuses.viralBoostEnergyCost -= 15; break;
            case 'PRODUCER_5': bonuses.trendingDurationMultiplier += 0.5; break;
            case 'COMEDY_SKITS': bonuses.viralBoostEffectiveness += 0.2; break; // Niche bonus
            case 'ENTREPRENEUR_1': bonuses.monetizationMultiplier += 0.1; break;
            case 'ENTREPRENEUR_2': bonuses.weeklyExpensesMultiplier -= 0.25; break;
            case 'ENTREPRENEUR_3': bonuses.sponsorshipOfferMultiplier += 0.2; break;
            case 'ENTREPRENEUR_5': bonuses.merchIncome = Math.floor(stats.subscribers * 0.02); break;
        }
    });
    return bonuses;
  }, [unlockedTalentIds, stats.subscribers]);

  const nicheBonuses = useMemo(() => {
    const bonuses = { gamingSubBonus: 0, vlogSponsorBonus: 0, techIncomeBonus: 0 };
    if(!channelBrand?.nicheId) return bonuses;
    switch(channelBrand.nicheId) {
        case 'gaming_wholesome': bonuses.gamingSubBonus = 0.1; break;
        case 'vlog_lifestyle': bonuses.vlogSponsorBonus = 0.15; break;
        case 'tech_reviews': bonuses.techIncomeBonus = 0.25; break;
    }
    return bonuses;
  }, [channelBrand]);

  const unlockAchievement = useCallback((achievementId: string) => {
    if (unlockedAchievements.has(achievementId)) return;
    const achievement = ACHIEVEMENTS_CONFIG.find(a => a.id === achievementId);
    if(achievement) { setUnlockedAchievements(prev => new Set(prev).add(achievementId)); showNotification(`🏆 Achievement Unlocked: ${achievement.name}!`, 'achievement'); }
  }, [unlockedAchievements, showNotification]);

  // --- GEMINI API FUNCTIONS ---
  const generateComments = useCallback(async (video: Video): Promise<Comment[]> => { try { const response = await ai.models.generateContent({ model: "gemini-2.5-flash", contents: `Generate 5 realistic, short youtube comments for a video titled "${video.title}" in the "${video.category}" category. The video is about: "${video.description}". Provide a mix of positive, neutral, and slightly critical comments.`, config: { responseMimeType: "application/json", responseSchema: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { comment: { type: Type.STRING } } } } } }); return JSON.parse(response.text).map((item: any) => ({ id: `comment-${Date.now()}-${Math.random()}`, username: FAKE_USERNAMES[Math.floor(Math.random() * FAKE_USERNAMES.length)], text: item.comment })); } catch (error) { console.error("Failed to generate comments:", error); return []; } }, []);
  const generateVideoIdeas = useCallback(async (category: VideoCategory): Promise<{title: string, description: string}[]> => { try { const response = await ai.models.generateContent({ model: "gemini-2.5-flash", contents: `Generate 3 creative and engaging YouTube video ideas for the "${category}" category. For each idea, provide a catchy title (under 70 characters) and a short, compelling description (under 200 characters).`, config: { responseMimeType: "application/json", responseSchema: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, description: { type: Type.STRING } }, required: ["title", "description"] } } } }); return JSON.parse(response.text); } catch (error) { console.error("Failed to generate video ideas:", error); showNotification("Could not generate AI ideas.", 'default'); return []; } }, [showNotification]);
  const generateCollaborators = useCallback(async (): Promise<Collaborator[]> => { const subRangeMin = Math.floor(stats.subscribers * 0.5); const subRangeMax = Math.max(100, Math.floor(stats.subscribers * 3)); try { const response = await ai.models.generateContent({ model: "gemini-2.5-flash", contents: `Generate 3 fictional, creative YouTuber personas for a collaboration. The player has ${stats.subscribers} subscribers. Each persona needs a unique channel name, a short theme/niche description, and a subscriber count between ${subRangeMin} and ${subRangeMax}.`, config: { responseMimeType: "application/json", responseSchema: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, theme: { type: Type.STRING }, subscribers: { type: Type.INTEGER } }, required: ["name", "theme", "subscribers"] } } } }); return JSON.parse(response.text); } catch (error) { console.error("Failed to generate collaborators:", error); showNotification("Could not generate AI collaborators.", 'default'); return []; } }, [stats.subscribers, showNotification]);
  const updateTrendingTopics = useCallback(async () => { showNotification("Checking for new YouTube trends...", 'default'); try { const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: `Generate 2-3 new, creative, viral YouTube video trends. For each, provide a short topic name (e.g., 'Spicy Noodle Challenge') and a relevant category from this list: ${VIDEO_CATEGORIES.join(', ')}.`, config: { responseMimeType: 'application/json', responseSchema: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { topic: { type: Type.STRING }, category: { type: Type.STRING, enum: VIDEO_CATEGORIES } }, required: ['topic', 'category'] } } } }); const newTopics = JSON.parse(response.text).map((t: any) => ({ ...t, expiresAt: Date.now() + TRENDING_TOPIC_DURATION_MS })); setTrendingTopics(currentTopics => [...currentTopics, ...newTopics]); setLastTrendUpdate(Date.now()); } catch (error) { console.error("Failed to generate trending topics:", error); } }, []);
  // --- BIG UPDATE GEMINI ---
  const generateRivals = useCallback(async () => { try { const response = await ai.models.generateContent({ model: "gemini-2.5-flash", contents: `Generate ${NUMBER_OF_RIVALS} fictional, creative YouTuber personas to act as rivals in a simulation game. For each rival, provide a unique channel name, a short theme/niche description (e.g., 'Chaotic VR Gaming', 'Cinematic Tech Reviews'), and a starting subscriber count between 50 and 250.`, config: { responseMimeType: "application/json", responseSchema: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, theme: { type: Type.STRING }, subscribers: { type: Type.INTEGER } }, required: ["name", "theme", "subscribers"] } } } }); const rivalData = JSON.parse(response.text); setRivals(rivalData.map((r: any) => ({...r, id: `rival-${r.name.replace(/\s+/g, '')}`, latestVideoTitle: 'Just Started!', uploadedAt: Date.now() }))); } catch (error) { console.error("Failed to generate rivals:", error); } }, []);
  const generateChannelBanner = useCallback(async (prompt: string): Promise<string> => { try { const response = await ai.models.generateImages({ model: 'imagen-4.0-generate-001', prompt: `Digital art, a YouTube channel banner, cinematic, ${prompt}`, config: { numberOfImages: 1, outputMimeType: 'image/png', aspectRatio: '16:9' } }); return response.generatedImages[0].image.imageBytes; } catch (error) { console.error("Failed to generate banner:", error); showNotification("AI banner generation failed.", 'default'); return ""; } }, [showNotification]);
  const generateStudioTip = useCallback(async (video: Video): Promise<string> => { try { const niche = channelBrand ? CHANNEL_NICHES_CONFIG.find(n => n.id === channelBrand.nicheId)?.name : 'General'; const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: `Act as a YouTube channel coach. A video titled "${video.title}" with a quality score of ${video.quality.toFixed(2)}/1.0 and audience retention of ${video.audienceRetention}% got ${video.views} views. The channel's niche is '${niche}'. Provide one concise, actionable tip (under 200 characters) to help the creator improve their next video based on these stats.`, config: { responseMimeType: 'application/json', responseSchema: { type: Type.OBJECT, properties: { tip: { type: Type.STRING } } } } }); return JSON.parse(response.text).tip; } catch (error) { console.error("Failed to generate studio tip:", error); return "Could not get an AI tip. Check your connection."; } }, [channelBrand]);

  useEffect(() => { if(gameState === 'playing' && rivals.length === 0) { generateRivals(); } }, [gameState, rivals.length, generateRivals]);
  useEffect(() => { if (viewingVideo && !viewingVideo.studioTip) { const getTip = async () => { const tip = await generateStudioTip(viewingVideo); setVideos(prev => prev.map(v => v.id === viewingVideo.id ? { ...v, studioTip: tip } : v)); setViewingVideo(prev => prev ? { ...prev, studioTip: tip } : null); }; getTip(); } }, [viewingVideo, generateStudioTip]);
  
  const handleUploadVideo = async (title: string, category: VideoCategory, description: string, seriesName?: string, useViralBoost = false, thumbnailData?: string, thumbnailPrompt?: string) => {
    const cost = useViralBoost ? talentBonuses.viralBoostEnergyCost : UPLOAD_VIDEO_COST; if(stats.creativeEnergy < cost) { showNotification("Not enough creative energy to upload!", 'default'); return; }
    setStats(prev => ({...prev, creativeEnergy: prev.creativeEnergy - cost})); setUploadModalOpen(false); showNotification("Uploading your new video...");
    const editor = hiredStaff.find(s => s.id === 'editor'); const editorBonus = editor ? editor.level * editor.effect : 0;
    const quality = upgrades.reduce((acc, upg) => acc + (upg.level * upg.effect * talentBonuses.upgradeQualityMultiplier), 0.1) + editorBonus;
    const baseRetention = Math.min(30 + quality * 100 + talentBonuses.audienceRetentionBonus, 95);
    const thumbnailUrl = thumbnailData || `https://picsum.photos/seed/${Date.now()}/400/225`;
    let newVideo: Video = { id: `vid-${Date.now()}`, title, category, type: 'video', description, thumbnailUrl, thumbnailPrompt, views: 0, likes: 0, uploadedAt: new Date(), quality: parseFloat(quality.toFixed(2)), audienceRetention: parseFloat((baseRetention + (Math.random() * 10 - 5)).toFixed(2)), watchHours: 0, comments: [], isTrending: false, viewHistory: [], };
    if (seriesName && seriesName.trim().length > 0) { const lastEpisode = videos.filter(v => v.seriesName === seriesName).reduce((max, v) => Math.max(max, v.seriesEpisode || 0), 0); newVideo.seriesName = seriesName; newVideo.seriesEpisode = lastEpisode + 1; }
    if (useViralBoost && viralBoostsAvailable > 0) {
      setViralBoostsAvailable(prev => prev - 1); showNotification("🚀 Viral Boost Activated!", 'default');
      const initialViews = VIRAL_INSTANT_VIEWS * talentBonuses.viralBoostEffectiveness; const initialLikes = Math.floor(initialViews * (0.95 + Math.random() * 0.04)); const retentionDecimal = (baseRetention + (Math.random() * 10 - 5)) / 100; const initialWatchHours = (initialViews * retentionDecimal * 5) / 60;
      newVideo = {...newVideo, views: initialViews, likes: initialLikes, watchHours: initialWatchHours, isTrending: true, trendingUntil: Date.now() + (TRENDING_DURATION_MS * talentBonuses.trendingDurationMultiplier), trendingMultiplier: VIRAL_MULTIPLIER, viewHistory: [initialViews], };
      const initialSubs = Math.floor(initialViews / (VIDEOS_SUBSCRIBER_CONVERSION_DIVISOR - quality * 50)) * talentBonuses.subGainMultiplier;
      setStats(prev => ({...prev, subscribers: prev.subscribers + initialSubs}));
    } else { const matchingTrend = trendingTopics.find(t => t.category === category && title.toLowerCase().includes(t.topic.toLowerCase())); if(matchingTrend) { newVideo.isTrending = true; newVideo.trendingUntil = Date.now() + (TRENDING_DURATION_MS * talentBonuses.trendingDurationMultiplier); newVideo.trendingMultiplier = TRENDING_MULTIPLIER * (unlockedTalentIds.has('PRODUCER_3') ? 2 : 1); showNotification(`🔥 Your video is on a TRENDING TOPIC!`, 'achievement'); unlockAchievement('FIRST_TRENDING'); } }
    setVideos(prev => [...prev, newVideo]); const comments = await generateComments(newVideo); setVideos(prev => prev.map(v => v.id === newVideo.id ? { ...v, comments } : v));
    showNotification(`"${title}" is now live!`); unlockAchievement('FIRST_VIDEO');
  };

  const handleBuyUpgrade = (upgradeId: Upgrade['id']) => { const upgrade = upgrades.find(u => u.id === upgradeId); if (!upgrade || upgrade.level >= upgrade.maxLevel) return; const cost = upgrade.cost[upgrade.level]; if (stats.money >= cost) { setStats(prev => ({...prev, money: prev.money - cost})); setUpgrades(prev => prev.map(u => u.id === upgradeId ? {...u, level: u.level + 1} : u)); showNotification(`Upgraded ${upgrade.name} to Level ${upgrade.level + 1}!`); } };
  const handleSponsorship = (accepted: boolean) => { if (!activeSponsorship) return; const finalOffer = activeSponsorship.offer * talentBonuses.sponsorshipOfferMultiplier * (activeSponsorship.category === VideoCategory.VLOG ? (1 + nicheBonuses.vlogSponsorBonus) : 1); if (accepted) { showNotification(`Deal with ${activeSponsorship.brand} accepted! You earned $${finalOffer.toLocaleString()}!`); const newMoney = stats.money + finalOffer; setStats(prev => ({...prev, money: newMoney})); setTotalMoneyEarned(prev => prev + finalOffer); } else { showNotification(`You declined the offer from ${activeSponsorship.brand}.`); } setCompletedSponsorshipIds(prev => [...prev, activeSponsorship.id]); setActiveSponsorship(null); };
  
  const addStrike = useCallback((count = 1) => {
    const newStrikeCount = stats.channelStrikes + count;
    showNotification(`Your channel has received ${count} strike(s)!`, 'expense');
    if (newStrikeCount >= MAX_CHANNEL_STRIKES) {
        showNotification("3 strikes! Your channel is being suspended!", 'expense');
        setStats(s => ({
            ...s,
            subscribers: Math.floor(s.subscribers * 0.8),
            money: Math.max(0, s.money * 0.5),
            suspendedUntil: Date.now() + SUSPENSION_DURATION_MS,
            channelStrikes: 0
        }));
        setIsMonetized(false);
    } else {
        setStats(s => ({ ...s, channelStrikes: newStrikeCount }));
    }
  }, [stats.channelStrikes, showNotification]);

  const handleEventChoice = useCallback((eventId: string, choiceId: string) => {
    const event = EVENTS_CONFIG.find(e => e.id === eventId);
    if (!event) return;

    switch (eventId) {
        case 'COPYRIGHT_CLAIM':
            if (choiceId === 'dispute') {
                if (Math.random() > 0.5) { // Win
                    showNotification('You won the dispute! The claim was removed.', 'default');
                    setStats(s => ({ ...s, money: s.money + 500 }));
                } else { // Lose
                    showNotification('You lost the dispute! Your channel has received a strike.', 'expense');
                    addStrike(1);
                }
            } else { // Remove
                if (activeEvent?.videoId) {
                    setVideos(vids => vids.filter(v => v.id !== activeEvent.videoId));
                }
            }
            break;
        case 'CONTROVERSIAL_CONTENT':
             if (choiceId === 'apologize') {
                showNotification('You removed the video and apologized. Your community is divided.', 'default');
                setStats(s => ({ ...s, subscribers: Math.floor(s.subscribers * 0.95) }));
                if (activeEvent?.videoId) {
                    setVideos(vids => vids.filter(v => v.id !== activeEvent.videoId));
                }
            } else { // defend
                if (Math.random() < 0.6) { // Fail
                    showNotification('Your defense was not well-received. The platform has issued a strike.', 'expense');
                    setStats(s => ({ ...s, subscribers: Math.floor(s.subscribers * 0.90) }));
                    addStrike(1);
                } else { // Success
                    showNotification('Your fans rally behind you! You gained subscribers and prestige.', 'default');
                    setStats(s => ({ ...s, subscribers: s.subscribers + Math.floor(s.subscribers * 0.05), prestige: s.prestige + 5 }));
                }
            }
            break;
        // Handle other events here if needed...
    }
    setActiveEvent(null);
  }, [activeEvent, addStrike, showNotification]);
  
  const handleCreateCommunityPost = (text: string) => { if(stats.creativeEnergy < talentBonuses.communityPostEnergyCost) { showNotification("Not enough energy to post.", 'default'); return; } setStats(s => ({...s, creativeEnergy: s.creativeEnergy - talentBonuses.communityPostEnergyCost})); const newPost: CommunityPost = { id: `post-${Date.now()}`, text, postedAt: new Date(), likes: Math.floor(stats.subscribers * 0.1 * Math.random()) }; setCommunityPosts(prev => [newPost, ...prev]); const newSubs = Math.floor(stats.subscribers * 0.001 * (1 + Math.random()) * talentBonuses.communityPostSubMultiplier * talentBonuses.subGainMultiplier); setStats(s => ({...s, subscribers: s.subscribers + newSubs})); showNotification(`Posted to community tab! (+${newSubs} subscribers)`); setCommunityPostModalOpen(false); };
  const handleStreamEnd = (donations: number, newSubscribers: number) => { setLiveStreamModalOpen(false); const finalDonations = donations * talentBonuses.streamDonationMultiplier; const finalNewSubs = newSubscribers * talentBonuses.subGainMultiplier; showNotification(`Stream ended! You earned $${finalDonations.toFixed(2)} and gained ${finalNewSubs} subscribers!`); setStats(s => ({ ...s, money: s.money + finalDonations, subscribers: s.subscribers + finalNewSubs })); setTotalMoneyEarned(prev => prev + finalDonations); unlockAchievement('FIRST_STREAM'); };
  const handleUnlockTalent = useCallback((talentId: string) => { if (stats.talentPoints > 0) { setStats(s => ({...s, talentPoints: s.talentPoints - 1})); setUnlockedTalentIds(prev => new Set(prev).add(talentId)); if (talentId === 'PRODUCER_4') { setViralBoostsAvailable(prev => prev + 1); } } }, [stats.talentPoints]);
  const handleHireOrUpgradeStaff = useCallback((staffId: StaffMember['id']) => { const staffConfig = STAFF_CONFIG.find(s => s.id === staffId); if (!staffConfig) return; const currentStaff = hiredStaff.find(s => s.id === staffId); const currentLevel = currentStaff ? currentStaff.level : 0; if (currentLevel >= staffConfig.maxLevel) return; const cost = staffConfig.cost[currentLevel]; if (stats.money >= cost) { setStats(s => ({...s, money: s.money - cost})); if (currentStaff) { setHiredStaff(prev => prev.map(s => s.id === staffId ? {...s, level: s.level + 1} : s)); showNotification(`Upgraded ${staffConfig.name} to Level ${currentLevel + 1}!`); } else { setHiredStaff(prev => [...prev, {...staffConfig, level: 1}]); showNotification(`Hired ${staffConfig.name}!`); unlockAchievement('HIRE_STAFF'); } } else { showNotification("Not enough money.", 'default'); } }, [hiredStaff, stats.money, showNotification, unlockAchievement]);
  const handleUploadShort = async (title: string, category: VideoCategory) => { if(stats.creativeEnergy < UPLOAD_SHORT_COST) { showNotification("Not enough creative energy!", 'default'); return; } setStats(prev => ({...prev, creativeEnergy: prev.creativeEnergy - UPLOAD_SHORT_COST})); setUploadShortModalOpen(false); const editor = hiredStaff.find(s => s.id === 'editor'); const editorBonus = editor ? editor.level * editor.effect : 0; const quality = upgrades.reduce((acc, upg) => acc + (upg.level * upg.effect * talentBonuses.upgradeQualityMultiplier), 0.1) + editorBonus; const baseRetention = Math.min(30 + quality * 100 + talentBonuses.audienceRetentionBonus, 95); const newShort: Video = { id: `vid-${Date.now()}`, title, category, type: 'short', description: 'A new Short!', thumbnailUrl: `https://picsum.photos/seed/${Date.now()}/225/400`, views: 0, likes: 0, uploadedAt: new Date(), quality: parseFloat(quality.toFixed(2)), audienceRetention: parseFloat((baseRetention + (Math.random() * 10 - 5)).toFixed(2)), watchHours: 0, comments: [], isTrending: false, viewHistory: [], }; setVideos(prev => [...prev, newShort]); showNotification(`Your Short "${title}" is now live!`); unlockAchievement('FIRST_SHORT'); };
  const handleOpenCollabModal = async () => { setCollabModalOpen(true); setIsGeneratingCollabs(true); const options = await generateCollaborators(); setCollabOptions(options); setIsGeneratingCollabs(false); };
  const handleCollab = (collaborator: Collaborator) => { if (stats.creativeEnergy < COLLAB_COST) { showNotification("Not enough energy!", 'default'); return; } setStats(s => ({...s, creativeEnergy: s.creativeEnergy - COLLAB_COST})); setCollabCooldownUntil(Date.now() + COLLAB_COOLDOWN_MS); setCollabModalOpen(false); const subGain = Math.floor(collaborator.subscribers * (0.05 + Math.random() * 0.1) * talentBonuses.subGainMultiplier); setStats(s => ({...s, subscribers: s.subscribers + subGain})); showNotification(`Amazing Collab! You gained ${subGain.toLocaleString()} subscribers from ${collaborator.name}!`); };
  const handleSetNiche = (nicheId: string) => { setChannelBrand(prev => ({ ...prev, nicheId: nicheId })); showNotification("Channel Niche updated!", 'default'); };
  const handleGenerateBanner = async (prompt: string) => { showNotification("Generating your new banner...", 'default'); const bannerData = await generateChannelBanner(prompt); if (bannerData) { const bannerUrl = `data:image/png;base64,${bannerData}`; setChannelBrand(prev => ({...prev, bannerUrl, bannerPrompt: prompt })); } };

  const checkAchievements = useCallback(() => { if (isMonetized) unlockAchievement('MONETIZED'); if (videos.some(v => v.views >= 1000000)) unlockAchievement('VIRAL_HIT'); if (stats.subscribers >= 10000) unlockAchievement('SUB_10K'); if (stats.subscribers >= 100000) unlockAchievement('SUB_100K'); if (totalMoneyEarned >= 10000) unlockAchievement('MONEY_10K'); if (upgrades.every(u => u.level === u.maxLevel)) unlockAchievement('TECH_GURU'); if (completedSponsorshipIds.length >= 3) unlockAchievement('SPONSOR_PRO'); if (videos.length >= 10) unlockAchievement('VIDEO_PROLIFIC'); }, [isMonetized, videos, stats.subscribers, totalMoneyEarned, upgrades, completedSponsorshipIds.length, unlockAchievement]);
  const runAwardShow = useCallback(() => {
    const allChannels = [...rivals, { id: defaultUser.id, name: defaultUser.username, subscribers: stats.subscribers, theme: channelBrand?.nicheId || 'General' }];
    const allVidsWithScore = videos.map(v => { const timeSinceUploadHours = Math.max(1, (Date.now() - v.uploadedAt.getTime()) / 3600000); return { ...v, viralityScore: (v.views / timeSinceUploadHours) * v.quality * (v.audienceRetention / 100) }; });
    const generatedAwards = AWARDS_CONFIG.map(award => {
        let nominees: { name: string, value: number }[] = [];
        switch(award.id) {
            case 'creator_of_year': nominees = allChannels.map(c => ({ name: c.name, value: c.subscribers })); break;
            case 'video_of_year': nominees = allVidsWithScore.sort((a,b) => b.viralityScore! - a.viralityScore!).slice(0, 4).map(v => ({ name: v.title, value: Math.round(v.viralityScore!)})); break;
            case 'gaming_channel': const gamingVids = videos.filter(v => v.category === VideoCategory.GAMING); const playerGamingViews = gamingVids.reduce((s, v) => s + v.views, 0); nominees = [{name: defaultUser.username, value: playerGamingViews}, ...rivals.map(r => ({name: r.name, value: Math.floor(r.subscribers * 50 * Math.random())}))]; break; // Simplified rival views
            case 'vlog_channel': const vlogVids = videos.filter(v => v.category === VideoCategory.VLOG); const playerVlogViews = vlogVids.reduce((s, v) => s + v.views, 0); nominees = [{name: defaultUser.username, value: playerVlogViews}, ...rivals.map(r => ({name: r.name, value: Math.floor(r.subscribers * 40 * Math.random())}))]; break;
        }
        nominees.sort((a,b) => b.value - a.value); const winner = nominees.length > 0 ? nominees[0] : { name: 'Nobody', value: 0 };
        return { ...award, nominees, winner };
    });
    setAwardsThisYear(generatedAwards); setIsAwardModalOpen(true);
    const playerWins = generatedAwards.filter(a => a.winner.name === defaultUser.username).length;
    if (playerWins > 0) { unlockAchievement('FIRST_AWARD'); setStats(s => ({...s, prestige: s.prestige + playerWins * PRESTIGE_PER_AWARD})); showNotification(`You won ${playerWins} award(s)! (+${playerWins * PRESTIGE_PER_AWARD} Prestige)`, 'award'); }
  }, [rivals, stats.subscribers, channelBrand, videos, unlockAchievement, showNotification]);

  // Main game loop
  useEffect(() => {
    if (gameState !== 'playing' || isGameOver) return;
    const gameInterval = setInterval(() => {
      const now = Date.now();
      if (stats.suspendedUntil > now) { return; } // Channel is suspended
      if (stats.money < GAME_OVER_MONEY_THRESHOLD) { setIsGameOver(true); return; }

      setCollabCooldown(Math.max(0, collabCooldownUntil - now));
      setStats(prev => ({ ...prev, creativeEnergy: Math.min(MAX_CREATIVE_ENERGY, prev.creativeEnergy + ENERGY_REGEN_RATE), }));
      setTrendingTopics(currentTopics => currentTopics.filter(t => t.expiresAt > now));
      if (now - lastTrendUpdate > TRENDING_TOPIC_UPDATE_INTERVAL_MS) { updateTrendingTopics(); }
      setTicksUntilBill(prev => { if (prev <= 1) { const baseExpense = WEEKLY_EXPENSES_AMOUNT * talentBonuses.weeklyExpensesMultiplier; const staffSalaries = hiredStaff.reduce((total, staff) => total + staff.salary[staff.level - 1], 0); const totalExpenses = baseExpense + staffSalaries; const income = talentBonuses.merchIncome; const netChange = income - totalExpenses; setStats(s => ({...s, money: s.money + netChange})); showNotification(`Weekly Summary: +$${income.toLocaleString()} Merch, -$${totalExpenses.toLocaleString()} expenses.`, 'expense'); return TICKS_PER_WEEK; } return prev - 1; });
      setTicksUntilAwards(prev => { if (prev <= 1) { runAwardShow(); return TICKS_PER_YEAR; } return prev - 1; });
      if (videos.length === 0 && hiredStaff.length === 0 && rivals.length === 0) return;
      let newSubsThisTick = 0; let totalMoneyGainedThisTick = 0;
      const manager = hiredStaff.find(s => s.id === 'manager'); if (manager) { newSubsThisTick += manager.level * manager.effect * talentBonuses.subGainMultiplier; }
      setRivals(r => r.map(rival => { if (Math.random() < RIVAL_UPDATE_CHANCE) { const subGain = Math.floor(rival.subscribers * (0.001 + Math.random() * 0.005)); return { ...rival, subscribers: rival.subscribers + subGain }; } return rival; }));

      const updatedVideos = videos.map(video => {
        let currentVideo = { ...video };
        if (currentVideo.isTrending && now > (currentVideo.trendingUntil || 0)) { currentVideo.isTrending = false; }
        const isShort = currentVideo.type === 'short';
        const timeSinceUpload = (now - currentVideo.uploadedAt.getTime()) / 1000 / 60;
        const decayFactor = isShort ? Math.max(0.05, 1 / (timeSinceUpload / (2 + currentVideo.quality * 5) + 1)) : Math.max(0.1, 1 / (timeSinceUpload / (10 + currentVideo.quality * 20) + 1));
        const baseViews = isShort ? (Math.random() * 200 + 50) : (Math.random() * 50 + 10);
        let newViews = Math.floor(baseViews * decayFactor * (1 + currentVideo.quality) * (currentVideo.audienceRetention / 50) * talentBonuses.viewMultiplier);
        if (currentVideo.isTrending) { newViews *= (currentVideo.trendingMultiplier || TRENDING_MULTIPLIER); }
        if (currentVideo.seriesName && currentVideo.seriesEpisode && currentVideo.seriesEpisode > 1) { newViews *= (1 + SERIES_MOMENTUM_BONUS * Math.min(5, currentVideo.seriesEpisode)); }
        const subConversionDivisor = isShort ? SHORTS_SUBSCRIBER_CONVERSION_DIVISOR : VIDEOS_SUBSCRIBER_CONVERSION_DIVISOR;
        let subBonus = currentVideo.category === VideoCategory.GAMING ? nicheBonuses.gamingSubBonus : 0;
        if (Math.random() < newViews / (subConversionDivisor - currentVideo.quality * 50)) { newSubsThisTick += Math.floor((Math.random() * (1 + currentVideo.quality * 2) * talentBonuses.subGainMultiplier) * (1 + subBonus)) + 1; }
        const updatedViews = currentVideo.views + newViews; const updatedLikes = Math.floor(updatedViews * (0.95 + Math.random() * 0.04)); const avgWatchTimeMinutes = isShort ? 0.75 : 5; const newWatchHours = (newViews * (currentVideo.audienceRetention / 100) * avgWatchTimeMinutes) / 60; const updatedWatchHours = currentVideo.watchHours + newWatchHours;
        if (isMonetized) { let moneyBonus = currentVideo.category === VideoCategory.TECH ? nicheBonuses.techIncomeBonus : 0; const moneyFromContent = (isShort ? (newViews / 1000) * (BASE_CPM * SHORTS_CPM_MULTIPLIER) : newWatchHours * (BASE_CPM / 1000) * 12) * talentBonuses.monetizationMultiplier * (1 + moneyBonus); totalMoneyGainedThisTick += moneyFromContent; }
        return { ...currentVideo, views: updatedViews, likes: updatedLikes, watchHours: updatedWatchHours };
      });
      if (!isAwardModalOpen && Math.random() < ALGORITHM_REDISCOVERY_CHANCE) { const eligibleVideos = updatedVideos.filter(v => !v.isTrending && v.quality > 0.5); if(eligibleVideos.length > 0) { const rediscoveredVideo = eligibleVideos[Math.floor(Math.random() * eligibleVideos.length)]; rediscoveredVideo.isTrending = true; rediscoveredVideo.trendingUntil = now + REDISCOVERY_DURATION_MS; rediscoveredVideo.trendingMultiplier = REDISCOVERY_MULTIPLIER; showNotification(`📈 The algorithm rediscovered "${rediscoveredVideo.title}"! It's going viral again!`, 'default'); } }
      setVideos(updatedVideos); setStats(prevStats => ({ ...prevStats, subscribers: prevStats.subscribers + newSubsThisTick, money: prevStats.money + totalMoneyGainedThisTick })); setTotalMoneyEarned(prev => prev + totalMoneyGainedThisTick);
      if(!activeSponsorship) { const nextSponsor = SPONSORSHIPS_CONFIG.find(s => stats.subscribers >= s.subscriberReq && !completedSponsorshipIds.includes(s.id) ); if (nextSponsor) { setActiveSponsorship({ ...nextSponsor, status: 'offered' }); } }
      if (!activeEvent && Math.random() < 0.02) { const randomEvent: GameEvent = { ...EVENTS_CONFIG[Math.floor(Math.random() * EVENTS_CONFIG.length)]}; const randomVideo = videos.length > 0 ? videos[Math.floor(Math.random() * videos.length)] : null; if (randomVideo) { randomEvent.videoId = randomVideo.id; randomEvent.description = randomEvent.description.replace('one of your videos', `"${randomVideo.title}"`).replace('Your latest video', `"${randomVideo.title}"`).replace('Your video', `"${randomVideo.title}"`); } setActiveEvent(randomEvent); }
      checkAchievements();
    }, GAME_TICK_MS);
    return () => clearInterval(gameInterval);
  }, [gameState, videos, isMonetized, stats.subscribers, stats.money, showNotification, activeSponsorship, completedSponsorshipIds, activeEvent, checkAchievements, talentBonuses, collabCooldownUntil, hiredStaff, lastTrendUpdate, updateTrendingTopics, runAwardShow, isAwardModalOpen, isGameOver, stats.suspendedUntil, stats.money]);

  useEffect(() => { const totalWatchHours = videos.reduce((sum, v) => sum + v.watchHours, 0); setStats(prevStats => ({ ...prevStats, totalWatchHours })); if (!isMonetized && stats.subscribers >= MONETIZATION_SUBSCRIBERS_REQ && totalWatchHours >= MONETIZATION_WATCH_HOURS_REQ) { setIsMonetized(true); showNotification("Congratulations! Your channel is now MONETIZED!"); unlockAchievement('MONETIZED'); } }, [videos, stats.subscribers, isMonetized, showNotification, unlockAchievement]);
  useEffect(() => { const nextMilestone = SUBSCRIBER_MILESTONES_FOR_TALENT_POINTS.find( milestone => stats.subscribers >= milestone && !awardedMilestones.has(milestone) ); if (nextMilestone) { setStats(s => ({...s, talentPoints: s.talentPoints + 1})); setAwardedMilestones(prev => new Set(prev).add(nextMilestone)); showNotification("You've earned a Talent Point!", "talent"); } }, [stats.subscribers, awardedMilestones, showNotification]);
  useEffect(() => { if (gameState === 'playing') { setStatsHistory(prev => [...prev.slice(-59), stats]); } }, [stats, gameState]);

  const allAchievements = useMemo(() => ACHIEVEMENTS_CONFIG, []); const allTalents = useMemo(() => TALENT_TREE_CONFIG, []); const allStaff = useMemo(() => STAFF_CONFIG, []); const notificationStyles = { default: "from-blue-500 to-purple-600", achievement: "from-yellow-400 to-orange-500", expense: "from-red-500 to-orange-600", talent: "from-teal-400 to-cyan-500", award: "from-amber-400 to-yellow-500" };
  const isSuspended = stats.suspendedUntil > Date.now();

  if (gameState === 'loading') { return <div className="flex h-screen w-full items-center justify-center bg-gray-900 text-white">Loading...</div>; }
  
  const tabs: {id: MainTab, label: string, icon: React.ReactNode}[] = [
      { id: 'dashboard', label: 'Dashboard', icon: <HomeIcon className="w-5 h-5"/> },
      { id: 'videos', label: 'Videos', icon: <PlayIcon className="w-5 h-5"/> },
      { id: 'community', label: 'Community', icon: <UsersIcon className="w-5 h-5"/> },
      { id: 'channel', label: 'Channel', icon: <PaintBrushIcon className="w-5 h-5"/> },
      { id: 'rivals', label: 'Rivals', icon: <MegaphoneIcon className="w-5 h-5"/> },
      { id: 'analytics', label: 'Analytics', icon: <ChartPieIcon className="w-5 h-5"/> },
      { id: 'monetization', label: 'Monetization', icon: <DollarSignIcon className="w-5 h-5"/> },
  ];
  if(stats.subscribers >= STAFF_UNLOCK_REQ) { tabs.push({ id: 'staff', label: 'Staff', icon: <BriefcaseIcon className="w-5 h-5"/> }); }

  return (
    <div className="flex h-screen bg-gray-900 text-gray-200 font-sans">
      {isGameOver && <GameOverModal stats={stats} onReset={resetGameState} />}
      {isSuspended && <SuspensionBanner suspendedUntil={stats.suspendedUntil} />}

      <Sidebar stats={stats} isMonetized={isMonetized} upgrades={upgrades} onBuyUpgrade={handleBuyUpgrade} onOpenAchievements={() => setAchievementsModalOpen(true)} onOpenTalents={() => setTalentModalOpen(true)} ticksUntilBill={ticksUntilBill} username={defaultUser.username} />
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header onUploadClick={() => setUploadModalOpen(true)} onShortClick={() => setUploadShortModalOpen(true)} onGoLiveClick={() => { if (stats.creativeEnergy >= talentBonuses.goLiveEnergyCost) { setStats(s => ({...s, creativeEnergy: s.creativeEnergy - talentBonuses.goLiveEnergyCost})); setLiveStreamModalOpen(true) } else { showNotification("Not enough energy!", "default") } }} onCollabClick={handleOpenCollabModal} onAdminClick={() => setIsAdminPanelOpen(true)} stats={stats} goLiveCost={talentBonuses.goLiveEnergyCost} collabCooldown={collabCooldown} trendingTopics={trendingTopics} channelBrand={channelBrand} isSuspended={isSuspended} />
        <div className="flex-shrink-0 px-4 sm:px-6 lg:px-8 border-b border-gray-700">
            <div className="flex gap-1 flex-wrap">
                {tabs.map(tab => ( <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-3 py-3 font-semibold border-b-2 transition-colors text-sm ${activeTab === tab.id ? 'text-red-400 border-red-400' : 'text-gray-400 border-transparent hover:text-white'}`} > {tab.icon} {tab.label} </button> ))}
            </div>
        </div>
        <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            {activeTab === 'dashboard' && <DashboardTab stats={stats} statsHistory={statsHistory} videos={videos} />}
            {activeTab === 'videos' && <VideoList videos={videos} onVideoClick={setViewingVideo} />}
            {activeTab === 'community' && <CommunityTab posts={communityPosts} onNewPost={() => setCommunityPostModalOpen(true)} isSuspended={isSuspended}/>}
            {activeTab === 'channel' && <ChannelTab channelBrand={channelBrand} onSetNiche={handleSetNiche} onGenerateBanner={handleGenerateBanner} />}
            {activeTab === 'rivals' && <RivalsTab rivals={rivals} />}
            {activeTab === 'analytics' && <AnalyticsTab statsHistory={statsHistory} videos={videos} />}
            {activeTab === 'monetization' && <MonetizationTab stats={stats} videos={videos} completedSponsorshipsCount={completedSponsorshipIds.length} unlockedTalentIds={unlockedTalentIds} totalMoneyEarned={totalMoneyEarned} />}
            {activeTab === 'staff' && <StaffTab hiredStaff={hiredStaff} allStaff={allStaff} stats={stats} onHireOrUpgrade={handleHireOrUpgradeStaff} />}
        </div>
      </main>
      {/* FIX: Corrected typo from `talentBonuses.viralBoostCost` to `talentBonuses.viralBoostEnergyCost` to match the property name in the `talentBonuses` object. */}
      {isUploadModalOpen && <UploadModal onClose={() => setUploadModalOpen(false)} onUpload={handleUploadVideo} onGenerateIdeas={generateVideoIdeas} onGenerateThumbnail={generateChannelBanner} viralBoostsAvailable={viralBoostsAvailable} currentEnergy={stats.creativeEnergy} viralBoostCost={talentBonuses.viralBoostEnergyCost} trendingTopics={trendingTopics} />}
      {isUploadShortModalOpen && <UploadShortModal onClose={() => setUploadShortModalOpen(false)} onUpload={handleUploadShort} currentEnergy={stats.creativeEnergy} />}
      {viewingVideo && <VideoDetailModal video={viewingVideo} onClose={() => setViewingVideo(null)} />}
      {activeSponsorship && <SponsorshipModal sponsorship={activeSponsorship} onAccept={() => handleSponsorship(true)} onDecline={() => handleSponsorship(false)} finalOffer={activeSponsorship.offer * talentBonuses.sponsorshipOfferMultiplier * (activeSponsorship.category === VideoCategory.VLOG ? (1 + nicheBonuses.vlogSponsorBonus) : 1)} />}
      {activeEvent && <EventModal event={activeEvent} onChoice={handleEventChoice} />}
      {isAchievementsModalOpen && <AchievementsModal achievements={allAchievements} unlockedIds={unlockedAchievements} onClose={() => setAchievementsModalOpen(false)} />}
      {isTalentModalOpen && <TalentTreeModal tree={allTalents} unlockedIds={unlockedTalentIds} talentPoints={stats.talentPoints} onUnlock={handleUnlockTalent} onClose={() => setTalentModalOpen(false)} />}
      {isCollabModalOpen && <CollabModal onClose={() => setCollabModalOpen(false)} onCollab={handleCollab} options={collabOptions} isLoading={isGeneratingCollabs} />}
      {isCommunityPostModalOpen && <CommunityPostModal onClose={() => setCommunityPostModalOpen(false)} onPost={handleCreateCommunityPost} currentEnergy={stats.creativeEnergy} postCost={talentBonuses.communityPostEnergyCost} />}
      {isLiveStreamModalOpen && <LiveStreamModal onClose={() => setLiveStreamModalOpen(false)} onStreamEnd={handleStreamEnd} subscriberCount={stats.subscribers} />}
      {isAwardModalOpen && <AwardShowModal awards={awardsThisYear} playerName={defaultUser.username} onClose={() => setIsAwardModalOpen(false)} />}
      
      {isAdminPanelOpen && <AdminPanelModal onClose={() => setIsAdminPanelOpen(false)} onAdminAction={handleAdminAction} />}

      {notification && ( <div className={`fixed top-5 right-5 bg-gradient-to-r ${notificationStyles[notification.type]} text-white py-3 px-6 rounded-lg shadow-2xl z-[100] animate-pulse`}> <p className="font-bold">{notification.message}</p> </div> )}
    </div>
  );
};

export default App;
