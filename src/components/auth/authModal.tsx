'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { LogIn } from 'lucide-react';
import { useAuth } from '../../../contexts/authContext';
import { useForm } from 'react-hook-form';
import { LoginData, SignUpData } from '../../../types/auth';
import Modal from '../ui/Modal';
import LoginForm from './loginForm';
import SignUpForm from './signUpForm';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    defaultMode?: 'login' | 'signup';
}

interface FormData extends SignUpData {
    confirmPassword: string;
}

export default function AuthModal({ isOpen, onClose, defaultMode = 'login' }: AuthModalProps) {
    const [mode, setMode] = useState<'login' | 'signup'>(defaultMode);
    const handleSuccess = () => {
        onClose();
    };
    const switchMode = () => {
        setMode(mode === 'login' ? 'signup' : 'login');
    };
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            {mode === 'login' ? (
                <LoginForm onSuccess={handleSuccess} onSwitchToSignup={switchMode} />
            ) : (
                <SignUpForm onSuccess={handleSuccess} onSwitchToLogin={switchMode} />
            )}
        </Modal>
    );
}