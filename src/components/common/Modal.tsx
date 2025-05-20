import { ReactNode } from 'react';

interface ModalProps {
    show: boolean;
    onClose: () => void;
    children: ReactNode;
    className?: string;
    mouseY?: number;
}

const Modal = ({ show, onClose, children, className = '', mouseY = 0 }: ModalProps) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50">
            <div 
                className="fixed inset-0 bg-black/30 backdrop-blur-[2px]" 
                onClick={onClose} 
            />
            <div 
                className={`absolute left-1/2 -translate-x-1/2 w-[95%] overflow-hidden bg-white rounded-lg shadow-lg z-50 max-w-lg ${className}`}
                style={{ 
                    top: mouseY,
                    maxHeight: 'calc(90vh - 40px)',
                    overflowY: 'auto'
                }}
            >
                {children}
            </div>
        </div>
    );
};

export default Modal;