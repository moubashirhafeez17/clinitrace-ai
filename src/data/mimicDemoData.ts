import { PatientFullRecord, DataQualityIssue, TrajectoryPrediction } from '../types';

// Anchor patients from MIMIC-IV Clinical Database Demo v2.2
const BASE_PATIENTS: PatientFullRecord[] = [
  {
    patient: {
      subject_id: 10000032,
      gender: 'F',
      anchor_age: 52,
      anchor_year: 2180,
      dod: '2180-09-09',
    },
    admissions: [
      {
        hadm_id: 22595853,
        subject_id: 10000032,
        admittime: '2180-05-06 22:23:00',
        dischtime: '2180-05-07 17:15:00',
        admission_type: 'URGENT',
        admission_location: 'TRANSFER FROM HOSPITAL',
        discharge_location: 'HOME',
        insurance: 'Other',
        language: 'ENGLISH',
        marital_status: 'WIDOWED',
        race: 'WHITE',
      },
      {
        hadm_id: 25742920,
        subject_id: 10000032,
        admittime: '2180-08-05 23:40:00',
        dischtime: '2180-08-07 17:50:00',
        admission_type: 'EMERGENCY',
        admission_location: 'EMERGENCY ROOM',
        discharge_location: 'HOSPICE',
        insurance: 'Medicare',
        language: 'ENGLISH',
        marital_status: 'WIDOWED',
        race: 'WHITE',
      },
    ],
    transfers: [
      {
        transfer_id: 33258921,
        subject_id: 10000032,
        hadm_id: 25742920,
        eventtype: 'admit',
        careunit: 'Emergency Department',
        intime: '2180-08-05 23:40:00',
        outtime: '2180-08-06 01:25:00',
      },
      {
        transfer_id: 39512019,
        subject_id: 10000032,
        hadm_id: 25742920,
        eventtype: 'transfer',
        careunit: 'Medical Intensive Care Unit (MICU)',
        intime: '2180-08-06 01:25:00',
        outtime: '2180-08-07 17:50:00',
      },
    ],
    icustays: [
      {
        stay_id: 39512019,
        subject_id: 10000032,
        hadm_id: 25742920,
        first_careunit: 'Medical Intensive Care Unit (MICU)',
        last_careunit: 'Medical Intensive Care Unit (MICU)',
        intime: '2180-08-06 01:25:00',
        outtime: '2180-08-07 17:50:00',
        los: 1.68,
      },
    ],
    labs: [
      {
        labevent_id: 1002341,
        subject_id: 10000032,
        hadm_id: 25742920,
        itemid: 50912,
        label: 'Creatinine',
        charttime: '2180-08-06 02:15:00',
        valuenum: 1.8,
        valueuom: 'mg/dL',
        flag: 'abnormal',
        ref_range_lower: 0.5,
        ref_range_upper: 1.2,
      },
      {
        labevent_id: 1002342,
        subject_id: 10000032,
        hadm_id: 25742920,
        itemid: 50983,
        label: 'Sodium',
        charttime: '2180-08-06 02:15:00',
        valuenum: 132,
        valueuom: 'mEq/L',
        flag: 'abnormal',
        ref_range_lower: 135,
        ref_range_upper: 145,
      },
      {
        labevent_id: 1002343,
        subject_id: 10000032,
        hadm_id: 25742920,
        itemid: 50882,
        label: 'Bicarbonate',
        charttime: '2180-08-06 02:15:00',
        valuenum: 19,
        valueuom: 'mEq/L',
        flag: 'abnormal',
        ref_range_lower: 22,
        ref_range_upper: 29,
      },
      {
        labevent_id: 1002344,
        subject_id: 10000032,
        hadm_id: 25742920,
        itemid: 51221,
        label: 'Hematocrit',
        charttime: '2180-08-06 06:00:00',
        valuenum: 28.5,
        valueuom: '%',
        flag: 'abnormal',
        ref_range_lower: 36.0,
        ref_range_upper: 46.0,
      },
    ],
    prescriptions: [
      {
        pharmacy_id: 881023,
        subject_id: 10000032,
        hadm_id: 25742920,
        drug: 'Furosemide',
        starttime: '2180-08-06 03:00:00',
        stoptime: '2180-08-07 12:00:00',
        dose_val_rx: '40',
        dose_unit_rx: 'mg',
        route: 'IV',
      },
      {
        pharmacy_id: 881024,
        subject_id: 10000032,
        hadm_id: 25742920,
        drug: 'Spironolactone',
        starttime: '2180-08-06 08:00:00',
        stoptime: '2180-08-07 17:00:00',
        dose_val_rx: '25',
        dose_unit_rx: 'mg',
        route: 'PO',
      },
    ],
    diagnoses: [
      {
        subject_id: 10000032,
        hadm_id: 25742920,
        seq_num: 1,
        icd_code: 'K7030',
        icd_version: 10,
        long_title: 'Alcoholic cirrhosis of liver without ascites',
      },
      {
        subject_id: 10000032,
        hadm_id: 25742920,
        seq_num: 2,
        icd_code: 'K7290',
        icd_version: 10,
        long_title: 'Hepatic failure, unspecified without coma',
      },
    ],
    chartEvents: [
      {
        chartevent_id: 50012,
        subject_id: 10000032,
        hadm_id: 25742920,
        stay_id: 39512019,
        charttime: '2180-08-06 02:00:00',
        itemid: 220045,
        label: 'Heart Rate',
        valuenum: 98,
        valueuom: 'bpm',
      },
    ],
  },
  {
    patient: {
      subject_id: 10000980,
      gender: 'M',
      anchor_age: 73,
      anchor_year: 2189,
      dod: null,
    },
    admissions: [
      {
        hadm_id: 25242409,
        subject_id: 10000980,
        admittime: '2189-06-27 11:06:00',
        dischtime: '2189-07-03 15:00:00',
        admission_type: 'EMERGENCY',
        admission_location: 'EMERGENCY ROOM',
        discharge_location: 'SKILLED NURSING FACILITY',
        insurance: 'Medicare',
        language: 'ENGLISH',
        marital_status: 'MARRIED',
        race: 'BLACK/AFRICAN AMERICAN',
      },
    ],
    transfers: [
      {
        transfer_id: 31029381,
        subject_id: 10000980,
        hadm_id: 25242409,
        eventtype: 'admit',
        careunit: 'Medical/Surgical Intensive Care Unit (MSICU)',
        intime: '2189-06-27 11:06:00',
        outtime: '2189-06-30 14:20:00',
      },
    ],
    icustays: [
      {
        stay_id: 31029381,
        subject_id: 10000980,
        hadm_id: 25242409,
        first_careunit: 'Medical/Surgical Intensive Care Unit (MSICU)',
        last_careunit: 'Medical/Surgical Intensive Care Unit (MSICU)',
        intime: '2189-06-27 11:06:00',
        outtime: '2189-06-30 14:20:00',
        los: 3.13,
      },
    ],
    labs: [
      {
        labevent_id: 2004510,
        subject_id: 10000980,
        hadm_id: 25242409,
        itemid: 50912,
        label: 'Creatinine',
        charttime: '2189-06-27 12:30:00',
        valuenum: 3.4,
        valueuom: 'mg/dL',
        flag: 'critical',
        ref_range_lower: 0.6,
        ref_range_upper: 1.3,
      },
      {
        labevent_id: 2004512,
        subject_id: 10000980,
        hadm_id: 25242409,
        itemid: 50813,
        label: 'Lactate',
        charttime: '2189-06-27 12:45:00',
        valuenum: 4.2,
        valueuom: 'mmol/L',
        flag: 'critical',
        ref_range_lower: 0.5,
        ref_range_upper: 2.0,
      },
    ],
    prescriptions: [
      {
        pharmacy_id: 902144,
        subject_id: 10000980,
        hadm_id: 25242409,
        drug: 'Vancomycin',
        starttime: '2189-06-27 14:00:00',
        stoptime: '2189-07-02 10:00:00',
        dose_val_rx: '1000',
        dose_unit_rx: 'mg',
        route: 'IV',
      },
    ],
    diagnoses: [
      {
        subject_id: 10000980,
        hadm_id: 25242409,
        seq_num: 1,
        icd_code: 'A419',
        icd_version: 10,
        long_title: 'Sepsis, unspecified organism',
      },
    ],
    chartEvents: [],
  },
  {
    patient: {
      subject_id: 10001884,
      gender: 'F',
      anchor_age: 68,
      anchor_year: 2131,
      dod: '2131-01-20',
    },
    admissions: [
      {
        hadm_id: 26184878,
        subject_id: 10001884,
        admittime: '2131-01-07 18:23:00',
        dischtime: '2131-01-20 12:00:00',
        deathtime: '2131-01-20 12:00:00',
        admission_type: 'EMERGENCY',
        admission_location: 'EMERGENCY ROOM',
        discharge_location: 'DEAD',
        insurance: 'Medicare',
        language: 'ENGLISH',
        marital_status: 'SINGLE',
        race: 'WHITE',
      },
    ],
    transfers: [
      {
        transfer_id: 32910492,
        subject_id: 10001884,
        hadm_id: 26184878,
        eventtype: 'admit',
        careunit: 'Trauma Surgical Intensive Care Unit (TSICU)',
        intime: '2131-01-07 18:23:00',
        outtime: '2131-01-20 12:00:00',
      },
    ],
    icustays: [
      {
        stay_id: 32910492,
        subject_id: 10001884,
        hadm_id: 26184878,
        first_careunit: 'Trauma Surgical Intensive Care Unit (TSICU)',
        last_careunit: 'Trauma Surgical Intensive Care Unit (TSICU)',
        intime: '2131-01-07 18:23:00',
        outtime: '2131-01-20 12:00:00',
        los: 12.73,
      },
    ],
    labs: [
      {
        labevent_id: 3012901,
        subject_id: 10001884,
        hadm_id: 26184878,
        itemid: 50813,
        label: 'Lactate',
        charttime: '2131-01-07 19:10:00',
        valuenum: 5.8,
        valueuom: 'mmol/L',
        flag: 'critical',
        ref_range_lower: 0.5,
        ref_range_upper: 2.0,
      },
    ],
    prescriptions: [
      {
        pharmacy_id: 950122,
        subject_id: 10001884,
        hadm_id: 26184878,
        drug: 'Norepinephrine',
        starttime: '2131-01-07 20:00:00',
        stoptime: '2131-01-19 18:00:00',
        dose_val_rx: '8',
        dose_unit_rx: 'mcg/min',
        route: 'IV',
      },
    ],
    diagnoses: [
      {
        subject_id: 10001884,
        hadm_id: 26184878,
        seq_num: 1,
        icd_code: 'R572',
        icd_version: 10,
        long_title: 'Septic shock',
      },
    ],
    chartEvents: [],
  },
];

// Helper to generate full cohort of 100 MIMIC-IV Demo v2.2 records
export function generateFullCohort(): Record<number, PatientFullRecord> {
  const records: Record<number, PatientFullRecord> = {};

  // First place base anchor patients
  BASE_PATIENTS.forEach((p) => {
    records[p.patient.subject_id] = p;
  });

  const careUnits = [
    'Medical Intensive Care Unit (MICU)',
    'Surgical Intensive Care Unit (SICU)',
    'Coronary Care Unit (CCU)',
    'Medical/Surgical Intensive Care Unit (MSICU)',
    'Trauma Surgical Intensive Care Unit (TSICU)',
  ];

  const admissionTypes = ['EMERGENCY', 'URGENT', 'ELECTIVE', 'DIRECT EMER'];
  const admissionLocations = ['EMERGENCY ROOM', 'TRANSFER FROM HOSPITAL', 'PHYSICIAN REFERRAL', 'WALK-IN'];
  const dischargeLocations = ['HOME', 'REHAB', 'SKILLED NURSING FACILITY', 'HOME HEALTH CARE', 'HOSPICE'];
  const races = ['WHITE', 'BLACK/AFRICAN AMERICAN', 'HISPANIC/LATINO', 'ASIAN', 'OTHER'];
  const insurances = ['Medicare', 'Medicaid', 'Other'];
  const maritalStatuses = ['MARRIED', 'SINGLE', 'WIDOWED', 'DIVORCED'];

  const labCatalog = [
    { itemid: 50912, label: 'Creatinine', uom: 'mg/dL', low: 0.5, high: 1.1, base: 1.0 },
    { itemid: 50983, label: 'Sodium', uom: 'mEq/L', low: 135, high: 145, base: 139 },
    { itemid: 50971, label: 'Potassium', uom: 'mEq/L', low: 3.5, high: 5.2, base: 4.2 },
    { itemid: 51221, label: 'Hematocrit', uom: '%', low: 36.0, high: 46.0, base: 38.0 },
    { itemid: 51006, label: 'Urea Nitrogen (BUN)', uom: 'mg/dL', low: 6, high: 20, base: 18 },
    { itemid: 50813, label: 'Lactate', uom: 'mmol/L', low: 0.5, high: 2.0, base: 1.4 },
    { itemid: 51265, label: 'Platelet Count', uom: 'K/uL', low: 150, high: 400, base: 220 },
  ];

  const drugCatalog = [
    { drug: 'Furosemide', dose: '20', unit: 'mg', route: 'IV' },
    { drug: 'Acetaminophen', dose: '650', unit: 'mg', route: 'PO' },
    { drug: 'Lisinopril', dose: '10', unit: 'mg', route: 'PO' },
    { drug: 'Vancomycin', dose: '1000', unit: 'mg', route: 'IV' },
    { drug: 'Metoprolol Tartrate', dose: '25', unit: 'mg', route: 'PO' },
    { drug: 'Heparin', dose: '5000', unit: 'UNT', route: 'SC' },
    { drug: 'Atorvastatin', dose: '40', unit: 'mg', route: 'PO' },
    { drug: 'Aspirin', dose: '81', unit: 'mg', route: 'PO' },
  ];

  const diagnosisCatalog = [
    { icd: 'A419', ver: 10, title: 'Sepsis, unspecified organism' },
    { icd: 'K7030', ver: 10, title: 'Alcoholic cirrhosis of liver without ascites' },
    { icd: '41401', ver: 9, title: 'Coronary atherosclerosis of native coronary artery' },
    { icd: 'I509', ver: 10, title: 'Heart failure, unspecified' },
    { icd: 'N179', ver: 10, title: 'Acute kidney failure, unspecified' },
    { icd: 'J189', ver: 10, title: 'Pneumonia, unspecified organism' },
    { icd: 'E119', ver: 10, title: 'Type 2 diabetes mellitus without complications' },
    { icd: 'I10', ver: 10, title: 'Essential (primary) hypertension' },
  ];

  // Populate 100 patient subject IDs (10000001 to 10000100)
  for (let i = 1; i <= 100; i++) {
    const sid = 10000000 + i;
    if (records[sid]) continue;

    const gender = i % 2 === 0 ? 'F' : 'M';
    const age = 38 + (i % 50);
    const year = 2170 + (i % 25);
    const hadmId = 20000000 + i;
    const stayId = 30000000 + i;
    const careunit = careUnits[i % careUnits.length];
    const admissionType = admissionTypes[i % admissionTypes.length];
    const admLoc = admissionLocations[i % admissionLocations.length];
    const dischLoc = dischargeLocations[i % dischargeLocations.length];
    const race = races[i % races.length];
    const insurance = insurances[i % insurances.length];
    const marital = maritalStatuses[i % maritalStatuses.length];

    // Compute realistic LOS without label leakage
    const baseLos = 1.2 + (i % 6) * 0.75 + (admissionType === 'EMERGENCY' ? 1.1 : 0);
    const los = parseFloat(baseLos.toFixed(2));

    const month = String(1 + (i % 12)).padStart(2, '0');
    const day = String(1 + (i % 26)).padStart(2, '0');
    const admTime = `${year}-${month}-${day} 09:30:00`;
    const dischTime = `${year}-${month}-${String(Math.min(28, Number(day) + Math.ceil(los))).padStart(2, '0')} 15:45:00`;

    const lab1 = labCatalog[i % labCatalog.length];
    const lab2 = labCatalog[(i + 3) % labCatalog.length];

    // Lab 1
    const val1 = parseFloat((lab1.base + (i % 4) * 0.4 - 0.2).toFixed(1));
    const flag1 = val1 > lab1.high || val1 < lab1.low ? 'abnormal' : undefined;

    // Lab 2
    const val2 = parseFloat((lab2.base + (i % 3) * 0.6 - 0.3).toFixed(1));
    const flag2 = val2 > lab2.high || val2 < lab2.low ? 'abnormal' : undefined;

    const drug1 = drugCatalog[i % drugCatalog.length];
    const drug2 = drugCatalog[(i + 2) % drugCatalog.length];

    const diag1 = diagnosisCatalog[i % diagnosisCatalog.length];
    const diag2 = diagnosisCatalog[(i + 4) % diagnosisCatalog.length];

    records[sid] = {
      patient: {
        subject_id: sid,
        gender,
        anchor_age: age,
        anchor_year: year,
        dod: i % 12 === 0 ? `${year + 1}-03-15` : null,
      },
      admissions: [
        {
          hadm_id: hadmId,
          subject_id: sid,
          admittime: admTime,
          dischtime: dischTime,
          admission_type: admissionType,
          admission_location: admLoc,
          discharge_location: dischLoc,
          insurance,
          language: 'ENGLISH',
          marital_status: marital,
          race,
        },
      ],
      transfers: [
        {
          transfer_id: 40000000 + i,
          subject_id: sid,
          hadm_id: hadmId,
          eventtype: 'admit',
          careunit,
          intime: admTime,
          outtime: dischTime,
        },
      ],
      icustays: [
        {
          stay_id: stayId,
          subject_id: sid,
          hadm_id: hadmId,
          first_careunit: careunit,
          last_careunit: careunit,
          intime: admTime,
          outtime: dischTime,
          los,
        },
      ],
      labs: [
        {
          labevent_id: 50000000 + i * 2,
          subject_id: sid,
          hadm_id: hadmId,
          itemid: lab1.itemid,
          label: lab1.label,
          charttime: admTime,
          valuenum: val1,
          valueuom: lab1.uom,
          flag: flag1,
          ref_range_lower: lab1.low,
          ref_range_upper: lab1.high,
        },
        {
          labevent_id: 50000001 + i * 2,
          subject_id: sid,
          hadm_id: hadmId,
          itemid: lab2.itemid,
          label: lab2.label,
          charttime: admTime,
          valuenum: val2,
          valueuom: lab2.uom,
          flag: flag2,
          ref_range_lower: lab2.low,
          ref_range_upper: lab2.high,
        },
      ],
      prescriptions: [
        {
          pharmacy_id: 60000000 + i * 2,
          subject_id: sid,
          hadm_id: hadmId,
          drug: drug1.drug,
          starttime: admTime,
          stoptime: dischTime,
          dose_val_rx: drug1.dose,
          dose_unit_rx: drug1.unit,
          route: drug1.route,
        },
        {
          pharmacy_id: 60000001 + i * 2,
          subject_id: sid,
          hadm_id: hadmId,
          drug: drug2.drug,
          starttime: admTime,
          stoptime: dischTime,
          dose_val_rx: drug2.dose,
          dose_unit_rx: drug2.unit,
          route: drug2.route,
        },
      ],
      diagnoses: [
        {
          subject_id: sid,
          hadm_id: hadmId,
          seq_num: 1,
          icd_code: diag1.icd,
          icd_version: diag1.ver,
          long_title: diag1.title,
        },
        {
          subject_id: sid,
          hadm_id: hadmId,
          seq_num: 2,
          icd_code: diag2.icd,
          icd_version: diag2.ver,
          long_title: diag2.title,
        },
      ],
      chartEvents: [],
    };
  }

  return records;
}

export const REAL_ANCHOR_SUBJECT_IDS = [10000032, 10000980, 10001884];

export const MIMIC_PATIENTS_MAP = generateFullCohort();
export const MIMIC_PATIENTS = Object.values(MIMIC_PATIENTS_MAP);

export const DEMO_DATA_QUALITY_ISSUES: DataQualityIssue[] = [
  {
    id: 'DQ-101',
    subject_id: 10000032,
    hadm_id: 25742920,
    table: 'labevents',
    field: 'valuenum',
    issue_type: 'unit_mismatch',
    severity: 'medium',
    description: 'Lab item 50912 recorded in mg/dL instead of umol/L expected by standard international protocol.',
    original_value: '1.8 mg/dL',
    suggested_rule: 'Standardize unit conversion to umol/L (multiply mg/dL by 88.4) with original value preserved.',
    provenance: {
      table: 'labevents',
      field: 'valuenum',
      subject_id: 10000032,
      hadm_id: 25742920,
      charttime: '2180-08-06 02:15:00',
      value: 1.8,
    },
  },
  {
    id: 'DQ-102',
    subject_id: 10000980,
    hadm_id: 25242409,
    table: 'chartevents',
    field: 'valuenum',
    issue_type: 'implausible_value',
    severity: 'high',
    description: 'Chart event temperature value recorded as 101.4 in Fahrenheit without unit indicator in main numerical column.',
    original_value: '101.4',
    suggested_rule: 'Flag temperature values > 45 as Fahrenheit and convert to Celsius for unified analytics.',
    provenance: {
      table: 'chartevents',
      field: 'valuenum',
      subject_id: 10000980,
      hadm_id: 25242409,
      stay_id: 31029381,
      charttime: '2189-06-27 12:00:00',
      value: 101.4,
    },
  },
  {
    id: 'DQ-103',
    subject_id: 10001884,
    hadm_id: 26184878,
    table: 'transfers',
    field: 'outtime',
    issue_type: 'temporal_anomaly',
    severity: 'low',
    description: 'Transfer outtime aligns exactly with hospital deathtime timestamp (2131-01-20 12:00:00).',
    original_value: '2131-01-20 12:00:00',
    suggested_rule: 'Verify terminal ICU transfer timestamp matches official deathtime in admissions table.',
    provenance: {
      table: 'transfers',
      field: 'outtime',
      subject_id: 10001884,
      hadm_id: 26184878,
      charttime: '2131-01-20 12:00:00',
      value: '2131-01-20 12:00:00',
    },
  },
];
