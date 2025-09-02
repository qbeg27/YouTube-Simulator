
export enum VideoCategory {
  GAMING = 'Gaming',
  VLOG = 'Vlog',
  TUTORIAL = 'Tutorial',
  MUSIC = 'Music',
  COMEDY = 'Comedy',
  TECH = 'Tech Review',
}

export interface Comment {
  id: string;
  username: string;
  text: string;
}

export interface Video {
  id:string;
  title: string;
  description: string;
  category: VideoCategory;
  thumbnailUrl: string;
  thumbnailPrompt?: string; // For remembering AI thumbnail prompts
  views: number;
  likes: number;
  uploadedAt: Date;
  // New property to distinguish content type
  type: 'video' | 'short';
  // New metrics for deeper simulation
  quality: number; // 0-1, based on upgrades at time of upload
  audienceRetention: number; // percentage 0-100
  watchHours: number;
  comments: Comment[];
  // Trending logic
  isTrending: boolean;
  trendingUntil?: number;
  trendingMultiplier?: number;
  viewHistory: number[];
  // --- BIG UPDATE ---
  seriesName?: string;
  seriesEpisode?: number;
  viralityScore?: number;
  studioTip?: string;
}

export interface ChannelStats {
  subscribers: number;
  totalWatchHours: number; // Changed from totalViews
  money: number;
  creativeEnergy: number;
  talentPoints: number;
  // --- BIG UPDATE ---
  prestige: number;
  // --- NEW FEATURES ---
  channelStrikes: number;
  suspendedUntil: number; // Timestamp
}

export interface Upgrade {
  id: 'camera' | 'mic' | 'editing';
  name: string;
  level: number;
  maxLevel: number;
  cost: number[];
  // Effect multiplier per level
  effect: number;
}

export interface Sponsorship {
    id: string;
    brand: string;
    offer: number;
    subscriberReq: number;
    status: 'offered' | 'accepted' | 'declined';
    // Fix: Added optional 'category' to allow for category-specific sponsorship logic.
    category?: VideoCategory;
}

// New Types for Events and Achievements

export interface EventChoice {
  id: string;
  text: string;
  description: string;
}

export interface GameEvent {
  id: string;
  type: 'positive' | 'negative' | 'neutral';
  title: string;
  description: string;
  choices: EventChoice[];
  // Optional field to target a specific video
  videoId?: string; 
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
}

export interface CommunityPost {
    id: string;
    text: string;
    postedAt: Date;
    likes: number;
}

// New Types for Talent Tree
export interface Talent {
  id: string;
  name: string;
  description: string;
  prereq?: string;
  tier: number;
}

export interface TalentBranch {
  id: 'creator' | 'producer' | 'entrepreneur';
  name: string;
  description: string;
  talents: Talent[];
}

// New Type for Collab Feature
export interface Collaborator {
    name: string;
    theme: string;
    subscribers: number;
}

// New Type for Auth
export interface User {
    id: string;
    username: string;
}

// --- NEW FEATURES ---

// NEW TYPES FOR STAFF
export interface StaffMember {
  id: 'editor' | 'manager';
  name: string;
  level: number;
  maxLevel: number;
  salary: number[]; // Salary per level
  cost: number[]; // Cost to hire/upgrade
  description: string;
  effectDescription: (effect: number) => string;
  effect: number; // Effect multiplier per level
}

// NEW TYPE FOR TRENDING TOPICS
export interface TrendingTopic {
    topic: string;
    category: VideoCategory;
    expiresAt: number;
}

// --- NEW TYPES FOR LIVE STREAMING ---
export interface ChatMessage {
  id: string;
  username: string;
  text: string;
  type: 'NORMAL' | 'SPAM' | 'QUESTION' | 'DONATION' | 'SYSTEM';
  amount?: number; // For donations
}

export interface StreamEventChoice {
  text: string;
  isCorrect: boolean;
}

export interface StreamEvent {
  id: string;
  type: 'QUESTION' | 'TECHNICAL_ISSUE' | 'RAID';
  title: string;
  description: string;
  duration: number; // in seconds
  choices?: StreamEventChoice[];
}

// --- BIG UPDATE ---
export interface RivalChannel {
  id: string;
  name: string;
  subscribers: number;
  theme: string;
  latestVideoTitle: string;
  uploadedAt: number; // timestamp
}

export interface ChannelNiche {
    id: string;
    name: string;
    description: string;
    // Simple bonus effect description
    bonus: string;
}

export interface ChannelBrand {
    nicheId: string;
    bannerUrl?: string;
    bannerPrompt?: string;
}

export interface Award {
    id: string;
    name: string;
    description: string;
    nominees: { name: string, value: number }[];
    winner: { name: string, value: number };
}