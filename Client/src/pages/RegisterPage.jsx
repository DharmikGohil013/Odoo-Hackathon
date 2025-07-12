import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../api/authService';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    try {
      await register(name, email, password);
      navigate('/login');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="expensive-card">
      <svg className="form-svg-bg" viewBox="0 0 110 110" fill="none">
        <circle cx="55" cy="55" r="54" fill="#fa71c0" fillOpacity="0.16" />
        <circle cx="55" cy="55" r="38" fill="#ef8ce0" fillOpacity="0.14" />
        <circle cx="55" cy="55" r="23" fill="#f7e2f5" fillOpacity="0.2" />
      </svg>
      <div style={{ position: 'relative', zIndex: 2 }}>
        <div className="form-title">Create Account</div>
        <div className="form-desc">Start swapping your skills today</div>
        <form onSubmit={handleRegister}>
          <div className="input-group">
            <span className="input-icon">
              {/* User SVG */}
              <svg width="21" height="21" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="8.2" r="4.2" stroke="#fa71c0" strokeWidth="2"/>
                <path d="M3.9 19c0-3.1 3.3-5.1 8.1-5.1s8.1 2 8.1 5.1" stroke="#fa71c0" strokeWidth="2"/>
              </svg>
            </span>
            <label className="input-label">Full Name</label>
            <input
              className="form-input"
              type="text"
              placeholder="Full name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <span className="input-icon">
              {/* Mail SVG */}
              <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
                <path d="M4 4h16v16H4V4zm0 0l8 8 8-8" stroke="#ef8ce0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <label className="input-label">Email</label>
            <input
              className="form-input"
              type="email"
              placeholder="Email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <span className="input-icon">
              {/* Lock SVG */}
              <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
                <path d="M17 11V7a5 5 0 0 0-10 0v4" stroke="#ef8ce0" strokeWidth="2" strokeLinecap="round"/>
                <rect x="5" y="11" width="14" height="9" rx="2.5" stroke="#ef8ce0" strokeWidth="2"/>
              </svg>
            </span>
            <label className="input-label">Password</label>
            <input
              className="form-input"
              type="password"
              placeholder="Password"
              value={password}
              autoComplete="new-password"
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <button className="form-btn" type="submit" disabled={loading}>
            {loading ? (
              <svg className="spin" width="21" height="21" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="#fff" strokeWidth="3" opacity=".3"/>
                <path d="M22 12A10 10 0 1 1 12 2" stroke="#fff" strokeWidth="3"/>
              </svg>
            ) : (
              <>
                Register
                <svg width="20" height="20" fill="none">
                  <path d="M7 10.5h6.8m0 0-2.8-2.8m2.8 2.8-2.8 2.8" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </>
            )}
          </button>
          {errorMsg && <div className="form-error">{errorMsg}</div>}
        </form>
        <div style={{ textAlign: 'center', marginTop: 18 }}>
          <span style={{ color: '#444' }}>Already have an account? </span>
          <Link className="form-link" to="/login">Sign In</Link>
        </div>
      </div>
    </div>
  );
}
