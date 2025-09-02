export interface RegisterRequest {
    email: string;
    password: string;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface RegisterResponse {
    id: number;
    email: string;
    is_active: boolean;
    is_superuser: boolean;
    is_verified: boolean;
}

export interface LoginResponse {
    access_token: string;
    token_type: string;
}