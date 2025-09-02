import React from 'react';
import type { Achievement } from '../types';
import { XIcon } from './icons/XIcon';
import { LockIcon } from './icons/LockIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { TrophyIcon } from './icons/TrophyIcon';


interface AchievementsModalProps {
  achievements: Achievement[];
  unlockedIds: Set<string>;
  onClose: () => void;
}

const AchievementItem: React.FC<{ achievement: Achievement; isUnlocked: boolean }> = ({ achievement, isUnlocked }) => {
    return (
        <div className={`p-4 flex items-center gap-4 rounded-lg transition-all ${isUnlocked ? 'bg-yellow-500/10 border-yellow-500' : 'bg-gray-900/50 border-gray-700'}`}>
            <div className={`flex-shrink-0 text-3xl ${isUnlocked ? 'text-yellow-400' : 'text-gray-500'}`}>
                {isUnlocked ? <CheckCircleIcon /> : <LockIcon />}
            </div>
            <div>
                <h4 className={`font-bold ${isUnlocked ? 'text-white' : 'text-gray-400'}`}>{achievement.name}</h4>
                <p className={`text-sm ${isUnlocked ? 'text-gray-300' : 'text-gray-500'}`}>{achievement.description}</p>
            </div>
        </div>
    );
};


export const AchievementsModal: React.FC<AchievementsModalProps> = ({ achievements, unlockedIds, onClose }) => {
  const unlockedCount = unlockedIds.size;
  const totalCount = achievements.length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[70] p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl border border-gray-700 flex flex-col max-h-[90vh]">
        <div className="flex-shrink-0 p-6 border-b border-gray-700 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <TrophyIcon className="w-8 h-8 text-yellow-400" />
            <div>
              <h2 className="text-2xl font-bold text-white">Achievements</h2>
              <p className="text-sm text-gray-400">{unlockedCount} / {totalCount} Unlocked</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <XIcon />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-3">
            {achievements.map(ach => (
                <AchievementItem 
                    key={ach.id}
                    achievement={ach}
                    isUnlocked={unlockedIds.has(ach.id)}
                />
            ))}
        </div>
      </div>
    </div>
  );
};
