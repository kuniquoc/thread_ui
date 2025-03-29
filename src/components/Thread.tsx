import {
    FiHeart,
    FiMessageCircle,
    FiMoreHorizontal,
    FiNavigation,
    FiRepeat,
} from 'react-icons/fi';
import RonaldoAvatar from '/avatars/ronaldo-avatar.jpg';
import BlueCheckmark from '/avatars/blue-checkmark.png';

import { Link } from 'react-router-dom';
import cn from 'classnames';
import { useEffect, useState } from 'react';
import { useThread } from '../hooks/useThread';
import { ThreadType, ThreadImageType } from '../types/AppTypes';

interface ThreadProps {
    threadId: string;
}

const Thread = ({ threadId }: ThreadProps) => {
    const { getThreadById, loading, error, likeThread, repostThread } = useThread();
    const [thread, setThread] = useState<ThreadType | null>(null);
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);
    const [isReposted, setIsReposted] = useState(false);
    const [repostsCount, setRepostsCount] = useState(0);

    useEffect(() => {
        const fetchThread = async () => {
            try {
                const threadData = await getThreadById(threadId);
                if (threadData) {
                    setThread(threadData);
                    setIsLiked(threadData.is_liked);
                    setLikesCount(threadData.likes_count);
                    setIsReposted(threadData.is_reposted);
                    setRepostsCount(threadData.reposts_count);
                }
            } catch (err) {
                console.error("Error fetching thread:", err);
            }
        };

        fetchThread();
    }, [threadId, getThreadById]);

    const handleLike = async () => {
        if (!thread) return;

        try {
            const response = await likeThread(Number(thread.id));
            if (response) {
                setIsLiked(response.is_liked);
                setLikesCount(response.likes_count);
            }
        } catch (err) {
            console.error("Error liking thread:", err);
        }
    };

    const handleRepost = async () => {
        if (!thread) return;

        try {
            const response = await repostThread(Number(thread.id));
            if (response) {
                setIsReposted(response.is_reposted);
                setRepostsCount(response.reposts_count);
            }
        } catch (err) {
            console.error("Error reposting thread:", err);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!thread) return null;

    const {
        avatar,
        username,
        isVerified,
        content,
        created_at,
        mentions,
        is_reposted,
        repostedBy,
        images,
        comment_count,
    } = thread;

    return (
        <div className="px-4 my-4 w-full font-sans">
            {is_reposted ? (
                <div className="flex justify-start items-center gap-2 ml-4 text-xs mb-1 text-[#777]">
                    <FiRepeat className="-rotate-12 sm:text-xl" />
                    <span>{repostedBy} reposted</span>
                </div>
            ) : null}
            <div className="flex justify-start gap-8">
                <div
                    className={cn(
                        comment_count
                            ? 'relative border-l-2 border-[#333] border-opacity-70 ml-2'
                            : 'relative ml-2.5'
                    )}
                >
                    <div className="flex -ml-7 flex-col w-14 h-full justify-between items-center shrink-0 absolute">
                        <div>
                            <img
                                src={avatar || ''}
                                width={35}
                                height={35}
                                alt="Account Avatar"
                                className="rounded-full"
                            />
                        </div>
                        {comment_count ? (
                            <div className="flex flex-col justify-center items-center">
                                <img
                                    src={RonaldoAvatar || ''}
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
                                {username}
                            </p>
                            {isVerified && BlueCheckmark && (
                                <img
                                    src={BlueCheckmark}
                                    width={14}
                                    height={14}
                                    alt="Blue Checkmark"
                                    className="rounded-full w-4 sm:w-5"
                                />
                            )}
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-xs sm:text-sm text-gray-500">
                                {created_at}
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
                            {mentions && (
                                <Link to="/" className="text-blue-400">
                                    {mentions}
                                </Link>
                            )}
                            {images && images.length > 0 && (
                                <div className="mt-2">
                                    <div className={`grid ${images.length > 1 ? 'grid-cols-2 gap-1' : 'grid-cols-1'}`}>
                                        {images.map((img: ThreadImageType, index: number) => (
                                            <img
                                                key={index}
                                                src={img.image}
                                                alt={`Thread image ${index + 1}`}
                                                className="rounded-md w-full h-auto object-cover"
                                                style={{ maxHeight: images.length > 1 ? '200px' : '400px' }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-4 mt-3 sm:mt-4">
                            <button type="button" onClick={handleLike}>
                                <FiHeart
                                    className={
                                        isLiked
                                            ? 'fill-red-600 text-red-600 sm:text-xl'
                                            : 'fill-none text-gray-100 sm:text-xl'
                                    }
                                />
                            </button>
                            <button type="button">
                                <FiMessageCircle className="text-gray-100 -rotate-90 sm:text-xl" />
                            </button>
                            <button type="button" onClick={handleRepost}>
                                <FiRepeat
                                    className={
                                        isReposted
                                            ? 'text-green-500 -rotate-12 sm:text-xl'
                                            : 'text-gray-100 -rotate-12 sm:text-xl'
                                    }
                                />
                            </button>
                            <button type="button">
                                <FiNavigation className="text-gray-100 sm:text-xl" />
                            </button>
                        </div>
                        <div className="flex items-start gap-2 text-gray-500 mt-4 text-xs sm:text-[14px] text-center">
                            {comment_count ? <p>{comment_count} replies</p> : null}
                            {comment_count && likesCount ? <span>·</span> : null}
                            {likesCount ? <p>{likesCount} likes</p> : null}
                            {(comment_count || likesCount) && repostsCount ? <span>·</span> : null}
                            {repostsCount ? <p>{repostsCount} reposts</p> : null}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Thread;
