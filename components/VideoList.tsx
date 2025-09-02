import React from 'react';
import type { Video } from '../types';
import { VideoCard } from './VideoCard';

interface VideoListProps {
  videos: Video[];
  onVideoClick: (video: Video) => void;
}

export const VideoList: React.FC<VideoListProps> = ({ videos, onVideoClick }) => {
  if (videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
        <h2 className="text-2xl font-bold">Your Studio is Empty</h2>
        <p className="mt-2">Click "Upload Video" to start your YouTube career!</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-white">Uploaded Videos</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {videos.slice().reverse().map(video => (
          <VideoCard key={video.id} video={video} onVideoClick={onVideoClick} />
        ))}
      </div>
    </div>
  );
};
