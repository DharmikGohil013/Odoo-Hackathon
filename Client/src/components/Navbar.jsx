import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Avatar from './Avatar';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const isActiveLink = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const NAV_LINKS = [
    { path: '/', label: 'Home' },
    { path: '/recommendations', label: 'Recommendations' },
    { path: '/swap-requests', label: 'Swap Requests' },
    { path: '/friends', label: 'Friends' },
    { path: '/groups', label: 'Groups' },
  ];

  return (
    <nav className="sticky top-0 z-30 backdrop-blur-md bg-white/90 shadow-lg transition">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Title */}
          <Link
            to="/"
            className="flex items-center gap-2 font-extrabold text-xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-400 tracking-wide"
          >
            <span>SkillSwap</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {isAuthenticated && (
              <div className="flex gap-2">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-3 py-2 rounded-xl font-medium transition-all duration-150 ${
                      isActiveLink(link.path)
                        ? 'bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-400 text-white shadow'
                        : 'hover:bg-blue-100 hover:text-blue-700 text-blue-800'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Right Side: Avatar, Auth Buttons */}
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                {/* Avatar + Dropdown */}
                <div className="relative">
                  <button
                    className="flex items-center gap-2 hover:bg-blue-100 rounded-xl px-2 py-1 transition group"
                    onClick={() => setIsProfileMenuOpen((v) => !v)}
                  >
                    <Avatar user={user} size="sm" />
                    <span className="hidden sm:block font-medium">{user?.name?.split(' ')[0]}</span>
                    <svg width="16" height="16" fill="none" className="ml-1">
                      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </button>
                  {/* Profile Dropdown */}
                  {isProfileMenuOpen && (
                    <div
                      className="absolute right-0 mt-2 w-44 rounded-xl bg-white shadow-xl py-1 z-50 animate-fade-in"
                      onMouseLeave={() => setIsProfileMenuOpen(false)}
                    >
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-blue-900 hover:bg-blue-50 rounded-lg transition"
                      >
                        Profile
                      </Link>
                      <Link
                        to="/upload"
                        className="block px-4 py-2 text-blue-900 hover:bg-blue-50 rounded-lg transition"
                      >
                        Upload Media
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl font-medium border border-blue-400 text-blue-700 hover:bg-blue-50 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl font-medium bg-gradient-to-tr from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 shadow"
                >
                  Register
                </Link>
              </div>
            )}
            {/* Hamburger (Mobile) */}
            {isAuthenticated && (
              <button
                className="md:hidden ml-2 p-2 rounded-full hover:bg-blue-100 transition"
                onClick={() => setIsMobileMenuOpen((v) => !v)}
                aria-label="Open Menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isAuthenticated && (
        <div
          className={`md:hidden fixed inset-0 z-40 bg-black/20 backdrop-blur-sm transition-all duration-300 ${
            isMobileMenuOpen ? 'block' : 'hidden'
          }`}
        >
          <div className="fixed right-0 top-0 h-full w-64 bg-white shadow-2xl pt-6 px-4 flex flex-col gap-3 animate-slide-in">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`py-2 px-3 rounded-lg font-medium mb-1 ${
                  isActiveLink(link.path)
                    ? 'bg-gradient-to-tr from-blue-500 to-indigo-500 text-white shadow'
                    : 'hover:bg-blue-100 hover:text-blue-700 text-blue-800'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/profile"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 px-3 rounded-lg font-medium hover:bg-blue-50 text-blue-900"
            >
              Profile
            </Link>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                handleLogout();
              }}
              className="py-2 px-3 rounded-lg font-medium text-red-600 hover:bg-red-50"
            >
              Logout
            </button>
          </div>
          <div
            className="fixed inset-0 z-30"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        </div>
      )}
    </nav>
  );
};

export default Navbar;
