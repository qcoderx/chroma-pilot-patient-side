import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ParticleBurst } from '../components/MicroInteractions';
import { downloadDoctorReport, getDoctorReportShareLink, getGene42Report, type Gene42Report } from '../utils/gene42';
import { getLatestRiskAssessment, type RiskAssessmentResult } from '../utils/riskAssessment';

const processingSteps = [
  'Submitting 30-question phenotype baseline',
  'Activating Historian engine: Gene42',
  'Parsing static genome and phenotype context',
  'Filtering benign variants common in African genomes',
  'Compiling contextualized doctor report',
];

const Complete: React.FC = () => {
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [report, setReport] = useState<Gene42Report | null>(null);
  const [hasAutoDownloaded, setHasAutoDownloaded] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [latestRisk, setLatestRisk] = useState<RiskAssessmentResult | null>(null);

  const ambientDots = useMemo(
    () =>
      [...Array(22)].map((_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 2.8 + Math.random() * 2,
        size: 4 + Math.random() * 7,
        color: ['#0ea5e9', '#0284c7', '#f59e0b'][i % 3],
      })),
    []
  );

  useEffect(() => {
    const loaded = getGene42Report();
    setReport(loaded);
    setLatestRisk(getLatestRiskAssessment());
    setShowContent(true);

    const stepTimer = setInterval(() => {
      setActiveStep((prev) => {
        if (prev >= processingSteps.length - 1) {
          clearInterval(stepTimer);
          setShowParticles(true);
          return prev;
        }
        return prev + 1;
      });
    }, 700);

    return () => clearInterval(stepTimer);
  }, []);

  useEffect(() => {
    if (!report || hasAutoDownloaded || activeStep < processingSteps.length - 1) {
      return;
    }

    const autoDownload = setTimeout(() => {
      downloadDoctorReport(report);
      setHasAutoDownloaded(true);
    }, 450);

    return () => clearTimeout(autoDownload);
  }, [report, hasAutoDownloaded, activeStep]);

  const handleCopyDoctorLink = async () => {
    if (!report) return;

    try {
      await navigator.clipboard.writeText(getDoctorReportShareLink(report));
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 1800);
    } catch {
      setShareCopied(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between bg-background overflow-hidden px-5 py-6">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-8 left-1/2 -translate-x-1/2 w-[390px] h-[390px] bg-cyan-400/10 blur-[110px] rounded-full" />
        <div className="absolute bottom-1/4 right-0 w-[180px] h-[180px] bg-amber-400/10 blur-[90px] rounded-full" />
      </div>

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {ambientDots.map((dot, idx) => (
          <div
            key={idx}
            className="absolute animate-float rounded-full opacity-50"
            style={{
              left: `${dot.left}%`,
              bottom: '-5%',
              width: dot.size,
              height: dot.size,
              backgroundColor: dot.color,
              animationDelay: `${dot.delay}s`,
              animationDuration: `${dot.duration}s`,
            }}
          />
        ))}
      </div>

      <section
        className={`relative z-10 transition-all duration-500 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-11 h-11 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center">
            <span className="material-symbols-outlined text-cyan-500 text-2xl">neurology</span>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-text-secondary">Historian Engine</p>
            <h1 className="text-2xl font-black text-text-primary">Gene42 Activated</h1>
          </div>
        </div>
        <p className="text-sm text-text-secondary mb-5">
          Baseline submission is complete. Your doctor report is now generated and ready for immediate download.
        </p>

        <div className="rounded-2xl bg-surface/95 border border-border shadow-card p-4 space-y-3">
          {processingSteps.map((step, idx) => {
            const done = idx <= activeStep;
            return (
              <div key={step} className="flex items-center gap-3">
                <div
                  className={`w-7 h-7 rounded-full border flex items-center justify-center ${done ? 'bg-cyan-500/20 border-cyan-500 text-cyan-600' : 'border-border text-text-secondary'
                    }`}
                >
                  <span className="material-symbols-outlined text-base">
                    {done ? 'check' : 'schedule'}
                  </span>
                </div>
                <p className={`${done ? 'text-text-primary' : 'text-text-secondary'} text-sm`}>{step}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="relative z-10 my-5">
        <div className="rounded-2xl border border-cyan-500/25 bg-gradient-to-br from-cyan-500/10 to-surface p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.15em] text-text-secondary">Doctor Contextual Report</p>
              <p className="text-xl font-black text-text-primary">Ready</p>
            </div>
            <div className="relative">
              <span className="material-symbols-outlined text-4xl text-cyan-600">description</span>
              {showParticles && <ParticleBurst active={true} color="#0284c7" particleCount={8} />}
            </div>
          </div>

          {report ? (
            <div className="mt-4 grid grid-cols-3 gap-2">
              <div className="rounded-xl bg-white/60 border border-border px-3 py-2 text-center">
                <p className="text-[10px] text-text-secondary">Safety</p>
                <p className="text-lg font-bold text-cyan-700">{report.safetyScore}%</p>
              </div>
              <div className="rounded-xl bg-white/60 border border-border px-3 py-2 text-center">
                <p className="text-[10px] text-text-secondary">Heritage Risk</p>
                <p className="text-lg font-bold text-amber-600 capitalize">{report.heritageRisk}</p>
              </div>
              <div className="rounded-xl bg-white/60 border border-border px-3 py-2 text-center">
                <p className="text-[10px] text-text-secondary">Filtered Benign</p>
                <p className="text-lg font-bold text-cyan-700">{report.filteredBenignAfricanVariants.length}</p>
              </div>
            </div>
          ) : (
            <p className="mt-4 text-sm text-danger">No report found in local storage. Re-run onboarding to generate one.</p>
          )}

          {latestRisk && (
            <div className="mt-3 rounded-xl bg-white/60 border border-border px-3 py-2.5">
              <p className="text-[10px] uppercase tracking-wider text-text-secondary">Risk Assessment</p>
              <p className="text-sm font-semibold text-text-primary mt-1">{latestRisk.risk_summary_text}</p>
              <p className="text-[11px] text-text-secondary mt-1">
                Score {latestRisk.overall_risk_score} • Medication interactions {latestRisk.medication_interactions.length} • PGx interactions {latestRisk.pharmacogenomic_interactions.length}
              </p>
            </div>
          )}

          <button
            disabled={!report}
            onClick={() => report && downloadDoctorReport(report)}
            className="mt-5 w-full py-3 rounded-xl bg-cyan-600 text-white font-bold text-sm hover:bg-cyan-700 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">download</span>
            Download Doctor Report
          </button>

          <button
            disabled={!report}
            onClick={handleCopyDoctorLink}
            className="mt-2 w-full py-3 rounded-xl bg-white border border-border text-text-primary font-bold text-sm active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">link</span>
            {shareCopied ? 'Doctor link copied' : 'Copy Secure Doctor Link'}
          </button>
        </div>
      </section>

      <section className="relative z-10">
        <button
          onClick={() => navigate('/dashboard')}
          className="w-full py-4 rounded-xl bg-text-primary text-white font-bold flex items-center justify-center gap-2 active:scale-95 transition-all"
        >
          Continue to Dashboard
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </section>
    </div>
  );
};

export default Complete;
