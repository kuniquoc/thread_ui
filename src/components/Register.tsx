import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import Input from './common/Input';

const Register = () => {
    const { register, loading, error } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        password2: '',
        first_name: '',
        last_name: '',
    });
    const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

    const validateForm = () => {
        const errors: { [key: string]: string } = {};
        
        // Validate username
        if (formData.username.length < 3) {
            errors.username = 'Username must be at least 3 characters long';
        }
        if (formData.username.length > 30) {
            errors.username = 'Username must not exceed 30 characters';
        }
        if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
            errors.username = 'Username can only contain letters, numbers and underscores';
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            errors.email = 'Please enter a valid email address';
        }

        // Validate password
        if (formData.password.length < 8) {
            errors.password = 'Password must be at least 8 characters long';
        }
        if (!/[A-Z]/.test(formData.password)) {
            errors.password = 'Password must contain at least one uppercase letter';
        }
        if (!/[a-z]/.test(formData.password)) {
            errors.password = 'Password must contain at least one lowercase letter';
        }
        if (!/[0-9]/.test(formData.password)) {
            errors.password = 'Password must contain at least one number';
        }
        if (!/[!@#$%^&*]/.test(formData.password)) {
            errors.password = 'Password must contain at least one special character (!@#$%^&*)';
        }

        // Validate password confirmation
        if (formData.password !== formData.password2) {
            errors.password2 = 'Passwords do not match';
        }

        // Validate names
        if (formData.first_name.trim().length === 0) {
            errors.first_name = 'First name is required';
        }
        if (formData.last_name.trim().length === 0) {
            errors.last_name = 'Last name is required';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        // Clear validation error when user starts typing
        if (validationErrors[e.target.name]) {
            setValidationErrors({
                ...validationErrors,
                [e.target.name]: ''
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        const success = await register(formData);
        if (success) {
            navigate('/login');
        }
    };

    return (
        <div className="flex min-h-screen w-dvw items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 to-gray-800">
            <div className="w-full max-w-md space-y-8 rounded-2xl bg-gray-800/50 backdrop-blur-xl p-8 shadow-2xl border border-gray-700 transform transition duration-500 hover:scale-[1.02]">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                        Create your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-400">
                        Join our community and start sharing
                    </p>
                </div>
                
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-5 rounded-md">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="First Name"
                                name="first_name"
                                type="text"
                                required
                                value={formData.first_name}
                                onChange={handleChange}
                                error={validationErrors.first_name}
                                className="bg-gray-700/50"
                            />
                            <Input
                                label="Last Name"
                                name="last_name"
                                type="text"
                                required
                                value={formData.last_name}
                                onChange={handleChange}
                                error={validationErrors.last_name}
                                className="bg-gray-700/50"
                            />
                        </div>
                        
                        <Input
                            label="Username"
                            name="username"
                            type="text"
                            required
                            value={formData.username}
                            onChange={handleChange}
                            error={validationErrors.username}
                            className="bg-gray-700/50"
                        />
                        <Input
                            label="Email"
                            name="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            error={validationErrors.email}
                            className="bg-gray-700/50"
                        />
                        <Input
                            label="Password"
                            name="password"
                            type="password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            error={validationErrors.password}
                            className="bg-gray-700/50"
                        />
                        <Input
                            label="Confirm Password"
                            name="password2"
                            type="password"
                            required
                            value={formData.password2}
                            onChange={handleChange}
                            error={validationErrors.password2}
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
                                <span>Creating account...</span>
                            </div>
                        ) : 'Create account'}
                    </button>

                    <div className="text-center text-sm text-gray-400">
                        Already have an account?{' '}
                        <Link to="/login" className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 hover:from-blue-300 hover:to-purple-400 transition-all duration-300">
                            Login here
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
