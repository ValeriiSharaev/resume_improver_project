import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { resumeService } from '../../services/resumeService';
import { ResumeResponse, UpdateResumeRequest } from '../../types/resume';
import { ApiError } from '../../types/api';
import styles from '../../styles/resume.module.css';

export const ResumeEdit = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [resume, setResume] = useState<ResumeResponse | null>(null);

    const [formData, setFormData] = useState<UpdateResumeRequest>({
        title: '',
        content: '',
    });

    useEffect(() => {
        if (id) {
            loadResume();
        }
    }, [id]);

    const loadResume = async () => {
        try {
            setLoading(true);
            const resumeData = await resumeService.getResumeById(Number(id));
            setResume(resumeData);
            setFormData({
                title: resumeData.title,
                content: resumeData.content || '',
            });
        } catch (err) {
            const apiError = err as ApiError;
            setError(apiError.message || 'Ошибка загрузки резюме');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!resume) return;

        setSaving(true);
        setError(null);

        try {
            const updatedResume = await resumeService.updateResume(resume.id, formData);
            navigate(`/resumes/${updatedResume.id}`);
        } catch (err) {
            const apiError = err as ApiError;
            setError(apiError.message || 'Ошибка обновления резюме');
        } finally {
            setSaving(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCancel = () => {
        navigate(`/resumes/${id}`);
    };

    if (loading) {
        return (
            <div className={styles.page}>
                <div className={styles.container}>
                    <div className={styles.loading}>Загрузка резюме...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.page}>
                <div className={styles.container}>
                    <div className={styles.error}>{error}</div>
                    <button
                        onClick={() => navigate('/resumes')}
                        className={`${styles.btn} ${styles.btnPrimary}`}
                    >
                        ← Назад к списку
                    </button>
                </div>
            </div>
        );
    }

    if (!resume) {
        return (
            <div className={styles.page}>
                <div className={styles.container}>
                    <h2>Резюме не найдено</h2>
                    <button
                        onClick={() => navigate('/resumes')}
                        className={`${styles.btn} ${styles.btnPrimary}`}
                    >
                        ← Назад к списку
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.page}>

            <div className={styles.container}>
                <div className={styles.pageHeader}>
                    <h1 className={styles.pageTitle}>Редактирование резюме</h1>
                    <small>ID: {resume.id}</small>
                </div>

                <form onSubmit={handleSubmit} className={styles.resumeForm}>
                    <div className={styles.formGroup}>
                        <label htmlFor="title" className={styles.formLabel}>
                            Название резюме *
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            required
                            disabled={saving}
                            className={styles.formInput}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="content" className={styles.formLabel}>
                            Содержание резюме *
                        </label>
                        <textarea
                            id="content"
                            name="content"
                            value={formData.content}
                            onChange={handleInputChange}
                            required
                            disabled={saving}
                            rows={10}
                            className={`${styles.formInput} ${styles.formTextarea}`}

                        />
                    </div>

                    {error && <div className={styles.error}>{error}</div>}

                    <div className={styles.formActions}>
                        <button
                            type="button"
                            onClick={handleCancel}
                            disabled={saving}
                            className={`${styles.btn} ${styles.btnSecondary}`}
                        >
                            Отмена
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className={`${styles.btn} ${styles.btnPrimary}`}
                        >
                            {saving ? 'Сохранение...' : 'Сохранить изменения'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};