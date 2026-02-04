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
      { label: 'Sleep', value: '7.5 hrs', trend: 'up', icon: 'bedtime', color: 'bond-blue' },
      { label: 'Hydration', value: '8 glasses', trend: 'up', icon: 'water_drop', color: 'primary' },
      { label: 'Exercise', value: '4 hrs/wk', trend: 'stable', icon: 'fitness_center', color: 'amber-500' },
      { label: 'Caffeine', value: '2 cups', trend: 'down', icon: 'local_cafe', color: 'amber-500' },
      { label: 'Alcohol', value: '3 units', trend: 'stable', icon: 'liquor', color: 'bond-blue' },
      { label: 'Stress', value: 'Moderate', trend: 'down', icon: 'psychology', color: 'primary' },
    ],
  };

  return (
    <div className="relative min-h-full bg-black text-white flex flex-col">
      {/* Ambient Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[80px]" />
        <div className="absolute bottom-1/4 right-0 w-[200px] h-[200px] bg-bond-blue/10 rounded-full blur-[60px]" />
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
          <h1 className="text-white font-bold text-lg">Health Profile</h1>
          <button className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-white/70 text-lg">edit</span>
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 flex-1 overflow-y-auto px-4 py-4 pb-24 space-y-4">
        {/* Safety Shield Section */}
        <section className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
                <span className="material-symbols-outlined text-primary text-2xl">medication</span>
              </div>
              <div>
                <h2 className="text-white font-bold text-sm">Safety Shield</h2>
                <p className="text-primary/80 text-xs">Medication Safety</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-primary">{safetyProfile.score}%</p>
              <p className="text-white/40 text-[10px]">Safe Score</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 rounded-xl bg-black/30">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                <span className="text-white/70 text-xs">Active Medications</span>
              </div>
              <span className="text-primary text-xs font-medium">None</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-black/30">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                <span className="text-white/70 text-xs">Known Allergies</span>
              </div>
              <span className="text-primary text-xs font-medium">None</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-black/30">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-lg">verified</span>
                <span className="text-white/70 text-xs">Critical Flags</span>
              </div>
              <span className="text-primary text-xs font-medium">{safetyProfile.flags}</span>
            </div>
          </div>
        </section>

        {/* Ancestral Radar Section */}
        <section className="p-4 rounded-2xl bg-gradient-to-br from-bond-blue/10 to-bond-blue/5 border border-bond-blue/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-bond-blue/20 flex items-center justify-center border border-bond-blue/30">
                <span className="material-symbols-outlined text-bond-blue text-2xl">family_restroom</span>
              </div>
              <div>
                <h2 className="text-white font-bold text-sm">Ancestral Radar</h2>
                <p className="text-bond-blue/80 text-xs">Family History</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-bond-blue">{heritageProfile.risk}</p>
              <p className="text-white/40 text-[10px]">Risk Level</p>
            </div>
          </div>

          {/* Flagged Items */}
          <div className="space-y-2">
            <p className="text-white/50 text-[10px] uppercase tracking-wider mb-2">Flagged Conditions</p>
            {heritageProfile.flags.map((flag, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-black/30">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-amber-400 text-lg">{flag.icon}</span>
                  <span className="text-white/70 text-xs">{flag.condition}</span>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${flag.severity === 'moderate' ? 'bg-amber-500/20 text-amber-400' : 'bg-bond-blue/20 text-bond-blue'
                  }`}>
                  {flag.severity}
                </span>
              </div>
            ))}
            <div className="flex items-center justify-between p-3 rounded-xl bg-black/30">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                <span className="text-white/70 text-xs">Cleared Items</span>
              </div>
              <span className="text-primary text-xs font-medium">{heritageProfile.clearedItems}</span>
            </div>
          </div>
        </section>

        {/* Live Context Section */}
        <section className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 to-amber-500/5 border border-amber-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center border border-amber-500/30">
                <span className="material-symbols-outlined text-amber-500 text-2xl">vital_signs</span>
              </div>
              <div>
                <h2 className="text-white font-bold text-sm">Live Context</h2>
                <p className="text-amber-500/80 text-xs">Lifestyle Metrics</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-amber-500">{lifestyleProfile.score}</p>
              <p className="text-white/40 text-[10px]">Lifestyle Score</p>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-3 gap-2">
            {lifestyleProfile.metrics.map((metric, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-black/30 flex flex-col items-center text-center">
                <span className={`material-symbols-outlined text-lg mb-1 ${metric.color === 'primary' ? 'text-primary' :
                    metric.color === 'bond-blue' ? 'text-bond-blue' : 'text-amber-500'
                  }`}>{metric.icon}</span>
                <p className="text-white text-xs font-medium">{metric.value}</p>
                <p className="text-white/40 text-[8px] uppercase">{metric.label}</p>
                <span className={`text-[8px] mt-1 ${metric.trend === 'up' ? 'text-primary' :
                    metric.trend === 'down' ? 'text-bond-blue' : 'text-white/40'
                  }`}>
                  {metric.trend === 'up' ? '↑' : metric.trend === 'down' ? '↓' : '→'}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Last Updated */}
        <div className="text-center">
          <p className="text-white/30 text-[10px]">Last calibrated: Today at 10:30 AM</p>
          <button
            onClick={() => navigate('/onboarding')}
            className="text-primary text-xs font-medium mt-2"
          >
            Recalibrate Now →
          </button>
        </div>
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

export default HealthProfile;
