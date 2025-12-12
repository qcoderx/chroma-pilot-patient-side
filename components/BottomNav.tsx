import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { icon: 'grid_view', label: 'Dashboard', path: '/' },
    { icon: 'biotech', label: 'Genetics', path: '/genetics' },
    { icon: 'tips_and_updates', label: 'Nudges', path: '/nudges' },
    { icon: 'settings_heart', label: 'Settings', path: '/settings' },
  ];

  // Don't show nav on collision/stabilized pages
  if (['/collision', '/stabilized'].includes(location.pathname)) return null;

  return (
    <nav className="fixed bottom-6 left-4 right-4 z-50">
      <div className="flex items-center justify-between px-6 py-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className="flex flex-col items-center gap-1 group w-12"
          >
            <span
              className={`material-symbols-outlined transition-all duration-300 ${
                isActive(item.path)
                  ? 'text-bond-blue scale-110 drop-shadow-[0_0_5px_rgba(0,194,255,0.8)]'
                  : 'text-white/40 group-hover:text-white'
              }`}
            >
              {item.icon}
            </span>
            <span
              className={`text-[10px] font-medium transition-colors ${
                isActive(item.path) ? 'text-white/90' : 'text-white/40 group-hover:text-white'
              }`}
            >
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
