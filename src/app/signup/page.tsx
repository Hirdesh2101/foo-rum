'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '../../../contexts/authContext';
import { useForm } from 'react-hook-form';
import { SignUpData } from '../../../types/auth';
import { LogIn } from 'lucide-react';
import Link from 'next/link';
import SignUpForm from '@/components/auth/signUpForm';

interface SignUpFormData extends SignUpData {
    confirmPassword: string;
}

export default function SignUpPage() {
    const router = useRouter();
    const { isAuthenticated, signup } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch
    } = useForm<SignUpFormData>();

    useEffect(() => {
        if (isAuthenticated) {
            router.push('/');
        }
    }, [isAuthenticated, router]);

    const onSubmit = async (data: SignUpFormData) => {
        setIsLoading(true);
        setError('');

        try {
            const success = await signup({
                name: data.name,
                email: data.email,
                password: data.password
            });
            if (success) {
                router.push('/');
            } else {
                setError('Failed to create account. Please try again.');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 bg-white shadow-sm border-b border-gray-200">
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
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 mt-20">
                <SignUpForm onSuccess={() => window.location.href = '/'} onSwitchToLogin={() => window.location.href = '/signin'} />
            </div>
        </div>
    );
}