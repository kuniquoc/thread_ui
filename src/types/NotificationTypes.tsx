import { PaginatedResponse } from './AppTypes';

export interface User {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    avatar: string;
    date_joined: string;
}

export interface Notification {
    id: number;
    user: User;
    actioner: User;
    content: string;
    created_at: string;
    is_read: boolean;
}

export interface NotificationsResponse extends PaginatedResponse<Notification> { }

export interface UnreadCountResponse {
    count: number;
}

export interface MarkReadResponse {
    id: number;
    is_read: boolean;
}

export interface MarkAllReadResponse {
    message: string;
}

// Parameters for API calls
export interface GetNotificationsParams {
    page?: number;
    is_read?: boolean;
}
