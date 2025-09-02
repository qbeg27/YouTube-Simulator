import React, { useState, useMemo } from 'react';
import type { Video, Comment } from '../types';
import { XIcon } from './icons/XIcon';
import { PlayIcon } from './icons/PlayIcon';
import { ThumbsUpIcon } from './icons/ThumbsUpIcon';
import { ChartBarIcon } from './icons/ChartBarIcon';
import { BrainCircuitIcon } from './icons/BrainCircuitIcon';

interface VideoDetailModalProps {
  video: Video;
  onClose: () => void;
}

const DetailStat: React.FC<{ icon: React.ReactNode; label: string; value: string; }> = ({ icon, label, value }) => (
    <div className="flex items-center gap-3 bg-gray-900/50 p-3 rounded-lg">
        <div className="text-red-400 text-2xl">{icon}</div>
        <div>
            <div className="text-sm text-gray-400">{label}</div>
            <div className="text-lg font-bold text-white">{value}</div>
        </div>
    </div>
);

const CommentItem: React.FC<{ comment: Comment }> = ({ comment }) => (
    <div className="flex items-start gap-3 p-3 border-b border-gray-700">
        <div className="w-10 h-10 rounded-full bg-gray-600 flex-shrink-0"></div>
        <div>
            <p className="font-semibold text-sm text-gray-300">{comment.username}</p>
            <p className="text-white">{comment.text}</p>
        </div>
    </div>
);

type Tab = 'Details' | 'Analytics' | 'Advanced Analytics' | 'Comments';

export const VideoDetailModal: React.FC<VideoDetailModalProps> = ({ video, onClose }) => {
    const [activeTab, setActiveTab] = useState<Tab>('Details');

    const viralityScore = useMemo(() => {
        const timeSinceUploadHours = Math.max(1, (new Date().getTime() - video.uploadedAt.getTime()) / (1000 * 60 * 60));
        const score = (video.views / timeSinceUploadHours) * video.quality * (video.audienceRetention / 100);
        return Math.round(score);
    }, [video]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl border border-gray-700 overflow-hidden flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
        <div className="relative flex-shrink-0">
            <img src={video.thumbnailUrl} alt={video.title} className="w-full h-56 object-cover"/>
            <button onClick={onClose} className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/80 transition-colors">
                <XIcon />
            </button>
             <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-gray-800 to-transparent"></div>
            <div className="absolute bottom-4 left-6">
                <h2 className="text-3xl font-bold text-white drop-shadow-lg">{video.title}</h2>
            </div>
        </div>

        <div className="flex-shrink-0 px-6 border-b border-gray-700">
            <div className="flex gap-4">
                {(['Details', 'Analytics', 'Advanced Analytics', 'Comments'] as Tab[]).map(tab => (
                    <button 
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`py-3 font-semibold border-b-2 transition-colors text-sm ${activeTab === tab ? 'text-red-400 border-red-400' : 'text-gray-400 border-transparent hover:text-white'}`}
                    >
                        {tab} {tab === 'Comments' && `(${video.comments.length})`}
                    </button>
                ))}
            </div>
        </div>

        <div className="p-6 overflow-y-auto">
            {activeTab === 'Details' && (
                <div>
                     <p className="text-gray-300 whitespace-pre-wrap">{video.description}</p>
                     {video.seriesName && <p className="mt-4 text-sm text-yellow-400 bg-yellow-500/10 px-3 py-1 rounded-md inline-block">Part of the "{video.seriesName}" series (Episode {video.seriesEpisode})</p>}
                </div>
            )}
            {activeTab === 'Analytics' && (
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <DetailStat icon={<PlayIcon/>} label="Views" value={video.views.toLocaleString()} />
                    <DetailStat icon={<ThumbsUpIcon/>} label="Likes" value={video.likes.toLocaleString()} />
                    <DetailStat icon={<ChartBarIcon/>} label="Watch Hours" value={video.watchHours.toFixed(2)} />
                    <DetailStat icon={<ChartBarIcon/>} label="Audience Retention" value={`${video.audienceRetention}%`} />
                 </div>
            )}
            {activeTab === 'Advanced Analytics' && (
                 <div className="space-y-4">
                    <DetailStat icon={<BrainCircuitIcon/>} label="Virality Score" value={viralityScore.toLocaleString()} />
                    <div className="bg-gray-900/50 p-4 rounded-lg">
                        <h4 className="font-semibold text-lg text-teal-300 mb-2">AI Studio Tip</h4>
                        {video.studioTip ? (
                             <p className="text-white">{video.studioTip}</p>
                        ) : (
                            <p className="text-gray-400 animate-pulse">Analyzing video performance...</p>
                        )}
                    </div>
                 </div>
            )}
            {activeTab === 'Comments' && (
                <div>
                    {video.comments.length > 0 ? (
                        <div className="space-y-1 -m-3">
                           {video.comments.map(c => <CommentItem key={c.id} comment={c}/>)}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                           <p>Loading comments...</p>
                        </div>
                    )}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
