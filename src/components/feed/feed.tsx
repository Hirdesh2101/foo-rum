'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../../contexts/authContext';
import { Post } from '../../../types/post';
import PostEditor from './postEditor';
import PostCard from './postCard';
import AuthModal from '../auth/authModal';

const INITIAL_POSTS: Post[] = [
    {
        id: '1',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        author: { name: 'Theresa Webb', avatar: 'https://randomuser.me/api/portraits/men/79.jpg' },
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        likes: 24,
        comments: 5,
        shares: 2,
        emoji: '😊',
    },
    {
        id: '2',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        author: { name: 'John Doe', avatar: 'https://randomuser.me/api/portraits/men/72.jpg' },
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        likes: 18,
        comments: 8,
        shares: 3,
        emoji: '😎',
    },
    {
        id: '3',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        author: { name: 'Jane Doe', avatar: 'https://randomuser.me/api/portraits/men/74.jpg' },
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        likes: 42,
        comments: 12,
        shares: 7,
        emoji: '🥳',
    },
];

export default function Feed() {
    const { user } = useAuth();
    const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [selectedEmoji, setSelectedEmoji] = useState('😊');

    const handlePublish = (content: string, emoji: string) => {
        if (!user) return;
        const newPost: Post = {
            id: Date.now().toString(),
            content,
            author: { name: user.name },
            timestamp: new Date(),
            likes: 0,
            comments: 0,
            shares: 0,
            emoji,
        };
        setPosts(prev => [newPost, ...prev]);
    };

    const handleAuthRequired = () => {
        setShowAuthModal(true);
    };

    return (
        <div className="min-h-screen bg-white py-6">
            <div className="max-w-4xl mx-auto px-4">
                <PostEditor
                    onPublish={handlePublish}
                    onAuthRequired={handleAuthRequired}
                    selectedEmoji={selectedEmoji}
                    setSelectedEmoji={setSelectedEmoji}
                />

                <div className="space-y-4">
                    {posts.map((post, index) => (
                        <motion.div
                            key={post.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <PostCard
                                post={post}
                                onAuthRequired={handleAuthRequired}
                            />
                        </motion.div>
                    ))}
                </div>

                <AuthModal
                    isOpen={showAuthModal}
                    onClose={() => setShowAuthModal(false)}
                />
            </div>
        </div>
    );
}