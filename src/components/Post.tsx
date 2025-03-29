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
import { ThreadType } from '../types/AppTypes';

interface PostProps {
	threadId: string;
}

const Post = ({ threadId }: PostProps) => {
	const { getThreadById, loading, error } = useThread();
	const [post, setPost] = useState<ThreadType | null>(null);

	useEffect(() => {
		const fetchThread = async () => {
			const threadData = await getThreadById(threadId);
			if (threadData) {
				setPost(threadData);
			}
		};
		fetchThread();
	}, [threadId, getThreadById]);

	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error: {error}</p>;
	if (!post) return null;

	const {
		avatar,
		username,
		isVerified,
		content,
		created_at,
		mentions,
		is_liked,
		is_reposted,
		repostedBy,
		images,
		comment_count,
		likes_count,
	} = post;

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
								src={avatar || ''}  // Add fallback empty string
								width={35}
								height={35}
								alt="Account Avatar"
								className="rounded-full"
							/>
						</div>
						{comment_count ? (
							<div className="flex flex-col justify-center items-center">
								<img
									src={RonaldoAvatar || ''}  // Add fallback empty string
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
									{/* Add image carousel rendering here */}
								</div>
							)}
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
							{comment_count ? <p>{comment_count} replies</p> : null}
							{comment_count && likes_count ? <span>.</span> : null}
							{likes_count ? <p>{likes_count} likes</p> : null}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Post;
