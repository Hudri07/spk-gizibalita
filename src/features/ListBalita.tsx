import React from 'react';
import { motion } from 'motion/react';
import { Search, Pencil, Trash2, ChevronRight } from 'lucide-react';
import { Balita } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ListBalitaProps {
  filteredData: Balita[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  itemsPerPage: number;
  handleEdit: (balita: Balita) => void;
  setDeletingBalita: (balita: Balita) => void;
  getStatusColor: (status: string) => string;
}

const ListBalita: React.FC<ListBalitaProps> = ({
  filteredData,
  searchTerm,
  setSearchTerm,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  handleEdit,
  setDeletingBalita,
  getStatusColor
}) => {
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <motion.div
      key="list"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="space-y-6"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Cari nama balita..." 
            className="w-full rounded-2xl border border-slate-100 bg-white py-4 pl-12 pr-4 text-sm font-bold text-slate-700 shadow-sm outline-none focus:ring-4 focus:ring-sky-50"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-[32px] border border-sky-50 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/50">
              <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                <th className="px-8 py-6">Balita</th>
                <th className="px-6 py-6">Gender</th>
                <th className="px-6 py-6 text-center">Umur</th>
                <th className="px-6 py-6">Pemeriksaan BB/TB</th>
                <th className="px-6 py-6">Status Gizi</th>
                <th className="px-8 py-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {currentItems.map((item) => (
                <tr key={item.id} className="group hover:bg-sky-50/20 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 overflow-hidden rounded-xl bg-sky-100 p-1">
                         <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.name}&topType=${item.gender === 'L' ? 'ShortHairShortFlat' : 'LongHairCurvy'}`} alt="avatar" />
                      </div>
                      <span className="font-bold text-slate-700">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-black",
                      item.gender === 'L' ? "bg-sky-50 text-sky-600" : "bg-rose-50 text-rose-500"
                    )}>
                      {item.gender === 'L' ? 'LAKI-LAKI' : 'PEREMPUAN'}
                    </span>
                  </td>
                  <td className="px-6 py-6 text-center font-bold text-slate-500">{item.age} bln</td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-2 font-bold text-slate-700">
                      <span>{item.weight} <span className="text-[10px] opacity-40">kg</span></span>
                      <span className="text-slate-200">/</span>
                      <span>{item.height} <span className="text-[10px] opacity-40">cm</span></span>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <span className={cn("inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border", getStatusColor(item.status || ''))}>
                      {item.status || 'BELUM DIHITUNG'}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleEdit(item)}
                        className="p-2 text-slate-400 hover:bg-sky-50 hover:text-sky-600 rounded-xl transition-all"
                      >
                        <Pencil size={18} />
                      </button>
                      <button 
                        onClick={() => setDeletingBalita(item)}
                        className="p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {currentItems.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center">
                    <div className="mb-4 flex flex-col items-center gap-2 opacity-20">
                      <Search size={48} />
                      <p className="text-lg font-black italic tracking-tight">Data tidak ditemukan</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination UI */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-50 px-8 py-6">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Halaman {currentPage} dari {totalPages}</p>
            <div className="flex gap-2">
              <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="rounded-xl border border-slate-100 px-4 py-2 text-xs font-bold text-slate-600 transition-all hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-transparent"
              >
                Sebelumnya
              </button>
              <button 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="rounded-xl border border-slate-100 bg-sky-500 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-sky-100 transition-all hover:bg-sky-600 disabled:opacity-30"
              >
                Selanjutnya
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ListBalita;
