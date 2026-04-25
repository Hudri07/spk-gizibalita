import React from 'react';
import { motion } from 'motion/react';
import { Balita } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface DataEntryProps {
  formData: {
    name: string;
    weight: string;
    height: string;
    age: string;
    gender: 'L' | 'P';
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    name: string;
    weight: string;
    height: string;
    age: string;
    gender: 'L' | 'P';
  }>>;
  validationErrors: Record<string, string>;
  setValidationErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  handleSubmit: (e: React.FormEvent) => void;
  editingBalita: Balita | null;
}

const DataEntry: React.FC<DataEntryProps> = ({ 
  formData, 
  setFormData, 
  validationErrors, 
  setValidationErrors,
  handleSubmit,
  editingBalita
}) => {
  return (
    <motion.div
      key="add"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-2xl pb-20 md:pb-10"
    >
      <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-2xl shadow-sky-100/50 border border-white">
        <div className="mb-10">
          <h3 className="text-2xl font-black text-slate-800 tracking-tight">
            {editingBalita ? 'Edit Data Balita' : 'Pendaftaran Balita'}
          </h3>
          <p className="text-slate-500 text-sm font-bold mt-1">Lengkapi data untuk perhitungan status gizi otomatis.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Nama Balita</label>
            <input 
              type="text" 
              required
              className={cn(
                "w-full rounded-2xl border px-5 py-4 text-sm font-semibold outline-none transition-all focus:ring-2 focus:bg-white",
                validationErrors.name ? "border-rose-300 bg-rose-50/30 focus:ring-rose-500" : "border-slate-100 bg-slate-50 focus:ring-sky-500"
              )}
              placeholder="Arka Putra"
              value={formData.name}
              onChange={e => {
                const val = e.target.value;
                setFormData({ ...formData, name: val });
                if (val.trim().length < 3) {
                  setValidationErrors(prev => ({ ...prev, name: 'Nama minimal 3 karakter' }));
                } else {
                  const newErrors = { ...validationErrors };
                  delete newErrors.name;
                  setValidationErrors(newErrors);
                }
              }}
            />
            {validationErrors.name && (
              <p className="text-[10px] font-bold text-rose-500 ml-2 animate-in fade-in slide-in-from-top-1">{validationErrors.name}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Berat Badan (kg)</label>
              <input 
                type="number" step="0.1" required
                className={cn(
                  "w-full rounded-2xl border px-5 py-4 text-sm font-semibold outline-none transition-all focus:ring-2 focus:bg-white",
                  validationErrors.weight ? "border-rose-300 bg-rose-50/30 focus:ring-rose-500" : "border-slate-100 bg-slate-50 focus:ring-sky-500"
                )}
                placeholder="12.5"
                value={formData.weight}
                onChange={e => {
                  const val = e.target.value;
                  setFormData({ ...formData, weight: val });
                  const num = parseFloat(val);
                  if (val && (num <= 0 || num > 100)) {
                    setValidationErrors(prev => ({ ...prev, weight: 'BB harus 0.1 - 100 kg' }));
                  } else {
                    const newErrors = { ...validationErrors };
                    delete newErrors.weight;
                    setValidationErrors(newErrors);
                  }
                }}
              />
              {validationErrors.weight && (
                <p className="text-[10px] font-bold text-rose-500 ml-2 animate-in fade-in slide-in-from-top-1">{validationErrors.weight}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Tinggi Badan (cm)</label>
              <input 
                type="number" step="0.1" required
                className={cn(
                  "w-full rounded-2xl border px-5 py-4 text-sm font-semibold outline-none transition-all focus:ring-2 focus:bg-white",
                  validationErrors.height ? "border-rose-300 bg-rose-50/30 focus:ring-rose-500" : "border-slate-100 bg-slate-50 focus:ring-sky-500"
                )}
                placeholder="85.0"
                value={formData.height}
                onChange={e => {
                  const val = e.target.value;
                  setFormData({ ...formData, height: val });
                  const num = parseFloat(val);
                  if (val && (num < 30 || num > 200)) {
                    setValidationErrors(prev => ({ ...prev, height: 'TB harus 30 - 200 cm' }));
                  } else {
                    const newErrors = { ...validationErrors };
                    delete newErrors.height;
                    setValidationErrors(newErrors);
                  }
                }}
              />
              {validationErrors.height && (
                <p className="text-[10px] font-bold text-rose-500 ml-2 animate-in fade-in slide-in-from-top-1">{validationErrors.height}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Umur (Bulan)</label>
              <input 
                type="number" required
                className={cn(
                  "w-full rounded-2xl border px-5 py-4 text-sm font-semibold outline-none transition-all focus:ring-2 focus:bg-white",
                  validationErrors.age ? "border-rose-300 bg-rose-50/30 focus:ring-rose-500" : "border-slate-100 bg-slate-50 focus:ring-sky-500"
                )}
                placeholder="24"
                value={formData.age}
                onChange={e => {
                  const val = e.target.value;
                  setFormData({ ...formData, age: val });
                  const num = parseInt(val);
                  if (val && (num <= 0 || num > 60)) {
                    setValidationErrors(prev => ({ ...prev, age: 'Umur harus 1 - 60 bulan' }));
                  } else {
                    const newErrors = { ...validationErrors };
                    delete newErrors.age;
                    setValidationErrors(newErrors);
                  }
                }}
              />
              {validationErrors.age && (
                <p className="text-[10px] font-bold text-rose-500 ml-2 animate-in fade-in slide-in-from-top-1">{validationErrors.age}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Jenis Kelamin</label>
              <div className="flex gap-2 p-1.5 bg-slate-50 rounded-2xl border border-slate-100">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, gender: 'L' })}
                  className={cn(
                    "flex-1 py-3 text-xs font-black rounded-xl transition-all",
                    formData.gender === 'L' ? "bg-white text-sky-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                  )}
                >
                  LAKI-LAKI
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, gender: 'P' })}
                  className={cn(
                    "flex-1 py-3 text-xs font-black rounded-xl transition-all",
                    formData.gender === 'P' ? "bg-white text-rose-500 shadow-sm" : "text-slate-400 hover:text-slate-600"
                  )}
                >
                  PEREMPUAN
                </button>
              </div>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full rounded-2xl bg-sky-500 py-5 text-sm font-black text-white shadow-xl shadow-sky-100 transition-all hover:bg-sky-600 hover:shadow-sky-200 active:scale-95 disabled:opacity-50 disabled:active:scale-100"
            disabled={Object.keys(validationErrors).length > 0}
          >
            {editingBalita ? 'PERBARUI DATA' : 'SIMPAN DATA BALITA'}
          </button>
          
          {editingBalita && (
            <button 
              type="button"
              onClick={() => {
                setFormData({ name: '', weight: '', height: '', age: '', gender: 'L' });
                // Note: The parent component should handle setEditingBalita(null) and closing the form
              }}
              className="w-full mt-2 rounded-2xl bg-slate-100 py-5 text-sm font-black text-slate-500 transition-all hover:bg-slate-200 active:scale-95"
            >
              BATAL EDIT
            </button>
          )}
        </form>
      </div>
    </motion.div>
  );
};

export default DataEntry;
