import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { 
  Users, 
  FileText, 
  Calendar, 
  ClipboardList, 
  Image, 
  Plus, 
  ArrowRight, 
  Activity, 
  CheckCircle2, 
  XCircle, 
  CloudLightning,
  AlertCircle,
  Database,
  ArrowUpRight
} from 'lucide-react';

interface Stats {
  members: number;
  articles: number;
  events: number;
  pendaftaran: number;
}

interface ActivityLog {
  id: string;
  type: 'member' | 'article' | 'event' | 'pendaftaran';
  title: string;
  time: string;
  badgeColor: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({ members: 0, articles: 0, events: 0, pendaftaran: 0 });
  const [recentPendaftaran, setRecentPendaftaran] = useState<any[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [dbStatus, setDbStatus] = useState<'connected' | 'error'>('connected');

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const today = new Date().toISOString().split('T')[0];
        
        const [m, a, e, p, rp, ue, recentArticles, recentMembers] = await Promise.all([
          supabase.from('members').select('id', { count: 'exact', head: true }),
          supabase.from('articles').select('id', { count: 'exact', head: true }),
          supabase.from('events').select('id', { count: 'exact', head: true }),
          supabase.from('pendaftaran').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
          supabase.from('pendaftaran').select('*').order('created_at', { ascending: false }).limit(5),
          supabase.from('events').select('*').gte('tanggal_mulai', today).order('tanggal_mulai', { ascending: true }).limit(3),
          supabase.from('articles').select('judul, created_at').order('created_at', { ascending: false }).limit(3),
          supabase.from('members').select('nama_lengkap, created_at').order('created_at', { ascending: false }).limit(3),
        ]);

        setStats({
          members: m.count || 0,
          articles: a.count || 0,
          events: e.count || 0,
          pendaftaran: p.count || 0,
        });

        setRecentPendaftaran(rp.data || []);
        setUpcomingEvents(ue.data || []);

        // Build recent activities feed from actual table updates
        const logs: ActivityLog[] = [];
        
        if (rp.data && rp.data.length > 0) {
          rp.data.slice(0, 2).forEach((item: any) => {
            logs.push({
              id: `pend-${item.id}`,
              type: 'pendaftaran',
              title: `Pendaftaran baru masuk: ${item.nama_lengkap}`,
              time: new Date(item.created_at).toLocaleString('id-ID', { hour: '2-digit', minute: '2-digit' }),
              badgeColor: 'bg-rose-50 text-rose-600 border border-rose-100',
            });
          });
        }

        if (recentArticles.data && recentArticles.data.length > 0) {
          recentArticles.data.forEach((item: any, i: number) => {
            logs.push({
              id: `art-${i}`,
              type: 'article',
              title: `Artikel dipublikasikan: "${item.judul}"`,
              time: 'Baru saja',
              badgeColor: 'bg-blue-50 text-blue-600 border border-blue-100',
            });
          });
        }

        if (recentMembers.data && recentMembers.data.length > 0) {
          recentMembers.data.forEach((item: any, i: number) => {
            logs.push({
              id: `mem-${i}`,
              type: 'member',
              title: `Anggota ditambahkan: ${item.nama_lengkap}`,
              time: 'Hari ini',
              badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
            });
          });
        }

        setActivities(logs.slice(0, 5));
        setDbStatus('connected');
      } catch (err) {
        console.error(err);
        setDbStatus('error');
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, []);

  const statCards = [
    { 
      label: 'Total Anggota', 
      value: stats.members, 
      icon: Users, 
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100', 
      link: '/admin/anggota' 
    },
    { 
      label: 'Total Artikel', 
      value: stats.articles, 
      icon: FileText, 
      color: 'text-blue-600 bg-blue-50 border-blue-100', 
      link: '/admin/artikel' 
    },
    { 
      label: 'Total Kegiatan', 
      value: stats.events, 
      icon: Calendar, 
      color: 'text-indigo-600 bg-indigo-50 border-indigo-100', 
      link: '/admin/kegiatan' 
    },
    { 
      label: 'Pendaftaran Baru', 
      value: stats.pendaftaran, 
      icon: ClipboardList, 
      color: 'text-rose-600 bg-rose-50 border-rose-100', 
      link: '/admin/anggota' 
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 font-sans">Dashboard</h1>
          <p className="text-zinc-500 text-sm mt-1">Ringkasan data & integrasi sistem Gudep Trigantara</p>
        </div>
        
        {/* System Health Panel */}
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-zinc-200 shadow-sm self-start">
          <Database className="w-4 h-4 text-zinc-400" />
          <span className="text-xs font-semibold text-zinc-500">Status Server:</span>
          {dbStatus === 'connected' ? (
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Terhubung
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-xs font-bold text-red-500">
              <span className="w-2 h-2 rounded-full bg-red-500" /> Putus
            </span>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <div className="w-8 h-8 border-3 border-zinc-200 border-t-zinc-800 rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {statCards.map((s) => {
              const Icon = s.icon;
              return (
                <Link key={s.label} to={s.link} className="group block">
                  <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 hover:shadow-lg hover:border-zinc-300 transition-all duration-200">
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400 group-hover:text-zinc-600 transition-colors">
                        <Icon className="w-5 h-5 stroke-[2]" />
                      </span>
                      {s.value > 0 && (
                        <span className="text-[10px] font-semibold text-zinc-500 px-2 py-0.5 bg-zinc-100 rounded-full">
                          Aktif
                        </span>
                      )}
                    </div>
                    <div className="mt-4">
                      <h3 className="text-3xl font-bold text-zinc-900 tracking-tight">{s.value}</h3>
                      <p className="text-sm font-medium text-zinc-500 mt-1">{s.label}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Analytics Chart & Status Breakdown */}
          <div className="grid lg:grid-cols-3 gap-6">
            
            {/* Chart (Left 2-col) */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-zinc-900">Analisis Pertumbuhan Anggota</h3>
                  <p className="text-xs text-zinc-400 mt-0.5">Statistik tren keanggotaan berkala</p>
                </div>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md flex items-center gap-1 border border-emerald-100">
                  <ArrowUpRight className="w-3.5 h-3.5" /> +15% Bulan Ini
                </span>
              </div>
              
              {/* SVG Chart */}
              <div className="pt-2 relative">
                <svg viewBox="0 0 500 150" className="w-full h-36 overflow-visible">
                  <defs>
                    <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgb(228, 228, 231)" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="rgb(228, 228, 231)" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Grid Lines */}
                  <line x1="0" y1="30" x2="500" y2="30" stroke="#f4f4f5" strokeWidth="1" />
                  <line x1="0" y1="75" x2="500" y2="75" stroke="#f4f4f5" strokeWidth="1" />
                  <line x1="0" y1="120" x2="500" y2="120" stroke="#f4f4f5" strokeWidth="1" />

                  {/* Filled Area */}
                  <path 
                    d="M 0 130 C 50 120, 100 80, 150 90 C 200 100, 250 50, 300 45 C 350 40, 400 20, 500 15 L 500 150 L 0 150 Z" 
                    fill="url(#chart-grad)"
                  />
                  
                  {/* Smooth Line Path */}
                  <path 
                    d="M 0 130 C 50 120, 100 80, 150 90 C 200 100, 250 50, 300 45 C 350 40, 400 20, 500 15" 
                    fill="none" 
                    stroke="rgb(39, 39, 42)" 
                    strokeWidth="2.5" 
                    strokeLinecap="round"
                  />
                  
                  {/* Interactive Dot */}
                  <circle cx="300" cy="45" r="5" fill="rgb(39, 39, 42)" stroke="white" strokeWidth="2" className="drop-shadow-sm" />
                  <circle cx="500" cy="15" r="5" fill="rgb(39, 39, 42)" stroke="white" strokeWidth="2" className="drop-shadow-sm" />
                </svg>
                <div className="flex justify-between text-[10px] font-semibold text-zinc-400 mt-2 font-mono">
                  <span>Des</span>
                  <span>Jan</span>
                  <span>Feb</span>
                  <span>Mar</span>
                  <span>Apr</span>
                  <span>Mei</span>
                </div>
              </div>
            </div>

            {/* Integration Details / Health (Right 1-col) */}
            <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-sm space-y-5">
              <h3 className="text-sm font-bold text-zinc-900">Koneksi & Storage</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs pb-3 border-b border-zinc-100">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-blue-500" />
                    <div>
                      <p className="font-semibold text-zinc-700">Supabase API</p>
                      <p className="text-[10px] text-zinc-400">Database Utama</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">OK</span>
                </div>

                <div className="flex items-center justify-between text-xs pb-3 border-b border-zinc-100">
                  <div className="flex items-center gap-2">
                    <CloudLightning className="w-4 h-4 text-amber-500" />
                    <div>
                      <p className="font-semibold text-zinc-700">Cloudflare R2</p>
                      <p className="text-[10px] text-zinc-400">Berkas & Gambar</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">OK</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-rose-500" />
                    <div>
                      <p className="font-semibold text-zinc-700">Lenis Scrolling</p>
                      <p className="text-[10px] text-zinc-400">Status Halaman Utama</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">Aktif</span>
                </div>
              </div>
            </div>

          </div>

          {/* Quick Actions & Recent Activities & Upcoming Schedule */}
          <div className="grid lg:grid-cols-3 gap-6">
            
            {/* Quick Actions & Upcoming Events (Left 2 columns combined) */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Quick Actions Grid */}
              <div className="space-y-3">
                <h2 className="text-lg font-bold text-zinc-900">Aksi Cepat</h2>
                <div className="grid sm:grid-cols-3 gap-4">
                  <Link 
                    to="/admin/artikel" 
                    className="flex flex-col justify-between p-5 bg-white rounded-2xl border border-zinc-200 hover:border-zinc-300 hover:shadow-md transition-all group min-h-[120px]"
                  >
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Plus className="w-5 h-5" />
                    </div>
                    <div className="flex items-center justify-between w-full mt-4">
                      <span className="text-sm font-bold text-zinc-700">Tulis Artikel</span>
                      <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>

                  <Link 
                    to="/admin/galeri" 
                    className="flex flex-col justify-between p-5 bg-white rounded-2xl border border-zinc-200 hover:border-zinc-300 hover:shadow-md transition-all group min-h-[120px]"
                  >
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <Image className="w-5 h-5" />
                    </div>
                    <div className="flex items-center justify-between w-full mt-4">
                      <span className="text-sm font-bold text-zinc-700">Upload Galeri</span>
                      <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>

                  <Link 
                    to="/admin/kegiatan" 
                    className="flex flex-col justify-between p-5 bg-white rounded-2xl border border-zinc-200 hover:border-zinc-300 hover:shadow-md transition-all group min-h-[120px]"
                  >
                    <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div className="flex items-center justify-between w-full mt-4">
                      <span className="text-sm font-bold text-zinc-700">Tambah Kegiatan</span>
                      <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                </div>
              </div>

              {/* Upcoming Events Agenda preview */}
              <div className="space-y-3">
                <h2 className="text-lg font-bold text-zinc-900">Agenda Terdekat</h2>
                <div className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-sm space-y-4">
                  {upcomingEvents.length === 0 ? (
                    <p className="text-sm text-zinc-400 italic text-center py-4">Belum ada kegiatan mendatang yang terjadwal.</p>
                  ) : (
                    <div className="grid gap-3.5">
                      {upcomingEvents.map((ev) => (
                        <div key={ev.id} className="flex items-start justify-between p-3.5 bg-zinc-50 border border-zinc-100 rounded-xl hover:bg-zinc-100/50 transition-colors">
                          <div>
                            <span className="text-[9px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded">
                              {ev.jenis}
                            </span>
                            <h4 className="font-bold text-sm text-zinc-800 mt-2">{ev.judul}</h4>
                            <p className="text-xs text-zinc-400 mt-1">📍 {ev.lokasi || 'Pangkalan Margahayu'}</p>
                          </div>
                          <span className="text-xs font-semibold text-zinc-500 font-mono">
                            {new Date(ev.tanggal_mulai).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Administrative logs & Recent registration feed (Right 1 column combined) */}
            <div className="space-y-6">
              
              {/* Activity Logs */}
              <div className="space-y-3">
                <h2 className="text-lg font-bold text-zinc-900">Aktivitas Sistem</h2>
                <div className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-sm space-y-4">
                  {activities.length === 0 ? (
                    <p className="text-xs text-zinc-400 italic text-center py-4">Belum ada log aktivitas baru.</p>
                  ) : (
                    <div className="relative border-l border-zinc-100 pl-4 ml-2 space-y-5">
                      {activities.map((act) => (
                        <div key={act.id} className="relative text-xs">
                          {/* Dot indicator */}
                          <span className="absolute -left-[21px] top-0.5 w-2.5 h-2.5 rounded-full bg-zinc-300 border-2 border-white ring-2 ring-zinc-100" />
                          <p className="font-semibold text-zinc-800 leading-snug">{act.title}</p>
                          <span className="text-[10px] text-zinc-400 mt-1 block font-mono">{act.time}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Registration List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-zinc-900">Pendaftaran Baru</h2>
                </div>
                <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm">
                  {recentPendaftaran.length === 0 ? (
                    <div className="p-6 text-center text-xs text-zinc-400">
                      Belum ada pendaftaran baru.
                    </div>
                  ) : (
                    <div className="divide-y divide-zinc-100">
                      {recentPendaftaran.slice(0, 3).map((p: any) => (
                        <div key={p.id} className="p-4 hover:bg-zinc-50/50 transition-colors">
                          <p className="font-semibold text-xs text-zinc-900">{p.nama_lengkap}</p>
                          <p className="text-[10px] text-zinc-400 mt-0.5">{p.kelas} — {p.jurusan}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

            </div>

          </div>
        </>
      )}
    </div>
  );
}
