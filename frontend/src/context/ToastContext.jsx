import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    ({ type = 'info', title, message, duration = 4000 }) => {
      const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
      const newToast = { id, type, title, message };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const success = useCallback(
    (message, title = 'Success') => showToast({ type: 'success', title, message }),
    [showToast]
  );

  const error = useCallback(
    (message, title = 'Error') => showToast({ type: 'error', title, message }),
    [showToast]
  );

  const info = useCallback(
    (message, title = 'Info') => showToast({ type: 'info', title, message }),
    [showToast]
  );

  const warning = useCallback(
    (message, title = 'Warning') => showToast({ type: 'warning', title, message }),
    [showToast]
  );

  return (
    <ToastContext.Provider value={{ showToast, success, error, info, warning }}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none px-4">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-lg shadow-xl border backdrop-blur-md transition-all duration-300 transform translate-y-0 ${
              toast.type === 'success'
                ? 'bg-[#0f241a]/95 border-emerald-500/40 text-emerald-200'
                : toast.type === 'error'
                ? 'bg-[#291114]/95 border-rose-500/40 text-rose-200'
                : toast.type === 'warning'
                ? 'bg-[#2b1f0c]/95 border-amber-500/40 text-amber-200'
                : 'bg-[#111927]/95 border-indigo-500/40 text-indigo-200'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400" />}
              {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-400" />}
              {toast.type === 'info' && <Info className="w-5 h-5 text-indigo-400" />}
            </div>
            <div className="flex-1 min-w-0">
              {toast.title && <p className="text-sm font-semibold tracking-wide text-white">{toast.title}</p>}
              <p className="text-xs text-slate-300 leading-relaxed mt-0.5">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
