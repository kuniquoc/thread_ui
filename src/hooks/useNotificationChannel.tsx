import { useCallback } from 'react';
import { usePusher } from './usePusher';
import { useUser } from './useUser';

interface NotificationEvent {
    type: 'new_notification';
    notification_id: number;
    notification_type: string;
    content: string;
}

export const useNotificationChannel = (onNewNotification?: (data: NotificationEvent) => void) => {
    const { user } = useUser();

    const handlePusherEvent = useCallback((data: any) => {
        if (data.type === 'new_notification' && onNewNotification) {
            onNewNotification(data as NotificationEvent);
        }
    }, [onNewNotification]);

    // Subscribe to user's notification channel when logged in
    usePusher(user ? `user_${user.id}` : '', handlePusherEvent);
};
