
import React from 'react';
import type { CommunityPost } from '../types';
import { ThumbsUpIcon } from './icons/ThumbsUpIcon';
import { MessageSquareIcon } from './icons/MessageSquareIcon';

interface CommunityTabProps {
  posts: CommunityPost[];
  onNewPost: () => void;
  isSuspended: boolean;
}

const PostCard: React.FC<{ post: CommunityPost }> = ({ post }) => {
    const timeSincePost = (): string => {
        const seconds = Math.floor((new Date().getTime() - post.postedAt.getTime()) / 1000);
        if (seconds < 60) return "Just now";
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes} min ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours} hours ago`;
        const days = Math.floor(hours / 24);
        return `${days} days ago`;
    }

    return (
        <div className="bg-gray-800 rounded-lg p-5 border border-gray-700">
            <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-red-500 flex-shrink-0 flex items-center justify-center font-bold text-xl text-white">
                    Y
                </div>
                <div className="flex-1">
                    <div className="flex items-baseline gap-2">
                        <p className="font-bold text-white">Your Channel</p>
                        <p className="text-sm text-gray-400">{timeSincePost()}</p>
                    </div>
                    <p className="mt-2 text-gray-300 whitespace-pre-wrap">{post.text}</p>
                    <div className="mt-4 flex items-center gap-4 text-gray-400">
                        <div className="flex items-center gap-1.5">
                            <ThumbsUpIcon className="w-4 h-4" />
                            <span>{post.likes.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export const CommunityTab: React.FC<CommunityTabProps> = ({ posts, onNewPost, isSuspended }) => {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Community</h2>
        <button
            onClick={onNewPost}
            disabled={isSuspended}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-transform duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
            <MessageSquareIcon className="w-5 h-5"/>
            <span>New Post</span>
        </button>
      </div>
      
      {posts.length === 0 ? (
        <div className="text-center py-16 bg-gray-800 rounded-lg border border-dashed border-gray-700">
            <h3 className="text-xl font-semibold text-gray-400">No community posts yet.</h3>
            <p className="text-gray-500 mt-2">Engage with your audience by creating your first post!</p>
        </div>
      ) : (
        <div className="space-y-4">
            {posts.map(post => <PostCard key={post.id} post={post} />)}
        </div>
      )}
    </div>
  );
};