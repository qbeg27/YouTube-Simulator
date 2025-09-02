
import { VideoCategory, Upgrade, Sponsorship, Achievement, GameEvent, TalentBranch, StaffMember, StreamEvent, ChannelNiche, Award } from './types';

export const MONETIZATION_SUBSCRIBERS_REQ = 1000;
export const MONETIZATION_WATCH_HOURS_REQ = 4000; // Updated from views

// Average earnings per 1000 views, assuming 100% watch time
export const BASE_CPM = 4.5; 
export const SHORTS_CPM_MULTIPLIER = 0.1; // Shorts earn 10% of long-form CPM

export const VIDEO_CATEGORIES: VideoCategory[] = [
  VideoCategory.GAMING,
  VideoCategory.VLOG,
  VideoCategory.TUTORIAL,
  VideoCategory.MUSIC,
  VideoCategory.COMEDY,
  VideoCategory.TECH,
];

// How often the game state updates in milliseconds
export const GAME_TICK_MS = 2000;

// Life Sim Constants
export const MAX_CREATIVE_ENERGY = 100;
export const ENERGY_REGEN_RATE = 1; // per tick
export const UPLOAD_VIDEO_COST = 30;
export const UPLOAD_SHORT_COST = 15;
export const VIRAL_BOOST_COST = 50;
export const GO_LIVE_COST = 20;
export const COMMUNITY_POST_COST = 10;
export const COLLAB_COST = 75;
export const STREAM_DURATION_SECONDS = 90; // Increased duration for more interaction
export const WEEKLY_EXPENSES_AMOUNT = 150;
export const TICKS_PER_WEEK = 210; // 210 ticks * 2s/tick = 420s = 7 minutes
export const COLLAB_COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes

// --- NEW GAME MECHANICS ---
export const MAX_CHANNEL_STRIKES = 3;
export const SUSPENSION_DURATION_MS = 2 * 60 * 1000; // 2 minutes real time
export const GAME_OVER_MONEY_THRESHOLD = -2000;


// Subscriber Conversion
export const VIDEOS_SUBSCRIBER_CONVERSION_DIVISOR = 200;
export const SHORTS_SUBSCRIBER_CONVERSION_DIVISOR = 600;

// Trending Algorithm Constants
export const TRENDING_TOPIC_DURATION_MS = 10 * 60 * 1000; // A topic stays trending for 10 minutes
export const TRENDING_TOPIC_UPDATE_INTERVAL_MS = 5 * 60 * 1000; // Check for new trends every 5 minutes
export const TRENDING_DURATION_MS = 5 * 60 * 1000; // Video stays trending for 5 minutes
export const TRENDING_MULTIPLIER = 5; // 5x views when trending on a topic
export const VIRAL_MULTIPLIER = 10; // 10x for instant boost
export const VIRAL_INSTANT_VIEWS = 100000;
export const CATEGORY_TREND_FACTORS: Record<VideoCategory, number> = {
    [VideoCategory.GAMING]: 1.5,
    [VideoCategory.COMEDY]: 1.4,
    [VideoCategory.MUSIC]: 1.2,
    [VideoCategory.VLOG]: 1.1,
    [VideoCategory.TECH]: 1.0,
    [VideoCategory.TUTORIAL]: 0.8,
};


export const UPGRADES_CONFIG: Upgrade[] = [
    {
        id: 'camera',
        name: 'Camera',
        level: 0,
        maxLevel: 5,
        cost: [50, 250, 1000, 5000, 20000],
        effect: 0.1, // +10% quality boost per level
    },
    {
        id: 'mic',
        name: 'Microphone',
        level: 0,
        maxLevel: 5,
        cost: [30, 150, 750, 3000, 15000],
        effect: 0.08, // +8% quality boost per level
    },
    {
        id: 'editing',
        name: 'Editing Software',
        level: 0,
        maxLevel: 5,
        cost: [100, 500, 2500, 10000, 50000],
        effect: 0.12, // +12% quality boost per level
    },
];

// Fix: Added categories to sponsorships to enable category-specific bonuses.
export const SPONSORSHIPS_CONFIG: Omit<Sponsorship, 'status'>[] = [
    { id: 'sponsor1', brand: 'GamerFuel Energy', offer: 500, subscriberReq: 5000, category: VideoCategory.GAMING },
    { id: 'sponsor2', brand: 'PixelPerfect Keyboards', offer: 1200, subscriberReq: 15000, category: VideoCategory.TECH },
    { id: 'sponsor3', brand: 'StreamPro Chairs', offer: 3000, subscriberReq: 50000, category: VideoCategory.VLOG },
    { id: 'sponsor4', brand: 'CloudSys Hosting', offer: 7500, subscriberReq: 100000, category: VideoCategory.TECH },
];

export const FAKE_USERNAMES = [
    'GamerPro123', 'VlogLife', 'TechNerd', 'MusicMan', 'ComedyKing', 'TutorialMaster', 
    'SkyHigh', 'PixelPioneer', 'CodeWizard', 'HappyCamper', 'CoolCat', 'TopTier', 
    'RandomUser', 'BotOrNot', 'Commenter'
];

export const ACHIEVEMENTS_CONFIG: Achievement[] = [
    { id: 'FIRST_VIDEO', name: 'Baby Steps', description: 'Upload your first video.' },
    { id: 'FIRST_SHORT', name: 'Going Short', description: 'Upload your first Short.' },
    { id: 'MONETIZED', name: 'Getting Paid', description: 'Become monetized by reaching 1,000 subscribers and 4,000 watch hours.' },
    { id: 'FIRST_TRENDING', name: 'Catching Fire', description: 'Have your first video start trending.' },
    { id: 'VIRAL_HIT', name: 'Viral Sensation', description: 'Get 1,000,000 views on a single video.' },
    { id: 'SUB_10K', name: 'Silver Play Button (Unofficial)', description: 'Reach 10,000 subscribers.' },
    { id: 'SUB_100K', name: 'The Big 100k', description: 'Reach 100,000 subscribers.' },
    { id: 'MONEY_10K', name: 'High Roller', description: 'Earn a total of $10,000.' },
    { id: 'TECH_GURU', name: 'Studio Mogul', description: 'Max out all your studio upgrades.' },
    { id: 'SPONSOR_PRO', name: 'Brand Ambassador', description: 'Complete 3 sponsorship deals.' },
    { id: 'VIDEO_PROLIFIC', name: 'Content Machine', description: 'Upload 10 videos.' },
    { id: 'FIRST_STREAM', name: 'Now We\'re Live!', description: 'Complete your first live stream.'},
    { id: 'HIRE_STAFF', name: 'Team Player', description: 'Hire your first staff member.' },
    // --- BIG UPDATE ---
    { id: 'FIRST_AWARD', name: 'Award Winner', description: 'Win your first Streamy Award.' },
    { id: 'RIVAL_BEATEN', name: 'Top of the Charts', description: 'Surpass a rival channel in subscribers.' },
];

export const EVENTS_CONFIG: Omit<GameEvent, 'videoId'>[] = [
    {
        id: 'SHOUTOUT',
        type: 'positive',
        title: 'Shoutout from a Big Creator!',
        description: 'A massive YouTuber mentioned one of your videos in their latest upload! The new traffic is overwhelming your channel.',
        choices: [
            { id: 'sub_boost', text: 'Engage with the new audience', description: 'Gain a huge, immediate burst of subscribers.' },
            { id: 'view_boost', text: 'Focus on converting viewers', description: 'Get a long-term view multiplier on the featured video.' },
        ]
    },
    {
        id: 'COPYRIGHT_CLAIM',
        type: 'negative',
        title: 'Copyright Claim',
        description: 'Your latest video has been flagged for using copyrighted music. The video is no longer being monetized.',
        choices: [
            { id: 'dispute', text: 'Dispute the claim', description: 'A 50/50 chance of winning. Success gives a cash bonus; failure results in a Channel Strike!' },
            { id: 'remove', text: 'Remove the video', description: 'The safest option. You lose the video and all its stats forever, but face no other penalty.' },
        ]
    },
    {
        id: 'CONTROVERSIAL_CONTENT',
        type: 'negative',
        title: 'Content Policy Review',
        description: 'Your video has been flagged for potentially violating community guidelines. Your monetization is paused during the review.',
        choices: [
            { id: 'apologize', text: 'Apologize & Remove Video', description: 'Lose the video and some subscribers, but avoid a channel strike.' },
            { id: 'defend', text: 'Defend Your Content', description: 'High risk! A 60% chance of failure, resulting in a strike and major subscriber loss. 40% chance of success, gaining subs and prestige.' },
        ]
    },
    {
        id: 'VIRAL_MEME',
        type: 'neutral',
        title: 'You\'re a Meme!',
        description: 'A clip from your video has gone viral as a meme. It\'s bringing a lot of unusual traffic to your channel.',
        choices: [
            { id: 'embrace', text: 'Embrace the meme', description: 'Get a massive, short-term boost in views and subs, but a temporary decrease in video quality for your next upload.' },
            { id: 'ignore', text: 'Ignore the trend', description: 'A small, permanent subscriber boost from the dedicated new fans who stick around.' },
        ]
    },
    {
        id: 'NEGATIVE_PRESS',
        type: 'negative',
        title: 'Negative Press',
        description: 'A "drama" channel made a video criticizing you. Your comment section is a warzone and subscribers are leaving.',
        choices: [
            { id: 'apologize', text: 'Upload an apology video', description: 'Costs money to produce. Might win back subscribers, or it might make things worse.' },
            { id: 'ignore', text: 'Ride out the storm', description: 'Suffer an immediate subscriber loss, but there\'s a chance it blows over quickly.' },
        ]
    }
];

// --- NEW STAFF CONSTANTS ---
export const STAFF_UNLOCK_REQ = 10000;

export const STAFF_CONFIG: StaffMember[] = [
    {
        id: 'editor',
        name: 'Video Editor',
        level: 0,
        maxLevel: 3,
        cost: [2000, 8000, 20000],
        salary: [500, 1500, 4000], // per week
        description: 'A professional editor who polishes your videos, improving their overall quality.',
        effectDescription: (effect) => `+${(effect * 100).toFixed(0)}% video quality on upload.`,
        effect: 0.1, // +10% quality per level
    },
    {
        id: 'manager',
        name: 'Channel Manager',
        level: 0,
        maxLevel: 3,
        cost: [3000, 10000, 25000],
        salary: [750, 2000, 5000], // per week
        description: 'Manages your community and posts, generating a steady stream of passive subscribers.',
        effectDescription: (effect) => `+${effect.toFixed(0)} passive subscribers per game tick.`,
        effect: 1, // +1 sub per tick per level
    }
];


// --- NEW TALENT TREE CONSTANTS ---

export const SUBSCRIBER_MILESTONES_FOR_TALENT_POINTS = [
    100, 500, 1000, 2500, 5000, 10000, 25000, 50000, 75000, 100000, 150000, 200000, 250000, 300000
];

export const TALENT_TREE_CONFIG: TalentBranch[] = [
    {
        id: 'creator',
        name: 'Creator',
        description: 'Focus on audience growth and engagement.',
        talents: [
            { id: 'CREATOR_1', name: 'Charismatic Presence', description: '+5% subscriber gain from all sources.', tier: 1 },
            { id: 'CREATOR_2', name: 'Community Builder', description: 'Community posts cost 5 less energy and generate 25% more subscribers.', prereq: 'CREATOR_1', tier: 2 },
            { id: 'CREATOR_3', name: 'Engaging Storyteller', description: '+5% base audience retention on all videos.', prereq: 'CREATOR_2', tier: 3 },
            { id: 'CREATOR_4', name: 'Streaming Star', description: 'Go Live costs 10 less energy and streams generate 20% more donations.', prereq: 'CREATOR_3', tier: 4 },
            { id: 'CREATOR_5', name: 'Loyal Following', description: 'Prevents subscriber loss from negative events and doubles positive subscriber gains.', prereq: 'CREATOR_4', tier: 5 },
        ]
    },
    {
        id: 'producer',
        name: 'Producer',
        description: 'Focus on video quality and virality.',
        talents: [
            { id: 'PRODUCER_1', name: 'SEO Basics', description: '+10% organic views per tick for all videos.', tier: 1 },
            { id: 'PRODUCER_2', name: 'Editing Whiz', description: 'Studio upgrades provide 10% more quality.', prereq: 'PRODUCER_1', tier: 2 },
            { id: 'PRODUCER_3', name: 'Trend Spotter', description: 'Videos on trending topics get an additional 2x view multiplier.', prereq: 'PRODUCER_2', tier: 3 },
            { id: 'PRODUCER_4', name: 'Viral Engineering', description: 'Gain 1 free Viral Boost. Boosts cost 15 less energy.', prereq: 'PRODUCER_3', tier: 4 },
            { id: 'PRODUCER_5', name: 'Algorithm Whisperer', description: 'Trending videos stay trending 50% longer.', prereq: 'PRODUCER_4', tier: 5 },
        ]
    },
    {
        id: 'entrepreneur',
        name: 'Entrepreneur',
        description: 'Focus on monetization and business opportunities.',
        talents: [
            { id: 'ENTREPRENEUR_1', name: 'Ad-Sense Optimizer', description: '+10% income from monetized videos.', tier: 1 },
            { id: 'ENTREPRENEUR_2', name: 'Smart Saver', description: 'Weekly expenses are reduced by 25%.', prereq: 'ENTREPRENEUR_1', tier: 2 },
            { id: 'ENTREPRENEUR_3', name: 'Shrewd Negotiator', description: 'Sponsorship offers are 20% higher.', prereq: 'ENTREPRENEUR_2', tier: 3 },
            { id: 'ENTREPRENEUR_4', name: 'Brand Magnet', description: 'Unlocks a new, more lucrative tier of sponsorships.', prereq: 'ENTREPRENEUR_3', tier: 4 },
            { id: 'ENTREPRENEUR_5', name: 'Merch Store', description: 'Passively generate income each week based on your subscriber count.', prereq: 'ENTREPRENEUR_4', tier: 5 },
        ]
    }
];

// --- NEW LIVE STREAM CONSTANTS ---
export const MAX_HYPE = 100;
export const STREAM_EVENT_BASE_CHANCE = 0.08; // Chance per second to trigger an event if none is active
export const STREAM_TROLL_BASE_CHANCE = 0.15; // Chance per second to spawn a troll message
export const STREAM_NORMAL_COMMENT_CHANCE = 0.5; // Chance per second to spawn a normal message

// Hype Meter Gains/Losses
export const HYPE_DECAY_RATE = 0.5; // Hype lost per second
export const HYPE_GAIN_SUCCESSFUL_BAN = 5;
export const HYPE_LOSS_WRONG_BAN = 10;
export const HYPE_GAIN_GOOD_ANSWER = 15;
export const HYPE_LOSS_BAD_ANSWER = 10;
export const HYPE_LOSS_MISSED_ANSWER = 15;
export const HYPE_GAIN_FIX_ISSUE = 20;
export const HYPE_LOSS_MISSED_FIX = 20;

// Viewer Gains/Losses
export const VIEWERS_LOSS_WRONG_BAN = 0.05; // 5% of viewers leave
export const VIEWERS_GAIN_GOOD_ANSWER = 0.10; // 10% new viewers
export const VIEWERS_LOSS_BAD_ANSWER = 0.08; // 8% leave
export const VIEWERS_LOSS_MISSED_FIX = 0.25; // 25% leave

// Hype Moment Rewards
export const HYPE_MOMENT_DONATION_BOOST = 150;
export const HYPE_MOMENT_SUBSCRIBER_BOOST = 25;

export const TROLL_MESSAGES = [
    "This is so boring.", "My grandma streams better than you.", "LOUD NOISES!!!!", "Anyone else falling asleep?", "FIRST! (not)",
    "Can you play something else?", "Sub for sub?? Check out my channel!", "Is your microphone from a cereal box?", "!! FREE V-BUCKS HERE -> fake.link !!",
    "zzzzzzzzzzz"
];

export const NORMAL_CHAT_MESSAGES = [
    "Hey! Love your content!", "This is awesome!", "How's your day going?", "Keep it up!", "Subscribed!", "lol", "Great stream!", "Pog",
    "Let's gooo!", "This is my favorite streamer!", "What's everyone's favorite part so far?", "Hi from Brazil!", "This is so cool."
];

export const STREAM_EVENTS_CONFIG: Omit<StreamEvent, 'id'>[] = [
    {
        type: 'QUESTION',
        title: "Audience Question!",
        description: "A viewer is asking a question. A good answer could bring in more viewers!",
        duration: 10,
        choices: [
            { text: "What inspired you to start YouTube?", isCorrect: true },
            { text: "Thanks for the question! Let's focus on the game.", isCorrect: false }
        ]
    },
    {
        type: 'QUESTION',
        title: "Viewer Poll!",
        description: "Your chat wants to know what you should do next. Choose wisely!",
        duration: 10,
        choices: [
            { text: "Let's do what the chat wants!", isCorrect: true },
            { text: "I think I know what's best for the stream.", isCorrect: false }
        ]
    },
     {
        type: 'TECHNICAL_ISSUE',
        title: "Stream is Lagging!",
        description: "Viewers are reporting that your stream is lagging badly. You need to fix it fast before everyone leaves!",
        duration: 8,
    },
    {
        type: 'RAID',
        title: "You're being raided!",
        description: "Popular streamer 'PixelPioneer' is raiding your channel with 500 viewers! Welcome them!",
        duration: 5, // This is just a notification
    },
];

// --- BIG UPDATE CONSTANTS ---

// Content Series
export const SERIES_MOMENTUM_BONUS = 0.1; // 10% view bonus per consecutive video in a series

// Dynamic Algorithm
export const ALGORITHM_REDISCOVERY_CHANCE = 0.005; // 0.5% chance per tick for an old video to go viral
export const REDISCOVERY_MULTIPLIER = 4;
export const REDISCOVERY_DURATION_MS = 3 * 60 * 1000; // 3 minutes

// Rival Channels
export const NUMBER_OF_RIVALS = 3;
export const RIVAL_UPDATE_CHANCE = 0.4; // 40% chance per tick for a rival to "upload"

// Channel Niche
export const CHANNEL_NICHES_CONFIG: ChannelNiche[] = [
    { id: 'gaming_wholesome', name: 'Wholesome Gaming', description: 'Focus on family-friendly and cooperative games.', bonus: '+10% subscribers from Gaming videos.' },
    { id: 'gaming_pro', name: 'Pro-Gamer & Esports', description: 'Highlight high-skill gameplay, speedruns, and competitive matches.', bonus: '+20% views on Gaming videos, but -5% on other categories.' },
    { id: 'vlog_lifestyle', name: 'Lifestyle & Travel', description: 'Showcase daily life, travel adventures, and personal stories.', bonus: '+15% income from Vlog sponsorships.' },
    { id: 'tutorial_indepth', name: 'In-Depth Tutorials', description: 'Create long, detailed tutorials that are highly educational.', bonus: '+10% base Audience Retention for all videos.' },
    { id: 'comedy_skits', name: 'Sketch Comedy', description: 'Produce short, scripted comedy skits and parodies.', bonus: 'Viral Boosts are 20% more effective.' },
    { id: 'tech_reviews', name: 'Cutting-Edge Tech', description: 'Review the latest gadgets and explain complex technology.', bonus: '+25% income from Tech Review videos.' },
];

// The "Streamy" Awards
export const TICKS_PER_YEAR = 840; // 2 ticks/sec * 420 sec/week * 1 week/year = 840 ticks = 28 minutes
export const AWARDS_CONFIG: Omit<Award, 'nominees' | 'winner'>[] = [
    { id: 'creator_of_year', name: 'Creator of the Year', description: 'Awarded to the channel with the most subscribers.' },
    { id: 'video_of_year', name: 'Video of the Year', description: 'Awarded to the single video with the highest virality score.' },
    { id: 'gaming_channel', name: 'Best Gaming Channel', description: 'Awarded to the channel with the most total views on Gaming videos.' },
    { id: 'vlog_channel', name: 'Best Vlog Channel', description: 'Awarded to the channel with the most total views on Vlog videos.' },
];
export const PRESTIGE_PER_AWARD = 10;