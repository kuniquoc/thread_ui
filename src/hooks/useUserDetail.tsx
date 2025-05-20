import { useState } from 'react';
import { UserDetail } from '../types/UserDetailTypes';
import { Thread } from '../types/ThreadTypes';
import { API_BASE_URL } from '../config/api';
import { useFollow } from './useFollow';

const API_URL = `${API_BASE_URL}/api`;

export const useUserDetail = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [userDetail, setUserDetail] = useState<UserDetail | null>(null);
    const [threads, setThreads] = useState<Thread[]>([]);
    const { followUser } = useFollow();

    // Get user details
    const getUserDetails = async (userId: number): Promise<UserDetail | null> => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/users/${userId}/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.detail || 'Failed to fetch user details');
            }
            setUserDetail(result);
            return result;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch user details');
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Get user threads
    const getUserThreads = async (userId: number, page: number = 1): Promise<Thread[] | null> => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/threads/user_threads/?user_id=${userId}&page=${page}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.detail || 'Failed to fetch user threads');
            }
            setThreads(result.results);
            return result.results;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch user threads');
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Handle follow/unfollow action
    const handleFollowAction = async (userId: number, isFollowed: boolean) => {
        try {
            const result = await followUser({ followed_id: userId });
            if (result) {
                setUserDetail(prev => prev ? {
                    ...prev,
                    is_followed: !isFollowed,
                    followers_count: prev.followers_count + (isFollowed ? -1 : 1)
                } : null);
            }
            return result;
        } catch (error) {
            setError('Failed to update follow status');
            return null;
        }
    };

    return {
        userDetail,
        threads,
        loading,
        error,
        getUserDetails,
        getUserThreads,
        handleFollowAction,
    };
};