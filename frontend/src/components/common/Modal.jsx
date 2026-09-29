import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }) => {
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
      <div className="min-h-screen px-4 text-center flex items-center justify-center">
        <div
          className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
        <div
          className={`inline-block w-full ${maxWidth} p-6 my-8 text-left align-middle transition-all transform bg-surface-card border border-surface-border rounded-xl shadow-2xl relative z-10`}
        >
          <div className="flex items-center justify-between pb-4 border-b border-surface-border mb-4">
            <h3 className="text-base font-semibold text-white tracking-tight">{title}</h3>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-200 transition-colors p-1 rounded-md hover:bg-surface-hover"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};
