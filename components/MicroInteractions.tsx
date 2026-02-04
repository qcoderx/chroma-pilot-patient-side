import React, { useState, useRef, useEffect } from 'react';

// Ripple effect button
interface RippleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  rippleColor?: string;
}

export const RippleButton: React.FC<RippleButtonProps> = ({
  children,
  rippleColor = 'rgba(255, 255, 255, 0.3)',
  className = '',
  onClick,
  ...props
}) => {
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = Date.now();

      setRipples((prev) => [...prev, { x, y, id }]);

      // Haptic feedback
      if ('vibrate' in navigator) {
        navigator.vibrate(10);
      }

      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 600);
    }

    onClick?.(e);
  };

  return (
    <button
      ref={buttonRef}
      className={`relative overflow-hidden ${className}`}
      onClick={handleClick}
      {...props}
    >
      {children}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute rounded-full animate-[ripple_0.6s_ease-out] pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: '10px',
            height: '10px',
            marginLeft: '-5px',
            marginTop: '-5px',
            backgroundColor: rippleColor,
          }}
        />
      ))}
    </button>
  );
};

// Bouncy press effect
interface BouncyPressProps {
  children: React.ReactNode;
  className?: string;
  scale?: number;
  onClick?: () => void;
}

export const BouncyPress: React.FC<BouncyPressProps> = ({
  children,
  className = '',
  scale = 0.95,
  onClick,
}) => {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <div
      className={`transition-transform duration-150 ease-out cursor-pointer ${className}`}
      style={{
        transform: isPressed ? `scale(${scale})` : 'scale(1)',
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

// Progress ring with animation
interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  bgColor?: string;
  children?: React.ReactNode;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size = 60,
  strokeWidth = 4,
  color = '#36e27b',
  bgColor = 'rgba(255, 255, 255, 0.1)',
  children,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={bgColor}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
          style={{
            filter: `drop-shadow(0 0 6px ${color}40)`,
          }}
        />
      </svg>
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
};

// Counter animation
interface AnimatedCounterProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  duration = 1000,
  prefix = '',
  suffix = '',
  className = '',
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const startTime = useRef<number>(0);
  const startValue = useRef<number>(0);

  useEffect(() => {
    startTime.current = Date.now();
    startValue.current = displayValue;

    const animate = () => {
      const elapsed = Date.now() - startTime.current;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);

      const currentValue = Math.round(
        startValue.current + (value - startValue.current) * easeOut
      );

      setDisplayValue(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return (
    <span className={className}>
      {prefix}
      {displayValue.toLocaleString()}
      {suffix}
    </span>
  );
};

// Shimmer highlight effect
interface ShimmerHighlightProps {
  children: React.ReactNode;
  className?: string;
  active?: boolean;
}

export const ShimmerHighlight: React.FC<ShimmerHighlightProps> = ({
  children,
  className = '',
  active = true,
}) => {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {children}
      {active && (
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      )}
    </div>
  );
};

// Pulse glow effect
interface PulseGlowProps {
  children: React.ReactNode;
  color?: string;
  className?: string;
  active?: boolean;
}

export const PulseGlow: React.FC<PulseGlowProps> = ({
  children,
  color = '54, 226, 123',
  className = '',
  active = true,
}) => {
  return (
    <div
      className={`relative ${className}`}
      style={{
        animation: active ? 'pulseGlow 2s ease-in-out infinite' : undefined,
        '--glow-color': color,
      } as React.CSSProperties}
    >
      {children}
      {active && (
        <style>{`
          @keyframes pulseGlow {
            0%, 100% { box-shadow: 0 0 15px rgba(${color}, 0.3); }
            50% { box-shadow: 0 0 30px rgba(${color}, 0.6); }
          }
        `}</style>
      )}
    </div>
  );
};

// Floating label input
interface FloatingLabelInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const FloatingLabelInput: React.FC<FloatingLabelInputProps> = ({
  label,
  error,
  className = '',
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = props.value && String(props.value).length > 0;

  return (
    <div className={`relative ${className}`}>
      <input
        {...props}
        onFocus={(e) => {
          setIsFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          props.onBlur?.(e);
        }}
        className={`
          w-full px-4 py-3 pt-6 bg-white/5 border rounded-xl outline-none
          transition-all duration-200 text-white
          ${error ? 'border-red-500/50' : isFocused ? 'border-primary/50' : 'border-white/10'}
          ${isFocused ? 'bg-white/[0.08]' : ''}
        `}
      />
      <label
        className={`
          absolute left-4 transition-all duration-200 pointer-events-none
          ${isFocused || hasValue
            ? 'top-2 text-xs'
            : 'top-1/2 -translate-y-1/2 text-sm'
          }
          ${error ? 'text-red-400' : isFocused ? 'text-primary' : 'text-white/50'}
        `}
      >
        {label}
      </label>
      {error && (
        <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">error</span>
          {error}
        </p>
      )}
    </div>
  );
};

// Streak Fire indicator
interface StreakFireProps {
  streak: number;
  maxStreak?: number;
  className?: string;
}

export const StreakFire: React.FC<StreakFireProps> = ({
  streak,
  maxStreak = 10,
  className = '',
}) => {
  const intensity = Math.min(streak / maxStreak, 1);
  const isOnFire = streak >= 3;

  return (
    <div className={`relative flex items-center gap-1.5 ${className}`}>
      <div className={`relative transition-all duration-300 ${isOnFire ? 'animate-wiggle' : ''}`}>
        <span
          className={`text-2xl transition-all duration-300 ${isOnFire ? 'animate-glow' : ''}`}
          style={{
            filter: isOnFire ? `drop-shadow(0 0 ${8 + intensity * 12}px rgba(255, ${150 - intensity * 100}, 0, ${0.6 + intensity * 0.4}))` : undefined,
          }}
        >
          {isOnFire ? '🔥' : '💫'}
        </span>
        {isOnFire && (
          <div className="absolute -inset-2 animate-ping opacity-30">
            <span className="text-2xl">🔥</span>
          </div>
        )}
      </div>
      <div className="flex flex-col">
        <span className={`font-black text-lg transition-all duration-300 ${isOnFire ? 'text-orange-400 animate-pulse' : 'text-white/70'
          }`}>
          {streak}x
        </span>
        <span className="text-[8px] text-white/40 uppercase tracking-wider">Streak</span>
      </div>
    </div>
  );
};

// XP Popup animation
interface XPPopupProps {
  amount: number;
  multiplier?: number;
  onComplete?: () => void;
}

export const XPPopup: React.FC<XPPopupProps> = ({ amount, multiplier = 1, onComplete }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onComplete?.();
    }, 1200);
    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-50">
      <div className="animate-[xpFloat_1.2s_ease-out_forwards] flex flex-col items-center">
        <span className={`font-black text-3xl ${multiplier > 1 ? 'text-amber-400' : 'text-primary'
          } drop-shadow-[0_0_20px_currentColor]`}>
          +{amount * multiplier}
        </span>
        <span className="text-white/60 text-xs font-bold">XP</span>
        {multiplier > 1 && (
          <span className="text-orange-400 text-[10px] font-bold mt-1 animate-bounce">
            {multiplier}x COMBO!
          </span>
        )}
      </div>
    </div>
  );
};

// Combo meter
interface ComboMeterProps {
  combo: number;
  maxCombo?: number;
  timeLeft?: number;
  className?: string;
}

export const ComboMeter: React.FC<ComboMeterProps> = ({
  combo,
  maxCombo = 5,
  timeLeft = 100,
  className = '',
}) => {
  const multiplier = Math.min(combo, maxCombo);
  const colors = ['text-white/50', 'text-primary', 'text-emerald-400', 'text-amber-400', 'text-orange-400', 'text-red-400'];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Combo dots */}
      <div className="flex gap-1">
        {[...Array(maxCombo)].map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${i < combo
              ? 'bg-gradient-to-br from-primary to-amber-400 scale-110 shadow-[0_0_8px_rgba(54,226,123,0.6)]'
              : 'bg-white/20'
              }`}
            style={{ transitionDelay: `${i * 50}ms` }}
          />
        ))}
      </div>

      {/* Multiplier */}
      <span className={`font-black text-sm transition-all duration-300 ${colors[multiplier]}`}>
        {multiplier > 0 ? `${multiplier + 1}x` : '1x'}
      </span>

      {/* Timer bar */}
      {combo > 0 && (
        <div className="w-12 h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-amber-400 transition-all duration-100"
            style={{ width: `${timeLeft}%` }}
          />
        </div>
      )}
    </div>
  );
};

// Spring button with physics-based animation
interface SpringButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  glow?: boolean;
}

export const SpringButton: React.FC<SpringButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  glow = true,
  className = '',
  onClick,
  ...props
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [ripplePos, setRipplePos] = useState<{ x: number; y: number } | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setRipplePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      setTimeout(() => setRipplePos(null), 600);
    }
    if (navigator.vibrate) navigator.vibrate(15);
    onClick?.(e);
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm rounded-xl',
    md: 'px-6 py-3 text-base rounded-2xl',
    lg: 'px-8 py-4 text-lg rounded-2xl',
  };

  const variantClasses = {
    primary: 'bg-gradient-to-r from-primary to-emerald-400 text-black font-bold',
    secondary: 'bg-white/10 border border-white/20 text-white',
    ghost: 'bg-transparent text-white/70 hover:text-white hover:bg-white/5',
  };

  return (
    <button
      ref={buttonRef}
      className={`
        relative overflow-hidden transition-all
        ${sizeClasses[size]} ${variantClasses[variant]} ${className}
        ${glow && variant === 'primary' ? 'shadow-[0_0_20px_rgba(54,226,123,0.4)] hover:shadow-[0_0_30px_rgba(54,226,123,0.6)]' : ''}
      `}
      style={{
        transform: isPressed ? 'scale(0.95)' : 'scale(1)',
        transition: 'transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      onClick={handleClick}
      {...props}
    >
      {children}
      {ripplePos && (
        <span
          className="absolute rounded-full bg-white/30 animate-[ripple_0.6s_ease-out]"
          style={{
            left: ripplePos.x,
            top: ripplePos.y,
            width: 10,
            height: 10,
            marginLeft: -5,
            marginTop: -5,
          }}
        />
      )}
    </button>
  );
};

// Particle burst effect
interface ParticleBurstProps {
  active: boolean;
  color?: string;
  particleCount?: number;
  onComplete?: () => void;
}

export const ParticleBurst: React.FC<ParticleBurstProps> = ({
  active,
  color = '#36e27b',
  particleCount = 12,
  onComplete,
}) => {
  const [particles, setParticles] = useState<Array<{ id: number; angle: number; distance: number; size: number }>>([]);

  useEffect(() => {
    if (active) {
      const newParticles = [...Array(particleCount)].map((_, i) => ({
        id: Date.now() + i,
        angle: (360 / particleCount) * i + Math.random() * 30,
        distance: 40 + Math.random() * 40,
        size: 4 + Math.random() * 6,
      }));
      setParticles(newParticles);

      const timer = setTimeout(() => {
        setParticles([]);
        onComplete?.();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [active, particleCount, onComplete]);

  if (!particles.length) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute left-1/2 top-1/2 rounded-full animate-[particleBurst_0.8s_ease-out_forwards]"
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: color,
            boxShadow: `0 0 ${p.size * 2}px ${color}`,
            '--particle-angle': `${p.angle}deg`,
            '--particle-distance': `${p.distance}px`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
};

// Level up celebration
interface LevelUpCelebrationProps {
  level: number;
  onComplete?: () => void;
}

export const LevelUpCelebration: React.FC<LevelUpCelebrationProps> = ({ level, onComplete }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100, 50, 200]);
    }
    const timer = setTimeout(() => {
      setVisible(false);
      onComplete?.();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="flex flex-col items-center gap-4 animate-levelUp">
        {/* Crown icon */}
        <div className="relative">
          <span className="text-6xl animate-bounce">👑</span>
          <div className="absolute inset-0 animate-ping">
            <span className="text-6xl opacity-30">👑</span>
          </div>
        </div>

        {/* Level text */}
        <div className="text-center">
          <p className="text-white/60 text-sm uppercase tracking-widest mb-1">Level Up!</p>
          <p className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary via-amber-400 to-primary animate-gradient">
            Level {level}
          </p>
        </div>

        {/* Particle effects */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10%',
                backgroundColor: ['#36e27b', '#00C2FF', '#f59e0b', '#ff6b6b'][i % 4],
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${2 + Math.random()}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Daily streak calendar
interface DailyStreakProps {
  currentStreak: number;
  longestStreak: number;
  todayCompleted: boolean;
  className?: string;
}

export const DailyStreak: React.FC<DailyStreakProps> = ({
  currentStreak,
  longestStreak,
  todayCompleted,
  className = '',
}) => {
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const today = new Date().getDay();

  return (
    <div className={`p-4 rounded-2xl bg-white/5 border border-white/10 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🔥</span>
          <div>
            <p className="text-white font-bold text-lg">{currentStreak} Day Streak</p>
            <p className="text-white/40 text-[10px]">Best: {longestStreak} days</p>
          </div>
        </div>
        {todayCompleted && (
          <div className="px-2 py-1 bg-primary/20 rounded-full">
            <span className="text-primary text-xs font-bold">✓ Today</span>
          </div>
        )}
      </div>

      <div className="flex justify-between gap-1">
        {days.map((day, i) => {
          const isToday = i === today;
          const isPast = i < today;
          const isInStreak = isPast && i >= today - currentStreak;

          return (
            <div key={i} className="flex flex-col items-center gap-1">
              <span className="text-white/40 text-[9px]">{day}</span>
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${isToday && todayCompleted
                  ? 'bg-gradient-to-br from-primary to-emerald-400 text-black shadow-[0_0_15px_rgba(54,226,123,0.5)]'
                  : isToday
                    ? 'bg-white/20 border-2 border-dashed border-primary/50'
                    : isInStreak
                      ? 'bg-primary/30 text-primary'
                      : 'bg-white/5'
                  }`}
              >
                {(isToday && todayCompleted) || isInStreak ? (
                  <span className="material-symbols-outlined text-sm">local_fire_department</span>
                ) : isToday ? (
                  <span className="text-white/40 text-xs">?</span>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Achievement unlock animation
interface AchievementUnlockProps {
  name: string;
  icon: string;
  xp: number;
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
  onComplete?: () => void;
}

export const AchievementUnlock: React.FC<AchievementUnlockProps> = ({
  name,
  icon,
  xp,
  rarity = 'common',
  onComplete,
}) => {
  const [visible, setVisible] = useState(true);

  const rarityConfig = {
    common: { color: 'from-white/20 to-white/5', text: 'text-white', glow: 'rgba(255,255,255,0.3)' },
    rare: { color: 'from-bond-blue/30 to-bond-blue/10', text: 'text-bond-blue', glow: 'rgba(0,194,255,0.5)' },
    epic: { color: 'from-purple-500/30 to-purple-500/10', text: 'text-purple-400', glow: 'rgba(168,85,247,0.5)' },
    legendary: { color: 'from-amber-500/30 to-amber-500/10', text: 'text-amber-400', glow: 'rgba(245,158,11,0.6)' },
  };

  const config = rarityConfig[rarity];

  useEffect(() => {
    if (navigator.vibrate) navigator.vibrate([50, 30, 100]);
    const timer = setTimeout(() => {
      setVisible(false);
      onComplete?.();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] animate-slideUp">
      <div
        className={`flex items-center gap-4 px-5 py-4 rounded-2xl bg-gradient-to-r ${config.color} border border-white/20 backdrop-blur-xl`}
        style={{ boxShadow: `0 0 30px ${config.glow}` }}
      >
        <div className={`w-14 h-14 rounded-xl bg-black/30 flex items-center justify-center ${config.text}`}>
          <span className="material-symbols-outlined text-3xl">{icon}</span>
        </div>
        <div>
          <p className="text-white/60 text-[10px] uppercase tracking-wider">Achievement Unlocked!</p>
          <p className={`font-bold text-lg ${config.text}`}>{name}</p>
          <p className="text-amber-400 text-xs font-bold">+{xp} XP</p>
        </div>
        <span className="text-3xl animate-bounce">🏆</span>
      </div>
    </div>
  );
};

export default {
  RippleButton,
  BouncyPress,
  ProgressRing,
  AnimatedCounter,
  ShimmerHighlight,
  PulseGlow,
  FloatingLabelInput,
  StreakFire,
  XPPopup,
  ComboMeter,
  SpringButton,
  ParticleBurst,
  LevelUpCelebration,
  DailyStreak,
  AchievementUnlock,
};
