'use client';

import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share } from 'lucide-react';
import { Post } from '../../../types/post';
import { useAuth } from '../../../contexts/authContext';
import Image from 'next/image';

interface PostCardProps {
    post: Post;
    onAuthRequired?: () => void;
}

export default function PostCard({ post, onAuthRequired }: PostCardProps) {
    const { isAuthenticated } = useAuth();

    const handleInteraction = () => {
        if (!isAuthenticated) {
            onAuthRequired?.();
            return;
        }
        alert('Function not implemented');
    };

    const formatTimeAgo = (date: Date) => {
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return 'just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} mins ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
        return `${Math.floor(diffInSeconds / 86400)} days ago`;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm border-6 border-gray-100 mb-6 mx-auto max-w-2xl overflow-hidden"
        >
            <div className="p-4 rounded-2xl z-10 shadow-xl">
                <div className="flex items-start space-x-3 mb-4">
                    <Image
                        src={post.author.avatar ?? 'https://d140p29c73x6ns.cloudfront.net/temp/rajeshkumar.jpg'}
                        alt={post.author.name}
                        className="w-10 h-10 rounded-full object-cover"
                        height={20}
                        width={20}
                    />
                    <div>
                        <h3 className="font-medium text-[var(--color-text-primary)] text-sm">
                            {post.author.name}
                        </h3>
                        <p className="text-[var(--color-text-secondary)] text-xs font-normal">
                            {formatTimeAgo(post.timestamp)}
                        </p>
                    </div>
                </div>
                <div className="flex items-start space-x-2">
                    <span className="text-lg leading-none flex-shrink-0 mt-0.5 bg-gray-100 rounded-full p-1.5">
                        {post.emoji}
                    </span>
                    <div
                        className="text-[var(--color-text-primary)] text-sm leading-relaxed prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                </div>

            </div>
            <div className="flex bg-gray-100 items-center space-x-3 px-2 pt-2">
                <button onClick={handleInteraction} className="flex items-center justify-center w-8 h-8 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-gray-50 rounded-full transition-colors duration-200">
                    <Heart size={18} className="stroke-current" />
                </button>
                <button onClick={handleInteraction} className="flex items-center justify-center w-8 h-8 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-gray-50 rounded-full transition-colors duration-200">
                    <MessageCircle size={18} className="stroke-current" />
                </button>
                <button onClick={handleInteraction} className="flex items-center justify-center w-8 h-8 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-gray-50 rounded-full transition-colors duration-200">
                    <Share size={18} className="stroke-current" />
                </button>
            </div>
        </motion.div>
    );
}