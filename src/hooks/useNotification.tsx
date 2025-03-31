import { useState } from 'react';
import {
    Notification,
    NotificationsResponse,
    UnreadCountResponse,
    MarkReadResponse,
    MarkAllReadResponse,
    GetNotificationsParams
} from '../types/NotificationTypes';
import { API_BASE_URL } from '../config/api';
import { useCSRF } from './useCSRF';

const API_URL = `${API_BASE_URL}/api`;

export const useNotification = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const { token: csrfToken, fetchCSRFToken } = useCSRF();

    const getNotifications = async (params?: GetNotificationsParams): Promise<NotificationsResponse | null> => {
        setLoading(true);
        setError(null);
        try {
            // Ensure we have a CSRF token
            const token = csrfToken || await fetchCSRFToken();
            if (!token) {
                throw new Error('Failed to get CSRF token');
            }

            // Build query params
            const queryParams = new URLSearchParams();
            if (params?.page) queryParams.append('page', params.page.toString());
            if (params?.is_read !== undefined) queryParams.append('is_read', params.is_read.toString());

            const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';

            const response = await fetch(`${API_URL}/notifications/${queryString}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFTOKEN': token
                },
                credentials: 'include',
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Failed to fetch notifications');
            }

            setNotifications(result.results);
            return result;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch notifications');
            return null;
        } finally {
            setLoading(false);
        }
    };

    const getUnreadCount = async (): Promise<UnreadCountResponse | null> => {
        setLoading(true);
        setError(null);
        try {
            // Ensure we have a CSRF token
            const token = csrfToken || await fetchCSRFToken();
            if (!token) {
                throw new Error('Failed to get CSRF token');
            }

            const response = await fetch(`${API_URL}/notifications/unread_count/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFTOKEN': token
                },
                credentials: 'include',
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Failed to fetch unread notifications count');
            }

            return result;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch unread notifications count');
            return null;
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (notificationId: number): Promise<MarkReadResponse | null> => {
        setLoading(true);
        setError(null);
        try {
            // Ensure we have a CSRF token
            const token = csrfToken || await fetchCSRFToken();
            if (!token) {
                throw new Error('Failed to get CSRF token');
            }

            const response = await fetch(`${API_URL}/notifications/${notificationId}/mark_read/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFTOKEN': token
                },
                credentials: 'include',
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Failed to mark notification as read');
            }

            return result;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to mark notification as read');
            return null;
        } finally {
            setLoading(false);
        }
    };

    const markAllAsRead = async (): Promise<MarkAllReadResponse | null> => {
        setLoading(true);
        setError(null);
        try {
            // Ensure we have a CSRF token
            const token = csrfToken || await fetchCSRFToken();
            if (!token) {
                throw new Error('Failed to get CSRF token');
            }

            const response = await fetch(`${API_URL}/notifications/mark_all_read/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFTOKEN': token
                },
                credentials: 'include',
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Failed to mark all notifications as read');
            }

            return result;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to mark all notifications as read');
            return null;
        } finally {
            setLoading(false);
        }
    };

    const getUnreadNotifications = async (page: number = 1): Promise<NotificationsResponse | null> => {
        return getNotifications({ page, is_read: false });
    };

    return {
        notifications,
        loading,
        error,
        getNotifications,
        getUnreadNotifications,
        getUnreadCount,
        markAsRead,
        markAllAsRead,
    };
};