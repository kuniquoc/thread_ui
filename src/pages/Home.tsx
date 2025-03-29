import Thread from '../components/Thread';
import PageWrapper from '../components/PageWrapper';

import { useEffect, useState } from 'react';
import { useThread } from '../hooks/useThread';
import { ThreadType } from '../types/AppTypes';

const Home = () => {
    const { getThreadFeed, loading, error } = useThread();
    const [threads, setThreads] = useState<ThreadType[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        const fetchThreads = async () => {
            try {
                const response = await getThreadFeed(page);
                if (response) {
                    setThreads(prevThreads =>
                        page === 1 ? response.results : [...prevThreads, ...response.results]
                    );

                    // Check if there are more pages
                    setHasMore(!!response.next);
                }
            } catch (error) {
                console.error('Error fetching threads:', error);
            }
        };

        fetchThreads();
    }, [page, getThreadFeed]);

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
                            <Thread key={thread.id} threadId={thread.id.toString()} />
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
