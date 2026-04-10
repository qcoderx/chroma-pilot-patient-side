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
      color: ['#137fec', '#2563eb', '#d97706'][i % 3],
    })), []);

  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center p-4 overflow-hidden relative">
      {/* Ambient Background Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(19,127,236,0.5) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      {/* Subtle Glowing Orbs */}
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[250px] h-[250px] bg-info/5 rounded-full blur-[100px] pointer-events-none" />

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
        <span className="material-symbols-outlined text-info text-4xl">genetics</span>
      </div>
      <div className="absolute bottom-8 left-8 opacity-10 pointer-events-none">
        <span className="material-symbols-outlined text-warning text-4xl">health_and_safety</span>
      </div>
      <div className="absolute bottom-8 right-8 opacity-10 pointer-events-none">
        <span className="material-symbols-outlined text-primary text-4xl">cardiology</span>
      </div>

      {/* Phone Frame */}
      <div className="relative z-10">
        {/* Outer Glow Effect */}
        <div className="absolute inset-[-4px] rounded-[3.2rem] bg-gradient-to-b from-primary/20 via-transparent to-info/20 blur-md animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute inset-[-2px] rounded-[3.2rem] bg-gradient-to-tr from-primary/10 via-white/5 to-info/10" />

        {/* Phone Outer Shell */}
        <div className="relative bg-gradient-to-b from-gray-200 via-gray-100 to-gray-200 rounded-[3rem] p-2 shadow-[0_0_60px_rgba(0,0,0,0.15),0_0_40px_rgba(19,127,236,0.08)]">
          {/* Metallic Edge Highlight */}
          <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-b from-white/60 via-transparent to-white/30 pointer-events-none" />

          {/* Phone Inner Bezel */}
          <div className="relative bg-background rounded-[2.5rem] overflow-hidden shadow-[inset_0_0_20px_rgba(0,0,0,0.05)]">
            {/* Screen Glass Effect */}
            <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-tr from-transparent via-white/[0.02] to-white/[0.05] pointer-events-none z-30" />

            {/* Screen Content */}
            <div className="w-[375px] h-[812px] overflow-hidden overflow-y-auto scrollbar-hide relative">
              {children}
            </div>

            {/* Home Indicator */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-30">
              <div className="w-36 h-1.5 bg-gradient-to-r from-transparent via-text-secondary/40 to-transparent rounded-full" />
            </div>
          </div>
        </div>

        {/* Side Buttons */}
        <div className="absolute -left-1.5 top-32 w-1.5 h-8 bg-gradient-to-r from-gray-300 to-gray-400 rounded-l-full shadow-lg" />
        <div className="absolute -left-1.5 top-44 w-1.5 h-14 bg-gradient-to-r from-gray-300 to-gray-400 rounded-l-full shadow-lg" />
        <div className="absolute -right-1.5 top-36 w-1.5 h-20 bg-gradient-to-l from-gray-300 to-gray-400 rounded-r-full shadow-lg" />
      </div>

      {/* Brand Text - Bottom */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 pointer-events-none">
        <div className="flex items-center gap-3 text-text-secondary/50">
          <span className="material-symbols-outlined text-sm text-primary/60 animate-pulse">genetics</span>
          <span className="text-xs font-mono tracking-[0.4em] uppercase">Chroma-Pilot</span>
          <span className="material-symbols-outlined text-sm text-info/60 animate-pulse" style={{ animationDelay: '1s' }}>biotech</span>
        </div>
        <span className="text-[8px] text-text-secondary/30 tracking-widest">PHENOTYPE CALIBRATION SYSTEM</span>
      </div>
    </div>
  );
};

export default PhoneSimulator;
