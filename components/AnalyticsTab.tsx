
import React, { useMemo } from 'react';
import type { ChannelStats, Video, VideoCategory } from '../types';
import { VIDEO_CATEGORIES } from '../constants';

interface AnalyticsTabProps {
  statsHistory: ChannelStats[];
  videos: Video[];
}

const ChartContainer: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-gray-800 p-6 rounded-lg">
        <h3 className="text-xl font-semibold text-white mb-4">{title}</h3>
        <div className="h-80">{children}</div>
    </div>
);

const LineChart: React.FC<{ data: { x: number, y: number }[]; color: string; yLabel: string }> = ({ data, color, yLabel }) => {
    if (data.length < 2) return <div className="h-full w-full flex items-center justify-center text-gray-500">Awaiting more data...</div>;
    
    const maxX = Math.max(...data.map(d => d.x));
    const minX = Math.min(...data.map(d => d.x));
    const maxY = Math.max(...data.map(d => d.y));
    const minY = Math.min(...data.map(d => d.y));
    const xRange = maxX - minX === 0 ? 1 : maxX - minX;
    const yRange = maxY - minY === 0 ? 1 : maxY - minY;

    const points = data.map(d => {
        const x = ((d.x - minX) / xRange) * 100;
        const y = 100 - ((d.y - minY) / yRange) * 90 - 5; // Padding
        return `${x},${y}`;
    }).join(' ');

    const yAxisLabels = [minY, minY + yRange/2, maxY];

    return (
        <div className="w-full h-full relative">
            <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
                <polyline fill="none" stroke={color} strokeWidth="0.5" points={points} />
            </svg>
            <div className="absolute top-0 left-[-40px] h-full flex flex-col justify-between text-xs text-gray-400 py-2">
                {yAxisLabels.map(label => <span key={label}>{Math.round(label).toLocaleString()}</span>)}
            </div>
             <div className="absolute -left-12 top-1/2 -translate-y-1/2 -rotate-90 text-sm text-gray-500">{yLabel}</div>
        </div>
    );
};

const BarChart: React.FC<{data: { label: string, value: number }[]}> = ({ data }) => {
    const maxValue = Math.max(...data.map(d => d.value));
    const colors = ['#ef4444', '#3b82f6', '#8b5cf6', '#14b8a6', '#f97316', '#eab308'];

    return (
        <div className="w-full h-full flex items-end gap-4 px-4 border-l border-b border-gray-700">
            {data.map((d, i) => (
                <div key={d.label} className="flex-1 flex flex-col items-center gap-2">
                     <span className="text-sm font-bold text-white">{d.value.toLocaleString()}</span>
                    <div 
                        className="w-full rounded-t-md transition-all duration-500"
                        style={{ height: `${(d.value / (maxValue || 1)) * 100}%`, backgroundColor: colors[i % colors.length] }}
                    ></div>
                    <span className="text-xs text-gray-400">{d.label}</span>
                </div>
            ))}
        </div>
    );
}

export const AnalyticsTab: React.FC<AnalyticsTabProps> = ({ statsHistory, videos }) => {
    
    const subscriberData = useMemo(() => {
        return statsHistory.map((stats, i) => ({ x: i, y: stats.subscribers }));
    }, [statsHistory]);

    const viewsByCategory = useMemo(() => {
        const categoryMap: Record<VideoCategory, number> = {} as any;
        for (const cat of VIDEO_CATEGORIES) { categoryMap[cat] = 0; }
        videos.forEach(video => {
            if (categoryMap[video.category] !== undefined) {
                categoryMap[video.category] += video.views;
            }
        });
        return Object.entries(categoryMap).map(([label, value]) => ({ label: label as string, value }));
    }, [videos]);

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white">Channel Analytics</h2>
            
            <ChartContainer title="Subscriber Growth (Last 60 Ticks)">
                <LineChart data={subscriberData} color="#ef4444" yLabel="Subscribers" />
            </ChartContainer>

            <ChartContainer title="All-Time Views by Category">
                <BarChart data={viewsByCategory} />
            </ChartContainer>
        </div>
    );
};
