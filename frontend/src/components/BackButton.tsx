// components/BackButton.tsx
import { useNavigate } from 'react-router-dom';
import styles from '../styles/resume.module.css';

interface BackButtonProps {
    to?: string;
    simple?: boolean;
    children?: React.ReactNode;
}

export const BackButton = ({
                               to,
                               simple = false,
                               children = "Назад"
                           }: BackButtonProps) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (to) {
            navigate(to);
        } else {
            navigate(-1); // Назад по истории
        }
    };

    return (
        <button
            onClick={handleClick}
            className={simple ? styles.backButtonSimple : styles.backButton}
        >
            <span className={styles.backButtonIcon}>←</span>
            {children}
        </button>
    );
};