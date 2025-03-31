import { useState } from 'react';
import {
    Follow,
    FollowsResponse,
    FollowRequest,
    FollowersCountResponse
} from '../types/FollowTypes';
import { API_BASE_URL } from '../config/api';
import { useCSRF } from './useCSRF';

const API_URL = `${API_BASE_URL}/api`;

export const useFollow = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [follows, setFollows] = useState<Follow[]>([]);
    const { token: csrfToken, fetchCSRFToken } = useCSRF();

    // Get following list
    const getFollowingList = async (page: number = 1): Promise<FollowsResponse | null> => {
        setLoading(true);
        setError(null);
        try {
            // Ensure we have a CSRF token
            const token = csrfToken || await fetchCSRFToken();
            if (!token) {
                throw new Error('Failed to get CSRF token');
            }

            const response = await fetch(`${API_URL}/follows/?page=${page}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFTOKEN': token
                },
                credentials: 'include',
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Failed to fetch following list');
            }
            setFollows(result.results);
            return result;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch following list');
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Follow or unfollow a user
    const followUser = async (data: FollowRequest): Promise<Follow | null> => {
        setLoading(true);
        setError(null);
        try {
            // Ensure we have a CSRF token
            const token = csrfToken || await fetchCSRFToken();
            if (!token) {
                throw new Error('Failed to get CSRF token');
            }

            const response = await fetch(`${API_URL}/follows/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFTOKEN': token
                },
                credentials: 'include',
                body: JSON.stringify(data),
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Failed to follow/unfollow user');
            }
            return result;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to follow/unfollow user');
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Get followers count
    const getFollowersCount = async (): Promise<FollowersCountResponse | null> => {
        setLoading(true);
        setError(null);
        try {
            // Ensure we have a CSRF token
            const token = csrfToken || await fetchCSRFToken();
            if (!token) {
                throw new Error('Failed to get CSRF token');
            }

            const response = await fetch(`${API_URL}/follows/followers_count/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFTOKEN': token
                },
                credentials: 'include',
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Failed to fetch followers count');
            }
            return result;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch followers count');
            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        follows,
        loading,
        error,
        getFollowingList,
        followUser,
        getFollowersCount
    };
};