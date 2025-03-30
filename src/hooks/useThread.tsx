import { useState } from 'react';

import {
    Thread,
    ThreadsListResponse,
    ThreadFeedResponse,
    FollowingFeedResponse,
    CreateThreadRequest,
    CreateThreadResponse,
    LikeThreadResponse,
    RepostThreadResponse
} from '../types';
import { API_BASE_URL } from '../config/api';

const API_URL = `${API_BASE_URL}/api`;

export const useThread = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [threads, setThreads] = useState<Thread[]>([]);

    // Get all threads
    const getAllThreads = async (page: number = 1): Promise<ThreadsListResponse | null> => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/threads/?page=${page}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Failed to fetch threads');
            }
            setThreads(result.results);
            return result;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch threads');
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Get thread feed
    const getThreadFeed = async (page: number = 1): Promise<ThreadFeedResponse | null> => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/threads/feed/?page=${page}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Failed to fetch thread feed');
            }
            setThreads(result.results);
            return result;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch thread feed');
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Get following feed
    const getFollowingFeed = async (page: number = 1): Promise<FollowingFeedResponse | null> => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/threads/following_feed/?page=${page}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Failed to fetch following feed');
            }
            setThreads(result.results);
            return result;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch following feed');
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Create a new thread
    const createThread = async (data: CreateThreadRequest): Promise<CreateThreadResponse | null> => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/threads/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(data),
            });
            const result = await response.json();
            if (!response.ok) {
                if (result.errors?.content) {
                    throw new Error(result.errors.content);
                }
                throw new Error(result.message || 'Failed to create thread');
            }
            return result;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create thread');
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Like or unlike a thread
    const likeThread = async (threadId: number): Promise<LikeThreadResponse | null> => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/threads/${threadId}/like/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Failed to like/unlike thread');
            }
            return result;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to like/unlike thread');
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Repost or unrepost a thread
    const repostThread = async (threadId: number): Promise<RepostThreadResponse | null> => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/threads/${threadId}/repost/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Failed to repost/unrepost thread');
            }
            return result;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to repost/unrepost thread');
            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        threads,
        loading,
        error,
        getAllThreads,
        getThreadFeed,
        getFollowingFeed,
        createThread,
        likeThread,
        repostThread,
    };
};