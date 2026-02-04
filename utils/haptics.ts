// Haptic feedback patterns for mobile-like experience
// Uses the Vibration API when available

type HapticType = 'light' | 'medium' | 'heavy' | 'success' | 'error' | 'warning' | 'selection';

const hapticPatterns: Record<HapticType, number | number[]> = {
  light: 10,
  medium: 25,
  heavy: 50,
  success: [30, 20, 30],
  error: [100, 50, 100],
  warning: [50, 30, 50],
  selection: 15,
};

export const haptic = (type: HapticType = 'light') => {
  if ('vibrate' in navigator) {
    navigator.vibrate(hapticPatterns[type]);
  }
};

// Trigger haptic feedback on element interaction
export const withHaptic = <T extends (...args: unknown[]) => unknown>(
  fn: T,
  type: HapticType = 'light'
): T => {
  return ((...args: Parameters<T>) => {
    haptic(type);
    return fn(...args);
  }) as T;
};

// React hook for haptic feedback
import { useCallback } from 'react';

export const useHaptic = () => {
  const trigger = useCallback((type: HapticType = 'light') => {
    haptic(type);
  }, []);

  return {
    light: useCallback(() => trigger('light'), [trigger]),
    medium: useCallback(() => trigger('medium'), [trigger]),
    heavy: useCallback(() => trigger('heavy'), [trigger]),
    success: useCallback(() => trigger('success'), [trigger]),
    error: useCallback(() => trigger('error'), [trigger]),
    warning: useCallback(() => trigger('warning'), [trigger]),
    selection: useCallback(() => trigger('selection'), [trigger]),
    trigger,
  };
};

export default haptic;
