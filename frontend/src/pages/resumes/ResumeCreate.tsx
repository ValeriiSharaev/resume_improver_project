import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { resumeService } from '../../services/resumeService';
import { CreateResumeRequest } from '../../types/resume';
import { ApiError } from '../../types/api';
import styles from '../../styles/resume.module.css';

export const ResumeCreate = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState<CreateResumeRequest>({
        title: '',
        content: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const newResume = await resumeService.createResume(formData);
            navigate(`/resumes/${newResume.id}`);
        } catch (err) {
            const apiError = err as ApiError;
            setError(apiError.message || 'Ошибка создания резюме');
        } finally {
            setLoading(false);
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
        navigate('/resumes');
    };

    return (
        <div className={styles.page}>

            <div className={styles.container}>
                <div className={styles.pageHeader}>
                    <h1 className={styles.pageTitle}>Создание нового резюме</h1>
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
                            disabled={loading}
                            placeholder="Например: Senior Frontend Developer"
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
                            disabled={loading}
                            rows={10}
                            placeholder="Опишите ваше резюме: опыт работы, навыки, образование..."
                            className={`${styles.formInput} ${styles.formTextarea}`}
                        />
                    </div>

                    {error && <div className={styles.error}>{error}</div>}

                    <div className={styles.formActions}>
                        <button
                            type="button"
                            onClick={handleCancel}
                            disabled={loading}
                            className={`${styles.btn} ${styles.btnSecondary}`}
                        >
                            Отмена
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`${styles.btn} ${styles.btnPrimary}`}
                        >
                            {loading ? 'Создание...' : 'Создать резюме'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};