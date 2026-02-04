import React, { useEffect, useState } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning' | 'xp';

interface ToastProps {
  message: string;
  type: ToastType;
  duration?: number;
  onClose: () => void;
  xpAmount?: number;
}

const Toast: React.FC<ToastProps> = ({ message, type, duration = 3000, onClose, xpAmount }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Trigger enter animation
    requestAnimationFrame(() => setIsVisible(true));

    const timer = setTimeout(() => {
      setIsLeaving(true);
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const iconMap: Record<ToastType, string> = {
    success: 'check_circle',
    error: 'error',
    info: 'info',
    warning: 'warning',
    xp: 'stars',
  };

  const colorMap: Record<ToastType, string> = {
    success: 'bg-primary/20 border-primary/40 text-primary',
    error: 'bg-red-500/20 border-red-500/40 text-red-400',
    info: 'bg-bond-blue/20 border-bond-blue/40 text-bond-blue',
    warning: 'bg-amber-500/20 border-amber-500/40 text-amber-400',
    xp: 'bg-amber-500/20 border-amber-500/40 text-amber-400',
  };

  const glowMap: Record<ToastType, string> = {
    success: 'shadow-[0_0_20px_rgba(54,226,123,0.3)]',
    error: 'shadow-[0_0_20px_rgba(239,68,68,0.3)]',
    info: 'shadow-[0_0_20px_rgba(0,194,255,0.3)]',
    warning: 'shadow-[0_0_20px_rgba(245,158,11,0.3)]',
    xp: 'shadow-[0_0_20px_rgba(245,158,11,0.4)]',
  };

  return (
    <div
      className={`
        fixed top-6 left-1/2 -translate-x-1/2 z-[100]
        px-4 py-3 rounded-xl border backdrop-blur-xl
        flex items-center gap-3 min-w-[280px] max-w-[340px]
        transition-all duration-300 ease-out
        ${colorMap[type]} ${glowMap[type]}
        ${isVisible && !isLeaving ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}
      `}
    >
      <span className="material-symbols-outlined text-xl animate-bounce-slow">
        {iconMap[type]}
      </span>
      <div className="flex-1">
        <p className="text-white text-sm font-medium">{message}</p>
        {type === 'xp' && xpAmount && (
          <p className="text-amber-400 text-xs font-bold">+{xpAmount} XP earned!</p>
        )}
      </div>
      <button
        onClick={() => {
          setIsLeaving(true);
          setTimeout(onClose, 300);
        }}
        className="text-white/40 hover:text-white/70 transition-colors"
      >
        <span className="material-symbols-outlined text-lg">close</span>
      </button>
    </div>
  );
};

// Toast Container with queue management
interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  xpAmount?: number;
}

interface ToastContainerProps {
  toasts: ToastItem[];
  removeToast: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, removeToast }) => {
  return (
    <>
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          style={{ transform: `translateY(${index * 70}px)` }}
          className="transition-transform duration-300"
        >
          <Toast
            message={toast.message}
            type={toast.type}
            xpAmount={toast.xpAmount}
            onClose={() => removeToast(toast.id)}
          />
        </div>
      ))}
    </>
  );
};

// Hook for using toasts
export const useToast = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = (message: string, type: ToastType, xpAmount?: number) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type, xpAmount }]);

    // Haptic feedback simulation
    if ('vibrate' in navigator) {
      if (type === 'success' || type === 'xp') {
        navigator.vibrate([50, 30, 50]);
      } else if (type === 'error') {
        navigator.vibrate([100, 50, 100]);
      } else {
        navigator.vibrate(30);
      }
    }
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return { toasts, addToast, removeToast };
};

export default Toast;
