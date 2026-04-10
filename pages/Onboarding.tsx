import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveOnboardingState, loadOnboardingState, clearOnboardingState } from '../utils/indexedDB';
import { getPatientId, getUserId } from '../utils/auth';
import { runGene42Analysis, saveGene42Report } from '../utils/gene42';
import { MedicationEntry, runRiskAssessment, savePhenotypeAnswers } from '../utils/riskAssessment';
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
  // Module 1: The Safety Shield (Medication Safety)
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

  // Module 2: The Ancestral Radar (Family History)
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

  // Module 3: The Live Context (Lifestyle/Environment)
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
  2: { name: 'Heritage Scan', color: 'info', icon: 'family_restroom', description: 'Family History' },
  3: { name: 'Lifestyle Profile', color: 'warning', icon: 'self_improvement', description: 'Lifestyle & Environment' },
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
  const [medications, setMedications] = useState<MedicationEntry[]>([]);
  const [medicationDraft, setMedicationDraft] = useState<MedicationEntry>({ name: '', dose: '', frequency: '' });
  const [showMedicationCapture, setShowMedicationCapture] = useState(false);
  const [pendingAnswers, setPendingAnswers] = useState<Record<number, any> | null>(null);
  const [medicationFormError, setMedicationFormError] = useState<string | null>(null);
  const [isFinalizingSubmission, setIsFinalizingSubmission] = useState(false);

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

  const getMultiplier = () => Math.min(combo + 1, 5);

  const startComboTimer = useCallback(() => {
    if (comboTimeoutRef.current) clearTimeout(comboTimeoutRef.current);
    if (comboIntervalRef.current) clearInterval(comboIntervalRef.current);

    setComboTimer(100);

    comboIntervalRef.current = setInterval(() => {
      setComboTimer((prev) => {
        if (prev <= 0) {
          if (comboIntervalRef.current) clearInterval(comboIntervalRef.current);
          return 0;
        }
        return prev - 2;
      });
    }, 100);

    comboTimeoutRef.current = setTimeout(() => {
      setCombo(0);
      setComboTimer(100);
      if (comboIntervalRef.current) clearInterval(comboIntervalRef.current);
    }, 5000);
  }, []);

  useEffect(() => {
    return () => {
      if (comboTimeoutRef.current) clearTimeout(comboTimeoutRef.current);
      if (comboIntervalRef.current) clearInterval(comboIntervalRef.current);
    };
  }, []);

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

  const handleResume = () => {
    if (savedState) {
      setCurrentIndex(savedState.currentIndex);
      setAnswers(savedState.answers);
    }
    setShowResumeModal(false);
  };

  const handleStartFresh = async () => {
    await clearOnboardingState();
    setCurrentIndex(0);
    setAnswers({});
    setMedications([]);
    setMedicationDraft({ name: '', dose: '', frequency: '' });
    setShowResumeModal(false);
  };

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
        combo: [30, 20, 50, 20, 70],
      };
      navigator.vibrate(patterns[type]);
    }
  };

  const addMedication = () => {
    const cleanName = medicationDraft.name.trim();
    const cleanDose = medicationDraft.dose.trim();
    const cleanFrequency = medicationDraft.frequency.trim();

    if (!cleanName || !cleanDose || !cleanFrequency) {
      setMedicationFormError('Add medication name, dose, and frequency.');
      return;
    }

    setMedications((prev) => [
      ...prev,
      { name: cleanName, dose: cleanDose, frequency: cleanFrequency },
    ]);
    setMedicationDraft({ name: '', dose: '', frequency: '' });
    setMedicationFormError(null);
  };

  const removeMedication = (index: number) => {
    setMedications((prev) => prev.filter((_, i) => i !== index));
  };

  const continueAfterMedicationCapture = () => {
    if (medications.length === 0) {
      setMedicationFormError('At least one medication is required to run risk assessment.');
      return;
    }

    if (pendingAnswers) {
      const latest = pendingAnswers;
      setPendingAnswers(null);
      setShowMedicationCapture(false);
      setMedicationFormError(null);
      proceedToNext(latest);
    }
  };

  const handleAnswer = (answer: any) => {
    setStreak((prev) => prev + 1);
    setCombo((prev) => Math.min(prev + 1, 4));
    startComboTimer();

    const baseXP = 15;
    const multiplier = getMultiplier();
    const earnedXP = baseXP * multiplier;
    setLastXPEarned(earnedXP);
    setTotalXP((prev) => prev + earnedXP);

    setShowXPPopup(true);
    setShowParticleBurst(true);

    triggerHaptic(multiplier >= 3 ? 'combo' : 'medium');

    const newAnswers = { ...answers, [currentQuestion.id]: answer };
    setAnswers(newAnswers);
    saveState(currentIndex, newAnswers);

    if (currentQuestion.id === 1 && answer === true) {
      setPendingAnswers(newAnswers);
      setShowMedicationCapture(true);
      setMedicationFormError(null);
      return;
    }

    if (currentQuestion.id === 1 && answer === false) {
      setMedications([]);
    }

    if (currentQuestion.critical && answer === true) {
      setShowCriticalOverlay(true);
      setTimeout(() => {
        setShowCriticalOverlay(false);
        proceedToNext(newAnswers);
      }, 1500);
    } else {
      proceedToNext(newAnswers);
    }
  };

  const proceedToNext = async (latestAnswers: Record<number, any>) => {
    setIsTransitioning(true);
    setTimeout(async () => {
      if (currentIndex < questions.length - 1) {
        const nextIndex = currentIndex + 1;
        setCurrentIndex(nextIndex);
        saveState(nextIndex, latestAnswers);
      } else {
        if (latestAnswers[1] === true && medications.length === 0) {
          setPendingAnswers(latestAnswers);
          setShowMedicationCapture(true);
          setMedicationFormError('Add medications to run the risk assessment.');
          setIsTransitioning(false);
          return;
        }

        setIsFinalizingSubmission(true);
        const patientId = getPatientId() || getUserId() || 'demo-patient';

        savePhenotypeAnswers(questions, latestAnswers, patientId, medications);

        if (medications.length > 0) {
          try {
            await runRiskAssessment(patientId, medications);
          } catch (error) {
            console.error('Risk assessment request failed:', error);
          }
        }

        const report = runGene42Analysis(questions, latestAnswers, patientId);
        saveGene42Report(report);
        await clearOnboardingState();
        setIsFinalizingSubmission(false);
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
      case 1: return { bg: 'from-primary/10', border: 'border-primary', text: 'text-primary', glow: 'shadow-primary', hex: '#137fec' };
      case 2: return { bg: 'from-info/10', border: 'border-info', text: 'text-info', glow: 'shadow-[0_4px_14px_rgba(37,99,235,0.25)]', hex: '#2563eb' };
      case 3: return { bg: 'from-warning/10', border: 'border-warning', text: 'text-warning', glow: 'shadow-[0_4px_14px_rgba(217,119,6,0.25)]', hex: '#d97706' };
    }
  };

  const colors = getModuleColor();

  const xpEarned = totalXP > 0 ? totalXP : currentIndex * 15;

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
      <div className="relative min-h-full w-full flex flex-col items-center justify-center bg-background">
        <div className="w-12 h-12 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        <p className="text-text-secondary text-sm mt-4">Loading your progress...</p>
      </div>
    );
  }

  // Resume modal
  if (showResumeModal && savedState) {
    return (
      <div className="relative min-h-full w-full flex flex-col items-center justify-center bg-background p-5">
        {/* DNA Helix Background */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <DNAHelix progress={(savedState.currentIndex / questions.length) * 100} moduleColor="primary" intensity="low" />
        </div>

        <div className="relative z-10 flex flex-col items-center text-center max-w-sm">
          {/* Icon */}
          <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 shadow-primary">
            <span className="material-symbols-outlined text-4xl text-primary">bookmark</span>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-text-primary mb-2">Welcome Back!</h2>
          <p className="text-text-secondary text-sm mb-6">
            You were at <span className="text-primary font-bold">Question {savedState.currentIndex + 1}</span> of {questions.length}
          </p>

          {/* Progress Preview */}
          <div className="w-full p-4 rounded-lg bg-surface border border-border mb-5 shadow-soft">
            <div className="flex items-center justify-between mb-2">
              <span className="text-text-secondary text-xs">Progress Saved</span>
              <span className="text-primary text-xs font-bold">{Math.round((savedState.currentIndex / questions.length) * 100)}%</span>
            </div>
            <div className="w-full h-2 bg-border rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-info rounded-full"
                style={{ width: `${(savedState.currentIndex / questions.length) * 100}%` }}
              />
            </div>
            <p className="text-text-secondary text-[10px] mt-2">
              XP Earned: <span className="text-warning font-bold">{savedState.currentIndex * 15} XP</span>
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col w-full gap-3">
            <button
              onClick={handleResume}
              className="w-full py-4 rounded-xl font-bold text-base bg-primary text-white flex items-center justify-center gap-1 shadow-primary active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined">play_arrow</span>
              Continue from Q{savedState.currentIndex + 1}
            </button>
            <button
              onClick={handleStartFresh}
              className="w-full py-3 rounded-lg font-medium text-text-secondary bg-surface border border-border hover:bg-input-bg transition-all active:scale-95"
            >
              Start Over
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-full w-full flex flex-col bg-background overflow-hidden">
      {/* DNA Helix Background */}
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        <DNAHelix progress={progress} moduleColor={getDNAModuleColor()} intensity="medium" />
      </div>

      {/* Subtle Background Overlay */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-gradient-to-b ${colors.bg} to-transparent rounded-full blur-[100px] opacity-40`} />
      </div>

      {/* Critical Alert Overlay */}
      {showCriticalOverlay && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-text-primary/60 backdrop-blur-sm animate-fadeIn">
          <div className="flex flex-col items-center gap-4 p-7 rounded-2xl bg-info/10 border border-info/30">
            <span className="material-symbols-outlined text-5xl text-info animate-pulse">flag</span>
            <p className="text-info font-bold text-center text-lg">
              Important Flag Detected
            </p>
            <p className="text-text-secondary text-sm text-center">
              We will notify your care provider
            </p>
          </div>
        </div>
      )}

      {/* Medication Capture Overlay */}
      {showMedicationCapture && (
        <div className="absolute inset-0 z-50 bg-text-primary/55 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-surface border border-border shadow-elevated p-4">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <p className="text-[11px] uppercase tracking-wider text-primary">Risk Assessment Input</p>
                <h3 className="text-lg font-bold text-text-primary">Add Current Medications</h3>
                <p className="text-text-secondary text-xs mt-1">We'll submit these to the risk engine as name, dose, and frequency.</p>
              </div>
              <button
                onClick={() => {
                  setShowMedicationCapture(false);
                  setPendingAnswers(null);
                }}
                className="w-8 h-8 rounded-full bg-input-bg border border-border flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-text-secondary text-base">close</span>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2 mb-3">
              <input
                value={medicationDraft.name}
                onChange={(e) => setMedicationDraft((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Medication name"
                className="w-full rounded-xl border border-border bg-input-bg px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary/70"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  value={medicationDraft.dose}
                  onChange={(e) => setMedicationDraft((prev) => ({ ...prev, dose: e.target.value }))}
                  placeholder="Dose"
                  className="w-full rounded-lg border border-border bg-input-bg px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary/70"
                />
                <input
                  value={medicationDraft.frequency}
                  onChange={(e) => setMedicationDraft((prev) => ({ ...prev, frequency: e.target.value }))}
                  placeholder="Frequency"
                  className="w-full rounded-lg border border-border bg-input-bg px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary/70"
                />
              </div>
            </div>

            <button
              onClick={addMedication}
              className="w-full py-2.5 rounded-lg bg-primary text-white text-sm font-bold"
            >
              Add Medication
            </button>

            <div className="mt-3 space-y-2 max-h-36 overflow-y-auto">
              {medications.length === 0 && (
                <p className="text-text-secondary text-xs text-center py-2">No medications added yet.</p>
              )}
              {medications.map((medication, idx) => (
                <div key={`${medication.name}-${idx}`} className="flex items-center justify-between gap-2 rounded-lg border border-border bg-input-bg px-3 py-2">
                  <div>
                    <p className="text-sm font-semibold text-text-primary">{medication.name}</p>
                    <p className="text-[11px] text-text-secondary">Dose {medication.dose} • {medication.frequency}</p>
                  </div>
                  <button
                    onClick={() => removeMedication(idx)}
                    className="w-7 h-7 rounded-full bg-danger/10 border border-danger/20 flex items-center justify-center"
                  >
                    <span className="material-symbols-outlined text-danger text-sm">delete</span>
                  </button>
                </div>
              ))}
            </div>

            {medicationFormError && <p className="text-danger text-xs mt-3">{medicationFormError}</p>}

            <button
              onClick={continueAfterMedicationCapture}
              className="mt-3 w-full py-3 rounded-lg bg-text-primary text-white text-sm font-bold"
            >
              Continue Assessment
            </button>
          </div>
        </div>
      )}

      {/* Final Submission Overlay */}
      {isFinalizingSubmission && (
        <div className="absolute inset-0 z-50 bg-text-primary/45 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="rounded-2xl bg-surface border border-border shadow-elevated p-6 flex flex-col items-center text-center">
            <div className="w-10 h-10 border-2 border-primary/25 border-t-primary rounded-full animate-spin" />
            <p className="text-text-primary text-sm font-semibold mt-3">Running Risk Assessment...</p>
            <p className="text-text-secondary text-xs mt-1">Saving baseline answers and submitting medications.</p>
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
            className={`flex items-center justify-center w-9 h-9 rounded-full bg-surface border border-border transition-all ${currentIndex === 0 ? 'opacity-30' : 'active:scale-95'}`}
          >
            <span className="material-symbols-outlined text-text-secondary text-lg">arrow_back</span>
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
          <div className="flex items-center gap-1 px-3 py-1 bg-surface rounded-full border border-border">
            <span className="text-text-primary text-sm font-mono">{currentIndex + 1}</span>
            <span className="text-text-secondary/50 text-sm">/</span>
            <span className="text-text-secondary text-sm font-mono">{questions.length}</span>
          </div>
        </div>

        {/* Module Badge */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className={`material-symbols-outlined ${colors.text} text-lg`}>{currentModule.icon}</span>
          <span className={`text-xs font-bold uppercase tracking-wider ${colors.text}`}>
            {currentModule.name}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="relative mb-2">
          <div className="w-full h-2 bg-border rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${currentQuestion.module === 1 ? 'bg-primary' : currentQuestion.module === 2 ? 'bg-info' : 'bg-warning'}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Module Progress Dots */}
        <div className="flex justify-center gap-3">
          {[1, 2, 3].map((m) => (
            <div key={m} className="flex items-center gap-1">
              <span className={`material-symbols-outlined text-sm ${m < currentQuestion.module ? 'text-text-secondary' : m === currentQuestion.module ? (m === 1 ? 'text-primary' : m === 2 ? 'text-info' : 'text-warning') : 'text-border'}`}>
                {m === 1 ? 'medication' : m === 2 ? 'family_restroom' : 'self_improvement'}
              </span>
              <div className="flex gap-0.5">
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-1 h-1 rounded-full transition-all ${m < currentQuestion.module ? 'bg-text-secondary/30' :
                      m === currentQuestion.module && i < (currentIndex % 10) + 1 ? (m === 1 ? 'bg-primary' : m === 2 ? 'bg-info' : 'bg-warning') :
                        'bg-border'
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
          color={colors.hex}
          onComplete={() => setShowParticleBurst(false)}
        />

        {/* Quest Number Badge */}
        <div className={`relative mb-6`}>
          {/* Animated Pulse Rings */}
          <div className="absolute inset-[-16px] rounded-full border border-border animate-pulse" />
          <div className={`absolute inset-[-8px] rounded-full ${colors.border} border opacity-30 animate-pulse`} style={{ animationDelay: '0.3s' }} />

          {/* Main Quest Badge */}
          <div className={`relative w-24 h-24 rounded-full bg-gradient-to-br ${colors.bg} via-surface to-surface flex flex-col items-center justify-center ${colors.border} border-2 ${colors.glow}`}>
            {/* Medical Module Icon */}
            <span className={`material-symbols-outlined text-3xl ${colors.text} mb-1`}>
              {currentModule.icon}
            </span>

            {/* Quest Number Display */}
            <div className="flex items-baseline gap-0.5">
              <span className="text-text-secondary text-[10px] font-bold uppercase">Q</span>
              <span className={`text-2xl font-black ${colors.text}`}>
                {currentIndex + 1}
              </span>
              <span className="text-text-secondary/50 text-[10px]">/{questions.length}</span>
            </div>
          </div>

          {/* Module Progress Ring */}
          <svg className="absolute inset-[-4px] w-[calc(100%+8px)] h-[calc(100%+8px)]" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="3"
            />
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke={colors.hex}
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
              className={`absolute w-1.5 h-1.5 rounded-full ${currentQuestion.module === 1 ? 'bg-primary' : currentQuestion.module === 2 ? 'bg-info' : 'bg-warning'} animate-float opacity-60`}
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
          <div className="flex items-center gap-1 px-3 py-1 bg-danger/10 rounded-full border border-danger/20 mb-3">
            <span className="material-symbols-outlined text-danger text-sm">priority_high</span>
            <span className="text-danger text-xs font-bold">Critical Question</span>
          </div>
        )}

        {/* Question Text */}
        <h2 className="text-xl font-bold text-text-primary text-center leading-tight mb-8 max-w-sm">
          {currentQuestion.text}
        </h2>

        {/* Answer Options */}
        <div className="w-full max-w-sm">
          {currentQuestion.type === 'boolean' && (
            <div className="flex gap-4">
              {/* Yes Button */}
              <button
                onClick={() => handleAnswer(true)}
                className={`group flex-1 relative py-5 rounded-xl font-bold text-lg transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.92] overflow-hidden
                  bg-surface ${colors.border} border-2 hover:border-opacity-80 ${colors.glow}
                  flex flex-col items-center gap-2`}
              >
                {/* Icon with ring */}
                <div className={`relative w-12 h-12 rounded-full bg-input-bg flex items-center justify-center ${colors.border} border group-hover:scale-110 transition-transform duration-300`}>
                  <span className={`material-symbols-outlined text-2xl ${colors.text}`}>check_circle</span>
                </div>
                <span className={colors.text}>Yes</span>
                <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full transition-all duration-300 ${combo > 0 ? 'bg-warning/10 scale-105' : 'bg-input-bg'}`}>
                  <span className="material-symbols-outlined text-xs text-primary">star</span>
                  <span className={`text-xs font-bold ${combo > 0 ? 'text-warning' : 'text-text-secondary'}`}>
                    +{15 * getMultiplier()} XP {combo > 0 && <span className="text-orange-500">({getMultiplier()}x)</span>}
                  </span>
                </div>
              </button>

              {/* No Button */}
              <button
                onClick={() => handleAnswer(false)}
                className="group flex-1 relative py-5 rounded-xl font-bold text-lg transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.92] overflow-hidden
                  bg-surface border-2 border-border hover:border-text-secondary/40
                  flex flex-col items-center gap-2"
              >
                {/* Icon with ring */}
                <div className="w-12 h-12 rounded-full bg-input-bg flex items-center justify-center border border-border group-hover:scale-110 transition-transform duration-300">
                  <span className="material-symbols-outlined text-2xl text-text-secondary">cancel</span>
                </div>
                <span className="text-text-primary">No</span>
                <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full transition-all duration-300 ${combo > 0 ? 'bg-warning/10 scale-105' : 'bg-input-bg'}`}>
                  <span className="material-symbols-outlined text-xs text-primary">star</span>
                  <span className={`text-xs font-bold ${combo > 0 ? 'text-warning' : 'text-text-secondary'}`}>
                    +{15 * getMultiplier()} XP {combo > 0 && <span className="text-orange-500">({getMultiplier()}x)</span>}
                  </span>
                </div>
              </button>
            </div>
          )}

          {currentQuestion.type === 'slider' && currentQuestion.sliderConfig && (
            <div className="flex flex-col items-center gap-6">
              {/* Value Display */}
              <div className="relative">
                <div className={`absolute inset-[-8px] rounded-full ${colors.border} opacity-20 animate-pulse`} />

                <div className={`relative w-32 h-32 rounded-full bg-gradient-to-br ${colors.bg} via-surface to-surface ${colors.border} border-2 flex items-center justify-center ${colors.glow}`}>
                  <div className="relative text-center">
                    <span className={`text-4xl font-black ${colors.text}`}>{sliderValue}</span>
                    <p className="text-text-secondary text-xs font-medium mt-0.5">{currentQuestion.sliderConfig.unit}</p>
                  </div>
                </div>

                {/* Decorative particles */}
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className={`absolute w-1 h-1 rounded-full ${currentQuestion.module === 1 ? 'bg-primary' : currentQuestion.module === 2 ? 'bg-info' : 'bg-warning'} animate-float`}
                    style={{
                      top: `${25 + i * 20}%`,
                      left: i % 2 === 0 ? '-12px' : 'auto',
                      right: i % 2 !== 0 ? '-12px' : 'auto',
                      animationDelay: `${i * 0.2}s`,
                    }}
                  />
                ))}
              </div>

              {/* Slider Track */}
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
                    className="w-full h-3 bg-border rounded-full appearance-none cursor-pointer
                      [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:h-7 
                      [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-card
                      [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-border"
                    style={{
                      background: `linear-gradient(to right, ${colors.hex} 0%, ${colors.hex} ${((sliderValue - currentQuestion.sliderConfig.min) / (currentQuestion.sliderConfig.max - currentQuestion.sliderConfig.min)) * 100}%, #e2e8f0 ${((sliderValue - currentQuestion.sliderConfig.min) / (currentQuestion.sliderConfig.max - currentQuestion.sliderConfig.min)) * 100}%, #e2e8f0 100%)`
                    }}
                  />
                </div>
                <div className="flex justify-between text-text-secondary text-xs mt-3 font-medium">
                  <span>{currentQuestion.sliderConfig.min}</span>
                  <span className={`${colors.text} font-bold`}>Current: {sliderValue}</span>
                  <span>{currentQuestion.sliderConfig.max}</span>
                </div>
              </div>

              {/* Continue Button */}
              <button
                onClick={() => handleAnswer(sliderValue)}
                className={`group w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.92] 
                  ${currentQuestion.module === 1 ? 'bg-primary' : currentQuestion.module === 2 ? 'bg-info' : 'bg-warning'} 
                  text-white flex items-center justify-center gap-3 shadow-lg relative overflow-hidden`}
              >
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

                <span className="relative font-black">Continue</span>
                <div className={`relative flex items-center gap-1 px-2 py-0.5 rounded-full ${combo > 0 ? 'bg-white/30' : 'bg-white/20'}`}>
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
                  className={`group relative py-4 px-5 rounded-xl font-medium transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.96] overflow-hidden
                    bg-surface border ${colors.border} hover:border-opacity-80 ${colors.glow}
                    flex items-center justify-between`}
                >
                  <div className="relative flex items-center gap-4">
                    {/* Letter Badge */}
                    <div className={`w-10 h-10 rounded-xl bg-input-bg flex items-center justify-center ${colors.border} border ${colors.text} text-base font-bold
                      group-hover:scale-110 transition-transform duration-300`}>
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span className="text-text-primary text-left">{choice}</span>
                  </div>

                  {/* Arrow indicator */}
                  <div className="relative flex items-center gap-2">
                    <span className={`text-xs font-bold ${combo > 0 ? 'text-warning' : colors.text} opacity-70`}>
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
        <div className="flex items-center justify-center gap-2 text-text-secondary/50 text-[10px]">
          <span className="material-symbols-outlined text-xs">touch_app</span>
          <span>Tap to answer • Auto-save enabled</span>
        </div>
      </footer>
    </div>
  );
};

export default Onboarding;
