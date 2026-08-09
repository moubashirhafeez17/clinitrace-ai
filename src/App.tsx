import React, { useState, useEffect } from 'react';
import { HackathonTrack, PatientFullRecord, DataQualityIssue, TrajectoryPrediction } from './types';
import { REAL_ANCHOR_SUBJECT_IDS } from './data/mimicDemoData';
import { TrackSelector } from './components/TrackSelector';
import { SafetyNotice } from './components/SafetyNotice';
import { PatientTimeline } from './components/PatientTimeline';
import { EvidenceQA } from './components/EvidenceQA';
import { CohortExplorer } from './components/CohortExplorer';
import { TrajectoryModel } from './components/TrajectoryModel';
import { EvaluationReport } from './components/EvaluationReport';
import { DataLineageLicense } from './components/DataLineageLicense';
import { ArchitectureRoadmap } from './components/ArchitectureRoadmap';
import { Stethoscope, Search, RefreshCw, ShieldCheck } from 'lucide-react';

export function App() {
  const [activeTrack, setActiveTrack] = useState<HackathonTrack>('track1');
  const [selectedSubjectId, setSelectedSubjectId] = useState<number>(10000032);
  const [availableSubjects, setAvailableSubjects] = useState<number[]>([10000032, 10000980, 10001217, 10001884, 10002013]);
  const [patientRecord, setPatientRecord] = useState<PatientFullRecord | null>(null);
  const [qualityIssues, setQualityIssues] = useState<DataQualityIssue[]>([]);
  const [trajectoryPrediction, setTrajectoryPrediction] = useState<TrajectoryPrediction | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchPatientsList() {
      try {
        const res = await fetch('/api/patients');
        if (res.ok) {
          const list = await res.json();
          if (Array.isArray(list) && list.length > 0) {
            setAvailableSubjects(list);
          }
        }
      } catch (err) {
        console.error('Failed to fetch patient list:', err);
      }
    }
    fetchPatientsList();
  }, []);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [patRes, qualRes, trajRes] = await Promise.all([
          fetch(`/api/patient/${selectedSubjectId}`),
          fetch(`/api/quality-issues`),
          fetch(`/api/trajectory/${selectedSubjectId}`),
        ]);

        if (patRes.ok) {
          const pData = await patRes.json();
          setPatientRecord(pData);
        }
        if (qualRes.ok) {
          const qData = await qualRes.json();
          setQualityIssues(qData);
        }
        if (trajRes.ok) {
          const tData = await trajRes.json();
          setTrajectoryPrediction(tData);
        }
      } catch (err) {
        console.error('Error fetching data from API:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [selectedSubjectId]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-500 selection:text-zinc-950 flex flex-col relative bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900/40 via-zinc-950 to-zinc-950">
      {/* Top Header Navigation */}
      <header className="bg-zinc-900/80 backdrop-blur-md border-b border-zinc-800/80 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3.5">
            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 shadow-sm">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2.5">
                <h1 className="text-base font-bold tracking-tight text-zinc-100 font-sans">
                  MIMIC-IV Clinical Evaluation Platform
                </h1>
                <span className="px-2.5 py-0.5 text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">
                  v2.2 Demo ({availableSubjects.length} Patients)
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Deterministic Relational Table Joining • EHR Quality Audit • Trajectory Modeling
              </p>
            </div>
          </div>

          {/* Subject Selector dropdown */}
          <div className="flex items-center space-x-2.5 bg-zinc-950/80 border border-zinc-800 px-3.5 py-2 rounded-xl shadow-inner hover:border-zinc-700 transition-colors">
            <label className="text-xs text-zinc-400 flex items-center gap-1.5 font-medium">
              <Search className="w-3.5 h-3.5 text-emerald-400" />
              <span>Subject:</span>
            </label>
            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(Number(e.target.value))}
              className="bg-transparent text-xs font-mono font-bold text-emerald-400 focus:outline-none cursor-pointer"
            >
              {availableSubjects.map((sid) => {
                const isReal = REAL_ANCHOR_SUBJECT_IDS.includes(sid);
                return (
                  <option key={sid} value={sid} className="bg-zinc-900 text-zinc-200 font-mono">
                    #{sid} {isReal ? '• [REAL MIMIC-IV]' : '• [SYNTHETIC]'}
                  </option>
                );
              })}
            </select>
            {REAL_ANCHOR_SUBJECT_IDS.includes(selectedSubjectId) ? (
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-300 rounded border border-emerald-500/30 flex items-center gap-1 shadow-xs">
                <ShieldCheck className="w-3 h-3 text-emerald-400" /> REAL
              </span>
            ) : (
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-zinc-800/80 text-zinc-400 rounded border border-zinc-700 flex items-center gap-1">
                SYNTHETIC
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Competition Track Selector Tabs */}
      <TrackSelector activeTrack={activeTrack} onSelectTrack={setActiveTrack} />

      {/* Main Workspace Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex-1 w-full space-y-6">
        {/* Safety Notice Banner */}
        <SafetyNotice />

        {/* Loading state indicator */}
        {loading && activeTrack !== 'evaluation' && activeTrack !== 'lineage' && activeTrack !== 'architecture' && (
          <div className="bg-zinc-900/80 border border-zinc-800/80 rounded-2xl p-12 text-center space-y-3 backdrop-blur-md shadow-xl">
            <RefreshCw className="w-7 h-7 text-emerald-400 animate-spin mx-auto" />
            <p className="text-xs font-mono text-zinc-400">
              Querying MIMIC-IV relational database record for Subject #{selectedSubjectId}...
            </p>
          </div>
        )}

        {/* Content Views by Track */}
        {activeTrack === 'evaluation' && <EvaluationReport />}
        {activeTrack === 'lineage' && <DataLineageLicense />}
        {activeTrack === 'architecture' && <ArchitectureRoadmap />}

        {(!loading || activeTrack === 'track2') && patientRecord && (
          <div className="space-y-6">
            {activeTrack === 'track1' && (
              <div className="space-y-6">
                <EvidenceQA record={patientRecord} />
                <PatientTimeline record={patientRecord} />
              </div>
            )}

            {activeTrack === 'track2' && (
              <CohortExplorer issues={qualityIssues} />
            )}

            {activeTrack === 'track3' && trajectoryPrediction && (
              <TrajectoryModel prediction={trajectoryPrediction} />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-zinc-900/80 border-t border-zinc-800/80 py-4 px-6 text-center text-xs text-zinc-500 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            MIMIC-IV Clinical Suite • Relational Grounding Active
          </span>
          <span className="font-mono text-[11px] text-zinc-400">
            PhysioNet Credentialed Access Compliant • MIMIC-IV Demo v2.2
          </span>
        </div>
      </footer>
    </div>
  );
}

export default App;
