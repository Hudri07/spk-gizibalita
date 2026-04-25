import React from 'react';
import { motion } from 'motion/react';
import { X, User, ChevronRight, LayoutDashboard, Lock, Eye, EyeOff, BellRing, BellOff } from 'lucide-react';
import { Profile } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ProfileModalProps {
  profile: Profile;
  setProfile: React.Dispatch<React.SetStateAction<Profile>>;
  profilePass: { new: string; confirm: string };
  setProfilePass: React.Dispatch<React.SetStateAction<{ new: string; confirm: string }>>;
  showNewPassword: boolean;
  setShowNewPassword: (show: boolean) => void;
  showConfirmPassword: boolean;
  setShowConfirmPassword: (show: boolean) => void;
  setIsEditingProfile: (show: boolean) => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({
  profile,
  setProfile,
  profilePass,
  setProfilePass,
  showNewPassword,
  setShowNewPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  setIsEditingProfile
}) => {
  const toggleNotification = () => {
    setProfile({
      ...profile,
      notifications: {
        ...profile.notifications,
        giziBurukAlert: !profile.notifications.giziBurukAlert
      }
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-lg bg-white rounded-[40px] p-8 shadow-2xl border border-white"
      >
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-black text-slate-800">Pengaturan</h3>
          <button onClick={() => setIsEditingProfile(false)} className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl"><X size={20}/></button>
        </div>
        <div className="space-y-4 max-h-[70vh] overflow-y-auto px-1 scrollbar-hide pb-4">
          <div className="flex justify-center mb-6">
            <div className="relative group">
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.avatar}`} className="w-24 h-24 rounded-3xl bg-sky-100 border-4 border-white shadow-xl" alt="Preview"/>
              <button 
                onClick={() => setProfile({...profile, avatar: Math.random().toString(36).substring(7)})}
                className="absolute -bottom-2 -right-2 p-2 bg-white rounded-xl shadow-lg border border-slate-100 text-sky-500 hover:scale-110 active:scale-95 transition-all"
              >
                <TrendingUp size={16} />
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-4">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Preferensi Notifikasi</p>
            <div 
              onClick={toggleNotification}
              className="group cursor-pointer flex items-center justify-between p-4 rounded-3xl bg-slate-50 border border-slate-100 transition-all hover:bg-white hover:shadow-xl hover:shadow-slate-200/50"
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "p-3 rounded-2xl transition-colors",
                  profile.notifications.giziBurukAlert ? "bg-rose-100 text-rose-500" : "bg-slate-200 text-slate-400"
                )}>
                  {profile.notifications.giziBurukAlert ? <BellRing size={20} /> : <BellOff size={20} />}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-700">Waspada Gizi Buruk</h4>
                  <p className="text-[10px] font-medium text-slate-400">Tampilkan notifikasi di dashboard jika terdeteksi gizi buruk.</p>
                </div>
              </div>
              <div className={cn(
                "w-12 h-6 rounded-full relative transition-colors duration-300",
                profile.notifications.giziBurukAlert ? "bg-rose-500" : "bg-slate-300"
              )}>
                <div className={cn(
                  "absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300",
                  profile.notifications.giziBurukAlert ? "left-7" : "left-1"
                )} />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-4">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Identitas Petugas</p>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Petugas</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <User size={16} />
                </div>
                <input 
                  type="text" 
                  className="w-full rounded-2xl border border-slate-100 bg-slate-50 pl-12 pr-5 py-4 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-sky-500"
                  value={profile.name}
                  placeholder="Nama lengkap"
                  onChange={e => setProfile({...profile, name: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email (Opsional)</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <ChevronRight size={16} />
                </div>
                <input 
                  type="email" 
                  className="w-full rounded-2xl border border-slate-100 bg-slate-50 pl-12 pr-5 py-4 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-sky-500"
                  value={profile.email}
                  placeholder="email@puskesmas.go.id"
                  onChange={e => setProfile({...profile, email: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Unit Kerja / Posyandu</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <LayoutDashboard size={16} />
                </div>
                <input 
                  type="text" 
                  className="w-full rounded-2xl border border-slate-100 bg-slate-50 pl-12 pr-5 py-4 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-sky-500"
                  value={profile.location}
                  placeholder="Nama unit"
                  onChange={e => setProfile({...profile, location: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-4">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Ganti Password</p>
            
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password Baru</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Lock size={16} />
                </div>
                <input 
                  type={showNewPassword ? "text" : "password"} 
                  className="w-full rounded-2xl border border-slate-100 bg-slate-50 pl-12 pr-12 py-4 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-sky-500"
                  value={profilePass.new}
                  placeholder="••••••••"
                  onChange={e => setProfilePass({...profilePass, new: e.target.value})}
                />
                <button 
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-sky-500"
                >
                  {showNewPassword ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>
              {profilePass.new && (
                <div className="px-2 space-y-1">
                  <div className="flex items-center gap-2">
                    <div className={cn("h-1 flex-1 rounded-full", profilePass.new.length >= 8 ? "bg-emerald-500" : "bg-slate-200")} />
                    <div className={cn("h-1 flex-1 rounded-full", /[a-zA-Z]/.test(profilePass.new) ? "bg-emerald-500" : "bg-slate-200")} />
                    <div className={cn("h-1 flex-1 rounded-full", /[0-9]/.test(profilePass.new) ? "bg-emerald-500" : "bg-slate-200")} />
                    <div className={cn("h-1 flex-1 rounded-full", /[^a-zA-Z0-9]/.test(profilePass.new) ? "bg-emerald-500" : "bg-slate-200")} />
                  </div>
                  <p className="text-[9px] font-bold text-slate-400">Minimal 8 karakter (huruf, angka, simbol)</p>
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Konfirmasi Password Baru</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Lock size={16} />
                </div>
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  className="w-full rounded-2xl border border-slate-100 bg-slate-50 pl-12 pr-12 py-4 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-sky-500"
                  value={profilePass.confirm}
                  placeholder="••••••••"
                  onChange={e => setProfilePass({...profilePass, confirm: e.target.value})}
                />
                <button 
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-sky-500"
                >
                  {showConfirmPassword ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>
              {profilePass.confirm && profilePass.confirm !== profilePass.new && (
                <p className="text-[9px] font-bold text-rose-500 ml-2">Password tidak cocok</p>
              )}
            </div>
          </div>

          <button 
            onClick={() => {
              if (profilePass.new) {
                const hasLetter = /[a-zA-Z]/.test(profilePass.new);
                const hasNumber = /[0-9]/.test(profilePass.new);
                const hasSymbol = /[^a-zA-Z0-9]/.test(profilePass.new);
                if (profilePass.new.length < 8 || !hasLetter || !hasNumber || !hasSymbol) {
                  alert('Password tidak memenuhi syarat keamanan!');
                  return;
                }
                if (profilePass.new !== profilePass.confirm) {
                  alert('Konfirmasi password tidak cocok!');
                  return;
                }
              }
              setIsEditingProfile(false);
              setProfilePass({ new: '', confirm: '' });
            }}
            className="w-full rounded-2xl bg-sky-500 py-5 text-sm font-black text-white shadow-xl shadow-sky-100 transition-all hover:bg-sky-700 active:scale-95"
          >
            SIMPAN PERUBAHAN PROFIL
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const TrendingUp = ({ size, className }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
    <polyline points="16 7 22 7 22 13" />
  </svg>
);

export default ProfileModal;
