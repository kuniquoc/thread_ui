import { useState } from 'react';
import { AccountType, PaginatedResponse, ApiResponse } from '../types/AppTypes';
import { API_BASE_URL } from '../config/api';

const API_URL = `${API_BASE_URL}/api`;

export const useSearch = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [results, setResults] = useState<AccountType[]>([]);
    const [pagination, setPagination] = useState<{
        count: number;
        next: string | null;
        previous: string | null;
    } | null>(null);

    const searchUsers = async (query: string, page: number = 1): Promise<PaginatedResponse<AccountType> | null> => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/users/search?q=${encodeURIComponent(query)}&page=${page}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Search failed');
            }
            setResults(result.results);
            setPagination({
                count: result.count,
                next: result.next,
                previous: result.previous,
            });
            return result;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Search failed');
            return null;
        } finally {
            setLoading(false);
        }
    };

    const loadMore = async (url: string): Promise<PaginatedResponse<AccountType> | null> => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Failed to load more results');
            }
            setResults([...results, ...result.results]);
            setPagination({
                count: result.count,
                next: result.next,
                previous: result.previous,
            });
            return result;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load more results');
            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        results,
        pagination,
        loading,
        error,
        searchUsers,
        loadMore,
    };
};