import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import { clearOnboardingState } from '../utils/indexedDB';
import { downloadDoctorReport, getDoctorReportShareLink, getGene42Report } from '../utils/gene42';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { session, setSession } = useContext(AuthContext);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [haptics, setHaptics] = useState(true);
  const [dataSharing, setDataSharing] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = async () => {
    setSession(null);
    localStorage.removeItem('chromapilot_session');
    await clearOnboardingState();
    navigate('/');
  };

  const handleResetData = async () => {
    await clearOnboardingState();
    alert('Calibration data has been reset. You can recalibrate now.');
  };

  const handleExportData = () => {
    const report = getGene42Report();
    if (!report) {
      alert('No Gene42 report found yet. Complete calibration first.');
      return;
    }
    downloadDoctorReport(report);
  };

  const handleCopyDoctorLink = async () => {
    const report = getGene42Report();
    if (!report) {
      alert('No Gene42 report found yet. Complete calibration first.');
      return;
    }

    try {
      await navigator.clipboard.writeText(getDoctorReportShareLink(report));
      alert('Secure doctor link copied to clipboard.');
    } catch {
      alert('Unable to copy link. Please allow clipboard access.');
    }
  };

  const userProfile = {
    name: session?.payload?.name || 'User',
    email: session?.payload?.email || 'user@chromapilot.app',
    level: 1,
    xp: 500,
    joinDate: 'January 2026',
  };

  return (
    <div className="relative min-h-full bg-background text-text-primary flex flex-col">
      {/* Header */}
      <header className="relative z-10 px-4 pt-4 pb-2 border-b border-border bg-surface">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-9 h-9 rounded-full bg-input-bg border border-border flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-text-secondary text-lg">arrow_back</span>
          </button>
          <h1 className="text-text-primary font-bold text-lg">Settings</h1>
          <div className="w-9" /> {/* Spacer */}
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 flex-1 overflow-y-auto px-4 py-4 pb-24 space-y-3">
        {/* Profile Card */}
        <section className="p-4 rounded-xl bg-surface border border-border shadow-soft">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/30 to-info/30 flex items-center justify-center border border-primary/20">
                <span className="material-symbols-outlined text-text-primary text-2xl">person</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full border-2 border-surface flex items-center justify-center">
                <span className="text-[10px] font-bold text-white">{userProfile.level}</span>
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-text-primary font-bold text-lg">{userProfile.name}</h2>
              <p className="text-text-secondary text-xs">{userProfile.email}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-warning text-xs font-medium">{userProfile.xp} XP</span>
                <span className="text-text-secondary/30">•</span>
                <span className="text-text-secondary text-xs">Since {userProfile.joinDate}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Preferences */}
        <section className="space-y-2">
          <h2 className="text-text-secondary text-xs font-bold uppercase tracking-wider px-1">Preferences</h2>
          <div className="rounded-xl bg-surface border border-border shadow-soft divide-y divide-border">
            {/* Notifications */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-info/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-info text-lg">notifications</span>
                </div>
                <div>
                  <p className="text-text-primary text-sm font-medium">Notifications</p>
                  <p className="text-text-secondary text-[10px]">Health alerts & reminders</p>
                </div>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`w-12 h-7 rounded-full transition-all ${notifications ? 'bg-primary' : 'bg-border'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform mx-1 ${notifications ? 'translate-x-5' : ''}`} />
              </button>
            </div>

            {/* Dark Mode */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-text-secondary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-text-secondary text-lg">dark_mode</span>
                </div>
                <div>
                  <p className="text-text-primary text-sm font-medium">Dark Mode</p>
                  <p className="text-text-secondary text-[10px]">Coming soon</p>
                </div>
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`w-12 h-7 rounded-full transition-all ${darkMode ? 'bg-primary' : 'bg-border'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform mx-1 ${darkMode ? 'translate-x-5' : ''}`} />
              </button>
            </div>

            {/* Haptic Feedback */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-warning/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-warning text-lg">vibration</span>
                </div>
                <div>
                  <p className="text-text-primary text-sm font-medium">Haptic Feedback</p>
                  <p className="text-text-secondary text-[10px]">Vibration on interactions</p>
                </div>
              </div>
              <button
                onClick={() => setHaptics(!haptics)}
                className={`w-12 h-7 rounded-full transition-all ${haptics ? 'bg-primary' : 'bg-border'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform mx-1 ${haptics ? 'translate-x-5' : ''}`} />
              </button>
            </div>
          </div>
        </section>

        {/* Privacy & Data */}
        <section className="space-y-2">
          <h2 className="text-text-secondary text-xs font-bold uppercase tracking-wider px-1">Privacy & Data</h2>
          <div className="rounded-xl bg-surface border border-border shadow-soft divide-y divide-border">
            {/* Data Sharing */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-lg">share</span>
                </div>
                <div>
                  <p className="text-text-primary text-sm font-medium">Share with Doctor</p>
                  <p className="text-text-secondary text-[10px]">Send data to care provider</p>
                </div>
              </div>
              <button
                onClick={() => setDataSharing(!dataSharing)}
                className={`w-12 h-7 rounded-full transition-all ${dataSharing ? 'bg-primary' : 'bg-border'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform mx-1 ${dataSharing ? 'translate-x-5' : ''}`} />
              </button>
            </div>

            {/* Export Data */}
            <button onClick={handleExportData} className="flex items-center justify-between p-4 w-full text-left">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-info/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-info text-lg">download</span>
                </div>
                <div>
                  <p className="text-text-primary text-sm font-medium">Export My Data</p>
                  <p className="text-text-secondary text-[10px]">Download your health profile</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-text-secondary/40">chevron_right</span>
            </button>

            {/* Copy Doctor Link */}
            <button onClick={handleCopyDoctorLink} className="flex items-center justify-between p-4 w-full text-left">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-lg">link</span>
                </div>
                <div>
                  <p className="text-text-primary text-sm font-medium">Copy Secure Doctor Link</p>
                  <p className="text-text-secondary text-[10px]">Immediate contextual report access</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-text-secondary/40">chevron_right</span>
            </button>

            {/* Delete Data */}
            <button
              onClick={handleResetData}
              className="flex items-center justify-between p-4 w-full text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-danger/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-danger text-lg">delete</span>
                </div>
                <div>
                  <p className="text-danger text-sm font-medium">Reset Calibration</p>
                  <p className="text-text-secondary text-[10px]">Clear and recalibrate</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-text-secondary/40">chevron_right</span>
            </button>
          </div>
        </section>

        {/* Support */}
        <section className="space-y-2">
          <h2 className="text-text-secondary text-xs font-bold uppercase tracking-wider px-1">Support</h2>
          <div className="rounded-xl bg-surface border border-border shadow-soft divide-y divide-border">
            <button className="flex items-center justify-between p-4 w-full text-left">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-input-bg flex items-center justify-center">
                  <span className="material-symbols-outlined text-text-secondary text-lg">help</span>
                </div>
                <p className="text-text-primary text-sm font-medium">Help Center</p>
              </div>
              <span className="material-symbols-outlined text-text-secondary/40">chevron_right</span>
            </button>
            <button className="flex items-center justify-between p-4 w-full text-left">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-input-bg flex items-center justify-center">
                  <span className="material-symbols-outlined text-text-secondary text-lg">chat</span>
                </div>
                <p className="text-text-primary text-sm font-medium">Contact Support</p>
              </div>
              <span className="material-symbols-outlined text-text-secondary/40">chevron_right</span>
            </button>
            <button className="flex items-center justify-between p-4 w-full text-left">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-input-bg flex items-center justify-center">
                  <span className="material-symbols-outlined text-text-secondary text-lg">description</span>
                </div>
                <p className="text-text-primary text-sm font-medium">Privacy Policy</p>
              </div>
              <span className="material-symbols-outlined text-text-secondary/40">chevron_right</span>
            </button>
          </div>
        </section>

        {/* Logout Button */}
        <button
          onClick={() => setShowLogoutModal(true)}
          className="w-full p-4 rounded-xl bg-danger/5 border border-danger/20 text-danger font-medium text-sm flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-lg">logout</span>
          Sign Out
        </button>

        {/* App Version */}
        <div className="text-center pt-4">
          <p className="text-text-secondary/50 text-[10px]">Chroma-Pilot v1.0.0</p>
          <p className="text-text-secondary/30 text-[10px]">© 2026 ChromaPilot Health</p>
        </div>
      </main>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="absolute inset-0 z-50 bg-text-primary/40 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-surface border border-border rounded-xl p-6 w-full max-w-sm shadow-elevated">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-danger/10 flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-3xl text-danger">logout</span>
              </div>
              <h3 className="text-text-primary font-bold text-lg">Sign Out?</h3>
              <p className="text-text-secondary text-sm mt-2">You'll need to use your magic link to sign back in.</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-3 rounded-lg bg-input-bg border border-border text-text-primary font-medium text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-3 rounded-lg bg-danger text-white font-medium text-sm"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="absolute bottom-0 left-0 right-0 z-40 p-3 bg-gradient-to-t from-background via-background/95 to-transparent">
        <div className="flex items-center justify-around px-4 py-2.5 rounded-xl bg-surface border border-border shadow-card">
          <button onClick={() => navigate('/dashboard')} className="flex flex-col items-center gap-0.5 px-3 py-1 opacity-50 hover:opacity-80 transition-opacity">
            <span className="material-symbols-outlined text-text-secondary text-xl">home</span>
            <span className="text-[9px] text-text-secondary">Home</span>
          </button>
          <button onClick={() => navigate('/onboarding')} className="flex flex-col items-center gap-0.5 px-3 py-1 opacity-50 hover:opacity-80 transition-opacity">
            <span className="material-symbols-outlined text-text-secondary text-xl">quiz</span>
            <span className="text-[9px] text-text-secondary">Calibrate</span>
          </button>
          <button onClick={() => navigate('/insights')} className="flex flex-col items-center gap-0.5 px-3 py-1 opacity-50 hover:opacity-80 transition-opacity">
            <span className="material-symbols-outlined text-text-secondary text-xl">bar_chart</span>
            <span className="text-[9px] text-text-secondary">Insights</span>
          </button>
          <button className="flex flex-col items-center gap-0.5 px-3 py-1">
            <span className="material-symbols-outlined text-primary text-xl">settings</span>
            <span className="text-[9px] text-primary font-medium">Settings</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Settings;
