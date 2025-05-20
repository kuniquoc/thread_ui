import { useState } from 'react';
import { useForgotPassword } from '../hooks/useForgotPassword';
import { Link, useNavigate } from 'react-router-dom';
import Input from './common/Input';

const ForgotPassword = () => {
    const { forgotPassword, loading, error } = useForgotPassword();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await forgotPassword({ email, username });
        if (result?.status === 'success') {
            setSuccess(true);
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        }
    };

    return (
        <div className="flex min-h-screen w-dvw items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 to-gray-800">
            <div className="w-full max-w-md space-y-8 rounded-2xl bg-gray-800/50 backdrop-blur-xl p-8 shadow-2xl border border-gray-700 transform transition duration-500 hover:scale-[1.02]">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                        Forgot Password
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-400">
                        Enter your email and username to reset your password
                    </p>
                </div>

                {success ? (
                    <div className="text-sm text-green-400 bg-green-900/20 p-3 rounded-lg border border-green-800">
                        Password reset instructions have been sent to your email. Redirecting to login...
                    </div>
                ) : (
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-5 rounded-md">
                            <Input
                                id="email"
                                label="Email"
                                name="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-gray-700/50"
                            />
                            <Input
                                id="username"
                                label="Username"
                                name="username"
                                type="text"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="bg-gray-700/50"
                            />
                        </div>

                        {error && (
                            <div className="text-sm text-red-400 bg-red-900/20 p-3 rounded-lg border border-red-800">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative flex w-full justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 text-sm font-semibold text-white transition-all duration-300 hover:from-blue-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
                        >
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 rounded-full border-2 border-gray-700 border-t-blue-500 animate-spin"></div>
                                    <span>Submitting...</span>
                                </div>
                            ) : 'Reset Password'}
                        </button>

                        <div className="text-center text-sm text-gray-400">
                            Remember your password?{' '}
                            <Link to="/login" className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 hover:from-blue-300 hover:to-purple-400 transition-all duration-300">
                                Login here
                            </Link>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
