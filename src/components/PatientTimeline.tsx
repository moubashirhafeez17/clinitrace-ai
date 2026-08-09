import React, { useState } from 'react';
import { PatientFullRecord } from '../types';
import { 
  Calendar, 
  Clock, 
  Activity, 
  FileText, 
  Pill, 
  AlertCircle, 
  Stethoscope, 
  UserCheck, 
  Database,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Bookmark,
  BookmarkCheck,
  CheckCircle2
} from 'lucide-react';

interface Props {
  record: PatientFullRecord;
}

export const PatientTimeline: React.FC<Props> = ({ record }) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'admission' | 'icu' | 'lab' | 'prescription' | 'diagnosis'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);
  const [bookmarkedEvents, setBookmarkedEvents] = useState<Record<string, boolean>>({});

  const timelineEvents: Array<{
    id: string;
    timestamp: string;
    type: 'admission' | 'icu' | 'lab' | 'prescription' | 'diagnosis';
    title: string;
    detail: string;
    table: string;
    field: string;
    hadm_id?: number;
    badge?: string;
    provenance: string;
    rawObj?: any;
  }> = [];

  record.admissions.forEach((a) => {
    timelineEvents.push({
      id: `adm-${a.hadm_id}`,
      timestamp: a.admittime,
      type: 'admission',
      title: `Hospital Admission (${a.admission_type})`,
      detail: `Type: ${a.admission_type} | Insurance: ${a.insurance} | Location: ${a.admission_location}`,
      table: 'admissions',
      field: 'admittime',
      hadm_id: a.hadm_id,
      badge: a.admission_type,
      provenance: `admissions.admittime [HADM: ${a.hadm_id}]`,
      rawObj: a,
    });
  });

  record.icustays.forEach((i) => {
    timelineEvents.push({
      id: `icu-${i.stay_id}`,
      timestamp: i.intime,
      type: 'icu',
      title: `ICU Transfer: ${i.first_careunit}`,
      detail: `Unit: ${i.first_careunit} -> ${i.last_careunit} | LOS: ${i.los} days`,
      table: 'icustays',
      field: 'intime',
      hadm_id: i.hadm_id,
      badge: `${i.los} days`,
      provenance: `icustays.intime [STAY: ${i.stay_id}]`,
      rawObj: i,
    });
  });

  record.labs.forEach((l) => {
    timelineEvents.push({
      id: `lab-${l.labevent_id}`,
      timestamp: l.charttime,
      type: 'lab',
      title: `Lab Result: ${l.label}`,
      detail: `Value: ${l.valuenum} ${l.valueuom} ${l.flag ? `(${l.flag.toUpperCase()})` : ''}`,
      table: 'labevents',
      field: 'valuenum',
      hadm_id: l.hadm_id,
      badge: l.flag,
      provenance: `labevents.valuenum [ITEM: ${l.itemid}]`,
      rawObj: l,
    });
  });

  record.prescriptions.forEach((p) => {
    timelineEvents.push({
      id: `rx-${p.pharmacy_id}`,
      timestamp: p.starttime,
      type: 'prescription',
      title: `Rx Start: ${p.drug}`,
      detail: `Dose: ${p.dose_val_rx} ${p.dose_unit_rx} | Route: ${p.route}`,
      table: 'prescriptions',
      field: 'dose_val_rx',
      hadm_id: p.hadm_id,
      provenance: `prescriptions.dose_val_rx [RX: ${p.pharmacy_id}]`,
      rawObj: p,
    });
  });

  record.diagnoses.forEach((d) => {
    const adm = record.admissions.find((a) => a.hadm_id === d.hadm_id);
    timelineEvents.push({
      id: `dx-${d.hadm_id}-${d.seq_num}`,
      timestamp: adm ? adm.admittime : 'N/A',
      type: 'diagnosis',
      title: `ICD-${d.icd_version}: ${d.icd_code}`,
      detail: d.long_title,
      table: 'diagnoses_icd',
      field: 'icd_code',
      hadm_id: d.hadm_id,
      badge: `Seq ${d.seq_num}`,
      provenance: `diagnoses_icd.icd_code [ICD: ${d.icd_code}]`,
      rawObj: d,
    });
  });

  const filteredEvents = timelineEvents.filter((ev) => {
    const matchesFilter = activeFilter === 'all' || ev.type === activeFilter;
    const matchesSearch =
      searchTerm === '' ||
      ev.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.detail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.provenance.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarkedEvents((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleExpand = (id: string) => {
    setExpandedEventId((prev) => (prev === id ? null : id));
  };

  const getEventBadgeClass = (type: string, badge?: string) => {
    if (badge === 'abnormal' || badge === 'critical') {
      return 'bg-red-500/10 text-red-400 border border-red-500/30';
    }
    switch (type) {
      case 'admission':
        return 'bg-blue-500/10 text-blue-400 border border-blue-500/30';
      case 'icu':
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/30';
      case 'lab':
        return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30';
      case 'prescription':
        return 'bg-purple-500/10 text-purple-400 border border-purple-500/30';
      case 'diagnosis':
        return 'bg-zinc-800 text-zinc-300 border border-zinc-700/60';
      default:
        return 'bg-zinc-800 text-zinc-400';
    }
  };

  const getBorderAccent = (type: string) => {
    switch (type) {
      case 'admission':
        return 'border-l-blue-500';
      case 'icu':
        return 'border-l-amber-500';
      case 'lab':
        return 'border-l-emerald-500';
      case 'prescription':
        return 'border-l-purple-500';
      case 'diagnosis':
        return 'border-l-zinc-500';
      default:
        return 'border-l-zinc-700';
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'admission':
        return UserCheck;
      case 'icu':
        return Activity;
      case 'lab':
        return FileText;
      case 'prescription':
        return Pill;
      case 'diagnosis':
        return Stethoscope;
      default:
        return Clock;
    }
  };

  // Category Counts
  const counts = {
    all: timelineEvents.length,
    admission: record.admissions.length,
    icu: record.icustays.length,
    lab: record.labs.length,
    prescription: record.prescriptions.length,
    diagnosis: record.diagnoses.length,
  };

  return (
    <div className="space-y-5">
      {/* Patient Header Card */}
      <div className="bg-zinc-900/80 border border-zinc-800/80 rounded-2xl p-6 backdrop-blur-md shadow-xl transition-all">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/80 pb-5">
          <div>
            <div className="flex items-center space-x-3">
              <h2 className="text-2xl font-bold font-mono tracking-tight text-zinc-100">
                SUBJECT ID: {record.patient.subject_id}
              </h2>
              <span className="px-2.5 py-1 text-xs font-mono font-semibold rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                MIMIC-IV v2.2
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1">
              <span>Gender: <strong className="text-zinc-200">{record.patient.gender}</strong></span>
              <span>Anchor Age: <strong className="text-zinc-200">{record.patient.anchor_age} yrs</strong></span>
              <span>Anchor Year: <strong className="text-zinc-200">{record.patient.anchor_year}</strong></span>
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 bg-zinc-950/80 px-3 py-1.5 rounded-xl border border-zinc-800">
            <Database className="w-4 h-4 text-emerald-400" />
            <span>Deterministic Provenance Active</span>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mt-5">
          <div className="bg-zinc-950/80 border border-zinc-800/80 p-3.5 rounded-xl shadow-inner hover:border-zinc-700 transition-colors">
            <span className="text-[11px] text-zinc-400 uppercase tracking-wider block font-semibold">Admissions</span>
            <span className="text-2xl font-bold text-zinc-100 font-mono mt-0.5 block">{record.admissions.length}</span>
          </div>
          <div className="bg-zinc-950/80 border border-zinc-800/80 p-3.5 rounded-xl shadow-inner hover:border-zinc-700 transition-colors">
            <span className="text-[11px] text-zinc-400 uppercase tracking-wider block font-semibold">ICU Stays</span>
            <span className="text-2xl font-bold text-amber-400 font-mono mt-0.5 block">{record.icustays.length}</span>
          </div>
          <div className="bg-zinc-950/80 border border-zinc-800/80 p-3.5 rounded-xl shadow-inner hover:border-zinc-700 transition-colors">
            <span className="text-[11px] text-zinc-400 uppercase tracking-wider block font-semibold">Lab Records</span>
            <span className="text-2xl font-bold text-emerald-400 font-mono mt-0.5 block">{record.labs.length}</span>
          </div>
          <div className="bg-zinc-950/80 border border-zinc-800/80 p-3.5 rounded-xl shadow-inner hover:border-zinc-700 transition-colors">
            <span className="text-[11px] text-zinc-400 uppercase tracking-wider block font-semibold">Rx Orders</span>
            <span className="text-2xl font-bold text-purple-400 font-mono mt-0.5 block">{record.prescriptions.length}</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-zinc-900/80 border border-zinc-800/80 rounded-2xl p-4 backdrop-blur-md shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {(
            [
              { id: 'all', label: 'All Events', count: counts.all },
              { id: 'admission', label: 'Admissions', count: counts.admission },
              { id: 'icu', label: 'ICU Stays', count: counts.icu },
              { id: 'lab', label: 'Labs', count: counts.lab },
              { id: 'prescription', label: 'Rx Orders', count: counts.prescription },
              { id: 'diagnosis', label: 'Diagnoses', count: counts.diagnosis },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3 py-1.5 text-xs rounded-xl font-medium whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                activeFilter === tab.id
                  ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-semibold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 border border-transparent'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                activeFilter === tab.id ? 'bg-emerald-500/20 text-emerald-200' : 'bg-zinc-800 text-zinc-500'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-zinc-500" />
          <input
            type="text"
            placeholder="Search timeline..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-zinc-950/80 border border-zinc-800/80 rounded-xl text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50"
          />
        </div>
      </div>

      {/* Timeline Stream Container */}
      <div className="bg-zinc-900/80 border border-zinc-800/80 rounded-2xl p-6 backdrop-blur-md shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
          <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-400" />
            Chronological Audit Stream ({filteredEvents.length} events)
          </h3>
          <span className="text-xs font-mono text-zinc-500">
            Click any event to inspect table attributes
          </span>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="py-12 text-center text-zinc-500 text-xs font-mono">
            No clinical events match the selected filter.
          </div>
        ) : (
          <div className="relative border-l-2 border-zinc-800/80 ml-3 sm:ml-4 space-y-4 pt-1">
            {filteredEvents.map((ev) => {
              const Icon = getEventIcon(ev.type);
              const isExpanded = expandedEventId === ev.id;
              const isBookmarked = !!bookmarkedEvents[ev.id];

              return (
                <div key={ev.id} className="relative pl-6 sm:pl-8 group">
                  {/* Timeline Marker Circle */}
                  <div className="absolute -left-[9px] top-3.5 w-4 h-4 rounded-full bg-zinc-950 border-2 border-zinc-700 group-hover:border-emerald-400 transition-colors flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 group-hover:bg-emerald-400" />
                  </div>

                  {/* Event Container Card */}
                  <div
                    onClick={() => toggleExpand(ev.id)}
                    className={`bg-zinc-950/90 border-l-4 ${getBorderAccent(ev.type)} border-t border-r border-b border-zinc-800/80 rounded-xl p-4 hover:border-zinc-700/80 transition-all duration-200 cursor-pointer shadow-md hover:shadow-lg`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center space-x-2.5">
                        <div className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300">
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-semibold text-zinc-100">{ev.title}</span>
                        {ev.badge && (
                          <span
                            className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded-full ${getEventBadgeClass(
                              ev.type,
                              ev.badge
                            )}`}
                          >
                            {ev.badge}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center space-x-3 text-xs text-zinc-400 self-start sm:self-auto">
                        <span className="font-mono flex items-center gap-1 text-zinc-400">
                          <Clock className="w-3 h-3 text-zinc-500" />
                          {ev.timestamp}
                        </span>

                        <button
                          onClick={(e) => toggleBookmark(ev.id, e)}
                          title={isBookmarked ? 'Bookmarked for Audit' : 'Bookmark Event'}
                          className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-500 hover:text-emerald-400 transition-colors cursor-pointer"
                        >
                          {isBookmarked ? (
                            <BookmarkCheck className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Bookmark className="w-4 h-4" />
                          )}
                        </button>

                        <div className="text-zinc-500">
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-zinc-300 leading-relaxed mt-2">{ev.detail}</p>

                    {/* Table Field Provenance Badge */}
                    <div className="mt-3 pt-2.5 border-t border-zinc-900 flex items-center justify-between text-[11px] font-mono">
                      <span className="text-zinc-500 flex items-center gap-1.5">
                        <Database className="w-3 h-3 text-emerald-400" />
                        Source: <code className="text-zinc-300 bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800">{ev.provenance}</code>
                      </span>
                      {ev.hadm_id && (
                        <span className="text-zinc-500">HADM #{ev.hadm_id}</span>
                      )}
                    </div>

                    {/* Expanded Raw Attributes Drawer */}
                    {isExpanded && ev.rawObj && (
                      <div className="mt-3 pt-3 border-t border-zinc-800/80 bg-zinc-900/60 rounded-lg p-3 space-y-1.5 text-xs font-mono">
                        <div className="text-[10px] uppercase font-semibold text-emerald-400 tracking-wider mb-1">
                          Verified Record Schema Attributes ({ev.table})
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-zinc-300">
                          {Object.entries(ev.rawObj).map(([k, v]) => (
                            <div key={k} className="flex justify-between bg-zinc-950 px-2.5 py-1 rounded border border-zinc-800/60">
                              <span className="text-zinc-500">{k}:</span>
                              <span className="font-semibold text-zinc-200">{String(v ?? 'NULL')}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
