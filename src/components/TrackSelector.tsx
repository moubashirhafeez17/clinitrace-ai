import React from 'react';
import { HackathonTrack } from '../types';
import { GitCommit, Database, Activity, BarChart2, ShieldCheck, Network } from 'lucide-react';

interface Props {
  activeTrack: HackathonTrack;
  onSelectTrack: (track: HackathonTrack) => void;
}

export const TrackSelector: React.FC<Props> = ({ activeTrack, onSelectTrack }) => {
  const primaryTracks = [
    {
      id: 'track1' as HackathonTrack,
      num: '01',
      title: 'Timeline & Evidence',
      subtitle: 'Grounded Clinical Retrieval & Q&A',
      icon: GitCommit,
      tag: 'Clinical Retrieval',
    },
    {
      id: 'track2' as HackathonTrack,
      num: '02',
      title: 'Cohort & Data Quality',
      subtitle: 'Cohort Builder & EHR Hygiene',
      icon: Database,
      tag: 'Data Auditing',
    },
    {
      id: 'track3' as HackathonTrack,
      num: '03',
      title: 'Trajectory & Risk',
      subtitle: 'Explainable LOS Prediction & Simulation',
      icon: Activity,
      tag: 'Research Model',
    },
  ];

  const secondaryViews = [
    {
      id: 'evaluation' as HackathonTrack,
      title: 'Evaluation Report',
      icon: BarChart2,
    },
    {
      id: 'architecture' as HackathonTrack,
      title: 'Architecture Blueprint',
      icon: Network,
    },
    {
      id: 'lineage' as HackathonTrack,
      title: 'Data Lineage & License',
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/80 py-3 sticky top-[61px] z-20 space-y-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Primary Hackathon Track Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {primaryTracks.map((t) => {
            const Icon = t.icon;
            const isActive = activeTrack === t.id;
            return (
              <button
                key={t.id}
                onClick={() => onSelectTrack(t.id)}
                className={`relative flex items-center space-x-3.5 p-3.5 rounded-2xl text-left transition-all duration-300 group cursor-pointer ${
                  isActive
                    ? 'bg-zinc-900 border border-emerald-500/30 shadow-lg shadow-emerald-950/20 text-zinc-100 ring-1 ring-emerald-500/20'
                    : 'bg-zinc-900/40 hover:bg-zinc-900/80 border border-zinc-800/60 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700/60'
                }`}
              >
                {isActive && (
                  <span className="absolute top-3 right-3 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                )}

                <div
                  className={`p-2.5 rounded-xl transition-transform duration-300 group-hover:scale-105 ${
                    isActive
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-zinc-800/80 text-zinc-400 group-hover:text-zinc-200'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[11px] font-mono text-zinc-500 font-semibold tracking-wider uppercase">
                      TRACK {t.num}
                    </span>
                    <span
                      className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                        isActive
                          ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                          : 'bg-zinc-800/60 text-zinc-400 border-zinc-700/40'
                      }`}
                    >
                      {t.tag}
                    </span>
                  </div>
                  <p className={`text-sm font-bold tracking-tight truncate ${isActive ? 'text-zinc-100' : 'text-zinc-300'}`}>
                    {t.title}
                  </p>
                  <p className="text-xs text-zinc-500 truncate mt-0.5">{t.subtitle}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Secondary Compliance & Evaluation Subtabs */}
        <div className="flex items-center justify-center gap-2 pt-2 border-t border-zinc-900 overflow-x-auto">
          {secondaryViews.map((sv) => {
            const Icon = sv.icon;
            const isActive = activeTrack === sv.id;
            return (
              <button
                key={sv.id}
                onClick={() => onSelectTrack(sv.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-xs'
                    : 'bg-zinc-900/60 hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800/80'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{sv.title}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
