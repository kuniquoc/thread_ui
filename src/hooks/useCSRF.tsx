import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config/api';

interface CSRFResponse {
    status: string;
    data: {
        csrfToken: string;
    };
}

const CSRF_TOKEN_KEY = 'csrf_token';

export const useCSRF = () => {
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCSRFToken = async (force: boolean = false): Promise<string | null> => {
        // Check localStorage first if not force
        if (!force) {
            const storedToken = localStorage.getItem(CSRF_TOKEN_KEY);
            if (storedToken) {
                setToken(storedToken);
                return storedToken;
            }
        }
        
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
            // Save to localStorage
            localStorage.setItem(CSRF_TOKEN_KEY, csrfToken);
            setToken(csrfToken);
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
