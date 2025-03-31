import { useState } from 'react';
import { UserResponse, PaginatedResponse } from '../types';
import { API_BASE_URL } from '../config/api';
import { useCSRF } from './useCSRF';

const API_URL = `${API_BASE_URL}/api`;

export const useSearch = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [results, setResults] = useState<UserResponse[]>([]);
    const [pagination, setPagination] = useState<{
        count: number;
        next: string | null;
        previous: string | null;
    } | null>(null);
    const { token: csrfToken, fetchCSRFToken } = useCSRF();

    const searchUsers = async (query: string, page: number = 1): Promise<PaginatedResponse<UserResponse> | null> => {
        setLoading(true);
        setError(null);
        try {
            // Ensure we have a CSRF token
            const token = csrfToken || await fetchCSRFToken();
            if (!token) {
                throw new Error('Failed to get CSRF token');
            }

            const response = await fetch(`${API_URL}/users/?search=${encodeURIComponent(query)}&page=${page}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFTOKEN': token
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

    const loadMore = async (url: string): Promise<PaginatedResponse<UserResponse> | null> => {
        setLoading(true);
        setError(null);
        try {
            // Ensure we have a CSRF token
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