export type HackathonTrack = 'track1' | 'track2' | 'track3' | 'evaluation' | 'lineage' | 'architecture';

export interface SourceProvenance {
  table: string;
  field: string;
  subject_id: number;
  hadm_id?: number;
  stay_id?: number;
  charttime?: string;
  value: string | number;
}

export interface Patient {
  subject_id: number;
  gender: 'M' | 'F';
  anchor_age: number;
  anchor_year: number;
  dod?: string | null;
}

export interface Admission {
  hadm_id: number;
  subject_id: number;
  admittime: string;
  dischtime: string;
  deathtime?: string | null;
  admission_type: string;
  admission_location: string;
  discharge_location: string;
  insurance: string;
  language: string;
  marital_status: string;
  race: string;
}

export interface Transfer {
  transfer_id: number;
  subject_id: number;
  hadm_id: number;
  eventtype: 'admit' | 'transfer' | 'discharge';
  careunit: string;
  intime: string;
  outtime?: string;
}

export interface ICUStay {
  stay_id: number;
  subject_id: number;
  hadm_id: number;
  first_careunit: string;
  last_careunit: string;
  intime: string;
  outtime: string;
  los: number;
}

export interface LabEvent {
  labevent_id: number;
  subject_id: number;
  hadm_id?: number;
  itemid: number;
  label: string;
  charttime: string;
  valuenum: number;
  valueuom: string;
  flag?: 'abnormal' | 'normal' | 'critical';
  ref_range_lower?: number;
  ref_range_upper?: number;
}

export interface Prescription {
  pharmacy_id: number;
  subject_id: number;
  hadm_id: number;
  drug: string;
  starttime: string;
  stoptime: string;
  dose_val_rx: string;
  dose_unit_rx: string;
  route: string;
}

export interface DiagnosisICD {
  subject_id: number;
  hadm_id: number;
  seq_num: number;
  icd_code: string;
  icd_version: number;
  long_title: string;
}

export interface ChartEvent {
  chartevent_id: number;
  subject_id: number;
  hadm_id: number;
  stay_id: number;
  charttime: string;
  itemid: number;
  label: string;
  valuenum: number;
  valueuom: string;
}

export interface PatientFullRecord {
  patient: Patient;
  admissions: Admission[];
  transfers: Transfer[];
  icustays: ICUStay[];
  labs: LabEvent[];
  prescriptions: Prescription[];
  diagnoses: DiagnosisICD[];
  chartEvents: ChartEvent[];
}

export interface DataQualityIssue {
  id: string;
  subject_id: number;
  hadm_id?: number;
  table: string;
  field: string;
  issue_type: 'missing_value' | 'implausible_value' | 'duplicate_record' | 'unit_mismatch' | 'temporal_anomaly';
  severity: 'low' | 'medium' | 'high';
  description: string;
  original_value: string;
  suggested_rule?: string;
  provenance: SourceProvenance;
}

export interface TrajectoryPrediction {
  subject_id: number;
  hadm_id: number;
  stay_id: number;
  index_time: string;
  actual_los: number;
  baseline_prediction: number;
  model_prediction: number;
  uncertainty_range: [number, number];
  feature_contributions: { feature: string; impact: number; source: SourceProvenance }[];
}

export interface QAResponse {
  answer: string;
  supported: boolean;
  source?: 'gemini' | 'deterministic';
  abstain_reason?: string;
  evidence: SourceProvenance[];
}
