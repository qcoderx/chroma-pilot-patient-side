import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'shimmer' | 'none';
}

const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rectangular',
  width,
  height,
  animation = 'shimmer',
}) => {
  const variantClasses: Record<string, string> = {
    text: 'rounded h-4',
    circular: 'rounded-full',
    rectangular: '',
    rounded: 'rounded-xl',
  };

  const animationClasses: Record<string, string> = {
    pulse: 'animate-pulse',
    shimmer: 'relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-border/60 before:to-transparent',
    none: '',
  };

  const style: React.CSSProperties = {
    width: width,
    height: height,
  };

  return (
    <div
      className={`bg-border/50 ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
      style={style}
    />
  );
};

// Pre-built skeleton layouts
export const DashboardSkeleton: React.FC = () => (
  <div className="space-y-4 p-4 animate-fadeIn">
    {/* Header */}
    <div className="flex items-center gap-3">
      <Skeleton variant="circular" width={44} height={44} />
      <div className="space-y-2">
        <Skeleton variant="text" width={120} />
        <Skeleton variant="text" width={80} height={12} />
      </div>
    </div>

    {/* XP Card */}
    <Skeleton variant="rounded" height={120} className="w-full" />

    {/* Stats Grid */}
    <div className="space-y-2">
      <Skeleton variant="text" width={100} />
      <div className="grid grid-cols-3 gap-2">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} variant="rounded" height={100} />
        ))}
      </div>
    </div>

    {/* Achievements */}
    <div className="space-y-2">
      <Skeleton variant="text" width={100} />
      <div className="grid grid-cols-4 gap-2">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} variant="rounded" className="aspect-square" />
        ))}
      </div>
    </div>

    {/* Activity */}
    <div className="space-y-2">
      <Skeleton variant="text" width={120} />
      {[1, 2].map((i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton variant="rounded" width={32} height={32} />
          <div className="flex-1 space-y-1">
            <Skeleton variant="text" width="70%" />
            <Skeleton variant="text" width="40%" height={10} />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const CardSkeleton: React.FC = () => (
  <div className="p-4 rounded-xl bg-surface border border-border space-y-3">
    <div className="flex items-center gap-3">
      <Skeleton variant="rounded" width={40} height={40} />
      <div className="space-y-2 flex-1">
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="text" width="40%" height={10} />
      </div>
    </div>
    <Skeleton variant="rounded" height={8} className="w-full" />
  </div>
);

export const ListItemSkeleton: React.FC = () => (
  <div className="flex items-center gap-3 p-3 rounded-xl bg-surface border border-border">
    <Skeleton variant="rounded" width={40} height={40} />
    <div className="flex-1 space-y-2">
      <Skeleton variant="text" width="70%" />
      <Skeleton variant="text" width="50%" height={10} />
    </div>
    <Skeleton variant="circular" width={24} height={24} />
  </div>
);

export default Skeleton;
