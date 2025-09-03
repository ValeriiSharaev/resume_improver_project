// services/historyService.ts
import { historyApi } from '../api/historyApi';
import { ResumeHistory } from '../types/resume';
import { ApiError } from '../types/api';

export class HistoryService {
    async getResumeHistory(resumeId: number): Promise<ResumeHistory[]> {
        try {
            const response = await historyApi.getResumeHistory(resumeId);
            return response.data;
        } catch (error) {
            this.handleError(error as ApiError);
            throw error;
        }
    }

    async getAllHistory(): Promise<ResumeHistory[]> {
        try {
            const response = await historyApi.getAllHistory();
            return response.data;
        } catch (error) {
            this.handleError(error as ApiError);
            throw error;
        }
    }

    async deleteResumeHistory(resumeId: number): Promise<ResumeHistory[]> {
        try {
            const response = await historyApi.deleteResumeHistory(resumeId);
            return response.data;
        } catch (error) {
            this.handleError(error as ApiError);
            throw error;
        }
    }

    private handleError(error: ApiError): void {
        console.error(`History API Error (${error.status}): ${error.message}`);
        // Можно добавить дополнительную логику обработки ошибок
    }
}

export const historyService = new HistoryService();