import React, { useState } from 'react';
import { VIDEO_CATEGORIES, UPLOAD_SHORT_COST } from '../constants';
import { VideoCategory } from '../types';
import { XIcon } from './icons/XIcon';

interface UploadShortModalProps {
  onClose: () => void;
  onUpload: (title: string, category: VideoCategory) => void;
  currentEnergy: number;
}

export const UploadShortModal: React.FC<UploadShortModalProps> = ({ onClose, onUpload, currentEnergy }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<VideoCategory>(VIDEO_CATEGORIES[0]);
  const [error, setError] = useState('');
  
  const canUpload = currentEnergy >= UPLOAD_SHORT_COST;

  const handleUpload = () => {
    if (title.trim().length < 3) {
      setError('Title must be at least 3 characters long.');
      return;
    }
    setError('');
    onUpload(title, category);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6 relative border border-gray-700">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
          <XIcon />
        </button>
        <h2 className="text-2xl font-bold mb-6 text-white text-center">Create a Short</h2>
        <form onSubmit={(e) => { e.preventDefault(); handleUpload(); }} className="space-y-4">
           <div>
            <label htmlFor="short-category" className="block text-sm font-medium text-gray-300 mb-2">
              Category
            </label>
            <select
              id="short-category"
              value={category}
              onChange={(e) => setCategory(e.target.value as VideoCategory)}
              className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
            >
              {VIDEO_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="short-title" className="block text-sm font-medium text-gray-300 mb-2">
                Short Title
            </label>
            <input
              type="text"
              id="short-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
              placeholder="e.g., Coolest Trick Shot!"
              maxLength={100}
            />
          </div>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          <div className="pt-4">
            <button
              type="submit"
              disabled={!canUpload}
              className="w-full bg-gray-200 hover:bg-white text-gray-800 font-bold py-3 px-4 rounded-lg shadow-md transition-transform duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              Upload Short (-{UPLOAD_SHORT_COST} Energy)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};