export interface Metric {
  label: string;
  value: string | number;
  unit?: string;
  status: 'optimal' | 'reducing' | 'warning' | 'critical' | 'stable';
  icon: string;
}

export interface Nudge {
  id: string;
  title: string;
  description: string;
  timestamp: string; // e.g., "Today, 10:15"
  type: 'pending' | 'resolved' | 'info';
  icon: string;
  actionText?: string;
  gene?: string;
}

export interface Variant {
  id: string;
  gene: string;
  name: string;
  riskLevel: 'high' | 'moderate' | 'low' | 'optimal';
  description: string;
  details: {
    label: string;
    value: string;
  }[];
  icon: string;
}
