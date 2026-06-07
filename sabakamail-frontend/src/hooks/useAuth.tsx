import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { User } from '../types'

interface AuthContextValue {
    user: User | null
    login: (user: User) => void
    logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(() => {
        const stored = sessionStorage.getItem('user')
        return stored ? JSON.parse(stored) : null
    })

    const login = useCallback((u: User) => {
        sessionStorage.setItem('user', JSON.stringify(u))
        setUser(u)
    }, [])

    const logout = useCallback(() => {
        sessionStorage.removeItem('user')
        setUser(null)
    }, [])

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used within AuthProvider')
    return ctx
}
