import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Insights: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'trends' | 'recommendations'>('overview');

  const overviewStats = [
    { label: 'Overall Health', value: '94%', change: '+2%', icon: 'monitor_heart', color: 'primary' },
    { label: 'Risk Score', value: 'Low', change: 'Stable', icon: 'shield', color: 'bond-blue' },
    { label: 'Compliance', value: '100%', change: '+5%', icon: 'verified', color: 'amber-500' },
  ];

  const weeklyTrends = [
    { day: 'Mon', value: 85 },
    { day: 'Tue', value: 88 },
    { day: 'Wed', value: 82 },
    { day: 'Thu', value: 90 },
    { day: 'Fri', value: 87 },
    { day: 'Sat', value: 92 },
    { day: 'Sun', value: 94 },
  ];

  const recommendations = [
    {
      title: 'Increase Water Intake',
      description: 'Based on your lifestyle data, increasing daily water by 2 glasses could improve your score.',
      priority: 'medium',
      icon: 'water_drop',
      xp: 50,
    },
    {
      title: 'Schedule Annual Check-up',
      description: 'Due to family history flags, a cardiovascular screening is recommended.',
      priority: 'high',
      icon: 'calendar_month',
      xp: 100,
    },
    {
      title: 'Reduce Caffeine',
      description: 'Consider limiting coffee to 1 cup before noon for better sleep quality.',
      priority: 'low',
      icon: 'local_cafe',
      xp: 25,
    },
  ];

  const insights = [
    {
      category: 'Medication Safety',
      insight: 'No drug interactions detected. Your profile is clear.',
      status: 'positive',
      icon: 'medication',
    },
    {
      category: 'Genetic Markers',
      insight: '2 family history markers require monitoring. Schedule regular check-ups.',
      status: 'warning',
      icon: 'genetics',
    },
    {
      category: 'Lifestyle Score',
      insight: 'Your habits are trending positive. Keep up the good work!',
      status: 'positive',
      icon: 'trending_up',
    },
  ];

  return (
    <div className="relative min-h-full bg-black text-white flex flex-col">
      {/* Ambient Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-0 w-[250px] h-[250px] bg-bond-blue/10 rounded-full blur-[80px]" />
        <div className="absolute bottom-1/3 right-0 w-[200px] h-[200px] bg-primary/10 rounded-full blur-[60px]" />
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
          <h1 className="text-white font-bold text-lg">Insights</h1>
          <button className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-white/70 text-lg">share</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mt-4">
          {(['overview', 'trends', 'recommendations'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all ${activeTab === tab
                  ? 'bg-primary/20 text-primary border border-primary/30'
                  : 'bg-white/5 text-white/50 border border-white/10'
                }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 flex-1 overflow-y-auto px-4 py-4 pb-24 space-y-4">
        {activeTab === 'overview' && (
          <>
            {/* Stats Grid */}
            <section className="grid grid-cols-3 gap-2">
              {overviewStats.map((stat, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center text-center"
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2 ${stat.color === 'primary' ? 'bg-primary/20' :
                      stat.color === 'bond-blue' ? 'bg-bond-blue/20' : 'bg-amber-500/20'
                    }`}>
                    <span className={`material-symbols-outlined text-lg ${stat.color === 'primary' ? 'text-primary' :
                        stat.color === 'bond-blue' ? 'text-bond-blue' : 'text-amber-500'
                      }`}>{stat.icon}</span>
                  </div>
                  <p className={`text-lg font-bold ${stat.color === 'primary' ? 'text-primary' :
                      stat.color === 'bond-blue' ? 'text-bond-blue' : 'text-amber-500'
                    }`}>{stat.value}</p>
                  <p className="text-white/40 text-[9px] uppercase">{stat.label}</p>
                  <p className="text-primary/60 text-[8px] mt-0.5">{stat.change}</p>
                </div>
              ))}
            </section>

            {/* AI Insights */}
            <section className="space-y-2">
              <h2 className="text-white/70 text-xs font-bold uppercase tracking-wider px-1">AI Analysis</h2>
              {insights.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border ${item.status === 'positive'
                      ? 'bg-primary/5 border-primary/20'
                      : 'bg-amber-500/5 border-amber-500/20'
                    }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${item.status === 'positive' ? 'bg-primary/20' : 'bg-amber-500/20'
                      }`}>
                      <span className={`material-symbols-outlined text-lg ${item.status === 'positive' ? 'text-primary' : 'text-amber-500'
                        }`}>{item.icon}</span>
                    </div>
                    <div>
                      <p className="text-white/50 text-[10px] uppercase tracking-wider">{item.category}</p>
                      <p className="text-white text-sm mt-1">{item.insight}</p>
                    </div>
                  </div>
                </div>
              ))}
            </section>
          </>
        )}

        {activeTab === 'trends' && (
          <>
            {/* Weekly Chart */}
            <section className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-white/50 text-[10px] uppercase tracking-wider">This Week</p>
                  <p className="text-white font-bold text-lg">Health Score Trend</p>
                </div>
                <div className="text-right">
                  <p className="text-primary font-bold text-2xl">94</p>
                  <p className="text-primary/60 text-[10px]">↑ +9 pts</p>
                </div>
              </div>

              {/* Line Chart */}
              <div className="relative h-40 w-full">
                {/* Y-axis labels */}
                <div className="absolute left-0 top-0 bottom-6 w-8 flex flex-col justify-between text-[9px] text-white/30">
                  <span>100</span>
                  <span>90</span>
                  <span>80</span>
                  <span>70</span>
                </div>

                {/* Chart area */}
                <div className="absolute left-10 right-0 top-0 bottom-0">
                  {/* Grid lines */}
                  <div className="absolute inset-0 bottom-6 flex flex-col justify-between pointer-events-none">
                    {[0, 1, 2, 3].map((i) => (
                      <div key={i} className="w-full h-px bg-white/5" />
                    ))}
                  </div>

                  {/* SVG Line Chart */}
                  <svg className="w-full h-[calc(100%-24px)]" viewBox="0 0 240 100" preserveAspectRatio="none">
                    {/* Gradient fill under line */}
                    <defs>
                      <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#36e27b" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#36e27b" stopOpacity="0" />
                      </linearGradient>
                      <linearGradient id="strokeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#36e27b" />
                        <stop offset="50%" stopColor="#00C2FF" />
                        <stop offset="100%" stopColor="#36e27b" />
                      </linearGradient>
                    </defs>

                    {/* Area fill */}
                    <path
                      d={`M 0 ${100 - (weeklyTrends[0].value - 70) * (100 / 30)} 
                          ${weeklyTrends.map((d, i) => `L ${(i / (weeklyTrends.length - 1)) * 240} ${100 - (d.value - 70) * (100 / 30)}`).join(' ')} 
                          L 240 100 L 0 100 Z`}
                      fill="url(#lineGradient)"
                      className="animate-fadeIn"
                    />

                    {/* Line */}
                    <path
                      d={`M ${weeklyTrends.map((d, i) => `${(i / (weeklyTrends.length - 1)) * 240} ${100 - (d.value - 70) * (100 / 30)}`).join(' L ')}`}
                      fill="none"
                      stroke="url(#strokeGradient)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="animate-[slideInLeft_1s_ease-out]"
                      style={{
                        filter: 'drop-shadow(0 0 6px rgba(54, 226, 123, 0.5))',
                      }}
                    />

                    {/* Data points */}
                    {weeklyTrends.map((d, i) => (
                      <g key={i}>
                        {/* Glow effect */}
                        <circle
                          cx={(i / (weeklyTrends.length - 1)) * 240}
                          cy={100 - (d.value - 70) * (100 / 30)}
                          r="6"
                          fill="#36e27b"
                          opacity="0.3"
                          className="animate-pulse"
                        />
                        {/* Point */}
                        <circle
                          cx={(i / (weeklyTrends.length - 1)) * 240}
                          cy={100 - (d.value - 70) * (100 / 30)}
                          r="4"
                          fill="#000"
                          stroke="#36e27b"
                          strokeWidth="2"
                          className="animate-[popIn_0.3s_ease-out]"
                          style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'both' }}
                        />
                      </g>
                    ))}
                  </svg>

                  {/* X-axis labels */}
                  <div className="absolute bottom-0 left-0 right-0 h-6 flex justify-between items-center">
                    {weeklyTrends.map((day, idx) => (
                      <span key={idx} className="text-white/40 text-[9px] font-medium">{day.day}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Trend Summary */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-sm">trending_up</span>
                  </div>
                  <div>
                    <p className="text-white text-xs font-medium">Improving</p>
                    <p className="text-white/40 text-[10px]">+9 points this week</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white/50 text-[10px]">Weekly Avg</p>
                  <p className="text-primary font-bold">88.3</p>
                </div>
              </div>
            </section>

            {/* Module Breakdown */}
            <section className="space-y-2">
              <h2 className="text-white/70 text-xs font-bold uppercase tracking-wider px-1">Module Breakdown</h2>

              {[
                { name: 'Safety Shield', score: 98, color: 'primary', icon: 'medication' },
                { name: 'Ancestral Radar', score: 85, color: 'bond-blue', icon: 'family_restroom' },
                { name: 'Live Context', score: 92, color: 'amber-500', icon: 'vital_signs' },
              ].map((module, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`material-symbols-outlined text-lg ${module.color === 'primary' ? 'text-primary' :
                          module.color === 'bond-blue' ? 'text-bond-blue' : 'text-amber-500'
                        }`}>{module.icon}</span>
                      <span className="text-white text-sm font-medium">{module.name}</span>
                    </div>
                    <span className={`font-bold ${module.color === 'primary' ? 'text-primary' :
                        module.color === 'bond-blue' ? 'text-bond-blue' : 'text-amber-500'
                      }`}>{module.score}%</span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${module.color === 'primary' ? 'bg-primary' :
                          module.color === 'bond-blue' ? 'bg-bond-blue' : 'bg-amber-500'
                        }`}
                      style={{ width: `${module.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </section>
          </>
        )}

        {activeTab === 'recommendations' && (
          <section className="space-y-3">
            {recommendations.map((rec, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-2xl border ${rec.priority === 'high'
                    ? 'bg-red-500/5 border-red-500/20'
                    : rec.priority === 'medium'
                      ? 'bg-amber-500/5 border-amber-500/20'
                      : 'bg-white/5 border-white/10'
                  }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${rec.priority === 'high'
                      ? 'bg-red-500/20'
                      : rec.priority === 'medium'
                        ? 'bg-amber-500/20'
                        : 'bg-white/10'
                    }`}>
                    <span className={`material-symbols-outlined text-lg ${rec.priority === 'high'
                        ? 'text-red-400'
                        : rec.priority === 'medium'
                          ? 'text-amber-400'
                          : 'text-white/60'
                      }`}>{rec.icon}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <h3 className="text-white font-bold text-sm">{rec.title}</h3>
                      <span className={`text-[8px] px-2 py-0.5 rounded-full ${rec.priority === 'high'
                          ? 'bg-red-500/20 text-red-400'
                          : rec.priority === 'medium'
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'bg-white/10 text-white/50'
                        }`}>
                        {rec.priority}
                      </span>
                    </div>
                    <p className="text-white/50 text-xs mt-1 leading-relaxed">{rec.description}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-amber-400 text-xs">+{rec.xp} XP</span>
                      <button className="text-primary text-xs font-medium">Take Action →</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </section>
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
          <button className="flex flex-col items-center gap-0.5 px-3 py-1">
            <span className="material-symbols-outlined text-primary text-xl drop-shadow-[0_0_8px_rgba(54,226,123,0.6)]">bar_chart</span>
            <span className="text-[9px] text-primary font-medium">Insights</span>
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

export default Insights;
