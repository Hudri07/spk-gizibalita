import React, { useState, useEffect } from 'react';
import { 
  Baby, ChevronRight, LayoutDashboard, List, PlusCircle, 
  AlertCircle, User, Pencil, X, Trash2, BarChart as BarChartIcon, Lock, Eye, EyeOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Balita, User as UserType, Profile, Criteria } from './types';

// Feature Components
import Dashboard from './features/Dashboard';
import DataEntry from './features/DataEntry';
import ListBalita from './features/ListBalita';
import AnalysisSAW from './features/AnalysisSAW';
import CriteriaManagement from './features/CriteriaManagement';
import ProfileModal from './features/ProfileModal';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [user, setUser] = useState<UserType | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'add' | 'list' | 'saw' | 'criteria'>('dashboard');
  const [data, setData] = useState<Balita[]>([]);
  const [analysis, setAnalysis] = useState<Balita[]>([]);
  const [criteria, setCriteria] = useState<Criteria[]>([]);
  const [loading, setLoading] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [authError, setAuthError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    weight: '',
    height: '',
    age: '',
    gender: 'L' as 'L' | 'P'
  });
  const [editingBalita, setEditingBalita] = useState<Balita | null>(null);
  const [deletingBalita, setDeletingBalita] = useState<Balita | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [showExplanation, setShowExplanation] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [profile, setProfile] = useState<Profile>({
    name: 'Siti Aminah',
    role: 'Petugas Gizi',
    location: 'Posyandu Melati',
    avatar: 'Siti',
    email: '',
    notifications: {
      giziBurukAlert: true
    }
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profilePass, setProfilePass] = useState({ new: '', confirm: '' });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };
      
      const res = await fetch('/api/balita', { headers });
      const json = await res.json();
      setData(Array.isArray(json) ? json : []);
      
      const resAnalysis = await fetch('/api/balita/analysis', { headers });
      const jsonAnalysis = await resAnalysis.json();
      setAnalysis(Array.isArray(jsonAnalysis) ? jsonAnalysis : []);

      const resCriteria = await fetch('/api/criteria', { headers });
      const jsonCriteria = await resCriteria.json();
      setCriteria(Array.isArray(jsonCriteria) ? jsonCriteria : []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setData([]);
      setAnalysis([]);
      setCriteria([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCriteria = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/criteria', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const json = await res.json();
      setCriteria(Array.isArray(json) ? json : []);
      
      // Also refresh analysis if criteria changed
      const resAnalysis = await fetch('/api/balita/analysis', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const jsonAnalysis = await resAnalysis.json();
      setAnalysis(Array.isArray(jsonAnalysis) ? jsonAnalysis : []);
    } catch (err) {
      console.error('Error fetching criteria:', err);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      if (token && savedUser) {
        setUser(JSON.parse(savedUser));
      }
      setAuthLoading(false);
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      const endpoint = isRegistering ? '/api/auth/register' : '/api/auth/login';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      });
      const json = await res.json();
      if (res.ok) {
        if (isRegistering) {
           setIsRegistering(false);
           setAuthError('Registration successful! Please login.');
        } else {
           localStorage.setItem('token', json.token);
           localStorage.setItem('user', JSON.stringify(json.user));
           setUser(json.user);
        }
      } else {
        setAuthError(json.error || 'Authentication failed');
      }
    } catch (err) {
      setAuthError('Server error');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setData([]);
    setAnalysis([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.keys(validationErrors).length > 0) {
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const url = editingBalita ? `/api/balita/${editingBalita.id}` : '/api/balita';
      const method = editingBalita ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name,
          weight: parseFloat(formData.weight),
          height: parseFloat(formData.height),
          age: parseInt(formData.age),
          gender: formData.gender
        })
      });
      if (res.ok) {
        setFormData({ name: '', weight: '', height: '', age: '', gender: 'L' });
        setEditingBalita(null);
        fetchData();
        setActiveTab('dashboard');
      }
    } catch (err) {
      console.error('Error saving data:', err);
    }
  };

  const handleEdit = (balita: Balita) => {
    setEditingBalita(balita);
    setFormData({
      name: balita.name,
      weight: balita.weight.toString(),
      height: balita.height.toString(),
      age: balita.age.toString(),
      gender: balita.gender
    });
    setActiveTab('add');
  };

  const handleDelete = async () => {
    if (!deletingBalita) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/balita/${deletingBalita.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setDeletingBalita(null);
        fetchData();
      }
    } catch (err) {
      console.error('Error deleting data:', err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Gizi Baik': return 'text-green-600 bg-green-50 border-green-200';
      case 'Gizi Kurang': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'Gizi Buruk': return 'text-red-600 bg-red-50 border-red-200';
      case 'Gizi Lebih': return 'text-sky-600 bg-sky-50 border-sky-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const safeData = Array.isArray(data) ? data : [];
  const safeAnalysis = Array.isArray(analysis) ? analysis : [];

  const filteredData = safeAnalysis
    .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => a.id - b.id);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sky-50">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="h-12 w-12 border-4 border-sky-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen font-sans text-slate-900 selection:bg-sky-100 selection:text-sky-900 flex items-center justify-center p-4 bg-[#f8fafc]">
        {/* Decorative elements */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden bg-slate-50">
          <div className="absolute inset-0 opacity-[0.4]" style={{ backgroundImage: 'linear-gradient(#e2e8f0 1.5px, transparent 1.5px), linear-gradient(90deg, #e2e8f0 1.5px, transparent 1.5px)', backgroundSize: '40px 40px' }} />
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-sky-400/20 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-400/20 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
          
          <motion.div 
            animate={{ y: [0, -20, 0], rotate: [0, 45, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute top-[15%] left-[20%] w-16 h-16 bg-sky-500/5 rounded-2xl border border-sky-500/10 rotate-12" 
          />
          <motion.div 
            animate={{ y: [0, 30, 0], rotate: [0, -45, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[20%] left-[15%] w-24 h-24 bg-blue-500/5 rounded-[32px] border border-blue-500/10 -rotate-12" 
          />
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative w-full max-w-[440px]"
        >
          <div className="bg-white/80 backdrop-blur-2xl rounded-[40px] p-8 md:p-12 shadow-[0_32px_64px_-16px_rgba(14,165,233,0.15)] border border-white/60">
            <div className="text-center mb-10">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 text-white font-black text-3xl shadow-xl shadow-sky-200 mb-6">B</div>
              <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-2">BalitaSmart</h1>
              <p className="text-slate-500 font-medium text-sm">Sistem Informasi Pemantauan Gizi Balita</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-1.5 focus-within:scale-[1.01] transition-transform">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Username</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    <User size={18} strokeWidth={2.5} />
                  </div>
                  <input 
                    type="text" required placeholder="Masukkan username"
                    className="w-full rounded-2xl border-2 border-slate-100 bg-white py-4 pl-12 pr-4 text-sm font-bold text-slate-700 outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-50 transition-all"
                    value={loginData.username}
                    onChange={e => setLoginData({...loginData, username: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-1.5 focus-within:scale-[1.01] transition-transform">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Password</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    <Lock size={18} strokeWidth={2.5} />
                  </div>
                  <input 
                    type={showPassword ? "text" : "password"} required placeholder="Masukkan password"
                    className="w-full rounded-2xl border-2 border-slate-100 bg-white py-4 pl-12 pr-12 text-sm font-bold text-slate-700 outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-50 transition-all"
                    value={loginData.password}
                    onChange={e => setLoginData({...loginData, password: e.target.value})}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-sky-500 transition-colors">
                    {showPassword ? <EyeOff size={18} strokeWidth={2.5} /> : <Eye size={18} strokeWidth={2.5} />}
                  </button>
                </div>
              </div>

              {authError && <div className="bg-rose-50 border border-rose-100 text-rose-600 p-4 rounded-2xl text-[11px] font-bold flex items-center gap-2">{authError}</div>}

              <button type="submit" className="w-full rounded-2xl bg-sky-600 py-4.5 text-sm font-black text-white shadow-xl shadow-sky-100 transition-all hover:bg-sky-700 active:scale-[0.98]">
                MASUK KE DASHBOARD
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans text-slate-900 selection:bg-sky-100 selection:text-sky-900">
      {/* Sidebar / Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white/80 backdrop-blur-xl px-6 py-3 md:top-0 md:bottom-auto md:w-64 md:h-screen md:border-t-0 md:border-r md:border-sky-100/50">
        <div className="mb-10 hidden items-center gap-3 md:flex p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500 text-white font-black text-2xl shadow-xl shadow-sky-200">B</div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-sky-900">BalitaSmart</h1>
            <p className="text-[10px] font-bold text-sky-400 uppercase tracking-widest">Puskesmas Digital</p>
          </div>
        </div>

        <ul className="flex justify-around gap-2 md:flex-col md:justify-start md:px-4">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
            { id: 'criteria', icon: AlertCircle, label: 'Kriteria' },
            { id: 'add', icon: PlusCircle, label: 'Input Data' },
            { id: 'list', icon: List, label: 'Daftar Balita' },
            { id: 'saw', icon: BarChartIcon, label: 'Metode SAW' },
          ].map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveTab(item.id as any)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 w-full",
                  activeTab === item.id 
                    ? "bg-sky-50 text-sky-600" 
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <item.icon size={20} />
                <span className="hidden md:inline">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Main Content */}
      <main className="pb-24 md:pl-64 md:pb-8">
        <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-sky-50 md:static md:bg-transparent md:border-b-0">
          <div className="flex h-20 items-center justify-between px-4 md:px-8 md:h-28">
            <div className="flex flex-col min-w-0">
              <h2 className="text-base md:text-2xl font-black text-slate-800 capitalize leading-tight truncate">
                {activeTab === 'dashboard' ? `Sobat, ${user.username}!` : 
                 activeTab === 'criteria' ? 'Manajemen Kriteria' :
                 activeTab === 'add' ? 'Input Data' : 
                 activeTab === 'list' ? 'Daftar Balita' : 'Metode SAW'}
              </h2>
              {activeTab === 'dashboard' && <p className="text-slate-500 text-[9px] md:text-sm font-bold truncate opacity-80">Pantau tumbuh kembang hari ini.</p>}
            </div>
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end">
                <button onClick={() => setIsEditingProfile(true)} className="text-xs md:text-sm font-black text-slate-800 hover:text-sky-600 transition-colors">{profile.name}</button>
                <button onClick={handleLogout} className="text-[8px] md:text-[10px] font-bold text-rose-500 uppercase tracking-widest">Keluar</button>
              </div>
              <button onClick={() => setIsEditingProfile(true)} className="h-9 w-9 md:h-12 md:w-12 overflow-hidden rounded-[14px] md:rounded-[18px] border-2 border-white bg-sky-200 shadow-lg cursor-pointer hover:scale-110 transition-transform">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.avatar}`} alt="Profile" className="w-full h-full object-cover" />
              </button>
            </div>
          </div>
        </header>

        <section className="px-4 md:px-8">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && <Dashboard data={safeData} analysis={safeAnalysis} profile={profile} />}
            
            {activeTab === 'criteria' && <CriteriaManagement criteria={criteria} fetchCriteria={fetchCriteria} />}

            {activeTab === 'add' && (
              <DataEntry 
                formData={formData} 
                setFormData={setFormData}
                validationErrors={validationErrors}
                setValidationErrors={setValidationErrors}
                handleSubmit={handleSubmit}
                editingBalita={editingBalita}
              />
            )}

            {activeTab === 'list' && (
              <ListBalita 
                filteredData={filteredData}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                itemsPerPage={itemsPerPage}
                handleEdit={handleEdit}
                setDeletingBalita={setDeletingBalita}
                getStatusColor={getStatusColor}
              />
            )}

            {activeTab === 'saw' && (
              <AnalysisSAW 
                data={safeData}
                analysis={safeAnalysis}
                criteria={criteria}
                showExplanation={showExplanation}
                setShowExplanation={setShowExplanation}
                getStatusColor={getStatusColor}
              />
            )}
          </AnimatePresence>
        </section>
      </main>

      {/* Profile Modal */}
      <AnimatePresence>
        {isEditingProfile && (
          <ProfileModal 
            profile={profile}
            setProfile={setProfile}
            profilePass={profilePass}
            setProfilePass={setProfilePass}
            showNewPassword={showNewPassword}
            setShowNewPassword={setShowNewPassword}
            showConfirmPassword={showConfirmPassword}
            setShowConfirmPassword={setShowConfirmPassword}
            setIsEditingProfile={setIsEditingProfile}
          />
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deletingBalita && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-[40px] p-8 max-w-sm w-full text-center">
              <div className="h-16 w-16 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-6"><Trash2 size={32}/></div>
              <h3 className="text-xl font-black text-slate-800 mb-2">Hapus Data?</h3>
              <p className="text-slate-500 text-sm font-medium mb-8">Data balita <span className="text-slate-800 font-bold">{deletingBalita.name}</span> akan terhapus permanen dari sistem.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeletingBalita(null)} className="flex-1 py-4 text-xs font-black text-slate-400 hover:text-slate-600">BATAL</button>
                <button onClick={handleDelete} className="flex-1 py-4 bg-rose-500 text-white rounded-2xl text-xs font-black shadow-lg shadow-rose-100">YA, HAPUS</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
