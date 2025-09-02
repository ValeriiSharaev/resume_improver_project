import { httpClient } from './httpClient';
import {
    ResumeResponse,
    CreateResumeRequest,
    UpdateResumeRequest
} from '../types/resume';
import { ApiResponse } from '../types/api';

export class ResumeApi {
    async getAllResumes(): Promise<ApiResponse<ResumeResponse[]>> {
        return httpClient.get<ResumeResponse[]>('/resumes', {
            requiresAuth: true // Явно указываем авторизацию
        });
    }

    async getResumeById(id: number): Promise<ApiResponse<ResumeResponse>> {
        return httpClient.get<ResumeResponse>(`/resumes/${id}`, {
            requiresAuth: true
        });
    }

    async createResume(resumeData: CreateResumeRequest): Promise<ApiResponse<ResumeResponse>> {
        return httpClient.post<ResumeResponse>('/resumes', resumeData, {
            headers: { 'Content-Type': 'application/json' },
            requiresAuth: true
        });
    }

    async updateResume(id: number, resumeData: UpdateResumeRequest): Promise<ApiResponse<ResumeResponse>> {
        return httpClient.put<ResumeResponse>(`/resumes/${id}`, resumeData, {
            headers: { 'Content-Type': 'application/json' },
            requiresAuth: true
        });
    }

    async deleteResume(id: number): Promise<ApiResponse<ResumeResponse>> {
        return httpClient.delete<ResumeResponse>(`/resumes/${id}`, {
            requiresAuth: true
        });
    }

    async improveResume(id: number): Promise<ApiResponse<ResumeResponse>> {
        return httpClient.patch<ResumeResponse>(`/resumes/${id}/improve`, undefined, {
            requiresAuth: true
        });
    }
}

export const resumeApi = new ResumeApi();