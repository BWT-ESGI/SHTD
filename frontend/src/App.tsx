import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import ParkingLot from './components/ParkingLot';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import { LogOut, Home, Users } from 'lucide-react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen" style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#0f172a', color: '#f8fafc' }}>
      {user && (
        <nav style={{ display: 'flex', gap: '1rem', padding: '1rem 2rem', backgroundColor: '#1e293b', color: 'white', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <b style={{ marginRight: '2rem' }}>Parking System</b>
          
          <Link to="/" style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            <Home size={18} /> Home (Parking)
          </Link>

          {(user.role === 'MANAGER' || user.role === 'SECRETARY') && (
            <>
              <Link to="/admin" style={{ color: '#60a5fa', display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
                <Users size={18} /> Admin Users
              </Link>
            </>
          )}

          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>{user.email} ({user.role})</span>
            <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#dc2626', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>
              <LogOut size={16} /> Logout
            </button>
          </div>
        </nav>
      )}
      <main style={{ flex: 1, overflow: 'auto' }}>
        {children}
      </main>
    </div>
  );
};

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes - Authenticated Users */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<ParkingLot />} />
        </Route>

        {/* Protected Routes - Admin Area */}
        <Route element={<ProtectedRoute allowedRoles={['MANAGER', 'SECRETARY']} />}>
           <Route path="/admin" element={<AdminDashboard />} />
        </Route>

        <Route path="/unauthorized" element={<div style={{ padding: '2rem', textAlign: 'center', color: '#f8fafc' }}><h2>403 - Unauthorized</h2><p>You don't have permission to view this page.</p></div>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

import { Navigate } from 'react-router-dom';
export default App;
