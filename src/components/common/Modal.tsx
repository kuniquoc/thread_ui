import { ReactNode } from 'react';

interface ModalProps {
    show: boolean;
    onClose: () => void;
    children: ReactNode;
    className?: string;
}

const Modal = ({ show, onClose, children, className = '' }: ModalProps) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto">
            <div className="fixed inset-0 bg-black/30 backdrop-blur-[2px]" onClick={onClose} />
            <div className={`relative z-50 ${className}`}>
                {children}
            </div>
        </div>
    );
};

export default Modal;