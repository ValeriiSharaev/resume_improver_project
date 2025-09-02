import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useResumes } from '../../hooks/useResumes';
import styles from '../../styles/resume.module.css';

export const ResumeList = () => {
    const navigate = useNavigate(); // ← Добавлено
    const { resumes, loading, error, deleteResume, improveResume } = useResumes();
    const [improvingId, setImprovingId] = useState<number | null>(null);

    const handleImprove = async (id: number) => {
        setImprovingId(id);
        try {
            await improveResume(id);
        } finally {
            setImprovingId(null);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Удалить это резюме?')) {
            await deleteResume(id);
        }
    };

    if (loading) return <div className={styles.loading}>Загрузка...</div>;
    if (error) return <div className={styles.error}>Ошибка: {error}</div>;

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <div className={styles.pageHeader}>
                    <h1 className={styles.pageTitle}>Мои резюме</h1>
                    <Link to="/resumes/create" className={`${styles.btn} ${styles.btnPrimary}`}>
                        Создать резюме
                    </Link>
                </div>

                <div className={styles.resumeList}>
                    {resumes.length === 0 ? (
                        <div className={styles.emptyState}>
                            <p>У вас пока нет резюме</p>
                            <Link to="/resumes/create" className={`${styles.btn} ${styles.btnPrimary}`}>
                                Создать первое резюме
                            </Link>
                        </div>
                    ) : (
                        <div className={styles.resumeGrid}>
                            {resumes.map((resume) => (
                                <div key={resume.id} className={styles.resumeCard}>
                                    <h3 className={styles.resumeTitle}>{resume.title}</h3>
                                    <p className={styles.resumeDescription}>{resume.content}</p>
                                    <div className={styles.resumeActionsHorizontal}>
                                        <button
                                            onClick={() => navigate(`/resumes/${resume.id}`)}
                                            className={`${styles.btn} ${styles.btnInfo}`}
                                            title="Просмотреть резюме"
                                        >
                                            👁️ Просмотреть
                                        </button>
                                        <button
                                            onClick={() => handleImprove(resume.id)}
                                            disabled={improvingId === resume.id} // ← Исправлено
                                            className={`${styles.btn} ${styles.btnWarning}`}
                                            title="Улучшить резюме"
                                        >
                                            {improvingId === resume.id ? '⏳' : '✨'} {/* ← Исправлено */}
                                            {improvingId === resume.id ? 'Улучшение...' : 'Улучшить'} {/* ← Исправлено */}
                                        </button>
                                        <button
                                            onClick={() => navigate(`/resumes/${resume.id}/edit`)}
                                            className={`${styles.btn} ${styles.btnEdit}`}
                                            title="Редактировать резюме"
                                        >
                                            ✏️ Редактировать
                                        </button>
                                        <button
                                            onClick={() => handleDelete(resume.id)}
                                            className={`${styles.btn} ${styles.btnDanger}`}
                                            title="Удалить резюме"
                                        >
                                            🗑️ Удалить
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};