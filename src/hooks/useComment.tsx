import { useState } from 'react';

import {
    CommentTypes,
    CommentsResponse,
    RepliesResponse,
    CreateCommentRequest,
    CreateCommentResponse,
    LikeCommentResponse,
    RepostCommentResponse
} from '../types/CommentTypes';
import { API_BASE_URL } from '../config/api';
import { useCSRF } from './useCSRF';

const API_URL = `${API_BASE_URL}/api`;

export const useComment = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [comments, setComments] = useState<CommentTypes[]>([]);
    const { token: csrfToken, fetchCSRFToken } = useCSRF();

    // Get comments for a thread
    const getComments = async (threadId: number, page: number = 1): Promise<CommentsResponse | null> => {
        setLoading(true);
        setError(null);
        try {
            // Ensure we have a CSRF token
            const token = csrfToken || await fetchCSRFToken();
            if (!token) {
                throw new Error('Failed to get CSRF token');
            }

            const response = await fetch(`${API_URL}/threads/${threadId}/comments/?page=${page}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFTOKEN': token
                },
                credentials: 'include',
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Failed to fetch comments');
            }
            setComments(result.results);
            return result;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch comments');
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Get replies for a comment
    const getReplies = async (threadId: number, commentId: number): Promise<RepliesResponse | null> => {
        setLoading(true);
        setError(null);
        try {
            // Ensure we have a CSRF token
            const token = csrfToken || await fetchCSRFToken();
            if (!token) {
                throw new Error('Failed to get CSRF token');
            }

            const response = await fetch(`${API_URL}/threads/${threadId}/comments/${commentId}/replies/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFTOKEN': token
                },
                credentials: 'include',
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Failed to fetch replies');
            }
            return result;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch replies');
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Create a new comment
    const createComment = async (threadId: number, data: CreateCommentRequest): Promise<CreateCommentResponse | null> => {
        setLoading(true);
        setError(null);
        try {
            // Ensure we have a CSRF token
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
                throw new Error(result.message || 'Failed to create comment');
            }
            return result;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create comment');
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Like or unlike a comment
    const likeComment = async (threadId: number, commentId: number): Promise<LikeCommentResponse | null> => {
        setLoading(true);
        setError(null);
        try {
            // Ensure we have a CSRF token
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
                throw new Error(result.message || 'Failed to like/unlike comment');
            }
            return result;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to like/unlike comment');
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Repost or unrepost a comment
    const repostComment = async (threadId: number, commentId: number): Promise<RepostCommentResponse | null> => {
        setLoading(true);
        setError(null);
        try {
            // Ensure we have a CSRF token
            const token = csrfToken || await fetchCSRFToken();
            if (!token) {
                throw new Error('Failed to get CSRF token');
            }

            const response = await fetch(`${API_URL}/threads/${threadId}/comments/${commentId}/repost/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFTOKEN': token
                },
                credentials: 'include',
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Failed to repost/unrepost comment');
            }
            return result;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to repost/unrepost comment');
            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        comments,
        loading,
        error,
        getComments,
        getReplies,
        createComment,
        likeComment,
        repostComment,
    };
};