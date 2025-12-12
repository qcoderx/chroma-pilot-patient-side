import React from 'react';
import { useNavigate } from 'react-router-dom';

const Settings: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-background-dark text-white font-display overflow-x-hidden antialiased min-h-screen pb-24">
      {/* Top App Bar */}
      <div className="sticky top-0 z-50 glass-panel border-b border-helix-violet/30 bg-[#0B0A12]/80 backdrop-blur-md">
        <div className="flex items-center px-4 py-3 justify-between max-w-md mx-auto">
          <button onClick={() => navigate(-1)} className="text-white/80 hover:text-bond-blue flex size-10 items-center justify-center rounded-full hover:bg-white/5 transition-colors">
            <span className="material-symbols-outlined text-2xl">arrow_back</span>
          </button>
          <h2 className="text-white text-lg font-bold tracking-tight flex-1 text-center">System Configuration</h2>
          <button onClick={() => navigate('/')} className="text-bond-blue hover:text-white flex size-12 items-center justify-center text-sm font-bold tracking-wide uppercase transition-colors">
            Done
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col max-w-md mx-auto min-h-screen relative pb-8">
        <div className="absolute top-0 left-0 w-full h-96 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-helix-violet/20 via-transparent to-transparent -z-10 pointer-events-none"></div>
        
        {/* Profile Header */}
        <div className="p-4 pt-6">
          <div className="glass-panel rounded-2xl p-5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-50">
              <span className="material-symbols-outlined text-bond-blue text-6xl opacity-10">fingerprint</span>
            </div>
            <div className="flex items-center gap-5 relative z-10">
              <div className="relative">
                <div className="size-20 rounded-full border-2 border-bond-blue/30 p-1">
                  <div className="w-full h-full rounded-full bg-cover bg-center" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAT9QpqRwmtG1usI7X19AoGQh0lE-FmHF-tba7GE9cK2xLfQklZKT7kFQocJUHdhSG47uMM9_iyq9vm6znNOAWs44POsiUCUnwwXtgvJVIT2aGuMR4CnBzONNJ7BH3i5yMrfGvm5XpP-yzQxsm_XH5cQBoPzkTpC0JS8D9esFVToxpLKDGPPU7xCOAWvhmhrSMXYgl1HEJEYIBws3jx9KUeqKURnV-OeLsADMVp9JVNFxnjykwbXpJsQ0-4uYVQHho0SqnpeswlELs")' }}></div>
                </div>
                <div className="absolute bottom-0 right-0 bg-green-500 size-3 rounded-full border-2 border-deep-indigo shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
              </div>
              <div className="flex flex-col justify-center">
                <h3 className="text-white text-xl font-bold leading-tight">Alex Helix</h3>
                <p className="text-bond-blue text-xs uppercase tracking-wider font-semibold mt-1">Bio-Status: Optimal</p>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className="animate-pulse size-1.5 rounded-full bg-bond-blue"></span>
                  <p className="text-white/60 text-xs">Clinical Engine: <span className="text-white">Active</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 1: Clinical Interoperability */}
        <div className="px-4 mt-2">
          <h3 className="text-white/90 text-sm font-bold uppercase tracking-wider px-1 pb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-bond-blue text-sm">share</span>
            Clinical Interoperability
          </h3>
          <div className="glass-panel rounded-xl overflow-hidden divide-y divide-white/5">
            <div className="flex items-center gap-4 p-4 hover:bg-white/5 transition-colors">
              <div className="flex items-center justify-center rounded-lg bg-white/5 border border-white/10 shrink-0 size-10">
                <span className="material-symbols-outlined text-white text-xl">account_circle</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium leading-tight truncate">Provider Access</p>
                <p className="text-bond-blue/70 text-xs mt-0.5 truncate">Dr. Chen (Primary Care)</p>
              </div>
              <div className="shrink-0">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-bond-blue shadow-[0_0_10px_rgba(0,204,255,0.4)]"></div>
                </label>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 hover:bg-white/5 transition-colors">
              <div className="flex items-center justify-center rounded-lg bg-white/5 border border-white/10 shrink-0 size-10">
                <span className="material-symbols-outlined text-white text-xl">description</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium leading-tight truncate">FHIR Record Sync</p>
                <p className="text-bond-blue/70 text-xs mt-0.5 truncate">Push genomic data to EHR</p>
              </div>
              <div className="shrink-0">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-bond-blue shadow-[0_0_10px_rgba(0,204,255,0.4)]"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Telemetry Input */}
        <div className="px-4 mt-8">
          <h3 className="text-white/90 text-sm font-bold uppercase tracking-wider px-1 pb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-bond-blue text-sm">monitor_heart</span>
            Real-Time Telemetry
          </h3>
          <div className="glass-panel rounded-xl overflow-hidden divide-y divide-white/5">
            <div className="flex items-center gap-4 p-4 hover:bg-white/5 transition-colors">
              <div className="flex items-center justify-center rounded-lg bg-white/5 border border-white/10 shrink-0 size-10">
                <span className="material-symbols-outlined text-white text-xl">favorite</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium leading-tight truncate">Apple HealthKit</p>
                <p className="text-bond-blue/70 text-xs mt-0.5 truncate">Biometric data bridge active</p>
              </div>
              <div className="shrink-0">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-bond-blue shadow-[0_0_10px_rgba(0,204,255,0.4)]"></div>
                </label>
              </div>
            </div>

            <button className="w-full flex items-center justify-between p-4 hover:bg-bond-blue/10 transition-colors group">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center rounded-lg bg-bond-blue/10 border border-bond-blue/20 shrink-0 size-10 group-hover:border-bond-blue/50 transition-colors">
                  <span className="material-symbols-outlined text-bond-blue text-xl">add_link</span>
                </div>
                <p className="text-bond-blue text-sm font-medium leading-tight">Connect External Device</p>
              </div>
              <span className="material-symbols-outlined text-bond-blue/50 text-lg">chevron_right</span>
            </button>
          </div>
        </div>

        {/* Section 3: Data Sovereignty */}
        <div className="px-4 mt-8">
          <h3 className="text-white/90 text-sm font-bold uppercase tracking-wider px-1 pb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-bond-blue text-sm">security</span>
            Data Sovereignty
          </h3>
          <div className="glass-panel rounded-xl overflow-hidden p-1">
            <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors text-left group">
              <div className="flex items-center justify-center size-9 rounded-md bg-helix-violet/20 text-helix-violet group-hover:bg-helix-violet group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-xl">download</span>
              </div>
              <div className="flex-1">
                <p className="text-white text-sm font-medium">Export VCF Data</p>
                <p className="text-white/40 text-xs">Raw Variant Call Format</p>
              </div>
              <span className="material-symbols-outlined text-white/30">chevron_right</span>
            </button>
          </div>
          <div className="mt-6 text-center">
            <a href="#" className="text-xs text-bond-blue/60 hover:text-bond-blue transition-colors underline decoration-bond-blue/30 underline-offset-4">Privacy Policy & Terms of Bio-Service</a>
            <p className="text-[10px] text-white/20 mt-2 font-mono">CHROMA-PILOT CLINICAL v2.4.1 [BUILD 8892]</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;