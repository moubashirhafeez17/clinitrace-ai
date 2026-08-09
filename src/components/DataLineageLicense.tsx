import React from 'react';
import { Database, ShieldCheck, FileText, ExternalLink, Calendar, Lock } from 'lucide-react';

export const DataLineageLicense: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Primary Container */}
      <div className="bg-zinc-900/80 border border-zinc-800/80 rounded-2xl p-6 backdrop-blur-md shadow-xl space-y-5">
        <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 w-max">
          <ShieldCheck className="w-4 h-4" />
          <span>Data Provenance & Compliance Attribution</span>
        </div>

        <div>
          <h3 className="text-xl font-bold text-zinc-100 tracking-tight">MIMIC-IV Clinical Database Demo v2.2 Citation & License</h3>
          <p className="text-sm text-zinc-400 mt-1 leading-relaxed">
            All clinical data processed by ClinTrace originates from the official MIMIC-IV Clinical Database Demo v2.2, hosted on PhysioNet under credentialed research guidelines.
          </p>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
            <span className="text-[11px] text-zinc-400 uppercase tracking-wider block font-semibold">Primary Dataset</span>
            <span className="text-sm font-bold font-mono text-zinc-100 mt-1 block">MIMIC-IV Demo v2.2</span>
            <span className="text-[11px] text-zinc-400 mt-0.5 block font-medium">3 Anchors + 97 Synthetic</span>
          </div>

          <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
            <span className="text-[11px] text-zinc-400 uppercase tracking-wider block font-semibold">Permanent DOI</span>
            <a
              href="https://doi.org/10.13026/dp1f-ex47"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold font-mono text-emerald-400 hover:text-emerald-300 mt-1 flex items-center gap-1 group"
            >
              <span>10.13026/dp1f-ex47</span>
              <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </a>
            <span className="text-[11px] text-zinc-500 mt-0.5 block">PhysioNet Repository</span>
          </div>

          <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
            <span className="text-[11px] text-zinc-400 uppercase tracking-wider block font-semibold">Governing License</span>
            <span className="text-xs font-bold font-mono text-emerald-400 mt-1 block">PhysioNet License v1.5</span>
            <span className="text-[11px] text-zinc-500 mt-0.5 block">Credentialed Health Data</span>
          </div>

          <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
            <span className="text-[11px] text-zinc-400 uppercase tracking-wider block font-semibold">De-identification</span>
            <span className="text-xs font-bold font-mono text-amber-400 mt-1 block flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> Date-Shifted Chronology
            </span>
            <span className="text-[11px] text-zinc-500 mt-0.5 block">HIPAA Safe Harbor</span>
          </div>
        </div>

        {/* Date Shifting Disclosure Box */}
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 space-y-1.5 text-xs text-amber-200">
          <div className="flex items-center gap-2 font-bold font-mono uppercase text-amber-300">
            <Lock className="w-4 h-4" /> Date Shifting Protocol Notice
          </div>
          <p className="leading-relaxed">
            Per PhysioNet de-identification protocol, all timestamps and calendar dates in MIMIC-IV Demo v2.2 have been randomly shifted into future centuries (e.g., years 2180-2189) while preserving exact relative time intervals (delta hours/days between admissions, transfers, and labs) for individual patients. Real-world calendar chronology or cross-patient seasonal patterns must not be inferred.
          </p>
        </div>

        {/* Synthetic Data Disclosure Box */}
        <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-4 space-y-1.5 text-xs text-cyan-200">
          <div className="flex items-center gap-2 font-bold font-mono uppercase text-cyan-300">
            <Database className="w-4 h-4" /> Synthetic Data Disclosure Notice
          </div>
          <p className="leading-relaxed text-zinc-300 font-sans">
            Per competition brief guidelines, 3 anchor subject records (Subject IDs #10000032, #10000980, #10001884) originate directly from authentic MIMIC-IV Demo v2.2 credentialed dataset entries. The remaining 97 cohort records were synthetically generated using modular arithmetic and schema-matched value distributions to demonstrate software scalability. Synthetic data is presented for user interface testing and search navigation only, and must not be interpreted as real patient evidence or used to claim real-world model accuracy.
          </p>
        </div>

        {/* Required Prominent Research Disclaimer */}
        <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 text-xs text-zinc-300 space-y-1">
          <div className="font-bold text-emerald-400 font-mono uppercase">
            Mandatory Research Disclaimer:
          </div>
          <p className="text-zinc-400 leading-relaxed font-sans">
            "Research and educational prototype only. Not for clinical use. Do not use for diagnosis, treatment, triage, or emergency decisions."
          </p>
        </div>
      </div>
    </div>
  );
};
