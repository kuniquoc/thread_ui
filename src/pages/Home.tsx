import ThreadComponent from '../components/thread/Thread';
import PageWrapper from '../components/PageWrapper';
import { useEffect, useState, useCallback } from 'react';
import { useThread } from '../hooks/useThread';
import { Thread } from '../types';
import { FiMessageCircle, FiUser } from 'react-icons/fi';
import { useScroll } from '../hooks/useScroll';

const Home = () => {
    const { getThreadFeed, getFollowingFeed, loading, error } = useThread();
    const [threads, setThreads] = useState<Thread[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [feedType, setFeedType] = useState<'all' | 'following'>('all');
    const isVisible = useScroll();

    const fetchThreads = useCallback(async (pageNumber: number) => {
        try {
            const response = feedType === 'all' 
                ? await getThreadFeed(pageNumber)
                : await getFollowingFeed(pageNumber);

            if (response) {
                setThreads(prevThreads =>
                    pageNumber === 1 ? response.results : [...prevThreads, ...response.results]
                );
                setHasMore(!!response.next);
            }
        } catch (error) {
            console.error('Error fetching threads:', error);
        }
    }, [getThreadFeed, getFollowingFeed, feedType]);

    useEffect(() => {
        setPage(1);
        fetchThreads(1);
    }, [feedType]);

    useEffect(() => {
        if (page > 1) {
            fetchThreads(page);
        }
    }, [page]);

    const handleLoadMore = () => {
        if (hasMore && !loading) {
            setPage(prev => prev + 1);
        }
    };

    if (loading && page === 1) return (
        <div className="min-h-screen flex flex-col items-center">
            <div className="w-full bg-gradient-to-b from-gray-900 to-gray-800 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-2xl font-bold p-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Home</h1>
                </div>
            </div>
            <PageWrapper>
                <div className="pt-5 pb-16">
                    <div className="flex justify-center">
                        <div className="w-8 h-8 rounded-full border-2 border-gray-700 border-t-blue-500 animate-spin"></div>
                    </div>
                </div>
            </PageWrapper>
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex flex-col items-center">
            <div className="w-full bg-gradient-to-b from-gray-900 to-gray-800 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-2xl font-bold p-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Home</h1>
                </div>
            </div>
            <PageWrapper>
                <div className="pt-5 pb-16">
                    <div className="text-center p-4 text-red-400 bg-red-900/20 rounded-lg border border-red-800">
                        {error}
                    </div>
                </div>
            </PageWrapper>
        </div>
    );

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
                    <h1 className="text-2xl font-bold p-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Home</h1>
                    <div className="flex justify-center pb-4">
                        <div className="flex bg-gray-800/50 rounded-full p-0.5 backdrop-blur-sm">
                            <button
                                onClick={() => setFeedType('all')}
                                className={`px-6 py-2 rounded-full font-medium text-sm transition-all duration-200 ${
                                    feedType === 'all'
                                        ? 'text-white bg-gradient-to-r from-blue-600 to-purple-600'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setFeedType('following')}
                                className={`px-6 py-2 rounded-full font-medium text-sm transition-all duration-200 ${
                                    feedType === 'following'
                                        ? 'text-white bg-gradient-to-r from-blue-600 to-purple-600'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                Following
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            <PageWrapper>
                <div className="pt-5 pb-16">
                    <div className="flex flex-col items-center space-y-4">
                        {threads.length > 0 ? (
                            <div className="w-full space-y-4">
                                {threads.map(thread => (
                                    <div key={thread.id} className="bg-gray-800/30 rounded-xl p-4 hover:bg-gray-800/50 transition-all duration-200">
                                        <ThreadComponent {...thread} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                                <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mb-4">
                                    {feedType === 'all' ? (
                                        <FiMessageCircle className="w-8 h-8 text-gray-400" />
                                    ) : (
                                        <FiUser className="w-8 h-8 text-gray-400" />
                                    )}
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-2">
                                    {feedType === 'all' ? 'No threads yet' : 'No threads from people you follow'}
                                </h3>
                                <p className="text-gray-400">
                                    {feedType === 'all' 
                                        ? "Be the first to start a thread!"
                                        : "Follow some people to see their threads here"
                                    }
                                </p>
                            </div>
                        )}

                        {loading && page > 1 && (
                            <div className="flex justify-center p-4">
                                <div className="w-8 h-8 rounded-full border-2 border-gray-700 border-t-blue-500 animate-spin"></div>
                            </div>
                        )}

                        {hasMore && !loading && (
                            <button
                                onClick={handleLoadMore}
                                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-medium text-sm hover:from-blue-500 hover:to-purple-500 transition-all duration-300 transform hover:-translate-y-0.5"
                            >
                                Load more
                            </button>
                        )}

                        {!hasMore && threads.length > 0 && (
                            <div className="text-center p-4 text-gray-500">
                                You've reached the end
                            </div>
                        )}
                    </div>
                </div>
            </PageWrapper>
        </div>
    );
};

export default Home;
