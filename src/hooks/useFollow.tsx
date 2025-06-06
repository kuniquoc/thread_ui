import { useState } from 'react';
import {
    Follow,
    FollowsResponse,
    FollowRequest,
    FollowersCountResponse,
    UserFollowsCountResponse,
    FollowStatusResponse,
    UserFollowersResponse
} from '../types/FollowTypes';
import { API_BASE_URL } from '../config/api';
import { useCSRF } from './useCSRF';
import { useUser } from './useUser';

const API_URL = `${API_BASE_URL}/api`;

export const useFollow = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [follows, setFollows] = useState<Follow[]>([]);
    const { token: csrfToken, fetchCSRFToken } = useCSRF();
    const {user, getCurrentUser} = useUser();

    // Get following list
    const getFollowingList = async (userId: number = 0, page: number = 1): Promise<FollowsResponse | null> => {
        setLoading(true);
        setError(null);
        try {
            const token = csrfToken || await fetchCSRFToken();
            if (!token) {
                throw new Error('Failed to get CSRF token');
            }

            let queryUserId = userId;
            if (userId === 0) {
                if (!user) {
                    await getCurrentUser();
                }
                if (!user?.id) {
                    throw new Error('User not found');
                }
                queryUserId = user.id;
            }

            const response = await fetch(`${API_URL}/follows/?user_id=${queryUserId}&page=${page}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFTOKEN': token
                },
                credentials: 'include',
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.errors?.detail || 'Failed to fetch following list');
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
                throw new Error(result.errors?.detail || 'Failed to follow/unfollow user');
            }

            // Update local follows state if needed
            if (result.status === "Followed successfully") {
                const newFollow: Follow = result;
                setFollows(prev => [...prev, newFollow]);
            } else {
                setFollows(prev => prev.filter(follow => follow.followed.id !== data.followed_id));
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
                throw new Error(result.errors?.detail || 'Failed to fetch followers count');
            }
            return result;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch followers count');
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Get user follows count
    const getUserFollowsCount = async (userId: number): Promise<UserFollowsCountResponse | null> => {
        setLoading(true);
        setError(null);
        try {
            const token = csrfToken || await fetchCSRFToken();
            if (!token) {
                throw new Error('Failed to get CSRF token');
            }

            const response = await fetch(`${API_URL}/follows/user_follows_count/?user_id=${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFTOKEN': token
                },
                credentials: 'include',
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.errors?.detail || 'Failed to fetch user follows count');
            }
            return result;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch user follows count');
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Check follow status
    const checkFollowStatus = async (userId: number): Promise<FollowStatusResponse | null> => {
        setLoading(true);
        setError(null);
        try {
            const token = csrfToken || await fetchCSRFToken();
            if (!token) {
                throw new Error('Failed to get CSRF token');
            }

            const response = await fetch(`${API_URL}/follows/check_status/?user_id=${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFTOKEN': token
                },
                credentials: 'include',
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.errors?.detail || 'Failed to check follow status');
            }
            return result;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to check follow status');
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Get followers of a user
    const getUserFollowers = async (userId: number, page: number = 1): Promise<UserFollowersResponse | null> => {
        setLoading(true);
        setError(null);
        try {
            const token = csrfToken || await fetchCSRFToken();
            if (!token) {
                throw new Error('Failed to get CSRF token');
            }

            const response = await fetch(`${API_URL}/follows/followers/?user_id=${userId}&page=${page}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFTOKEN': token
                },
                credentials: 'include',
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.errors?.detail || 'Failed to fetch user followers');
            }
            return result;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch user followers');
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Check if following a specific user locally (from follows state)
    const isFollowing = (userId: number): boolean => {
        return follows.some(follow => follow.followed.id === userId);
    };

    // Get total following count locally (from follows state)
    const getFollowingCount = (): number => {
        return follows.length;
    };

    return {
        follows,
        loading,
        error,
        getFollowingList,
        followUser,
        getFollowersCount,
        getUserFollowsCount,
        checkFollowStatus,
        getUserFollowers,
        isFollowing,
        getFollowingCount,
    };
};