import {httpClient} from './httpClient';
import {LoginRequest, LoginResponse, RegisterRequest, RegisterResponse} from '../types/auth';
import {ApiResponse} from '../types/api';
import {storage} from '../utils/storage'; // Добавляем импорт storage

export class AuthApi {
    async register(registerData: RegisterRequest): Promise<ApiResponse<RegisterResponse>> {
        return await httpClient.post<RegisterResponse>(
            '/auth/register',
            registerData,
            {
                headers: {'Content-Type': 'application/json'},
                requiresAuth: false
            }
        );
    }

    async login(loginData: LoginRequest): Promise<ApiResponse<LoginResponse>> {
        const formData = new URLSearchParams();
        formData.append('username', loginData.username);
        formData.append('password', loginData.password);

        const response = await httpClient.post<LoginResponse>(
            '/auth/jwt/login',
            formData,
            {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                requiresAuth: false
            }
        );

        if (response.data.access_token) {
            storage.setToken(response.data.access_token);
        }

        return response;
    }

    async logout(): Promise<ApiResponse<string>> {
        const response = await httpClient.post<string>(
            '/auth/jwt/logout',
            undefined,
            {
                requiresAuth: true
            }
        );

        storage.removeToken();

        return response;
    }

    isAuthenticated(): boolean {
        return !!storage.getToken();
    }

    getCurrentToken(): string | null {
        return storage.getToken();
    }
}

export const authAPI = new AuthApi();