import { useState } from 'react'
import { mailsApi, usersApi } from '../api'
import { useAuth } from '../hooks/useAuth'
import type { User } from '../types'

interface Props {
    onClose: () => void
    onSent: () => void
}

export default function ComposeModal({ onClose, onSent }: Props) {
    const { user } = useAuth()
    const [to, setTo] = useState('')
    const [subject, setSubject] = useState('')
    const [body, setBody] = useState('')
    const [error, setError] = useState('')
    const [sending, setSending] = useState(false)

    async function handleSend() {
        if (!user) return
        setError('')
        setSending(true)
        try {
            const users = await usersApi.getAll()
            const recipient = users.find((u: User) => u.email === to)
            if (!recipient) {
                setError(`No user found with email "${to}"`)
                return
            }
            await mailsApi.send(user.id, {
                subject: subject || '(no subject)',
                body,
                recipientId: recipient.id,
            })
            onSent()
            onClose()
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : 'Failed to send')
        } finally {
            setSending(false)
        }
    }

    return (
        <div className="compose-overlay" onClick={onClose}>
            <div className="compose-modal" onClick={e => e.stopPropagation()}>
                <div className="compose-header">
                    <span>New message</span>
                    <button className="compose-close" onClick={onClose}>✕</button>
                </div>
                <input
                    className="compose-field"
                    placeholder="To"
                    value={to}
                    onChange={e => setTo(e.target.value)}
                />
                <input
                    className="compose-field"
                    placeholder="Subject"
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                />
                <textarea
                    className="compose-body"
                    placeholder="Write your message…"
                    value={body}
                    onChange={e => setBody(e.target.value)}
                />
                {error && <p className="compose-error">{error}</p>}
                <div className="compose-footer">
                    <button
                        className="compose-send"
                        onClick={handleSend}
                        disabled={sending || !to}
                    >
                        {sending ? 'Sending…' : 'Send'}
                    </button>
                </div>
            </div>
        </div>
    )
}
