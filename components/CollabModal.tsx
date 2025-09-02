import React from 'react';
import type { Collaborator } from '../types';
import { XIcon } from './icons/XIcon';
import { UsersGroupIcon } from './icons/UsersGroupIcon';

interface CollabModalProps {
  onClose: () => void;
  onCollab: (collaborator: Collaborator) => void;
  options: Collaborator[];
  isLoading: boolean;
}

const CollaboratorCard: React.FC<{ collaborator: Collaborator, onSelect: () => void }> = ({ collaborator, onSelect }) => (
    <button onClick={onSelect} className="w-full text-left bg-gray-900/50 hover:bg-gray-700 p-4 rounded-lg border border-gray-700 hover:border-blue-500 transition-colors duration-200">
        <h4 className="font-bold text-lg text-white">{collaborator.name}</h4>
        <p className="text-sm text-gray-400 mb-2">{collaborator.theme}</p>
        <p className="text-md font-semibold text-blue-400">{collaborator.subscribers.toLocaleString()} Subscribers</p>
    </button>
);

export const CollabModal: React.FC<CollabModalProps> = ({ onClose, onCollab, options, isLoading }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-lg p-6 relative border border-gray-700">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
          <XIcon />
        </button>
        <div className="flex items-center gap-3 mb-6">
            <UsersGroupIcon className="w-8 h-8 text-blue-400" />
            <div>
                 <h2 className="text-2xl font-bold text-white">Collaborate with a Creator</h2>
                 <p className="text-sm text-gray-400">Team up to gain a burst of new subscribers!</p>
            </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-400 animate-pulse">Finding creators for you...</p>
          </div>
        ) : (
          <div className="space-y-3">
            {options.length > 0 ? (
                options.map((option, index) => (
                    <CollaboratorCard key={index} collaborator={option} onSelect={() => onCollab(option)} />
                ))
            ) : (
                <p className="text-center py-12 text-gray-500">Could not find any collaborators. Try again.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};