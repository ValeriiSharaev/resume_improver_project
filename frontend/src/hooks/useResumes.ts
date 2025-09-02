// hooks/useResumes.ts
import { useState, useEffect } from 'react';
import { resumeService } from '../services/resumeService';
import { ResumeResponse, CreateResumeRequest, UpdateResumeRequest } from '../types/resume';
import { ApiError } from '../types/api';

export const useResumes = () => {
    const [resumes, setResumes] = useState<ResumeResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadResumes = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await resumeService.getAllResumes();
            setResumes(data);
            return data;
        } catch (err) {
            const apiError = err as ApiError;
            setError(apiError.message || 'Ошибка загрузки резюме');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const getResume = async (id: number) => {
        setLoading(true);
        setError(null);
        try {
            return await resumeService.getResumeById(id);
        } catch (err) {
            const apiError = err as ApiError;
            setError(apiError.message || 'Ошибка загрузки резюме');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const createResume = async (resumeData: CreateResumeRequest) => {
        setLoading(true);
        setError(null);
        try {
            const newResume = await resumeService.createResume(resumeData);
            setResumes(prev => [...prev, newResume]);
            return newResume;
        } catch (err) {
            const apiError = err as ApiError;
            setError(apiError.message || 'Ошибка создания резюме');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateResume = async (id: number, resumeData: UpdateResumeRequest) => {
        setLoading(true);
        setError(null);
        try {
            const updatedResume = await resumeService.updateResume(id, resumeData);
            setResumes(prev => prev.map(r => r.id === id ? updatedResume : r));
            return updatedResume;
        } catch (err) {
            const apiError = err as ApiError;
            setError(apiError.message || 'Ошибка обновления резюме');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteResume = async (id: number) => {
        setLoading(true);
        setError(null);
        try {
            await resumeService.deleteResume(id);
            setResumes(prev => prev.filter(r => r.id !== id));
        } catch (err) {
            const apiError = err as ApiError;
            setError(apiError.message || 'Ошибка удаления резюме');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const improveResume = async (id: number) => {
        setLoading(true);
        setError(null);
        try {
            const improvedResume = await resumeService.improveResume(id);
            setResumes(prev => prev.map(r => r.id === id ? improvedResume : r));
            return improvedResume;
        } catch (err) {
            const apiError = err as ApiError;
            setError(apiError.message || 'Ошибка улучшения резюме');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadResumes();
    }, []);

    return {
        resumes,
        loading,
        error,
        loadResumes,
        getResume,
        createResume,
        updateResume,
        deleteResume,
        improveResume,
    };
};