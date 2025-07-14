'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState, LoginData, SignUpData } from '../types/auth';

interface AuthContextType extends AuthState {
    login: (data: LoginData) => Promise<boolean>;
    signup: (data: SignUpData) => Promise<boolean>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TEST_ACCOUNTS = [
    { email: 'demo@example.com', password: 'password123', name: 'Demo User' },
    { email: 'test@user.com', password: 'testpass', name: 'Test User' },
];

export function AuthProvider({ children }: { children: ReactNode }) {
    const [authState, setAuthState] = useState<AuthState>({
        user: null,
        isAuthenticated: false,
    });

    useEffect(() => {
        const stored = localStorage.getItem('auth');
        if (stored) {
            const parsed = JSON.parse(stored);
            setAuthState(parsed);
        }
    }, []);

    const login = async (data: LoginData): Promise<boolean> => {
        await new Promise(resolve => setTimeout(resolve, 1000));

        const account = TEST_ACCOUNTS.find(
            acc => acc.email === data.email && acc.password === data.password
        );

        if (account) {
            const user: User = {
                id: Math.random().toString(36).substr(2, 9),
                email: account.email,
                name: account.name,
                avatar: 'https://randomuser.me/api/portraits/men/79.jpg',
            };

            const newState = { user, isAuthenticated: true };
            setAuthState(newState);
            localStorage.setItem('auth', JSON.stringify(newState));
            return true;
        }
        return false;
    };

    const signup = async (data: SignUpData): Promise<boolean> => {
        await new Promise(resolve => setTimeout(resolve, 1000));

        const user: User = {
            id: Math.random().toString(36).substr(2, 9),
            email: data.email,
            name: data.name,
            avatar: 'https://randomuser.me/api/portraits/men/79.jpg',
        };

        const newState = { user, isAuthenticated: true };
        setAuthState(newState);
        localStorage.setItem('auth', JSON.stringify(newState));
        return true;
    };

    const logout = () => {
        setAuthState({ user: null, isAuthenticated: false });
        localStorage.removeItem('auth');
    };

    return (
        <AuthContext.Provider value={{ ...authState, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
