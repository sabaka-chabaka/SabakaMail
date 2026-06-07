import { useState } from 'react'
import { usersApi } from '../api'
import { useAuth } from '../hooks/useAuth'

interface Props {
    onClose: () => void
}

export default function ProfileModal({ onClose }: Props) {
    const { user, login, logout } = useAuth()
    const [name, setName] = useState(user?.name ?? '')
    const [email, setEmail] = useState(user?.email ?? '')
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    async function handleSave() {
        if (!user) return
        setSaving(true)
        setError('')
        setSuccess(false)
        try {
            await usersApi.update(user.id, { name, email })
            login({ ...user, name, email })
            setSuccess(true)
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : 'Failed to save')
        } finally {
            setSaving(false)
        }
    }

    async function handleDelete() {
        if (!user) return
        if (!confirm('Delete your account? This cannot be undone.')) return
        try {
            await usersApi.delete(user.id)
            logout()
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : 'Failed to delete account')
        }
    }

    return (
        <div className="compose-overlay" onClick={onClose}>
    <div className="compose-modal" onClick={e => e.stopPropagation()}>
    <div className="compose-header">
        <span>Profile</span>
        <button className="compose-close" onClick={onClose}>✕</button>
    </div>
    <input
    className="compose-field"
    placeholder="Name"
    value={name}
    onChange={e => setName(e.target.value)}
    />
    <input
    className="compose-field"
    type="email"
    placeholder="Email"
    value={email}
    onChange={e => setEmail(e.target.value)}
    />
    {error && <p className="compose-error">{error}</p>}
        {success && <p className="compose-success">Saved successfully</p>}
        <div className="compose-footer profile-footer">
        <button className="compose-send" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : 'Save changes'}
            </button>
            <button className="btn-delete-account" onClick={handleDelete}>
            Delete account
        </button>
        </div>
        </div>
        </div>
        )
        }
