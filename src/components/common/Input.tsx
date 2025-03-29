import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    name: string;
    error?: string;
}

const Input = ({ label, name, error, ...props }: InputProps) => {
    return (
        <div>
            <label htmlFor={name} className="block text-2xl font-medium text-gray-300">
                {label}
            </label>
            <input
                id={name}
                name={name}
                {...props}
                className="mt-1 block w-100 h-10 rounded-md border-gray-600 bg-gray-700 text-white"
            />
            {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
        </div>
    );
};

export default Input;
