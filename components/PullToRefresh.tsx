import React, { useState, useRef, useCallback } from 'react';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
  className?: string;
}

const PullToRefresh: React.FC<PullToRefreshProps> = ({ onRefresh, children, className = '' }) => {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPulling, setIsPulling] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const currentY = useRef(0);

  const THRESHOLD = 80;
  const MAX_PULL = 120;

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (containerRef.current?.scrollTop === 0 && !isRefreshing) {
      startY.current = e.touches[0].clientY;
      setIsPulling(true);
    }
  }, [isRefreshing]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isPulling || isRefreshing) return;

    currentY.current = e.touches[0].clientY;
    const distance = Math.min(currentY.current - startY.current, MAX_PULL);

    if (distance > 0) {
      // Resistance effect - pull gets harder as you go
      const resistedDistance = distance * (1 - distance / (MAX_PULL * 2));
      setPullDistance(resistedDistance);

      // Haptic feedback at threshold
      if (distance >= THRESHOLD && pullDistance < THRESHOLD) {
        if ('vibrate' in navigator) {
          navigator.vibrate(20);
        }
      }
    }
  }, [isPulling, isRefreshing, pullDistance]);

  const handleTouchEnd = useCallback(async () => {
    if (!isPulling) return;

    setIsPulling(false);

    if (pullDistance >= THRESHOLD && !isRefreshing) {
      setIsRefreshing(true);
      setPullDistance(60); // Hold at spinner position

      // Haptic feedback
      if ('vibrate' in navigator) {
        navigator.vibrate([30, 20, 30]);
      }

      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
        setPullDistance(0);
      }
    } else {
      setPullDistance(0);
    }
  }, [isPulling, pullDistance, isRefreshing, onRefresh]);

  const progress = Math.min(pullDistance / THRESHOLD, 1);
  const rotation = pullDistance * 3;

  return (
    <div
      ref={containerRef}
      className={`relative overflow-y-auto ${className}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull indicator */}
      <div
        className="absolute left-0 right-0 flex justify-center items-center pointer-events-none z-20 transition-opacity duration-200"
        style={{
          top: -60,
          transform: `translateY(${pullDistance}px)`,
          opacity: pullDistance > 10 ? 1 : 0,
        }}
      >
        <div
          className={`
            w-10 h-10 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm
            flex items-center justify-center
            ${isRefreshing ? 'animate-spin' : ''}
          `}
          style={{
            transform: isRefreshing ? undefined : `rotate(${rotation}deg)`,
            boxShadow: progress >= 1 ? '0 0 15px rgba(54, 226, 123, 0.4)' : undefined,
          }}
        >
          <span
            className={`material-symbols-outlined text-lg transition-colors duration-200 ${progress >= 1 ? 'text-primary' : 'text-white/60'
              }`}
          >
            {isRefreshing ? 'sync' : 'arrow_downward'}
          </span>
        </div>
      </div>

      {/* Progress ring around indicator */}
      {!isRefreshing && pullDistance > 10 && (
        <div
          className="absolute left-1/2 -translate-x-1/2 w-12 h-12 pointer-events-none z-20"
          style={{
            top: -66,
            transform: `translateX(-50%) translateY(${pullDistance}px)`,
          }}
        >
          <svg className="w-full h-full -rotate-90" viewBox="0 0 48 48">
            <circle
              cx="24"
              cy="24"
              r="20"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="2"
            />
            <circle
              cx="24"
              cy="24"
              r="20"
              fill="none"
              stroke={progress >= 1 ? '#36e27b' : '#00C2FF'}
              strokeWidth="2"
              strokeDasharray={`${progress * 125.6} 125.6`}
              strokeLinecap="round"
              className="transition-all duration-100"
            />
          </svg>
        </div>
      )}

      {/* Content with pull effect */}
      <div
        style={{
          transform: `translateY(${pullDistance * 0.3}px)`,
          transition: isPulling ? 'none' : 'transform 0.3s ease-out',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default PullToRefresh;
