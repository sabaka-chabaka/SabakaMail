import type { User, Mail, CreateUserRequest, SendMailRequest } from '../types'

const BASE = '/api'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${BASE}${path}`, {
        headers: { 'Content-Type': 'application/json' },
        ...options,
    })
    if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: res.statusText }))
        throw new Error(err.detail ?? 'Request failed')
    }
    if (res.status === 204) return undefined as T
    return res.json()
}

export const usersApi = {
    getAll: () => request<User[]>('/users'),
    getById: (id: string) => request<User>(`/users/${id}`),
    create: (body: CreateUserRequest) =>
        request<User>('/users', { method: 'POST', body: JSON.stringify(body) }),
    update: (id: string, body: { name: string; email: string }) =>
        request<void>(`/users/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    delete: (id: string) => request<void>(`/users/${id}`, { method: 'DELETE' }),
}

export const mailsApi = {
    getById: (id: string) => request<Mail>(`/mails/${id}`),
    getInbox: (userId: string) => request<Mail[]>(`/mails/inbox/${userId}`),
    getSent: (userId: string) => request<Mail[]>(`/mails/sent/${userId}`),
    send: (senderId: string, body: SendMailRequest) =>
        request<Mail>(`/mails/send/${senderId}`, { method: 'POST', body: JSON.stringify(body) }),
    delete: (id: string) => request<void>(`/mails/${id}`, { method: 'DELETE' }),
}
