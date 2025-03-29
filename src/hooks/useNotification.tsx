import { useState } from 'react';
import { NotificationType, NotificationReadResponse, NotificationCountResponse, NotificationMarkAllReadResponse, PaginatedResponse } from '../types/AppTypes';
import { API_BASE_URL } from '../config/api';

const API_URL = `${API_BASE_URL}/api`;

export const useNotification = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getNotifications = async (): Promise<PaginatedResponse<NotificationType> | null> => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`${API_URL}/notifications/`, {
                credentials: 'include',
            });
            if (!response.ok) throw new Error('Failed to fetch notifications');
            const data = await response.json();
            return data;
        } catch (err: any) {
            setError(err.message);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (notificationId: number): Promise<NotificationReadResponse | null> => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`${API_URL}/notifications/${notificationId}/read/`, {
                method: 'POST',
                credentials: 'include',
            });
            if (!response.ok) throw new Error('Failed to mark notification as read');
            const data = await response.json();
            return data;
        } catch (err: any) {
            setError(err.message);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const markAllAsRead = async (): Promise<NotificationMarkAllReadResponse | null> => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`${API_URL}/notifications/mark-all-read/`, {
                method: 'POST',
                credentials: 'include',
            });
            if (!response.ok) throw new Error('Failed to mark all notifications as read');
            const data = await response.json();
            return data;
        } catch (err: any) {
            setError(err.message);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const getUnreadCount = async (): Promise<NotificationCountResponse | null> => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`${API_URL}/notifications/unread/count/`, {
                credentials: 'include',
            });
            if (!response.ok) throw new Error('Failed to fetch unread notifications count');
            const data = await response.json();
            return data;
        } catch (err: any) {
            setError(err.message);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        getNotifications,
        markAsRead,
        markAllAsRead,
        getUnreadCount,
    };
};