import React, { useState } from 'react';
import type { ChannelBrand } from '../types';
import { CHANNEL_NICHES_CONFIG } from '../constants';
import { PaintBrushIcon } from './icons/PaintBrushIcon';
import { SparklesIcon } from './icons/SparklesIcon';

interface ChannelTabProps {
  channelBrand: ChannelBrand | null;
  onSetNiche: (nicheId: string) => void;
  onGenerateBanner: (prompt: string) => Promise<void>;
}

export const ChannelTab: React.FC<ChannelTabProps> = ({ channelBrand, onSetNiche, onGenerateBanner }) => {
  const [bannerPrompt, setBannerPrompt] = useState(channelBrand?.bannerPrompt || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const selectedNicheId = channelBrand?.nicheId || '';

  const handleGenerateClick = async () => {
    if (bannerPrompt.trim().length < 10) return;
    setIsGenerating(true);
    await onGenerateBanner(bannerPrompt);
    setIsGenerating(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <PaintBrushIcon className="w-10 h-10 text-purple-400" />
        <div>
          <h2 className="text-3xl font-bold text-white">Channel Branding</h2>
          <p className="text-gray-400 max-w-2xl">Define your channel's identity to unlock unique bonuses and stand out from the crowd.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Niche Selection */}
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h3 className="text-2xl font-semibold text-white mb-4">Channel Niche</h3>
          <p className="text-gray-400 mb-6">Select a niche to specialize your content. This choice will provide passive bonuses that align with your strategy.</p>
          <div className="space-y-3">
            {CHANNEL_NICHES_CONFIG.map(niche => (
              <button
                key={niche.id}
                onClick={() => onSetNiche(niche.id)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${selectedNicheId === niche.id ? 'bg-purple-500/20 border-purple-500' : 'bg-gray-900/50 border-gray-700 hover:border-purple-600'}`}
              >
                <h4 className="font-bold text-lg text-white">{niche.name}</h4>
                <p className="text-sm text-gray-300 mt-1">{niche.description}</p>
                <p className="text-sm font-semibold text-purple-300 mt-2">Bonus: {niche.bonus}</p>
              </button>
            ))}
          </div>
        </div>

        {/* AI Banner Generation */}
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 flex flex-col">
          <h3 className="text-2xl font-semibold text-white mb-4">AI Channel Banner</h3>
          <p className="text-gray-400 mb-6">Describe the banner you want for your channel, and our AI will generate it for you!</p>
          
          <div className="mt-auto space-y-4">
            <textarea
              value={bannerPrompt}
              onChange={(e) => setBannerPrompt(e.target.value)}
              className="w-full h-24 bg-gray-900 border border-gray-600 rounded-md p-3 text-white focus:ring-2 focus:ring-purple-500 resize-none"
              placeholder="e.g., A futuristic cityscape at night with neon lights..."
              maxLength={200}
              disabled={isGenerating}
            />
            <button
              onClick={handleGenerateClick}
              disabled={isGenerating || bannerPrompt.trim().length < 10}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition-colors disabled:bg-gray-600 disabled:cursor-wait"
            >
              <SparklesIcon />
              {isGenerating ? 'Generating Banner...' : 'Generate Banner'}
            </button>
            
            <div className="w-full aspect-video bg-gray-900 rounded-lg overflow-hidden border border-gray-600">
              {channelBrand?.bannerUrl ? (
                <img src={channelBrand.bannerUrl} alt="Generated channel banner" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">Banner Preview</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
