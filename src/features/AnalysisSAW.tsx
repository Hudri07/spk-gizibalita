import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { Balita, Criteria } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface AnalysisSAWProps {
  data: Balita[];
  analysis: Balita[];
  criteria: Criteria[];
  showExplanation: boolean;
  setShowExplanation: (show: boolean) => void;
  getStatusColor: (status: string) => string;
}

const AnalysisSAW: React.FC<AnalysisSAWProps> = ({
  data,
  analysis,
  criteria,
  showExplanation,
  setShowExplanation,
  getStatusColor
}) => {
  const getSAWSteps = () => {
    if (data.length === 0 || criteria.length === 0) return null;
    
    // 1. Find extremes
    const extremes: Record<string, number> = {};
    criteria.forEach(c => {
      let values: number[] = [];
      if (c.name === 'Berat Badan') values = data.map(d => d.weight);
      else if (c.name === 'Tinggi Badan') values = data.map(d => d.height);
      else if (c.name === 'Umur') values = data.map(d => d.age);
      else if (c.name === 'Jenis Kelamin') values = data.map(d => d.gender === 'L' ? 1 : 0.8);

      if (c.type === 'benefit') extremes[c.code] = Math.max(...values, 0.1);
      else extremes[c.code] = Math.min(...values, 1000);
    });

    // 2. Normalization for UI
    const normalized = data.map(d => {
      const norms: Record<string, number> = {};
      criteria.forEach(c => {
        let val = 0;
        if (c.name === 'Berat Badan') val = d.weight;
        else if (c.name === 'Tinggi Badan') val = d.height;
        else if (c.name === 'Umur') val = d.age;
        else if (c.name === 'Jenis Kelamin') val = d.gender === 'L' ? 1 : 0.8;

        if (c.type === 'benefit') norms[c.code] = val / (extremes[c.code] || 1);
        else norms[c.code] = (extremes[c.code] || 1) / (val || 1);
      });
      return { ...d, norms };
    });

    return { extremes, normalized };
  };

  const steps = getSAWSteps();

  return (
    <motion.div
      key="saw"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="space-y-8 pb-10"
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-500 text-white shadow-xl shadow-sky-100">
            <TrendingUp size={28} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">Kalkulasi Gizi SAW</h3>
            <p className="text-sm font-bold text-slate-400 mt-1">Simple Additive Weighting Multi-Attribute Decision Making</p>
          </div>
        </div>
        <button 
          onClick={() => setShowExplanation(!showExplanation)}
          className="flex items-center gap-2 rounded-2xl bg-white px-6 py-4 text-xs font-black text-sky-600 shadow-sm border border-sky-50 hover:bg-sky-50 transition-all"
        >
          <AlertCircle size={16} />
          {showExplanation ? 'SEMBUNYIKAN TUTORIAL' : 'CARA KERJA METODE'}
        </button>
      </div>

      {showExplanation && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[32px] bg-sky-900 p-8 text-white shadow-2xl shadow-sky-900/20"
        >
          <h4 className="text-lg font-black mb-4 flex items-center gap-2">
            <CheckCircle2 size={20} className="text-sky-400"/> Alur Perhitungan Digital
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-[11px]">
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
              <span className="block text-sky-400 font-black mb-2 uppercase tracking-widest">1. Kriteria & Bobot</span>
              <p className="font-bold leading-relaxed opacity-70">Sistem menetapkan bobot: BB (40%), TB (30%), Umur (20%), Kelamin (10%).</p>
            </div>
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
              <span className="block text-sky-400 font-black mb-2 uppercase tracking-widest">2. Normalisasi Matriks</span>
              <p className="font-bold leading-relaxed opacity-70">Nilai setiap balita dibagi dengan nilai tertinggi (MAX) di posyandu saat ini.</p>
            </div>
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
              <span className="block text-sky-400 font-black mb-2 uppercase tracking-widest">3. Perangkingan</span>
              <p className="font-bold leading-relaxed opacity-70">Skor akhir dihitung dan diklasifikasikan menjadi status Gizi Baik s/d Buruk.</p>
            </div>
          </div>
        </motion.div>
      )}

      {steps ? (
        <div className="space-y-8">
          {/* Detailed table of steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-[32px] bg-white p-6 shadow-sm border border-sky-50">
              <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4 px-2">Kriteria SAW</h4>
              <div className="space-y-3">
                {criteria.map((c, i) => (
                  <div key={c.id} className="flex justify-between items-center p-3 rounded-2xl bg-slate-50">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-8 h-8 rounded-lg text-white flex items-center justify-center font-black text-[10px]",
                        i === 0 ? "bg-sky-500" : i === 1 ? "bg-emerald-500" : i === 2 ? "bg-amber-500" : "bg-purple-500"
                      )}>{c.code}</div>
                      <span className="text-sm font-bold text-slate-700">{c.name}</span>
                    </div>
                    <span className="text-xs font-black text-slate-400">
                      <span className="text-sky-600">{(c.weight * 100).toFixed(0)}%</span> ({c.type})
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[32px] bg-white p-6 shadow-sm border border-sky-50">
              <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4 px-2">Nilai Ekstrim (MIN/MAX)</h4>
              <p className="text-[10px] text-slate-400 font-bold mb-4 px-2 uppercase leading-relaxed">Digunakan sebagai pembagi pada proses normalisasi</p>
              <div className="grid grid-cols-2 gap-4">
                {criteria.map((c, i) => (
                  <div key={c.id} className={cn(
                    "p-4 rounded-2xl border",
                    i === 0 ? "bg-sky-50 border-sky-100" : i === 1 ? "bg-emerald-50 border-emerald-100" : i === 2 ? "bg-amber-50 border-amber-100" : "bg-purple-50 border-purple-100"
                  )}>
                    <span className={cn(
                      "block text-[9px] font-black uppercase tracking-widest mb-1",
                      i === 0 ? "text-sky-400" : i === 1 ? "text-emerald-400" : i === 2 ? "text-amber-400" : "text-purple-400"
                    )}>{c.type === 'benefit' ? 'MAX' : 'MIN'} {c.code}</span>
                    <span className={cn(
                      "text-xl font-black",
                      i === 0 ? "text-sky-600" : i === 1 ? "text-emerald-600" : i === 2 ? "text-amber-600" : "text-purple-600"
                    )}>{steps.extremes[c.code]?.toFixed(1)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-[32px] bg-white p-6 shadow-sm border border-sky-50 overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-2 px-2">
              <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">Langkah 1: Normalisasi Matriks (r)</h4>
              <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">r = {criteria[0]?.type === 'benefit' ? 'x / MAX' : 'MIN / x'}</span>
            </div>
            <div className="overflow-x-auto -mx-2 px-2 pb-2 scrollbar-hide">
              <table className="min-w-[500px] w-full text-left text-xs">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-50 uppercase tracking-widest text-[9px]">
                    <th className="pb-4 px-2 whitespace-nowrap">Alternatif</th>
                    {criteria.map(c => <th key={c.id} className="pb-4 px-2 whitespace-nowrap">r ({c.code})</th>)}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {steps.normalized.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50">
                      <td className="py-4 px-2 font-bold text-slate-700 whitespace-nowrap">{item.name}</td>
                      {criteria.map((c, i) => (
                        <td key={c.id} className={cn(
                          "py-4 px-2 font-mono font-bold whitespace-nowrap",
                          i === 0 ? "text-sky-600" : i === 1 ? "text-emerald-600" : i === 2 ? "text-amber-600" : "text-purple-600"
                        )}>{item.norms[c.code]?.toFixed(4)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-[32px] bg-white p-6 shadow-sm border border-sky-50 overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-2 px-2">
              <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">Langkah 2: Perangkingan Akhir (V)</h4>
              <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">V = Σ (r * w)</span>
            </div>
            <div className="overflow-x-auto -mx-2 px-2 pb-2 scrollbar-hide">
              <table className="min-w-[600px] w-full text-left text-sm">
                <thead>
                  <tr className="text-[10px] text-slate-400 uppercase tracking-widest border-b border-slate-50">
                    <th className="pb-4 px-2 text-center">Rank</th>
                    <th className="pb-4 px-2">Nama Balita</th>
                    <th className="pb-4 px-2">Rumus Detail</th>
                    <th className="pb-4 px-2">Skor (V)</th>
                    <th className="pb-4 px-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {analysis.map((item, idx) => {
                    const norm = steps.normalized.find(n => n.id === item.id);
                    return (
                      <tr key={item.id} className="group hover:bg-slate-50/50">
                        <td className="py-5 px-2">
                          <div className={cn(
                            "mx-auto w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs",
                            idx === 0 ? "bg-amber-100 text-amber-600 shadow-sm" : 
                            idx === 1 ? "bg-slate-100 text-slate-500" : 
                            idx === 2 ? "bg-orange-50 text-orange-600" : "bg-slate-50 text-slate-400"
                          )}>
                            #{idx + 1}
                          </div>
                        </td>
                        <td className="py-5 px-2 font-black text-slate-700 whitespace-nowrap">{item.name}</td>
                        <td className="py-5 px-2 font-mono text-[9px] text-slate-400 leading-tight min-w-[200px]">
                          <div className="flex flex-wrap gap-x-1">
                            {norm && criteria.map((c, i) => (
                              <span key={c.id} className="whitespace-nowrap">
                                ({norm.norms[c.code]?.toFixed(2)} * {c.weight}){i < criteria.length - 1 ? ' +' : ''}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-5 px-2 font-mono font-bold text-sky-600 whitespace-nowrap">{(item.score || 0).toFixed(4)}</td>
                        <td className="py-5 px-2 whitespace-nowrap">
                          <span className={cn("px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border", getStatusColor(item.status || ''))}>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-[32px] bg-white p-4 sm:p-8 shadow-sm border border-sky-50">
            <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest px-2">Visualisasi Skor SAW</h4>
                <p className="text-[10px] font-bold text-slate-400 px-2 mt-1">Perbandingan Skor Akhir (V) antar Balita</p>
              </div>
              <div className="grid grid-cols-2 lg:flex lg:gap-4 gap-2 w-full sm:w-auto px-2">
                 <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500"></div><span className="text-[9px] font-bold text-slate-400">BAIK</span></div>
                 <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-amber-500"></div><span className="text-[9px] font-bold text-slate-400">KURANG</span></div>
                 <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-rose-500"></div><span className="text-[9px] font-bold text-slate-400">BURUK</span></div>
                 <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-sky-500"></div><span className="text-[9px] font-bold text-slate-400">LEBIH</span></div>
              </div>
            </div>
            <div className="h-[300px] sm:h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analysis} margin={{ top: 20, right: 10, left: -20, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                    tick={{ fontSize: 9, fontWeight: 700, fill: '#64748b' }} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 9, fontWeight: 500, fill: '#94a3b8' }}
                    domain={[0, 1]}
                  />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ 
                      borderRadius: '20px', 
                      border: 'none', 
                      boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)', 
                      padding: '16px' 
                    }}
                    formatter={(value: number) => [value.toFixed(4), 'Skor SAW']}
                  />
                  <Bar dataKey="score" radius={[8, 8, 0, 0]} barSize={40}>
                    {analysis.map((entry, index) => {
                      let color = '#10b981'; // Gizi Baik
                      if (entry.status === 'Gizi Kurang') color = '#f59e0b';
                      if (entry.status === 'Gizi Buruk') color = '#f43f5e';
                      if (entry.status === 'Gizi Lebih') color = '#0ea5e9';
                      return <Cell key={`cell-${index}`} fill={color} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-20 text-center glass-card rounded-[40px] border-dashed border-2 border-slate-200">
           <Calculator className="mx-auto text-slate-200 mb-4" size={48} />
           <p className="text-slate-400 font-bold">Belum ada data untuk diproses menggunakan metode SAW.</p>
        </div>
      )}
    </motion.div>
  );
};

const Calculator = ({ size, className }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="16" height="20" x="4" y="2" rx="2" />
    <line x1="8" x2="16" y1="6" y2="6" />
    <line x1="16" x2="16" y1="14" y2="18" />
    <path d="M16 10h.01" />
    <path d="M12 10h.01" />
    <path d="M8 10h.01" />
    <path d="M12 14h.01" />
    <path d="M8 14h.01" />
    <path d="M12 18h.01" />
    <path d="M8 18h.01" />
  </svg>
);

export default AnalysisSAW;
