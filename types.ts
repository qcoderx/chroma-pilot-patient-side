// Onboarding Question Types
export type QuestionType = 'boolean' | 'slider' | 'choice';

export interface Question {
  id: number;
  text: string;
  type: QuestionType;
  module: 1 | 2 | 3; // 1: Safety Shield, 2: Ancestral Radar, 3: Live Context
  critical?: boolean;
  choices?: string[];
  sliderConfig?: {
    min: number;
    max: number;
    unit: string;
    step: number;
  };
}

export interface UserAnswer {
  questionId: number;
  answer: boolean | number | string;
  timestamp: Date;
}

export interface OnboardingProgress {
  currentModule: 1 | 2 | 3;
  currentQuestionIndex: number;
  answers: UserAnswer[];
  completed: boolean;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  earned: boolean;
  earnedAt?: Date;
}

export interface UserProfile {
  id: string;
  level: number;
  xp: number;
  badges: Badge[];
  onboardingComplete: boolean;
  phenotypeProfile?: {
    safetyScore: number;
    heritageRisk: 'low' | 'moderate' | 'high';
    lifestyleIndex: number;
  };
}
