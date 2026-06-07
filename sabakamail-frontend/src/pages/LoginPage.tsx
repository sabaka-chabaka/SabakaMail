import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usersApi } from '../api'
import { useAuth } from '../hooks/useAuth'
import type { User } from '../types'

export default function LoginPage() {
    const { login } = useAuth()
    const navigate = useNavigate()

    const [mode, setMode] = useState<'login' | 'register'>('login')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleSubmit() {
        setError('')
        setLoading(true)
        try {
            if (mode === 'register') {
                const user = await usersApi.create({ name, email, password })
                login(user)
                navigate('/inbox')
            } else {
                const users = await usersApi.getAll()
                const found = users.find((u: User) => u.email === email)
                if (!found) {
                    setError('User not found')
                    return
                }
                login(found)
                navigate('/inbox')
            }
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : 'Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="auth-root">
            <div className="auth-card">
                <div className="auth-logo">
                    <span className="auth-logo-icon">✉</span>
                    <span className="auth-logo-name">SabakaMail</span>
                </div>

                <div className="auth-tabs">
                    <button
                        className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
                        onClick={() => { setMode('login'); setError('') }}
                    >
                        Sign in
                    </button>
                    <button
                        className={`auth-tab ${mode === 'register' ? 'active' : ''}`}
                        onClick={() => { setMode('register'); setError('') }}
                    >
                        Create account
                    </button>
                </div>

                <div className="auth-fields">
                    {mode === 'register' && (
                        <input
                            className="auth-input"
                            placeholder="Full name"
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                    )}
                    <input
                        className="auth-input"
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    <input
                        className="auth-input"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                    />
                </div>

                {error && <p className="auth-error">{error}</p>}

                <button
                    className="auth-submit"
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
                </button>
            </div>
        </div>
    )
}
