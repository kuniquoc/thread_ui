import { useState } from 'react';
import { FollowType, FollowRequest, FollowResponse, FollowCountResponse, PaginatedResponse } from '../types/AppTypes';
import { API_BASE_URL } from '../config/api';

const API_URL = `${API_BASE_URL}/api`;

export const useFollow = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getFollowers = async (userId: number): Promise<PaginatedResponse<FollowType> | null> => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`${API_URL}/follows/followers/${userId}/`, {
                credentials: 'include',
            });
            if (!response.ok) throw new Error('Failed to fetch followers');
            const data = await response.json();
            return data;
        } catch (err: any) {
            setError(err.message);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const getFollowing = async (userId: number): Promise<PaginatedResponse<FollowType> | null> => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`${API_URL}/follows/following/${userId}/`, {
                credentials: 'include',
            });
            if (!response.ok) throw new Error('Failed to fetch following');
            const data = await response.json();
            return data;
        } catch (err: any) {
            setError(err.message);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const followUser = async (userId: number): Promise<FollowResponse | null> => {
        try {
            setLoading(true);
            setError(null);
            const followRequest: FollowRequest = {
                followed_id: userId
            };
            const response = await fetch(`${API_URL}/follows/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(followRequest),
            });
            if (!response.ok) throw new Error('Failed to follow user');
            const data = await response.json();
            return data;
        } catch (err: any) {
            setError(err.message);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const unfollowUser = async (userId: number): Promise<void> => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`${API_URL}/follows/${userId}/`, {
                method: 'DELETE',
                credentials: 'include',
            });
            if (!response.ok) throw new Error('Failed to unfollow user');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getFollowersCount = async (userId: number): Promise<FollowCountResponse | null> => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`${API_URL}/follows/followers/${userId}/count/`, {
                credentials: 'include',
            });
            if (!response.ok) throw new Error('Failed to fetch followers count');
            const data = await response.json();
            return data;
        } catch (err: any) {
            setError(err.message);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        getFollowers,
        getFollowing,
        followUser,
        unfollowUser,
        getFollowersCount,
    };
};