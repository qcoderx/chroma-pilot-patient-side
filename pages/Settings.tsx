import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import { clearOnboardingState } from '../utils/indexedDB';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { session, setSession } = useContext(AuthContext);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [haptics, setHaptics] = useState(true);
  const [dataSharing, setDataSharing] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = async () => {
    // Clear session
    setSession(null);
    localStorage.removeItem('chromapilot_session');
    // Clear onboarding state
    await clearOnboardingState();
    // Navigate to welcome
    navigate('/');
  };

  const handleResetData = async () => {
    await clearOnboardingState();
    // Show confirmation
    alert('Calibration data has been reset. You can recalibrate now.');
  };

  const userProfile = {
    name: session?.payload?.name || 'User',
    email: session?.payload?.email || 'user@chromapilot.app',
    level: 1,
    xp: 500,
    joinDate: 'January 2026',
  };

  return (
    <div className="relative min-h-full bg-black text-white flex flex-col">
      {/* Ambient Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[250px] h-[250px] bg-helix-violet/10 rounded-full blur-[80px]" />
        <div className="absolute bottom-1/4 left-0 w-[200px] h-[200px] bg-primary/10 rounded-full blur-[60px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 px-4 pt-4 pb-3 border-b border-white/5">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-white/70 text-lg">arrow_back</span>
          </button>
          <h1 className="text-white font-bold text-lg">Settings</h1>
          <div className="w-9" /> {/* Spacer */}
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 flex-1 overflow-y-auto px-4 py-4 pb-24 space-y-4">
        {/* Profile Card */}
        <section className="p-4 rounded-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/40 to-bond-blue/40 flex items-center justify-center border border-primary/30">
                <span className="material-symbols-outlined text-white text-2xl">person</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full border-2 border-black flex items-center justify-center">
                <span className="text-[10px] font-bold text-black">{userProfile.level}</span>
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-white font-bold text-lg">{userProfile.name}</h2>
              <p className="text-white/50 text-xs">{userProfile.email}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-amber-400 text-xs font-medium">{userProfile.xp} XP</span>
                <span className="text-white/30">•</span>
                <span className="text-white/40 text-xs">Since {userProfile.joinDate}</span>
              </div>
            </div>
            <button className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
              <span className="material-symbols-outlined text-white/50 text-lg">edit</span>
            </button>
          </div>
        </section>

        {/* Preferences */}
        <section className="space-y-2">
          <h2 className="text-white/70 text-xs font-bold uppercase tracking-wider px-1">Preferences</h2>
          <div className="rounded-2xl bg-white/5 border border-white/10 divide-y divide-white/5">
            {/* Notifications */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-bond-blue/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-bond-blue text-lg">notifications</span>
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Notifications</p>
                  <p className="text-white/40 text-[10px]">Health alerts & reminders</p>
                </div>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`w-12 h-7 rounded-full transition-all ${notifications ? 'bg-primary' : 'bg-white/20'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform mx-1 ${notifications ? 'translate-x-5' : ''}`} />
              </button>
            </div>

            {/* Dark Mode */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-helix-violet/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-helix-violet text-lg">dark_mode</span>
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Dark Mode</p>
                  <p className="text-white/40 text-[10px]">Always on (recommended)</p>
                </div>
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`w-12 h-7 rounded-full transition-all ${darkMode ? 'bg-primary' : 'bg-white/20'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform mx-1 ${darkMode ? 'translate-x-5' : ''}`} />
              </button>
            </div>

            {/* Haptic Feedback */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-500/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-amber-500 text-lg">vibration</span>
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Haptic Feedback</p>
                  <p className="text-white/40 text-[10px]">Vibration on interactions</p>
                </div>
              </div>
              <button
                onClick={() => setHaptics(!haptics)}
                className={`w-12 h-7 rounded-full transition-all ${haptics ? 'bg-primary' : 'bg-white/20'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform mx-1 ${haptics ? 'translate-x-5' : ''}`} />
              </button>
            </div>
          </div>
        </section>

        {/* Privacy & Data */}
        <section className="space-y-2">
          <h2 className="text-white/70 text-xs font-bold uppercase tracking-wider px-1">Privacy & Data</h2>
          <div className="rounded-2xl bg-white/5 border border-white/10 divide-y divide-white/5">
            {/* Data Sharing */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-lg">share</span>
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Share with Doctor</p>
                  <p className="text-white/40 text-[10px]">Send data to care provider</p>
                </div>
              </div>
              <button
                onClick={() => setDataSharing(!dataSharing)}
                className={`w-12 h-7 rounded-full transition-all ${dataSharing ? 'bg-primary' : 'bg-white/20'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform mx-1 ${dataSharing ? 'translate-x-5' : ''}`} />
              </button>
            </div>

            {/* Export Data */}
            <button className="flex items-center justify-between p-4 w-full text-left">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-bond-blue/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-bond-blue text-lg">download</span>
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Export My Data</p>
                  <p className="text-white/40 text-[10px]">Download your health profile</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-white/30">chevron_right</span>
            </button>

            {/* Delete Data */}
            <button
              onClick={handleResetData}
              className="flex items-center justify-between p-4 w-full text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-red-500/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-red-400 text-lg">delete</span>
                </div>
                <div>
                  <p className="text-red-400 text-sm font-medium">Reset Calibration</p>
                  <p className="text-white/40 text-[10px]">Clear and recalibrate</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-white/30">chevron_right</span>
            </button>
          </div>
        </section>

        {/* Support */}
        <section className="space-y-2">
          <h2 className="text-white/70 text-xs font-bold uppercase tracking-wider px-1">Support</h2>
          <div className="rounded-2xl bg-white/5 border border-white/10 divide-y divide-white/5">
            <button className="flex items-center justify-between p-4 w-full text-left">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-white/60 text-lg">help</span>
                </div>
                <p className="text-white text-sm font-medium">Help Center</p>
              </div>
              <span className="material-symbols-outlined text-white/30">chevron_right</span>
            </button>
            <button className="flex items-center justify-between p-4 w-full text-left">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-white/60 text-lg">chat</span>
                </div>
                <p className="text-white text-sm font-medium">Contact Support</p>
              </div>
              <span className="material-symbols-outlined text-white/30">chevron_right</span>
            </button>
            <button className="flex items-center justify-between p-4 w-full text-left">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-white/60 text-lg">description</span>
                </div>
                <p className="text-white text-sm font-medium">Privacy Policy</p>
              </div>
              <span className="material-symbols-outlined text-white/30">chevron_right</span>
            </button>
          </div>
        </section>

        {/* Logout Button */}
        <button
          onClick={() => setShowLogoutModal(true)}
          className="w-full p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 font-medium text-sm flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-lg">logout</span>
          Sign Out
        </button>

        {/* App Version */}
        <div className="text-center pt-4">
          <p className="text-white/30 text-[10px]">ChromaPilot v1.0.0</p>
          <p className="text-white/20 text-[10px]">© 2026 ChromaPilot Health</p>
        </div>
      </main>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-surface-dark border border-white/10 rounded-2xl p-6 w-full max-w-sm">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-3xl text-red-400">logout</span>
              </div>
              <h3 className="text-white font-bold text-lg">Sign Out?</h3>
              <p className="text-white/50 text-sm mt-2">You'll need to use your magic link to sign back in.</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-3 rounded-xl bg-white/10 text-white font-medium text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-3 rounded-xl bg-red-500 text-white font-medium text-sm"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="absolute bottom-0 left-0 right-0 z-40 p-3 bg-gradient-to-t from-black via-black/95 to-transparent">
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
          <button className="flex flex-col items-center gap-0.5 px-3 py-1">
            <span className="material-symbols-outlined text-primary text-xl drop-shadow-[0_0_8px_rgba(54,226,123,0.6)]">settings</span>
            <span className="text-[9px] text-primary font-medium">Settings</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Settings;
