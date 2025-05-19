import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    name: string;
    error?: string;
    className?: string;
}

const Input = ({ label, name, error, className = '', ...props }: InputProps) => {
    return (
        <div className="w-full">
            <label htmlFor={name} className="block text-sm font-medium text-gray-300 mb-1">
                {label}
            </label>
            <input
                id={name}
                name={name}
                {...props}
                className={`block w-full px-3 py-2 rounded-lg border border-gray-600 shadow-sm
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    text-white placeholder-gray-400 ${className}`}
            />
            {error && (
                <p className="mt-1 text-sm text-red-400">
                    {error}
                </p>
            )}
        </div>
    );
};

export default Input;
