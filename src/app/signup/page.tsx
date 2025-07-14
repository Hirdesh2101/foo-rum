'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/authContext';
import Link from 'next/link';
import SignUpForm from '@/components/auth/signUpForm';


export default function SignUpPage() {
    const router = useRouter();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            router.push('/');
        }
    }, [isAuthenticated, router]);

    return (
        <div className="bg-white flex items-center justify-center py-12 px-4">
            <div className="absolute top-0 left-0 right-0 bg-white">
                <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                            <div className="w-4 h-4 border-2 border-white rounded-full"></div>
                        </div>
                        <h1 className="text-xl font-semibold text-gray-900">foo-rum</h1>
                    </Link>
                    <Link
                        href="/"
                        className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        Back to home
                    </Link>
                </div>
            </div>
            <SignUpForm onSuccess={() => window.location.href = '/'} onSwitchToLogin={() => window.location.href = '/signin'} />
        </div>
    );
}