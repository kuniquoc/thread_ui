import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRegistrationRequest, UserLoginRequest, UserResponse, ApiResponse } from '../types';
import { API_BASE_URL } from '../config/api';
import { useCSRF } from './useCSRF';

const API_URL = `${API_BASE_URL}/api`;

// Helper function to clear all storage (cookies and localStorage)
const clearAllStorages = () => {
    // Clear all cookies
    document.cookie.split(';').forEach(cookie => {
        const [name] = cookie.split('=');
        document.cookie = `${name.trim()}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
    });
    
    // Clear localStorage
    localStorage.clear();
};

const CSRF_TOKEN_KEY = 'csrf_token';

export const useAuth = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { token: csrfToken, fetchCSRFToken } = useCSRF();

    const register = async (data: UserRegistrationRequest): Promise<ApiResponse<UserResponse> | null> => {
        setLoading(true);
        setError(null);
        try {
            // Ensure we have a CSRF token
            const token = csrfToken || await fetchCSRFToken();
            if (!token) {
                throw new Error('Failed to get CSRF token');
            }

            const response = await fetch(`${API_URL}/auth/users/`, {
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
            // Ensure we have a CSRF token
            const token = csrfToken || await fetchCSRFToken();
            if (!token) {
                throw new Error('Failed to get CSRF token');
            }

            const response = await fetch(`${API_URL}/auth/users/login/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFTOKEN': token
                },
                body: JSON.stringify(data),
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Failed to login');
            }

            // Remove CSRF token from localStorage after successful login
            localStorage.removeItem(CSRF_TOKEN_KEY);

            // Redirect using React Router
            navigate('/');
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
            // Ensure we have a CSRF token
            const token = csrfToken || await fetchCSRFToken();
            if (!token) {
                throw new Error('Failed to get CSRF token');
            }

            // Optional: Call logout endpoint if your API provides one
            const response = await fetch(`${API_URL}/auth/users/logout/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFTOKEN': token
                },
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Failed to logout from server');
            }

            // Clear all storage
            clearAllStorages();

            // Redirect using React Router
            navigate('/login');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to logout');
            // Even if server logout fails, clear storage and redirect
            clearAllStorages();
            navigate('/login');
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