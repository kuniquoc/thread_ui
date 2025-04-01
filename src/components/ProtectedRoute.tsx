import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '../hooks/useUser';

export const ProtectedRoute = () => {
    const { getCurrentUser } = useUser();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const user = await getCurrentUser();
            setIsAuthenticated(!!user);
            setIsLoading(false);
        };

        checkAuth();
    }, []);

    if (isLoading) {
        // You can return a loading spinner or placeholder here
        return <div>Loading...</div>;
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};
