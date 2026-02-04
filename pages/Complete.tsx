import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ParticleBurst } from '../components/MicroInteractions';

const Complete: React.FC = () => {
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(false);
  const [xpCount, setXpCount] = useState(0);
  const [badgesRevealed, setBadgesRevealed] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const [bonusXP, setBonusXP] = useState(0);

  // Generate particles for celebration effect
  const celebrationParticles = useMemo(() =>
    [...Array(30)].map((_, i) => ({
      left: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 3 + Math.random() * 2,
      size: 6 + Math.random() * 6,
      color: ['#36e27b', '#00C2FF', '#f59e0b'][i % 3],
    })), []);

  // DNA helix animation particles
  const helixParticles = useMemo(() =>
    [...Array(12)].map((_, i) => ({
      delay: i * 0.2,
      offset: i % 2 === 0,
    })), []);

  useEffect(() => {
    // Trigger haptic celebration pattern
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100, 50, 200, 100, 300]);
    }

    // Animate in content
    setTimeout(() => setShowContent(true), 300);
    setTimeout(() => setShowCelebration(true), 500);
    setTimeout(() => setShowParticles(true), 800);

    // Animate XP counter with acceleration
    let current = 0;
    const targetXP = 500;
    const xpTimer = setInterval(() => {
      const remaining = targetXP - current;
      const increment = Math.max(1, Math.floor(remaining / 15));
      current = Math.min(targetXP, current + increment);
      setXpCount(current);
      if (current >= targetXP) {
        clearInterval(xpTimer);
        // Calculate bonus XP (random 10-50)
        const bonus = 10 + Math.floor(Math.random() * 40);
        setBonusXP(bonus);
        // Final celebration haptic
        if (navigator.vibrate) {
          navigator.vibrate([50, 30, 50, 30, 100]);
        }
      }
    }, 25);

    // Reveal badges one by one with stagger
    setTimeout(() => setBadgesRevealed(1), 800);
    setTimeout(() => setBadgesRevealed(2), 1200);
    setTimeout(() => setBadgesRevealed(3), 1600);

    return () => clearInterval(xpTimer);
  }, []);

  const badges = [
    { icon: 'medication', name: 'Safety Guardian', color: 'primary', desc: 'Medication Profile Complete' },
    { icon: 'family_restroom', name: 'Heritage Scout', color: 'bond-blue', desc: 'Family History Mapped' },
    { icon: 'vital_signs', name: 'Life Navigator', color: 'amber-500', desc: 'Lifestyle Calibrated' },
  ];

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-black overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-primary/15 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/3 left-1/4 w-[200px] h-[200px] bg-bond-blue/10 rounded-full blur-[80px]" />
        <div className="absolute top-1/2 right-1/4 w-[150px] h-[150px] bg-amber-500/10 rounded-full blur-[60px]" />
      </div>

      {/* DNA Helix Animation */}
      {showCelebration && (
        <div className="absolute left-4 top-1/4 bottom-1/4 flex flex-col justify-center gap-2 pointer-events-none opacity-30">
          {helixParticles.map((particle, i) => (
            <div
              key={`helix-l-${i}`}
              className="w-2 h-2 rounded-full bg-primary animate-pulse"
              style={{
                animationDelay: `${particle.delay}s`,
                transform: particle.offset ? 'translateX(8px)' : 'translateX(0)',
              }}
            />
          ))}
        </div>
      )}
      {showCelebration && (
        <div className="absolute right-4 top-1/4 bottom-1/4 flex flex-col justify-center gap-2 pointer-events-none opacity-30">
          {helixParticles.map((particle, i) => (
            <div
              key={`helix-r-${i}`}
              className="w-2 h-2 rounded-full bg-bond-blue animate-pulse"
              style={{
                animationDelay: `${particle.delay}s`,
                transform: particle.offset ? 'translateX(-8px)' : 'translateX(0)',
              }}
            />
          ))}
        </div>
      )}

      {/* Floating Medical Particles */}
      {showContent && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {celebrationParticles.map((particle, i) => (
            <div
              key={`particle-${i}`}
              className="absolute animate-float"
              style={{
                left: `${particle.left}%`,
                bottom: '-5%',
                animationDelay: `${particle.delay}s`,
                animationDuration: `${particle.duration}s`,
              }}
            >
              <div
                className="rounded-full"
                style={{
                  width: particle.size,
                  height: particle.size,
                  backgroundColor: particle.color,
                  boxShadow: `0 0 ${particle.size * 2}px ${particle.color}40`,
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Main Content */}
      <div className={`relative z-10 flex flex-col items-center px-8 text-center transition-all duration-700 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {/* Success Icon with Medical Theme */}
        <div className="relative mb-6">
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary/30 to-bond-blue/20 flex items-center justify-center border-2 border-primary/50 shadow-[0_0_60px_rgba(54,226,123,0.4)]">
            <span className="material-symbols-outlined text-6xl text-primary drop-shadow-[0_0_30px_rgba(54,226,123,0.8)] animate-pulse">
              task_alt
            </span>
          </div>
          {/* Pulsing success rings */}
          <div className="absolute inset-[-6px] rounded-full border-2 border-primary/30 animate-ping" style={{ animationDuration: '2s' }} />
          <div className="absolute inset-[-12px] rounded-full border border-primary/20" />
          <div className="absolute inset-[-20px] rounded-full border border-bond-blue/10" />
        </div>

        {/* Title */}
        <div className="relative mb-2">
          <h1 className="text-3xl font-bold text-white">
            Profile <span className="text-primary drop-shadow-[0_0_20px_rgba(54,226,123,0.6)]">Complete!</span>
          </h1>
        </div>
        <p className="text-white/60 text-sm mb-8">
          Your health profile has been calibrated
        </p>

        {/* XP Counter with Animation */}
        <div className="mb-8 px-6 py-4 rounded-2xl bg-white/5 border border-primary/30 shadow-[0_0_20px_rgba(54,226,123,0.2)] backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="relative">
              <span className="material-symbols-outlined text-3xl text-primary animate-pulse">workspace_premium</span>
              {showParticles && <ParticleBurst active={true} color="#36e27b" particleCount={8} />}
            </div>
            <div className="text-left">
              <p className="text-white/50 text-xs uppercase tracking-wider">Points Earned</p>
              <p className="text-3xl font-bold text-primary drop-shadow-[0_0_10px_rgba(54,226,123,0.5)]">
                +{xpCount} XP
              </p>
              {bonusXP > 0 && (
                <p className="text-amber-400 text-sm font-bold animate-popIn">
                  +{bonusXP} Completion Bonus! 🎁
                </p>
              )}
            </div>
            <span className="material-symbols-outlined text-2xl text-amber-500 animate-bounce">emoji_events</span>
          </div>
        </div>

        {/* Level Up Banner */}
        <div className="mb-6 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-bond-blue/20 border border-primary/30">
          <p className="text-white text-sm font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">arrow_circle_up</span>
            <span>LEVEL UP!</span>
            <span className="text-primary">Health Pioneer</span>
            <span className="material-symbols-outlined text-amber-500">military_tech</span>
          </p>
        </div>

        {/* Badges */}
        <div className="w-full max-w-sm mb-8">
          <p className="text-white/40 text-xs uppercase tracking-wider mb-4 flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-sm text-primary">verified</span>
            <span>Badges Unlocked</span>
            <span className="material-symbols-outlined text-sm text-primary">verified</span>
          </p>
          <div className="flex flex-col gap-3">
            {badges.map((badge, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-4 p-4 rounded-2xl bg-white/5 backdrop-blur-sm border transition-all duration-500 ${badgesRevealed > idx
                  ? `border-${badge.color}/40 opacity-100 translate-x-0 shadow-[0_0_15px_rgba(54,226,123,0.1)]`
                  : 'border-white/5 opacity-0 -translate-x-4'
                  }`}
                style={{ transitionDelay: `${idx * 200}ms` }}
              >
                <div className={`w-12 h-12 rounded-xl bg-${badge.color}/20 flex items-center justify-center relative`}>
                  <span className={`material-symbols-outlined text-2xl text-${badge.color}`}>{badge.icon}</span>
                  {badgesRevealed > idx && (
                    <div className="absolute inset-0 rounded-xl animate-ping opacity-20" style={{ backgroundColor: badge.color === 'primary' ? '#36e27b' : badge.color === 'bond-blue' ? '#00C2FF' : '#f59e0b' }} />
                  )}
                </div>
                <div className="flex-1 text-left">
                  <p className="text-white font-bold">{badge.name}</p>
                  <p className="text-white/50 text-xs">{badge.desc}</p>
                </div>
                <span className={`material-symbols-outlined text-${badge.color}`}>check_circle</span>
              </div>
            ))}
          </div>
        </div>

        {/* Continue Button */}
        <button
          onClick={() => {
            if (navigator.vibrate) navigator.vibrate(50);
            navigate('/dashboard');
          }}
          className="w-full max-w-sm py-4 px-8 bg-gradient-to-r from-primary to-primary/80 text-black font-bold text-lg rounded-2xl 
                   shadow-[0_0_30px_rgba(54,226,123,0.4)] hover:shadow-[0_0_50px_rgba(54,226,123,0.6)] 
                   active:scale-95 transition-all duration-200 flex items-center justify-center gap-3 group"
        >
          <span>View Dashboard</span>
          <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
        </button>

        <p className="text-white/30 text-xs mt-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-sm animate-pulse text-primary">sync</span>
          <span>Syncing with your care provider...</span>
        </p>
      </div>

      {/* Bottom Branding */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 text-white/30">
        <span className="material-symbols-outlined text-lg text-primary/50">biotech</span>
        <span className="text-[10px] font-mono tracking-widest">CHROMAPILOT</span>
      </div>
    </div>
  );
};

export default Complete;