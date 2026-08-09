import React, { useState } from 'react';
import { TrajectoryPrediction } from '../types';
import { Activity, Clock, AlertCircle, Database, BarChart2, ShieldAlert, Sliders, RefreshCw, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
  prediction: TrajectoryPrediction;
}

export const TrajectoryModel: React.FC<Props> = ({ prediction }) => {
  const [labAdjustment, setLabAdjustment] = useState<number>(0);
  const [ageAdjustment, setAgeAdjustment] = useState<number>(0);
  const [showSimulator, setShowSimulator] = useState<boolean>(false);

  // Compute simulated prediction
  const simulatedOffset = (labAdjustment * 0.4) + (ageAdjustment * 0.2);
  const simulatedLos = (prediction.model_prediction + simulatedOffset).toFixed(1);

  const resetSimulation = () => {
    setLabAdjustment(0);
    setAgeAdjustment(0);
  };

  return (
    <div className="space-y-5">
      {/* Research Model Header Card */}
      <div className="bg-zinc-900/80 border border-zinc-800/80 rounded-2xl p-6 backdrop-blur-md shadow-xl transition-all">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            <Activity className="w-4 h-4" />
            <span>Research Risk & Trajectory Modeling • Track 03</span>
          </div>
          <span className="text-xs font-mono text-zinc-500">MIMIC-IV Benchmarking</span>
        </div>

        <h3 className="text-xl font-bold text-zinc-100 tracking-tight">ICU Length-of-Stay (LOS) Trajectory Prediction</h3>
        <p className="text-sm text-zinc-400 mt-1 leading-relaxed">
          Surrogate regression benchmarking using first 24h MIMIC-IV chart events and labs. Displays baseline vs. feature-derived LOS estimates with complete provenance.
        </p>

        {/* Prediction Comparison Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5 bg-zinc-950/90 border border-zinc-800/80 p-5 rounded-xl shadow-inner">
          <div>
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">Actual Observed LOS</span>
            <span className="text-3xl font-bold font-mono text-zinc-100 mt-1 block">
              {prediction.actual_los} <span className="text-xs text-zinc-400 font-normal">days</span>
            </span>
          </div>

          <div>
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">Baseline Cohort Average</span>
            <span className="text-3xl font-bold font-mono text-zinc-400 mt-1 block">
              {prediction.baseline_prediction} <span className="text-xs text-zinc-500 font-normal">days</span>
            </span>
          </div>

          <div className="border-l border-zinc-800/80 pl-4 sm:pl-6">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Model Trajectory Estimate
            </span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-3xl font-bold font-mono text-emerald-400">
                {simulatedLos}
              </span>
              <span className="text-xs text-emerald-500/80">days</span>
              {(labAdjustment !== 0 || ageAdjustment !== 0) && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Simulated
                </span>
              )}
            </div>
            <span className="text-xs font-mono text-zinc-400 block mt-1">
              Uncertainty Interval: [{prediction.uncertainty_range[0]} - {prediction.uncertainty_range[1]} days]
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Scenario Simulator Controls */}
      <div className="bg-zinc-900/80 border border-zinc-800/80 rounded-2xl p-6 backdrop-blur-md shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-zinc-800/80">
          <button
            onClick={() => setShowSimulator(!showSimulator)}
            className="flex items-center gap-2 text-xs font-semibold text-zinc-300 hover:text-emerald-400 transition-colors cursor-pointer"
          >
            <Sliders className="w-4 h-4 text-emerald-400" />
            <span>Counterfactual Risk Simulator (What-If Analysis)</span>
            <span className="text-[10px] text-zinc-500 font-normal">
              ({showSimulator ? 'Click to hide sliders' : 'Click to test parameter shifts'})
            </span>
          </button>

          <div className="flex items-center space-x-2">
            {(labAdjustment !== 0 || ageAdjustment !== 0) && (
              <button
                onClick={resetSimulation}
                className="flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-200 bg-zinc-950 px-2.5 py-1 rounded-lg border border-zinc-800 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset Scenario</span>
              </button>
            )}

            <button
              onClick={() => setShowSimulator(!showSimulator)}
              className="p-1 rounded bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-zinc-200 cursor-pointer"
            >
              {showSimulator ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {showSimulator && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
            <div className="bg-zinc-950/80 border border-zinc-800/80 p-4 rounded-xl space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-zinc-300">Lab Severity Shift:</span>
                <span className="font-mono text-emerald-400">{labAdjustment > 0 ? `+${labAdjustment}` : labAdjustment} SD</span>
              </div>
              <input
                type="range"
                min="-3"
                max="3"
                step="1"
                value={labAdjustment}
                onChange={(e) => setLabAdjustment(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <p className="text-[11px] text-zinc-500">Simulate effect of improving/worsening primary lab markers on predicted stay length.</p>
            </div>

            <div className="bg-zinc-950/80 border border-zinc-800/80 p-4 rounded-xl space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-zinc-300">Acuity Tier Offset:</span>
                <span className="font-mono text-emerald-400">{ageAdjustment > 0 ? `+${ageAdjustment}` : ageAdjustment} Level</span>
              </div>
              <input
                type="range"
                min="-2"
                max="2"
                step="1"
                value={ageAdjustment}
                onChange={(e) => setAgeAdjustment(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <p className="text-[11px] text-zinc-500">Adjust physiological risk tier to test model sensitivity bounds.</p>
            </div>
          </div>
        )}
      </div>

      {/* Feature Contributions Breakdown */}
      <div className="bg-zinc-900/80 border border-zinc-800/80 rounded-2xl p-6 backdrop-blur-md shadow-xl space-y-4">
        <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-emerald-400" />
          Explainable Feature Contributions (SHAP / Impact Breakdown)
        </h4>

        <div className="space-y-3">
          {prediction.feature_contributions.map((feat, idx) => {
            const isPositive = feat.impact > 0;
            return (
              <div key={idx} className="bg-zinc-950/90 border border-zinc-800/80 rounded-xl p-4 space-y-2.5 hover:border-zinc-700 transition-colors">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-zinc-200">{feat.feature}</span>
                  <span className={`font-mono font-bold ${isPositive ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {isPositive ? `+${feat.impact} days` : `${feat.impact} days`}
                  </span>
                </div>

                {/* Relative visual bar */}
                <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${isPositive ? 'bg-amber-500 shadow-sm shadow-amber-500/50' : 'bg-emerald-500 shadow-sm shadow-emerald-500/50'}`}
                    style={{ width: `${Math.min(100, Math.abs(feat.impact) * 25)}%` }}
                  />
                </div>

                {/* Provenance badge */}
                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 pt-2 border-t border-zinc-900">
                  <span className="flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-emerald-400" />
                    Feature Source: <code className="text-zinc-300 bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800">{feat.source.table}.{feat.source.field}</code>
                  </span>
                  <span className="text-zinc-400 font-semibold">Value: {feat.source.value}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
