import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	FiHeart,
	FiMessageCircle,
	FiRepeat,
} from 'react-icons/fi';
import { useComment } from '../../hooks/useComment';
import { formatDateTime } from '../../utils/dateUtils';
import { usePusher } from '../../hooks/usePusher';

// Define interface for the component props
interface ReplyProps {
	id: number;
	threadId: number;
	avatar: string;
	username: string;
	userId: number; // Add this new prop
	isVerified: boolean;
	isRepliedTo?: boolean;
	repliedToUsername?: string;
	content: string;
	publishTime: string;
	isLiked: boolean;
	pictures?: React.ReactNode;
	totalLikes: number;
	isReposted?: boolean;
	onReplyClick?: (username: string) => void;
}

const Reply = ({
	id,
	threadId,
	avatar,
	username,
	userId,
	isRepliedTo,
	repliedToUsername = 'realstoman',
	content,
	publishTime,
	isLiked: initialIsLiked,
	pictures,
	totalLikes: initialTotalLikes,
	isReposted,
	onReplyClick,
}: ReplyProps) => {
	const navigate = useNavigate();
	const [isLiked, setIsLiked] = useState(initialIsLiked);
	const [totalLikes, setTotalLikes] = useState(initialTotalLikes);
	const { likeComment } = useComment();
	const [loading, setLoading] = useState(false);

	const handlePusherEvent = useCallback((eventData: any) => {
		const data = typeof eventData === 'string' ? JSON.parse(eventData) : eventData;

		// Handle reply like update
		if (data.type === 'comment_like_update' && data.comment_id === id) {
			// Update like count
			setTotalLikes(data.likes_count);

			// If current user performed the action, update like status
			const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
			if (currentUser && currentUser.id === userId) {
				setIsLiked(data.action === 'like');
			}
		}
	}, [id, userId]);

	// Subscribe to Pusher channel for this thread
	usePusher(`thread_${threadId}`, handlePusherEvent);

	const handleLike = async () => {
		try {
			setLoading(true);
			const response = await likeComment(threadId, id);
			if (response) {
				setIsLiked(response.is_liked);
				setTotalLikes(response.likes_count);
			}
		} catch (error) {
			console.error('Failed to like/unlike reply', error);
		} finally {
			setLoading(false);
		}
	};

	const handleReply = () => {
		if (onReplyClick) {
			onReplyClick(username);
		}
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
				<div className="relative ml-2">
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
							{isRepliedTo && (
								<div className="flex justify-start items-center gap-2 text-xs mb-1 text-[#666]">
									<span>Replying to <span className="text-blue-400">@{repliedToUsername}</span></span>
								</div>
							)}
						</div>
						<div className="flex items-center gap-3">
							<span className="text-xs sm:text-sm text-gray-500">
								{formatDateTime(publishTime)}
							</span>
						</div>
					</div>

					<div className="">
						<div className="mt-1">
							<p className="text-xs sm:text-sm text-gray-200">
								{content}
							</p>
							{pictures && (
								<div className="mt-2">
									<div className="flex flex-row gap-2 overflow-x-auto py-2">
										{Array.isArray(pictures) && pictures.map((img: any, index: number) => (
											<div key={index} className="relative flex-shrink-0">
												<div className="w-[280px] aspect-[16/9] animate-pulse bg-gray-800/50 rounded-md overflow-hidden">
													<img
														src={img.image || img}
														alt={`Reply image ${index + 1}`}
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
					</div>

					{loading && (
						<div className="flex justify-center my-2">
							<div className="w-5 h-5 rounded-full border-2 border-gray-700 border-t-blue-500 animate-spin"></div>
						</div>
					)}

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
						{totalLikes > 0 && <p>{totalLikes} likes</p>}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Reply;
