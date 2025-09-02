import { authAPI } from '../api/authAPI';
import {
    RegisterRequest,
    RegisterResponse,
    LoginRequest,
    LoginResponse
} from '../types/auth';
import { ApiError } from '../types/api';

export class AuthService {
    async register(registerData: RegisterRequest): Promise<RegisterResponse> {
        try {
            const response = await authAPI.register(registerData);
            return response.data;
        } catch (error) {
            this.handleError(error as ApiError);
            throw error;
        }
    }

    async login(loginData: LoginRequest): Promise<LoginResponse> {
        try {
            const response = await authAPI.login(loginData);
            return response.data;
        } catch (error) {
            this.handleError(error as ApiError);
            throw error;
        }
    }

    async logout(): Promise<string> {
        try {
            const response = await authAPI.logout();
            return response.data;
        } catch (error) {
            this.handleError(error as ApiError);
            throw error;
        }
    }

    isAuthenticated(): boolean {
        return authAPI.isAuthenticated();
    }

    getCurrentToken(): string | null {
        return authAPI.getCurrentToken();
    }

    private handleError(error: ApiError): void {
        console.error(`API Error (${error.status}): ${error.message}`);

        if (error.status === 401) {
            console.error('Неавторизованный доступ');
            this.logout().catch(() => {});
        } else if (error.status === 404) {
            console.error('Ресурс не найден');
        } else if (error.status >= 500) {
            console.error('Ошибка сервера');
        }
    }
}

export const authService = new AuthService();