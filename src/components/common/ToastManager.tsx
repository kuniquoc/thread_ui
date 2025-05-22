import { useState, useCallback, createContext, useContext, useEffect } from 'react';
import { Toast } from './Toast';

export interface ToastMessage {
    id: string;
    message: string;
}

interface ToastManagerProps {
    maxToasts?: number;
    onAddToast: (fn: (message: string) => void) => void;
}

interface ToastContextType {
    addToast: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export const ToastManager = ({ maxToasts = 3, onAddToast }: ToastManagerProps) => {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const addToast = useCallback((message: string) => {
        const id = Date.now().toString();
        setToasts((prev) => {
            const newToasts = [{ id, message }, ...prev];
            return newToasts.slice(0, maxToasts);
        });
    }, [maxToasts]);

    // Use useEffect to pass addToast function to parent
    useEffect(() => {
        onAddToast(addToast);
    }, [addToast, onAddToast]);

    return (
        <>
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    message={toast.message}
                    onClose={() => removeToast(toast.id)}
                />
            ))}
        </>
    );
};

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
    const [addToastFn, setAddToastFn] = useState<(message: string) => void>(() => {
        return () => console.warn('Toast system not yet initialized');
    });

    const handleAddToast = useCallback((fn: (message: string) => void) => {
        setAddToastFn(() => fn);
    }, []);

    return (
        <ToastContext.Provider value={{ addToast: addToastFn }}>
            {children}
            <ToastManager maxToasts={3} onAddToast={handleAddToast} />
        </ToastContext.Provider>
    );
};
