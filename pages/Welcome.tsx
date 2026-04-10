import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import { getAuthError } from '../utils/auth';

const Welcome: React.FC = () => {
  const navigate = useNavigate();
  const { session } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showButton, setShowButton] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Generate floating particles
  const floatingParticles = useMemo(() =>
    [...Array(12)].map((_, i) => ({
      left: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 4 + Math.random() * 3,
      size: 3 + Math.random() * 4,
      color: ['#137fec', '#2563eb', '#d97706'][i % 3],
    })), []);

  useEffect(() => {
    // Simulate system initialization
    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    // Show content after loading
    const loadTimer = setTimeout(() => {
      setIsLoading(false);
      setTimeout(() => setShowButton(true), 300);
    }, 2500);

    return () => {
      clearInterval(progressTimer);
      clearTimeout(loadTimer);
    };
  }, []);

  useEffect(() => {
    setAuthError(getAuthError());
  }, [session]);

  const handleBeginCalibration = () => {
    if (!session) return;
    if (navigator.vibrate) navigator.vibrate(50);
    navigate('/onboarding');
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-background overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/3 left-1/3 w-[200px] h-[200px] bg-info/8 rounded-full blur-[80px]" />
      </div>

      {/* Floating Medical Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {floatingParticles.map((particle, i) => (
          <div
            key={`particle-${i}`}
            className="absolute animate-float"
            style={{
              left: `${particle.left}%`,
              bottom: '10%',
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
                boxShadow: `0 0 ${particle.size * 2}px ${particle.color}30`,
              }}
            />
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center px-8 text-center">
        {/* Logo */}
        <div className="relative mb-8">
          <div className="w-24 h-24 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-primary">
            <img
              src="/src/images/chromapilotlogo.png"
              alt="Chroma-Pilot Logo"
              className="h-8 w-8 object-contain"
              onError={(e) => {
                // Fallback to icon if image fails
                (e.target as HTMLImageElement).style.display = 'none';
                (e.target as HTMLImageElement).parentElement!.innerHTML = '<span class="material-symbols-outlined text-5xl text-primary">genetics</span>';
              }}
            />
          </div>
          {/* Pulsing ring */}
          <div className="absolute inset-[-6px] rounded-3xl border border-primary/20 animate-ping" style={{ animationDuration: '3s' }} />
          <div className="absolute inset-[-12px] rounded-3xl border border-primary/10" />
        </div>

        {/* Brand Name */}
        <h1 className="text-3xl font-bold text-text-primary mb-2">
          Chroma<span className="text-primary">-Pilot</span>
        </h1>
        <p className="text-text-secondary text-sm mb-8 max-w-xs">
          Secure Phenotype Baseline Platform
        </p>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex flex-col items-center gap-4 w-full max-w-xs">
            {/* Loading spinner */}
            <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />

            {/* Progress bar */}
            <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>

            {/* Status texts */}
            <div className="space-y-1">
              <p className="text-text-secondary text-xs animate-pulse">
                {progress < 30 && 'Initializing phenotype scanner...'}
                {progress >= 30 && progress < 60 && 'Calibrating safety modules...'}
                {progress >= 60 && progress < 90 && 'Preparing heritage database...'}
                {progress >= 90 && 'System ready'}
              </p>
            </div>
          </div>
        ) : (
          /* Ready State */
          <div className={`flex flex-col items-center gap-6 w-full max-w-xs transition-all duration-500 ${showButton ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {/* Features list */}
            <div className="w-full space-y-3">
              {!session && authError && (
                <div className="relative overflow-hidden flex items-start gap-3 p-3 rounded-xl border border-danger/30 bg-danger/10 shadow-soft">
                  <div className="absolute inset-y-0 left-0 w-1 bg-danger" />
                  <div className="w-10 h-10 rounded-lg bg-danger/15 border border-danger/30 flex items-center justify-center">
                    <span className="material-symbols-outlined text-danger text-lg">gpp_bad</span>
                  </div>
                  <div className="text-left">
                    <p className="text-danger text-sm font-bold">Secure Link Issue</p>
                    <p className="text-text-primary text-[11px] mt-0.5">{authError}</p>
                    <p className="text-text-secondary text-[10px] mt-1">Ask your provider for a new link and open it once.</p>
                  </div>
                </div>
              )}

              <div
                className={`flex items-center gap-3 p-3 rounded-xl border shadow-soft ${session ? 'bg-primary/5 border-primary/20' : 'bg-danger/5 border-danger/20'
                  }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${session ? 'bg-primary/10' : 'bg-danger/10'}`}>
                  <span className={`material-symbols-outlined text-lg ${session ? 'text-primary' : 'text-danger'}`}>
                    {session ? 'verified_user' : 'link_off'}
                  </span>
                </div>
                <div className="text-left">
                  <p className="text-text-primary text-sm font-medium">
                    {session ? 'Secure link validated' : 'Secure link required'}
                  </p>
                  <p className="text-text-secondary text-[10px]">
                    {session
                      ? `Patient ${session.patient?.full_name || session.payload.name || session.payload.sub} is connected`
                      : 'Open this app using your provider magic link to continue'}
                  </p>
                </div>
              </div>

              {[
                { icon: 'quiz', label: '30 Baseline Questions', desc: 'Lifestyle, family history, pharmacogenomics' },
                { icon: 'neurology', label: 'Historian Engine Gene42', desc: 'Context-aware genome + phenotype analysis' },
                { icon: 'description', label: 'Doctor Report Delivery', desc: 'Immediate downloadable medical summary' },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-xl bg-surface border border-border shadow-soft animate-slideUp"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-lg">{feature.icon}</span>
                  </div>
                  <div className="text-left">
                    <p className="text-text-primary text-sm font-medium">{feature.label}</p>
                    <p className="text-text-secondary text-[10px]">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <button
              onClick={handleBeginCalibration}
              disabled={!session}
              className="w-full py-4 px-8 bg-primary text-white font-bold text-lg rounded-2xl
                       shadow-primary hover:shadow-primary-lg
                       active:scale-95 transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
            >
              <span>Start Phenotype Baseline</span>
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>

            <p className="text-text-secondary text-[10px] flex items-center gap-1">
              <span className="material-symbols-outlined text-xs text-primary">lock</span>
              <span>HIPAA Compliant • End-to-End Encrypted</span>
            </p>
          </div>
        )}
      </div>

      {/* Bottom Branding */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 text-text-secondary/40">
        <span className="material-symbols-outlined text-lg text-primary/40">biotech</span>
        <span className="text-[10px] font-mono tracking-widest">CHROMAPILOT</span>
      </div>
    </div>
  );
};

export default Welcome;
