'use client';

import { useState } from 'react';
import PageWrapper from '../components/PageWrapper';
import NotificationList from '../components/notification/NotificationList';
import { useNotification } from '../hooks/useNotification';

const Notification = () => {
    const { markAllAsRead } = useNotification();
    const [refreshKey, setRefreshKey] = useState(0);

    const handleMarkAllAsRead = async () => {
        await markAllAsRead();
        // Force refresh of notification list by updating the key
        setRefreshKey(prev => prev + 1);
    };

    return (
        <PageWrapper>
            <div className="pt-5 pb-16 flex flex-col items-center overflow-y-auto">
                {/* Header section */}
                <header className="mb-3 w-full scroll-mb-2">
                    <div className="px-4 flex justify-between items-center">
                        <h1 className="text-4xl font-semibold mb-3">
                            Notifications
                        </h1>
                        <button
                            onClick={handleMarkAllAsRead}
                            className="text-sm text-blue-400 hover:text-blue-300"
                        >
                            Mark all as read
                        </button>
                    </div>
                </header>

                {/* Notifications List with key for forcing refresh */}
                <NotificationList key={refreshKey} />
            </div>
        </PageWrapper>
    );
};

export default Notification;
