import React, { useState } from 'react';
import { ShieldAlert, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';

export const SafetyNotice: React.FC = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-amber-950/20 border border-amber-800/30 rounded-2xl p-4 text-amber-200/90 text-xs backdrop-blur-md shadow-lg transition-all duration-300 hover:border-amber-700/50">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <div className="font-semibold text-amber-300 text-sm flex items-center gap-2">
              <span>Research and educational prototype only. Not for clinical use.</span>
              <span className="bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded-full text-[10px] font-mono border border-amber-500/20 font-medium">
                MIMIC-IV v2.2
              </span>
            </div>
            <p className="text-xs text-amber-200/90 font-medium mt-0.5">
              Do not use for diagnosis, treatment, triage, or emergency decisions.
            </p>
          </div>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-300 rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
        >
          <span>{expanded ? 'Hide Details' : 'Safety Scope'}</span>
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-amber-800/30 text-amber-200/80 leading-relaxed space-y-2 text-xs">
          <p>
            This system operates exclusively on de-identified MIMIC-IV benchmark records. It is intended strictly for table grounding, auditability evaluation, and data hygiene research.
          </p>
          <div className="flex flex-wrap gap-4 pt-1 font-mono text-[11px] text-amber-300/80">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Direct SQL Provenance Citations
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Deterministic Rule Verification
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Strict Non-Hallucination Policy
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
