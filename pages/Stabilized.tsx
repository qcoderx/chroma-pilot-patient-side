import React from 'react';
import { useNavigate } from 'react-router-dom';

const Stabilized: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center shadow-2xl overflow-hidden bg-background-dark">
      {/* Cyber Grid Background Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 195, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 195, 255, 0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)'
        }}
      ></div>

      {/* Top Bar */}
      <div className="w-full flex items-center justify-between p-6 z-10">
        <button onClick={() => navigate('/')} className="flex items-center justify-center w-10 h-10 rounded-full bg-surface-dark border border-white/5 hover:bg-surface-accent transition-colors text-white/70">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
          <span className="text-xs font-bold text-primary tracking-wider uppercase">Live Sync</span>
        </div>
        <button className="flex items-center justify-center w-10 h-10 rounded-full bg-surface-dark border border-white/5 hover:bg-surface-accent transition-colors text-white/70">
          <span className="material-symbols-outlined">settings</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 w-full flex flex-col px-6 z-10 pb-8">
        {/* Hero Visual Area */}
        <div className="relative w-full aspect-square flex items-center justify-center my-4 group">
          {/* Outer Glow Rings */}
          <div className="absolute inset-0 rounded-full border border-primary/10 scale-90 animate-pulse-slow"></div>
          <div className="absolute inset-0 rounded-full border border-primary/5 scale-75"></div>
          
          {/* Central Visual Container */}
          <div className="relative w-64 h-64 rounded-full bg-gradient-to-b from-primary/20 to-transparent flex items-center justify-center backdrop-blur-sm border border-white/5 shadow-[0_0_60px_-10px_rgba(0,195,255,0.2)]">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1614726365723-49cfae9d018d?q=80&w=600&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-screen rounded-full" ></div>
            {/* Icon Overlay */}
            <div className="relative z-10 flex flex-col items-center justify-center gap-2">
              <span className="material-symbols-outlined text-6xl text-primary drop-shadow-[0_0_15px_rgba(0,195,255,0.8)]">check_circle</span>
            </div>
          </div>
          
          {/* Floating Particles */}
          <div className="absolute top-10 right-10 w-2 h-2 bg-primary rounded-full opacity-60 animate-bounce delay-75"></div>
          <div className="absolute bottom-20 left-10 w-1.5 h-1.5 bg-primary rounded-full opacity-40 animate-bounce delay-150"></div>
        </div>

        {/* Status Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-white mb-2 drop-shadow-md">
            System <span className="text-primary">Stabilized</span>
          </h1>
          <p className="text-primary/80 text-lg font-medium">Bio-Collision Averted</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {/* Stat Card 1 */}
          <div className="bg-surface-dark border border-white/5 rounded-2xl p-5 flex flex-col items-start gap-3 relative overflow-hidden group hover:border-primary/30 transition-all">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-4xl text-primary">monitor_heart</span>
            </div>
            <div className="flex items-center gap-2 text-primary/70">
              <span className="material-symbols-outlined text-xl">favorite</span>
              <span className="text-xs font-bold uppercase tracking-wider">Heart Rate</span>
            </div>
            <div>
              <span className="text-3xl font-bold text-white tracking-tight">72</span>
              <span className="text-sm text-white/50 ml-1">BPM</span>
            </div>
            <div className="px-2 py-1 bg-success/10 rounded-md border border-success/20">
              <p className="text-xs font-semibold text-success flex items-center gap-1">
                <span className="material-symbols-outlined text-[10px]">arrow_downward</span>
                Stable
              </p>
            </div>
          </div>

          {/* Stat Card 2 */}
          <div className="bg-surface-dark border border-white/5 rounded-2xl p-5 flex flex-col items-start gap-3 relative overflow-hidden group hover:border-primary/30 transition-all">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-4xl text-primary">psychology</span>
            </div>
            <div className="flex items-center gap-2 text-primary/70">
              <span className="material-symbols-outlined text-xl">water_drop</span>
              <span className="text-xs font-bold uppercase tracking-wider">Cortisol</span>
            </div>
            <div>
              <span className="text-2xl font-bold text-white tracking-tight">Normal</span>
            </div>
            <div className="px-2 py-1 bg-primary/10 rounded-md border border-primary/20">
              <p className="text-xs font-semibold text-primary flex items-center gap-1">
                <span className="material-symbols-outlined text-[10px]">check</span>
                Nominal
              </p>
            </div>
          </div>
        </div>

        {/* Feedback Text */}
        <div className="bg-surface-accent/50 rounded-xl p-4 border-l-4 border-primary mb-auto">
          <p className="text-white/80 text-sm leading-relaxed">
            <span className="text-primary font-bold">Good work.</span> Your proactive adjustment prevented a collision event. Your telemetry is now syncing with the central Helix core.
          </p>
        </div>

        {/* Action Button */}
        <button 
          onClick={() => navigate('/')}
          className="w-full bg-primary hover:bg-primary/90 text-background-dark font-bold text-lg py-4 rounded-full mt-6 shadow-[0_0_20px_-5px_rgba(0,195,255,0.6)] transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
        >
          Resume Monitoring
          <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};

export default Stabilized;
