import { Outlet } from 'react-router-dom';
import { authService } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/resume.module.css';

export const Layout = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await authService.logout();
            navigate('/login');
        } catch (error) {
            console.error('Ошибка при выходе:', error);
        }
    };

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div className={styles.container}>
                    <nav className={styles.nav}>
                        <a href="/resumes" className={styles.brand}>
                            📝 ResumeApp
                        </a>
                        <div className={styles.navMenu}>
                            <a href="/resumes" className={styles.navLink}>
                                📋 Мои резюме
                            </a>
                            <a href="/resumes/create" className={styles.navLink}>
                                ➕ Создать резюме
                            </a>
                        </div>
                        <div className={styles.navUser}>
                            <button
                                onClick={handleLogout}
                                className={styles.logoutBtn}
                                title="Выйти из аккаунта"
                            >
                                🚪 Выйти
                            </button>
                        </div>
                    </nav>
                </div>
            </header>

            <main className={styles.container}>
                <Outlet />
            </main>
        </div>
    );
};