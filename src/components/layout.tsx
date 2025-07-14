'use client';

import { ReactNode } from 'react';
import { useAuth } from '../../contexts/authContext';
import { LogIn } from 'lucide-react';
import Link from 'next/link';

interface LayoutProps {
    children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    const { user, logout, isAuthenticated } = useAuth();

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                            <div className="w-4 h-4 border-2 border-white rounded-full"></div>
                        </div>
                        <h1 className="text-xl font-semibold text-gray-900">foo-rum</h1>
                    </div>

                    {isAuthenticated && user ? (
                        <button
                            onClick={logout}
                            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <span className="text-sm font-medium">Logout</span>
                            <LogIn className="w-4 h-4" />
                        </button>
                    ) : (
                        <Link href="/signin" className="flex items-center space-x-2 text-gray-600">
                            <span className="text-sm font-medium">Login</span>
                            <LogIn className="w-4 h-4" />
                        </Link>
                    )}
                </div>
            </header>
            <main>{children}</main>
        </div>
    );
}