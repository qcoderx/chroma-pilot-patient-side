import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveOnboardingState, loadOnboardingState, clearOnboardingState } from '../utils/indexedDB';
import DNAHelix from '../components/DNAHelix';
import { StreakFire, XPPopup, ComboMeter, ParticleBurst } from '../components/MicroInteractions';

// Question types
type QuestionType = 'boolean' | 'slider' | 'choice';

interface Question {
  id: number;
  text: string;
  type: QuestionType;
  module: 1 | 2 | 3;
  critical?: boolean;
  choices?: string[];
  sliderConfig?: {
    min: number;
    max: number;
    unit: string;
    step: number;
  };
}

const questions: Question[] = [
  // Module 1: The Safety Shield (Medication Safety) - GREEN
  { id: 1, text: "Are you currently taking any prescription medications?", type: 'boolean', module: 1 },
  { id: 2, text: "Have you experienced any allergic reactions to medications?", type: 'boolean', module: 1, critical: true },
  { id: 3, text: "Are you taking blood thinners or anticoagulants?", type: 'boolean', module: 1, critical: true },
  { id: 4, text: "Do you use any over-the-counter supplements daily?", type: 'boolean', module: 1 },
  { id: 5, text: "Have you had adverse reactions to anesthesia?", type: 'boolean', module: 1, critical: true },
  { id: 6, text: "Are you currently using any herbal remedies?", type: 'boolean', module: 1 },
  { id: 7, text: "Do you take medications for chronic conditions?", type: 'boolean', module: 1 },
  { id: 8, text: "Have you ever been hospitalized for a drug reaction?", type: 'boolean', module: 1, critical: true },
  { id: 9, text: "Are you taking any medications that affect your heart rhythm?", type: 'boolean', module: 1, critical: true },
  { id: 10, text: "Do you require any injectable medications?", type: 'boolean', module: 1 },

  // Module 2: The Ancestral Radar (Family History) - BLUE
  { id: 11, text: "Has anyone in your family had sudden death before age 50?", type: 'boolean', module: 2, critical: true },
  { id: 12, text: "Is there a history of Sickle Cell disease in your family?", type: 'boolean', module: 2, critical: true },
  { id: 13, text: "Does your family have a history of heart disease?", type: 'boolean', module: 2 },
  { id: 14, text: "Is there Type 2 Diabetes in your immediate family?", type: 'boolean', module: 2 },
  { id: 15, text: "Has anyone in your family had a stroke before age 60?", type: 'boolean', module: 2, critical: true },
  { id: 16, text: "Is there a history of cancer in your family?", type: 'boolean', module: 2 },
  { id: 17, text: "Does your family have a history of mental health conditions?", type: 'boolean', module: 2 },
  { id: 18, text: "Are there any hereditary blood disorders in your family?", type: 'boolean', module: 2, critical: true },
  { id: 19, text: "Does your family have a history of autoimmune diseases?", type: 'boolean', module: 2 },
  { id: 20, text: "Is there a history of kidney disease in your family?", type: 'boolean', module: 2 },

  // Module 3: The Live Context (Lifestyle/Environment) - AMBER
  { id: 21, text: "How many cups of coffee do you drink daily?", type: 'slider', module: 3, sliderConfig: { min: 0, max: 10, unit: 'cups', step: 1 } },
  { id: 22, text: "How many units of alcohol do you consume weekly?", type: 'slider', module: 3, sliderConfig: { min: 0, max: 30, unit: 'units', step: 1 } },
  { id: 23, text: "How many glasses of water do you drink daily?", type: 'slider', module: 3, sliderConfig: { min: 0, max: 15, unit: 'glasses', step: 1 } },
  { id: 24, text: "How many hours of sleep do you get on average?", type: 'slider', module: 3, sliderConfig: { min: 0, max: 12, unit: 'hours', step: 0.5 } },
  { id: 25, text: "Do you smoke or use tobacco products?", type: 'boolean', module: 3 },
  { id: 26, text: "How many hours do you exercise per week?", type: 'slider', module: 3, sliderConfig: { min: 0, max: 20, unit: 'hours', step: 0.5 } },
  { id: 27, text: "What is your current stress level?", type: 'choice', module: 3, choices: ['Low', 'Moderate', 'High', 'Very High'] },
  { id: 28, text: "Do you work in an environment with chemical exposure?", type: 'boolean', module: 3 },
  { id: 29, text: "How many hours do you spend outdoors daily?", type: 'slider', module: 3, sliderConfig: { min: 0, max: 12, unit: 'hours', step: 0.5 } },
  { id: 30, text: "What best describes your diet?", type: 'choice', module: 3, choices: ['Plant-Based', 'Balanced', 'High-Protein', 'No Restrictions'] },
];

const moduleInfo = {
  1: { name: 'Safety Shield', color: 'primary', icon: 'medication', description: 'Medication Safety' },
  2: { name: 'Heritage Scan', color: 'bond-blue', icon: 'family_restroom', description: 'Family History' },
  3: { name: 'Lifestyle Profile', color: 'amber-500', icon: 'self_improvement', description: 'Lifestyle & Environment' },
};

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [showCriticalOverlay, setShowCriticalOverlay] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [savedState, setSavedState] = useState<{ currentIndex: number; answers: Record<number, any> } | null>(null);

  // Gamification state
  const [streak, setStreak] = useState(0);
  const [combo, setCombo] = useState(0);
  const [comboTimer, setComboTimer] = useState(100);
  const [showXPPopup, setShowXPPopup] = useState(false);
  const [lastXPEarned, setLastXPEarned] = useState(0);
  const [showParticleBurst, setShowParticleBurst] = useState(false);
  const [totalXP, setTotalXP] = useState(0);
  const comboTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const comboIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentQuestion = questions[currentIndex];
  const currentModule = moduleInfo[currentQuestion.module];
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const moduleProgress = ((currentIndex % 10) + 1) / 10 * 100;

  // Combo multiplier calculation
  const getMultiplier = () => Math.min(combo + 1, 5);

  // Start combo timer
  const startComboTimer = useCallback(() => {
    // Clear existing timers
    if (comboTimeoutRef.current) clearTimeout(comboTimeoutRef.current);
    if (comboIntervalRef.current) clearInterval(comboIntervalRef.current);

    setComboTimer(100);

    // Countdown interval
    comboIntervalRef.current = setInterval(() => {
      setComboTimer((prev) => {
        if (prev <= 0) {
          if (comboIntervalRef.current) clearInterval(comboIntervalRef.current);
          return 0;
        }
        return prev - 2;
      });
    }, 100);

    // Timeout to reset combo
    comboTimeoutRef.current = setTimeout(() => {
      setCombo(0);
      setComboTimer(100);
      if (comboIntervalRef.current) clearInterval(comboIntervalRef.current);
    }, 5000);
  }, []);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (comboTimeoutRef.current) clearTimeout(comboTimeoutRef.current);
      if (comboIntervalRef.current) clearInterval(comboIntervalRef.current);
    };
  }, []);

  // Load saved state on mount
  useEffect(() => {
    const loadState = async () => {
      try {
        const state = await loadOnboardingState();
        if (state && state.currentIndex > 0) {
          setSavedState({ currentIndex: state.currentIndex, answers: state.answers });
          setShowResumeModal(true);
        }
      } catch (error) {
        console.error('Failed to load saved state:', error);
      }
      setIsLoading(false);
    };
    loadState();
  }, []);

  // Save state whenever answers change
  const saveState = useCallback(async (index: number, currentAnswers: Record<number, any>) => {
    try {
      await saveOnboardingState({
        currentIndex: index,
        answers: currentAnswers,
        xpEarned: index * 15,
        lastUpdated: Date.now(),
      });
    } catch (error) {
      console.error('Failed to save state:', error);
    }
  }, []);

  // Handle resume from saved state
  const handleResume = () => {
    if (savedState) {
      setCurrentIndex(savedState.currentIndex);
      setAnswers(savedState.answers);
    }
    setShowResumeModal(false);
  };

  // Handle start fresh
  const handleStartFresh = async () => {
    await clearOnboardingState();
    setCurrentIndex(0);
    setAnswers({});
    setShowResumeModal(false);
  };

  // Reset slider when question changes
  useEffect(() => {
    if (currentQuestion.type === 'slider' && currentQuestion.sliderConfig) {
      setSliderValue(currentQuestion.sliderConfig.min);
    }
  }, [currentIndex]);

  const triggerHaptic = (type: 'light' | 'medium' | 'heavy' | 'combo' = 'light') => {
    if (navigator.vibrate) {
      const patterns = {
        light: 30,
        medium: 50,
        heavy: 100,
        combo: [30, 20, 50, 20, 70], // Escalating pattern for combos
      };
      navigator.vibrate(patterns[type]);
    }
  };

  const handleAnswer = (answer: any) => {
    // Increment streak and combo
    setStreak((prev) => prev + 1);
    setCombo((prev) => Math.min(prev + 1, 4)); // Max combo of 5x
    startComboTimer();

    // Calculate XP with multiplier
    const baseXP = 15;
    const multiplier = getMultiplier();
    const earnedXP = baseXP * multiplier;
    setLastXPEarned(earnedXP);
    setTotalXP((prev) => prev + earnedXP);

    // Show effects
    setShowXPPopup(true);
    setShowParticleBurst(true);

    // Haptic feedback based on combo
    triggerHaptic(multiplier >= 3 ? 'combo' : 'medium');

    const newAnswers = { ...answers, [currentQuestion.id]: answer };
    setAnswers(newAnswers);

    // Save state to IndexedDB
    saveState(currentIndex, newAnswers);

    // Check for critical question with YES answer
    if (currentQuestion.critical && answer === true) {
      setShowCriticalOverlay(true);
      setTimeout(() => {
        setShowCriticalOverlay(false);
        proceedToNext();
      }, 1500);
    } else {
      proceedToNext();
    }
  };

  const proceedToNext = async () => {
    setIsTransitioning(true);
    setTimeout(async () => {
      if (currentIndex < questions.length - 1) {
        const nextIndex = currentIndex + 1;
        setCurrentIndex(nextIndex);
        // Save the new index
        saveState(nextIndex, answers);
      } else {
        // Clear saved state when completing onboarding
        await clearOnboardingState();
        navigate('/complete');
      }
      setIsTransitioning(false);
    }, 300);
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      triggerHaptic('light');
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex(currentIndex - 1);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const getModuleColor = () => {
    switch (currentQuestion.module) {
      case 1: return { bg: 'from-primary/20', border: 'border-primary', text: 'text-primary', glow: 'shadow-[0_0_30px_rgba(54,226,123,0.2)]' };
      case 2: return { bg: 'from-bond-blue/20', border: 'border-bond-blue', text: 'text-bond-blue', glow: 'shadow-[0_0_30px_rgba(0,194,255,0.2)]' };
      case 3: return { bg: 'from-amber-500/20', border: 'border-amber-500', text: 'text-amber-500', glow: 'shadow-[0_0_30px_rgba(245,158,11,0.2)]' };
    }
  };

  const colors = getModuleColor();

  // Calculate XP earned so far (use totalXP if available, otherwise estimate)
  const xpEarned = totalXP > 0 ? totalXP : currentIndex * 15;

  // Get module color for DNA helix
  const getDNAModuleColor = (): 'primary' | 'bond-blue' | 'amber' => {
    switch (currentQuestion.module) {
      case 1: return 'primary';
      case 2: return 'bond-blue';
      case 3: return 'amber';
    }
  };

  // Loading screen
  if (isLoading) {
    return (
      <div className="relative min-h-full w-full flex flex-col items-center justify-center bg-black">
        <div className="w-12 h-12 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        <p className="text-white/60 text-sm mt-4">Loading your progress...</p>
      </div>
    );
  }

  // Resume modal
  if (showResumeModal && savedState) {
    return (
      <div className="relative min-h-full w-full flex flex-col items-center justify-center bg-black p-6">
        {/* DNA Helix Background */}
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <DNAHelix progress={(savedState.currentIndex / questions.length) * 100} moduleColor="primary" intensity="low" />
        </div>

        <div className="relative z-10 flex flex-col items-center text-center max-w-sm">
          {/* Icon */}
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-bond-blue/20 border border-primary/30 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(54,226,123,0.2)]">
            <span className="material-symbols-outlined text-4xl text-primary">bookmark</span>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-white mb-2">Welcome Back!</h2>
          <p className="text-white/60 text-sm mb-6">
            You were at <span className="text-primary font-bold">Question {savedState.currentIndex + 1}</span> of {questions.length}
          </p>

          {/* Progress Preview */}
          <div className="w-full p-4 rounded-xl bg-white/5 border border-white/10 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/60 text-xs">Progress Saved</span>
              <span className="text-primary text-xs font-bold">{Math.round((savedState.currentIndex / questions.length) * 100)}%</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-bond-blue rounded-full"
                style={{ width: `${(savedState.currentIndex / questions.length) * 100}%` }}
              />
            </div>
            <p className="text-white/40 text-[10px] mt-2">
              XP Earned: <span className="text-amber-400">{savedState.currentIndex * 15} XP</span>
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col w-full gap-3">
            <button
              onClick={handleResume}
              className="w-full py-4 rounded-2xl font-bold text-lg bg-gradient-to-r from-primary to-green-400 text-black flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined">play_arrow</span>
              Continue from Q{savedState.currentIndex + 1}
            </button>
            <button
              onClick={handleStartFresh}
              className="w-full py-3 rounded-xl font-medium text-white/70 bg-white/5 border border-white/10 hover:bg-white/10 transition-all active:scale-95"
            >
              Start Over
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-full w-full flex flex-col bg-black overflow-hidden">
      {/* DNA Helix Background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <DNAHelix progress={progress} moduleColor={getDNAModuleColor()} intensity="medium" />
      </div>

      {/* Subtle Background Overlay */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-gradient-to-b ${colors.bg} to-transparent rounded-full blur-[100px] opacity-40`} />
      </div>

      {/* Critical Alert Overlay */}
      {showCriticalOverlay && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm animate-fadeIn">
          <div className="flex flex-col items-center gap-4 p-8 rounded-3xl bg-bond-blue/10 border border-bond-blue/30">
            <span className="material-symbols-outlined text-5xl text-bond-blue animate-pulse">flag</span>
            <p className="text-bond-blue font-bold text-center text-lg">
              Important Flag Detected
            </p>
            <p className="text-white/60 text-sm text-center">
              We will notify your care provider
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="relative z-20 px-4 pt-4 pb-2">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={handleBack}
            disabled={currentIndex === 0}
            className={`flex items-center justify-center w-9 h-9 rounded-full bg-white/5 border border-white/10 transition-all ${currentIndex === 0 ? 'opacity-30' : 'active:scale-95'}`}
          >
            <span className="material-symbols-outlined text-white/70 text-lg">arrow_back</span>
          </button>

          {/* Streak & Combo */}
          <div className="flex items-center gap-3">
            {streak >= 2 && (
              <StreakFire streak={streak} className="animate-popIn" />
            )}
            {combo > 0 && (
              <ComboMeter combo={combo} timeLeft={comboTimer} className="animate-popIn" />
            )}
          </div>

          {/* XP Counter */}
          <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
            <span className="material-symbols-outlined text-primary text-sm">stars</span>
            <span className="text-primary font-bold text-sm">{xpEarned} XP</span>
          </div>
        </div>

        {/* Question Counter */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="flex items-center gap-1 px-3 py-1 bg-white/5 rounded-full border border-white/10">
            <span className="text-white/70 text-sm font-mono">{currentIndex + 1}</span>
            <span className="text-white/30 text-sm">/</span>
            <span className="text-white/50 text-sm font-mono">{questions.length}</span>
          </div>
        </div>

        {/* Module Badge with Medical Icon */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className={`material-symbols-outlined ${colors.text} text-lg`}>{currentModule.icon}</span>
          <span className={`text-xs font-bold uppercase tracking-wider ${colors.text}`}>
            {currentModule.name}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="relative mb-2">
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${currentQuestion.module === 1 ? 'from-primary to-green-400' : currentQuestion.module === 2 ? 'from-bond-blue to-cyan-400' : 'from-amber-500 to-yellow-400'} rounded-full transition-all duration-500`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Module Progress Dots */}
        <div className="flex justify-center gap-3">
          {[1, 2, 3].map((m) => (
            <div key={m} className="flex items-center gap-1">
              <span className={`material-symbols-outlined text-sm ${m < currentQuestion.module ? 'text-white/40' : m === currentQuestion.module ? (m === 1 ? 'text-primary' : m === 2 ? 'text-bond-blue' : 'text-amber-500') : 'text-white/20'}`}>
                {m === 1 ? 'medication' : m === 2 ? 'family_restroom' : 'self_improvement'}
              </span>
              <div className="flex gap-0.5">
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-1 h-1 rounded-full transition-all ${m < currentQuestion.module ? 'bg-white/30' :
                      m === currentQuestion.module && i < (currentIndex % 10) + 1 ? (m === 1 ? 'bg-primary' : m === 2 ? 'bg-bond-blue' : 'bg-amber-500') :
                        'bg-white/10'
                      }`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </header>

      {/* Question Content */}
      <main className={`relative z-10 flex-1 flex flex-col items-center justify-center px-5 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${isTransitioning ? 'opacity-0 translate-x-8 scale-95' : 'opacity-100 translate-x-0 scale-100'}`}>
        {/* XP Popup */}
        {showXPPopup && (
          <XPPopup
            amount={15}
            multiplier={getMultiplier()}
            onComplete={() => setShowXPPopup(false)}
          />
        )}

        {/* Particle Burst Effect */}
        <ParticleBurst
          active={showParticleBurst}
          color={currentQuestion.module === 1 ? '#36e27b' : currentQuestion.module === 2 ? '#00C2FF' : '#f59e0b'}
          onComplete={() => setShowParticleBurst(false)}
        />

        {/* Quest Number Badge - Enhanced Medical Design */}
        <div className={`relative mb-6`}>
          {/* Animated Pulse Rings */}
          <div className="absolute inset-[-16px] rounded-full border border-white/5 animate-pulse" />
          <div className={`absolute inset-[-8px] rounded-full ${colors.border} border opacity-30 animate-pulse`} style={{ animationDelay: '0.3s' }} />

          {/* Main Quest Badge */}
          <div className={`relative w-24 h-24 rounded-full bg-gradient-to-br ${colors.bg} via-black/80 to-black flex flex-col items-center justify-center ${colors.border} border-2 ${colors.glow}`}>
            {/* Glow effect */}
            <div className={`absolute inset-0 rounded-full ${colors.glow} animate-pulse`} />

            {/* Medical Module Icon */}
            <span className={`material-symbols-outlined text-3xl ${colors.text} drop-shadow-lg mb-1`}>
              {currentModule.icon}
            </span>

            {/* Quest Number Display */}
            <div className="flex items-baseline gap-0.5">
              <span className="text-white/40 text-[10px] font-bold uppercase">Q</span>
              <span className={`text-2xl font-black ${colors.text} drop-shadow-[0_0_10px_currentColor]`}>
                {currentIndex + 1}
              </span>
              <span className="text-white/30 text-[10px]">/{questions.length}</span>
            </div>
          </div>

          {/* Module Progress Ring */}
          <svg className="absolute inset-[-4px] w-[calc(100%+8px)] h-[calc(100%+8px)]" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="3"
            />
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke={currentQuestion.module === 1 ? '#36e27b' : currentQuestion.module === 2 ? '#00C2FF' : '#f59e0b'}
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={`${moduleProgress * 2.89} 289`}
              transform="rotate(-90 50 50)"
              style={{ transition: 'stroke-dasharray 0.5s ease' }}
            />
          </svg>

          {/* Floating Particles */}
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-1.5 h-1.5 rounded-full ${currentQuestion.module === 1 ? 'bg-primary' : currentQuestion.module === 2 ? 'bg-bond-blue' : 'bg-amber-500'} animate-float opacity-60`}
              style={{
                top: `${20 + i * 30}%`,
                left: i % 2 === 0 ? '-8px' : 'auto',
                right: i % 2 !== 0 ? '-8px' : 'auto',
                animationDelay: `${i * 0.3}s`,
              }}
            />
          ))}
        </div>

        {/* Critical Badge */}
        {currentQuestion.critical && (
          <div className="flex items-center gap-1 px-3 py-1 bg-red-500/10 rounded-full border border-red-500/20 mb-3">
            <span className="material-symbols-outlined text-red-400 text-sm">priority_high</span>
            <span className="text-red-400 text-xs font-bold">Critical Question</span>
          </div>
        )}

        {/* Question Text */}
        <h2 className="text-xl font-bold text-white text-center leading-tight mb-8 max-w-sm">
          {currentQuestion.text}
        </h2>

        {/* Answer Options */}
        <div className="w-full max-w-sm">
          {currentQuestion.type === 'boolean' && (
            <div className="flex gap-4">
              {/* Yes Button */}
              <button
                onClick={() => handleAnswer(true)}
                className={`group flex-1 relative py-5 rounded-2xl font-bold text-lg transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.92] overflow-hidden
                  bg-gradient-to-br ${colors.bg} border-2 ${colors.border} hover:border-opacity-80
                  shadow-lg flex flex-col items-center gap-2`}
              >
                {/* Glow effect on hover */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity ${colors.glow}`} />

                {/* Icon with ring */}
                <div className={`relative w-12 h-12 rounded-full bg-white/5 flex items-center justify-center ${colors.border} border group-hover:scale-110 transition-transform duration-300`}>
                  <span className={`material-symbols-outlined text-2xl ${colors.text}`}>check_circle</span>
                </div>
                <span className={colors.text}>Yes</span>
                <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full transition-all duration-300 ${combo > 0 ? 'bg-amber-500/20 scale-105' : 'bg-white/5'}`}>
                  <span className="material-symbols-outlined text-xs text-primary">star</span>
                  <span className={`text-xs font-bold ${combo > 0 ? 'text-amber-400' : 'text-white/60'}`}>
                    +{15 * getMultiplier()} XP {combo > 0 && <span className="text-orange-400">({getMultiplier()}x)</span>}
                  </span>
                </div>
              </button>

              {/* No Button */}
              <button
                onClick={() => handleAnswer(false)}
                className="group flex-1 relative py-5 rounded-2xl font-bold text-lg transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.92] overflow-hidden
                  bg-white/5 border-2 border-white/20 hover:border-white/40 hover:bg-white/10
                  flex flex-col items-center gap-2"
              >
                {/* Icon with ring */}
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform duration-300">
                  <span className="material-symbols-outlined text-2xl text-white/70">cancel</span>
                </div>
                <span className="text-white/80">No</span>
                <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full transition-all duration-300 ${combo > 0 ? 'bg-amber-500/20 scale-105' : 'bg-white/5'}`}>
                  <span className="material-symbols-outlined text-xs text-primary">star</span>
                  <span className={`text-xs font-bold ${combo > 0 ? 'text-amber-400' : 'text-white/60'}`}>
                    +{15 * getMultiplier()} XP {combo > 0 && <span className="text-orange-400">({getMultiplier()}x)</span>}
                  </span>
                </div>
              </button>
            </div>
          )}

          {currentQuestion.type === 'slider' && currentQuestion.sliderConfig && (
            <div className="flex flex-col items-center gap-6">
              {/* Value Display - Enhanced */}
              <div className="relative">
                {/* Animated ring */}
                <div className={`absolute inset-[-8px] rounded-full border ${colors.border} opacity-30 animate-pulse`} />

                <div className={`relative w-32 h-32 rounded-full bg-gradient-to-br ${colors.bg} via-black/80 to-black ${colors.border} border-2 flex items-center justify-center ${colors.glow}`}>
                  {/* Inner glow */}
                  <div className={`absolute inset-2 rounded-full bg-black/30`} />

                  <div className="relative text-center">
                    <span className={`text-4xl font-black ${colors.text} drop-shadow-[0_0_15px_currentColor]`}>{sliderValue}</span>
                    <p className="text-white/60 text-xs font-medium mt-0.5">{currentQuestion.sliderConfig.unit}</p>
                  </div>
                </div>

                {/* Decorative particles */}
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className={`absolute w-1 h-1 rounded-full ${currentQuestion.module === 1 ? 'bg-primary' : currentQuestion.module === 2 ? 'bg-bond-blue' : 'bg-amber-500'} animate-float`}
                    style={{
                      top: `${25 + i * 20}%`,
                      left: i % 2 === 0 ? '-12px' : 'auto',
                      right: i % 2 !== 0 ? '-12px' : 'auto',
                      animationDelay: `${i * 0.2}s`,
                    }}
                  />
                ))}
              </div>

              {/* Slider Track - Enhanced */}
              <div className="w-full relative px-2">
                <div className="relative">
                  <input
                    type="range"
                    min={currentQuestion.sliderConfig.min}
                    max={currentQuestion.sliderConfig.max}
                    step={currentQuestion.sliderConfig.step}
                    value={sliderValue}
                    onChange={(e) => {
                      setSliderValue(parseFloat(e.target.value));
                      triggerHaptic('light');
                    }}
                    className="w-full h-3 bg-white/10 rounded-full appearance-none cursor-pointer
                      [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:h-7 
                      [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-[0_0_20px_rgba(255,255,255,0.5)]
                      [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white/20"
                    style={{
                      background: `linear-gradient(to right, ${currentQuestion.module === 1 ? '#36e27b' : currentQuestion.module === 2 ? '#00C2FF' : '#f59e0b'} 0%, ${currentQuestion.module === 1 ? '#36e27b' : currentQuestion.module === 2 ? '#00C2FF' : '#f59e0b'} ${((sliderValue - currentQuestion.sliderConfig.min) / (currentQuestion.sliderConfig.max - currentQuestion.sliderConfig.min)) * 100}%, rgba(255,255,255,0.1) ${((sliderValue - currentQuestion.sliderConfig.min) / (currentQuestion.sliderConfig.max - currentQuestion.sliderConfig.min)) * 100}%, rgba(255,255,255,0.1) 100%)`
                    }}
                  />
                </div>
                <div className="flex justify-between text-white/50 text-xs mt-3 font-medium">
                  <span>{currentQuestion.sliderConfig.min}</span>
                  <span className={`${colors.text} font-bold`}>Current: {sliderValue}</span>
                  <span>{currentQuestion.sliderConfig.max}</span>
                </div>
              </div>

              {/* Continue Button - Enhanced */}
              <button
                onClick={() => handleAnswer(sliderValue)}
                className={`group w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.92] 
                  bg-gradient-to-r ${currentQuestion.module === 1 ? 'from-primary to-green-400' : currentQuestion.module === 2 ? 'from-bond-blue to-cyan-400' : 'from-amber-500 to-yellow-400'} 
                  text-black flex items-center justify-center gap-3 shadow-lg relative overflow-hidden`}
              >
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

                <span className="relative font-black">Continue</span>
                <div className={`relative flex items-center gap-1 px-2 py-0.5 rounded-full ${combo > 0 ? 'bg-black/20' : 'bg-black/10'}`}>
                  <span className="material-symbols-outlined text-xs">star</span>
                  <span className="text-sm font-bold">+{15 * getMultiplier()} XP</span>
                  {combo > 0 && <span className="text-xs">({getMultiplier()}x)</span>}
                </div>
              </button>
            </div>
          )}

          {currentQuestion.type === 'choice' && currentQuestion.choices && (
            <div className="flex flex-col gap-3">
              {currentQuestion.choices.map((choice, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(choice)}
                  className={`group relative py-4 px-5 rounded-2xl font-medium transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.96] overflow-hidden
                    bg-gradient-to-br ${colors.bg} via-black/60 to-black border ${colors.border} hover:border-opacity-80
                    flex items-center justify-between`}
                >
                  {/* Hover glow effect */}
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity ${colors.glow}`} />

                  <div className="relative flex items-center gap-4">
                    {/* Letter Badge */}
                    <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${colors.border} border ${colors.text} text-base font-bold
                      group-hover:scale-110 transition-transform duration-300`}>
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span className="text-white/90 text-left">{choice}</span>
                  </div>

                  {/* Arrow indicator */}
                  <div className="relative flex items-center gap-2">
                    <span className={`text-xs font-bold ${combo > 0 ? 'text-amber-400' : colors.text} opacity-70`}>
                      +{15 * getMultiplier()} XP
                    </span>
                    <span className={`material-symbols-outlined ${colors.text} text-lg group-hover:translate-x-1 transition-transform`}>chevron_right</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-5 pb-4 pt-2">
        <div className="flex items-center justify-center gap-2 text-white/30 text-[10px]">
          <span className="material-symbols-outlined text-xs">touch_app</span>
          <span>Tap to answer • Auto-save enabled</span>
        </div>
      </footer>
    </div>
  );
};

export default Onboarding;
