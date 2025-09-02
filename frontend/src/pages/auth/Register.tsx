import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { RegisterRequest } from '../../types/auth';
import '../../styles/auth.css';

export const Register = () => {
    const [formData, setFormData] = useState<RegisterRequest>({
        email: '',
        password: '',
    });

    const { register, loading, error } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await register({
                email: formData.email,
                password: formData.password
            });
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
                <h2>Регистрация</h2>
                <form onSubmit={handleSubmit} className="auth-form">

                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
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
                        className="btn btn-primary btn-full"
                    >
                        {loading ? 'Регистрация...' : 'Зарегистрироваться'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        Уже есть аккаунт? <Link to="/login" className="auth-link">Войти</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};