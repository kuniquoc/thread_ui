import { FiHeart, FiMessageCircle, FiUser } from 'react-icons/fi';
import { Notification } from '../../types/NotificationTypes';
import { formatDistanceToNow } from 'date-fns';

interface NotificationItemProps {
    notification: Notification;
    onMarkAsRead: (id: number) => void;
}

const NotificationItem = ({ notification, onMarkAsRead }: NotificationItemProps) => {
    // Determine notification type based on content
    const getNotificationType = (content: string): 'like' | 'reply' | 'follow' => {
        if (content.includes('liked')) return 'like';
        if (content.includes('replied')) return 'reply';
        if (content.includes('followed')) return 'follow';
        return 'follow'; // Default to follow if unknown
    };

    const notificationType = getNotificationType(notification.content);

    // Format time
    const formattedTime = formatDistanceToNow(new Date(notification.created_at), { addSuffix: true });

    return (
        <div
            className={`px-4 w-full my-4 flex justify-between items-start ${!notification.is_read ? 'bg-opacity-10 bg-blue-400' : ''}`}
            onClick={() => !notification.is_read && onMarkAsRead(notification.id)}
        >
            <div className="flex w-full gap-4">
                <div className="flex items-start text-center">
                    <img
                        src={notification.actioner.avatar}
                        alt="User Avatar"
                        width={35}
                        height={35}
                        className="rounded-full"
                    />
                    <div className="">
                        {notificationType === 'like' ? (
                            <div className="bg-red-500 p-[3px] rounded-full -ml-3 mt-3.5 border-2 border-[#222]">
                                <FiHeart className=" fill-white text-[9px]" />
                            </div>
                        ) : notificationType === 'reply' ? (
                            <div className="bg-blue-400 p-[3px] rounded-full -ml-3 mt-3.5 border-2 border-[#222]">
                                <FiMessageCircle className=" fill-white text-[9px]" />
                            </div>
                        ) : (
                            <div className="bg-purple-600 p-[3px] rounded-full -ml-3 mt-3.5 border-2 border-[#222]">
                                <FiUser className=" fill-white text-[9px]" />
                            </div>
                        )}
                    </div>
                </div>
                <div className="w-full">
                    <div className="">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                                <p className="text-md">{notification.actioner.username}</p>
                                {/* Assuming verified status might be added to the User type in the future */}
                            </div>
                            <span className="text-xs text-[#666]">
                                {formattedTime}
                            </span>
                        </div>
                        <div className="mt-0.5 text-sm text-[#777]">
                            {notification.content}
                        </div>
                    </div>
                </div>
            </div>
            {notificationType === 'follow' ? (
                <div className="text-gray-300 flex justify-end text-xs">
                    <button className="border border-[#333] px-6 py-1.5 rounded-lg">
                        Follow
                    </button>
                </div>
            ) : (
                ''
            )}
        </div>
    );
};

export default NotificationItem;
