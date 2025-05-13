import { Link, useNavigate } from 'react-router-dom';
import {
	FiEdit,
	FiHome,
	FiPaperclip,
	FiSearch,
	FiUser,
	FiX,
	FiLogOut,
	FiBell,
	FiSave,
	FiAlertCircle,
} from 'react-icons/fi';
import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useUser } from '../hooks/useUser';
import { useThread } from '../hooks/useThread';
import { CreateThreadRequest } from '../types';
import Modal from './common/Modal';

const Navigation = () => {
	const [openModal, setOpenModal] = useState<string | undefined>();
	const props = { openModal, setOpenModal };
	const [activeTab, setActiveTab] = useState('Home');
	const { logout } = useAuth();
	const { user, getCurrentUser } = useUser();
	const { createThread, uploadImages, loading, error } = useThread();
	const navigate = useNavigate();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
	const [threadContent, setThreadContent] = useState('');
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [isUploading, setIsUploading] = useState(false);

	// Get current user info
	useEffect(() => {
		const fetchUser = async () => {
			await getCurrentUser();
		};
		fetchUser();
	}, [])

	// Reset error message when modal closes or operation completes
	useEffect(() => {
		if (!openModal || !loading) {
			setErrorMessage(null);
		}
	}, [openModal, loading]);

	// Update error message when there's an error from the hook
	useEffect(() => {
		if (error) {
			setErrorMessage(error);
		}
	}, [error]);

	const handleLogout = async () => {
		await logout();
		navigate('/login');
	};

	const handleFileAttachment = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files.length > 0) {
			const newFiles = Array.from(event.target.files).filter(file =>
				file.type.startsWith('image/')
			);
			setSelectedFiles(prev => [...prev, ...newFiles]);
		}
	};

	const removeSelectedFile = (fileToRemove: File) => {
		setSelectedFiles(selectedFiles.filter(file => file !== fileToRemove));
	};

	// Function to generate preview URLs for files
	const getFilePreview = (file: File) => {
		return URL.createObjectURL(file);
	};

	const saveThread = async (publish = true) => {
		try {
			if (threadContent.trim() === '' && selectedFiles.length === 0) {
				setErrorMessage('Please add some content or media to your thread.');
				return;
			}

			setErrorMessage(null);

			// Handle image uploads first if there are any
			let imageUrls: string[] = [];
			if (selectedFiles.length > 0) {
				setIsUploading(true);
				// Upload images to ImgBB
				imageUrls = await uploadImages(selectedFiles);
				setIsUploading(false);

				if (imageUrls.length === 0) {
					setErrorMessage('All image uploads failed. Please check your ImgBB API key configuration.');
					return;
				}

				if (imageUrls.length < selectedFiles.length) {
					setErrorMessage('Some images failed to upload. You can try again or proceed with the successful ones.');
				}
			}

			const threadData: CreateThreadRequest = {
				content: threadContent,
				// Only include images if we have any URLs
				...(imageUrls.length > 0 && { images: imageUrls })
			};

			const result = await createThread(threadData);

			if (result) {
				// Reset the form
				setThreadContent('');
				setSelectedFiles([]);

				// Close the modal after successful thread creation regardless of publish status
				props.setOpenModal(undefined);

				window.location.reload();

				// If not publishing (saving as draft), show a success message
				if (!publish) {
					// Show toast or success message for drafts here if needed
					// Since modal is closed, we don't need to set error message for draft success
				}
			}
		} catch (err) {
			console.error('Error saving thread:', err);
			setErrorMessage('Failed to save thread. Please try again.');
		}
	};

	const handleSaveDraft = () => {
		saveThread(false);
	};

	return (
		<div className="fixed top-0 left-0 z-40 w-30 h-full">
			<div className="grid h-full max-w-lg sm:max-w-4xl grid-rows-6 mx-auto font-medium bg-[#1a1a1a] text-[#666] border-r border-[#333]">
				<Link
					to="/"
					className="inline-flex flex-col items-center justify-center px-5 hover:bg-[#333]"
					onClick={() => setActiveTab('Home')}
				>
					<FiHome className={`text-3xl ${activeTab === 'Home' && 'fill-white'}`} />
				</Link>
				<Link
					to="/search"
					className="inline-flex flex-col items-center justify-center px-5 hover:bg-[#333]"
					onClick={() => setActiveTab('Search')}
				>
					<FiSearch className={`text-3xl ${activeTab === 'Search' && 'fill-white'}`} />
				</Link>
				<button
					onClick={() => {
						props.setOpenModal('default')
						setActiveTab('Create')
					}}
					type="button" 
					data-modal-target="create-post-modal"
					data-modal-toggle="create-post-modal"
					className="inline-flex flex-col items-center justify-center px-5 hover:bg-[#333]"
				>
					<FiEdit className="text-3xl" />
				</button>
				<Link
					to="/notification"
					className="inline-flex flex-col items-center justify-center px-5 hover:bg-[#333]"
					onClick={() => setActiveTab('Notification')}
				>
					<FiBell className={`text-3xl ${activeTab === 'Notification' && 'fill-white'}`} />
				</Link>
				<Link
					to="/profile"
					className="inline-flex flex-col items-center justify-center px-5 hover:bg-[#333]"
					onClick={() => setActiveTab('Profile')}
				>
					<FiUser className={`text-3xl ${activeTab === 'Profile' && 'fill-white'}`} />
				</Link>
				<button
					onClick={handleLogout}
					className="inline-flex flex-col items-center justify-center px-5 hover:bg-[#333]"
				>
					<FiLogOut className="text-3xl" />
				</button>
			</div>

			{/* Create Post Modal */}
			<AnimatePresence>
				<motion.div
					initial={{ y: 10, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					exit={{ y: -10, opacity: 0 }}
					transition={{ duration: 0.2, ease: 'easeInOut' }}
				>
					<Modal
						show={props.openModal === 'default'}
						onClose={() => props.setOpenModal(undefined)}
						className="max-w-md"
					>
						<div className="relative rounded-t-lg h-[500px] w-[600px] bg-[#222] text-gray-100 shadow-lg">
							<div className="border-b border-[#333]">
								<div className="grid grid-cols-8 py-3 px-4">
									<button
										onClick={() => props.setOpenModal(undefined)}
										type="button"
										className="absolute text-left pt-1 col-span-1 rounded-lg inline-flex justify-center items-center text-[#bbb] text-xs"
									>
										Cancel
										<span className="sr-only">
											Close modal
										</span>
									</button>
									<h1 className="col-span-7 text-center font-medium">
										New thread
									</h1>
									<button
										type="button"
										onClick={handleSaveDraft}
										disabled={loading}
										className="absolute right-4 pt-1 rounded-lg inline-flex justify-center items-center text-[#777] hover:text-[#999] disabled:text-[#444] disabled:hover:text-[#444] disabled:cursor-not-allowed"
									>
										<FiSave className={loading ? "text-[#444]" : "text-[#777] hover:text-[#999]"} />
										<span className="sr-only">
											Save draft
										</span>
									</button>
								</div>
							</div>

							<form className="space-y-6" action="#">
								{/* Error message display */}
								{errorMessage && (
									<div className="px-4 pt-2 text-center">
										<div className={`p-2 rounded-md ${errorMessage.includes('saved') ? 'bg-green-800 bg-opacity-20 text-green-400' : 'bg-red-800 bg-opacity-20 text-red-400'} text-xs flex items-center justify-center`}>
											{errorMessage.includes('saved') ? null : <FiAlertCircle className="mr-1" />}
											{errorMessage}
										</div>
									</div>
								)}

								<div className="px-4 py-6 flex w-full gap-2">
									<div className="ml-2">
										<div className="relative border-l-2 border-[#333] border-opacity-70 ml-2">
											<div className="flex -ml-7 flex-col w-14 h-28 max-h-28 justify-between items-center">
												<div>
													<img
														src={user?.avatar}
														width={35}
														height={35}
														alt="Account Avatar"
														className="rounded-full"
													/>
												</div>
											</div>
										</div>
									</div>
									<div className="flex w-full h-full">
										<div className="space-y-6 w-full">
											<div className="flex flex-col items-start">
												<p className="text-xs text-[#666]">
													@{user?.username}
												</p>
											</div>
											<div className="w-full">
												<textarea
													name="post"
													id="post"
													className="bg-transparent text-xs border-none w-full resize-none overflow-hidden focus:border-none ring-0 p-0 focus:ring-0 active:ring-0"
													required
													placeholder="Start a thread..."
													rows={1}
													style={{ minHeight: '20px', height: 'auto' }}
													value={threadContent}
													onChange={(e) => setThreadContent(e.target.value)}
													onInput={(e) => {
														e.currentTarget.style.height = 'auto';
														e.currentTarget.style.height = e.currentTarget.scrollHeight + 'px';
													}}
												></textarea>

												{selectedFiles.length > 0 && (
													<div className="mt-3">
														<div className="flex gap-2 overflow-x-auto pb-2">
															{selectedFiles.map((file, index) => (
																<div key={index} className="relative min-w-[100px] h-[100px] bg-[#333] rounded-md">
																	{file.type.startsWith('image/') ? (
																		<img
																			src={getFilePreview(file)}
																			alt={`Preview ${index}`}
																			className="w-full h-full object-cover rounded-md"
																		/>
																	) : file.type.startsWith('video/') ? (
																		<video
																			src={getFilePreview(file)}
																			className="w-full h-full object-cover rounded-md"
																			controls
																		/>
																	) : null}
																	<button
																		type="button"
																		onClick={() => removeSelectedFile(file)}
																		className="absolute top-1 right-1 bg-[#111] bg-opacity-70 rounded-full p-1 text-white"
																	>
																		<FiX size={14} />
																	</button>
																</div>
															))}
														</div>
													</div>
												)}
											</div>

											<div className="flex space-x-3">
												<input
													type="file"
													ref={fileInputRef}
													className="hidden"
													onChange={handleFileChange}
													multiple
													accept="image/*"
												/>
												<button
													type="button"
													onClick={handleFileAttachment}
												>
													<FiPaperclip className="text-[#777] hover:text-[#999]" />
												</button>
												{/* Save button moved to header */}
											</div>

										</div>
										<button
											type="button"
											className=" mt-0 right-2.5 text-sm w-8 h-8 ml-auto inline-flex justify-center items-center "
											data-modal-hide="create-post-modal"
										>
											<FiX className="w-4 h-4 text-[#777]" />
											<span className="sr-only">
												Close modal
											</span>
										</button>
									</div>
								</div>

								{/* Footer */}
								<div className="flex justify-between items-center px-5 bottom-0 right-0 left-0 fixed pb-6">
									<div className="text-xs text-[#666]">
										<p>Anyone can reply</p>
									</div>
									<button
										onClick={(e) => {
											e.preventDefault();
											saveThread(true);
										}}
										type="button"
										disabled={loading || isUploading}
										className="text-left col-span-1 rounded-lg inline-flex justify-center items-center text-blue-400 text-sm font-medium disabled:text-opacity-50 disabled:cursor-not-allowed"
									>
										{isUploading ? 'Uploading images...' : loading ? 'Posting...' : 'Post'}
										<span className="sr-only">
											Post
										</span>
									</button>
								</div>
							</form>
						</div>
					</Modal>
				</motion.div>
			</AnimatePresence>
		</div>
	);
};

export default Navigation;
