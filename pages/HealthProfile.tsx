import React from 'react';
import { useNavigate } from 'react-router-dom';

const HealthProfile: React.FC = () => {
  const navigate = useNavigate();

  const safetyProfile = {
    score: 98,
    medications: [
      { name: 'No active prescriptions', status: 'clear', icon: 'check_circle' },
    ],
    allergies: [
      { name: 'No known allergies', status: 'clear', icon: 'check_circle' },
    ],
    flags: 0,
  };

  const heritageProfile = {
    risk: 'Low',
    flags: [
      { condition: 'Heart Disease History', status: 'flagged', severity: 'moderate', icon: 'favorite' },
      { condition: 'Diabetes Type 2', status: 'flagged', severity: 'low', icon: 'water_drop' },
    ],
    clearedItems: 8,
  };

  const lifestyleProfile = {
    score: 85,
    metrics: [
      { label: 'Sleep', value: '7.5 hrs', trend: 'up', icon: 'bedtime', color: 'info' },
      { label: 'Hydration', value: '8 glasses', trend: 'up', icon: 'water_drop', color: 'primary' },
      { label: 'Exercise', value: '4 hrs/wk', trend: 'stable', icon: 'fitness_center', color: 'warning' },
      { label: 'Caffeine', value: '2 cups', trend: 'down', icon: 'local_cafe', color: 'warning' },
      { label: 'Alcohol', value: '3 units', trend: 'stable', icon: 'liquor', color: 'info' },
      { label: 'Stress', value: 'Moderate', trend: 'down', icon: 'psychology', color: 'primary' },
    ],
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'primary': return { text: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20' };
      case 'info': return { text: 'text-info', bg: 'bg-info/10', border: 'border-info/20' };
      case 'warning': return { text: 'text-warning', bg: 'bg-warning/10', border: 'border-warning/20' };
      default: return { text: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20' };
    }
  };

  return (
    <div className="relative min-h-full bg-background text-text-primary flex flex-col">
      {/* Header */}
      <header className="relative z-10 px-4 pt-4 pb-3 border-b border-border bg-surface">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-full bg-input-bg border border-border flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-text-secondary text-lg">arrow_back</span>
          </button>
          <h1 className="text-text-primary font-bold text-lg">Health Profile</h1>
          <button className="w-9 h-9 rounded-full bg-input-bg border border-border flex items-center justify-center">
            <span className="material-symbols-outlined text-text-secondary text-lg">edit</span>
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 flex-1 overflow-y-auto px-4 py-4 pb-24 space-y-4">
        {/* Safety Shield Section */}
        <section className="p-4 rounded-2xl bg-surface border border-primary/20 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                <span className="material-symbols-outlined text-primary text-2xl">medication</span>
              </div>
              <div>
                <h2 className="text-text-primary font-bold text-sm">Safety Shield</h2>
                <p className="text-primary text-xs">Medication Safety</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-primary">{safetyProfile.score}%</p>
              <p className="text-text-secondary text-[10px]">Safe Score</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 rounded-xl bg-input-bg">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-success text-lg">check_circle</span>
                <span className="text-text-secondary text-xs">Active Medications</span>
              </div>
              <span className="text-success text-xs font-medium">None</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-input-bg">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-success text-lg">check_circle</span>
                <span className="text-text-secondary text-xs">Known Allergies</span>
              </div>
              <span className="text-success text-xs font-medium">None</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-input-bg">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-success text-lg">verified</span>
                <span className="text-text-secondary text-xs">Critical Flags</span>
              </div>
              <span className="text-success text-xs font-medium">{safetyProfile.flags}</span>
            </div>
          </div>
        </section>

        {/* Ancestral Radar Section */}
        <section className="p-4 rounded-2xl bg-surface border border-info/20 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-info/10 flex items-center justify-center border border-info/20">
                <span className="material-symbols-outlined text-info text-2xl">family_restroom</span>
              </div>
              <div>
                <h2 className="text-text-primary font-bold text-sm">Ancestral Radar</h2>
                <p className="text-info text-xs">Family History</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-info">{heritageProfile.risk}</p>
              <p className="text-text-secondary text-[10px]">Risk Level</p>
            </div>
          </div>

          {/* Flagged Items */}
          <div className="space-y-2">
            <p className="text-text-secondary text-[10px] uppercase tracking-wider mb-2">Flagged Conditions</p>
            {heritageProfile.flags.map((flag, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-input-bg">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-warning text-lg">{flag.icon}</span>
                  <span className="text-text-secondary text-xs">{flag.condition}</span>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${flag.severity === 'moderate' ? 'bg-warning/10 text-warning' : 'bg-info/10 text-info'
                  }`}>
                  {flag.severity}
                </span>
              </div>
            ))}
            <div className="flex items-center justify-between p-3 rounded-xl bg-input-bg">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-success text-lg">check_circle</span>
                <span className="text-text-secondary text-xs">Cleared Items</span>
              </div>
              <span className="text-success text-xs font-medium">{heritageProfile.clearedItems}</span>
            </div>
          </div>
        </section>

        {/* Live Context Section */}
        <section className="p-4 rounded-2xl bg-surface border border-warning/20 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center border border-warning/20">
                <span className="material-symbols-outlined text-warning text-2xl">vital_signs</span>
              </div>
              <div>
                <h2 className="text-text-primary font-bold text-sm">Live Context</h2>
                <p className="text-warning text-xs">Lifestyle Metrics</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-warning">{lifestyleProfile.score}</p>
              <p className="text-text-secondary text-[10px]">Lifestyle Score</p>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-3 gap-2">
            {lifestyleProfile.metrics.map((metric, idx) => {
              const colors = getColorClasses(metric.color);
              return (
                <div key={idx} className="p-3 rounded-xl bg-input-bg flex flex-col items-center text-center">
                  <span className={`material-symbols-outlined text-lg mb-1 ${colors.text}`}>{metric.icon}</span>
                  <p className="text-text-primary text-xs font-medium">{metric.value}</p>
                  <p className="text-text-secondary text-[8px] uppercase">{metric.label}</p>
                  <span className={`text-[8px] mt-1 ${metric.trend === 'up' ? 'text-success' :
                    metric.trend === 'down' ? 'text-info' : 'text-text-secondary'
                    }`}>
                    {metric.trend === 'up' ? '↑' : metric.trend === 'down' ? '↓' : '→'}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Last Updated */}
        <div className="text-center">
          <p className="text-text-secondary/60 text-[10px]">Last calibrated: Today at 10:30 AM</p>
          <button
            onClick={() => navigate('/onboarding')}
            className="text-primary text-xs font-medium mt-2"
          >
            Recalibrate Now →
          </button>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="absolute bottom-0 left-0 right-0 z-50 p-3 bg-gradient-to-t from-background via-background/95 to-transparent">
        <div className="flex items-center justify-around px-4 py-2.5 rounded-2xl bg-surface border border-border shadow-card">
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
          <button onClick={() => navigate('/settings')} className="flex flex-col items-center gap-0.5 px-3 py-1 opacity-50 hover:opacity-80 transition-opacity">
            <span className="material-symbols-outlined text-text-secondary text-xl">settings</span>
            <span className="text-[9px] text-text-secondary">Settings</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default HealthProfile;
