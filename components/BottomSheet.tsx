import React, { useEffect, useState, useRef, useCallback } from 'react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  snapPoints?: number[];
  initialSnap?: number;
}

const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  children,
  title,
  snapPoints = [0.5, 0.9],
  initialSnap = 0,
}) => {
  const [currentSnap, setCurrentSnap] = useState(initialSnap);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const startHeight = useRef(0);

  const getHeight = useCallback(() => {
    return snapPoints[currentSnap] * window.innerHeight;
  }, [currentSnap, snapPoints]);

  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
    startHeight.current = getHeight();
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const deltaY = e.touches[0].clientY - startY.current;
    setDragOffset(deltaY);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const currentHeight = startHeight.current - dragOffset;
    const windowHeight = window.innerHeight;

    let closestSnap = 0;
    let minDistance = Infinity;

    if (dragOffset > 100) {
      if (currentSnap === 0) {
        onClose();
        setDragOffset(0);
        return;
      } else {
        closestSnap = Math.max(0, currentSnap - 1);
      }
    } else if (dragOffset < -50) {
      closestSnap = Math.min(snapPoints.length - 1, currentSnap + 1);
    } else {
      snapPoints.forEach((snap, index) => {
        const snapHeight = snap * windowHeight;
        const distance = Math.abs(currentHeight - snapHeight);
        if (distance < minDistance) {
          minDistance = distance;
          closestSnap = index;
        }
      });
    }

    setCurrentSnap(closestSnap);
    setDragOffset(0);

    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setCurrentSnap(initialSnap);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, initialSnap]);

  if (!isOpen) return null;

  const height = Math.max(0, getHeight() - dragOffset);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-text-primary/40 backdrop-blur-sm z-40 transition-opacity duration-300"
        style={{ opacity: isOpen ? 1 : 0 }}
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        className="fixed bottom-0 left-0 right-0 z-50 bg-surface rounded-t-3xl border-t border-border shadow-elevated"
        style={{
          height: `${height}px`,
          transition: isDragging ? 'none' : 'height 0.3s ease-out',
          maxHeight: '90vh',
        }}
      >
        {/* Handle */}
        <div
          className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="w-10 h-1 bg-border rounded-full" />
        </div>

        {/* Title */}
        {title && (
          <div className="px-4 pb-3 border-b border-border">
            <h2 className="text-text-primary font-bold text-lg">{title}</h2>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 py-4" style={{ maxHeight: `calc(${height}px - 60px)` }}>
          {children}
        </div>
      </div>
    </>
  );
};

// Action sheet variant
interface ActionSheetOption {
  label: string;
  icon?: string;
  color?: 'default' | 'danger' | 'primary';
  onClick: () => void;
}

interface ActionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  options: ActionSheetOption[];
  title?: string;
  cancelLabel?: string;
}

export const ActionSheet: React.FC<ActionSheetProps> = ({
  isOpen,
  onClose,
  options,
  title,
  cancelLabel = 'Cancel',
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isVisible) return null;

  const colorClasses = {
    default: 'text-text-primary hover:bg-input-bg',
    danger: 'text-danger hover:bg-danger/10',
    primary: 'text-primary hover:bg-primary/10',
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-text-primary/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'
          }`}
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 p-4 transition-transform duration-300 ease-out ${isOpen ? 'translate-y-0' : 'translate-y-full'
          }`}
      >
        <div className="bg-surface rounded-2xl border border-border overflow-hidden mb-2 shadow-card">
          {title && (
            <div className="px-4 py-3 border-b border-border">
              <p className="text-text-secondary text-sm text-center">{title}</p>
            </div>
          )}

          {options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => {
                option.onClick();
                onClose();
              }}
              className={`w-full px-4 py-3.5 flex items-center justify-center gap-2 border-b border-border/50 last:border-0 transition-colors ${colorClasses[option.color || 'default']
                }`}
            >
              {option.icon && (
                <span className="material-symbols-outlined text-xl">{option.icon}</span>
              )}
              <span className="font-medium">{option.label}</span>
            </button>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full px-4 py-3.5 bg-surface rounded-2xl border border-border text-text-primary font-bold hover:bg-input-bg transition-colors shadow-card"
        >
          {cancelLabel}
        </button>
      </div>
    </>
  );
};

export default BottomSheet;
