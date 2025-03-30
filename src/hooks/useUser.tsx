import { useState } from 'react';
import { UserResponse, UserUpdateRequest, ChangePasswordRequest, ApiResponse } from '../types';
import { API_BASE_URL } from '../config/api';

const API_URL = `${API_BASE_URL}/api`;

export const useUser = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<UserResponse | null>(null);

    const getCurrentUser = async (): Promise<UserResponse | null> => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/users/me`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Failed to get user info');
            }
            setUser(result.data);
            return result.data;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to get user info');
            return null;
        } finally {
            setLoading(false);
        }
    };

    const updateProfile = async (data: UserUpdateRequest): Promise<ApiResponse<UserResponse> | null> => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/users/me`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(data),
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Failed to update profile');
            }
            setUser(result.data);
            return result;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update profile');
            return null;
        } finally {
            setLoading(false);
        }
    };

    const changePassword = async (data: ChangePasswordRequest): Promise<ApiResponse<void> | null> => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/users/change-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(data),
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Failed to change password');
            }
            return result;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to change password');
            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        user,
        loading,
        error,
        getCurrentUser,
        updateProfile,
        changePassword,
    };
};