import { useState } from 'react';
import { API_BASE_URL } from '../config/api';
import { useCSRF } from './useCSRF';
import { SearchUserResponse} from '../types';

export const useSearch = () => {
    const [searchResults, setSearchResults] = useState<SearchUserResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { token: csrfToken, fetchCSRFToken } = useCSRF();

    const searchUsers = async (query: string, page: number = 1): Promise<SearchUserResponse | null> => {
        setLoading(true);
        setError(null);
        try {
            const token = csrfToken || await fetchCSRFToken();
            if (!token) {
                throw new Error('Failed to get CSRF token');
            }

            const response = await fetch(`${API_BASE_URL}/api/users/search/?q=${encodeURIComponent(query)}&page=${page}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFTOKEN': token
                },
                credentials: 'include',
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.errors?.detail || 'Failed to search users');
            }
            
            if (page === 1) {
                setSearchResults(result);
            } else if (searchResults) {
                setSearchResults({
                    ...result,
                    results: [...searchResults.results, ...result.results]
                });
            }
            
            return result;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to search users');
            return null;
        } finally {
            setLoading(false);
        }
    };

    const loadMore = async (url: string): Promise<SearchUserResponse | null> => {
        setLoading(true);
        setError(null);
        try {
            const token = csrfToken || await fetchCSRFToken();
            if (!token) {
                throw new Error('Failed to get CSRF token');
            }

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFTOKEN': token
                },
                credentials: 'include',
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.errors?.detail || 'Failed to load more users');
            }

            if (searchResults) {
                setSearchResults({
                    ...result,
                    results: [...searchResults.results, ...result.results]
                });
            } else {
                setSearchResults(result);
            }

            return result;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load more users');
            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        searchResults,
        loading,
        error,
        searchUsers,
        loadMore
    };
};