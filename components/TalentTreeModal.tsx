import React from 'react';
import type { Talent, TalentBranch } from '../types';
import { XIcon } from './icons/XIcon';
import { BrainCircuitIcon } from './icons/BrainCircuitIcon';
import { LockIcon } from './icons/LockIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';

interface TalentTreeModalProps {
  tree: TalentBranch[];
  unlockedIds: Set<string>;
  talentPoints: number;
  onUnlock: (talentId: string) => void;
  onClose: () => void;
}

const TalentNode: React.FC<{
  talent: Talent;
  isUnlocked: boolean;
  canUnlock: boolean;
  onUnlock: () => void;
}> = ({ talent, isUnlocked, canUnlock, onUnlock }) => {
  const nodeStateClasses = {
    unlocked: 'bg-teal-500/20 border-teal-500 text-white',
    canUnlock: 'bg-gray-700/80 border-gray-600 hover:border-yellow-400 hover:bg-gray-700 cursor-pointer text-gray-300 hover:text-white',
    locked: 'bg-gray-900/50 border-gray-700 text-gray-500',
  };

  const state = isUnlocked ? 'unlocked' : canUnlock ? 'canUnlock' : 'locked';
  const Icon = isUnlocked ? CheckCircleIcon : LockIcon;

  return (
     <div className="relative group">
        <button
            onClick={onUnlock}
            disabled={!canUnlock}
            className={`w-full p-4 flex items-start gap-4 rounded-lg border transition-all duration-200 text-left ${nodeStateClasses[state]}`}
        >
            <div className={`flex-shrink-0 text-3xl mt-1 ${isUnlocked ? 'text-teal-400' : ''}`}>
                <Icon />
            </div>
            <div>
                <h4 className="font-bold text-lg">{talent.name}</h4>
                <p className="text-sm">{talent.description}</p>
            </div>
        </button>
        {canUnlock && <div className="absolute -top-3 -right-3 text-xs bg-yellow-500 text-black font-bold px-2 py-1 rounded-full shadow-lg">Unlock!</div>}
    </div>
  );
};

export const TalentTreeModal: React.FC<TalentTreeModalProps> = ({ tree, unlockedIds, talentPoints, onUnlock, onClose }) => {
  
  const isPrereqMet = (talent: Talent) => {
    if (!talent.prereq) return true; // Tier 1 talents have no prereq
    return unlockedIds.has(talent.prereq);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[70] p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-5xl border border-gray-700 flex flex-col max-h-[90vh]">
        <div className="flex-shrink-0 p-6 border-b border-gray-700 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <BrainCircuitIcon className="w-8 h-8 text-teal-400" />
            <div>
              <h2 className="text-2xl font-bold text-white">Talent Tree</h2>
              <p className="text-sm text-yellow-300 font-semibold">{talentPoints} Talent Point{talentPoints !== 1 && 's'} Available</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <XIcon />
          </button>
        </div>

        <div className="p-6 overflow-y-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {tree.map(branch => (
            <div key={branch.id} className="bg-gray-900/50 p-4 rounded-lg">
              <h3 className="text-xl font-bold text-center mb-1 text-teal-300">{branch.name}</h3>
              <p className="text-sm text-center text-gray-400 mb-4">{branch.description}</p>
              <div className="space-y-4">
                {branch.talents.map(talent => (
                  <TalentNode
                    key={talent.id}
                    talent={talent}
                    isUnlocked={unlockedIds.has(talent.id)}
                    canUnlock={!unlockedIds.has(talent.id) && isPrereqMet(talent) && talentPoints > 0}
                    onUnlock={() => onUnlock(talent.id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
