import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../api/authService';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    try {
      const res = await login(email, password);
      localStorage.setItem('skillswap_token', res.data.token);
      navigate('/');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="expensive-card">
      <svg className="form-svg-bg" viewBox="0 0 110 110" fill="none">
        <circle cx="55" cy="55" r="54" fill="#7e61e7" fillOpacity="0.15" />
        <circle cx="55" cy="55" r="38" fill="#7864ee" fillOpacity="0.14" />
        <circle cx="55" cy="55" r="23" fill="#f6eefd" fillOpacity="0.25" />
      </svg>
      <div style={{ position: 'relative', zIndex: 2 }}>
        <div className="form-title">Welcome Back</div>
        <div className="form-desc">Login to your SkillSwap account</div>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <span className="input-icon">
              {/* Mail SVG */}
              <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
                <path d="M4 4h16v16H4V4zm0 0l8 8 8-8" stroke="#7864ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <label className="input-label">Email</label>
            <input
              className="form-input"
              type="email"
              placeholder="Email address"
              value={email}
              autoComplete="email"
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <span className="input-icon">
              {/* Lock SVG */}
              <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
                <path d="M17 11V7a5 5 0 0 0-10 0v4" stroke="#7864ee" strokeWidth="2" strokeLinecap="round"/>
                <rect x="5" y="11" width="14" height="9" rx="2.5" stroke="#7864ee" strokeWidth="2"/>
              </svg>
            </span>
            <label className="input-label">Password</label>
            <input
              className="form-input"
              type="password"
              placeholder="Password"
              value={password}
              autoComplete="current-password"
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <button className="form-btn" type="submit" disabled={loading}>
            {/* Arrow SVG */}
            {loading ? (
              <svg className="spin" width="21" height="21" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="#fff" strokeWidth="3" opacity=".3"/>
                <path d="M22 12A10 10 0 1 1 12 2" stroke="#fff" strokeWidth="3"/>
              </svg>
            ) : (
              <>
                Login
                <svg width="20" height="20" fill="none">
                  <path d="M7 10.5h6.8m0 0-2.8-2.8m2.8 2.8-2.8 2.8" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </>
            )}
          </button>
          {errorMsg && <div className="form-error">{errorMsg}</div>}
        </form>
        <div style={{ textAlign: 'center', marginTop: 18 }}>
          <span style={{ color: '#444' }}>Don't have an account? </span>
          <Link className="form-link" to="/register">Sign Up</Link>
        </div>
      </div>
    </div>
  );
}
