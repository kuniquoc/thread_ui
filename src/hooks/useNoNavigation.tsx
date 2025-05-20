import { useLocation } from 'react-router-dom';

export const useNoNavigation = () => {
    const location = useLocation();
    const noNavigationRoutes = ['/login', '/register', '/forgot-password'];

    return noNavigationRoutes.includes(location.pathname);
};
