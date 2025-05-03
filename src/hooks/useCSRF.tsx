import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config/api';

interface CSRFResponse {
    status: string;
    data: {
        csrfToken: string;
    };
}

export const useCSRF = () => {
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCSRFToken = async (): Promise<string | null> => {
        // Check if the CSRF token is already set in the cookie
        const cookieValue = document.cookie
            .split('; ')
            .find(row => row.startsWith('csrfToken='))
            ?.split('=')[1];
        if (cookieValue) {
            setToken(cookieValue);
            return cookieValue;
        }
        // If not, fetch a new CSRF token from the server
        // and set it in the state and cookie
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/api/csrf/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            const result: CSRFResponse = await response.json();
            if (!response.ok) {
                throw new Error(result.status === 'error' ? result.data?.csrfToken : 'Failed to fetch CSRF token');
            }
            const csrfToken = result.data.csrfToken;
            setToken(csrfToken);

            // Optionally, you can set the CSRF token in a cookie for future requests
            document.cookie = `csrfToken=${csrfToken}; path=/; secure; SameSite=Strict`;

            return csrfToken;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch CSRF token');
            return null;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCSRFToken();
    }, []);

    return {
        token,
        loading,
        error,
        fetchCSRFToken,
    };
};
