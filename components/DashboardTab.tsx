
import React, { useMemo } from 'react';
import type { ChannelStats, Video } from '../types';
import { TrendingUpIcon } from './icons/TrendingUpIcon';
import { UsersIcon } from './icons/UsersIcon';
import { DollarSignIcon } from './icons/DollarSignIcon';
import { PlayIcon } from './icons/PlayIcon';

interface DashboardTabProps {
  stats: ChannelStats;
  statsHistory: ChannelStats[];
  videos: Video[];
}

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string; change: string; changeColor: string; }> = ({ icon, label, value, change, changeColor }) => (
    <div className="bg-gray-800 p-4 rounded-lg flex items-start gap-4">
        <div className="text-2xl text-gray-400 mt-1">{icon}</div>
        <div className="flex-1">
            <div className="text-sm text-gray-400">{label}</div>
            <div className="text-2xl font-bold text-white">{value}</div>
            <div className={`text-sm font-semibold ${changeColor}`}>{change}</div>
        </div>
    </div>
);

const MiniLineChart: React.FC<{ data: number[]; color: string }> = ({ data, color }) => {
    if (data.length < 2) {
        return <div className="h-full flex items-center justify-center text-sm text-gray-500">Not enough data</div>;
    }
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min === 0 ? 1 : max - min;

    const points = data.map((d, i) => {
        const x = (i / (data.length - 1)) * 100;
        const y = 100 - ((d - min) / range) * 100;
        return `${x},${y}`;
    }).join(' ');

    return (
        <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
            <polyline fill="none" stroke={color} strokeWidth="2" points={points} />
        </svg>
    );
};

export const DashboardTab: React.FC<DashboardTabProps> = ({ stats, statsHistory, videos }) => {
    
    const weeklyHistory = useMemo(() => statsHistory.slice(-210), [statsHistory]); // ~7 minutes of history
    
    const subChange = weeklyHistory.length > 1 ? weeklyHistory[weeklyHistory.length - 1].subscribers - weeklyHistory[0].subscribers : 0;
    const moneyChange = weeklyHistory.length > 1 ? weeklyHistory[weeklyHistory.length - 1].money - weeklyHistory[0].money : 0;
    const watchHoursChange = weeklyHistory.length > 1 ? weeklyHistory[weeklyHistory.length - 1].totalWatchHours - weeklyHistory[0].totalWatchHours : 0;

    const subData = useMemo(() => weeklyHistory.map(s => s.subscribers), [weeklyHistory]);
    const topVideos = useMemo(() => videos.slice().sort((a,b) => b.views - a.views).slice(0, 3), [videos]);

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white">Channel Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <StatCard 
                    icon={<UsersIcon/>} 
                    label="Subscribers" 
                    value={stats.subscribers.toLocaleString()} 
                    change={`${subChange >= 0 ? '+' : ''}${subChange.toLocaleString()} in last 7 mins`} 
                    changeColor={subChange >= 0 ? 'text-green-400' : 'text-red-400'}
                />
                <StatCard 
                    icon={<PlayIcon/>} 
                    label="Watch Hours" 
                    value={stats.totalWatchHours.toLocaleString(undefined, {maximumFractionDigits: 0})} 
                    change={`${watchHoursChange >= 0 ? '+' : ''}${watchHoursChange.toLocaleString(undefined, {maximumFractionDigits: 0})} in last 7 mins`}
                    changeColor={watchHoursChange >= 0 ? 'text-green-400' : 'text-red-400'}
                />
                <StatCard 
                    icon={<DollarSignIcon/>} 
                    label="Est. Revenue" 
                    value={`$${stats.money.toLocaleString('en-US', {minimumFractionDigits: 2})}`} 
                    change={`$${moneyChange.toLocaleString('en-US', {minimumFractionDigits: 2, signDisplay: 'always'})} in last 7 mins`} 
                    changeColor={moneyChange >= 0 ? 'text-green-400' : 'text-red-400'}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-gray-800 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-white mb-4">Subscriber Trend</h3>
                    <div className="h-64">
                         <MiniLineChart data={subData} color="#ef4444" />
                    </div>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg">
                     <h3 className="text-lg font-semibold text-white mb-4">Top Videos (All Time)</h3>
                     <div className="space-y-4">
                        {topVideos.length > 0 ? topVideos.map(video => (
                            <div key={video.id} className="flex items-center gap-4">
                                <img src={video.thumbnailUrl} alt={video.title} className="w-24 h-14 object-cover rounded" />
                                <div className="flex-1">
                                    <p className="text-white font-semibold truncate">{video.title}</p>
                                    <p className="text-sm text-gray-400">{video.views.toLocaleString()} views</p>
                                </div>
                            </div>
                        )) : <p className="text-gray-500 text-center pt-8">Upload videos to see your top performers here.</p>}
                     </div>
                </div>
            </div>
        </div>
    );
};
