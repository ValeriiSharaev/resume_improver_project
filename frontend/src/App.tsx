// App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { ResumeList } from './pages/resumes/ResumeList';
import { ResumeDetail } from './pages/resumes/ResumeDetail';
import { ResumeCreate } from './pages/resumes/ResumeCreate';
import { ResumeEdit } from './pages/resumes/ResumeEdit';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './pages/Layout';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route path="/" element={
                    <ProtectedRoute>
                        <Layout />
                    </ProtectedRoute>
                }>
                    <Route index element={<Navigate to="/resumes" replace />} />
                    <Route path="resumes" element={<ResumeList />} />
                    <Route path="resumes/create" element={<ResumeCreate />} />
                    <Route path="resumes/:id" element={<ResumeDetail />} />
                    <Route path="resumes/:id/edit" element={<ResumeEdit />} />
                </Route>

                <Route path="*" element={<div>404 - Страница не найдена</div>} />
            </Routes>
        </Router>
    );
}

export default App;