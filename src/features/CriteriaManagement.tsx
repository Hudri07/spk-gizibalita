import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PlusCircle, Pencil, Trash2, X, AlertCircle } from 'lucide-react';
import { Criteria } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CriteriaManagementProps {
  criteria: Criteria[];
  fetchCriteria: () => void;
}

const CriteriaManagement: React.FC<CriteriaManagementProps> = ({ criteria, fetchCriteria }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingCriteria, setEditingCriteria] = useState<Criteria | null>(null);
  const [deletingCriteria, setDeletingCriteria] = useState<Criteria | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    weight: '',
    type: 'benefit' as 'benefit' | 'cost'
  });

  const totalWeight = criteria.reduce((sum, c) => sum + parseFloat(c.weight as any), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const url = editingCriteria ? `/api/criteria/${editingCriteria.id}` : '/api/criteria';
      const method = editingCriteria ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          weight: parseFloat(formData.weight)
        })
      });

      if (res.ok) {
        setIsModalOpen(false);
        setEditingCriteria(null);
        setFormData({ code: '', name: '', weight: '', type: 'benefit' });
        fetchCriteria();
      }
    } catch (err) {
      console.error('Error saving criteria:', err);
    }
  };

  const handleEdit = (c: Criteria) => {
    setEditingCriteria(c);
    setFormData({
      code: c.code,
      name: c.name,
      weight: c.weight.toString(),
      type: c.type
    });
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingCriteria) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/criteria/${deletingCriteria.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setIsDeleteModalOpen(false);
        setDeletingCriteria(null);
        fetchCriteria();
      }
    } catch (err) {
      console.error('Error deleting criteria:', err);
    }
  };

  const confirmDelete = (c: Criteria) => {
    setDeletingCriteria(c);
    setIsDeleteModalOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-black text-slate-800">Manajemen Kriteria</h3>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Atur Parameter Perhitungan SAW</p>
        </div>
        <button 
          onClick={() => {
            setEditingCriteria(null);
            setFormData({ code: '', name: '', weight: '', type: 'benefit' });
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 rounded-2xl bg-sky-500 px-6 py-4 text-xs font-black text-white shadow-xl shadow-sky-100 hover:bg-sky-600 transition-all active:scale-95"
        >
          <PlusCircle size={18} />
          TAMBAH KRITERIA
        </button>
      </div>

      {Math.abs(totalWeight - 1) > 0.001 && (
        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-4 flex items-center gap-3 text-amber-700">
          <AlertCircle size={20} />
          <p className="text-xs font-bold">Peringatan: Total bobot saat ini adalah <span className="underline">{totalWeight.toFixed(2)}</span>. Sebaiknya total bobot berjumlah 1.00.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {criteria.map((c) => (
          <motion.div 
            key={c.id}
            layoutId={`criteria-${c.id}`}
            className="bg-white rounded-[32px] p-6 border border-sky-50 shadow-sm relative group overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => handleEdit(c)} className="p-2 bg-sky-50 text-sky-500 rounded-xl hover:bg-sky-100 transition-colors">
                <Pencil size={14} />
              </button>
              <button onClick={() => confirmDelete(c)} className="p-2 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-100 transition-colors">
                <Trash2 size={14} />
              </button>
            </div>
            <div className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center font-black text-white mb-4 shadow-lg",
              c.code === 'C1' ? "bg-sky-500 shadow-sky-100" :
              c.code === 'C2' ? "bg-emerald-500 shadow-emerald-100" :
              c.code === 'C3' ? "bg-amber-500 shadow-amber-100" : "bg-purple-500 shadow-purple-100"
            )}>
              {c.code}
            </div>
            <h4 className="font-black text-slate-700 mb-1">{c.name}</h4>
            <div className="flex items-center justify-between mt-4">
              <div>
                <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Bobot</span>
                <span className="text-lg font-black text-slate-800">{(c.weight * 100).toFixed(0)}%</span>
              </div>
              <div className="text-right">
                <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Tipe</span>
                <span className={cn(
                  "text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-lg border",
                  c.type === 'benefit' ? "text-emerald-500 bg-emerald-50 border-emerald-100" : "text-amber-500 bg-amber-50 border-amber-100"
                )}>
                  {c.type}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-md bg-white rounded-[40px] p-8 shadow-2xl border border-white"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black text-slate-800">{editingCriteria ? 'Edit Kriteria' : 'Tambah Kriteria'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl"><X size={20}/></button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Kode</label>
                    <input 
                      type="text" required placeholder="Contoh: C5"
                      className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-sky-500"
                      value={formData.code}
                      onChange={e => setFormData({...formData, code: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tipe</label>
                    <select 
                      className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-sky-500"
                      value={formData.type}
                      onChange={e => setFormData({...formData, type: e.target.value as any})}
                    >
                      <option value="benefit">Benefit</option>
                      <option value="cost">Cost</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Kriteria</label>
                  <input 
                    type="text" required placeholder="Contoh: Lingkar Lengan"
                    className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-sky-500"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Bobot (0 - 1)</label>
                  <input 
                    type="number" step="0.01" min="0" max="1" required placeholder="Contoh: 0.25"
                    className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-sky-500"
                    value={formData.weight}
                    onChange={e => setFormData({...formData, weight: e.target.value})}
                  />
                </div>

                <button type="submit" className="w-full rounded-2xl bg-sky-600 py-4.5 text-xs font-black text-white shadow-xl shadow-sky-100 transition-all hover:bg-sky-700 active:scale-[0.98]">
                  SIMPAN KRITERIA
                </button>
              </form>
            </motion.div>
          </div>
        )}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-sm bg-white rounded-[40px] p-8 shadow-2xl border border-white text-center"
            >
              <div className="mx-auto w-16 h-16 bg-rose-100 text-rose-500 rounded-3xl flex items-center justify-center mb-6">
                <Trash2 size={32} />
              </div>
              <h3 className="text-xl font-black text-slate-800 mb-2">Hapus Kriteria?</h3>
              <p className="text-sm font-bold text-slate-400 mb-8 leading-relaxed">
                Apakah Anda yakin ingin menghapus kriteria <span className="text-rose-500 font-black">"{deletingCriteria?.name}"</span>? Perhitungan SAW akan berubah secara otomatis.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="rounded-2xl bg-slate-100 py-4 text-xs font-black text-slate-600 transition-all hover:bg-slate-200"
                >
                  BATAL
                </button>
                <button 
                  onClick={handleDelete}
                  className="rounded-2xl bg-rose-500 py-4 text-xs font-black text-white shadow-xl shadow-rose-100 transition-all hover:bg-rose-600"
                >
                  YA, HAPUS
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CriteriaManagement;
