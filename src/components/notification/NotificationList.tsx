import { useEffect } from 'react';
import { useNotification } from '../../hooks/useNotification';
import NotificationItem from './NotificationItem';
import { FiBell } from 'react-icons/fi';

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
        getNotifications();
    };

    if (loading && notifications.length === 0) {
        return (
            <div className="flex justify-center items-center p-12">
                <div className="w-8 h-8 rounded-full border-2 border-gray-700 border-t-blue-500 animate-spin"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center p-6 text-red-400 bg-red-900/20 rounded-lg border border-red-800">
                {error}
            </div>
        );
    }

    if (notifications.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 px-6">
                <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mb-4">
                    <FiBell className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">No notifications yet</h3>
                <p className="text-gray-400 text-center">We'll notify you when something happens</p>
            </div>
        );
    }

    return (
        <div className="divide-y divide-gray-700/30">
            {notifications.map((notification) => (
                <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={handleMarkAsRead}
                />
            ))}
        </div>
    );
};

export default NotificationList;
