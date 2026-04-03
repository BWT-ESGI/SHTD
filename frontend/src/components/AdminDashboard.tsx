import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import type { User } from '../context/AuthContext';
import { Users, LayoutGrid, Zap, ShieldCheck, ShieldAlert } from 'lucide-react';

interface ParkingSlot {
  id: string;
  type: string;
  isAvailable: boolean;
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [slots, setSlots] = useState<ParkingSlot[]>([]);
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState<'users' | 'slots'>('users');

  const fetchData = () => {
    fetch('http://localhost:3000/api/admin/users', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(console.error);

    fetch('http://localhost:3000/api/admin/slots', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setSlots(data))
      .catch(console.error);
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleToggleSlot = (id: string, currentlyAvailable: boolean) => {
    fetch(`http://localhost:3000/api/admin/slots/${id}`, {
      method: 'PATCH',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ isAvailable: !currentlyAvailable })
    })
    .then(res => res.json())
    .then(() => fetchData())
    .catch(console.error);
  };

  return (
    <div className="parking-lot-view">
      <div className="asphalt-texture"></div>

      <header className="page-header">
        <h1 className="text-4xl gradient-text mb-2 flex items-center gap-4">
           System Administration
        </h1>
        <p className="text-slate-400 font-medium tracking-wide">Manage infrastructure, users and manual overrides</p>
      </header>

      <div className="tab-group">
        <button 
          onClick={() => setActiveTab('users')}
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
        >
          <Users size={18} /> User Directory
        </button>
        <button 
          onClick={() => setActiveTab('slots')}
          className={`tab-btn ${activeTab === 'slots' ? 'active' : ''}`}
        >
          <LayoutGrid size={18} /> Parking Infrastructure
        </button>
      </div>

      <div className="premium-table-container">
        {activeTab === 'users' ? (
          <table className="premium-table">
            <thead>
              <tr>
                <th>ID Tag</th>
                <th>Identity</th>
                <th>Privileges</th>
                <th>Vehicle capability</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td className="font-mono text-xs opacity-50">{u.id}</td>
                  <td className="font-bold text-white">{u.email}</td>
                  <td>
                    <span className="badge-premium badge-blue">{u.role}</span>
                  </td>
                  <td>
                    {(u as any).hasElectricVehicle ? 
                      <span className="badge-premium badge-emerald flex items-center gap-2 w-fit">
                        <Zap size={12} fill="currentColor"/> High Voltage
                      </span> : 
                      <span className="text-slate-500 font-bold text-xs uppercase">Internal Combustion</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="premium-table">
            <thead>
              <tr>
                <th>Infrastructure ID</th>
                <th>Designation</th>
                <th>Operational Status</th>
                <th>Administrative Control</th>
              </tr>
            </thead>
            <tbody>
              {slots.sort((a,b) => a.id.localeCompare(b.id)).map(s => (
                <tr key={s.id}>
                  <td className="font-black text-white tracking-widest uppercase">{s.id}</td>
                  <td>
                    {s.type === 'F' || s.type === 'A' ? 
                      <div className="flex items-center gap-2 text-emerald-400 font-bold">
                        <Zap size={14} fill="currentColor"/> Electric Bay
                      </div> : 
                      <span className="text-slate-400 font-medium">Standard Slot</span>
                    }
                  </td>
                  <td>
                    {s.isAvailable ? 
                      <div className="flex items-center gap-2 text-emerald-400 font-bold">
                        <ShieldCheck size={16} /> Online
                      </div> : 
                      <div className="flex items-center gap-2 text-rose-400 font-bold">
                        <ShieldAlert size={16} /> Manual Lockout
                      </div>
                    }
                  </td>
                  <td>
                    <button 
                      onClick={() => handleToggleSlot(s.id, s.isAvailable)}
                      className={`premium-btn control-btn ${s.isAvailable ? 'hover:bg-rose-500' : 'hover:bg-emerald-500'}`}
                    >
                      {s.isAvailable ? 'Deactivate Resource' : 'Restore Operations'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
