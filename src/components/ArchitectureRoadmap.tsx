import React from 'react';
import { Network, CheckCircle2, ShieldCheck, Code, Cpu, Layout, FileText } from 'lucide-react';

export const ArchitectureRoadmap: React.FC = () => {
  const phases = [
    {
      phase: 'Phase 1',
      title: 'Environment Setup & MIMIC-IV Data Ingestion',
      status: 'Completed',
      icon: Code,
      items: [
        'Ingest 100 deidentified patient records from MIMIC-IV Demo v2.2',
        'Map 8 relational tables: patients, admissions, transfers, icustays, labevents, prescriptions, diagnoses_icd, chartevents',
        'Enforce date-shifted time-series ordering and subject_id partition safety'
      ]
    },
    {
      phase: 'Phase 2',
      title: 'Backend Relational Logic & Data Lineage Engine',
      status: 'Completed',
      icon: Cpu,
      items: [
        'Express.js server API endpoints (/api/patients, /api/qa, /api/health)',
        'Row-level data provenance tracker linking every statement to source table, field, charttime, and subject_id',
        'Reversible data quality rule engine for unit mismatches and implausible chart events'
      ]
    },
    {
      phase: 'Phase 3',
      title: 'Gemini AI API Evidence & Fact Verification',
      status: 'Completed',
      icon: Network,
      items: [
        'Server-side @google/genai integration with gemini-3.6-flash',
        'Grounded prompt engineering restricting outputs strictly to provided relational rows',
        'Abstention detector flagging ungrounded or out-of-scope medical queries'
      ]
    },
    {
      phase: 'Phase 4',
      title: 'HCI React Frontend & Evaluation Suite',
      status: 'Completed',
      icon: Layout,
      items: [
        'React + Tailwind CSS interactive dashboard adhering to Norman\'s visibility principles',
        'Fitts\' law optimized interactive controls and filter tabs',
        'Prominent mandatory safety notice: "Research and educational prototype only. Not for clinical use."'
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-4">
          <div className="p-2.5 rounded-xl bg-slate-100 text-slate-800">
            <Network className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Sofstica AI Hackathon: 4-Phase System Architecture Blueprint
            </h2>
            <p className="text-xs text-slate-500">
              High-level technical roadmap for building a transparent, verifiable AI clinical prototype on MIMIC-IV Demo v2.2.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {phases.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div key={idx} className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-teal-100 text-teal-800">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-teal-800 uppercase tracking-wider">
                      {p.phase}
                    </span>
                  </div>

                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> {p.status}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-900">
                  {p.title}
                </h3>

                <ul className="space-y-1.5 text-xs text-slate-600">
                  {p.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="flex items-start gap-1.5 leading-relaxed">
                      <span className="text-teal-600 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      {/* Deliverables Checklist */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <FileText className="w-4 h-4 text-teal-600" /> Mandatory Hackathon Deliverables Compliance
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <span className="text-slate-400 block text-[10px]">Dataset</span>
            <span className="font-bold text-slate-800">MIMIC-IV Demo v2.2 (100 Patients)</span>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <span className="text-slate-400 block text-[10px]">Safety Banner</span>
            <span className="font-bold text-emerald-700">Prominently Displayed</span>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <span className="text-slate-400 block text-[10px]">Data Lineage</span>
            <span className="font-bold text-teal-700">100% Table & Row Provenance</span>
          </div>
        </div>
      </div>
    </div>
  );
};
