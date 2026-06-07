import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './hooks/useAuth'
import LoginPage from './pages/LoginPage'
import MailboxPage from './pages/MailboxPage'
import './styles.css'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/inbox" element={<MailboxPage />} />
                    <Route path="/sent" element={<MailboxPage />} />
                    <Route path="*" element={<Navigate to="/inbox" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    </StrictMode>
)
