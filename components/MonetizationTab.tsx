
import React, { useMemo } from 'react';
import type { ChannelStats, Video } from '../types';
import { DollarSignIcon } from './icons/DollarSignIcon';
import { SPONSORSHIPS_CONFIG } from '../constants';

interface MonetizationTabProps {
  stats: ChannelStats;
  videos: Video[];
  completedSponsorshipsCount: number;
  unlockedTalentIds: Set<string>;
  totalMoneyEarned: number;
}

const StatDisplay: React.FC<{ label: string; value: string; }> = ({ label, value }) => (
    <div className="bg-gray-800 p-6 rounded-lg text-center">
        <div className="text-lg text-gray-400">{label}</div>
        <div className="text-4xl font-bold text-white">{value}</div>
    </div>
);

export const MonetizationTab: React.FC<MonetizationTabProps> = ({ stats, videos, completedSponsorshipsCount, unlockedTalentIds, totalMoneyEarned }) => {
    
    const totalViews = useMemo(() => videos.reduce((sum, v) => sum + v.views, 0), [videos]);
    const rpm = useMemo(() => (totalViews > 0 ? (totalMoneyEarned / totalViews) * 1000 : 0), [totalMoneyEarned, totalViews]);
    
    const hasMerch = unlockedTalentIds.has('ENTREPRENEUR_5');

    const topEarningVideos = useMemo(() => {
        // This is a simulation since we don't track per-video earnings. We'll estimate.
        // Higher watch hours + quality = more earnings.
        return videos
            .filter(v => v.watchHours > 0)
            .sort((a, b) => (b.watchHours * b.quality) - (a.watchHours * a.quality))
            .slice(0, 5);
    }, [videos]);

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white">Monetization</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatDisplay label="Lifetime Earnings" value={`$${totalMoneyEarned.toLocaleString('en-US', {minimumFractionDigits: 2})}`} />
                <StatDisplay label="Current Balance" value={`$${stats.money.toLocaleString('en-US', {minimumFractionDigits: 2})}`} />
                <StatDisplay label="Channel RPM" value={`$${rpm.toFixed(2)}`} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-800 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-white mb-4">Income Sources</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center bg-gray-900/50 p-3 rounded">
                            <span className="font-medium text-gray-300">Ad Revenue</span>
                            <span className="font-bold text-green-400">Active</span>
                        </div>
                         <div className="flex justify-between items-center bg-gray-900/50 p-3 rounded">
                            <span className="font-medium text-gray-300">Sponsorships</span>
                            <span className="font-bold text-blue-400">{completedSponsorshipsCount} Completed</span>
                        </div>
                         <div className="flex justify-between items-center bg-gray-900/50 p-3 rounded">
                            <span className="font-medium text-gray-300">Merch Store</span>
                            <span className={`font-bold ${hasMerch ? 'text-purple-400' : 'text-gray-500'}`}>{hasMerch ? 'Active' : 'Locked'}</span>
                        </div>
                    </div>
                </div>
                 <div className="bg-gray-800 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-white mb-4">Top Earning Videos (Est.)</h3>
                    {topEarningVideos.length > 0 ? (
                        <ul className="space-y-2">
                        {topEarningVideos.map(video => (
                            <li key={video.id} className="bg-gray-900/50 p-3 rounded flex justify-between items-center">
                                <span className="text-white truncate pr-4">{video.title}</span>
                                <span className="text-sm text-gray-400">{video.watchHours.toFixed(1)} watch hrs</span>
                            </li>
                        ))}
                    </ul>
                    ) : (
                        <p className="text-center text-gray-500 pt-8">No monetized videos yet.</p>
                    )}
                    
                </div>
            </div>
        </div>
    );
};
