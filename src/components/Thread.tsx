import { useState } from 'react';
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
import { useComment } from '../hooks/useComment';
import { useThread } from '../hooks/useThread';
import Comment from './profile/Comment';
import CommentInput from './profile/CommentInput';

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

// Define the type for the component's props, removing the redundant "comments" prop
type ThreadComponentProps = Omit<Thread, 'comments'>;

const ThreadComponent = ({
    id,
    content,
    user,
    images,
    created_at,
    likes_count: initialLikesCount,
    is_liked: initialIsLiked,
    reposts_count: initialRepostsCount,
    is_reposted: initialIsReposted,
    comment_count,
}: ThreadComponentProps) => {
    // State for handling UI interactions
    const [showComments, setShowComments] = useState(false);
    const [showCommentInput, setShowCommentInput] = useState(false);
    const [loadedComments, setLoadedComments] = useState<any[]>([]);
    const [isLoadingComments, setIsLoadingComments] = useState(false);

    // State for tracking likes and reposts
    const [likesCount, setLikesCount] = useState(initialLikesCount);
    const [isLiked, setIsLiked] = useState(initialIsLiked);
    const [repostsCount, setRepostsCount] = useState(initialRepostsCount);
    const [isReposted, setIsReposted] = useState(initialIsReposted);

    // Format the created_at string
    const formattedDateTime = formatDateTime(created_at);

    // Hooks for thread and comment operations
    const { likeThread, repostThread } = useThread();
    const { getComments, createComment } = useComment();

    const handleCommentClick = async () => {
        if (!showComments) {
            setIsLoadingComments(true);
            try {
                const response = await getComments(id);
                if (response) {
                    setLoadedComments(response.results);
                }
            } catch (error) {
                console.error('Failed to load comments', error);
            } finally {
                setIsLoadingComments(false);
            }
        }
        setShowComments(!showComments);
        setShowCommentInput(!showCommentInput);
    };

    const handleLike = async () => {
        try {
            const response = await likeThread(id);
            if (response) {
                setIsLiked(response.is_liked);
                setLikesCount(response.likes_count);
            }
        } catch (error) {
            console.error('Failed to like thread', error);
        }
    };

    const handleRepost = async () => {
        try {
            const response = await repostThread(id);
            if (response) {
                setIsReposted(response.is_reposted);
                setRepostsCount(response.reposts_count);
            }
        } catch (error) {
            console.error('Failed to repost thread', error);
        }
    };

    const handleCommentSubmit = async (content: string) => {
        try {
            const response = await createComment(id, { content, parent_comment_id: null });
            if (response) {
                // Add the new comment to the list
                setLoadedComments([response, ...loadedComments]);
            }
        } catch (error) {
            console.error('Failed to create comment', error);
        }
    };

    const handleReplySuccess = async () => {
        // Refresh comments after a successful reply
        try {
            const response = await getComments(id);
            if (response) {
                setLoadedComments(response.results);
            }
        } catch (error) {
            console.error('Failed to refresh comments', error);
        }
    };

    return (
        <div className="px-4 my-4 w-200 font-sans">
            {isReposted ? (
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
                            <button type="button" onClick={handleLike}>
                                <FiHeart
                                    className={
                                        isLiked
                                            ? 'fill-red-600 text-red-600 sm:text-xl'
                                            : 'fill-none text-gray-100 sm:text-xl'
                                    }
                                />
                            </button>
                            <button type="button" onClick={handleCommentClick}>
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
                            {comment_count > 0 ? (
                                <button
                                    className="text-blue-400 hover:underline"
                                    onClick={handleCommentClick}
                                >
                                    {showComments ? "Hide replies" : `${comment_count} replies`}
                                </button>
                            ) : ''}
                            {comment_count > 0 && likesCount > 0 ? <span>.</span> : ''}
                            {likesCount > 0 ? <p>{likesCount} likes</p> : ''}
                        </div>

                        {/* Comment input section - replaced with CommentInput component */}
                        {showCommentInput && (
                            <CommentInput
                                avatar={user.avatar}
                                onSubmit={handleCommentSubmit}
                                placeholder="Post your reply"
                            />
                        )}

                        {/* Comments section */}
                        {isLoadingComments && (
                            <div className="mt-4 text-center text-gray-400">Loading comments...</div>
                        )}

                        {showComments && loadedComments.length > 0 && (
                            <div className="mt-4">
                                {loadedComments.map((comment) => (
                                    <Comment
                                        key={comment.id}
                                        id={comment.id}
                                        threadId={id}
                                        avatar={comment.user.avatar}
                                        username={comment.user.username}
                                        isVerified={comment.user.username.includes('verified')}
                                        content={comment.content}
                                        publishTime={comment.created_at}
                                        isLiked={comment.is_liked}
                                        totalReplies={comment.replies_count}
                                        totalLikes={comment.likes_count}
                                        isReposted={comment.is_reposted}
                                        onReplySuccess={handleReplySuccess}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ThreadComponent;
