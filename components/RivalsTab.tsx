import React from 'react';
import type { RivalChannel } from '../types';
import { MegaphoneIcon } from './icons/MegaphoneIcon';
import { UsersIcon } from './icons/UsersIcon';

interface RivalsTabProps {
  rivals: RivalChannel[];
}

const RivalCard: React.FC<{ rival: RivalChannel }> = ({ rival }) => {
  return (
    <div className="bg-gray-800 p-5 rounded-lg border border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white">{rival.name}</h3>
          <p className="text-sm text-purple-300">{rival.theme}</p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2 text-lg font-bold text-red-400">
            <UsersIcon className="w-5 h-5" />
            <span>{rival.subscribers.toLocaleString()}</span>
          </div>
          <p className="text-xs text-gray-500">Subscribers</p>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-700">
        <p className="text-sm text-gray-400">Latest Activity:</p>
        <p className="text-md text-gray-200 truncate">"{rival.latestVideoTitle}"</p>
      </div>
    </div>
  );
};

export const RivalsTab: React.FC<RivalsTabProps> = ({ rivals }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <MegaphoneIcon className="w-10 h-10 text-red-400" />
        <div>
          <h2 className="text-3xl font-bold text-white">Rival Channels</h2>
          <p className="text-gray-400 max-w-2xl">You're not the only one trying to make it big. Keep an eye on your competition!</p>
        </div>
      </div>
      
      {rivals.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {rivals.map(rival => (
            <RivalCard key={rival.id} rival={rival} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-800 rounded-lg border border-dashed border-gray-700">
            <h3 className="text-xl font-semibold text-gray-400 animate-pulse">Scouting for rival channels...</h3>
        </div>
      )}
    </div>
  );
};
