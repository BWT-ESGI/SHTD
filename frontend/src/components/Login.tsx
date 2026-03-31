import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await login(email);
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'center', alignItems: 'center', height: '100%', background: '#0f172a' }}>
      <form onSubmit={handleSubmit} style={{ background: '#1e293b', padding: '2.5rem', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)', width: '350px', color: '#f8fafc' }}>
        <h2 style={{ marginBottom: '1.5rem', textAlign: 'center', fontWeight: '800' }}>SHTD Login</h2>
        
        {error && <div style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '0.9rem', textAlign: 'center' }}>{error}</div>}
        
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#94a3b8', fontSize: '0.85rem', textTransform: 'uppercase' }}>Email Address</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '0.75rem', background: '#0f172a', color: '#f8fafc', border: '1px solid #334155', borderRadius: '8px', boxSizing: 'border-box', outline: 'none' }}
            placeholder="admin@company.com"
            required
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={{ width: '100%', padding: '0.8rem', background: 'linear-gradient(to right, #3b82f6, #2563eb)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)' }}>
          {loading ? 'Logging in...' : 'Sign In'}
        </button>

        <div style={{ marginTop: '2rem', fontSize: '0.85rem', color: '#64748b' }}>
          <p style={{ marginBottom: '0.5rem', fontWeight: '600' }}>Demo accounts:</p>
          <ul style={{ paddingLeft: '1.5rem', lineHeight: '1.6' }}>
             <li><strong style={{ color: '#cbd5e1' }}>admin@company.com</strong> (Secretary)</li>
             <li><strong style={{ color: '#cbd5e1' }}>boss@company.com</strong> (Manager)</li>
             <li><strong style={{ color: '#cbd5e1' }}>user@company.com</strong> (Employee EV)</li>
          </ul>
        </div>
      </form>
    </div>
  );
}
