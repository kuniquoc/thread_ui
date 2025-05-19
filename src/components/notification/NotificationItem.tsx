// import { FiHeart, FiMessageCircle, FiUser } from 'react-icons/fi';
import { Notification } from '../../types/NotificationTypes';
import { formatDistanceToNow } from 'date-fns';

interface NotificationItemProps {
    notification: Notification;
    onMarkAsRead: (id: number) => void;
}

const NotificationItem = ({ notification, onMarkAsRead }: NotificationItemProps) => {
    // const getNotificationType = (content: string): 'like' | 'reply' | 'follow' => {
    //     if (content.includes('liked')) return 'like';
    //     if (content.includes('replied')) return 'reply';
    //     if (content.includes('followed')) return 'follow';
    //     return 'follow';
    // };

    // const notificationType = getNotificationType(notification.content);
    const formattedTime = formatDistanceToNow(new Date(notification.created_at), { addSuffix: true });

    return (
        <div
            className={`p-4 transition-all duration-200 hover:bg-gray-800/50 ${!notification.is_read ? 'bg-gray-800/30' : ''}`}
            onClick={() => !notification.is_read && onMarkAsRead(notification.id)}
        >
            <div className="flex w-full gap-4">
                <div className="flex items-start text-center">
                    <div className="relative">
                        <img
                            src={notification.actioner.avatar}
                            alt="User Avatar"
                            width={40}
                            height={40}
                            className="rounded-full border-2 border-gray-700"
                        />
                        {/* {notificationType === 'like' ? (
                            <div className="absolute -right-1 bottom-0 bg-gradient-to-r from-red-500 to-pink-500 p-1.5 rounded-full border-2 border-gray-900">
                                <FiHeart className="fill-white text-white text-[10px]" />
                            </div>
                        ) : notificationType === 'reply' ? (
                            <div className="absolute -right-1 bottom-0 bg-gradient-to-r from-blue-500 to-cyan-500 p-1.5 rounded-full border-2 border-gray-900">
                                <FiMessageCircle className="fill-white text-white text-[10px]" />
                            </div>
                        ) : (
                            <div className="absolute -right-1 bottom-0 bg-gradient-to-r from-purple-500 to-pink-500 p-1.5 rounded-full border-2 border-gray-900">
                                <FiUser className="fill-white text-white text-[10px]" />
                            </div>
                        )} */}
                    </div>
                </div>

                <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                            <p className="font-medium text-white">{notification.actioner.username}</p>
                        </div>
                        <span className="text-xs text-gray-400">
                            {formattedTime}
                        </span>
                    </div>
                    <p className="text-sm text-gray-300">
                        {notification.content}
                    </p>
                </div>
            </div>

            {/* {notificationType === 'follow' && (
                <div className="mt-3 flex justify-end">
                    <button className="px-4 py-1.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-full hover:from-blue-500 hover:to-purple-500 transition-all duration-300 transform hover:-translate-y-0.5">
                        Follow back
                    </button>
                </div>
            )} */}
        </div>
    );
};

export default NotificationItem;
