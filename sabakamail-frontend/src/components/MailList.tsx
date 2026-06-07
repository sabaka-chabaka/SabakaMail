import type { Mail, User } from '../types'

interface Props {
    mails: Mail[]
    users: User[]
    selectedId: string | null
    folder: 'inbox' | 'sent'
    currentUserId: string
    onSelect: (mail: Mail) => void
}

export default function MailList({ mails, users, selectedId, folder, currentUserId, onSelect }: Props) {
    if (mails.length === 0) {
        return <div className="mail-list-empty">No messages</div>
    }

    return (
        <div className="mail-list">
            {mails.map(mail => {
                    const otherId = folder === 'inbox' ? mail.senderId : mail.recipientId
                    const other = users.find(u => u.id === otherId)
                    const isMe = otherId === currentUserId

                    return (
                        <div
                            key={mail.id}
                    className={`mail-row ${selectedId === mail.id ? 'selected' : ''}`}
                    onClick={() => onSelect(mail)}
                >
                    <div className="mail-row-avatar">
                        {(other?.name ?? (isMe ? 'Me' : '?'))[0].toUpperCase()}
                    </div>
                    <div className="mail-row-content">
                    <div className="mail-row-top">
                    <span className="mail-row-from">
                        {isMe ? 'me' : (other?.name ?? other?.email ?? 'Unknown')}
                        </span>
                        </div>
                        <div className="mail-row-subject">{mail.subject}</div>
                        <div className="mail-row-preview">{mail.body.slice(0, 80)}</div>
                        </div>
                        </div>
                )
                })}
            </div>
    )
}
