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
import { useCSRF } from './useCSRF';

const API_URL = `${API_BASE_URL}/api`;
// Get ImgBB API key from environment variables
const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;

export const useThread = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [threads, setThreads] = useState<Thread[]>([]);
    const { token: csrfToken, fetchCSRFToken } = useCSRF();

    // Upload image to ImgBB
    const uploadImage = async (file: File): Promise<string | null> => {
        try {
            if (!IMGBB_API_KEY) {
                throw new Error('ImgBB API key is not configured');
            }

            const formData = new FormData();
            formData.append('image', file);
            formData.append('key', IMGBB_API_KEY);

            const response = await fetch('https://api.imgbb.com/1/upload', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();
            if (!result.success) {
                throw new Error(result.error?.message || 'Failed to upload image');
            }

            return result.data.url;
        } catch (err) {
            console.error('Error uploading image:', err);
            return null;
        }
    };

    // Upload multiple images and return array of URLs
    const uploadImages = async (files: File[]): Promise<string[]> => {
        setLoading(true);
        setError(null);
        try {
            const uploadPromises = files.map(file => uploadImage(file));
            const results = await Promise.all(uploadPromises);
            // Filter out null values (failed uploads)
            return results.filter((url): url is string => url !== null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to upload images');
            return [];
        } finally {
            setLoading(false);
        }
    };

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
            // Ensure we have a CSRF token
            const token = csrfToken || await fetchCSRFToken();
            if (!token) {
                throw new Error('Failed to get CSRF token');
            }

            const response = await fetch(`${API_URL}/threads/`, {
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
            // Ensure we have a CSRF token
            const token = csrfToken || await fetchCSRFToken();
            if (!token) {
                throw new Error('Failed to get CSRF token');
            }

            const response = await fetch(`${API_URL}/threads/${threadId}/like/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFTOKEN': token
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
            // Ensure we have a CSRF token
            const token = csrfToken || await fetchCSRFToken();
            if (!token) {
                throw new Error('Failed to get CSRF token');
            }

            const response = await fetch(`${API_URL}/threads/${threadId}/repost/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFTOKEN': token
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
        uploadImages, // Export the new function
    };
};