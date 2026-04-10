import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PullToRefresh from '../components/PullToRefresh';
import { ToastContainer, useToast } from '../components/Toast';
import { BouncyPress, DailyStreak } from '../components/MicroInteractions';
import { SmoothNumber } from '../components/PageTransition';
import { downloadDoctorReport, getDoctorReportShareLink, getGene42Report, type Gene42Report } from '../utils/gene42';
import { getPatientId, getUserName } from '../utils/auth';
import { getCachedRiskAssessments, getRiskAssessmentsForPatient, type RiskAssessmentResult } from '../utils/riskAssessment';

interface ScheduleItem {
  id: string;
  time: string;
  title: string;
  detail: string;
  icon: string;
  category: 'sleep' | 'nutrition' | 'activity' | 'recovery' | 'shield';
  strictness: 'strict' | 'recommended';
}

const toMinutes = (time: string): number | null => {
  const parts = time.split(':');
  if (parts.length !== 2) return null;

  const hours = Number(parts[0]);
  const minutes = Number(parts[1]);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;

  return hours * 60 + minutes;
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { toasts, addToast, removeToast } = useToast();

  const [xp, setXp] = useState(820);
  const [dailyStreak, setDailyStreak] = useState(6);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [report, setReport] = useState<Gene42Report | null>(null);
  const [riskAssessments, setRiskAssessments] = useState<RiskAssessmentResult[]>([]);
  const [isRiskLoading, setIsRiskLoading] = useState(false);

  const userName = getUserName() || 'Patient';

  useEffect(() => {
    setReport(getGene42Report());
    setRiskAssessments(getCachedRiskAssessments());

    const patientId = getPatientId();
    if (!patientId) return;

    setIsRiskLoading(true);
    getRiskAssessmentsForPatient(patientId)
      .then((results) => setRiskAssessments(results))
      .catch((error) => console.error('Failed to load risk assessments:', error))
      .finally(() => setIsRiskLoading(false));
  }, []);

  const latestRisk = useMemo(() => {
    if (riskAssessments.length === 0) return null;
    return [...riskAssessments].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )[0];
  }, [riskAssessments]);

  const lifeSchedule = useMemo<ScheduleItem[]>(() => {
    const riskScore = latestRisk?.overall_risk_score ?? 0;
    const highStress = (report?.lifestyleIndex ?? 85) < 70;
    const hasPgxRisk = (latestRisk?.pharmacogenomic_interactions.length ?? 0) > 0 || (report?.prioritizedVariants.length ?? 0) > 2;

    return [
      {
        id: 'sleep-1',
        time: '22:30',
        title: 'Sleep Window Opens',
        detail: highStress ? 'Target 8h with screen-off 45 min before bed.' : 'Target 7.5-8h to stabilize recovery markers.',
        icon: 'bedtime',
        category: 'sleep',
        strictness: 'strict',
      },
      {
        id: 'nutrition-1',
        time: '07:30',
        title: 'Breakfast Protocol',
        detail: 'Low-glycemic meal + hydration before caffeine to reduce fatigue swings.',
        icon: 'nutrition',
        category: 'nutrition',
        strictness: 'recommended',
      },
      {
        id: 'activity-1',
        time: '12:30',
        title: 'Movement Block',
        detail: riskScore > 40 ? '20-min low-impact walk + breathing reset.' : '30-min moderate activity to sustain metabolic response.',
        icon: 'directions_walk',
        category: 'activity',
        strictness: 'recommended',
      },
      {
        id: 'recovery-1',
        time: '16:00',
        title: 'Fatigue Countermeasure',
        detail: 'Electrolyte hydration + protein snack to prevent evening crash.',
        icon: 'bolt',
        category: 'recovery',
        strictness: 'recommended',
      },
      {
        id: 'shield-1',
        time: 'Any New Prescription',
        title: 'Pharmacogenomics Shield',
        detail: hasPgxRisk
          ? 'Flag high-risk medications for Gene42 review before dispensing.'
          : 'No high-risk PGx interactions detected today, continue standard screening.',
        icon: 'shield_with_heart',
        category: 'shield',
        strictness: 'strict',
      },
    ];
  }, [latestRisk, report]);

  const nextScheduleItem = useMemo(() => {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const timedItems = lifeSchedule
      .map((item) => ({ item, minutes: toMinutes(item.time) }))
      .filter((entry): entry is { item: ScheduleItem; minutes: number } => entry.minutes !== null)
      .sort((a, b) => a.minutes - b.minutes);

    const next = timedItems.find((entry) => entry.minutes >= currentMinutes) || timedItems[0];
    return next?.item || lifeSchedule[0];
  }, [lifeSchedule]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));

    setReport(getGene42Report());
    const patientId = getPatientId();
    if (patientId) {
      try {
        const refreshed = await getRiskAssessmentsForPatient(patientId);
        setRiskAssessments(refreshed);
      } catch (error) {
        console.error('Risk refresh failed:', error);
      }
    }

    const earned = 35 + Math.floor(Math.random() * 20);
    setXp((prev) => prev + earned);
    setDailyStreak((prev) => prev + 1);
    addToast(`Schedule refreshed from live metrics. +${earned} XP`, 'xp', earned);
    setIsRefreshing(false);
  }, [addToast]);

  const handleCopyDoctorShareLink = async () => {
    if (!report) {
      addToast('No Gene42 report found yet. Run baseline first.', 'warning');
      return;
    }

    try {
      await navigator.clipboard.writeText(getDoctorReportShareLink(report));
      addToast('Doctor share link copied.', 'success');
    } catch {
      addToast('Copy failed. Please allow clipboard access.', 'error');
    }
  };

  const riskToneClass = latestRisk && latestRisk.overall_risk_score > 60
    ? 'text-danger'
    : latestRisk && latestRisk.overall_risk_score > 25
      ? 'text-warning'
      : 'text-success';

  return (
    <div className="relative min-h-full bg-background text-text-primary flex flex-col">
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[420px] h-[320px] bg-primary/8 rounded-full blur-[90px]" />
        <div className="absolute bottom-20 -right-16 w-[220px] h-[220px] bg-warning/10 rounded-full blur-[70px]" />
      </div>

      <header className="relative z-10 px-4 pt-4 pb-2">
        <div className="rounded-2xl bg-surface border border-border shadow-card px-4 py-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-text-secondary">Personalized Life Schedule</p>
              <h1 className="text-xl font-black leading-tight">Good day, {userName.split(' ')[0]}</h1>
              <p className="text-xs text-text-secondary mt-1">
                Genetic blueprint + live biometrics orchestration prototype
              </p>
            </div>
            <button
              onClick={() => navigate('/notifications')}
              className="w-10 h-10 rounded-lg bg-input-bg border border-border flex items-center justify-center active:scale-95"
            >
              <span className="material-symbols-outlined text-text-secondary">notifications</span>
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="rounded-xl bg-input-bg border border-border p-2.5 text-center">
              <p className="text-[10px] text-text-secondary uppercase tracking-wide">XP</p>
              <SmoothNumber value={xp} suffix="" className="text-lg font-bold text-primary" />
            </div>
            <div className="rounded-xl bg-input-bg border border-border p-2.5 text-center">
              <p className="text-[10px] text-text-secondary uppercase tracking-wide">Lifestyle</p>
              <p className="text-lg font-bold text-info">{report?.lifestyleIndex ?? 85}</p>
            </div>
            <div className="rounded-xl bg-input-bg border border-border p-2.5 text-center">
              <p className="text-[10px] text-text-secondary uppercase tracking-wide">Risk</p>
              <p className={`text-lg font-bold ${riskToneClass}`}>{latestRisk?.overall_risk_score ?? 0}</p>
            </div>
          </div>
        </div>
      </header>

      <PullToRefresh onRefresh={handleRefresh} className="relative z-10 flex-1 overflow-y-auto">
        <main className="px-4 pb-24 space-y-3">
          <DailyStreak
            currentStreak={dailyStreak}
            longestStreak={Math.max(dailyStreak, 8)}
            todayCompleted={isRefreshing || !!latestRisk}
          />

          <section className="rounded-2xl bg-gradient-to-br from-primary/10 to-info/10 border border-primary/20 shadow-card p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[11px] uppercase tracking-[0.15em] text-text-secondary">Next Best Action</p>
                <h2 className="text-lg font-black text-text-primary mt-0.5">{nextScheduleItem?.title}</h2>
                <p className="text-xs text-text-secondary mt-1">{nextScheduleItem?.detail}</p>
              </div>
              <div className="px-2.5 py-1.5 rounded-lg bg-surface/80 border border-border text-right">
                <p className="text-[10px] uppercase tracking-wide text-text-secondary">Time</p>
                <p className="text-sm font-bold text-primary">{nextScheduleItem?.time}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-3">
              <div className="rounded-lg bg-surface/80 border border-border px-2 py-2 text-center">
                <p className="text-[10px] text-text-secondary">Sleep</p>
                <p className="text-xs font-bold text-info">Synced</p>
              </div>
              <div className="rounded-lg bg-surface/80 border border-border px-2 py-2 text-center">
                <p className="text-[10px] text-text-secondary">Activity</p>
                <p className="text-xs font-bold text-info">Synced</p>
              </div>
              <div className="rounded-lg bg-surface/80 border border-border px-2 py-2 text-center">
                <p className="text-[10px] text-text-secondary">Heart Rate</p>
                <p className="text-xs font-bold text-info">Live</p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl bg-surface border border-border shadow-card p-4">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <h2 className="text-lg font-black">Schedule</h2>
              </div>
              <span className="material-symbols-outlined text-primary text-2xl">calendar_month</span>
            </div>
            <p className="text-xs text-text-secondary mb-3">
              The schedule fuses static genomic constraints with streamed lifestyle metrics (sleep, activity, heart rate) to generate strict daily timing guidance.
            </p>

            <div className="space-y-2.5">
              {lifeSchedule.map((item) => (
                <div key={item.id} className="rounded-xl border border-border bg-input-bg px-3 py-2.5">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-surface border border-border flex items-center justify-center mt-0.5">
                      <span className="material-symbols-outlined text-primary text-lg">{item.icon}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-bold text-text-primary">{item.title}</p>
                        <span className="text-[10px] font-bold text-primary">{item.time}</span>
                      </div>
                      <p className="text-[12px] text-text-secondary mt-0.5">{item.detail}</p>
                      <p className={`text-[10px] mt-1 font-semibold ${item.strictness === 'strict' ? 'text-danger' : 'text-info'}`}>
                        {item.strictness === 'strict' ? 'Strict guideline' : 'Recommended guideline'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl bg-surface border border-border shadow-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.15em] text-text-secondary">Pharmacogenomics Shield</p>
                <h3 className="text-base font-black">Drug Avoidance Alerts</h3>
              </div>
              <span className="material-symbols-outlined text-warning text-2xl">health_and_safety</span>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2">
              <div className="rounded-lg bg-input-bg border border-border p-2 text-center">
                <p className="text-[10px] text-text-secondary">Prioritized Variants</p>
                <p className="text-lg font-bold text-warning">{report?.prioritizedVariants.length ?? 0}</p>
              </div>
              <div className="rounded-lg bg-input-bg border border-border p-2 text-center">
                <p className="text-[10px] text-text-secondary">Medication Interactions</p>
                <p className="text-lg font-bold text-warning">{latestRisk?.medication_interactions.length ?? 0}</p>
              </div>
              <div className="rounded-lg bg-input-bg border border-border p-2 text-center">
                <p className="text-[10px] text-text-secondary">PGx Interactions</p>
                <p className="text-lg font-bold text-warning">{latestRisk?.pharmacogenomic_interactions.length ?? 0}</p>
              </div>
            </div>

            <p className="mt-3 text-xs text-text-secondary">
              {isRiskLoading
                ? 'Refreshing backend assessment...'
                : latestRisk?.risk_summary_text || 'Awaiting backend risk summary. Complete medication intake and sync.'}
            </p>
          </section>

          <section className="rounded-2xl bg-surface border border-border shadow-card p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.15em] text-text-secondary">Doctor Delivery</p>
                <p className="text-base font-bold text-text-primary">Gene42 Contextual Report</p>
                <p className="text-[11px] text-text-secondary mt-1">
                  {report
                    ? `Generated ${new Date(report.generatedAt).toLocaleString()}`
                    : 'Complete baseline to generate report'}
                </p>
              </div>
              <span className="material-symbols-outlined text-info text-3xl">description</span>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-3">
              <button
                onClick={() => report && downloadDoctorReport(report)}
                disabled={!report}
                className="py-2.5 rounded-xl bg-primary text-white text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Download Report
              </button>
              <button
                onClick={handleCopyDoctorShareLink}
                disabled={!report}
                className="py-2.5 rounded-lg bg-input-bg border border-border text-text-primary text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Copy Doctor Link
              </button>
            </div>
          </section>

          <section className="grid grid-cols-2 gap-2">
            <BouncyPress
              onClick={() => navigate('/onboarding')}
              className="p-3 rounded-xl bg-surface border border-border shadow-soft flex flex-col items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-primary text-xl">refresh</span>
              <span className="text-text-primary font-medium text-xs">Recalibrate</span>
              <span className="text-text-secondary text-[10px]">Update baseline</span>
            </BouncyPress>
            <BouncyPress
              onClick={() => navigate('/insights')}
              className="p-3 rounded-xl bg-surface border border-border shadow-soft flex flex-col items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-info text-xl">insights</span>
              <span className="text-text-primary font-medium text-xs">Insights</span>
              <span className="text-text-secondary text-[10px]">View trends</span>
            </BouncyPress>
          </section>

          <p className="text-center text-[10px] text-text-secondary/70 pb-2">
            Prototype mode: schedule generation simulates Apple HealthKit + TimescaleDB signals for UX demonstration.
          </p>
        </main>
      </PullToRefresh>

      <nav className="absolute bottom-0 left-0 right-0 z-40 p-3 bg-gradient-to-t from-background via-background/95 to-transparent">
        <div className="flex items-center justify-around px-4 py-2.5 rounded-xl bg-surface/95 backdrop-blur border border-border shadow-card">
          <button className="flex flex-col items-center gap-0.5 px-3 py-1">
            <span className="material-symbols-outlined text-primary text-xl">home</span>
            <span className="text-[9px] text-primary font-medium">Home</span>
          </button>
          <button onClick={() => navigate('/onboarding')} className="flex flex-col items-center gap-0.5 px-3 py-1 opacity-70">
            <span className="material-symbols-outlined text-text-secondary text-xl">quiz</span>
            <span className="text-[9px] text-text-secondary">Calibrate</span>
          </button>
          <button onClick={() => navigate('/settings')} className="flex flex-col items-center gap-0.5 px-3 py-1 opacity-70">
            <span className="material-symbols-outlined text-text-secondary text-xl">settings</span>
            <span className="text-[9px] text-text-secondary">Settings</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Dashboard;
