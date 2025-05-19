import { useEffect } from 'react';
import PageWrapper from '../components/PageWrapper';
import NotificationList from '../components/notification/NotificationList';
import { useNotification } from '../hooks/useNotification';
import { useScroll } from '../hooks/useScroll';

const Notification = () => {
    const { markAllAsRead, getNotifications, getUnreadCount } = useNotification();
    const isVisible = useScroll();

    useEffect(() => {
        const markAllNotificationsAsRead = async () => {
            await markAllAsRead();
            await getNotifications();
            await getUnreadCount();
        };
        markAllNotificationsAsRead();
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center">
            <div 
                className={`w-full bg-gradient-to-b from-gray-900 to-gray-800 sticky top-0 z-10 
                    transition-all duration-500 ease-in-out transform-gpu backdrop-blur-sm
                    ${isVisible 
                        ? 'translate-y-0 opacity-100 scale-100' 
                        : '-translate-y-full opacity-0 scale-95'}`}
            >
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-2xl font-bold p-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                        Notifications
                    </h1>
                </div>
            </div>
            <PageWrapper>
                <div className="pt-5 pb-16">
                    <div className="bg-gray-800/30 rounded-xl">
                        <NotificationList />
                    </div>
                </div>
            </PageWrapper>
        </div>
    );
};

export default Notification;
