import { useState } from 'react';
import { ReplyType, ApiResponse, PaginatedResponse } from '../types/AppTypes';
import { API_BASE_URL } from '../config/api';

const API_URL = `${API_BASE_URL}/api`;

export const useReply = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getReplies = async (threadId: number): Promise<ApiResponse<PaginatedResponse<ReplyType>> | null> => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/threads/${threadId}/replies`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
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

    const createReply = async (threadId: number, content: string): Promise<ApiResponse<ReplyType> | null> => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/threads/${threadId}/replies`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content }),
            });
            const result = await response.json();
            if (!response.ok) {
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

    const likeReply = async (threadId: number, replyId: number): Promise<ApiResponse<void> | null> => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/threads/${threadId}/replies/${replyId}/like`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Failed to like reply');
            }
            return result;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to like reply');
            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        getReplies,
        createReply,
        likeReply,
    };
};