import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { BarChart3, TrendingUp, Users, Zap, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface Stats {
  totalSlots: number;
  evSlots: number;
  occupiedCount: number;
  occupancyRate: number;
  checkIns: number;
  noShowCount: number;
  totalReservationsHistory: number;
}

export default function ManagerDashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3000/api/admin/stats', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <div className="p-8 text-slate-400">Loading statistics...</div>;
  if (!stats) return <div className="p-8 text-red-400">Error loading data.</div>;

  return (
    <div className="parking-lot-view">
      <div className="asphalt-texture"></div>

      <header className="page-header">
        <h1 className="text-4xl gradient-text mb-2 flex items-center gap-4">
          <BarChart3 className="text-blue-500" size={36} /> Manager Analytics
        </h1>
        <p className="text-slate-400 font-medium tracking-wide">Real-time performance and occupancy metrics</p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        <StatCard 
          icon={<TrendingUp size={20} />} 
          label="Occupancy" 
          value={`${stats.occupancyRate}%`} 
          subValue={`${stats.occupiedCount} / ${stats.totalSlots}`}
          color="blue"
        />
        <StatCard 
          icon={<Zap size={20} />} 
          label="EV Status" 
          value={`${Math.round((stats.evSlots / stats.totalSlots) * 100)}%`} 
          subValue={`${stats.evSlots} points`}
          color="emerald"
        />
        <StatCard 
          icon={<ShieldAlert size={20} />} 
          label="No-Show" 
          value={stats.occupiedCount > 0 ? `${Math.round((stats.noShowCount / stats.occupiedCount) * 100)}%` : '0%'} 
          subValue={`${stats.noShowCount} missed`}
          color="rose"
        />
        <StatCard 
          icon={<Users size={20} />} 
          label="Total" 
          value={stats.totalReservationsHistory.toString()} 
          subValue="Bookings"
          color="amber"
        />
      </div>

      <div className="manager-health-section premium-glass">
        <h2 className="text-xl font-bold mb-8 flex items-center gap-3 text-emerald-400">
          <CheckCircle2 size={24} /> Operational Health Monitor
        </h2>
        <div className="space-y-10">
          <ProgressBar label="Daily Check-in Compliance" current={stats.checkIns} total={stats.occupiedCount} color="#10b981" />
          <ProgressBar label="Parking Availability Buffer" current={stats.totalSlots - stats.occupiedCount} total={stats.totalSlots} color="#3b82f6" />
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, subValue, color }: any) {
  const iconColors: any = {
    blue: 'text-blue-400 bg-blue-500/10',
    emerald: 'text-emerald-400 bg-emerald-500/10',
    rose: 'text-rose-400 bg-rose-500/10',
    amber: 'text-amber-400 bg-amber-500/10',
  };

  return (
    <div className={`premium-card stat-card shadow-${color}`}>
      <div className="flex items-center justify-between w-full mb-8">
        <div className={`p-3 rounded-2xl ${iconColors[color]}`}>{icon}</div>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{label}</span>
      </div>
      <div className="text-4xl font-black mb-2 tracking-tighter text-white">{value}</div>
      <div className="text-xs text-slate-500 font-bold">{subValue}</div>
    </div>
  );
}

function ProgressBar({ label, current, total, color }: any) {
  const percentage = total > 0 ? (current / total) * 100 : 0;
  return (
    <div className="progress-container">
      <div className="flex justify-between text-xs font-bold mb-3 tracking-wider text-slate-400 uppercase">
        <span>{label}</span>
        <span className="text-white bg-white/5 px-2 py-0.5 rounded-md">{Math.round(percentage)}%</span>
      </div>
      <div className="progress-track">
        <div 
          className="progress-fill" 
          style={{ width: `${percentage}%`, backgroundColor: color, boxShadow: `0 0 15px ${color}` }}
        />
      </div>
    </div>
  );
}
