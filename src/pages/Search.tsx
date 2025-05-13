import { useState, useEffect } from 'react';
import PageWrapper from '../components/PageWrapper';
import SearchUserAccount from '../components/search/SearchUserAccount';
import { useSearch } from '../hooks/useSearch';
import { useFollow } from '../hooks/useFollow';
import { useUser } from '../hooks/useUser';

const Search = () => {
    const [query, setQuery] = useState<string>('');
    const [page, setPage] = useState<number>(1);
    const { results, loading, error, pagination, searchUsers, loadMore } = useSearch();
    const { followUser, isFollowing } = useFollow();
    const { user: currentUser, getCurrentUser } = useUser();

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    };

    const handleFollow = async (userId: number) => {
        await followUser({ followed_id: userId });
    };

    const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setPage(1);
        if (query.trim()) {
            searchUsers(query);
        }
    };

    useEffect(() => {
        const fetchCurrentUser = async () => {
            await getCurrentUser();
        };
        fetchCurrentUser();
    }, []);

    useEffect(() => {
        searchUsers('');
    }, []);

    const handleLoadMore = () => {
        if (pagination?.next && !loading) {
            loadMore(pagination.next);
        }
    };

    const filteredResults = results.filter(user => user.id !== currentUser?.id);

    return (
        <div className="min-h-screen flex flex-col items-center">
            <div className="w-full bg-gradient-to-b from-gray-900 to-gray-800 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-2xl font-bold p-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                        Search
                    </h1>
                </div>
            </div>

            <PageWrapper>
                <div className="pt-5 pb-16">
                    <div className="w-full pb-5 flex flex-col items-center">
                        <form onSubmit={handleSearchSubmit} className="w-full max-w-md">
                            <div className="relative">
                                <input
                                    type="search"
                                    id="search"
                                    placeholder="Search users..."
                                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    value={query}
                                    onChange={handleSearchChange}
                                />
                            </div>
                        </form>
                    </div>

                    {loading && page === 1 && (
                        <div className="flex justify-center p-4">
                            <div className="w-8 h-8 rounded-full border-2 border-gray-700 border-t-blue-500 animate-spin"></div>
                        </div>
                    )}

                    {error && (
                        <div className="text-center p-4 text-red-400 bg-red-900/20 rounded-lg border border-red-800">
                            {error}
                        </div>
                    )}

                    {!loading && !error && filteredResults.length === 0 && (
                        <div className="text-center p-8 text-gray-400 bg-gray-800/20 rounded-xl border border-gray-700/50">
                            No users found
                        </div>
                    )}

                    {filteredResults.map((user, index) => (
                        <div key={user.id} className="w-full">
                            <div className="bg-gray-800/30 rounded-xl p-4 hover:bg-gray-800/50 transition-all duration-200">
                                <SearchUserAccount
                                    user={user}
                                    isFollowing={isFollowing(user.id)}
                                    onFollow={() => handleFollow(user.id)}
                                />
                            </div>
                            {index < filteredResults.length - 1 && (
                                <div className="h-px bg-gray-700/30 my-4"></div>
                            )}
                        </div>
                    ))}

                    {loading && page > 1 && (
                        <div className="flex justify-center p-4">
                            <div className="w-8 h-8 rounded-full border-2 border-gray-700 border-t-blue-500 animate-spin"></div>
                        </div>
                    )}

                    {pagination?.next && !loading && (
                        <div className="flex justify-center mt-6">
                            <button
                                onClick={handleLoadMore}
                                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-medium text-sm hover:from-blue-500 hover:to-purple-500 transition-all duration-300 transform hover:-translate-y-0.5"
                            >
                                Load more
                            </button>
                        </div>
                    )}

                    {!pagination?.next && filteredResults.length > 0 && (
                        <div className="text-center p-4 text-gray-500">
                            You've reached the end
                        </div>
                    )}
                </div>
            </PageWrapper>
        </div>
    );
};

export default Search;
