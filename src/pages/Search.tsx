import { useState, useEffect } from 'react';
import PageWrapper from '../components/PageWrapper';
import SearchUserAccount from '../components/search/SearchUserAccount';
import { useSearch } from '../hooks/useSearch';
import { useFollow } from '../hooks/useFollow';
import { useUser } from '../hooks/useUser';
import { useScroll } from '../hooks/useScroll';
import { User } from '../types';

const Search = () => {
    const [query, setQuery] = useState<string>('');
    const [page, setPage] = useState<number>(1);
    const { searchResults, loading, error, searchUsers, loadMore } = useSearch();
    const { followUser } = useFollow();
    const { user: currentUser, getCurrentUser } = useUser();
    const isVisible = useScroll();

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newQuery = e.target.value;
        setQuery(newQuery);
        setPage(1);
        searchUsers(newQuery);
    };

    const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setPage(1);
        searchUsers(query);
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
        if (searchResults?.next && !loading) {
            loadMore(searchResults.next);
        }
    };

    const handleFollow = async (userId: number) => {
        const result = await followUser({ followed_id: userId });
        if (result) {
            // Force refresh the search results to update the follow status
            searchUsers(query);
        }
    };

    const filteredResults = (searchResults?.results || []).filter((user: User) => user.id !== currentUser?.id);

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
                        <div className="flex justify-center p-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        </div>
                    )}

                    {error && (
                        <div className="text-red-500 text-center p-4">
                            {error}
                        </div>
                    )}

                    {!loading && !error && query !== '' && filteredResults.length === 0 && (
                        <div className="text-center p-8 text-gray-400 bg-gray-800/20 rounded-xl border border-gray-700/50">
                            No users found matching "{query}"
                        </div>
                    )}

                    {filteredResults.map((user: User, index: number) => (
                        <div key={user.id} className="w-full">
                            <div className="bg-gray-800/30 rounded-xl p-4 hover:bg-gray-800/50 transition-all duration-200">
                                <SearchUserAccount
                                    user={user}
                                    isFollowing={user.is_followed}
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
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        </div>
                    )}

                    {searchResults?.next && !loading && (
                        <div className="flex justify-center pt-4">
                            <button
                                onClick={handleLoadMore}
                                className="px-6 py-2 bg-gray-800/50 hover:bg-gray-800/70 text-white rounded-full transition-all duration-200"
                            >
                                Load more
                            </button>
                        </div>
                    )}
                </div>
            </PageWrapper>
        </div>
    );
};

export default Search;
