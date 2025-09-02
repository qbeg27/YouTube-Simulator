import React from 'react';
import type { Video } from '../types';
import { PlayIcon } from './icons/PlayIcon';
import { ThumbsUpIcon } from './icons/ThumbsUpIcon';
import { ChartBarIcon } from './icons/ChartBarIcon';
import { FilmShortIcon } from './icons/FilmShortIcon';

interface VideoCardProps {
  video: Video;
  onVideoClick: (video: Video) => void;
}

const StatItem: React.FC<{icon: React.ReactNode, value: string}> = ({ icon, value }) => (
    <div className="flex items-center gap-1.5 text-gray-400 text-sm">
        {icon}
        <span>{value}</span>
    </div>
);

export const VideoCard: React.FC<VideoCardProps> = ({ video, onVideoClick }) => {
  const timeSinceUpload = (): string => {
    const seconds = Math.floor((new Date().getTime() - video.uploadedAt.getTime()) / 1000);
    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    return `${days} days ago`;
  }
  
  const isShort = video.type === 'short';

  return (
    <div 
      className={`bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-red-500/20 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group ${video.isTrending ? 'border-2 border-red-500 shadow-red-500/40 animate-pulse' : 'border-2 border-transparent hover:border-red-500'}`}
      onClick={() => onVideoClick(video)}
    >
      <div className="relative">
        <img src={video.thumbnailUrl} alt={video.title} className={`w-full ${isShort ? 'h-56' : 'h-40'} object-cover`} />
        {video.isTrending && (
            <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md shadow-lg">
                🔥 TRENDING
            </div>
        )}
        {isShort && (
            <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-md shadow-lg flex items-center gap-1.5">
                <FilmShortIcon className="w-3 h-3"/>
                Short
            </div>
        )}
      </div>
      <div className="p-4">
        <span className="inline-block bg-red-500/20 text-red-400 text-xs font-semibold px-2 py-1 rounded-full mb-2">
            {video.category}
        </span>
        <h3 className="font-bold text-lg text-white truncate group-hover:text-red-400 transition-colors" title={video.title}>{video.title}</h3>
        <p className="text-sm text-gray-500 mb-4">{timeSinceUpload()}</p>
        
        <div className="flex flex-wrap gap-x-4 gap-y-2">
            <StatItem icon={<PlayIcon className="w-4 h-4" />} value={video.views.toLocaleString()} />
            <StatItem icon={<ThumbsUpIcon className="w-4 h-4" />} value={video.likes.toLocaleString()} />
            <StatItem icon={<ChartBarIcon className="w-4 h-4" />} value={`${video.watchHours.toFixed(1)} hrs`} />
        </div>
      </div>
    </div>
  );
};