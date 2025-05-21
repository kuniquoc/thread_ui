import { useEffect, useState } from 'react';
import { FiBell } from 'react-icons/fi';

interface ToastProps {
    message: string;
    duration?: number;
    onClose?: () => void;
}

export const Toast = ({ message, duration = 8000, onClose }: ToastProps) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        console.log('🔔 Toast mounted with message:', message);
        
        const timer = setTimeout(() => {
            console.log('⏲️ Toast timeout reached, closing:', message);
            setIsVisible(false);
            onClose?.();
        }, duration);

        return () => {
            console.log('🧹 Toast cleanup for:', message);
            clearTimeout(timer);
        };
    }, [duration, onClose, message]);

    if (!isVisible) {
        console.log('🚫 Toast not visible:', message);
        return null;
    }

    return (
        <div className="fixed bottom-4 right-4 z-[9999] animate-slide-up transform-gpu">
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white px-8 py-5 rounded-lg shadow-xl border border-gray-700/50 backdrop-blur-sm flex items-center gap-4 min-w-[380px]">
                <FiBell className="text-blue-400 w-7 h-7" />
                <p className="text-lg font-medium">{message}</p>
            </div>
        </div>
    );
};
