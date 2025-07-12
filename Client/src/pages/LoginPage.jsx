import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../components/Toast';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const { showError, showSuccess } = useToast();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(formData);
      showSuccess('Login successful!');
      navigate('/');
    } catch (error) {
      showError(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 h-screen w-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 overflow-hidden">
      <div className="flex w-full max-w-4xl bg-white bg-opacity-80 shadow-2xl rounded-3xl overflow-hidden backdrop-blur-md animate-fade-in">
        {/* Left: Logo/Brand Section */}
        <div className="hidden md:flex flex-col items-center justify-center w-1/2 bg-gradient-to-tr from-blue-700 to-indigo-600 relative">
          <div className="absolute inset-0 bg-white/10 rounded-3xl backdrop-blur-lg" />
          <div className="relative z-10 flex flex-col items-center">
            {/* SVG Logo */}
            <svg width="88" height="88" viewBox="0 0 48 48" fill="none"
              className="mb-4"
              xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="linkGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#60A5FA"/>
                  <stop offset="100%" stopColor="#a78bfa"/>
                </linearGradient>
              </defs>
              <rect width="48" height="48" rx="24" fill="url(#linkGradient)" />
              <path d="M18 24c0-3.314 2.686-6 6-6h4a4 4 0 010 8h-6a2 2 0 000 4h6a6 6 0 000-12h-4a8 8 0 100 16h6" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {/* App Name */}
            <h1 className="text-4xl font-extrabold text-white drop-shadow-lg tracking-tight mb-2">
              Learn<span className="text-yellow-300">Link</span>
            </h1>
            <p className="text-blue-100 text-lg font-medium mt-2 px-6 text-center opacity-80">
              Unlock knowledge, connect minds.<br/>Welcome to your learning network.
            </p>
          </div>
        </div>
        {/* Right: Login Form */}
        <div className="flex flex-col justify-center w-full md:w-1/2 py-12 px-8 md:px-10 bg-white bg-opacity-95 relative z-10">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Sign in to <span className="text-blue-600">LearnLink</span>
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Or{' '}
              <Link
                to="/register"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                create a new account
              </Link>
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                  Forgot your password?
                </a>
              </div>
            </div>
            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
