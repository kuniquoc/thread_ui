import { useState } from 'react';
import { ForgotPasswordRequest, ApiResponse } from '../types';
import { API_BASE_URL } from '../config/api';
import { useCSRF } from './useCSRF';

const API_URL = `${API_BASE_URL}/api`;

export const useForgotPassword = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { token: csrfToken, fetchCSRFToken } = useCSRF();

    const forgotPassword = async (data: ForgotPasswordRequest): Promise<ApiResponse<void> | null> => {
        setLoading(true);
        setError(null);
        try {
            // Ensure we have a CSRF token
            const token = csrfToken || await fetchCSRFToken();
            if (!token) {
                throw new Error('Failed to get CSRF token');
            }

            const response = await fetch(`${API_URL}/auth/users/forgot_password/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFTOKEN': token
                },
                body: JSON.stringify(data),
                credentials: 'include',
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.errors?.detail || 'Failed to reset password');
            }
            return result;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to reset password');
            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        forgotPassword,
    };
};
