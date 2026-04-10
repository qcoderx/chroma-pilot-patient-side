import { getAuthorizationHeader } from './auth';

export interface MedicationEntry {
  name: string;
  dose: string;
  frequency: string;
}

export interface RiskAssessmentResult {
  patient_id: string;
  doctor_id: string;
  medication_interactions: Array<Record<string, unknown>>;
  pharmacogenomic_interactions: Array<Record<string, unknown>>;
  overall_risk_score: number;
  risk_summary_text: string;
  id: string;
  created_at: string;
}

interface RiskAssessmentPayload {
  medications: MedicationEntry[];
  patient_id: string;
}

const viteEnv = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env;
const API_BASE_URL = viteEnv?.VITE_API_BASE_URL || 'https://chromapilot.onrender.com';
const QA_STORAGE_KEY = 'chromapilot_phenotype_answers';
const RISK_STORAGE_KEY = 'chromapilot_risk_assessment';

export const savePhenotypeAnswers = (
  questions: Array<{ id: number; text: string; module: 1 | 2 | 3 }>,
  answers: Record<number, boolean | number | string>,
  patientId: string,
  medications: MedicationEntry[]
): void => {
  const answerTrace = questions.map((question) => ({
    questionId: question.id,
    question: question.text,
    module: question.module,
    answer: answers[question.id] ?? null,
  }));

  localStorage.setItem(
    QA_STORAGE_KEY,
    JSON.stringify({
      patientId,
      savedAt: new Date().toISOString(),
      medications,
      answers: answerTrace,
    })
  );
};

export const runRiskAssessment = async (
  patientId: string,
  medications: MedicationEntry[]
): Promise<RiskAssessmentResult | RiskAssessmentResult[]> => {
  const payload: RiskAssessmentPayload = {
    medications,
    patient_id: patientId,
  };

  const authHeader = getAuthorizationHeader();
  const response = await fetch(`${API_BASE_URL}/api/v1/risk-assessment/assess`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeader,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Risk assessment failed: 401 Unauthorized. Ensure patient link verification has completed and access token is valid.');
    }
    throw new Error(`Risk assessment failed: ${response.status}`);
  }

  const result = (await response.json()) as RiskAssessmentResult | RiskAssessmentResult[];
  localStorage.setItem(
    RISK_STORAGE_KEY,
    JSON.stringify({
      patientId,
      medications,
      assessedAt: new Date().toISOString(),
      result,
    })
  );

  return result;
};

export const getRiskAssessmentsForPatient = async (patientId: string): Promise<RiskAssessmentResult[]> => {
  const authHeader = getAuthorizationHeader();
  const response = await fetch(`${API_BASE_URL}/api/v1/risk-assessment/patient/${patientId}`, {
    method: 'GET',
    headers: {
      ...authHeader,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Get risk assessments failed: 401 Unauthorized. Ensure access token is available and not expired.');
    }
    throw new Error(`Get risk assessments failed: ${response.status}`);
  }

  const result = (await response.json()) as RiskAssessmentResult[];
  localStorage.setItem(
    RISK_STORAGE_KEY,
    JSON.stringify({
      patientId,
      assessedAt: new Date().toISOString(),
      result,
    })
  );

  return result;
};

export const getCachedRiskAssessments = (): RiskAssessmentResult[] => {
  const raw = localStorage.getItem(RISK_STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as { result?: RiskAssessmentResult[] | RiskAssessmentResult };
    if (!parsed.result) return [];
    return Array.isArray(parsed.result) ? parsed.result : [parsed.result];
  } catch {
    return [];
  }
};

export const getLatestRiskAssessment = (): RiskAssessmentResult | null => {
  const assessments = getCachedRiskAssessments();
  if (assessments.length === 0) return null;

  return [...assessments].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )[0];
};
