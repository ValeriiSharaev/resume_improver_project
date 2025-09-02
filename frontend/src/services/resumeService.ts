import { resumeApi } from '../api/resumeAPI';
import {
    ResumeResponse,
    CreateResumeRequest,
    UpdateResumeRequest
} from '../types/resume';
import { ApiError } from '../types/api';

export class ResumeService {
    async getAllResumes(): Promise<ResumeResponse[]> {
        try {
            const response = await resumeApi.getAllResumes();
            return response.data;
        } catch (error) {
            this.handleError(error as ApiError);
            throw error;
        }
    }

    async getResumeById(id: number): Promise<ResumeResponse> {
        try {
            const response = await resumeApi.getResumeById(id);
            return response.data;
        } catch (error) {
            this.handleError(error as ApiError);
            throw error;
        }
    }

    async createResume(resumeData: CreateResumeRequest): Promise<ResumeResponse> {
        try {
            const response = await resumeApi.createResume(resumeData);
            return response.data;
        } catch (error) {
            this.handleError(error as ApiError);
            throw error;
        }
    }

    async updateResume(id: number, resumeData: UpdateResumeRequest): Promise<ResumeResponse> {
        try {
            const response = await resumeApi.updateResume(id, resumeData);
            return response.data;
        } catch (error) {
            this.handleError(error as ApiError);
            throw error;
        }
    }

    async deleteResume(id: number): Promise<ResumeResponse> {
        try {
            const response = await resumeApi.deleteResume(id);
            return response.data;
        } catch (error) {
            this.handleError(error as ApiError);
            throw error;
        }
    }

    async improveResume(id: number): Promise<ResumeResponse> {
        try {
            const response = await resumeApi.improveResume(id);
            return response.data;
        } catch (error) {
            this.handleError(error as ApiError);
            throw error;
        }
    }

    private handleError(error: ApiError): void {
        console.error(`API Error (${error.status}): ${error.message}`);

        // Можно добавить дополнительную логику обработки ошибок
        if (error.status === 404) {
            console.error('Ресурс не найден');
        } else if (error.status >= 500) {
            console.error('Ошибка сервера');
        }
    }
}

export const resumeService = new ResumeService();