import { httpClient } from './httpClient';
import { ResumeHistory } from '../types/resume';
import { ApiResponse } from '../types/api';

export class HistoryApi {
    async getResumeHistory(resumeId: number): Promise<ApiResponse<ResumeHistory[]>> {
        return httpClient.get<ResumeHistory[]>(`/history/${resumeId}`);
    }

    async getAllHistory(): Promise<ApiResponse<ResumeHistory[]>> {
        return httpClient.get<ResumeHistory[]>('/history/');
    }

    async deleteResumeHistory(resumeId: number): Promise<ApiResponse<ResumeHistory[]>> {
        return httpClient.delete<ResumeHistory[]>(`/history/${resumeId}`);
    }
}

export const historyApi = new HistoryApi();