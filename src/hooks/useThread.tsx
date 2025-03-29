import { useState } from 'react';

import {
    ThreadType,
    ThreadCreateRequest,
    ThreadActionResponse,
    PaginatedResponse,
} from '../types/AppTypes';
import { API_BASE_URL } from '../config/api';

const API_URL = `${API_BASE_URL}/api`;

export const useThread = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [thread, ] = useState<ThreadType | null>(null);

    const apiCall = async <T,>(
        url: string,
        method: string = 'GET',
        body?: any
    ): Promise<T | null> => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}${url}`, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                    'Accept': 'application/json'
                },
                credentials: 'include',
                ...(body && { body: JSON.stringify(body) }),
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(
                    result.detail ||
                    (result.errors && JSON.stringify(result.errors)) ||
                    (result.status === 'error' && result.errors && Object.values(result.errors).join(', ')) ||
                    `Failed to ${method.toLowerCase()} thread`
                );
            }
            return result;
        } catch (err) {
            setError(err instanceof Error ? err.message : `Failed to ${method.toLowerCase()} thread`);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const getThreadById = async (id: string): Promise<ThreadType | null> => {
        const result = await apiCall<ThreadType>(`/threads/${id}/`);
        if (!result) return null;

        // The API returns thread data directly for get operations
        return {
            id: result.id,
            content: result.content,
            user: result.user,
            username: result.user.username,
            avatar: result.user.avatar,
            created_at: result.created_at,
            is_liked: result.is_liked,
            is_reposted: result.is_reposted,
            repostedBy: result.repostedBy || '',
            images: result.images || [],
            comment_count: result.comment_count,
            likes_count: result.likes_count,
            reposts_count: result.reposts_count,
            comments: result.comments || [],
        };
    };

    const getThreads = async () => {
        const result = await apiCall<PaginatedResponse<ThreadType>>('/threads/');
        return result ? result.results : null;
    };

    const getThreadFeed = async (page: number = 1) => {
        const result = await apiCall<PaginatedResponse<ThreadType>>(`/threads/feed/?page=${page}`);
        return result;
    };

    const getFollowingFeed = async (page: number = 1) => {
        const result = await apiCall<PaginatedResponse<ThreadType>>(`/threads/following_feed/?page=${page}`);
        return result;
    };

    const createThread = async (data: ThreadCreateRequest) => {
        // Create thread returns the thread data directly, not wrapped in status/data
        return await apiCall<ThreadType>('/threads/', 'POST', data);
    };

    const likeThread = async (threadId: number) => {
        return await apiCall<ThreadActionResponse>(`/threads/${threadId}/like/`, 'POST');
    };

    const repostThread = async (threadId: number) => {
        return await apiCall<ThreadActionResponse>(`/threads/${threadId}/repost/`, 'POST');
    };

    return {
        loading,
        error,
        thread,
        getThreadById,
        getThreads,
        getThreadFeed,
        getFollowingFeed,
        createThread,
        likeThread,
        repostThread,
    };
};