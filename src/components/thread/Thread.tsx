import { useState, useCallback, useEffect, useRef } from 'react';
import {
    FiHeart,
    FiMessageCircle,
    FiRepeat,
    FiCheckCircle,
    FiTrash2,
    FiX,
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

import cn from 'classnames';
import { Thread } from '../../types/ThreadTypes';
import { useComment } from '../../hooks/useComment';
import { useThread } from '../../hooks/useThread';
import { usePusher } from '../../hooks/usePusher';
import { useUser } from '../../hooks/useUser';
import Comment from './Comment';
import CommentInput from './CommentInput';
import { formatDateTime } from '../../utils/dateUtils';
import Modal from '../common/Modal';

// Define the type for the component's props
type ThreadComponentProps = Omit<Thread, 'comments'>;

const ThreadComponent = ({
    id,
    content,
    user,
    thread_images,
    created_at,
    likes_count: initialLikesCount,
    is_liked: initialIsLiked,
    reposts_count: initialRepostsCount,
    is_reposted: initialIsReposted,
    comment_count: initialCommentCount,
}: ThreadComponentProps) => {
    const navigate = useNavigate();
    const commentsLoadedRef = useRef(false);
    const scrollPositionRef = useRef(0);

    // State for handling UI interactions
    const [showComments, setShowComments] = useState(false);
    const [showCommentInput, setShowCommentInput] = useState(false);
    const [loadedComments, setLoadedComments] = useState<any[]>([]);
    const [isLoadingComments, setIsLoadingComments] = useState(false);
    const [commentCount, setCommentCount] = useState(initialCommentCount);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [mouseY, setMouseY] = useState(0);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const { user: currentUser, getCurrentUser } = useUser();

    // State for tracking likes and reposts
    const [likesCount, setLikesCount] = useState(initialLikesCount);
    const [isLiked, setIsLiked] = useState(initialIsLiked);
    const [repostsCount, setRepostsCount] = useState(initialRepostsCount);
    const [isReposted, setIsReposted] = useState(initialIsReposted);
    const [showRepostNotification, setShowRepostNotification] = useState(false);

    // Format the created_at string
    const formattedDateTime = formatDateTime(created_at);

    // Hooks for thread and comment operations
    const { likeThread, repostThread, deleteThread } = useThread();
    const { getComments, createComment } = useComment();

    // Get the current user from the context
    useEffect(() => {
        if (!currentUser) {
            getCurrentUser();
        }
    }, []);

    const handleCommentClick = async () => {
        setShowComments(!showComments);
        setShowCommentInput(!showCommentInput);
        
        // Only load comments the first time they're requested
        if (!showComments && !commentsLoadedRef.current) {
            setIsLoadingComments(true);
            try {
                const response = await getComments(id);
                if (response) {
                    setLoadedComments(response.results);
                    commentsLoadedRef.current = true;
                }
            } catch (error) {
                console.error('Failed to load comments', error);
            } finally {
                setIsLoadingComments(false);
            }
        }
    };

    const handleLike = async () => {
        try {
            const response = await likeThread(id);
            if (response) {
                // Force state update to trigger re-render
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
                // Force state update to trigger re-render
                setIsReposted(response.is_reposted);
                setRepostsCount(response.reposts_count);

                // Show notification when repost is successful
                if (response.is_reposted) {
                    setShowRepostNotification(true);
                    // Hide notification after 3 seconds
                    setTimeout(() => {
                        setShowRepostNotification(false);
                    }, 3000);
                }
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

    const handlePusherEvent = useCallback(async (data: any) => {
        console.log('Received Pusher message:', data);
        if (data.thread_id !== id) return;

        // Handle thread like update
        if (data.type === 'like_update') {
            console.log('Received like update:', data.likes_count);
            setLikesCount(data.likes_count);
        } 
        // Handle comment updates
        else if (data.type === 'new_comment') {
            console.log('Received new comment:', data);
            setCommentCount(data.comment_count);
            
            // Load latest comments whenever there's a new comment, regardless of whether comments are shown
            try {
                const response = await getComments(id);
                if (response) {
                    setLoadedComments(response.results);
                    commentsLoadedRef.current = true;
                }
            } catch (error) {
                console.error('Failed to load comments', error);
            }
        }
        else if (data.type === 'comment_deleted') {
            console.log('Received comment deletion:', data);
            setCommentCount(prev => prev - 1);
            if (showComments && commentsLoadedRef.current) {
                setLoadedComments(prev => prev.filter(comment => comment.id !== data.comment_id));
            }
        }
    }, [id, showComments, getComments]);

    const handleDelete = async () => {
        try {
            const response = await deleteThread(id);
            if (response) {
                // Thread was deleted successfully
                // You might want to refresh the page or update the thread list
                window.location.reload();
            }
        } catch (error) {
            console.error('Failed to delete thread', error);
        }
    };

    const handleImageClick = (imageSrc: string) => {
        // Lưu vị trí cuộn hiện tại
        scrollPositionRef.current = window.scrollY;
        setSelectedImage(imageSrc);

        // Cuộn đến giữa trang ngay lập tức
        const totalHeight = document.documentElement.scrollHeight;
        window.scrollTo(0, (totalHeight - window.innerHeight) / 2);
    };

    const closeImageViewer = () => {
        setSelectedImage(null);
        // Khôi phục vị trí cuộn ngay lập tức
        window.scrollTo(0, scrollPositionRef.current);
    };

    const handleProfileClick = (userId: number) => {
        // Redirect to profile page if it's current user, otherwise go to user detail page
        if (currentUser && currentUser.id === userId) {
            navigate('/profile');
        } else {
            navigate(`/user/${userId}`);
        }
    };

    const handleDeleteClick = (e: React.MouseEvent) => {
        setMouseY(e.pageY);
        setShowDeleteConfirmation(true);
    };

    // Add event listener to close image viewer on Escape key press
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                closeImageViewer();
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, []);

    // Subscribe to Pusher channel for this thread
    usePusher(`thread_${id}`, handlePusherEvent);

    return (
        <div className="px-4 my-4 w-200 font-sans relative">
            {/* Image viewer popup */}
            {selectedImage && (
                <div className="fixed inset-0 z-[9999] bg-black overflow-hidden" 
                    style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
                    onClick={closeImageViewer}
                >
                    <div className="relative w-full h-full flex items-center justify-center">
                        <button 
                            className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full z-[10000] transition-all"
                            onClick={(e) => {
                                e.stopPropagation();
                                closeImageViewer();
                            }}
                        >
                            <FiX className="w-8 h-8" />
                        </button>
                        <img 
                            src={selectedImage} 
                            alt="Enlarged view" 
                            className="max-w-[90vw] max-h-[90vh] w-auto h-auto object-contain select-none"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                </div>
            )}

            {/* Repost notification */}
            {showRepostNotification && (
                <div className="absolute top-0 right-0 bg-green-500 text-white px-3 py-2 rounded-md shadow-md flex items-center gap-2 animate-fade-in-out">
                    <FiCheckCircle />
                    <span>Reposted successfully!</span>
                </div>
            )}

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
                        commentCount > 0
                            ? 'relative border-l-2 border-[#333] border-opacity-70 ml-2'
                            : 'relative ml-2.5'
                    )}
                >
                    <div className="flex -ml-7 flex-col w-14 h-full justify-between items-center shrink-0 absolute">
                        <div>
                            <img
                                src={user.avatar || ''}
                                width={35}
                                height={35}
                                alt="Account Avatar"
                                className="rounded-full cursor-pointer"
                                onClick={() => handleProfileClick(user.id)}
                            />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col w-full max-w-3xl overflow-hidden">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 w-full">
                            <p className="text-md sm:text-lg font-medium">
                                {user.username}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-xs sm:text-sm text-gray-500">
                                {formattedDateTime}
                            </span>

                            {currentUser && currentUser.id === user.id && (
                                <button
                                    type="button"
                                    onClick={handleDeleteClick}
                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <FiTrash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Delete confirmation modal */}
                    {showDeleteConfirmation && (
                        <Modal 
                            show={true} 
                            onClose={() => setShowDeleteConfirmation(false)}
                            mouseY={mouseY}
                        >
                            <div className="bg-gray-800 p-6">
                                <h3 className="text-lg font-medium text-white mb-4">Delete Thread?</h3>
                                <p className="text-gray-300 mb-6">This action cannot be undone. Are you sure you want to delete this thread?</p>
                                <div className="flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowDeleteConfirmation(false)}
                                        className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white bg-gray-700 rounded-md"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleDelete}
                                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </Modal>
                    )}

                    <div className="break-words overflow-hidden">
                        <div className="mt-1">
                            <p className="text-white text-sm whitespace-pre-line break-words">
                                {content}
                            </p>
                            <div className="mt-2">
                                {thread_images && thread_images.length > 0 ? (
                                    <div className="overflow-x-auto pb-4 hide-scrollbar max-w-full">
                                        <div className="flex flex-nowrap gap-2 min-w-0">
                                            {thread_images.map((img) => (
                                                <div 
                                                    key={img.id} 
                                                    className="flex-none w-[280px] relative"
                                                >
                                                    <div 
                                                        className="aspect-video bg-gray-800/50 rounded-md overflow-hidden cursor-pointer"
                                                        onClick={() => handleImageClick(img.image)}
                                                    >
                                                        <img
                                                            src={img.image}
                                                            alt="Thread image"
                                                            className="w-full h-full object-contain bg-black/30"
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : null}
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
                            {/* Chỉ hiển thị nút repost nếu không phải bài đăng của chính mình */}
                            {currentUser && currentUser.id !== user.id && (
                                <button type="button" onClick={handleRepost}>
                                    <FiRepeat
                                        className={
                                            isReposted
                                                ? 'text-green-500 -rotate-12 sm:text-xl'
                                                : 'text-gray-100 -rotate-12 sm:text-xl'
                                        }
                                    />
                                </button>
                            )}
                        </div>
                        <div className="flex items-start gap-2 text-gray-500 mt-4 text-xs sm:text-[14px] text-center">
                            {commentCount > 0 && (
                                <button
                                    className="text-blue-400 hover:underline"
                                    onClick={handleCommentClick}
                                >
                                    {showComments ? "Hide replies" : `${commentCount} replies`}
                                </button>
                            )}
                            {commentCount > 0 && (likesCount >= 0 || repostsCount >= 0) && <span>.</span>}
                            <p>{likesCount} likes</p>
                            {likesCount >= 0 && repostsCount >= 0 && <span>.</span>}
                            {repostsCount >= 0 && <p>{repostsCount} reposts</p>}
                        </div>

                        {/* Comment input section - replaced with CommentInput component */}
                        {showCommentInput && (
                            <CommentInput
                                avatar={JSON.parse(localStorage.getItem('user') || '{}').avatar}
                                onSubmit={handleCommentSubmit}
                                placeholder="Post your reply"
                            />
                        )}

                        {/* Comments section */}
                        {isLoadingComments && (
                            <div className="mt-4 flex justify-center">
                                <div className="w-8 h-8 rounded-full border-2 border-gray-700 border-t-blue-500 animate-spin"></div>
                            </div>
                        )}

                        {showComments && (
                            <div className="mt-4">
                                {loadedComments.length > 0 ? (
                                    loadedComments.map((comment) => (
                                        <Comment
                                            key={comment.id}
                                            id={comment.id}
                                            threadId={id}
                                            avatar={comment.user.avatar}
                                            username={comment.user.username}
                                            userId={comment.user.id}
                                            content={comment.content}
                                            publishTime={comment.created_at}
                                            isLiked={comment.is_liked}
                                            totalReplies={comment.replies_count}
                                            totalLikes={comment.likes_count}
                                            isReposted={comment.is_reposted}
                                            onReplySuccess={handleReplySuccess}
                                        />
                                    ))
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-8 px-6 text-center">
                                        <div className="w-12 h-12 bg-gray-800/50 rounded-full flex items-center justify-center mb-4">
                                            <FiMessageCircle className="w-6 h-6 text-gray-400" />
                                        </div>
                                        <p className="text-gray-400">No comments yet</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ThreadComponent;
