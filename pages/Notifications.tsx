import React from 'react';
import { useNavigate } from 'react-router-dom';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'alert' | 'info' | 'success' | 'reminder';
  read: boolean;
  icon: string;
}

const Notifications: React.FC = () => {
  const navigate = useNavigate();

  const notifications: Notification[] = [
    {
      id: '1',
      title: 'Calibration Complete! 🎉',
      message: 'Your phenotype profile has been successfully created. You earned 500 XP!',
      time: 'Just now',
      type: 'success',
      read: false,
      icon: 'check_circle',
    },
    {
      id: '2',
      title: 'Important Health Flag',
      message: 'A critical marker was flagged during calibration. Your doctor has been notified.',
      time: '5 min ago',
      type: 'alert',
      read: false,
      icon: 'flag',
    },
    {
      id: '3',
      title: 'Weekly Check-in Available',
      message: 'Complete your weekly health sync to earn 100 XP and maintain your streak.',
      time: '1 hour ago',
      type: 'reminder',
      read: true,
      icon: 'event_available',
    },
    {
      id: '4',
      title: 'New Achievement Unlocked',
      message: 'You\'ve earned the "First Calibration" badge! Keep going to unlock more.',
      time: '2 hours ago',
      type: 'success',
      read: true,
      icon: 'military_tech',
    },
    {
      id: '5',
      title: 'Profile Synced with Clinic',
      message: 'Your latest health data has been securely shared with Dr. Chen.',
      time: 'Yesterday',
      type: 'info',
      read: true,
      icon: 'sync',
    },
    {
      id: '6',
      title: 'Medication Reminder',
      message: 'Don\'t forget to log your daily medications for accurate tracking.',
      time: '2 days ago',
      type: 'reminder',
      read: true,
      icon: 'medication',
    },
  ];

  const getTypeColor = (type: Notification['type']) => {
    switch (type) {
      case 'alert': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'success': return 'text-primary bg-primary/20 border-primary/30';
      case 'reminder': return 'text-amber-400 bg-amber-500/20 border-amber-500/30';
      default: return 'text-bond-blue bg-bond-blue/20 border-bond-blue/30';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative min-h-full bg-black text-white flex flex-col">
      {/* Ambient Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[250px] h-[250px] bg-bond-blue/10 rounded-full blur-[80px]" />
        <div className="absolute bottom-1/3 left-0 w-[200px] h-[200px] bg-primary/10 rounded-full blur-[60px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 px-4 pt-4 pb-3 border-b border-white/5">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-white/70 text-lg">arrow_back</span>
          </button>
          <h1 className="text-white font-bold text-lg">Notifications</h1>
          <button className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-white/70 text-lg">settings</span>
          </button>
        </div>

        {/* Unread Badge */}
        {unreadCount > 0 && (
          <div className="mt-3 flex items-center justify-between">
            <span className="text-white/50 text-xs">{unreadCount} unread notification{unreadCount > 1 ? 's' : ''}</span>
            <button className="text-primary text-xs font-medium">Mark all as read</button>
          </div>
        )}
      </header>

      {/* Notifications List */}
      <main className="relative z-10 flex-1 overflow-y-auto px-4 py-4 pb-24 space-y-3">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 rounded-2xl bg-white/5 border transition-all active:scale-[0.98] ${notification.read ? 'border-white/10 opacity-70' : 'border-white/20'
              }`}
          >
            <div className="flex gap-3">
              {/* Icon */}
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${getTypeColor(notification.type)}`}>
                <span className="material-symbols-outlined text-lg">{notification.icon}</span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className={`text-sm font-bold ${notification.read ? 'text-white/70' : 'text-white'}`}>
                    {notification.title}
                  </h3>
                  {!notification.read && (
                    <span className="w-2 h-2 bg-primary rounded-full shrink-0 mt-1.5" />
                  )}
                </div>
                <p className="text-white/50 text-xs mt-1 leading-relaxed">{notification.message}</p>
                <p className="text-white/30 text-[10px] mt-2">{notification.time}</p>
              </div>
            </div>
          </div>
        ))}

        {/* Empty State (hidden when there are notifications) */}
        {notifications.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-3xl text-white/30">notifications_off</span>
            </div>
            <p className="text-white/50 text-sm">No notifications yet</p>
            <p className="text-white/30 text-xs mt-1">We'll notify you of important updates</p>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="absolute bottom-0 left-0 right-0 z-50 p-3 bg-gradient-to-t from-black via-black/95 to-transparent">
        <div className="flex items-center justify-around px-4 py-2.5 rounded-2xl bg-white/[0.08] backdrop-blur-xl border border-white/10">
          <button onClick={() => navigate('/dashboard')} className="flex flex-col items-center gap-0.5 px-3 py-1 opacity-50 hover:opacity-80 transition-opacity">
            <span className="material-symbols-outlined text-white/60 text-xl">home</span>
            <span className="text-[9px] text-white/60">Home</span>
          </button>
          <button onClick={() => navigate('/onboarding')} className="flex flex-col items-center gap-0.5 px-3 py-1 opacity-50 hover:opacity-80 transition-opacity">
            <span className="material-symbols-outlined text-white/60 text-xl">quiz</span>
            <span className="text-[9px] text-white/60">Calibrate</span>
          </button>
          <button onClick={() => navigate('/insights')} className="flex flex-col items-center gap-0.5 px-3 py-1 opacity-50 hover:opacity-80 transition-opacity">
            <span className="material-symbols-outlined text-white/60 text-xl">bar_chart</span>
            <span className="text-[9px] text-white/60">Insights</span>
          </button>
          <button onClick={() => navigate('/settings')} className="flex flex-col items-center gap-0.5 px-3 py-1 opacity-50 hover:opacity-80 transition-opacity">
            <span className="material-symbols-outlined text-white/60 text-xl">settings</span>
            <span className="text-[9px] text-white/60">Settings</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Notifications;
