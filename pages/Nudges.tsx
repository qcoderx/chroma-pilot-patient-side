import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Nudges: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'pending' | 'resolved'>('all');

  return (
    <div className="bg-[#0B0A12] text-white font-display min-h-screen pb-24">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 w-full backdrop-blur-xl bg-[#0B0A12]/80 border-b border-white/5">
        <div className="flex items-center justify-between p-4 pb-2">
          <button onClick={() => navigate(-1)} className="text-white/70 hover:text-white flex size-10 items-center justify-center rounded-full hover:bg-white/10 transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h2 className="text-white text-lg font-bold leading-tight tracking-wide flex-1 text-center">Bio-Collision History</h2>
          <button className="flex size-10 cursor-pointer items-center justify-center rounded-full bg-white/5 text-white hover:bg-white/10 transition-colors">
            <span className="material-symbols-outlined text-bond-blue">filter_list</span>
          </button>
        </div>
        
        {/* Filter Chips */}
        <div className="flex gap-3 px-4 pb-4 overflow-x-auto scrollbar-hide mt-2">
          <button 
            onClick={() => setFilter('all')}
            className={`flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full px-4 transition-all ${filter === 'all' ? 'bg-bond-blue text-[#0B0A12] font-bold shadow-[0_0_10px_rgba(0,191,255,0.3)]' : 'border border-white/10 bg-white/5 text-white/70'}`}
          >
            <span className="text-sm">All Nudges</span>
          </button>
          <button 
            onClick={() => setFilter('pending')}
            className={`flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full px-4 transition-all ${filter === 'pending' ? 'bg-helix-violet text-white font-bold shadow-[0_0_10px_rgba(112,0,255,0.4)]' : 'border border-white/10 bg-white/5 text-white/70'}`}
          >
            <span className="text-sm">Pending</span>
            <span className="flex h-1.5 w-1.5 rounded-full bg-helix-violet shadow-[0_0_5px_#7000FF] bg-current"></span>
          </button>
          <button 
            onClick={() => setFilter('resolved')}
            className={`flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full px-4 transition-all ${filter === 'resolved' ? 'bg-primary text-[#0B0A12] font-bold' : 'border border-white/10 bg-white/5 text-white/70'}`}
          >
            <span className="text-sm">Resolved</span>
          </button>
        </div>
      </div>

      {/* Timeline Container */}
      <div className="relative flex flex-col w-full px-4 pt-6 pb-20">
        
        {/* Pending Item */}
        {(filter === 'all' || filter === 'pending') && (
          <div className="grid grid-cols-[40px_1fr] gap-x-3 mb-8">
            <div className="flex flex-col items-center pt-1">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-helix-violet/20 border border-helix-violet text-helix-violet shadow-[0_0_15px_rgba(112,0,255,0.4)] z-10">
                <span className="material-symbols-outlined text-[18px]">warning</span>
              </div>
              <div className="w-[2px] bg-gradient-to-b from-helix-violet to-helix-violet/20 h-full mt-2 rounded-full"></div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono text-helix-violet font-semibold tracking-wider uppercase">Today, 10:15</span>
                <span className="h-px w-4 bg-helix-violet/30"></span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-helix-violet/20 text-helix-violet border border-helix-violet/30">PENDING ACTION</span>
              </div>
              <div className="bg-white/5 backdrop-blur-md border border-helix-violet rounded-[2rem] p-5 shadow-[0_0_20px_rgba(112,0,255,0.1)] relative overflow-hidden group">
                <div className="absolute inset-0 bg-cover opacity-10 mix-blend-overlay" style={{backgroundImage: 'url("https://images.unsplash.com/photo-1614850523060-8da1d56ae167?q=80&w=2670&auto=format&fit=crop")'}}></div>
                <div className="relative z-10 flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">Caffeine Limit Reached</h3>
                      <p className="text-sm text-gray-300 leading-relaxed">CYP1A2 Gene limit approached. Metabolic processing speed slowed by 40%.</p>
                    </div>
                  </div>
                  <div className="p-3 bg-helix-violet/10 rounded-xl border border-helix-violet/20 flex gap-3 items-center">
                    <span className="material-symbols-outlined text-helix-violet">local_cafe</span>
                    <p className="text-sm text-white font-medium">Switch to herbal tea immediately to avoid metabolizer crash.</p>
                  </div>
                  <button className="mt-2 flex w-full cursor-pointer items-center justify-center rounded-full h-11 bg-helix-violet text-white text-sm font-bold tracking-wide hover:bg-helix-violet/90 transition-all shadow-[0_0_15px_rgba(112,0,255,0.4)]">
                    Mark Complete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Resolved Item 1 */}
        {(filter === 'all' || filter === 'resolved') && (
          <div className="grid grid-cols-[40px_1fr] gap-x-3 mb-8">
            <div className="flex flex-col items-center pt-1">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-bond-blue/20 border border-bond-blue text-bond-blue shadow-[0_0_15px_rgba(0,191,255,0.4)] z-10">
                <span className="material-symbols-outlined text-[18px]">ecg_heart</span>
              </div>
              <div className="w-[2px] bg-gradient-to-b from-bond-blue to-bond-blue/20 h-full mt-2 rounded-full opacity-50"></div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono text-bond-blue font-semibold tracking-wider uppercase">Yesterday, 14:30</span>
              </div>
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[2rem] overflow-hidden relative group hover:border-bond-blue/50 transition-colors">
                <div className="flex flex-col">
                  <div className="h-32 w-full bg-cover bg-center relative" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCCYx_KGDgQ1VePuTRMtZNnQHXJIbl2DR8K4DW1mndpKe7OjFTz2mnRHmlFiVm7Wz_X3QIoM5kdRJeJ9IiypMzVaZ3JvNOk0pdw_tiwr5YWbV1j861RB9Z2pyHDx7GOjI9UwYYMsaXgFqSNdjPTbtIGGMJ247PsQlvXwLpx5n1VbquQJZGzvXcalCtgN_dqi7c7_IOPKMUw29JoegQcMtbSCsH6jt6UeQpqpRZZv2DS9_m3IMAHtuwaimT-oQ6o9AyGB3rL3Wqa8hY")' }}>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0A12] to-transparent"></div>
                    <div className="absolute bottom-3 left-4">
                      <span className="bg-bond-blue/20 backdrop-blur-sm border border-bond-blue/30 text-bond-blue text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">Resolved</span>
                    </div>
                  </div>
                  <div className="p-5 pt-2 flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-bold text-white">High Stress Detect</h3>
                        <p className="text-sm text-gray-400 mt-1">Cortisol markers elevated. Recommended 5m breathing completed. HRV stabilized.</p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-1">
                      <div className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-bond-blue text-[14px]">trending_up</span>
                        <span className="text-xs text-bond-blue font-mono">+12 HRV</span>
                      </div>
                      <div className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-emerald-400 text-[14px]">arrow_downward</span>
                        <span className="text-xs text-emerald-400 font-mono">-15% Stress</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Resolved Item 2 */}
        {(filter === 'all' || filter === 'resolved') && (
          <div className="grid grid-cols-[40px_1fr] gap-x-3">
            <div className="flex flex-col items-center pt-1">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 border border-white/20 text-gray-400 z-10">
                <span className="material-symbols-outlined text-[18px]">water_drop</span>
              </div>
              <div className="w-[2px] bg-white/5 h-full mt-2 rounded-full"></div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono text-gray-500 font-semibold tracking-wider uppercase">Yesterday, 09:00</span>
              </div>
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[2rem] p-5 hover:bg-white/10 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-base font-bold text-white">Hydration Alert</h3>
                    <p className="text-sm text-gray-400">Genetic hydration efficiency low. Logged 500ml intake.</p>
                  </div>
                  <div className="shrink-0 flex items-center justify-center size-8 rounded-full bg-bond-blue/20 text-bond-blue">
                    <span className="material-symbols-outlined text-[18px]">check</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#0B0A12] to-transparent pointer-events-none z-20"></div>
    </div>
  );
};

export default Nudges;
