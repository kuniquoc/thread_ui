import { useEffect } from 'react';
import { useNotification } from '../../hooks/useNotification';
import NotificationItem from './NotificationItem';

const NotificationList = () => {
    const {
        notifications,
        loading,
        error,
        getNotifications,
        markAsRead
    } = useNotification();

    useEffect(() => {
        getNotifications();
    }, []);

    const handleMarkAsRead = async (id: number) => {
        await markAsRead(id);
        // Refresh notifications after marking as read
        getNotifications();
    };

    if (loading && notifications.length === 0) {
        return <div className="text-center py-4">Loading notifications...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500 py-4">Error: {error}</div>;
    }

    if (notifications.length === 0) {
        return <div className="text-center py-4">No notifications found</div>;
    }

    return (
        <div className="notifications-container w-full">
            {notifications.map((notification, index) => (
                <div key={notification.id} className="w-full">
                    <NotificationItem
                        notification={notification}
                        onMarkAsRead={handleMarkAsRead}
                    />
                    {index < notifications.length - 1 && (
                        <div className="border border-[#222] border-opacity-70 w-full"></div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default NotificationList;
