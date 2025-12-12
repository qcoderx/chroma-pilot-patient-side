import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CollisionAlert: React.FC = () => {
  const navigate = useNavigate();
  const [sliderValue, setSliderValue] = useState(0);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = parseInt(e.target.value);
    setSliderValue(newVal);
    if (newVal > 95) {
      navigate('/stabilized');
    }
  };

  const handleSliderEnd = () => {
    if (sliderValue <= 95) {
      // Snap back if not completed
      setSliderValue(0);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-between pb-6 pt-safe overflow-hidden bg-deep-indigo">
      {/* Background FX */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#36e27b 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-mutation-magenta/20 rounded-full blur-[100px] mix-blend-screen"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-biolum-cyan/10 rounded-full blur-[80px] mix-blend-screen"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0),rgba(255,255,255,0)_50%,rgba(0,0,0,0.2)_50%,rgba(0,0,0,0.2))] bg-[length:100%_4px] pointer-events-none z-10 opacity-20"></div>
      </div>

      {/* Header */}
      <div className="relative w-full z-20 px-6 pt-6 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-mutation-magenta animate-pulse">
            <span className="material-symbols-outlined text-[28px]">warning</span>
          </div>
          <div className="flex-1 text-center">
            <h2 className="text-mutation-magenta text-sm font-bold tracking-[0.2em] glitch-text" data-text="INTERACTION DETECTED">
              INTERACTION DETECTED
            </h2>
          </div>
          <button onClick={() => navigate('/')} className="flex size-10 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white backdrop-blur-md active:scale-95 transition-transform">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
      </div>

      {/* Central Visual */}
      <div className="relative z-10 w-full flex-1 flex flex-col items-center justify-center px-4 -mt-10">
        <div className="relative w-64 h-64 mb-8">
          <div className="absolute inset-0 rounded-full border border-mutation-magenta/30 border-dashed animate-spin-slow"></div>
          <div className="absolute inset-4 rounded-full border border-biolum-cyan/20 animate-spin-reverse"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-full rounded-full overflow-hidden bg-gradient-to-b from-deep-indigo to-mutation-magenta/20 relative border border-white/10 shadow-neon-magenta">
              <img 
                className="w-full h-full object-cover mix-blend-luminosity opacity-80" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdtbekbbaGHCAxI8SKq8tfDaxAON2Yfw12tCTR_tL9xzemWkX19LpRtbExEjZz1O21Z4hxwd8ZDuKilK2mUD3PH1sYP3D5l3opUsYUHQV7GQtaoccsMMJNvOLqRITXV3VK4uzpCXnbUx4CIEaSiFryEvVytOqgtkExphLkhB3J_JzNKQLO5wkZaXOZNqC1IgTw_kcK3ZK2QfdevPHoreFQhJMfftmY2ZtapW-JQDX239krjW1msLLVXdNtRbTzHxuDGMUiJiKRwK8" 
                style={{ filter: 'contrast(1.2) brightness(1.1) hue-rotate(0deg)' }}
                alt="Bio Scan"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-mutation-magenta/40 via-transparent to-biolum-cyan/10 mix-blend-overlay"></div>
            </div>
          </div>
          <div className="absolute -right-4 top-10 bg-deep-indigo border border-mutation-magenta text-mutation-magenta px-3 py-1 rounded-sm text-[10px] font-mono tracking-widest shadow-neon-magenta animate-pulse">
            ADRENAL_FAIL
          </div>
        </div>

        <div className="w-full max-w-xs text-center mb-8 relative">
          <p className="text-biolum-cyan text-xs font-mono tracking-widest mb-1 opacity-80">STRESS TELEMETRY</p>
          <div className="flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-mutation-magenta animate-bounce text-xl">arrow_upward</span>
            <h1 className="text-6xl font-bold text-white tracking-tighter drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
              140<span className="text-2xl text-white/50">%</span>
            </h1>
          </div>
          <p className="text-mutation-magenta font-bold tracking-wide mt-1 drop-shadow-[0_0_8px_rgba(255,42,0,0.8)]">CORTISOL SPIKE</p>
          
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mutation-magenta/10 border border-mutation-magenta/30">
            <span className="w-2 h-2 rounded-full bg-mutation-magenta animate-ping"></span>
            <span className="text-[10px] text-mutation-magenta font-bold uppercase tracking-widest">Notifying Care Provider...</span>
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="relative z-20 w-full px-4 mb-4">
        <div className="glass-panel rounded-[2.5rem] p-6 w-full shadow-[0_0_30px_rgba(255,42,0,0.15)] flex flex-col gap-6 relative overflow-hidden group border-mutation-magenta/30">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[2px] bg-gradient-to-r from-transparent via-mutation-magenta to-transparent shadow-[0_0_10px_#FF2A00]"></div>
          
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-biolum-cyan text-xs font-bold tracking-widest mb-1">CLINICAL ALERT</p>
                <h3 className="text-white text-xl font-bold leading-tight">Adrenal Overload Imminent</h3>
              </div>
              <span className="material-symbols-outlined text-mutation-magenta animate-pulse text-[32px]">ecg_heart</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed border-l-2 border-mutation-magenta/50 pl-3">
              Telemetry mismatch with baseline. Stress exceeds tolerance by <span className="text-white font-bold">45%</span>.
            </p>
            <div className="bg-white/5 rounded-xl p-3 flex items-center gap-3 border border-white/5">
              <span className="material-symbols-outlined text-biolum-cyan">self_improvement</span>
              <p className="text-sm text-white font-medium">Auto-Protocol: Engage breathing.</p>
            </div>
          </div>

          {/* Slider */}
          <div className="relative w-full h-16 bg-black/40 rounded-full border border-white/10 p-1 flex items-center overflow-hidden shadow-inner">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
              <span className="text-white/40 text-sm font-bold tracking-[0.2em] animate-pulse">SLIDE TO STABILIZE</span>
              <div className="absolute right-6 opacity-30 flex">
                <span className="material-symbols-outlined text-white">chevron_right</span>
                <span className="material-symbols-outlined text-white -ml-3">chevron_right</span>
                <span className="material-symbols-outlined text-white -ml-3">chevron_right</span>
              </div>
            </div>
            
            {/* Draggable Button represented by Range Thumb */}
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={sliderValue} 
              onChange={handleSliderChange}
              onTouchEnd={handleSliderEnd}
              onMouseUp={handleSliderEnd}
              className="absolute inset-0 z-20 w-full h-full opacity-0 cursor-pointer" 
            />
            
            {/* Visual Thumb Follower */}
            <div 
              className="h-14 aspect-square rounded-full bg-gradient-to-br from-mutation-magenta to-[#b30000] shadow-[0_0_15px_rgba(255,42,0,0.6)] z-10 flex items-center justify-center pointer-events-none border border-white/20 absolute left-1 transition-transform duration-75 ease-linear"
              style={{ transform: `translateX(calc(${sliderValue}% * ${ (window.innerWidth - 80) / 100 } / 1.4))` }} // Approximate calc for responsiveness
            >
              <span className="material-symbols-outlined text-white font-bold">fingerprint</span>
            </div>
            
            {/* Progress Fill */}
            <div 
              className="absolute left-0 top-0 bottom-0 bg-mutation-magenta/20 z-0 transition-all duration-75 ease-linear rounded-l-full"
              style={{ width: `${sliderValue}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollisionAlert;