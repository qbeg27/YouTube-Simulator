import React from 'react';
import { TrendingUpIcon } from './icons/TrendingUpIcon';
import type { TrendingTopic } from '../types';

interface TrendingTopicsTickerProps {
  topics: TrendingTopic[];
}

export const TrendingTopicsTicker: React.FC<TrendingTopicsTickerProps> = ({ topics }) => {
  if (topics.length === 0) {
    return (
        <div className="bg-gray-900/50 text-sm w-full whitespace-nowrap py-2 border-y border-gray-700 flex items-center justify-center">
            <p className="text-gray-500">Waiting for new trends...</p>
        </div>
    );
  }

  const topicText = topics.map(t => `🔥 ${t.category}: ${t.topic}`).join(' • ');

  return (
    <div className="bg-gray-900/50 text-sm w-full overflow-hidden whitespace-nowrap group">
        <div className="flex items-center animate-marquee group-hover:[animation-play-state:paused]">
            <span className="text-gray-300 font-semibold px-4 py-2">{topicText}</span>
            <span className="text-gray-300 font-semibold px-4 py-2" aria-hidden="true">{topicText}</span>
        </div>
        <style>{`
            @keyframes marquee {
                from { transform: translateX(0); }
                to { transform: translateX(-50%); }
            }
            .animate-marquee {
                animation: marquee 45s linear infinite;
            }
        `}</style>
    </div>
  );
};
