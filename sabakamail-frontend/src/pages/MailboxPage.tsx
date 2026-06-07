import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { mailsApi, usersApi } from '../api'
import { useAuth } from '../hooks/useAuth'
import type { Mail, User } from '../types'
import MailList from '../components/MailList'
import MailView from '../components/MailView'
import ComposeModal from '../components/ComposeModal'
import ProfileModal from '../components/ProfileModal'

type Folder = 'inbox' | 'sent'

export default function MailboxPage() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const [folder, setFolder] = useState<Folder>('inbox')
    const [mails, setMails] = useState<Mail[]>([])
    const [users, setUsers] = useState<User[]>([])
    const [selected, setSelected] = useState<Mail | null>(null)
    const [compose, setCompose] = useState(false)
    const [profile, setProfile] = useState(false)
    const [loading, setLoading] = useState(false)

    const fetchMails = useCallback(async () => {
        if (!user) return
        setLoading(true)
        try {
            const data = folder === 'inbox'
                ? await mailsApi.getInbox(user.id)
                : await mailsApi.getSent(user.id)
            setMails(data)
            setSelected(null)
        } finally {
            setLoading(false)
        }
    }, [user, folder])

    useEffect(() => {
        if (!user) {
            navigate('/login')
            return
        }
        usersApi.getAll().then(setUsers)
        fetchMails()
    }, [user, navigate, fetchMails])

    async function handleDelete(id: string) {
        await mailsApi.delete(id)
        setSelected(null)
        fetchMails()
    }

    function handleLogout() {
        logout()
        navigate('/login')
    }

    return (
        <div className="app-root">
            <aside className="sidebar">
                <div className="sidebar-logo">
                    <span className="sidebar-logo-icon">✉</span>
                    <span>SabakaMail</span>
                </div>

                <button className="compose-btn" onClick={() => setCompose(true)}>
                    + Compose
                </button>

                <nav className="sidebar-nav">
                    <button
                        className={`nav-item ${folder === 'inbox' ? 'active' : ''}`}
                        onClick={() => setFolder('inbox')}
                    >
                        <span className="nav-icon">📥</span>
                        Inbox
                    </button>
                    <button
                        className={`nav-item ${folder === 'sent' ? 'active' : ''}`}
                        onClick={() => setFolder('sent')}
                    >
                        <span className="nav-icon">📤</span>
                        Sent
                    </button>
                </nav>

                <div className="sidebar-footer">
                    <button className="sidebar-user" onClick={() => setProfile(true)}>
                        <div className="sidebar-avatar">{user?.name[0].toUpperCase()}</div>
                        <div className="sidebar-user-info">
                            <span className="sidebar-user-name">{user?.name}</span>
                            <span className="sidebar-user-email">{user?.email}</span>
                        </div>
                    </button>
                    <button className="logout-btn" onClick={handleLogout} title="Sign out">
                        ⎋
                    </button>
                </div>
            </aside>

            <main className="main">
                <div className="main-header">
                    <h1 className="main-title">{folder === 'inbox' ? 'Inbox' : 'Sent'}</h1>
                    <button className="refresh-btn" onClick={fetchMails} title="Refresh">
                        ↻
                    </button>
                </div>

                {loading ? (
                    <div className="loading">Loading…</div>
                ) : selected ? (
                    <MailView
                        mail={selected}
                        users={users}
                        onBack={() => setSelected(null)}
                        onDelete={handleDelete}
                    />
                ) : (
                    <MailList
                        mails={mails}
                        users={users}
                        selectedId={selected}
                        folder={folder}
                        currentUserId={user?.id ?? ''}
                        onSelect={setSelected}
                    />
                )}
            </main>

            {compose && (
                <ComposeModal
                    onClose={() => setCompose(false)}
                    onSent={fetchMails}
                />
            )}

            {profile && (
                <ProfileModal onClose={() => setProfile(false)} />
            )}
        </div>
    )
}
