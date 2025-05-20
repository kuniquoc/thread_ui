import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import Home from '../pages/Home';
import Search from '../pages/Search';
import Notification from '../pages/Notification';
import Profile from '../pages/Profile';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import UserDetailView from '../pages/UserDetailView';
import { ProtectedRoute } from '../components/ProtectedRoute';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                path: '/login',
                element: <LoginPage />
            },
            {
                path: '/register',
                element: <RegisterPage />
            },
            {
                element: <ProtectedRoute />,
                children: [
                    {
                        index: true,
                        element: <Home />
                    },
                    {
                        path: '/search',
                        element: <Search />
                    },
                    {
                        path: '/notification',
                        element: <Notification />
                    },
                    {
                        path: '/profile',
                        element: <Profile />
                    },
                    {
                        path: '/user/:userId',
                        element: <UserDetailView />
                    }
                ]
            }
        ]
    }
]);