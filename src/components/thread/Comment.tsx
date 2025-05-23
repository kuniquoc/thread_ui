import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    FiHeart,
    FiMessageCircle,
    // FiMoreHorizontal,
    FiRepeat,
} from 'react-icons/fi';
import Reply from './Reply';
import { useComment } from '../../hooks/useComment';
import CommentInput from './CommentInput';
import { formatDateTime } from '../../utils/dateUtils';
import { usePusher } from '../../hooks/usePusher';

// Define interface for the component props
interface CommentProps {
    id: number;
    threadId: number;
    avatar: string;
    username: string;
    userId: number; // Add this new prop
    content: string;
    publishTime: string;
    mentions?: string;
    isLiked: boolean;
    pictures?: React.ReactNode;
    totalReplies?: number;
    totalLikes: number;
    isReposted?: boolean;
    onReplySuccess?: () => void;
}

const Comment = ({
    id,
    threadId,
    avatar,
    username,
    userId,
    content,
    publishTime,
    mentions,
    isLiked: initialIsLiked,
    pictures,
    totalReplies: initialTotalReplies = 0,
    totalLikes: initialTotalLikes,
    isReposted,
    onReplySuccess,
}: CommentProps) => {
    const navigate = useNavigate();
    const repliesLoadedRef = useRef(false);
    const [isLiked, setIsLiked] = useState(initialIsLiked);
    const [totalLikes, setTotalLikes] = useState(initialTotalLikes);
    const [showReplies, setShowReplies] = useState(false);
    const [replies, setReplies] = useState<any[]>([]);
    const [isLoadingReplies, setIsLoadingReplies] = useState(false);
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [totalReplies, setTotalReplies] = useState(initialTotalReplies);
    const [replyToUsername, setReplyToUsername] = useState<string | null>(null);

    const { likeComment, getReplies, createComment } = useComment();

    const handlePusherEvent = async (data: any) => {
        console.log('Received Pusher message on Comment:', data);
        console.log('Comment ID:', id);
        console.log('Thread ID:', threadId);
        console.log('Data:', data);

        // Handle comment like update
        if (data.type === 'comment_like_update' && data.comment_id === id) {
            console.log('Received like update:', data.likes_count);
            setTotalLikes(data.likes_count);
        } 
        // Handle reply like update
        else if (data.type === 'comment_like_update') {
            // Check if this is one of our replies
            if (replies.some(reply => reply.id === data.comment_id)) {
                setReplies(prevReplies => prevReplies.map(reply => {
                    if (reply.id === data.comment_id) {
                        return {
                            ...reply,
                            likes_count: data.likes_count,
                        };
                    }
                    return reply;
                }));
            } else if (showReplies && repliesLoadedRef.current) {
                // If replies are shown but the updated reply isn't in our list,
                // refresh the entire replies list
                try {
                    const repliesData = await getReplies(threadId, id);
                    if (repliesData) {
                        setReplies(repliesData);
                    }
                } catch (error) {
                    console.error('Failed to refresh replies after like update', error);
                }
            }
        }
        // Handle reply updates
        else if (data.type === 'reply_comment' && data.parent_comment_id === id) {
            console.log('Received new reply:', data);
            setTotalReplies(prev => prev + 1);
            
            // Nếu replies đã được load hoặc section đang mở
            if (showReplies || repliesLoadedRef.current) {
                try {
                    const response = await getReplies(threadId, id);
                    if (response) {
                        setReplies(response);
                        repliesLoadedRef.current = true;
                        // Auto expand replies section when receiving new reply
                        setShowReplies(true);
                    }
                } catch (error) {
                    console.error('Failed to load replies', error);
                }
            }
        }
        // Handle reply deletion
        else if (data.type === 'reply_deleted' && data.parent_comment_id === id) {
            console.log('Received reply deletion:', data);
            setTotalReplies(prev => prev - 1);
            if (repliesLoadedRef.current) {
                setReplies(prev => prev.filter(reply => reply.id !== data.reply_id));
            }
        }
    };

    // Subscribe to Pusher channel for this thread
    usePusher(`thread_${threadId}`, handlePusherEvent);

    const handleLike = async () => {
        try {
            const response = await likeComment(threadId, id);
            if (response) {
                setIsLiked(response.is_liked);
                setTotalLikes(response.likes_count);
            }
        } catch (error) {
            console.error('Failed to like/unlike comment', error);
        }
    };

    const handleReply = () => {
        setShowReplyForm(!showReplyForm);
    };

    const handleToggleReplies = async () => {
        if (!showReplies && !repliesLoadedRef.current) {
            setIsLoadingReplies(true);
            try {
                const repliesData = await getReplies(threadId, id);
                if (repliesData) {
                    setReplies(repliesData);
                    repliesLoadedRef.current = true;
                }
            } catch (error) {
                console.error('Failed to fetch replies', error);
            } finally {
                setIsLoadingReplies(false);
            }
        }
        setShowReplies(!showReplies);
    };

    const handleSubmitReply = async (content: string) => {
        try {
            const response = await createComment(threadId, {
                content: content,
                parent_comment_id: id
            });

            if (response) {
                // Tự động cập nhật UI ngay lập tức
                setTotalReplies(prev => prev + 1);
                
                // Load lại replies ngay sau khi tạo reply mới
                const repliesData = await getReplies(threadId, id);
                if (repliesData) {
                    setReplies(repliesData);
                    repliesLoadedRef.current = true;
                }

                // Đảm bảo hiển thị replies section
                setShowReplies(true);
                
                // Đóng form reply
                setShowReplyForm(false);

                // Reset reply to username
                setReplyToUsername(null);

                // Notify parent nếu cần
                if (onReplySuccess) {
                    onReplySuccess();
                }
            }
        } catch (error) {
            console.error('Failed to submit reply', error);
        }
    };

    const handleReplyToReply = (username: string) => {
        setReplyToUsername(username);
        setShowReplyForm(true);
    };

    const handleProfileClick = () => {
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        if (currentUser && currentUser.id === userId) {
            navigate('/profile');
        } else {
            navigate(`/user/${userId}`);
        }
    };

    return (
        <div className="px-4 my-4 font-sans">
            {isReposted && (
                <div className="flex justify-start items-center gap-2 ml-4 text-xs mb-1 text-[#777]">
                    <FiRepeat className="-rotate-12 sm:text-xl" />
                    <span>Reposted</span>
                </div>
            )}
            <div className="flex justify-start gap-8">
                <div className="relative border-l-2 border-[#333] border-opacity-70 ml-2">
                    <div className="flex -ml-7 flex-col w-14 h-full justify-between items-center shrink-0 absolute">
                        <div>
                            <img
                                src={avatar}
                                width={40}
                                height={40}
                                alt="Account Avatar"
                                className="rounded-full cursor-pointer"
                                onClick={handleProfileClick}
                            />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col w-full">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2 w-full">
                                <p className="text-md sm:text-lg font-medium">
                                    {username}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-xs sm:text-sm text-gray-500">
                                {formatDateTime(publishTime)}
                            </span>
                            {/* <a href="#">
                                <FiMoreHorizontal className="text-gray-100" />
                            </a> */}
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
                            {pictures && (
                                <div className="mt-2">
                                    <div className="flex flex-row gap-2 overflow-x-auto py-2">
                                        {Array.isArray(pictures) && pictures.map((img: any, index: number) => (
                                            <div key={index} className="relative flex-shrink-0">
                                                <div className="w-[280px] aspect-[16/9] animate-pulse bg-gray-800/50 rounded-md overflow-hidden">
                                                    <img
                                                        src={img.image || img}
                                                        alt={`Comment image ${index + 1}`}
                                                        className="w-full h-full object-cover opacity-0 transition-opacity duration-300"
                                                        onLoad={(e) => {
                                                            const target = e.target as HTMLImageElement;
                                                            target.classList.remove('opacity-0');
                                                        }}
                                                    />
                                                </div>
                                            </div>
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
                            <button type="button" onClick={handleReply}>
                                <FiMessageCircle className="text-gray-100 -rotate-90 sm:text-xl" />
                            </button>
                        </div>
                        <div className="flex items-start gap-2 text-gray-500 mt-4 text-xs sm:text-[14px] text-center">
                            {totalReplies >= 0 && (
                                <button
                                    className="text-blue-400 hover:underline"
                                    onClick={handleToggleReplies}
                                >
                                    {showReplies ? "Hide replies" : `${totalReplies} replies`}
                                </button>
                            )}
                            {totalReplies >= 0 && totalLikes >= 0 && <span>.</span>}
                            <p>{totalLikes} likes</p>
                        </div>
                    </div>
                </div>
            </div>

            {isLoadingReplies && (
                <div className="ml-16 mt-2 flex justify-center">
                    <div className="w-8 h-8 rounded-full border-2 border-gray-700 border-t-blue-500 animate-spin"></div>
                </div>
            )}

            {showReplies && (
                <div className="ml-16">
                    {replies.length > 0 ? (
                        replies.map((reply) => (
                            <Reply
                                key={reply.id}
                                id={reply.id}
                                threadId={threadId}
                                avatar={reply.user.avatar}
                                username={reply.user.username}
                                userId={reply.user.id}
                                isVerified={reply.user.username.includes('verified')}
                                content={reply.content}
                                publishTime={reply.created_at}
                                isLiked={reply.is_liked}
                                pictures={reply.pictures}
                                totalLikes={reply.likes_count}
                                isReposted={reply.is_reposted}
                                onReplyClick={handleReplyToReply}
                            />
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-6 px-4 text-center">
                            <div className="w-10 h-10 bg-gray-800/50 rounded-full flex items-center justify-center mb-3">
                                <FiMessageCircle className="w-5 h-5 text-gray-400" />
                            </div>
                            <p className="text-gray-400 text-sm">No replies yet</p>
                        </div>
                    )}
                </div>
            )}

            {showReplyForm && (
                <div className="ml-16 mt-4">
                    <CommentInput
                        avatar={JSON.parse(localStorage.getItem('user') || '{}').avatar}
                        onSubmit={(content) => handleSubmitReply(content)}
                        placeholder="Post your reply"
                        initialMention={replyToUsername || username}
                        autoFocus={true}
                    />
                </div>
            )}
        </div>
    );
};

export default Comment;
