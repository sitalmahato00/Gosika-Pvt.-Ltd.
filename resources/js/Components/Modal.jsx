import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-2xl' }) {
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
                onClick={onClose}
            />

            {/* Modal Dialog */}
            <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                <div className={`relative transform overflow-hidden rounded-xl bg-white text-left shadow-2xl transition-all sm:my-8 w-full ${maxWidth} border border-gray-100`}>
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                        <h3 className="text-lg font-bold text-[#202124]">{title}</h3>
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 max-h-[calc(85vh-100px)] overflow-y-auto">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
