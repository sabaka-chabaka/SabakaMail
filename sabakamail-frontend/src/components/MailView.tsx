import type { Mail, User } from '../types'

interface Props {
    mail: Mail
    users: User[]
    onBack: () => void
    onDelete: (id: string) => void
}

export default function MailView({ mail, users, onBack, onDelete }: Props) {
    const sender = users.find(u => u.id === mail.senderId)
    const recipient = users.find(u => u.id === mail.recipientId)

    return (
        <div className="mail-view">
            <div className="mail-view-toolbar">
                <button className="icon-btn" onClick={onBack} title="Back">
                    ←
                </button>
                <button
                    className="icon-btn danger"
                    onClick={() => onDelete(mail.id)}
                    title="Delete"
                >
                    🗑
                </button>
            </div>

            <h2 className="mail-view-subject">{mail.subject}</h2>

            <div className="mail-view-meta">
                <div className="mail-view-avatar">
                    {(sender?.name ?? '?')[0].toUpperCase()}
                </div>
                <div className="mail-view-from-info">
                    <span className="mail-view-from-name">{sender?.name ?? 'Unknown'}</span>
                    <span className="mail-view-from-email">&lt;{sender?.email ?? ''}&gt;</span>
                    <span className="mail-view-to">
            to {recipient?.email ?? mail.recipientId}
          </span>
                </div>
            </div>

            <div className="mail-view-body">{mail.body}</div>
        </div>
    )
}
