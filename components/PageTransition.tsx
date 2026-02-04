import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const location = useLocation();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [transitionStage, setTransitionStage] = useState<'enter' | 'exit' | 'idle'>('idle');
  const prevPathRef = useRef(location.pathname);

  useEffect(() => {
    if (children !== displayChildren) {
      setTransitionStage('exit');
    }
  }, [children, displayChildren]);

  useEffect(() => {
    if (transitionStage === 'exit') {
      const timer = setTimeout(() => {
        setDisplayChildren(children);
        setTransitionStage('enter');
        prevPathRef.current = location.pathname;
      }, 200);
      return () => clearTimeout(timer);
    }
    if (transitionStage === 'enter') {
      const timer = setTimeout(() => {
        setTransitionStage('idle');
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [transitionStage, children, location.pathname]);

  const getTransitionStyles = () => {
    switch (transitionStage) {
      case 'exit':
        return 'opacity-0 scale-[0.97] blur-[2px]';
      case 'enter':
        return 'opacity-100 scale-100 blur-0';
      default:
        return 'opacity-100 scale-100 blur-0';
    }
  };

  return (
    <div
      className={`w-full h-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${getTransitionStyles()}`}
    >
      {displayChildren}
    </div>
  );
};

// Fade transition variant with spring physics
export const FadeTransition: React.FC<{ children: React.ReactNode; show: boolean; delay?: number }> = ({
  children,
  show,
  delay = 0,
}) => {
  return (
    <div
      className={`transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'
        }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// Slide transition variant with spring physics
export const SlideTransition: React.FC<{
  children: React.ReactNode;
  show: boolean;
  direction?: 'up' | 'down' | 'left' | 'right';
  distance?: number;
}> = ({ children, show, direction = 'up', distance = 24 }) => {
  const directionClasses = {
    up: show ? 'translate-y-0' : `translate-y-[${distance}px]`,
    down: show ? 'translate-y-0' : `-translate-y-[${distance}px]`,
    left: show ? 'translate-x-0' : `translate-x-[${distance}px]`,
    right: show ? 'translate-x-0' : `-translate-x-[${distance}px]`,
  };

  const transforms = {
    up: { transform: show ? 'translateY(0)' : `translateY(${distance}px)` },
    down: { transform: show ? 'translateY(0)' : `translateY(-${distance}px)` },
    left: { transform: show ? 'translateX(0)' : `translateX(${distance}px)` },
    right: { transform: show ? 'translateX(0)' : `translateX(-${distance}px)` },
  };

  return (
    <div
      className={`transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${show ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      style={transforms[direction]}
    >
      {children}
    </div>
  );
};

// Scale pop transition with spring physics
export const PopTransition: React.FC<{ children: React.ReactNode; show: boolean; delay?: number }> = ({
  children,
  show,
  delay = 0,
}) => {
  return (
    <div
      className={`transition-all duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${show
        ? 'opacity-100 scale-100'
        : 'opacity-0 scale-90 pointer-events-none'
        }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// Spring scale animation
export const SpringScale: React.FC<{
  children: React.ReactNode;
  trigger?: boolean;
  scale?: number;
}> = ({ children, trigger = false, scale = 1.1 }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (trigger) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 500);
      return () => clearTimeout(timer);
    }
  }, [trigger]);

  return (
    <div
      className="transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
      style={{ transform: isAnimating ? `scale(${scale})` : 'scale(1)' }}
    >
      {children}
    </div>
  );
};

// Staggered list animation with smoother timing
export const StaggeredList: React.FC<{
  children: React.ReactNode[];
  staggerDelay?: number;
  className?: string;
  animation?: 'fade' | 'slide' | 'pop';
}> = ({ children, staggerDelay = 60, className = '', animation = 'fade' }) => {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    setVisibleCount(0);
    const timer = setInterval(() => {
      setVisibleCount((prev) => {
        if (prev >= children.length) {
          clearInterval(timer);
          return prev;
        }
        return prev + 1;
      });
    }, staggerDelay);

    return () => clearInterval(timer);
  }, [children.length, staggerDelay]);

  const getAnimationClass = (visible: boolean) => {
    const base = 'transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]';
    switch (animation) {
      case 'slide':
        return `${base} ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`;
      case 'pop':
        return `${base} ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`;
      default:
        return `${base} ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`;
    }
  };

  return (
    <div className={className}>
      {children.map((child, index) => (
        <div
          key={index}
          className={getAnimationClass(index < visibleCount)}
          style={{
            transitionDelay: `${index * 30}ms`,
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
};

// Smooth number transition
export const SmoothNumber: React.FC<{
  value: number;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}> = ({ value, duration = 800, className = '', prefix = '', suffix = '' }) => {
  const [displayValue, setDisplayValue] = useState(value);
  const animationRef = useRef<number>();
  const startTimeRef = useRef<number>();
  const startValueRef = useRef<number>(value);

  useEffect(() => {
    startTimeRef.current = performance.now();
    startValueRef.current = displayValue;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - (startTimeRef.current || 0);
      const progress = Math.min(elapsed / duration, 1);

      // Spring-like easing
      const easeOutExpo = 1 - Math.pow(2, -10 * progress);

      const current = Math.round(
        startValueRef.current + (value - startValueRef.current) * easeOutExpo
      );
      setDisplayValue(current);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [value, duration]);

  return (
    <span className={className}>
      {prefix}{displayValue.toLocaleString()}{suffix}
    </span>
  );
};

// Parallax scroll effect
export const ParallaxScroll: React.FC<{
  children: React.ReactNode;
  speed?: number;
  className?: string;
}> = ({ children, speed = 0.5, className = '' }) => {
  const [offset, setOffset] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const scrolled = window.innerHeight - rect.top;
        setOffset(scrolled * speed * 0.1);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return (
    <div
      ref={ref}
      className={className}
      style={{ transform: `translateY(${offset}px)` }}
    >
      {children}
    </div>
  );
};

export default PageTransition;
