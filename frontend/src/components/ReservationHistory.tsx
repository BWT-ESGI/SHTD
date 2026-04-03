import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { History, Calendar, User, MapPin, CheckCircle2, XCircle, Clock } from 'lucide-react';

interface Reservation {
  id: string;
  slotId: string;
  userId: string;
  date: string;
  checkedIn: boolean;
  checkInTime?: string;
  isActive: boolean;
}

export default function ReservationHistory() {
  const { token, user: currentUser } = useAuth();
  const [history, setHistory] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3000/api/admin/reservations', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setHistory(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token]);

  const handleToggleStatus = (id: string, active: boolean) => {
    fetch(`http://localhost:3000/api/admin/reservations/${id}`, {
      method: 'PATCH',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ isActive: !active })
    })
    .then(res => res.json())
    .then(updated => {
      setHistory(prev => prev.map(r => r.id === id ? updated : r));
    })
    .catch(console.error);
  };

  if (loading) return <div className="p-8 text-slate-400">Loading history...</div>;

  return (
    <div className="parking-lot-view">
      <div className="asphalt-texture"></div>

      <header className="page-header">
        <h1 className="text-4xl gradient-text mb-2 flex items-center gap-4">
          <History className="text-purple-500" size={36} /> Global History
        </h1>
        <p className="text-slate-400 font-medium tracking-wide">Audit trail of all parking activities and check-ins</p>
      </header>

      <div className="max-w-6xl w-full">
        <div className="premium-glass rounded-3xl overflow-hidden border border-white/10">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="p-6 text-xs font-black uppercase tracking-widest text-slate-500">Date</th>
                <th className="p-6 text-xs font-black uppercase tracking-widest text-slate-500">User</th>
                <th className="p-6 text-xs font-black uppercase tracking-widest text-slate-500">Slot</th>
                <th className="p-6 text-xs font-black uppercase tracking-widest text-slate-500">Status</th>
                {(currentUser?.role === 'MANAGER' || currentUser?.role === 'SECRETARY') && (
                  <th className="p-6 text-xs font-black uppercase tracking-widest text-slate-500 text-right">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {history.map(res => (
                <tr 
                  key={res.id} 
                  className={`transition-colors hover:bg-white/[0.02] ${res.isActive ? '' : 'opacity-40'}`}
                >
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                        <Calendar size={16} />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-white leading-tight">
                          {new Date(res.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </span>
                        <span className="text-[10px] text-slate-500 font-bold uppercase">
                          {new Date(res.date).getFullYear()}
                        </span>
                      </div>
                    </div>
                  </td>
                  
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/5 flex items-center justify-center text-slate-400">
                        <User size={14} />
                      </div>
                      <span className="font-medium text-slate-300">{res.userId}</span>
                    </div>
                  </td>

                  <td className="p-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                      <MapPin size={12} className="text-emerald-400" />
                      <span className="font-black text-emerald-400 text-xs tracking-widest uppercase">{res.slotId}</span>
                    </div>
                  </td>

                  <td className="p-6">
                    {res.checkedIn ? (
                      <div className="flex flex-col">
                        <span className="badge-premium badge-emerald flex items-center gap-2 w-fit mb-1">
                          <CheckCircle2 size={12} /> Checked In
                        </span>
                        {res.checkInTime && (
                          <span className="text-[10px] text-slate-500 font-bold flex items-center gap-1">
                            <Clock size={10} /> {new Date(res.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </div>
                    ) : res.isActive ? (
                      <span className="badge-premium badge-amber flex items-center gap-2 w-fit">
                        <Clock size={12} /> Pending
                      </span>
                    ) : (
                      <span className="badge-premium badge-rose flex items-center gap-2 w-fit">
                        <XCircle size={12} /> Cancelled
                      </span>
                    )}
                  </td>

                  {(currentUser?.role === 'MANAGER' || currentUser?.role === 'SECRETARY') && (
                    <td className="p-6 text-right">
                      <button 
                        onClick={() => handleToggleStatus(res.id, res.isActive)}
                        className={`text-xs font-bold px-4 py-2 rounded-xl transition-all border ${
                          res.isActive 
                            ? 'border-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white' 
                            : 'border-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white'
                        }`}
                      >
                        {res.isActive ? 'Cancel' : 'Re-activate'}
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
