import React, { useState } from 'react';
import { XIcon } from './icons/XIcon';
import { COMMUNITY_POST_COST } from '../constants';

interface CommunityPostModalProps {
  onClose: () => void;
  onPost: (text: string) => void;
  currentEnergy: number;
  postCost: number;
}

export const CommunityPostModal: React.FC<CommunityPostModalProps> = ({ onClose, onPost, currentEnergy, postCost }) => {
  const [text, setText] = useState('');
  const canPost = currentEnergy >= postCost && text.trim().length > 5;

  const handlePost = () => {
    if (canPost) {
      onPost(text);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6 relative border border-gray-700">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
          <XIcon />
        </button>
        <h2 className="text-2xl font-bold mb-4 text-white">Create Community Post</h2>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full h-40 bg-gray-900 border border-gray-600 rounded-md p-3 text-white focus:ring-2 focus:ring-blue-500 resize-none"
          placeholder="What's on your mind?"
          maxLength={500}
        />
        <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-gray-400">Cost: {postCost} Energy</p>
            <button
                onClick={handlePost}
                disabled={!canPost}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-2 px-6 rounded-lg transition-colors"
            >
                Post
            </button>
        </div>
      </div>
    </div>
  );
};
