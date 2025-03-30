import { useState } from 'react';
import { UserRegistrationRequest, UserLoginRequest, UserResponse, ApiResponse } from '../types';
import { API_BASE_URL } from '../config/api';

const API_URL = `${API_BASE_URL}/api`;

export const useAuth = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const register = async (data: UserRegistrationRequest): Promise<ApiResponse<UserResponse> | null> => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/auth/users/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Registration failed');
            }
            return result;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Registration failed');
            return null;
        } finally {
            setLoading(false);
        }
    };

    const login = async (data: UserLoginRequest): Promise<void> => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/auth/users/login/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Important for cookies
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Failed to login');
            }

            // Redirect or handle successful login
            window.location.href = '/';
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to login');
        } finally {
            setLoading(false);
        }
    };

    const logout = async (): Promise<void> => {
        setLoading(true);
        setError(null);
        try {
            await fetch(`${API_URL}/auth/logout`, {
                method: 'POST',
                credentials: 'include', // Important for cookies
            });

            // Redirect to login page
            window.location.href = '/login';
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to logout');
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        register,
        login,
        logout,
    };
};