import { useState } from 'react';
import {
    Comment,
    RepliesResponse,
    CreateCommentRequest,
    CreateCommentResponse,
    LikeCommentResponse
} from '../types/CommentTypes';
import { API_BASE_URL } from '../config/api';
import { useCSRF } from './useCSRF';

const API_URL = `${API_BASE_URL}/api`;

export const useReply = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [replies, setReplies] = useState<Comment[]>([]);
    const { token: csrfToken, fetchCSRFToken } = useCSRF();

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
            setReplies(result);
            return result;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch replies');
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Create a new reply
    const createReply = async (threadId: number, data: CreateCommentRequest): Promise<CreateCommentResponse | null> => {
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
                throw new Error(result.message || 'Failed to create reply');
            }
            return result;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create reply');
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Like or unlike a reply
    const likeReply = async (threadId: number, commentId: number): Promise<LikeCommentResponse | null> => {
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
                throw new Error(result.message || 'Failed to like/unlike reply');
            }
            return result;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to like/unlike reply');
            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        replies,
        loading,
        error,
        getReplies,
        createReply,
        likeReply,
    };
};