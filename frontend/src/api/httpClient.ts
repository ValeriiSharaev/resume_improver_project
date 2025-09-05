import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { ApiResponse, ApiError } from '../types/api';
import { storage } from '../utils/storage';

interface RequestConfig {
    headers?: Record<string, string>;
    requiresAuth?: boolean;
}

class HttpClient {
    private client: AxiosInstance;

    constructor(baseURL: string) {
        this.client = axios.create({
            baseURL,
            timeout: 10000,
        });

        this.setupInterceptors();
    }

    private setupInterceptors() {
        this.client.interceptors.request.use(
            (config: InternalAxiosRequestConfig) => {
                const requiresAuth = (config as any).requiresAuth !== false;

                if (requiresAuth) {
                    const token = storage.getToken();
                    if (token) {
                        config.headers.Authorization = `Bearer ${token}`;
                    }
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        this.client.interceptors.response.use(
            (response: AxiosResponse) => response,
            (error) => {
                if (error.response?.status === 401) {
                    storage.removeToken();
                    window.location.href = '/login';
                }

                const apiError: ApiError = {
                    message: error.response?.data?.message || error.message,
                    status: error.response?.status || 500,
                    code: error.code,
                };
                return Promise.reject(apiError);
            }
        );
    }

    private createAxiosConfig(config?: RequestConfig): any {
        return {
            headers: config?.headers,
            meta: { requiresAuth: config?.requiresAuth }
        };
    }

    async get<T>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
        const axiosConfig = this.createAxiosConfig(config);
        const response = await this.client.get<T>(url, axiosConfig);
        return {
            data: response.data,
            status: response.status,
        };
    }

    async post<T>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
        const axiosConfig = this.createAxiosConfig(config);
        const response = await this.client.post<T>(url, data, axiosConfig);
        return {
            data: response.data,
            status: response.status,
        };
    }

    async patch<T>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
        const axiosConfig = this.createAxiosConfig(config);
        const response = await this.client.patch<T>(url, data, axiosConfig);
        return {
            data: response.data,
            status: response.status,
        };
    }

    async put<T>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
        const axiosConfig = this.createAxiosConfig(config);
        const response = await this.client.put<T>(url, data, axiosConfig);
        return {
            data: response.data,
            status: response.status,
        };
    }

    async delete<T>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
        const axiosConfig = this.createAxiosConfig(config);
        const response = await this.client.delete<T>(url, axiosConfig);
        return {
            data: response.data,
            status: response.status,
        };
    }
}

export const httpClient = new HttpClient(import.meta.env.VITE_BACKEND_BASE_URL);
