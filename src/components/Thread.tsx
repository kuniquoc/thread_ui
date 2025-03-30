import {
    FiHeart,
    FiMessageCircle,
    FiMoreHorizontal,
    FiNavigation,
    FiRepeat,
} from 'react-icons/fi';
import RonaldoAvatar from '/avatars/ronaldo-avatar.jpg';
import BlueCheckmark from '/avatars/blue-checkmark.png';

import cn from 'classnames';
import { Thread } from '../types/ThreadTypes';

// Utility function to format date and time
const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);

    // Format time: HH:MM
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const time = `${hours}:${minutes}`;

    // Format date: DD/MM/YYYY
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;

    return `${time} · ${formattedDate}`;
};

const ThreadComponent = ({
    // id,
    content,
    user,
    images,
    created_at,
    // comments,
    likes_count,
    is_liked,
    // reposts_count,
    is_reposted,
    comment_count,
}: Thread) => {
    // Format the created_at string
    const formattedDateTime = formatDateTime(created_at);

    return (
        <div className="px-4 my-4 w-200 font-sans">
            {is_reposted ? (
                <div className="flex justify-start items-center gap-2 ml-4 text-xs mb-1 text-[#777]">
                    <FiRepeat className="-rotate-12 sm:text-xl" />
                    <span>Reposted</span>
                </div>
            ) : (
                ''
            )}
            <div className="flex justify-start gap-8">
                <div
                    className={cn(
                        comment_count > 0
                            ? 'relative border-l-2 border-[#333] border-opacity-70 ml-2'
                            : 'relative ml-2.5'
                    )}
                >
                    <div className="flex -ml-7 flex-col w-14 h-full justify-between items-center shrink-0 absolute">
                        <div>
                            <img
                                src={user.avatar}
                                width={35}
                                height={35}
                                alt="Account Avatar"
                                className="rounded-full"
                            />
                        </div>
                        {comment_count > 0 ? (
                            <div className="flex flex-col justify-center items-center">
                                <img
                                    src={RonaldoAvatar}
                                    width={14}
                                    height={14}
                                    alt="Account Avatar"
                                    className="rounded-full"
                                />
                            </div>
                        ) : (
                            ''
                        )}
                    </div>
                </div>
                <div className="flex flex-col w-full">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 w-full">
                            <p className="text-md sm:text-lg font-medium">
                                {user.username}
                            </p>
                            {/* Assuming we'd have isVerified in user, using a placeholder for now */}
                            {user.username.includes('verified') ? (
                                <img
                                    src={BlueCheckmark}
                                    width={14}
                                    height={14}
                                    alt="Blue Checkmark"
                                    className="rounded-full w-4 sm:w-5"
                                />
                            ) : (
                                ''
                            )}
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-xs sm:text-sm text-gray-500">
                                {formattedDateTime}
                            </span>
                            <a href="#">
                                <FiMoreHorizontal className="text-gray-100" />
                            </a>
                        </div>
                    </div>

                    <div className="">
                        <div className="mt-1">
                            <p className="text-xs sm:text-sm text-gray-200">
                                {content}
                            </p>
                            {/* Assuming mentions would be part of content in this model */}
                            <div className="mt-2">
                                {images && images.length > 0 && (
                                    <div className="image-carousel">
                                        {images.map((img) => (
                                            <img
                                                key={img.id}
                                                src={img.image}
                                                alt="Thread image"
                                                className="rounded-md mt-2"
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-4 mt-3 sm:mt-4">
                            <button type="button">
                                <FiHeart
                                    className={
                                        is_liked
                                            ? 'fill-red-600 text-red-600 sm:text-xl'
                                            : 'fill-none text-gray-100 sm:text-xl'
                                    }
                                />
                            </button>
                            <button type="button">
                                <FiMessageCircle className="text-gray-100 -rotate-90 sm:text-xl" />
                            </button>
                            <button type="button">
                                <FiRepeat className="text-gray-100  -rotate-12 sm:text-xl" />
                            </button>
                            <button type="button">
                                <FiNavigation className="text-gray-100 sm:text-xl" />
                            </button>
                        </div>
                        <div className="flex items-start gap-2 text-gray-500 mt-4 text-xs sm:text-[14px] text-center">
                            {comment_count > 0 ? <p>{comment_count} replies</p> : ''}
                            {comment_count > 0 && likes_count > 0 ? <span>.</span> : ''}
                            {likes_count > 0 ? <p>{likes_count} likes</p> : ''}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ThreadComponent;
