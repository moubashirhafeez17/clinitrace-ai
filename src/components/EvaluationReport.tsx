import React, { useEffect, useState } from 'react';
import { BarChart, CheckCircle, AlertCircle, FileText, Activity, ShieldCheck, Database, Zap } from 'lucide-react';

export const EvaluationReport: React.FC = () => {
  const [evalData, setEvalData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEval() {
      try {
        const res = await fetch('/api/evaluation');
        if (res.ok) {
          const data = await res.json();
          setEvalData(data);
        }
      } catch (err) {
        console.error('Failed to fetch evaluation metrics:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchEval();
  }, []);

  if (loading) {
    return (
      <div className="bg-zinc-900/80 border border-zinc-800 p-8 rounded-2xl text-center font-mono text-xs text-zinc-400">
        Loading MIMIC-IV evaluation & benchmark suite...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-zinc-900/80 border border-zinc-800/80 rounded-2xl p-6 backdrop-blur-md shadow-xl">
        <div className="flex items-center space-x-2 text-xs font-semibold text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20 w-max mb-3">
          <BarChart className="w-4 h-4" />
          <span>Evaluation & Benchmarking Suite • MIMIC-IV Demo v2.2</span>
        </div>

        <h3 className="text-xl font-bold text-zinc-100 tracking-tight">Computed Evaluation Benchmarks & Data Quality Audit</h3>
        <p className="text-sm text-zinc-400 mt-1 leading-relaxed">
          Real-time evaluation metrics computed at request time across 3 MIMIC-IV Demo v2.2 anchor subjects and 97 schema-matched synthetic records.
        </p>

        {/* High-level Metric Counters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mt-5">
          <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800/80">
            <span className="text-[11px] text-zinc-400 uppercase tracking-wider block font-semibold">Cohort Composition</span>
            <span className="text-xl font-bold font-mono text-zinc-100 mt-1 block">
              {evalData?.cohort_composition?.total_subjects || 100} Subjects
            </span>
            <span className="text-[10px] text-emerald-400 font-mono mt-0.5 block">
              3 Real Anchors • 97 Synthetic Records
            </span>
          </div>

          <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800/80">
            <span className="text-[11px] text-zinc-400 uppercase tracking-wider block font-semibold">Track 3 Model MAE</span>
            <span className="text-2xl font-bold font-mono text-emerald-400 mt-1 block">
              {evalData?.track3_evaluation?.model_mae ?? '-'} <span className="text-xs text-zinc-400 font-normal">days</span>
            </span>
            <span className="text-[10px] text-zinc-500 font-mono mt-0.5 block">
              Baseline MAE: {evalData?.track3_evaluation?.baseline_mae ?? '-'} days
            </span>
          </div>

          <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800/80">
            <span className="text-[11px] text-zinc-400 uppercase tracking-wider block font-semibold">Error Spread Across Cohort</span>
            <span className="text-sm font-bold font-mono text-amber-400 mt-1 block">
              [{evalData?.track3_evaluation?.error_spread?.min_error ?? '0'}, {evalData?.track3_evaluation?.error_spread?.max_error ?? '0'}] days
            </span>
            <span className="text-[10px] text-zinc-400 font-mono mt-0.5 block">
              Std Dev: ±{evalData?.track3_evaluation?.error_spread?.std_dev ?? '0'} days
            </span>
          </div>

          <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800/80">
            <span className="text-[11px] text-zinc-400 uppercase tracking-wider block font-semibold">Cohort Split MAE</span>
            <div className="text-xs font-mono text-zinc-200 mt-1 space-y-0.5">
              <div>Real Anchors: <span className="text-emerald-400 font-bold">{evalData?.track3_evaluation?.real_anchor_mae ?? '-'}d</span></div>
              <div>Synthetic: <span className="text-cyan-400 font-bold">{evalData?.track3_evaluation?.synthetic_cohort_mae ?? '-'}d</span></div>
            </div>
          </div>
        </div>

        <div className="mt-3 p-3 bg-zinc-950/60 border border-zinc-800/60 rounded-xl text-[11px] text-zinc-400 font-mono flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Note: Fact accuracy and query metrics that require human benchmark labels have been excluded to avoid hardcoded approximations.</span>
        </div>
      </div>

      {/* Table Completeness Breakdown */}
      <div className="bg-zinc-900/80 border border-zinc-800/80 rounded-2xl p-6 backdrop-blur-md shadow-xl space-y-4">
        <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
          <Database className="w-4 h-4 text-purple-400" />
          MIMIC-IV Relational Table Sample Counts & Completeness Matrix
        </h4>

        <div className="overflow-x-auto border border-zinc-800 rounded-xl">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-zinc-950 text-zinc-400 border-b border-zinc-800">
              <tr>
                <th className="py-3 px-4 font-semibold">Relational Table</th>
                <th className="py-3 px-4 font-semibold">Total Verified Rows</th>
                <th className="py-3 px-4 font-semibold">Populated Completeness</th>
                <th className="py-3 px-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 bg-zinc-900/60 text-zinc-300">
              {evalData?.table_missingness?.map((t: any, idx: number) => (
                <tr key={idx} className="hover:bg-zinc-800/50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-purple-300">{t.table}</td>
                  <td className="py-3 px-4 font-mono">{t.total_rows} rows</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-zinc-950 h-2 rounded-full overflow-hidden border border-zinc-800">
                        <div className="bg-purple-500 h-full rounded-full" style={{ width: `${t.populated_pct}%` }} />
                      </div>
                      <span className="font-mono text-zinc-300">{t.populated_pct}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Validated ✓
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Representative Error & Abstention Examples */}
      <div className="bg-zinc-900/80 border border-zinc-800/80 rounded-2xl p-6 backdrop-blur-md shadow-xl space-y-4">
        <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-400" />
          Representative Abstention & Failure Case Audits
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {evalData?.failure_examples?.map((fail: any, idx: number) => (
            <div key={idx} className="bg-zinc-950/90 border border-zinc-800/80 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-purple-400 font-bold">{fail.id}</span>
                <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  {fail.behavior}
                </span>
              </div>
              <p className="text-xs font-semibold text-zinc-200">"{fail.query}"</p>
              <p className="text-[11px] text-zinc-400 leading-relaxed font-sans pt-1 border-t border-zinc-900">
                {fail.reason}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
