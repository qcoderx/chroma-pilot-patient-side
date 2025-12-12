import React from 'react';
import { AreaChart, Area, ResponsiveContainer, YAxis, XAxis, Tooltip } from 'recharts';

const Genetics: React.FC = () => {
  const data = [
    { time: '00:00', value: 30 },
    { time: '03:00', value: 50 },
    { time: '06:00', value: 80 },
    { time: '09:00', value: 45 },
    { time: '12:00', value: 60 },
    { time: '15:00', value: 90 },
    { time: '18:00', value: 75 },
    { time: '21:00', value: 55 },
    { time: '24:00', value: 40 },
  ];

  return (
    <div className="pb-24 pt-4 bg-background-dark min-h-screen">
      {/* Top App Bar */}
      <div className="sticky top-0 z-40 bg-background-dark/85 backdrop-blur-xl border-b border-helix-violet/20 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="bg-center bg-no-repeat bg-cover rounded-full size-10 border border-helix-violet/50 shadow-neon-violet" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCPgwd4xT7mPcTahRL8wv4ovSj1j9SSiU9jQcRD7t0QcbX1vW_X_FLP-UdPwCqEQ-gzYzMNKe3mchhSKgxVzKnr6H-DTeeJn0jQweMkIJTJV_mSaDgpL3caoK3edoCKrl9jVZY6ppKnxXHbu4gI_4stSOKHlEZUtAbpC1yVogYEl1_eed8jNFhy-mLZzB6LCXMqaUjALnmYsIle4ND7sF4belYpSQsIU1m03bsVX1RfjdaSgwLfC3Xznv2hd1i7qWPf_mVgTOQZniM")' }}></div>
            <div className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full border-2 border-background-dark"></div>
          </div>
          <div>
            <h2 className="text-white text-sm font-bold tracking-wider uppercase leading-none">Genome ID: XJ-9</h2>
            <span className="text-bond-blue text-[10px] font-medium tracking-widest uppercase">Encryption: AES-256</span>
          </div>
        </div>
        <div className="flex items-center">
          <button className="flex items-center justify-center rounded-full size-10 bg-helix-violet/10 text-bond-blue border border-helix-violet/20 hover:bg-helix-violet/20 transition-colors">
            <span className="material-symbols-outlined text-[20px]">notifications_active</span>
          </button>
        </div>
      </div>

      {/* Hero */}
      <div className="px-4 pt-6 pb-2">
        <div className="flex flex-col gap-1 text-center">
          <span className="text-bond-blue text-xs font-bold tracking-[0.2em] uppercase">Clinical Analysis</span>
          <h1 className="text-white text-3xl font-bold leading-tight tracking-tight shadow-primary drop-shadow-[0_0_8px_rgba(112,0,255,0.5)]">GENOMIC BLUEPRINT</h1>
        </div>
      </div>

      {/* Chart */}
      <div className="px-4 py-4">
        <div className="glass-panel rounded-2xl p-5 relative overflow-hidden group">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-helix-violet/20 rounded-full blur-[50px]"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="flex flex-col">
              <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">Genomic Stability</p>
              <p className="text-white text-4xl font-bold tracking-tighter">94% <span className="text-lg font-normal text-gray-400">Optimal</span></p>
            </div>
            <div className="flex flex-col items-end">
              <span className="flex items-center gap-1 text-bond-blue bg-bond-blue/10 px-2 py-1 rounded text-xs font-bold">
                <span className="material-symbols-outlined text-[14px]">trending_up</span>
                +0.2%
              </span>
              <span className="text-[10px] text-gray-500 mt-1 uppercase">Real-time</span>
            </div>
          </div>
          
          <div className="h-[140px] w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7000FF" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#7000FF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="value" stroke="#00C2FF" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bio-Collisions */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <h3 className="text-white text-lg font-bold tracking-tight flex items-center gap-2">
          <span className="material-symbols-outlined text-critical-red animate-pulse">warning</span>
          ACTIVE DRUG-GENE ALERTS
        </h3>
        <span className="text-[10px] text-gray-500 uppercase tracking-widest border border-gray-800 rounded px-2 py-0.5">Live Feed</span>
      </div>

      <div className="px-4 mb-4">
        <div className="rounded-2xl relative overflow-hidden bg-background-dark border border-critical-red/60 shadow-critical">
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-0"></div>
          <div className="relative z-10 p-5 flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-critical-red/20 text-critical-red border border-critical-red/30 mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-critical-red animate-ping"></span>
                  Metabolic Conflict
                </span>
                <h4 className="text-2xl font-bold text-white leading-tight">CYP1A2 *1F/*1F</h4>
                <p className="text-bond-blue text-sm font-medium tracking-wide">CAFFEINE / THEOPHYLLINE</p>
              </div>
              <div className="size-10 rounded-full bg-critical-red/10 flex items-center justify-center border border-critical-red/30">
                <span className="material-symbols-outlined text-critical-red">local_cafe</span>
              </div>
            </div>
            <div className="bg-black/40 backdrop-blur-sm rounded-lg p-3 border border-white/5">
              <p className="text-gray-200 text-sm leading-relaxed">
                <strong className="text-critical-red">CLINICAL ALERT:</strong> Ultra-slow metabolizer status. High risk of toxicity with substrates.
              </p>
            </div>
            <button className="w-full flex items-center justify-center gap-2 h-11 bg-critical-red hover:bg-red-600 text-white rounded-lg text-sm font-bold tracking-wide uppercase transition-all shadow-[0_0_15px_rgba(255,42,0,0.4)]">
              <span className="material-symbols-outlined text-[18px]">gpp_maybe</span>
              Alert Clinician
            </button>
          </div>
        </div>
      </div>

      {/* PGx Section */}
      <div className="flex items-center justify-between px-4 pt-2 pb-2">
        <h3 className="text-white text-lg font-bold tracking-tight">PHARMACOGENOMICS (PGx)</h3>
      </div>

      {/* PGx Card 1 */}
      <div className="px-4 mb-3">
        <div className="glass-panel rounded-xl p-4 flex flex-col gap-3 group active:border-primary transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500 border border-orange-500/20">
                <span className="material-symbols-outlined">pill</span>
              </div>
              <div>
                <h4 className="text-base font-bold text-white">CYP2C19</h4>
                <p className="text-white/50 text-xs tracking-wider">PLAVIX / CLOPIDOGREL</p>
              </div>
            </div>
            <span className="text-orange-400 text-[10px] font-bold uppercase border border-orange-400/30 bg-orange-400/10 px-2 py-0.5 rounded">Poor Metabolizer</span>
          </div>
          <div className="h-px w-full bg-white/10"></div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-400">Phenotype: <span className="text-white font-mono">PM (*2/*2)</span></span>
            <span className="text-gray-400">Action: <span className="text-white">Adjust Dosage</span></span>
          </div>
        </div>
      </div>

      {/* Lifestyle Card */}
      <div className="flex items-center justify-between px-4 pt-2 pb-2 mt-2">
        <h3 className="text-white text-lg font-bold tracking-tight">LIFESTYLE FACTORS</h3>
      </div>

      <div className="px-4 mb-3">
        <div className="glass-panel rounded-xl p-4 flex flex-col gap-3 group active:border-primary transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-lg bg-bond-blue/10 flex items-center justify-center text-bond-blue border border-bond-blue/20">
                <span className="material-symbols-outlined">sprint</span>
              </div>
              <div>
                <h4 className="text-base font-bold text-white">ACTN3</h4>
                <p className="text-bond-blue text-xs tracking-wider">MUSCLE COMPOSITION</p>
              </div>
            </div>
            <span className="text-green-400 text-[10px] font-bold uppercase border border-green-400/30 bg-green-400/10 px-2 py-0.5 rounded">Optimal</span>
          </div>
          <div className="h-px w-full bg-white/10"></div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-400">Genotype: <span className="text-white font-mono">XX (Sprinter)</span></span>
            <span className="text-gray-400">Performance: <span className="text-white">+15%</span></span>
          </div>
        </div>
      </div>
      
      <div className="px-6 py-4 text-center">
        <p className="text-[10px] text-gray-600 font-mono uppercase tracking-wider">
          Last Sequenced: 2023-10-24 // Node: Tokyo-04
        </p>
      </div>
    </div>
  );
};

export default Genetics;