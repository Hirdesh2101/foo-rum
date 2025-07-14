export interface User {
    id: string;
    email: string;
    name: string;
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface SignUpData {
    name: string;
    email: string;
    password: string;
}