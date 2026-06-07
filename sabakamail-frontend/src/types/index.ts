export interface User {
    id: string
    name: string
    email: string
}

export interface Mail {
    id: string
    subject: string
    body: string
    senderId: string
    recipientId: string
}

export interface CreateUserRequest {
    name: string
    email: string
    password: string
}

export interface SendMailRequest {
    subject: string
    body: string
    recipientId: string
}
