import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SpringButton } from '../components/MicroInteractions';

const Welcome: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showSparkles, setShowSparkles] = useState(false);
  const [pulseScale, setPulseScale] = useState(1);

  useEffect(() => {
    // Simulate JWT auto-login handshake with smooth easing
    const startTime = Date.now();
    const duration = 2000;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const rawProgress = Math.min(elapsed / duration, 1);
      // Ease out expo
      const easedProgress = 1 - Math.pow(2, -10 * rawProgress);

      setProgress(Math.round(easedProgress * 100));

      if (rawProgress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsLoading(false);
        setShowSparkles(true);
        // Celebration haptic
        if (navigator.vibrate) {
          navigator.vibrate([30, 20, 50]);
        }
      }
    };

    requestAnimationFrame(animate);

    // Pulse animation for logo
    const pulseInterval = setInterval(() => {
      setPulseScale((prev) => (prev === 1 ? 1.05 : 1));
    }, 2000);

    return () => clearInterval(pulseInterval);
  }, []);

  const handleStart = () => {
    // Trigger haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate([50, 30, 50]);
    }
    navigate('/onboarding');
  };

  return (
    <div className="relative min-h-full w-full flex flex-col items-center justify-center bg-black overflow-hidden">
      {/* Subtle Medical Grid Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle, rgba(54,226,123,0.3) 1px, transparent 1px)`,
          backgroundSize: '30px 30px'
        }} />
      </div>

      {/* Subtle Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 w-[250px] h-[250px] bg-bond-blue/10 rounded-full blur-[80px]" />

      {/* Sparkles on completion */}
      {showSparkles && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute text-xl animate-confetti"
              style={{
                left: `${10 + Math.random() * 80}%`,
                top: '-20px',
                animationDelay: `${i * 0.1}s`,
              }}
            >
              {['✨', '💚', '✓', '♥'][i % 4]}
            </div>
          ))}
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center pt-16">
        {/* Medical-Themed Logo */}
        <div className="relative mb-6">
          {/* Outer Pulse Ring */}
          <div className="absolute inset-[-20px] rounded-full border border-primary/20 animate-pulse" />
          <div className="absolute inset-[-30px] rounded-full border border-bond-blue/10 animate-pulse" style={{ animationDelay: '0.5s' }} />

          {/* DNA Helix Particles */}
          <div className="absolute inset-[-15px]">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-primary/60 rounded-full animate-orbit"
                style={{
                  animationDuration: '4s',
                  animationDelay: `${i * 1}s`,
                  top: '50%',
                  left: '50%',
                  transformOrigin: `0 ${45 + i * 5}px`,
                }}
              />
            ))}
          </div>

          {/* Main Logo - Medical Icon */}
          <div
            className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/30 to-bond-blue/20 flex items-center justify-center border-2 border-primary/40 shadow-[0_0_40px_rgba(54,226,123,0.3)] transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
            style={{ transform: `scale(${pulseScale})` }}
          >
            <span className="material-symbols-outlined text-5xl text-primary drop-shadow-[0_0_15px_rgba(54,226,123,0.8)]">
              genetics
            </span>
          </div>

          {/* Health Status Badge */}
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-primary to-green-600 rounded-full flex items-center justify-center border-2 border-white/20 shadow-lg">
            <span className="material-symbols-outlined text-white text-sm">check</span>
          </div>
        </div>

        {/* Brand Name */}
        <h1 className="text-3xl font-bold text-white tracking-tight mb-1">
          Chroma<span className="text-primary">Pilot</span>
        </h1>
        <p className="text-white/50 text-sm mb-8 tracking-wide">
          Phenotype Calibration System
        </p>

        {isLoading ? (
          /* Loading State */
          <div className="flex flex-col items-center gap-4 w-full max-w-xs">
            <div className="flex items-center gap-2 text-primary/80">
              <span className="material-symbols-outlined text-lg animate-spin">sync</span>
              <span className="text-sm font-medium tracking-wider uppercase">
                Securing Connection...
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full relative">
              <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden border border-white/10">
                <div
                  className="h-full bg-gradient-to-r from-primary to-bond-blue rounded-full transition-all duration-100 shadow-[0_0_10px_rgba(54,226,123,0.5)]"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white text-xs font-bold drop-shadow-lg">{progress}%</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-white/40 text-xs">
              <span className="material-symbols-outlined text-sm animate-pulse">encrypted</span>
              <span>Encrypting Health Data...</span>
            </div>
          </div>
        ) : (
          /* Ready State */
          <div className="flex flex-col items-center gap-5 w-full max-w-xs animate-fadeIn">
            {/* Connection Secured */}
            <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/30">
              <span className="material-symbols-outlined text-primary text-lg">verified</span>
              <span className="text-sm font-medium text-primary tracking-wide">
                Connection Secured
              </span>
            </div>

            {/* Start Button */}
            <SpringButton
              onClick={handleStart}
              size="lg"
              className="w-full flex items-center justify-center gap-3"
            >
              <span className="material-symbols-outlined">play_arrow</span>
              <span>Begin Calibration</span>
            </SpringButton>

            {/* Quest Info */}
            <div className="flex items-center justify-center gap-4 text-white/50 text-xs">
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">quiz</span>
                <span>30 Questions</span>
              </div>
              <div className="w-1 h-1 bg-white/30 rounded-full" />
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">workspace_premium</span>
                <span>3 Badges</span>
              </div>
              <div className="w-1 h-1 bg-white/30 rounded-full" />
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">stars</span>
                <span>500 XP</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Status */}
      <div className="absolute bottom-6 left-0 right-0 px-6">
        <div className="flex items-center justify-center gap-2 text-white/30 text-[10px]">
          <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          <span className="font-mono tracking-widest">ZERO-FRICTION HANDSHAKE</span>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
