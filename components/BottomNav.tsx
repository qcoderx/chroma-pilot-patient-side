import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { haptic } from '../utils/haptics';

interface NavItem {
  icon: string;
  label: string;
  path: string;
}

const navItems: NavItem[] = [
  { icon: 'home', label: 'Home', path: '/dashboard' },
  { icon: 'quiz', label: 'Calibrate', path: '/onboarding' },
  { icon: 'bar_chart', label: 'Insights', path: '/insights' },
  { icon: 'settings', label: 'Settings', path: '/settings' },
];

interface BottomNavProps {
  className?: string;
}

const BottomNav: React.FC<BottomNavProps> = ({ className = '' }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (path: string) => {
    haptic('selection');
    navigate(path);
  };

  return (
    <nav className={`absolute bottom-0 left-0 right-0 z-50 p-3 bg-gradient-to-t from-black via-black/95 to-transparent ${className}`}>
      <div className="flex items-center justify-around px-4 py-2.5 rounded-2xl bg-white/[0.08] backdrop-blur-xl border border-white/10">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path ||
            (item.path === '/dashboard' && location.pathname === '/');

          return (
            <button
              key={item.path}
              onClick={() => handleNavClick(item.path)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 transition-all active:scale-90 ${isActive ? '' : 'opacity-50 hover:opacity-80'
                }`}
            >
              <span
                className={`material-symbols-outlined text-xl transition-all ${isActive
                    ? 'text-primary drop-shadow-[0_0_8px_rgba(54,226,123,0.6)]'
                    : 'text-white/60'
                  }`}
              >
                {item.icon}
              </span>
              <span
                className={`text-[9px] font-medium transition-colors ${isActive ? 'text-primary' : 'text-white/60'
                  }`}
              >
                {item.label}
              </span>
              {/* Active indicator dot */}
              {isActive && (
                <span className="absolute -bottom-1 w-1 h-1 bg-primary rounded-full animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
