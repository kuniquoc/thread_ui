import { useState } from 'react';
import {
    Thread,
    ThreadsListResponse,
    CreateThreadRequest,
    CreateCommentRequest,
    LikeThreadResponse,
    RepostThreadResponse,
    Comment,
    CommentListResponse,
    LikeCommentResponse
} from '../types';
import { API_BASE_URL } from '../config/api';
import { useCSRF } from './useCSRF';
import { useImageUpload } from './useImageUpload';

const API_URL = `${API_BASE_URL}/api`;

export const useThread = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [threads, setThreads] = useState<Thread[]>([]);
    const { token: csrfToken, fetchCSRFToken } = useCSRF();
    const { uploadImages } = useImageUpload();

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
                throw new Error(result.detail || 'Failed to fetch threads');
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
    const getThreadFeed = async (page: number = 1): Promise<ThreadsListResponse | null> => {
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
                throw new Error(result.detail || 'Failed to fetch thread feed');
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
    const getFollowingFeed = async (page: number = 1): Promise<ThreadsListResponse | null> => {
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
                throw new Error(result.detail || 'Failed to fetch following feed');
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

    // Get user threads
    const getUserThreads = async (page: number = 1): Promise<ThreadsListResponse | null> => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/threads/my_threads/?page=${page}`, {
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
            return result;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch user threads');
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Get commented threads
    const getCommentedThreads = async (page: number = 1): Promise<ThreadsListResponse | null> => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/threads/my_commented_threads/?page=${page}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.detail || 'Failed to fetch commented threads');
            }
            return result;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch commented threads');
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Get reposted threads
    const getRepostedThreads = async (page: number = 1): Promise<ThreadsListResponse | null> => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/threads/my_reposted_threads/?page=${page}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.detail || 'Failed to fetch reposted threads');
            }
            return result;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch reposted threads');
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Create a new thread
    const createThread = async (data: CreateThreadRequest): Promise<Thread | null> => {
        setLoading(true);
        setError(null);
        try {
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
                throw new Error(result.detail || 'Failed to create thread');
            }
            return result;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create thread');
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Get thread comments
    const getThreadComments = async (threadId: number, page: number = 1): Promise<CommentListResponse | null> => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/threads/${threadId}/comments/?page=${page}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.detail || 'Failed to fetch comments');
            }
            return result;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch comments');
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Create a comment
    const createComment = async (threadId: number, data: CreateCommentRequest): Promise<Comment | null> => {
        setLoading(true);
        setError(null);
        try {
            const token = csrfToken || await fetchCSRFToken();
            if (!token) {
                throw new Error('Failed to get CSRF token');
            }

            const response = await fetch(`${API_URL}/threads/${threadId}/comments/`, {
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
                throw new Error(result.detail || 'Failed to create comment');
            }
            return result;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create comment');
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
                throw new Error(result.detail || 'Failed to like/unlike thread');
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
                throw new Error(result.detail || 'Failed to repost/unrepost thread');
            }
            return result;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to repost/unrepost thread');
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Like/Unlike comment
    const likeComment = async (threadId: number, commentId: number): Promise<LikeCommentResponse | null> => {
        setLoading(true);
        setError(null);
        try {
            const token = csrfToken || await fetchCSRFToken();
            if (!token) {
                throw new Error('Failed to get CSRF token');
            }

            const response = await fetch(`${API_URL}/threads/${threadId}/comments/${commentId}/like/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFTOKEN': token
                },
                credentials: 'include',
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.detail || 'Failed to like/unlike comment');
            }
            return result;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to like/unlike comment');
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Delete a thread
    const deleteThread = async (threadId: number) => {
        setLoading(true);
        setError(null);
        try {
            const token = csrfToken || await fetchCSRFToken();
            if (!token) {
                throw new Error('Failed to get CSRF token');
            }

            const response = await fetch(`${API_URL}/threads/${threadId}/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFTOKEN': token
                },
                credentials: 'include',
            });
            
            if (!response.ok) {
                const result = await response.json();
                throw new Error(result.errors?.detail || 'Failed to delete thread');
            }
            
            return true;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete thread');
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
        getUserThreads,
        getCommentedThreads,
        getRepostedThreads,
        createThread,
        getThreadComments,
        createComment,
        likeThread,
        repostThread,
        likeComment,
        uploadImages,
        deleteThread,
    };
};