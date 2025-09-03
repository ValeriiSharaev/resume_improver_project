import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { LoginRequest } from '../../types/auth';
import '../../styles/auth.css'; // Импортируем стили для аутентификации

export const Login = () => {
    const [formData, setFormData] = useState<LoginRequest>({
        username: '',
        password: ''
    });

    const { login, loading, error } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(formData);
            navigate('/resumes');
        } catch (err) {
            // Ошибка уже обработана в хуке
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <h2>Вход</h2>
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="username">Имя пользователя:</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Пароль:</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                            disabled={loading}
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="auth-btn btn-primary"
                    >
                        <span className="btn-icon">🚀</span>
                        {loading ? 'Вход...' : 'Войти в аккаунт'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        Нет аккаунта? <Link to="/register" className="auth-link">Зарегистрироваться</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};