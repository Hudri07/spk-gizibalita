import React from 'react';
import { 
  Baby, HelpCircle, Check, AlertCircle, XCircle, ArrowUpCircle 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ScatterChart, Scatter
} from 'recharts';
import { motion } from 'motion/react';
import { Balita } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface DashboardProps {
  data: Balita[];
  analysis: Balita[];
  profile: any;
}

const Dashboard: React.FC<DashboardProps> = ({ data, analysis, profile }) => {
  const giziBurukData = analysis.filter(a => a.status === 'Gizi Buruk');
  const showNotification = profile.notifications?.giziBurukAlert && giziBurukData.length > 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Gizi Baik': return 'text-green-600 bg-green-50 border-green-200';
      case 'Gizi Kurang': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'Gizi Buruk': return 'text-red-600 bg-red-50 border-red-200';
      case 'Gizi Lebih': return 'text-sky-600 bg-sky-50 border-sky-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {showNotification && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-[32px] bg-rose-500 p-6 md:p-8 text-white shadow-2xl shadow-rose-200/50 flex flex-col md:flex-row items-center gap-6 border-b-4 border-rose-700"
        >
          <div className="bg-white/20 p-4 rounded-3xl animate-pulse">
            <AlertCircle size={32} strokeWidth={3} />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h4 className="text-xl font-black mb-1">Waspada: Terdeteksi Gizi Buruk!</h4>
            <p className="text-white/80 font-bold text-sm tracking-tight">
              Ditemukan <span className="text-white bg-rose-600 px-2 py-0.5 rounded-lg">{giziBurukData.length} balita</span> dengan kondisi gizi buruk. 
              Segera lakukan tindakan medis dan koordinasi dengan Puskesmas.
            </p>
          </div>
          <div className="flex gap-2">
            {giziBurukData.slice(0, 3).map(b => (
              <div key={b.id} className="relative group">
                <img 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${b.name}`} 
                  className="w-10 h-10 rounded-full border-2 border-white bg-rose-400" 
                  alt="balita" 
                />
              </div>
            ))}
            {giziBurukData.length > 3 && (
               <div className="w-10 h-10 rounded-full border-2 border-white/30 bg-rose-600 flex items-center justify-center text-[10px] font-black">
                 +{giziBurukData.length - 3}
               </div>
            )}
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Highlight Card */}
        <div className="lg:col-span-8 rounded-[32px] md:rounded-[38px] bg-[#0ea5e9] bg-gradient-to-br from-[#0ea5e9] to-[#2563eb] p-6 md:p-10 text-white relative overflow-hidden shadow-2xl shadow-sky-200/40 min-h-[180px] md:min-h-[220px] flex flex-col justify-center">
          <div className="relative z-10">
            <p className="text-[10px] font-black opacity-80 uppercase tracking-[0.2em]">Analisis Terakhir • Skor SAW</p>
            <h4 className="text-6xl font-black mt-2 tracking-tighter">
              {analysis.length > 0 ? (analysis[0].score || 0).toFixed(3) : '0.000'}
            </h4>
            <div className="mt-6 flex items-center gap-3">
              <span className="bg-white px-5 py-2 rounded-2xl text-[10px] font-black text-sky-600 shadow-xl shadow-sky-900/10 uppercase tracking-widest">
                STATUS: {analysis.length > 0 ? analysis[0].status : 'BELUM ADA DATA'}
              </span>
              <div className="flex -space-x-2">
                 {analysis.slice(0, 3).map(a => (
                   <img 
                     key={a.id} 
                     src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${a.name}&topType=${a.gender === 'L' ? 'ShortHairShortFlat' : 'LongHairCurvy'}`} 
                     className="w-8 h-8 rounded-full border-2 border-sky-400 bg-sky-300" 
                     alt="avatar" 
                   />
                 ))}
                 <div className="w-8 h-8 rounded-full border-2 border-sky-400 bg-sky-200 flex items-center justify-center text-[10px] font-bold text-sky-700">+{Math.max(0, analysis.length - 3)}</div>
              </div>
            </div>
          </div>
          <Baby size={240} className="absolute right-[-40px] bottom-[-40px] opacity-10 text-white rotate-[-15deg]" />
        </div>

        {/* Summary Small Stat */}
        <div className="lg:col-span-4 bg-white rounded-[32px] md:rounded-[38px] p-6 md:p-8 shadow-xl shadow-slate-200/30 flex flex-col justify-center border border-white">
          <div className="flex items-center gap-5 mb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-sky-500 text-white shadow-xl shadow-sky-100">
              <Baby size={32} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Balita</p>
              <h3 className="text-3xl font-black text-slate-800 tracking-tight">{data.length} Anak</h3>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-3xl bg-slate-50/50 border border-slate-100">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">RATA BB</p>
              <p className="text-lg font-black text-slate-700">
                {data.length > 0 
                  ? (data.reduce((a, b) => a + Number(b.weight || 0), 0) / data.length).toFixed(1) 
                  : '0.0'} <span className="text-[10px] opacity-60">kg</span>
              </p>
            </div>
            <div className="p-4 rounded-3xl bg-slate-50/50 border border-slate-100">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">RATA TB</p>
              <p className="text-lg font-black text-slate-700">
                {data.length > 0 
                  ? (data.reduce((a, b) => a + Number(b.height || 0), 0) / data.length).toFixed(1) 
                  : '0.0'} <span className="text-[10px] opacity-60">cm</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-[24px] bg-white p-8 shadow-sm border border-sky-50">
          <div className="mb-6 flex items-center gap-2">
            <span className="w-2 h-6 bg-sky-500 rounded-full"></span>
            <h3 className="text-base font-bold text-slate-800">Sebaran Gizi (SAW)</h3>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: 'Baik', count: analysis.filter(a => a.status === 'Gizi Baik').length },
                { name: 'Kurang', count: analysis.filter(a => a.status === 'Gizi Kurang').length },
                { name: 'Buruk', count: analysis.filter(a => a.status === 'Gizi Buruk').length },
                { name: 'Lebih', count: analysis.filter(a => a.status === 'Gizi Lebih').length },
              ]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', padding: '12px' }}
                />
                <Bar dataKey="count" fill="#0ea5e9" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-[24px] bg-white p-8 shadow-sm border border-sky-50">
          <div className="mb-6 flex items-center gap-2">
            <span className="w-2 h-6 bg-green-500 rounded-full"></span>
            <h3 className="text-base font-bold text-slate-800">Tinggi vs Umur</h3>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis type="number" dataKey="age" name="Umur" unit=" bln" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis type="number" dataKey="height" name="TB" unit=" cm" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter name="Anak-anak" data={data} fill="#22c55e" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Nutrition Status Info Section */}
      <div className="mt-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-sky-500 rounded-xl text-white">
            <HelpCircle size={20} />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-800">Info Status Gizi</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Penjelasan & Rekomendasi Pelayanan</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-2">
          {[
            { 
              title: 'Gizi Baik', 
              desc: 'Pertumbuhan anak sesuai dengan standar kesehatan.', 
              rek: 'Lanjutkan pemberian ASI/MP-ASI bergizi dan pantau rutin di Posyandu.',
              color: 'bg-emerald-50 border-emerald-100 text-emerald-700',
              iconColor: 'bg-emerald-100 text-emerald-600',
              icon: <Check size={16} />
            },
            { 
              title: 'Gizi Kurang', 
              desc: 'Indikasi asupan nutrisi yang tidak memadai atau penyakit.', 
              rek: 'Tingkatkan asupan protein hewani dan konsultasikan ke petugas gizi.',
              color: 'bg-amber-50 border-amber-100 text-amber-700',
              iconColor: 'bg-amber-100 text-amber-600',
              icon: <AlertCircle size={16} />
            },
            { 
              title: 'Gizi Buruk', 
              desc: 'Kondisi gawat darurat nutrisi yang membutuhkan penanganan medis.', 
              rek: 'Segera rujuk ke Puskesmas atau Rumah Sakit untuk penanganan intensif.',
              color: 'bg-rose-50 border-rose-100 text-rose-700',
              iconColor: 'bg-rose-100 text-rose-600',
              icon: <XCircle size={16} />
            },
            { 
              title: 'Gizi Lebih', 
              desc: 'Asupan energi melebihi kebutuhan harian anak.', 
              rek: 'Batasi konsumsi gula/lemak berlebih dan tingkatkan aktivitas fisik bermain.',
              color: 'bg-sky-50 border-sky-100 text-sky-700',
              iconColor: 'bg-sky-100 text-sky-600',
              icon: <ArrowUpCircle size={16} />
            }
          ].map((info, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -5 }}
              className={cn("p-6 rounded-[32px] border-2 flex flex-col gap-4 transition-all hover:shadow-xl hover:shadow-slate-200/40", info.color)}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-[0.1em]">{info.title}</span>
                <div className={cn("p-2 rounded-xl", info.iconColor)}>
                  {info.icon}
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-[10px] font-bold leading-relaxed">{info.desc}</p>
                <div className="pt-3 border-t border-black/5">
                  <p className="text-[9px] font-black uppercase tracking-widest mb-1 opacity-60">Rekomendasi:</p>
                  <p className="text-[10px] font-medium leading-relaxed italic">"{info.rek}"</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Items Table in Dashboard */}
      <div className="rounded-[24px] bg-white p-6 shadow-sm border border-sky-50 overflow-hidden">
        <h3 className="font-bold text-slate-800 mb-6 px-2">Data Balita Terakhir</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-[10px] text-slate-400 uppercase tracking-widest border-b border-slate-50">
                <th className="pb-4 px-2">Nama Balita</th>
                <th className="pb-4 px-2">Gender</th>
                <th className="pb-4 px-2">BB/TB</th>
                <th className="pb-4 px-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {analysis.slice(0, 5).map((item) => (
                <tr key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-2 font-bold text-slate-700">{item.name}</td>
                  <td className="py-4 px-2 text-slate-500">{item.gender}</td>
                  <td className="py-4 px-2 text-slate-600 font-medium">{item.weight}kg / {item.height}cm</td>
                  <td className="py-4 px-2">
                    <span className={cn("inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase", getStatusColor(item.status || ''))}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
