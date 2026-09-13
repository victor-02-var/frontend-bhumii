import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, X } from 'lucide-react';

const ICONS = {
  success: <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />,
  error: <XCircle className="w-4 h-4 text-red-600 flex-shrink-0" />,
  warning: <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />,
};

const BG = {
  success: 'bg-emerald-50 border-emerald-300 text-emerald-900',
  error: 'bg-red-50 border-red-300 text-red-900',
  warning: 'bg-amber-50 border-amber-300 text-amber-900',
};

/**
 * Toast — pass { message, type, onClose } where type is 'success'|'error'|'warning'
 * Auto-closes after `duration` ms (default 4000)
 */
export const Toast = ({ message, type = 'success', onClose, duration = 4000 }) => {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div
      className={`fixed top-4 right-4 z-[9999] flex items-start gap-2.5 px-4 py-3 rounded-xl border shadow-lg text-xs font-medium max-w-sm animate-slide-in ${BG[type]}`}
      role="alert"
    >
      {ICONS[type]}
      <span className="flex-1">{message}</span>
      <button onClick={onClose} className="ml-1 opacity-60 hover:opacity-100 transition">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

/**
 * useToast — simple hook to manage toast state
 * Returns: { toast, showToast, clearToast }
 * Usage:
 *   const { toast, showToast, clearToast } = useToast();
 *   showToast('Saved!', 'success');
 *   <Toast {...toast} onClose={clearToast} />
 */
import { useState, useCallback } from 'react';

export const useToast = () => {
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
  }, []);

  const clearToast = useCallback(() => {
    setToast({ message: '', type: 'success' });
  }, []);

  return { toast, showToast, clearToast };
};
