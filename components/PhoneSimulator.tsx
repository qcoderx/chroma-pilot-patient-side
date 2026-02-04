import React, { ReactNode, useMemo } from 'react';
import DNAHelix from './DNAHelix';

interface PhoneSimulatorProps {
  children: ReactNode;
}

const PhoneSimulator: React.FC<PhoneSimulatorProps> = ({ children }) => {
  // Generate ambient particles for the outer area
  const ambientParticles = useMemo(() =>
    [...Array(20)].map((_, i) => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: 2 + Math.random() * 4,
      delay: Math.random() * 5,
      duration: 3 + Math.random() * 4,
      color: ['#36e27b', '#00C2FF', '#f59e0b'][i % 3],
    })), []);

  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center p-4 overflow-hidden relative">
      {/* Ambient Background Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(54,226,123,0.5) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      {/* Subtle Glowing Orbs */}
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[250px] h-[250px] bg-bond-blue/5 rounded-full blur-[100px] pointer-events-none" />

      {/* 3D DNA Helix - Left Side */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-24 h-96 pointer-events-none opacity-40">
        {/*<DNAHelix progress={50} moduleColor="primary" intensity="low" />*/}
      </div>

      {/* 3D DNA Helix - Right Side */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-24 h-96 pointer-events-none opacity-40">
        {/*<DNAHelix progress={50} moduleColor="bond-blue" intensity="low" />*/}
      </div>

      {/* Floating Ambient Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {ambientParticles.map((particle, i) => (
          <div
            key={`ambient-${i}`}
            className="absolute rounded-full animate-float opacity-40"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`,
              boxShadow: `0 0 ${particle.size * 3}px ${particle.color}40`,
            }}
          />
        ))}
      </div>

      {/* Medical Cross Icons - Corners */}
      <div className="absolute top-8 left-8 opacity-10 pointer-events-none">
        <span className="material-symbols-outlined text-primary text-4xl">add_circle</span>
      </div>
      <div className="absolute top-8 right-8 opacity-10 pointer-events-none">
        <span className="material-symbols-outlined text-bond-blue text-4xl">genetics</span>
      </div>
      <div className="absolute bottom-8 left-8 opacity-10 pointer-events-none">
        <span className="material-symbols-outlined text-amber-500 text-4xl">health_and_safety</span>
      </div>
      <div className="absolute bottom-8 right-8 opacity-10 pointer-events-none">
        <span className="material-symbols-outlined text-primary text-4xl">cardiology</span>
      </div>

      {/* Phone Frame */}
      <div className="relative z-10">
        {/* Outer Glow Effect - Enhanced */}
        <div className="absolute inset-[-4px] rounded-[3.2rem] bg-gradient-to-b from-primary/30 via-transparent to-bond-blue/30 blur-md animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute inset-[-2px] rounded-[3.2rem] bg-gradient-to-tr from-primary/10 via-white/5 to-bond-blue/10" />

        {/* Phone Outer Shell */}
        <div className="relative bg-gradient-to-b from-gray-800 via-gray-900 to-gray-800 rounded-[3rem] p-2 shadow-[0_0_100px_rgba(0,0,0,0.95),0_0_80px_rgba(54,226,123,0.1),0_0_40px_rgba(0,194,255,0.05)]">
          {/* Metallic Edge Highlight */}
          <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-b from-white/10 via-transparent to-white/5 pointer-events-none" />

          {/* Phone Inner Bezel */}
          <div className="relative bg-black rounded-[2.5rem] overflow-hidden shadow-[inset_0_0_30px_rgba(0,0,0,0.8)]">
            {/* Screen Glass Effect */}
            <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-tr from-transparent via-white/[0.02] to-white/[0.05] pointer-events-none z-30" />

            {/* Subtle inner glow */}
            <div className="absolute inset-0 rounded-[2.5rem] shadow-[inset_0_0_80px_rgba(54,226,123,0.03),inset_0_0_40px_rgba(0,194,255,0.02)] pointer-events-none z-20" />

            {/* Screen Content */}
            <div className="w-[375px] h-[812px] overflow-hidden overflow-y-auto scrollbar-hide relative">
              {children}
            </div>

            {/* Home Indicator - Enhanced */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-30">
              <div className="w-36 h-1.5 bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-full shadow-[0_0_15px_rgba(255,255,255,0.2)]" />
            </div>

            {/* Screen Bottom Reflection */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/[0.02] to-transparent pointer-events-none z-20 rounded-b-[2.5rem]" />
          </div>
        </div>

        {/* Phone Reflection Highlight - Enhanced */}
        {/*<div className="absolute top-4 left-8 right-8 h-40 bg-gradient-to-b from-white/[0.08] to-transparent rounded-t-[2.5rem] pointer-events-none" />*/}

        {/* Side Buttons - Enhanced */}
        <div className="absolute -left-1.5 top-32 w-1.5 h-8 bg-gradient-to-r from-gray-600 to-gray-700 rounded-l-full shadow-lg" />
        <div className="absolute -left-1.5 top-44 w-1.5 h-14 bg-gradient-to-r from-gray-600 to-gray-700 rounded-l-full shadow-lg" />
        <div className="absolute -right-1.5 top-36 w-1.5 h-20 bg-gradient-to-l from-gray-600 to-gray-700 rounded-r-full shadow-lg" />
      </div>

      {/* Brand Text - Bottom - Enhanced */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 pointer-events-none">
        <div className="flex items-center gap-3 text-white/25">
          <span className="material-symbols-outlined text-sm text-primary/60 animate-pulse">genetics</span>
          <span className="text-xs font-mono tracking-[0.4em] uppercase">ChromaPilot</span>
          <span className="material-symbols-outlined text-sm text-bond-blue/60 animate-pulse" style={{ animationDelay: '1s' }}>biotech</span>
        </div>
        <span className="text-[8px] text-white/15 tracking-widest">PHENOTYPE CALIBRATION SYSTEM</span>
      </div>
    </div>
  );
};

export default PhoneSimulator;
