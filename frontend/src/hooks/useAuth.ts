import {useState} from 'react';
import {authService} from '../services/authService';
import {LoginRequest, RegisterRequest} from '../types/auth';
import {ApiError} from '../types/api';

export const useAuth = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const login = async (credentials: LoginRequest) => {
        setLoading(true);
        setError(null);
        try {
            return await authService.login(credentials);
        } catch (err) {
            const apiError = err as ApiError;
            setError(apiError.message || 'Ошибка авторизации');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData: RegisterRequest) => {
        setLoading(true);
        setError(null);
        try {
            return await authService.register(userData);
        } catch (err) {
            const apiError = err as ApiError;
            setError(apiError.message || 'Ошибка регистрации');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
        } catch (err) {
            console.error('Ошибка выхода:', err);
        }
    };

    return {
        login,
        register,
        logout,
        loading,
        error,
        isAuthenticated: authService.isAuthenticated(),
        userToken: authService.getCurrentToken(),
    };
};