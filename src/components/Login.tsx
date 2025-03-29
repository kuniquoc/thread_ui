import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import Input from './common/Input';

const Login = () => {
    const { login, loading, error } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await login({ username, password });
    };

    return (
        <div className="w-full space-y-8 rounded-lg p-6">
            <h2 className="text-center text-3xl font-bold text-white">Login</h2>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-4 rounded-md">
                    <Input
                        id="username"
                        label="Username"
                        name="username"
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <Input
                        id="password"
                        label="Password"
                        name="password"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                {error && <div className="text-red-500 text-sm">{error}</div>}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-md bg-blue-600 py-2 px-4 text-white hover:bg-blue-700 disabled:bg-blue-400"
                >
                    {loading ? 'Signing in...' : 'Sign in'}
                </button>

                <div className="text-center text-gray-400">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-blue-400 hover:text-blue-300">
                        Register here
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default Login;
