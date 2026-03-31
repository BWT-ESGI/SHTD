import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import type { User } from '../context/AuthContext';

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const { token } = useAuth();

  useEffect(() => {
    fetch('http://localhost:3000/api/admin/users', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(console.error);
  }, [token]);

  return (
    <div style={{ padding: '2rem', color: '#f8fafc' }}>
      <h1 style={{ marginBottom: '1.5rem', fontWeight: '800' }}>Admin: Registered Users</h1>
      <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', background: '#1e293b' }}>
          <thead>
            <tr style={{ background: '#0f172a', textAlign: 'left', textTransform: 'uppercase', fontSize: '0.85rem', color: '#94a3b8' }}>
              <th style={{ padding: '1.2rem', borderBottom: '1px solid #334155' }}>ID</th>
              <th style={{ padding: '1.2rem', borderBottom: '1px solid #334155' }}>Email</th>
              <th style={{ padding: '1.2rem', borderBottom: '1px solid #334155' }}>Role</th>
              <th style={{ padding: '1.2rem', borderBottom: '1px solid #334155' }}>EV Owner</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} style={{ transition: 'background 0.2s' }}>
                <td style={{ padding: '1rem 1.2rem', borderBottom: '1px solid #334155', color: '#cbd5e1' }}>{u.id}</td>
                <td style={{ padding: '1rem 1.2rem', borderBottom: '1px solid #334155', fontWeight: '600' }}>{u.email}</td>
                <td style={{ padding: '1rem 1.2rem', borderBottom: '1px solid #334155' }}>
                  <span style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: '700' }}>{u.role}</span>
                </td>
                <td style={{ padding: '1rem 1.2rem', borderBottom: '1px solid #334155' }}>
                  {(u as any).hasElectricVehicle ? <span style={{ color: '#10b981', fontWeight: 'bold' }}>Yes</span> : <span style={{ color: '#94a3b8' }}>No</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
