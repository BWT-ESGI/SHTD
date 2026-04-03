import { Routes, Route, Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import ParkingLot from './components/ParkingLot';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import ManagerDashboard from './components/ManagerDashboard';
import ReservationHistory from './components/ReservationHistory';
import { LogOut, Home, Users, BarChart3, History, MapPin } from 'lucide-react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinkClass = (path: string) => 
    `tab-btn ${location.pathname === path ? 'active' : ''}`;

  return (
    <div className="min-h-screen parking-lot-view" style={{ display: 'flex', flexDirection: 'column', height: '100vh', padding: 0 }}>
      {user && (
        <nav className="main-nav premium-glass">
          <div className="nav-container">
            <div className="nav-brand">
              <div className="brand-icon">
                <MapPin size={18} />
              </div>
              <span className="brand-text">Parking</span>
            </div>

            <div className="nav-links">
              <Link to="/" className={navLinkClass('/')}>
                <Home size={16} /> <span className="link-text">Home</span>
              </Link>
              
              {(user.role === 'MANAGER' || user.role === 'SECRETARY') && (
                <>
                  <Link to="/admin" className={navLinkClass('/admin')}>
                    <Users size={16} /> <span className="link-text">Admin</span>
                  </Link>
                  <Link to="/history" className={navLinkClass('/history')}>
                    <History size={16} /> <span className="link-text">History</span>
                  </Link>
                </>
              )}

              {user.role === 'MANAGER' && (
                <Link to="/dashboard" className={navLinkClass('/dashboard')}>
                  <BarChart3 size={16} /> <span className="link-text">Stats</span>
                </Link>
              )}
            </div>

            <div className="nav-divider"></div>

            <div className="nav-user">
              <div className="user-info">
                <span className="user-label">Identity</span>
                <span className="user-email">{user.email}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="premium-btn logout-btn"
              >
                <LogOut size={14} /> <span className="link-text">Logout</span>
              </button>
            </div>
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
           <Route path="/history" element={<ReservationHistory />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['MANAGER']} />}>
           <Route path="/dashboard" element={<ManagerDashboard />} />
        </Route>

        <Route path="/unauthorized" element={<div style={{ padding: '2rem', textAlign: 'center', color: '#f8fafc' }}><h2>403 - Unauthorized</h2><p>You don't have permission to view this page.</p></div>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;
