import { useState } from 'react';
import { UserResponse, UserUpdateRequest, ChangePasswordRequest, ApiResponse } from '../types';
import { API_BASE_URL } from '../config/api';
import { useCSRF } from './useCSRF';

const API_URL = `${API_BASE_URL}/api`;

export const useUser = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<UserResponse | null>(null);
    const { token: csrfToken, fetchCSRFToken } = useCSRF();

    const getCurrentUser = async (): Promise<UserResponse | null> => {
        // Check if the user is already set in the state
        const localUser = localStorage.getItem('user');
        if (localUser) {
            const parsedUser = JSON.parse(localUser);
            setUser(parsedUser);
            return parsedUser;
        }
        
        // If not, fetch the user info from the server
        // and set it in the state
        setLoading(true);
        setError(null);
        try {
            // Ensure we have a CSRF token
            const token = csrfToken || await fetchCSRFToken();
            if (!token) {
                throw new Error('Failed to get CSRF token');
            }

            const response = await fetch(`${API_URL}/auth/users/me/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFTOKEN': token
                },
                credentials: 'include',
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Failed to get user info');
            }

            // Add is_followed property to API response
            const userData = {
                ...result.data,
                is_followed: false // Since this is current user, we set is_followed to false
            };

            setUser(userData);

            // Store in localStorage with is_followed property
            localStorage.setItem('user', JSON.stringify(userData));

            return userData;
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
            // Ensure we have a CSRF token
            const token = csrfToken || await fetchCSRFToken();
            if (!token) {
                throw new Error('Failed to get CSRF token');
            }

            const response = await fetch(`${API_URL}/auth/users/update_me/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFTOKEN': token
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
            // Ensure we have a CSRF token
            const token = csrfToken || await fetchCSRFToken();
            if (!token) {
                throw new Error('Failed to get CSRF token');
            }

            const response = await fetch(`${API_URL}/auth/users/change_password/`, {
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