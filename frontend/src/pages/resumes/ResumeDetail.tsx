import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { resumeService } from '../../services/resumeService';
import { ResumeResponse } from '../../types/resume';
import { ApiError } from '../../types/api';
import styles from '../../styles/resume.module.css';
import { BackButton } from '../../components/BackButton';

export const ResumeDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [resume, setResume] = useState<ResumeResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [improving, setImproving] = useState(false); // ← Добавлено состояние

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
        } catch (err) {
            const apiError = err as ApiError;
            setError(apiError.message || 'Ошибка загрузки резюме');
        } finally {
            setLoading(false);
        }
    };

    const handleImprove = async (id: number) => {
        setImproving(true); // ← Используем состояние
        try {
            const improvedResume = await resumeService.improveResume(id);
            setResume(improvedResume);
        } catch (err) {
            const apiError = err as ApiError;
            setError(apiError.message || 'Ошибка улучшения резюме');
        } finally {
            setImproving(false); // ← Сбрасываем состояние
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Удалить это резюме?')) {
            try {
                await resumeService.deleteResume(id);
                navigate('/resumes');
            } catch (err) {
                const apiError = err as ApiError;
                setError(apiError.message || 'Ошибка удаления резюме');
            }
        }
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
                    <BackButton simple={true} />
                    <h1 className={styles.pageTitle}>{resume.title}</h1>
                    <div className={styles.actionButtons}>
                        <button
                            onClick={() => handleImprove(resume.id)}
                            disabled={improving} // ← Теперь improving существует
                            className={`${styles.btn} ${styles.btnWarning}`}
                        >
                            {improving ? 'Улучшение...' : '✨ Улучшить'}
                        </button>
                        <button
                            onClick={() => navigate(`/resumes/${resume.id}/edit`)}
                            className={`${styles.btn} ${styles.btnEdit}`}
                        >
                            ✏️ Редактировать
                        </button>
                        <button
                            onClick={() => handleDelete(resume.id)}
                            className={`${styles.btn} ${styles.btnDanger}`}
                        >
                            🗑️ Удалить
                        </button>
                    </div>
                </div>

                <div className={styles.resumeContent}>
                    <div className={styles.resumeSection}>
                        <h3 className={styles.sectionTitle}>Основная информация</h3>
                        <div className={styles.resumeField}>
                            <span className={styles.fieldLabel}>Название:</span>
                            <span className={styles.fieldValue}>{resume.title}</span>
                        </div>
                        <div className={styles.resumeField}>
                            <span className={styles.fieldLabel}>Содержание:</span>
                            <div className={styles.contentBox}>
                                {resume.content || 'Нет содержания'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};