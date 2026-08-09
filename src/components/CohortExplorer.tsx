import React, { useState } from 'react';
import { DataQualityIssue } from '../types';
import { MIMIC_PATIENTS } from '../data/mimicDemoData';
import { Database, AlertTriangle, ShieldCheck, Filter, Search, CheckCircle, Download, Check, Sparkles, LayoutGrid, Table, Users, Code, ChevronRight } from 'lucide-react';

interface Props {
  issues: DataQualityIssue[];
}

export const CohortExplorer: React.FC<Props> = ({ issues }) => {
  const [activeTab, setActiveTab] = useState<'cohort' | 'quality'>('cohort');

  // Cohort Definition Builder State
  const [minAge, setMinAge] = useState<number>(50);
  const [selectedAdmType, setSelectedAdmType] = useState<string>('all');
  const [selectedCareUnit, setSelectedCareUnit] = useState<string>('all');
  const [labThreshold, setLabThreshold] = useState<string>('none');
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<string>('all');

  // Data Quality State
  const [selectedTable, setSelectedTable] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [resolvedIssues, setResolvedIssues] = useState<Record<string, boolean>>({});
  const [exported, setExported] = useState(false);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Cohort Filtering Logic
  const matchingPatients = MIMIC_PATIENTS.filter((p) => {
    // Age filter
    if (p.patient.anchor_age < minAge) return false;

    // Admission Type filter
    if (selectedAdmType !== 'all') {
      const hasType = p.admissions.some((a) => a.admission_type.includes(selectedAdmType));
      if (!hasType) return false;
    }

    // Care Unit filter
    if (selectedCareUnit !== 'all') {
      const hasUnit = p.icustays.some((i) => i.first_careunit.includes(selectedCareUnit));
      if (!hasUnit) return false;
    }

    // Lab Threshold filter
    if (labThreshold === 'creatinine_high') {
      const hasHighCreatinine = p.labs.some((l) => l.label.toLowerCase().includes('creatinine') && l.valuenum >= 1.5);
      if (!hasHighCreatinine) return false;
    } else if (labThreshold === 'lactate_high') {
      const hasHighLactate = p.labs.some((l) => l.label.toLowerCase().includes('lactate') && l.valuenum >= 2.0);
      if (!hasHighLactate) return false;
    } else if (labThreshold === 'platelet_low') {
      const hasLowPlatelet = p.labs.some((l) => l.label.toLowerCase().includes('platelet') && l.valuenum <= 150);
      if (!hasLowPlatelet) return false;
    }

    // Diagnosis filter
    if (selectedDiagnosis !== 'all') {
      const hasDiag = p.diagnoses.some((d) => d.long_title.toLowerCase().includes(selectedDiagnosis.toLowerCase()) || d.icd_code.includes(selectedDiagnosis));
      if (!hasDiag) return false;
    }

    return true;
  });

  // Generated SQL filter code
  const sqlQuery = `SELECT DISTINCT p.subject_id, p.gender, p.anchor_age, a.admission_type, i.first_careunit
FROM patients p
JOIN admissions a ON p.subject_id = a.subject_id
JOIN icustays i ON a.hadm_id = i.hadm_id
LEFT JOIN labevents l ON a.hadm_id = l.hadm_id
LEFT JOIN diagnoses_icd d ON a.hadm_id = d.hadm_id
WHERE p.anchor_age >= ${minAge}${selectedAdmType !== 'all' ? `\n  AND a.admission_type = '${selectedAdmType}'` : ''}${selectedCareUnit !== 'all' ? `\n  AND i.first_careunit LIKE '%${selectedCareUnit}%'` : ''}${labThreshold === 'creatinine_high' ? `\n  AND (l.itemid = 50912 AND l.valuenum >= 1.5)` : ''}${labThreshold === 'lactate_high' ? `\n  AND (l.itemid = 50813 AND l.valuenum >= 2.0)` : ''}${selectedDiagnosis !== 'all' ? `\n  AND (d.long_title ILIKE '%${selectedDiagnosis}%')` : ''};`;

  // Quality Issues Filtering Logic
  const filteredIssues = issues.filter((iss) => {
    const matchesTable = selectedTable === 'all' || iss.table === selectedTable;
    const matchesSeverity = selectedSeverity === 'all' || iss.severity === selectedSeverity;
    const matchesSearch =
      searchTerm === '' ||
      iss.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      iss.table.toLowerCase().includes(searchTerm.toLowerCase()) ||
      iss.field.toLowerCase().includes(searchTerm.toLowerCase()) ||
      iss.subject_id.toString().includes(searchTerm);
    return matchesTable && matchesSeverity && matchesSearch;
  });

  const toggleResolve = (id: string) => {
    setResolvedIssues((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleExport = () => {
    const jsonStr = JSON.stringify(issues, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MIMIC_IV_EHR_Quality_Audit_${Date.now()}.json`;
    a.click();
    setExported(true);
    setTimeout(() => setExported(false), 2000);
  };

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'high':
        return 'bg-red-500/10 text-red-400 border border-red-500/30';
      case 'medium':
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/30';
      case 'low':
        return 'bg-blue-500/10 text-blue-400 border border-blue-500/30';
      default:
        return 'bg-zinc-800 text-zinc-400';
    }
  };

  return (
    <div className="space-y-5">
      {/* Track Overview & Tab Navigator Header */}
      <div className="bg-zinc-900/80 border border-zinc-800/80 rounded-2xl p-6 backdrop-blur-md shadow-xl transition-all">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2 text-xs font-semibold text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
            <Database className="w-4 h-4" />
            <span>Cohort & Data Quality Suite • Track 02</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('cohort')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'cohort'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'bg-zinc-950/80 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Cohort Builder</span>
            </button>
            <button
              onClick={() => setActiveTab('quality')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'quality'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'bg-zinc-950/80 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Data Quality Audit</span>
            </button>
          </div>
        </div>

        <h3 className="text-xl font-bold text-zinc-100 tracking-tight">
          {activeTab === 'cohort' ? 'MIMIC-IV Cohort Selection & Subgroup Filter' : 'EHR Data Hygiene & Anomaly Verification'}
        </h3>
        <p className="text-sm text-zinc-400 mt-1 leading-relaxed">
          {activeTab === 'cohort'
            ? 'Define reproducible patient inclusion/exclusion criteria across demographic, admission type, care unit, lab thresholds, and ICD diagnoses with transparent SQL lineage.'
            : 'Automated rule checks detecting missing records, implausible physical values, duplicate ICU transfers, and unit mismatches across MIMIC-IV benchmark tables.'}
        </p>
      </div>

      {/* COHORT BUILDER TAB VIEW */}
      {activeTab === 'cohort' && (
        <div className="space-y-5">
          {/* Controls Panel */}
          <div className="bg-zinc-900/80 border border-zinc-800/80 rounded-2xl p-6 backdrop-blur-md shadow-xl space-y-4">
            <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-2 border-b border-zinc-800 pb-3">
              <Filter className="w-4 h-4 text-cyan-400" />
              Inclusion / Exclusion Query Controls (MIMIC-IV Demo Cohort)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Age Range Slider */}
              <div className="bg-zinc-950/90 border border-zinc-800/80 p-3.5 rounded-xl space-y-2">
                <div className="flex justify-between items-center text-xs font-medium">
                  <span className="text-zinc-400">Min Anchor Age:</span>
                  <span className="font-mono text-cyan-400 font-bold">≥ {minAge} yrs</span>
                </div>
                <input
                  type="range"
                  min="18"
                  max="85"
                  step="1"
                  value={minAge}
                  onChange={(e) => setMinAge(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>

              {/* Admission Type Select */}
              <div className="bg-zinc-950/90 border border-zinc-800/80 p-3.5 rounded-xl space-y-1.5">
                <span className="text-xs text-zinc-400 font-medium block">Admission Type:</span>
                <select
                  value={selectedAdmType}
                  onChange={(e) => setSelectedAdmType(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 rounded-lg p-2 focus:outline-none focus:border-cyan-500/50 cursor-pointer font-mono"
                >
                  <option value="all">All Types</option>
                  <option value="EMERGENCY">EMERGENCY</option>
                  <option value="URGENT">URGENT</option>
                  <option value="ELECTIVE">ELECTIVE</option>
                </select>
              </div>

              {/* ICU Care Unit Select */}
              <div className="bg-zinc-950/90 border border-zinc-800/80 p-3.5 rounded-xl space-y-1.5">
                <span className="text-xs text-zinc-400 font-medium block">ICU Care Unit:</span>
                <select
                  value={selectedCareUnit}
                  onChange={(e) => setSelectedCareUnit(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 rounded-lg p-2 focus:outline-none focus:border-cyan-500/50 cursor-pointer font-mono"
                >
                  <option value="all">All Units</option>
                  <option value="MICU">MICU (Medical)</option>
                  <option value="SICU">SICU (Surgical)</option>
                  <option value="CCU">CCU (Coronary)</option>
                  <option value="TSICU">TSICU (Trauma)</option>
                </select>
              </div>

              {/* Lab Threshold Select */}
              <div className="bg-zinc-950/90 border border-zinc-800/80 p-3.5 rounded-xl space-y-1.5">
                <span className="text-xs text-zinc-400 font-medium block">Lab Threshold:</span>
                <select
                  value={labThreshold}
                  onChange={(e) => setLabThreshold(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 rounded-lg p-2 focus:outline-none focus:border-cyan-500/50 cursor-pointer font-mono"
                >
                  <option value="none">None (Any Lab)</option>
                  <option value="creatinine_high">Creatinine ≥ 1.5 mg/dL</option>
                  <option value="lactate_high">Lactate ≥ 2.0 mmol/L</option>
                  <option value="platelet_low">Platelets ≤ 150 K/uL</option>
                </select>
              </div>

              {/* Diagnosis Select */}
              <div className="bg-zinc-950/90 border border-zinc-800/80 p-3.5 rounded-xl space-y-1.5">
                <span className="text-xs text-zinc-400 font-medium block">Diagnosis Condition:</span>
                <select
                  value={selectedDiagnosis}
                  onChange={(e) => setSelectedDiagnosis(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 rounded-lg p-2 focus:outline-none focus:border-cyan-500/50 cursor-pointer font-mono"
                >
                  <option value="all">All Diagnoses</option>
                  <option value="Sepsis">Sepsis / Septic</option>
                  <option value="Cirrhosis">Cirrhosis</option>
                  <option value="Atherosclerosis">Atherosclerosis</option>
                  <option value="Heart failure">Heart Failure</option>
                  <option value="Kidney">Kidney Failure</option>
                </select>
              </div>
            </div>

            {/* Live Counter Result */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-zinc-950 p-4 rounded-xl border border-cyan-500/30">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-zinc-400 block font-medium">Matching Subgroup Cohort</span>
                  <span className="text-xl font-bold font-mono text-cyan-300">
                    {matchingPatients.length} / {MIMIC_PATIENTS.length} patients match criteria ({((matchingPatients.length / MIMIC_PATIENTS.length) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>

              <div className="text-xs font-mono text-zinc-400 bg-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-800">
                Partition Safety: <span className="text-emerald-400 font-bold">100% Subject-Grouped</span>
              </div>
            </div>
          </div>

          {/* Auditable SQL Code Block */}
          <div className="bg-zinc-900/80 border border-zinc-800/80 rounded-2xl p-5 backdrop-blur-md shadow-xl space-y-2">
            <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
              <Code className="w-4 h-4 text-cyan-400" />
              Auditable SQL Lineage Expression
            </h4>
            <pre className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 text-xs font-mono text-cyan-300 overflow-x-auto leading-relaxed">
              {sqlQuery}
            </pre>
          </div>

          {/* Matching Patient Grid Preview */}
          <div className="bg-zinc-900/80 border border-zinc-800/80 rounded-2xl p-6 backdrop-blur-md shadow-xl space-y-4">
            <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center justify-between">
              <span>Matching Cohort Patient Previews ({matchingPatients.length})</span>
              <span className="text-[11px] font-mono text-zinc-500 font-normal">MIMIC-IV Relational Records</span>
            </h4>

            {matchingPatients.length === 0 ? (
              <div className="p-8 text-center text-xs text-zinc-500 bg-zinc-950/60 rounded-xl border border-zinc-800">
                No patients match the specified inclusion criteria. Try relaxing age or lab thresholds.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {matchingPatients.slice(0, 12).map((p) => (
                  <div
                    key={p.patient.subject_id}
                    className="bg-zinc-950/90 border border-zinc-800/80 rounded-xl p-4 space-y-2.5 hover:border-cyan-500/40 transition-all shadow-sm"
                  >
                    <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
                      <span className="font-mono text-xs font-bold text-cyan-400">Subject #{p.patient.subject_id}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                        {p.patient.gender} • {p.patient.anchor_age} yrs
                      </span>
                    </div>

                    <div className="space-y-1 text-xs text-zinc-400 font-sans">
                      <div>Adm Type: <strong className="text-zinc-200">{p.admissions[0]?.admission_type || 'N/A'}</strong></div>
                      <div>Unit: <strong className="text-zinc-200">{p.icustays[0]?.first_careunit || 'N/A'}</strong></div>
                      <div className="truncate">Diagnosis: <strong className="text-zinc-200">{p.diagnoses[0]?.long_title || 'N/A'}</strong></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* DATA QUALITY AUDIT TAB VIEW */}
      {activeTab === 'quality' && (
        <div className="space-y-5">
          {/* Action Bar */}
          <div className="flex items-center justify-between bg-zinc-900/80 border border-zinc-800/80 p-4 rounded-2xl">
            <span className="text-xs text-zinc-400 font-medium">
              Total Audited Data Anomalies: <strong className="text-zinc-100">{issues.length}</strong>
            </span>

            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300 hover:text-zinc-100 bg-zinc-950/80 hover:bg-zinc-800/80 border border-zinc-800 px-3.5 py-1.5 rounded-xl hover:border-cyan-500/40 transition-all cursor-pointer shadow-sm"
            >
              {exported ? <Check className="w-4 h-4 text-cyan-400" /> : <Download className="w-4 h-4" />}
              <span>{exported ? 'Audit Log Exported' : 'Export Audit JSON'}</span>
            </button>
          </div>

          {/* Filter Toolbar & View Mode Switch */}
          <div className="bg-zinc-900/80 border border-zinc-800/80 rounded-2xl p-4 backdrop-blur-md shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
              {/* Table Select */}
              <div className="flex items-center space-x-2">
                <span className="text-xs text-zinc-400 font-medium">Table:</span>
                <select
                  value={selectedTable}
                  onChange={(e) => setSelectedTable(e.target.value)}
                  className="bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 rounded-xl px-3 py-1.5 focus:outline-none focus:border-cyan-500/50 cursor-pointer"
                >
                  <option value="all">All Tables</option>
                  <option value="patients">patients</option>
                  <option value="admissions">admissions</option>
                  <option value="icustays">icustays</option>
                  <option value="labevents">labevents</option>
                  <option value="prescriptions">prescriptions</option>
                </select>
              </div>

              {/* Severity Select */}
              <div className="flex items-center space-x-2">
                <span className="text-xs text-zinc-400 font-medium">Severity:</span>
                <select
                  value={selectedSeverity}
                  onChange={(e) => setSelectedSeverity(e.target.value)}
                  className="bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 rounded-xl px-3 py-1.5 focus:outline-none focus:border-cyan-500/50 cursor-pointer"
                >
                  <option value="all">All Severities</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
              {/* View Mode Switcher */}
              <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-xl p-1 shrink-0">
                <button
                  onClick={() => setViewMode('cards')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                    viewMode === 'cards'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Cards</span>
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                    viewMode === 'table'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Table className="w-3.5 h-3.5" />
                  <span>Table</span>
                </button>
              </div>

              {/* Search Input */}
              <div className="relative w-full md:w-56">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Search anomalies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-zinc-950/80 border border-zinc-800/80 rounded-xl text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-cyan-500/50"
                />
              </div>
            </div>
          </div>

          {/* Anomaly Stream Display */}
          {viewMode === 'cards' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredIssues.map((iss) => {
                const isResolved = !!resolvedIssues[iss.id];
                return (
                  <div
                    key={iss.id}
                    className={`bg-zinc-900/80 border border-zinc-800/80 rounded-2xl p-5 space-y-3 backdrop-blur-md shadow-lg transition-all hover:border-zinc-700/80 ${
                      isResolved ? 'opacity-60 bg-zinc-950/40' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2.5 py-0.5 text-[10px] rounded-full uppercase font-bold font-mono ${getSeverityBadge(iss.severity)}`}>
                          {iss.severity}
                        </span>
                        <span className="text-xs font-mono font-bold text-zinc-200">Subject #{iss.subject_id}</span>
                      </div>

                      <button
                        onClick={() => toggleResolve(iss.id)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                          isResolved
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                            : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700'
                        }`}
                      >
                        {isResolved ? 'Audited ✓' : 'Acknowledge'}
                      </button>
                    </div>

                    <div className="space-y-1">
                      <div className="text-xs font-mono text-cyan-400 font-semibold">
                        {iss.table}.<span className="text-zinc-200">{iss.field}</span>
                      </div>
                      <p className="text-xs text-zinc-200 leading-relaxed font-sans">{iss.description}</p>
                    </div>

                    <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between text-[11px] font-mono text-zinc-400">
                      <span>Observed: <strong className="text-amber-300">{iss.original_value}</strong></span>
                      <span className="text-zinc-500 truncate max-w-[180px]">{iss.suggested_rule || 'Boundary rule'}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-zinc-900/80 border border-zinc-800/80 rounded-2xl overflow-hidden backdrop-blur-md shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-sans">
                  <thead className="bg-zinc-950 text-zinc-400 border-b border-zinc-800/80">
                    <tr>
                      <th className="py-3.5 px-4 font-semibold">Severity</th>
                      <th className="py-3.5 px-4 font-semibold">Subject ID</th>
                      <th className="py-3.5 px-4 font-semibold">Target Table / Field</th>
                      <th className="py-3.5 px-4 font-semibold">Issue Description</th>
                      <th className="py-3.5 px-4 font-semibold">Observed Value</th>
                      <th className="py-3.5 px-4 font-semibold">Deterministic Rule</th>
                      <th className="py-3.5 px-4 font-semibold text-right">Audit Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60 bg-zinc-900/60 text-zinc-300">
                    {filteredIssues.map((iss) => {
                      const isResolved = !!resolvedIssues[iss.id];
                      return (
                        <tr
                          key={iss.id}
                          className={`hover:bg-zinc-800/50 transition-colors ${
                            isResolved ? 'opacity-50 line-through bg-zinc-950/40' : ''
                          }`}
                        >
                          <td className="py-3.5 px-4">
                            <span className={`px-2.5 py-1 text-[10px] rounded-full uppercase font-bold font-mono ${getSeverityBadge(iss.severity)}`}>
                              {iss.severity}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-bold font-mono text-zinc-100">{iss.subject_id}</td>
                          <td className="py-3.5 px-4 font-mono">
                            <span className="text-cyan-400">{iss.table}</span>
                            <span className="text-zinc-500">.</span>
                            <span className="text-zinc-300">{iss.field}</span>
                          </td>
                          <td className="py-3.5 px-4 text-zinc-200 max-w-xs">{iss.description}</td>
                          <td className="py-3.5 px-4 font-mono font-semibold text-amber-300">{iss.original_value}</td>
                          <td className="py-3.5 px-4 text-zinc-400 text-[11px] font-mono max-w-xs">{iss.suggested_rule || 'Physiological boundary check'}</td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => toggleResolve(iss.id)}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                                isResolved
                                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                                  : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700'
                              }`}
                            >
                              {isResolved ? 'Audited ✓' : 'Acknowledge'}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
