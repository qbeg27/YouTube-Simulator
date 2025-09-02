import React from 'react';
import type { Award } from '../types';
import { XIcon } from './icons/XIcon';
import { CrownIcon } from './icons/CrownIcon';

interface AwardShowModalProps {
  awards: Award[];
  playerName: string;
  onClose: () => void;
}

const AwardCategory: React.FC<{ award: Award, playerName: string }> = ({ award, playerName }) => {
  const isPlayerWinner = award.winner.name === playerName;
  return (
    <div className={`p-4 rounded-lg border-2 ${isPlayerWinner ? 'bg-yellow-500/10 border-yellow-500' : 'bg-gray-900/50 border-gray-700'}`}>
      <h3 className="text-xl font-bold text-white">{award.name}</h3>
      <p className="text-sm text-gray-400 mb-3">{award.description}</p>
      
      <div className="space-y-2">
        {award.nominees.slice(0, 3).map((nominee, index) => (
          <div key={nominee.name + index} className={`flex justify-between items-center p-2 rounded ${nominee.name === award.winner.name ? 'bg-gray-700' : ''}`}>
            <span className={`font-semibold ${nominee.name === award.winner.name ? 'text-yellow-300' : 'text-gray-300'}`}>{nominee.name}</span>
            <span className="text-sm text-gray-400">{nominee.value.toLocaleString()}</span>
          </div>
        ))}
      </div>

      <div className="mt-3 pt-3 border-t border-gray-600 flex items-center gap-2">
        <CrownIcon className="w-5 h-5 text-yellow-400" />
        <span className="font-bold text-white">Winner: {award.winner.name}</span>
      </div>
    </div>
  );
};

export const AwardShowModal: React.FC<AwardShowModalProps> = ({ awards, playerName, onClose }) => {
  const playerWinCount = awards.filter(a => a.winner.name === playerName).length;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[90] p-4 animate-fade-in">
      <div className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-3xl border border-yellow-500 flex flex-col max-h-[90vh]">
        <div className="flex-shrink-0 p-6 border-b border-gray-700 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <CrownIcon className="w-10 h-10 text-yellow-400" />
            <div>
              <h2 className="text-3xl font-bold text-white">The Annual Streamy Awards</h2>
              <p className="text-gray-300">Celebrating the best creators of the year!</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <XIcon />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4">
            {playerWinCount > 0 && (
                <div className="bg-green-500/10 border border-green-500 p-4 rounded-lg text-center mb-4">
                    <h3 className="text-xl font-bold text-green-300">Congratulations!</h3>
                    <p className="text-gray-200">You won {playerWinCount} award{playerWinCount > 1 ? 's' : ''} this year!</p>
                </div>
            )}
            {awards.map(award => (
                <AwardCategory key={award.id} award={award} playerName={playerName} />
            ))}
        </div>

        <div className="flex-shrink-0 p-4 bg-gray-900/50 border-t border-gray-700">
             <button onClick={onClose} className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-4 rounded-lg">
                Continue
             </button>
        </div>
      </div>
    </div>
  );
};
