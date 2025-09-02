import React, { useState } from 'react';
import { VIDEO_CATEGORIES, UPLOAD_VIDEO_COST } from '../constants';
import { VideoCategory, TrendingTopic } from '../types';
import { XIcon } from './icons/XIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { ImagePlusIcon } from './icons/ImagePlusIcon';

interface UploadModalProps {
  onClose: () => void;
  onUpload: (title: string, category: VideoCategory, description: string, seriesName?: string, useViralBoost?: boolean, thumbnailData?: string, thumbnailPrompt?: string) => void;
  onGenerateIdeas: (category: VideoCategory) => Promise<{title: string, description: string}[]>;
  onGenerateThumbnail: (prompt: string) => Promise<string>;
  viralBoostsAvailable: number;
  currentEnergy: number;
  viralBoostCost: number;
  trendingTopics: TrendingTopic[];
}

interface GeneratedIdea {
    title: string;
    description: string;
}

export const UploadModal: React.FC<UploadModalProps> = ({ onClose, onUpload, onGenerateIdeas, onGenerateThumbnail, viralBoostsAvailable, currentEnergy, viralBoostCost, trendingTopics }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<VideoCategory>(VIDEO_CATEGORIES[0]);
  const [seriesName, setSeriesName] = useState('');
  const [error, setError] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedIdeas, setGeneratedIdeas] = useState<GeneratedIdea[]>([]);

  const [thumbnailPrompt, setThumbnailPrompt] = useState('');
  const [thumbnailData, setThumbnailData] = useState<string | null>(null);
  const [isGeneratingThumbnail, setIsGeneratingThumbnail] = useState(false);

  const canUpload = currentEnergy >= UPLOAD_VIDEO_COST;
  const canViralBoost = currentEnergy >= viralBoostCost && viralBoostsAvailable > 0;

  const handleUploadAttempt = (useBoost = false) => {
    if (title.trim().length < 3) { setError('Title must be at least 3 characters long.'); return; }
    if (description.trim().length < 10) { setError('Description must be at least 10 characters long.'); return; }
    setError('');
    onUpload(title, category, description, seriesName, useBoost, thumbnailData || undefined, thumbnailPrompt || undefined);
  };

  const handleGenerateIdeas = async () => {
    setIsGenerating(true); setGeneratedIdeas([]); const ideas = await onGenerateIdeas(category);
    setGeneratedIdeas(ideas); setIsGenerating(false);
  }

  const handleGenerateThumbnail = async () => {
    if (thumbnailPrompt.trim().length < 10) return;
    setIsGeneratingThumbnail(true); setThumbnailData(null);
    const imageData = await onGenerateThumbnail(thumbnailPrompt);
    if (imageData) { setThumbnailData(`data:image/png;base64,${imageData}`); }
    setIsGeneratingThumbnail(false);
  };

  const selectIdea = (idea: GeneratedIdea) => { setTitle(idea.title); setDescription(idea.description); setGeneratedIdeas([]); }
  
  const isCategoryTrending = trendingTopics.some(t => t.category === category);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-lg p-6 relative border border-gray-700 flex flex-col max-h-[95vh]">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"> <XIcon /> </button>
        <h2 className="text-2xl font-bold mb-6 text-white text-center">Upload New Video</h2>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4 overflow-y-auto pr-2">
           <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">
              Category {isCategoryTrending && <span className="ml-2 text-xs font-bold text-red-400 bg-red-500/20 px-2 py-1 rounded-full">🔥 TRENDING</span>}
            </label>
            <select id="category" value={category} onChange={(e) => setCategory(e.target.value as VideoCategory)} className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-red-500 focus:border-red-500 transition">
              {VIDEO_CATEGORIES.map(cat => (<option key={cat} value={cat}>{cat}</option>))}
            </select>
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
                 <label htmlFor="title" className="block text-sm font-medium text-gray-300">Video Title</label>
                <button type="button" onClick={handleGenerateIdeas} disabled={isGenerating} className="flex items-center gap-1.5 text-sm text-purple-400 hover:text-purple-300 disabled:text-gray-500 disabled:cursor-wait transition-colors">
                    <SparklesIcon className="w-4 h-4" />
                    {isGenerating ? "Generating..." : "Get AI Ideas"}
                </button>
            </div>
            <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-red-500 focus:border-red-500 transition" placeholder="e.g., My First Gaming Video" maxLength={100} />
          </div>

          {generatedIdeas.length > 0 && (
            <div className="space-y-2 border-t border-b border-gray-700 py-3">
                <p className="text-sm text-gray-400">Click an idea to use it:</p>
                {generatedIdeas.map((idea, index) => (
                    <div key={index} onClick={() => selectIdea(idea)} className="p-3 bg-gray-900/50 hover:bg-gray-700 rounded-md cursor-pointer transition-colors">
                        <p className="font-semibold text-white">{idea.title}</p>
                        <p className="text-sm text-gray-400 mt-1">{idea.description}</p>
                    </div>
                ))}
            </div>
          )}

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-red-500 focus:border-red-500 transition" placeholder="A short description of your video..." rows={3} maxLength={500}/>
          </div>

          <div>
            <label htmlFor="series" className="block text-sm font-medium text-gray-300 mb-2">Series Name (Optional)</label>
            <input type="text" id="series" value={seriesName} onChange={(e) => setSeriesName(e.target.value)} className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-red-500 focus:border-red-500 transition" placeholder="e.g., Minecraft Survival Let's Play" maxLength={50} />
          </div>
         
          <div>
             <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-300 mb-2">AI Thumbnail (Optional)</label>
             <div className="flex gap-2">
                <input type="text" id="thumbnail" value={thumbnailPrompt} onChange={(e) => setThumbnailPrompt(e.target.value)} className="flex-1 w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" placeholder="A robot riding a skateboard..."/>
                <button type="button" onClick={handleGenerateThumbnail} disabled={isGeneratingThumbnail || thumbnailPrompt.length < 10} className="flex items-center gap-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-all duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed">
                    <ImagePlusIcon /> {isGeneratingThumbnail ? "..." : "Generate"}
                </button>
             </div>
             {isGeneratingThumbnail && <p className="text-sm text-center text-blue-300 mt-2 animate-pulse">Generating your thumbnail...</p>}
             {thumbnailData && <img src={thumbnailData} alt="Generated thumbnail" className="mt-3 rounded-lg w-full aspect-video object-cover border border-gray-600" />}
          </div>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          <div className="pt-4 space-y-3 flex-shrink-0">
            <button type="button" onClick={() => handleUploadAttempt(false)} disabled={!canUpload} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg shadow-md transition-transform duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
              Start Upload (-{UPLOAD_VIDEO_COST} Energy)
            </button>
            <button type="button" onClick={() => handleUploadAttempt(true)} disabled={!canViralBoost} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none">
              Go Viral INSTANTLY 🔥 ({viralBoostsAvailable} left) (-{viralBoostCost} Energy)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
