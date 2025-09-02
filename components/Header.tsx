
import React from 'react';
import { UploadIcon } from './icons/UploadIcon';
import { BroadcastIcon } from './icons/BroadcastIcon';
import { UsersGroupIcon } from './icons/UsersGroupIcon';
import { FilmShortIcon } from './icons/FilmShortIcon';
import { CogIcon } from './icons/CogIcon';
import { UPLOAD_VIDEO_COST, UPLOAD_SHORT_COST, COLLAB_COST } from '../constants';
import { ChannelStats, TrendingTopic, ChannelBrand } from '../types';
import { TrendingTopicsTicker } from './TrendingTopicsTicker';

interface HeaderProps {
  onUploadClick: () => void;
  onShortClick: () => void;
  onGoLiveClick: () => void;
  onCollabClick: () => void;
  onAdminClick: () => void;
  stats: ChannelStats;
  goLiveCost: number;
  collabCooldown: number;
  trendingTopics: TrendingTopic[];
  channelBrand: ChannelBrand | null;
  isSuspended: boolean;
}

const formatCooldown = (ms: number) => {
    const totalSeconds = Math.ceil(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}


export const Header: React.FC<HeaderProps> = ({ onUploadClick, onShortClick, onGoLiveClick, onCollabClick, onAdminClick, stats, goLiveCost, collabCooldown, trendingTopics, channelBrand, isSuspended }) => {
  const canUpload = stats.creativeEnergy >= UPLOAD_VIDEO_COST && !isSuspended;
  const canShort = stats.creativeEnergy >= UPLOAD_SHORT_COST && !isSuspended;
  const canGoLive = stats.creativeEnergy >= goLiveCost && !isSuspended;
  const canCollab = stats.creativeEnergy >= COLLAB_COST && collabCooldown <= 0 && !isSuspended;
  const collabTooltip = collabCooldown > 0 ? `On Cooldown: ${formatCooldown(collabCooldown)}` : `Cost: ${COLLAB_COST} Energy`;

  const headerStyle = {
    backgroundImage: channelBrand?.bannerUrl ? `linear-gradient(rgba(31, 41, 55, 0.7), rgba(31, 41, 55, 1)), url(${channelBrand.bannerUrl})` : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  return (
    <header className="flex-shrink-0 bg-gray-800/50 backdrop-blur-sm border-b border-gray-700" style={headerStyle}>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-wider">
            <span className="text-red-500">You</span>Tube Simulator
          </h1>
          <div className="flex items-center gap-3">
              <button
                onClick={onGoLiveClick}
                disabled={!canGoLive}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-md transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed disabled:transform-none"
                title={`Cost: ${goLiveCost} Energy`}
              >
                <BroadcastIcon />
                <span className="hidden sm:inline">Go Live</span>
              </button>
               <button
                onClick={onCollabClick}
                disabled={!canCollab}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed disabled:transform-none"
                title={collabTooltip}
              >
                <UsersGroupIcon />
                <span className="hidden sm:inline">Collaborate</span>
              </button>
               <button
                onClick={onShortClick}
                disabled={!canShort}
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-white text-gray-800 font-semibold rounded-lg shadow-md transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed disabled:transform-none"
                title={`Cost: ${UPLOAD_SHORT_COST} Energy`}
              >
                <FilmShortIcon />
                <span className="hidden sm:inline">Create Short</span>
              </button>
              <button
                onClick={onUploadClick}
                disabled={!canUpload}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed disabled:transform-none"
                title={`Cost: ${UPLOAD_VIDEO_COST} Energy`}
              >
                <UploadIcon />
                <span className="hidden md:inline">Upload Video</span>
              </button>
              <button
                onClick={onAdminClick}
                className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white font-semibold rounded-lg shadow-md transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                title="Open Admin Panel"
                >
                <CogIcon className="w-5 h-5" />
                </button>
          </div>
        </div>
      </div>
      <TrendingTopicsTicker topics={trendingTopics} />
    </header>
  );
};
