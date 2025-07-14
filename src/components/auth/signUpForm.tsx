'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../../contexts/authContext';
import { SignUpData } from '../../../types/auth';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { LogIn } from 'lucide-react';

interface SignUpFormProps {
    onSuccess?: () => void;
    onSwitchToLogin?: () => void;
}

export default function SignUpForm({ onSuccess, onSwitchToLogin }: SignUpFormProps) {
    const { signup } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignUpData>();

    const onSubmit = async (data: SignUpData) => {
        setIsLoading(true);
        setError('');

        try {
            const success = await signup(data);
            if (success) {
                onSuccess?.();
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
        <div className="bg-gray-100 flex items-center justify-center p-2">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <LogIn className="w-8 h-8 text-gray-700" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Create an account to continue</h2>
                    <p className="text-gray-500">Create an account to access all the features on this app</p>
                </div>
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name
                        </label>
                        <input
                            type="text"
                            {...register('name', {
                                required: 'Name is required',
                                minLength: {
                                    value: 2,
                                    message: 'Name must be at least 2 characters',
                                },
                            })}
                            placeholder="Enter your full name"
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email or username
                        </label>
                        <input
                            type="email"
                            {...register('email', {
                                required: 'Email is required',
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: 'Invalid email address',
                                },
                            })}
                            placeholder="Enter your email or username"
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            {...register('password', {
                                required: 'Password is required',
                                minLength: {
                                    value: 6,
                                    message: 'Password must be at least 6 characters',
                                },
                            })}
                            placeholder="Enter your password"
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                        {errors.password && (
                            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                        )}
                    </div>
                    {error && (
                        <div className="text-red-600 text-sm text-center">{error}</div>
                    )}
                    <button
                        onClick={handleSubmit(onSubmit)}
                        disabled={isLoading}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                    >
                        {isLoading ? 'Signing Up...' : 'Sign Up'}
                    </button>
                </div>
                {onSwitchToLogin && (
                    <div className="text-center mt-8">
                        <p className="text-gray-500">
                            Already have an account?{' '}
                            <button
                                onClick={onSwitchToLogin}
                                className="text-blue-600 hover:text-blue-700 font-medium"
                            >
                                Sign In
                            </button>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}