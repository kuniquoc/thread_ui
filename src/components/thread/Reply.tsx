import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
	FiHeart,
	FiMessageCircle,
	// FiMoreHorizontal,
	FiNavigation,
	FiRepeat,
} from 'react-icons/fi';
// import { useReply } from '../../hooks/useReply';
import { useComment } from '../../hooks/useComment';
import { formatDateTime } from '../../utils/dateUtils';
import { usePusher } from '../../hooks/usePusher';

// Define interface for the component props
interface ReplyProps {
	id: number;
	threadId: number;
	avatar: string;
	username: string;
	isVerified: boolean;
	isRepliedTo?: boolean;
	repliedToUsername?: string;
	content: string;
	publishTime: string;
	mentions?: string;
	isLiked: boolean;
	pictures?: React.ReactNode;
	totalLikes: number;
	isReposted?: boolean;
}

const Reply = ({
	id,
	threadId,
	avatar,
	username,
	isRepliedTo,
	repliedToUsername = 'realstoman',
	content,
	publishTime,
	mentions,
	isLiked: initialIsLiked,
	pictures,
	totalLikes: initialTotalLikes,
	isReposted,
}: ReplyProps) => {
	const [isLiked, setIsLiked] = useState(initialIsLiked);
	const [totalLikes, setTotalLikes] = useState(initialTotalLikes);
	// const { likeReply } = useReply();
	const { likeComment, repostComment } = useComment();

	const handlePusherEvent = useCallback((eventData: any) => {
		const data = typeof eventData === 'string' ? JSON.parse(eventData) : eventData;

		if (data.type === 'new_comment' && data.comment_id === id) {
			setTotalLikes(data.likes_count);
		}
	}, [id]);

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
			console.error('Failed to like/unlike reply', error);
		}
	};

	const handleReply = () => {
		// Logic to open reply form for responding to this reply
		console.log('Reply to reply', id);
	};

	const handleRepost = async () => {
		try {
			const response = await repostComment(threadId, id);
			if (response) {
				// Handle repost success
				console.log('Reply reposted successfully');
			}
		} catch (error) {
			console.error('Failed to repost reply', error);
		}
	};

	const handleShare = () => {
		// Logic for sharing
		console.log('Share reply', id);
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
								className="rounded-full"
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
									<span>Replying to @{repliedToUsername}</span>
								</div>
							)}
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
							<div className="mt-2">{pictures}</div>
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
							<button type="button" onClick={handleRepost}>
								<FiRepeat className="text-gray-100  -rotate-12 sm:text-xl" />
							</button>
							<button type="button" onClick={handleShare}>
								<FiNavigation className="text-gray-100 sm:text-xl" />
							</button>
						</div>
						<div className="flex items-start gap-2 text-gray-500 mt-4 text-xs sm:text-[14px] text-center">
							{totalLikes > 0 && <p>{totalLikes} likes</p>}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Reply;
