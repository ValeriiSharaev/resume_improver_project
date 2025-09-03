import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { resumeService } from '../../services/resumeService';
import { historyService } from '../../services/historyService';
import { ResumeResponse, ResumeHistory } from '../../types/resume';
import { ApiError } from '../../types/api';
import styles from '../../styles/resume.module.css';
import { BackButton } from '../../components/BackButton';

export const ResumeDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [resume, setResume] = useState<ResumeResponse | null>(null);
    const [history, setHistory] = useState<ResumeHistory[]>([]);
    const [loading, setLoading] = useState(true);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [improving, setImproving] = useState(false);
    const [showHistory, setShowHistory] = useState(false);

    useEffect(() => {
        if (id) {
            loadResume();
            loadHistory();
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

    const loadHistory = async () => {
        if (!id) return;

        try {
            setHistoryLoading(true);
            const historyData = await historyService.getResumeHistory(Number(id));
            setHistory(historyData);
        } catch (err) {
            console.error('Ошибка загрузки истории:', err);
        } finally {
            setHistoryLoading(false);
        }
    };

    const handleImprove = async () => {
        if (!resume) return;

        setImproving(true);
        try {
            const improvedResume = await resumeService.improveResume(resume.id);
            setResume(improvedResume);
            // Перезагружаем историю после улучшения
            await loadHistory();
        } catch (err) {
            const apiError = err as ApiError;
            setError(apiError.message || 'Ошибка улучшения резюме');
        } finally {
            setImproving(false);
        }
    };

    const handleDeleteHistory = async () => {
        if (!resume || !window.confirm('Удалить всю историю изменений этого резюме?')) return;

        try {
            await historyService.deleteResumeHistory(resume.id);
            setHistory([]);
            alert('История изменений удалена');
        } catch (err) {
            const apiError = err as ApiError;
            setError(apiError.message || 'Ошибка удаления истории');
        }
    };

    const handleDelete = async () => {
        if (!resume) return;

        if (window.confirm('Вы уверены, что хотите удалить это резюме?')) {
            try {
                await resumeService.deleteResume(resume.id);
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
                            onClick={handleImprove}
                            disabled={improving}
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
                            onClick={() => setShowHistory(!showHistory)}
                            className={`${styles.btn} ${styles.btnInfo}`}
                        >
                            {showHistory ? '📋 Скрыть историю' : '📋 История изменений'}
                        </button>
                        <button
                            onClick={handleDelete}
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
                            <span className={styles.fieldLabel}>Текущая версия:</span>
                            <div className={styles.contentBox}>
                                {resume.content || 'Нет содержания'}
                            </div>
                        </div>
                    </div>

                    {showHistory && (
                        <div className={styles.resumeSection}>
                            <div className={styles.sectionHeader}>
                                <h3 className={styles.sectionTitle}>
                                    История изменений ({history.length})
                                </h3>
                                {history.length > 0 && (
                                    <button
                                        onClick={handleDeleteHistory}
                                        className={`${styles.btn} ${styles.btnDanger} ${styles.btnCompact}`}
                                        title="Удалить всю историю"
                                    >
                                        🗑️ Очистить историю
                                    </button>
                                )}
                            </div>

                            {historyLoading ? (
                                <div className={styles.loading}>Загрузка истории...</div>
                            ) : history.length === 0 ? (
                                <div className={styles.emptyState}>
                                    <p>История изменений отсутствует</p>
                                </div>
                            ) : (
                                <div className={styles.historyList}>
                                    {history.map((item, index) => (
                                        <div key={item.id} className={styles.historyItem}>
                                            <div className={styles.historyHeader}>
                                                <span className={styles.historyDate}>
                                                    Версия {history.length - index} •{' '}
                                                    {new Date(item.improved_at).toLocaleDateString('ru-RU', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </span>
                                            </div>
                                            <div className={styles.historyContent}>
                                                <div className={styles.historyVersion}>
                                                    <h4>Было:</h4>
                                                    <div className={styles.versionContent}>
                                                        {item.old_content}
                                                    </div>
                                                </div>
                                                <div className={styles.historyArrow}>→</div>
                                                <div className={styles.historyVersion}>
                                                    <h4>Стало:</h4>
                                                    <div className={styles.versionContent}>
                                                        {item.new_content}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};