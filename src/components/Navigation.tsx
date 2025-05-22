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
import { useNotification } from '../hooks/useNotification';
import { CreateThreadRequest } from '../types';
import Modal from './common/Modal';

const Navigation = () => {
	const [openModal, setOpenModal] = useState<string | undefined>();
	const props = { openModal, setOpenModal };
	const [activeTab, setActiveTab] = useState('Home');
	const { logout } = useAuth();
	const { user, getCurrentUser } = useUser();
	const { createThread, uploadImages, loading, error } = useThread();
	const { getUnreadCount } = useNotification();
	const navigate = useNavigate();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
	const [threadContent, setThreadContent] = useState('');
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [isUploading, setIsUploading] = useState(false);
	const [unreadCount, setUnreadCount] = useState(0);

	useEffect(() => {
		const fetchUser = async () => {
			await getCurrentUser();
		};
		fetchUser();
	}, []);

	useEffect(() => {
		if (!openModal || !loading) {
			setErrorMessage(null);
		}
	}, [openModal, loading]);

	useEffect(() => {
		if (error) {
			setErrorMessage(error);
		}
	}, [error]);

	useEffect(() => {
		const fetchUnreadCount = async () => {
			const result = await getUnreadCount();
			if (result) {
				setUnreadCount(result.count);
			}
		};
		fetchUnreadCount();
		const interval = setInterval(fetchUnreadCount, 10000);
		return () => clearInterval(interval);
	}, [activeTab]);

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

	const getFilePreview = (file: File) => {
		return URL.createObjectURL(file);
	};

	const saveThread = async () => {
		try {
			setIsUploading(true);

			let imageUrls: string[] = [];
			if (selectedFiles.length > 0) {
				const uploadedImages = await uploadImages(selectedFiles);
				if (uploadedImages) {
					imageUrls = uploadedImages;
				}
			}

			const threadData: CreateThreadRequest = {
				content: threadContent,
				...(imageUrls.length > 0 && { images: imageUrls })
			};

			const result = await createThread(threadData);

			if (result) {
				setThreadContent('');
				setSelectedFiles([]);
				props.setOpenModal(undefined);
				window.location.reload();
			}
		} catch (err) {
			console.error('Error saving thread:', err);
			setErrorMessage('Failed to save thread. Please try again.');
		} finally {
			setIsUploading(false);
		}
	};

	const handleSaveDraft = () => {
		saveThread();
	};

	return (
		<div className="fixed top-0 left-0 z-40 w-30 h-full">
			<div className="grid h-full max-w-lg sm:max-w-4xl grid-rows-6 mx-auto font-medium bg-gradient-to-b from-gray-900 to-gray-800 text-gray-400 border-r border-gray-700/50">
				<Link
					to="/"
					className="inline-flex flex-col items-center justify-center px-5 hover:bg-white/5 transition-colors"
					onClick={() => setActiveTab('Home')}
				>
					<FiHome className={`text-3xl transition-colors ${activeTab === 'Home' ? 'text-blue-500' : ''}`} />
				</Link>
				<Link
					to="/search"
					className="inline-flex flex-col items-center justify-center px-5 hover:bg-white/5 transition-colors"
					onClick={() => setActiveTab('Search')}
				>
					<FiSearch className={`text-3xl transition-colors ${activeTab === 'Search' ? 'text-blue-500' : ''}`} />
				</Link>
				<button
					onClick={() => {
						props.setOpenModal('default');
						setActiveTab('Create');
					}}
					type="button"
					className="inline-flex flex-col items-center justify-center px-5 hover:bg-white/5 transition-colors"
				>
					<FiEdit className={`text-3xl transition-colors ${activeTab === 'Create' ? 'text-blue-500' : ''}`} />
				</button>
				<Link
					to="/notification"
					className="inline-flex flex-col items-center justify-center px-5 hover:bg-white/5 transition-colors relative"
					onClick={() => setActiveTab('Notification')}
				>
					<FiBell className={`text-3xl transition-colors ${activeTab === 'Notification' ? 'text-blue-500' : ''}`} />
					{unreadCount > 0 && (
						<div className="absolute top-2 right-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
							{unreadCount > 99 ? '99+' : unreadCount}
						</div>
					)}
				</Link>
				<Link
					to="/profile"
					className="inline-flex flex-col items-center justify-center px-5 hover:bg-white/5 transition-colors"
					onClick={() => setActiveTab('Profile')}
				>
					<FiUser className={`text-3xl transition-colors ${activeTab === 'Profile' ? 'text-blue-500' : ''}`} />
				</Link>
				<button
					onClick={handleLogout}
					className="inline-flex flex-col items-center justify-center px-5 hover:bg-white/5 transition-colors"
				>
					<FiLogOut className="text-3xl hover:text-red-500 transition-colors" />
				</button>
			</div>

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
						className="max-w-4xl h-[600px] w-full"
					>
						<div className="relative w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 text-white shadow-xl border border-gray-700 flex flex-col overflow-hidden">
							<div className="border-b border-gray-700">
								<div className="grid grid-cols-8 py-3 px-4">
									<button
										onClick={() => props.setOpenModal(undefined)}
										type="button"
										className="absolute text-left pt-1 col-span-1 text-gray-400 hover:text-white text-sm transition-colors"
									>
										Cancel
									</button>
									<h1 className=" col-span-7 text-center font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
										New thread
									</h1>
									<button
										type="button"
										onClick={handleSaveDraft}
										disabled={loading || isUploading}
										className="absolute right-4 pt-1 text-gray-400 hover:text-white disabled:text-gray-600 disabled:hover:text-gray-600 disabled:cursor-not-allowed transition-colors"
									>
										<FiSave className="w-5 h-5" />
									</button>
								</div>
							</div>

							<form className="flex flex-col h-full max-h-[600px] min-h-0">
								{errorMessage && (
									<div className="px-4 pt-2">
										<div className={`p-2 rounded-md ${
											errorMessage.includes('saved') 
												? 'bg-green-900/20 text-green-400' 
												: 'bg-red-900/20 text-red-400'
										} text-sm flex items-center justify-center gap-2`}>
											{errorMessage.includes('saved') ? null : <FiAlertCircle />}
											{errorMessage}
										</div>
									</div>
								)}

								<div className="flex-1 px-4 py-4 overflow-y-auto min-h-0">
									<div className="flex w-full gap-2">
										<div className="ml-2">
											<div className="relative border-l-2 border-gray-700 border-opacity-70 ml-2 h-full">
												<div className="flex -ml-7 flex-col w-14 items-center">
													<div>
														<img
															src={user?.avatar}
															width={35}
															height={35}
															alt="Account Avatar"
															className="rounded-full border-2 border-gray-700"
														/>
													</div>
												</div>
											</div>
										</div>
										<div className="flex flex-col w-full min-w-0">
											<div className="flex flex-col">
												<div className="flex flex-col items-start">
													<p className="text-sm text-gray-400">
														@{user?.username}
													</p>
												</div>
												<div className="w-full mt-4">
													<textarea
														name="post"
														id="post"
														className="w-full h-[200px] bg-transparent text-white border-none resize-none focus:ring-0 placeholder-gray-500 text-sm whitespace-pre-wrap"
														required
														placeholder="Start a thread..."
														value={threadContent}
														onChange={(e) => setThreadContent(e.target.value)}
													/>
												</div>

												{selectedFiles.length > 0 && (
													<div className="mt-3 w-full">
														<div className="overflow-x-auto pb-4 hide-scrollbar">
															<div className="flex flex-nowrap gap-2">
																{selectedFiles.map((file, index) => (
																	<div key={index} className="flex-none w-[280px]">
																		<div className="relative aspect-video bg-gray-800/50 rounded-md overflow-hidden">
																			<img
																				src={getFilePreview(file)}
																				alt={`Selected ${index + 1}`}
																				className="w-full h-full object-contain bg-black/30"
																				onLoad={(e) => {
																					const target = e.target as HTMLImageElement;
																					target.classList.remove('opacity-0');
																				}}
																			/>
																			<button
																				type="button"
																				onClick={() => removeSelectedFile(file)}
																				className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 hover:bg-black/70 text-white transition-all"
																				disabled={isUploading}
																			>
																				<FiX className="w-5 h-5" />
																			</button>
																		</div>
																	</div>
																))}
															</div>
														</div>
													</div>
												)}
											</div>
										</div>
									</div>
								</div>

								<div className="border-t border-gray-700 px-4 py-3 flex justify-between items-center bg-gray-800/50">
									<input
										type="file"
										ref={fileInputRef}
										className="hidden"
										onChange={handleFileChange}
										multiple
										accept="image/*"
										disabled={isUploading}
									/>
									<button
										type="button"
										onClick={handleFileAttachment}
										disabled={isUploading}
										className="text-gray-400 hover:text-white transition-colors"
									>
										<FiPaperclip className="w-5 h-5" />
									</button>

									<button
										type="button"
										onClick={() => saveThread()}
										disabled={!threadContent.trim() || loading || isUploading}
										className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-full hover:from-blue-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:-translate-y-0.5"
									>
										{loading || isUploading ? (
											<div className="flex items-center gap-2">
												<div className="w-5 h-5 rounded-full border-2 border-gray-700 border-t-blue-500 animate-spin"></div>
												<span>Posting...</span>
											</div>
										) : 'Post'}
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
