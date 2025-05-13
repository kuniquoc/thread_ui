import { useState, useEffect } from 'react';
import PageWrapper from '../components/PageWrapper';
import SearchUserAccount from '../components/search/SearchUserAccount';

import { useSearch } from '../hooks/useSearch';

const Search = () => {
    const [query, setQuery] = useState<string>('');
    const [page, setPage] = useState<number>(1);
    const { results, loading, error, pagination, searchUsers, loadMore } = useSearch();

    // Handle search input changes
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    };

    // Handle search form submission
    const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setPage(1); // Reset to first page on new search
        if (query.trim()) {
            searchUsers(query);
        }
    };

    // Perform initial search when component mounts (optional)
    useEffect(() => {
        searchUsers('');
    }, []);

    // Handle load more button click
    const handleLoadMore = () => {
        if (pagination?.next && !loading) {
            loadMore(pagination.next);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center">
            <h1 className="text-2xl font-bold p-4 bg-[#111111] w-full text-center sticky top-0 z-10">Search</h1>
            <PageWrapper>
                <div className="pt-5 pb-16">
                    {/* Search form */}
                    <div className="w-full pb-5 flex flex-col items-center">
                        <div>
                            <form onSubmit={handleSearchSubmit}>
                                <label htmlFor="search">
                                    <input
                                        type="search"
                                        id="search"
                                        placeholder="Search"
                                        className="w-200 border-none rounded-lg text-md px-3 py-2 bg-[#333] text-gray-200"
                                        value={query}
                                        onChange={handleSearchChange}
                                    />
                                </label>
                            </form>
                        </div>
                    </div>

                    {/* Loading indicator */}
                    {loading && page === 1 && (
                        <div className="my-4 text-center">
                            <p>Loading...</p>
                        </div>
                    )}

                    {/* Error message */}
                    {error && (
                        <div className="my-4 text-center text-red-500">
                            <p>Error: {error}</p>
                        </div>
                    )}

                    {/* Search results */}
                    {!loading && !error && results.length === 0 && (
                        <div className="my-4 text-center">
                            <p>No results found</p>
                        </div>
                    )}

                    {/* Display search results */}
                    {results.map((user, index) => (
                        <div key={user.id} className="w-full">
                            <SearchUserAccount
                                user={user}
                                followersCount={Math.floor(Math.random() * 1000000)}
                            />
                            {index < results.length - 1 && (
                                <div className="border border-[#222] border-opacity-50 w-full"></div>
                            )}
                        </div>
                    ))}

                    {/* Loading more indicator */}
                    {loading && page > 1 && (
                        <div className="text-center p-4 text-gray-400">
                            Loading more results...
                        </div>
                    )}

                    {/* Load more button */}
                    {pagination?.next && !loading && (
                        <button
                            onClick={handleLoadMore}
                            className="w-full max-w-md py-3 mt-4 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            Load more results
                        </button>
                    )}

                    {/* End of results message */}
                    {!pagination?.next && results.length > 0 && (
                        <div className="text-center p-4 text-gray-500">You've reached the end</div>
                    )}
                </div>
            </PageWrapper>
        </div>
    );
};

export default Search;
