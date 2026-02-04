import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PullToRefresh from '../components/PullToRefresh';
import { ToastContainer, useToast } from '../components/Toast';
import { BouncyPress, AnimatedCounter, ProgressRing, DailyStreak, LevelUpCelebration, AchievementUnlock } from '../components/MicroInteractions';
import { StaggeredList, SmoothNumber } from '../components/PageTransition';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { toasts, addToast, removeToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [xp, setXp] = useState(500);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showAchievement, setShowAchievement] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [dailyStreak, setDailyStreak] = useState(3);

  // Daily challenges
  const [challenges, setChallenges] = useState([
    { id: 1, name: 'Complete a sync', icon: 'sync', xp: 50, completed: false, progress: 0, target: 1 },
    { id: 2, name: 'Answer 5 questions', icon: 'quiz', xp: 100, completed: false, progress: 0, target: 5 },
    { id: 3, name: 'Share with doctor', icon: 'share', xp: 75, completed: false, progress: 0, target: 1 },
  ]);

  // Check for level up
  useEffect(() => {
    const newLevel = Math.floor(xp / 1000) + 1;
    if (newLevel > currentLevel) {
      setCurrentLevel(newLevel);
      setShowLevelUp(true);
    }
  }, [xp, currentLevel]);

  const stats = [
    { label: 'Safety Score', value: '98%', icon: 'medication', color: 'primary', trend: '+2%', desc: 'Medication Safe' },
    { label: 'Heritage Risk', value: 'Low', icon: 'family_restroom', color: 'bond-blue', trend: 'Stable', desc: '2 Flags Active' },
    { label: 'Lifestyle', value: '85', icon: 'vital_signs', color: 'amber-500', trend: '+5', desc: 'Good Habits' },
  ];

  const achievements = [
    { name: 'Calibrated', icon: 'verified', earned: true, xp: 500 },
    { name: 'Weekly Sync', icon: 'event_available', earned: false, xp: 100 },
    { name: 'Health Star', icon: 'star', earned: false, xp: 250 },
    { name: 'Data Pro', icon: 'insights', earned: false, xp: 300 },
  ];

  const recentActivity = [
    { action: 'Completed Calibration', time: 'Just now', icon: 'check_circle', color: 'primary' },
    { action: 'Profile Created', time: '2 min ago', icon: 'person_add', color: 'bond-blue' },
  ];

  // Pull to refresh handler
  const handleRefresh = useCallback(async () => {
    setIsLoading(true);
    // Simulate refresh delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Award bonus XP for syncing
    const bonusXP = 50 + Math.floor(Math.random() * 25);
    setXp((prev) => prev + bonusXP);

    // Update daily challenge
    setChallenges((prev) =>
      prev.map((c) => (c.id === 1 ? { ...c, completed: true, progress: 1 } : c))
    );

    // Update streak
    setDailyStreak((prev) => prev + 1);

    addToast(`Data synced! +${bonusXP} XP bonus!`, 'xp', bonusXP);
    setIsLoading(false);
  }, [addToast]);

  // Complete a challenge
  const completeChallenge = (challengeId: number) => {
    const challenge = challenges.find((c) => c.id === challengeId);
    if (challenge && !challenge.completed) {
      setChallenges((prev) =>
        prev.map((c) =>
          c.id === challengeId ? { ...c, completed: true, progress: c.target } : c
        )
      );
      setXp((prev) => prev + challenge.xp);
      addToast(`Challenge completed! +${challenge.xp} XP`, 'success');

      // Show achievement for completing first challenge
      if (!showAchievement) {
        setTimeout(() => setShowAchievement(true), 500);
      }
    }
  };

  return (
    <div className="relative min-h-full bg-black text-white flex flex-col">
      {/* Level Up Celebration */}
      {showLevelUp && (
        <LevelUpCelebration
          level={currentLevel}
          onComplete={() => setShowLevelUp(false)}
        />
      )}

      {/* Achievement Unlock */}
      {showAchievement && (
        <AchievementUnlock
          name="First Steps"
          icon="flag"
          xp={100}
          rarity="common"
          onComplete={() => setShowAchievement(false)}
        />
      )}

      {/* Toast notifications */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* Ambient Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[80px]" />
        <div className="absolute bottom-1/3 right-0 w-[200px] h-[200px] bg-bond-blue/10 rounded-full blur-[60px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 px-4 pt-4 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary/40 to-bond-blue/40 flex items-center justify-center border border-primary/30 shadow-[0_0_15px_rgba(54,226,123,0.3)]">
                <span className="material-symbols-outlined text-white text-xl">person</span>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-primary rounded-full border-2 border-black flex items-center justify-center">
                <span className="text-[8px] font-bold text-black">1</span>
              </div>
            </div>
            <div>
              <p className="text-white font-bold text-sm">Welcome back!</p>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                <p className="text-primary/80 text-xs font-medium">Profile Active</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/notifications')}
              className="relative w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-white/70 text-lg">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
          </div>
        </div>
      </header>

      {/* Scrollable Content with Pull to Refresh */}
      <PullToRefresh onRefresh={handleRefresh} className="relative z-10 flex-1 overflow-y-auto">
        <main className="px-4 pb-24 space-y-4">
          {/* XP & Level Card */}
          <BouncyPress className="p-4 rounded-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500/30 to-amber-600/20 flex items-center justify-center border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                  <span className="text-3xl animate-bounce-slow">🏆</span>
                  {/* Level badge */}
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br from-primary to-emerald-400 flex items-center justify-center text-black text-xs font-black border-2 border-black">
                    {currentLevel}
                  </div>
                </div>
                <div>
                  <p className="text-white/50 text-[10px] uppercase tracking-wider">Current Level</p>
                  <p className="text-xl font-bold text-white">Level <span className="text-primary drop-shadow-[0_0_10px_rgba(54,226,123,0.6)]">{currentLevel}</span></p>
                </div>
              </div>
              <div className="text-right">
                <SmoothNumber value={xp} suffix=" XP" className="text-amber-400 font-bold text-lg" />
                <p className="text-white/40 text-[10px]">{1000 - (xp % 1000)} more to Level {currentLevel + 1}</p>
              </div>
            </div>

            {/* XP Progress Bar */}
            <div className="relative">
              <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary via-emerald-400 to-bond-blue rounded-full shadow-[0_0_10px_rgba(54,226,123,0.5)] relative transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{ width: `${(xp % 1000) / 10}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                </div>
              </div>
              <div className="flex justify-between mt-1.5 text-[10px]">
                <span className="text-white/40">Level {currentLevel}</span>
                <span className="text-primary font-bold">{Math.round((xp % 1000) / 10)}%</span>
                <span className="text-white/40">Level {currentLevel + 1}</span>
              </div>
            </div>
          </BouncyPress>

          {/* Daily Streak */}
          <DailyStreak
            currentStreak={dailyStreak}
            longestStreak={Math.max(dailyStreak, 7)}
            todayCompleted={challenges.some((c) => c.completed)}
          />

          {/* Daily Challenges */}
          <section className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-white/70 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-amber-400">local_fire_department</span>
                Daily Challenges
              </h2>
              <span className="text-primary text-[10px] font-medium">
                {challenges.filter((c) => c.completed).length}/{challenges.length} Complete
              </span>
            </div>

            <div className="space-y-2">
              {challenges.map((challenge) => (
                <BouncyPress
                  key={challenge.id}
                  onClick={() => !challenge.completed && completeChallenge(challenge.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 ${challenge.completed
                      ? 'bg-primary/10 border-primary/30'
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                    }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${challenge.completed ? 'bg-primary/30' : 'bg-white/10'
                    }`}>
                    <span className={`material-symbols-outlined text-xl ${challenge.completed ? 'text-primary' : 'text-white/60'
                      }`}>
                      {challenge.completed ? 'check_circle' : challenge.icon}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${challenge.completed ? 'text-primary line-through' : 'text-white'}`}>
                      {challenge.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${challenge.completed ? 'bg-primary' : 'bg-white/30'
                            }`}
                          style={{ width: `${(challenge.progress / challenge.target) * 100}%` }}
                        />
                      </div>
                      <span className="text-white/40 text-[10px]">{challenge.progress}/{challenge.target}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-bold ${challenge.completed ? 'text-primary/50' : 'text-amber-400'}`}>
                      +{challenge.xp} XP
                    </span>
                  </div>
                </BouncyPress>
              ))}
            </div>
          </section>

          {/* Health Stats */}
          <section className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-white/70 text-xs font-bold uppercase tracking-wider">Health Profile</h2>
              <button
                onClick={() => navigate('/health-profile')}
                className="text-primary text-[10px] font-medium hover:underline active:opacity-70"
              >
                View All →
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {stats.map((stat, idx) => (
                <BouncyPress
                  key={idx}
                  className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center text-center hover:bg-white/[0.08] transition-all"
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2 ${stat.color === 'primary' ? 'bg-primary/20' :
                    stat.color === 'bond-blue' ? 'bg-bond-blue/20' : 'bg-amber-500/20'
                    }`}>
                    <span className={`material-symbols-outlined text-xl ${stat.color === 'primary' ? 'text-primary' :
                      stat.color === 'bond-blue' ? 'text-bond-blue' : 'text-amber-500'
                      }`}>{stat.icon}</span>
                  </div>
                  <p className={`text-lg font-bold ${stat.color === 'primary' ? 'text-primary' :
                    stat.color === 'bond-blue' ? 'text-bond-blue' : 'text-amber-500'
                    }`}>{stat.value}</p>
                  <p className="text-white/40 text-[9px] uppercase tracking-wide">{stat.label}</p>
                  <p className="text-primary/60 text-[8px] mt-0.5">{stat.trend}</p>
                </BouncyPress>
              ))}
            </div>
          </section>

          {/* Mini Health Trend Chart */}
          <BouncyPress 
            onClick={() => navigate('/insights')}
            className="p-4 rounded-2xl bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/10"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-sm">show_chart</span>
                </div>
                <div>
                  <p className="text-white text-sm font-bold">Health Score Trend</p>
                  <p className="text-white/40 text-[10px]">Last 7 days</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-primary font-bold text-xl">94</p>
                <p className="text-primary/60 text-[10px] flex items-center justify-end gap-0.5">
                  <span className="material-symbols-outlined text-[10px]">trending_up</span>
                  +9 pts
                </p>
              </div>
            </div>

            {/* Mini Line Chart */}
            <div className="h-16 w-full">
              <svg className="w-full h-full" viewBox="0 0 200 60" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="miniLineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#36e27b" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#36e27b" stopOpacity="0" />
                  </linearGradient>
                </defs>
                
                {/* Area fill */}
                <path
                  d="M 0 45 L 33 36 L 66 42 L 100 30 L 133 33 L 166 24 L 200 18 L 200 60 L 0 60 Z"
                  fill="url(#miniLineGradient)"
                />
                
                {/* Line */}
                <path
                  d="M 0 45 L 33 36 L 66 42 L 100 30 L 133 33 L 166 24 L 200 18"
                  fill="none"
                  stroke="#36e27b"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ filter: 'drop-shadow(0 0 4px rgba(54, 226, 123, 0.5))' }}
                />
                
                {/* End point glow */}
                <circle cx="200" cy="18" r="4" fill="#36e27b" opacity="0.3" className="animate-pulse" />
                <circle cx="200" cy="18" r="3" fill="#000" stroke="#36e27b" strokeWidth="2" />
              </svg>
            </div>

            <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
              <span className="text-white/30 text-[9px]">Mon</span>
              <span className="text-white/30 text-[9px]">Tue</span>
              <span className="text-white/30 text-[9px]">Wed</span>
              <span className="text-white/30 text-[9px]">Thu</span>
              <span className="text-white/30 text-[9px]">Fri</span>
              <span className="text-white/30 text-[9px]">Sat</span>
              <span className="text-primary text-[9px] font-bold">Today</span>
            </div>

            <div className="flex items-center justify-center mt-2 text-white/40 text-[10px]">
              <span className="material-symbols-outlined text-xs mr-1">open_in_new</span>
              Tap for detailed insights
            </div>
          </BouncyPress>

          {/* Achievements */}
          <section className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-white/70 text-xs font-bold uppercase tracking-wider">Achievements</h2>
              <span className="text-white/40 text-[10px]">1/4 Unlocked</span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {achievements.map((ach, idx) => (
                <BouncyPress
                  key={idx}
                  className={`aspect-square rounded-xl flex flex-col items-center justify-center p-2 transition-all ${ach.earned
                    ? 'bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/40 shadow-[0_0_12px_rgba(54,226,123,0.15)]'
                    : 'bg-white/5 border border-white/10 opacity-50'
                    }`}
                  onClick={() => {
                    if (!ach.earned) {
                      addToast(`Complete more tasks to unlock "${ach.name}"`, 'info');
                    }
                  }}
                >
                  <span className={`material-symbols-outlined text-xl mb-1 ${ach.earned ? 'text-primary' : 'text-white/30'}`}>
                    {ach.icon}
                  </span>
                  <p className={`text-[7px] text-center leading-tight ${ach.earned ? 'text-white/80' : 'text-white/30'}`}>
                    {ach.name}
                  </p>
                  <p className={`text-[6px] mt-0.5 ${ach.earned ? 'text-amber-400' : 'text-white/20'}`}>
                    +{ach.xp} XP
                  </p>
                </BouncyPress>
              ))}
            </div>
          </section>

          {/* Recent Activity */}
          <section className="space-y-2">
            <h2 className="text-white/70 text-xs font-bold uppercase tracking-wider px-1">Recent Activity</h2>
            <StaggeredList className="space-y-2" staggerDelay={80}>
              {recentActivity.map((item, idx) => (
                <BouncyPress key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.color === 'primary' ? 'bg-primary/20' : 'bg-bond-blue/20'
                    }`}>
                    <span className={`material-symbols-outlined text-base ${item.color === 'primary' ? 'text-primary' : 'text-bond-blue'
                      }`}>{item.icon}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">{item.action}</p>
                    <p className="text-white/40 text-[10px]">{item.time}</p>
                  </div>
                </BouncyPress>
              ))}
            </StaggeredList>
          </section>

          {/* Quick Actions */}
          <section className="grid grid-cols-2 gap-2">
            <BouncyPress
              onClick={() => navigate('/onboarding')}
              className="p-3 rounded-xl bg-gradient-to-br from-bond-blue/20 to-bond-blue/5 border border-bond-blue/30 flex flex-col items-center gap-1.5 hover:from-bond-blue/30 transition-all"
            >
              <span className="material-symbols-outlined text-bond-blue text-xl">refresh</span>
              <span className="text-white font-medium text-xs">Recalibrate</span>
              <span className="text-white/40 text-[9px]">Update Profile</span>
            </BouncyPress>
            <BouncyPress
              onClick={() => addToast('Share link copied to clipboard!', 'success')}
              className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 flex flex-col items-center gap-1.5 hover:from-primary/30 transition-all"
            >
              <span className="material-symbols-outlined text-primary text-xl">share</span>
              <span className="text-white font-medium text-xs">Share</span>
              <span className="text-white/40 text-[9px]">Send to Doctor</span>
            </BouncyPress>
          </section>
        </main>
      </PullToRefresh>

      {/* Bottom Navigation - Absolute positioning for phone simulator */}
      <nav className="absolute bottom-0 left-0 right-0 z-50 p-3 bg-gradient-to-t from-black via-black/95 to-transparent">
        <div className="flex items-center justify-around px-4 py-2.5 rounded-2xl bg-white/[0.08] backdrop-blur-xl border border-white/10">
          <button className="flex flex-col items-center gap-0.5 px-3 py-1 transition-transform active:scale-90">
            <span className="material-symbols-outlined text-primary text-xl drop-shadow-[0_0_8px_rgba(54,226,123,0.6)]">home</span>
            <span className="text-[9px] text-primary font-medium">Home</span>
          </button>
          <button onClick={() => navigate('/onboarding')} className="flex flex-col items-center gap-0.5 px-3 py-1 opacity-50 hover:opacity-80 transition-all active:scale-90">
            <span className="material-symbols-outlined text-white/60 text-xl">quiz</span>
            <span className="text-[9px] text-white/60">Calibrate</span>
          </button>
          <button onClick={() => navigate('/insights')} className="flex flex-col items-center gap-0.5 px-3 py-1 opacity-50 hover:opacity-80 transition-all active:scale-90">
            <span className="material-symbols-outlined text-white/60 text-xl">bar_chart</span>
            <span className="text-[9px] text-white/60">Insights</span>
          </button>
          <button onClick={() => navigate('/settings')} className="flex flex-col items-center gap-0.5 px-3 py-1 opacity-50 hover:opacity-80 transition-all active:scale-90">
            <span className="material-symbols-outlined text-white/60 text-xl">settings</span>
            <span className="text-[9px] text-white/60">Settings</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Dashboard;