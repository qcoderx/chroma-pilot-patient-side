export interface QuestionShape {
  id: number;
  text: string;
  module: 1 | 2 | 3;
  critical?: boolean;
}

export type AnswerValue = boolean | number | string;

export interface GenomeVariant {
  gene: string;
  variant: string;
  significance: 'benign' | 'likely_benign' | 'vus' | 'pathogenic';
  africanFrequency: number;
  globalFrequency: number;
  context: string;
}

export interface Gene42Report {
  reportId: string;
  secureDoctorToken: string;
  generatedAt: string;
  patientId: string;
  analysisEngine: 'Gene42';
  phenotypeCompletion: number;
  filteredBenignAfricanVariants: GenomeVariant[];
  prioritizedVariants: GenomeVariant[];
  phenotypeHighlights: string[];
  recommendations: string[];
  safetyScore: number;
  heritageRisk: 'low' | 'moderate' | 'high';
  lifestyleIndex: number;
  doctorNarrative: string;
}

const STORAGE_KEY = 'chromapilot_gene42_report';

const DOCTOR_PORTAL_BASE = 'https://doctor.chromapilot.health/report';

const STATIC_GENOME: GenomeVariant[] = [
  {
    gene: 'CYP2D6',
    variant: '*17',
    significance: 'likely_benign',
    africanFrequency: 0.22,
    globalFrequency: 0.05,
    context: 'Metabolism variance observed in population baseline',
  },
  {
    gene: 'APOE',
    variant: 'rs429358',
    significance: 'vus',
    africanFrequency: 0.06,
    globalFrequency: 0.14,
    context: 'Contextual lipid/cardiovascular interpretation required',
  },
  {
    gene: 'SLCO1B1',
    variant: 'c.521T>C',
    significance: 'pathogenic',
    africanFrequency: 0.01,
    globalFrequency: 0.07,
    context: 'Potential statin intolerance risk',
  },
  {
    gene: 'G6PD',
    variant: 'A- haplotype marker',
    significance: 'vus',
    africanFrequency: 0.12,
    globalFrequency: 0.03,
    context: 'Medication oxidant stress caution suggested',
  },
  {
    gene: 'CYP2C19',
    variant: '*2',
    significance: 'pathogenic',
    africanFrequency: 0.03,
    globalFrequency: 0.15,
    context: 'Reduced activation for select antiplatelet agents',
  },
  {
    gene: 'HBB',
    variant: 'rs334 carrier marker',
    significance: 'vus',
    africanFrequency: 0.08,
    globalFrequency: 0.01,
    context: 'Hematology follow-up if phenotype indicates concern',
  },
  {
    gene: 'ACE',
    variant: 'I/D polymorphism',
    significance: 'benign',
    africanFrequency: 0.38,
    globalFrequency: 0.31,
    context: 'Common polymorphism with low standalone impact',
  },
  {
    gene: 'UGT1A1',
    variant: '*28',
    significance: 'likely_benign',
    africanFrequency: 0.19,
    globalFrequency: 0.11,
    context: 'Usually benign; contextual relevance for irinotecan class',
  },
];

const mapDomain = (questionId: number): 'pharmacogenomics' | 'family-history' | 'lifestyle' => {
  if (questionId <= 10) return 'pharmacogenomics';
  if (questionId <= 20) return 'family-history';
  return 'lifestyle';
};

const formatAnswer = (value: AnswerValue): string => {
  if (value === undefined || value === null) return 'No answer recorded';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  return String(value);
};

const buildSecureDoctorToken = (): string => {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const bytes = new Uint8Array(10);
    crypto.getRandomValues(bytes);
    return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
  }

  return `${Date.now().toString(16)}${Math.random().toString(16).slice(2, 10)}`;
};

export const getDoctorReportShareLink = (report: Pick<Gene42Report, 'reportId' | 'secureDoctorToken'>): string => {
  const params = new URLSearchParams({
    access: report.secureDoctorToken,
    mode: 'download',
  });
  return `${DOCTOR_PORTAL_BASE}/${report.reportId}?${params.toString()}`;
};

const scoreLifestyle = (answers: Record<number, AnswerValue>): number => {
  const hydration = Number(answers[23] ?? 6);
  const sleep = Number(answers[24] ?? 7);
  const exercise = Number(answers[26] ?? 2);
  const smoke = answers[25] === true;
  const stress = String(answers[27] ?? 'Moderate');

  let score = 70;
  score += Math.min(10, hydration);
  score += Math.max(0, Math.min(10, sleep * 1.2));
  score += Math.max(0, Math.min(10, exercise * 0.8));
  if (smoke) score -= 18;
  if (stress === 'High') score -= 8;
  if (stress === 'Very High') score -= 12;

  return Math.max(35, Math.min(98, Math.round(score)));
};

const inferHeritageRisk = (answers: Record<number, AnswerValue>): 'low' | 'moderate' | 'high' => {
  const criticalFamilySignals = [11, 12, 15, 18].filter((id) => answers[id] === true).length;
  if (criticalFamilySignals >= 2) return 'high';
  if (criticalFamilySignals === 1) return 'moderate';
  return 'low';
};

const buildRecommendations = (answers: Record<number, AnswerValue>, prioritized: GenomeVariant[]): string[] => {
  const recommendations: string[] = [];

  if (answers[2] === true || answers[8] === true) {
    recommendations.push('Perform medication-allergy reconciliation before prescribing new therapies.');
  }
  if (answers[11] === true || answers[15] === true) {
    recommendations.push('Prioritize cardiovascular baseline monitoring and annual risk review.');
  }
  if (answers[12] === true || answers[18] === true || prioritized.some((v) => v.gene === 'HBB')) {
    recommendations.push('Consider focused hematology consultation to clarify inherited blood risk context.');
  }
  if (answers[25] === true || String(answers[27] ?? '') === 'Very High') {
    recommendations.push('Start a supervised lifestyle risk reduction plan with smoking/stress support.');
  }

  recommendations.push('Review this report alongside medication list and full clinical history before final care decisions.');
  return recommendations;
};

const buildDoctorNarrative = (report: Gene42Report, answeredQuestions: Array<{ question: string; answer: string; domain: string }>): string => {
  const shareLink = getDoctorReportShareLink(report);

  const lines: string[] = [
    'CHROMA-PILOT CONTEXTUALIZED MEDICAL REPORT',
    `Generated: ${new Date(report.generatedAt).toLocaleString()}`,
    `Engine: ${report.analysisEngine}`,
    `Patient ID: ${report.patientId}`,
    '',
    'SUMMARY',
    `- Phenotype baseline completion: ${report.phenotypeCompletion}/30`,
    `- Safety score: ${report.safetyScore}%`,
    `- Heritage risk: ${report.heritageRisk.toUpperCase()}`,
    `- Lifestyle index: ${report.lifestyleIndex}/100`,
    `- Benign variants filtered as common in African genomes: ${report.filteredBenignAfricanVariants.length}`,
    `- Prioritized variants requiring context: ${report.prioritizedVariants.length}`,
    `- Secure doctor download link: ${shareLink}`,
    '',
    'AFRICAN-GENOME CONTEXT FILTER',
    '- Rule: benign/likely benign variants with >=15% African population frequency are de-prioritized.',
    ...report.filteredBenignAfricanVariants.map((variant) =>
      `- FILTERED ${variant.gene} ${variant.variant} [afr=${variant.africanFrequency}, global=${variant.globalFrequency}]`
    ),
    '',
    'PRIORITIZED VARIANTS',
    ...report.prioritizedVariants.map((variant) =>
      `- ${variant.gene} ${variant.variant} [${variant.significance}] :: ${variant.context}`
    ),
    '',
    'PHENOTYPE HIGHLIGHTS',
    ...report.phenotypeHighlights.map((highlight) => `- ${highlight}`),
    '',
    'CLINICAL RECOMMENDATIONS',
    ...report.recommendations.map((recommendation) => `- ${recommendation}`),
    '',
    'ANSWER TRACE (30-QUESTION BASELINE)',
    ...answeredQuestions.map((entry, idx) => `${idx + 1}. [${entry.domain}] ${entry.question} -> ${entry.answer}`),
    '',
    'DISCLAIMER: Prototype output for workflow simulation; not a replacement for clinician judgment.',
  ];

  return lines.join('\n');
};

export const runGene42Analysis = (
  questions: QuestionShape[],
  answers: Record<number, AnswerValue>,
  patientId: string
): Gene42Report => {
  const answeredQuestions = questions.map((question) => ({
    question: question.text,
    answer: formatAnswer(answers[question.id]),
    domain: mapDomain(question.id),
  }));

  const filteredBenignAfricanVariants = STATIC_GENOME.filter(
    (variant) =>
      (variant.significance === 'benign' || variant.significance === 'likely_benign') &&
      variant.africanFrequency >= 0.15
  );

  const prioritizedVariants = STATIC_GENOME.filter(
    (variant) => !filteredBenignAfricanVariants.includes(variant) && variant.significance !== 'benign'
  );

  const criticalYesAnswers = questions.filter((q) => q.critical && answers[q.id] === true);

  const phenotypeHighlights = [
    `${criticalYesAnswers.length} critical phenotype signals detected across baseline intake.`,
    `Medication safety module captured ${questions.filter((q) => q.module === 1).length} responses.`,
    `Family history module captured ${questions.filter((q) => q.module === 2).length} responses.`,
    `Lifestyle module captured ${questions.filter((q) => q.module === 3).length} responses.`,
  ];

  const safetyScore = Math.max(72, 98 - criticalYesAnswers.length * 5 - prioritizedVariants.length * 2);
  const heritageRisk = inferHeritageRisk(answers);
  const lifestyleIndex = scoreLifestyle(answers);
  const recommendations = buildRecommendations(answers, prioritizedVariants);

  const report: Gene42Report = {
    reportId: `G42-${Date.now()}`,
    secureDoctorToken: buildSecureDoctorToken(),
    generatedAt: new Date().toISOString(),
    patientId,
    analysisEngine: 'Gene42',
    phenotypeCompletion: Object.keys(answers).length,
    filteredBenignAfricanVariants,
    prioritizedVariants,
    phenotypeHighlights,
    recommendations,
    safetyScore,
    heritageRisk,
    lifestyleIndex,
    doctorNarrative: '',
  };

  report.doctorNarrative = buildDoctorNarrative(report, answeredQuestions);
  return report;
};

export const saveGene42Report = (report: Gene42Report): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(report));
};

export const getGene42Report = (): Gene42Report | null => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as Gene42Report;
  } catch {
    return null;
  }
};

export const downloadDoctorReport = (report: Gene42Report): void => {
  const blob = new Blob([report.doctorNarrative], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const fileDate = report.generatedAt.slice(0, 10);
  link.href = url;
  link.download = `gene42-contextual-report-${fileDate}.txt`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};