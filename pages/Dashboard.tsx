import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-6 pb-32 min-h-screen bg-deep-indigo">
      {/* Dashboard Header */}
      <header className="sticky top-0 z-50 bg-deep-indigo/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center size-10 rounded-full bg-white/5 border border-white/10 text-primary shadow-neon-blue">
              <span className="material-symbols-outlined text-[24px]">genetics</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-bond-blue font-bold tracking-widest uppercase">Clinic Connected</span>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_#36e27b] animate-pulse"></span>
                <h2 className="text-white text-base font-bold tracking-wide">STABLE</h2>
              </div>
            </div>
          </div>
          <button className="relative flex items-center justify-center size-10 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
            <span className="material-symbols-outlined text-white/80">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-bond-blue rounded-full"></span>
          </button>
        </div>
      </header>

      <main className="flex flex-col gap-6 px-4">
        {/* Holographic Avatar Section */}
        <section className="relative flex flex-col items-center justify-center py-6">
          {/* Circular Progress / Status Ring */}
          <div className="relative flex items-center justify-center w-64 h-64">
            {/* Outer rotating decorative ring */}
            <div className="absolute inset-0 rounded-full border border-helix-violet/30 border-dashed animate-spin-slow"></div>
            {/* Inner static glow ring */}
            <div className="absolute inset-2 rounded-full border border-bond-blue/20 shadow-neon-violet"></div>
            
            {/* Hologram Container */}
            <div className="relative w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-b from-transparent via-bond-blue/5 to-transparent">
              <img 
                alt="Patient Avatar" 
                className="w-48 h-full object-contain animate-hologram mix-blend-screen opacity-90" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdzOTYGiIqWlHqZGir3t8lEOf_sNeVB4AOLYmdUaKXvmTzJyiYqgO3WZZ9zK3iYSc2kp4Q-xsF_Dr5JnCm4rc41ItVgl2PT8ulyKt3JTjMC8l8HQo68K64AHBAT0AbSOwovZo6gnsEWu2pn35-FTL8lRGlP33_o_6t9AXvvRIiq_cSsGa6FxZ_-H77ZLh_Ycl9ZiXSoJwOQ003jdME5vs3fuAF1Cq4uULx8kOihf-j2fiwuU1xcMh8BEOG0qeFWJSUaDWnCFdgIcU"
              />
              {/* Scan line effect */}
              <div className="absolute top-0 left-0 w-full h-1 bg-bond-blue/50 shadow-[0_0_10px_#00C2FF] animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite] opacity-50"></div>
            </div>
            
            {/* Floating Labels around avatar */}
            <div className="absolute -right-4 top-10 bg-deep-indigo/90 backdrop-blur border border-helix-violet/50 px-3 py-1 rounded-full shadow-neon-violet">
              <p className="text-[10px] font-mono text-bond-blue">GENOME: 99%</p>
            </div>
            <button 
              onClick={() => navigate('/collision')}
              className="absolute -left-4 bottom-10 bg-deep-indigo/90 backdrop-blur border border-primary/30 px-3 py-1 rounded-full shadow-neon-blue hover:bg-white/10 hover:border-mutation-magenta/50 hover:text-mutation-magenta transition-all cursor-pointer group"
            >
              <p className="text-[10px] font-mono text-primary group-hover:text-mutation-magenta transition-colors">RISK: LOW</p>
            </button>
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-white/60 text-sm font-medium">GxE Interaction Probability</p>
            <p className="text-bond-blue text-2xl font-bold tracking-tight drop-shadow-[0_0_5px_rgba(0,194,255,0.5)]">3.2%</p>
          </div>
        </section>

        {/* Stats Grid (Glassmorphism) */}
        <section className="grid grid-cols-2 gap-4">
          {/* Card 1 */}
          <div className="group relative flex flex-col justify-between p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-helix-violet/40 shadow-glass transition-all hover:bg-white/10">
            <div className="flex justify-between items-start mb-2">
              <div className="p-2 rounded-full bg-bond-blue/10 text-bond-blue">
                <span className="material-symbols-outlined text-[20px]">ecg_heart</span>
              </div>
              <span className="text-xs font-mono text-white/40">LIVE</span>
            </div>
            <div>
              <p className="text-white/70 text-sm font-medium mb-1">Cardio Sync</p>
              <div className="flex items-end gap-2">
                <p className="text-2xl font-bold text-white tracking-tight">72 <span className="text-sm font-normal text-white/50">BPM</span></p>
              </div>
              <p className="text-primary text-xs font-medium mt-1 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">check_circle</span>
                Optimal Range
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="group relative flex flex-col justify-between p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-helix-violet/40 shadow-glass transition-all hover:bg-white/10">
            <div className="flex justify-between items-start mb-2">
              <div className="p-2 rounded-full bg-purple-500/10 text-purple-400">
                <span className="material-symbols-outlined text-[20px]">neurology</span>
              </div>
              <span className="text-xs font-mono text-white/40">HOURLY</span>
            </div>
            <div>
              <p className="text-white/70 text-sm font-medium mb-1">Neuro-Load</p>
              <div className="flex items-end gap-2">
                <p className="text-2xl font-bold text-white tracking-tight">12%</p>
              </div>
              <p className="text-bond-blue text-xs font-medium mt-1 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">trending_down</span>
                Reducing
              </p>
            </div>
          </div>

          {/* Card 3 (Wide) */}
          <div className="col-span-2 relative flex items-center p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-helix-violet/40 shadow-glass">
            <div className="flex-1 pr-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 rounded-full bg-orange-500/10 text-orange-400">
                  <span className="material-symbols-outlined text-[18px]">local_fire_department</span>
                </div>
                <p className="text-white/70 text-sm font-medium">Metabolic Burn</p>
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold text-white tracking-tight">1,200</p>
                <span className="text-sm text-white/50">kCal</span>
              </div>
              <div className="w-full bg-white/10 h-1.5 rounded-full mt-3 overflow-hidden">
                <div className="bg-gradient-to-r from-bond-blue to-helix-violet h-full rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center pl-4 border-l border-white/10">
              <span className="text-xs text-white/40 mb-1">Target</span>
              <span className="text-lg font-bold text-white">1,850</span>
            </div>
          </div>
        </section>

        {/* Genetic Insight Card */}
        <section className="mt-2">
          <h3 className="text-lg font-bold text-white px-2 mb-3">Clinician Decision Support</h3>
          <div className="relative overflow-hidden rounded-2xl bg-[#1b3224]/20 border border-primary/30 p-0 shadow-lg">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
            <div className="flex flex-col md:flex-row gap-4 p-5 relative z-10">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">verified</span>
                  <span className="text-primary text-sm font-bold uppercase tracking-wider">Protocol Matched</span>
                </div>
                <h4 className="text-white text-lg font-semibold leading-tight">Patient lifestyle aligns with prescribed genetic markers.</h4>
                <p className="text-white/60 text-sm">No immediate pharmacogenomic (PGx) variants triggered by current regimen.</p>
              </div>
              <div className="hidden sm:block w-24 h-24 rounded-xl bg-black/20 overflow-hidden shrink-0 border border-white/5">
                <img alt="Genetic Pattern" className="w-full h-full object-cover opacity-80" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgAn6V8krZ2qUeiciiwk5gvRWtUxPz1ck4FiEaH4T6rwdS-NspNAYpIURlhyQhizHCkqnYcWtx1Fpu6JJ016Qx1dgfL6D4up3PC3UhArzUhIMCGAfyvaxYnKL1gKkhDxijZDHGzftFbdJDezuduOQAhXnZMZOFXN5niYBw71HJyKxF9lCJTUiqtdUVamF76yitCTk4LNw8mK2LAwtQk2ESdghB8F9RBRreT4joWBhDF8DBPBcJBo0lRc3ODu3BlQpGWQFOlL3CbYc" />
              </div>
            </div>
            {/* Decorative bottom bar */}
            <div className="h-1 w-full bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0"></div>
          </div>
        </section>

        {/* FAB */}
        <div className="fixed bottom-24 right-4 z-40">
          <button className="flex items-center justify-center w-14 h-14 rounded-full bg-bond-blue text-deep-indigo shadow-[0_0_20px_rgba(0,194,255,0.4)] hover:scale-105 transition-transform active:scale-95">
            <span className="material-symbols-outlined text-[28px]">add</span>
          </button>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;