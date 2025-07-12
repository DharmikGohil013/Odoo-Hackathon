import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
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

    // Validation
    if (formData.password !== formData.confirmPassword) {
      showError('Passwords do not match');
      setLoading(false);
      return;
    }
    if (formData.password.length < 6) {
      showError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password
      };
      await register(userData);
      showSuccess('Registration successful!');
      navigate('/');
    } catch (error) {
      showError(error.message || 'Registration failed');
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
        {/* Right: Register Form */}
        <div className="flex flex-col justify-center w-full md:w-1/2 py-12 px-8 md:px-10 bg-white bg-opacity-95 relative z-10">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Create your <span className="text-blue-600">LearnLink</span> account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Or{' '}
              <Link
                to="/login"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                sign in to your existing account
              </Link>
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your password"
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Confirm your password"
                />
              </div>
            </div>
            <div className="flex items-center">
              <input
                id="agree-terms"
                name="agree-terms"
                type="checkbox"
                required
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="agree-terms" className="ml-2 block text-sm text-gray-900">
                I agree to the{' '}
                <a href="#" className="text-blue-600 hover:text-blue-500">
                  Terms and Conditions
                </a>{' '}
                and{' '}
                <a href="#" className="text-blue-600 hover:text-blue-500">
                  Privacy Policy
                </a>
              </label>
            </div>
            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating account...' : 'Create account'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
