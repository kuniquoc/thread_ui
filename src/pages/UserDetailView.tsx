import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FiLoader, FiUsers } from 'react-icons/fi';
import { useUserDetail } from '../hooks/useUserDetail';
import PageWrapper from '../components/PageWrapper';
import ThreadComponent from '../components/thread/Thread';
import { useScroll } from '../hooks/useScroll';

const UserDetailView = () => {
    const { userId } = useParams();
    const isVisible = useScroll();
    const { 
        userDetail, 
        threads,
        loading, 
        error,
        getUserDetails,
        getUserThreads,
        handleFollowAction
    } = useUserDetail();

    useEffect(() => {
        if (userId) {
            const fetchData = async () => {
                const userResult = await getUserDetails(Number(userId));
                if (userResult) {
                    await getUserThreads(Number(userId));
                }
            };
            fetchData();
        }
    }, [userId]);

    if (loading || !userDetail) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center animate-pulse mb-4">
                    <FiLoader className="w-8 h-8 text-gray-600" />
                </div>
                <p className="text-gray-400">Loading profile...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mb-4">
                    <FiUsers className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-red-400">{error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center">
            <div 
                className={`w-full bg-gradient-to-b from-gray-900 to-gray-800 sticky top-0 z-10 
                    transition-all duration-500 ease-in-out transform-gpu backdrop-blur-sm
                    ${isVisible 
                        ? 'translate-y-0 opacity-100 scale-100' 
                        : '-translate-y-full opacity-0 scale-95'}`}
            >
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-2xl font-bold p-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                        Profile
                    </h1>
                </div>
            </div>

            <PageWrapper>
                <div className="pt-5 pb-16">
                    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg shadow-xl border border-slate-700 p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-800">
                                <img
                                    src={userDetail.avatar || '/default-avatar.png'}
                                    alt={`${userDetail.username}'s avatar`}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div className="flex-1">
                                <div className="flex flex-col">
                                    <h1 className="text-2xl font-bold text-white m-0">
                                        {`${userDetail.first_name} ${userDetail.last_name}`}
                                    </h1>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="bg-white/10 text-slate-400 text-xs px-2 py-1 rounded-full">
                                            @{userDetail.username}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-none">
                                <button
                                    onClick={() => handleFollowAction(userDetail.id, userDetail.is_followed)}
                                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 
                                        ${userDetail.is_followed
                                            ? 'bg-gray-700/50 text-white hover:bg-red-600/80 hover:text-white group'
                                            : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500'
                                        }`}
                                >
                                    {userDetail.is_followed ? (
                                        <>
                                            <span className="group-hover:hidden">Following</span>
                                            <span className="hidden group-hover:block">Unfollow</span>
                                        </>
                                    ) : 'Follow'}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 mt-6">
                            <div className="flex items-center gap-2">
                                <FiUsers className="w-4 h-4 text-gray-400" />
                                <span className="text-white font-medium">{userDetail.followers_count}</span>
                                <span className="text-gray-400 text-sm">followers</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 space-y-4">
                        {threads.length > 0 ? (
                            threads.map(thread => (
                                <div key={thread.id} className="bg-gray-800/30 rounded-xl p-4 hover:bg-gray-800/50 transition-all duration-200">
                                    <ThreadComponent {...thread} />
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 px-6 text-center bg-gray-800/30 rounded-xl">
                                <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mb-4">
                                    <FiUsers className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-2">No threads yet</h3>
                                <p className="text-gray-400">
                                    {userDetail.username} hasn't posted any threads yet
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </PageWrapper>
        </div>
    );
};

export default UserDetailView;