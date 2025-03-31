import ThreadComponent from '../components/thread/Thread';
import PageWrapper from '../components/PageWrapper';

import { useEffect, useState, useCallback } from 'react';
import { useThread } from '../hooks/useThread';
import { Thread } from '../types';

const Home = () => {
    const { getThreadFeed, loading, error } = useThread();
    const [threads, setThreads] = useState<Thread[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const fetchThreads = useCallback(async (pageNumber: number) => {
        try {
            const response = await getThreadFeed(pageNumber);
            if (response) {
                setThreads(prevThreads =>
                    pageNumber === 1 ? response.results : [...prevThreads, ...response.results]
                );

                // Check if there are more pages
                setHasMore(!!response.next);
            }
        } catch (error) {
            console.error('Error fetching threads:', error);
        }
    }, [getThreadFeed]);

    useEffect(() => {
        console.log('Fetching threads for page:', page);
        fetchThreads(page);
    }, [page]);

    const handleLoadMore = () => {
        if (hasMore && !loading) {
            setPage(prev => prev + 1);
        }
    };

    if (loading && page === 1) return (
        <PageWrapper>
            <div className="pt-5 pb-16 flex flex-col items-center">
                <div className="text-center p-4">Loading threads...</div>
            </div>
        </PageWrapper>
    );

    if (error) return (
        <PageWrapper>
            <div className="pt-5 pb-16 flex flex-col items-center">
                <div className="text-center p-4 text-red-500">Error: {error}</div>
            </div>
        </PageWrapper>
    );

    return (
        <PageWrapper>
            <div className="pt-5 pb-16 flex flex-col items-center">
                <div className="w-full">
                    {threads.length > 0 ? (
                        threads.map(thread => (
                            <ThreadComponent
                                key={thread.id}
                                id={thread.id}
                                content={thread.content}
                                user={thread.user}
                                thread_images={thread.thread_images}
                                created_at={thread.created_at}
                                likes_count={thread.likes_count}
                                is_liked={thread.is_liked}
                                reposts_count={thread.reposts_count}
                                is_reposted={thread.is_reposted}
                                comment_count={thread.comment_count}
                            />
                        ))
                    ) : (
                        <div className="text-center p-4 text-gray-400">No threads found</div>
                    )}

                    {loading && page > 1 && (
                        <div className="text-center p-4 text-gray-400">Loading more threads...</div>
                    )}

                    {hasMore && !loading && (
                        <button
                            onClick={handleLoadMore}
                            className="w-full py-3 mt-4 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            Load more threads
                        </button>
                    )}

                    {!hasMore && threads.length > 0 && (
                        <div className="text-center p-4 text-gray-500">You've reached the end</div>
                    )}
                </div>
            </div>
        </PageWrapper>
    );
};

export default Home;
