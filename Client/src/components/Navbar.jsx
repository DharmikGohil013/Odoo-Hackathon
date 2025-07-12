import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Avatar from './Avatar';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    } else {
      setIsDarkMode(systemPrefersDark);
    }
  }, []);

  // Update theme in localStorage and document
  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 text-white shadow-xl backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center group">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent group-hover:from-blue-100 group-hover:to-white transition-all duration-300">
                Skill
              </h1>
            </Link>
            
            {isAuthenticated && (
              <div className="hidden md:block ml-10">
                <div className="flex items-baseline space-x-2">
                  <Link 
                    to="/" 
                    className={`hover:bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border border-transparent hover:border-white/20 ${
                      isActiveLink('/') ? 'bg-white/20 border-white/30' : ''
                    }`}
                  >
                    Home
                  </Link>
                  <Link 
                    to="/recommendations" 
                    className={`hover:bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border border-transparent hover:border-white/20 ${
                      isActiveLink('/recommendations') ? 'bg-white/20 border-white/30' : ''
                    }`}
                  >
                    Recommendations
                  </Link>
                  <Link 
                    to="/swap-requests" 
                    className={`hover:bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border border-transparent hover:border-white/20 ${
                      isActiveLink('/swap-requests') ? 'bg-white/20 border-white/30' : ''
                    }`}
                  >
                    Swap Requests
                  </Link>
                  <Link 
                    to="/friends" 
                    className={`hover:bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border border-transparent hover:border-white/20 ${
                      isActiveLink('/friends') ? 'bg-white/20 border-white/30' : ''
                    }`}
                  >
                    Friends
                  </Link>
                  <Link 
                    to="/groups" 
                    className={`hover:bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border border-transparent hover:border-white/20 ${
                      isActiveLink('/groups') ? 'bg-white/20 border-white/30' : ''
                    }`}
                  >
                    Groups
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20">
                    <Avatar user={user} size="sm" />
                    <div className="hidden md:block">
                      <div className="text-sm font-medium text-white">{user?.name}</div>
                      <div className="text-xs text-blue-100">{user?.email}</div>
                    </div>
                  </div>
                </div>
                
                <div className="relative group">
                  <button className="hover:bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border border-transparent hover:border-white/20">
                    Menu
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white/90 backdrop-blur-md rounded-xl shadow-xl py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-white/20">
                    <Link 
                      to="/profile" 
                      className="block px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200 rounded-lg mx-2"
                    >
                      Profile
                    </Link>
                    <Link 
                      to="/upload" 
                      className="block px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200 rounded-lg mx-2"
                    >
                      Upload Media
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 transition-all duration-200 rounded-lg mx-2"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="hover:bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border border-transparent hover:border-white/20"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border border-white/20 hover:border-white/40"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isAuthenticated && (
        <div className="md:hidden border-t border-white/10">
          <div className="px-4 pt-4 pb-3 space-y-2 bg-gradient-to-b from-transparent to-black/10">
            <Link 
              to="/" 
              className={`hover:bg-white/20 backdrop-blur-sm block px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 border border-transparent hover:border-white/20 ${
                isActiveLink('/') ? 'bg-white/20 border-white/30' : ''
              }`}
            >
              Home
            </Link>
            <Link 
              to="/recommendations" 
              className={`hover:bg-white/20 backdrop-blur-sm block px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 border border-transparent hover:border-white/20 ${
                isActiveLink('/recommendations') ? 'bg-white/20 border-white/30' : ''
              }`}
            >
              Recommendations
            </Link>
            <Link 
              to="/swap-requests" 
              className={`hover:bg-white/20 backdrop-blur-sm block px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 border border-transparent hover:border-white/20 ${
                isActiveLink('/swap-requests') ? 'bg-white/20 border-white/30' : ''
              }`}
            >
              Swap Requests
            </Link>
            <Link 
              to="/friends" 
              className={`hover:bg-white/20 backdrop-blur-sm block px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 border border-transparent hover:border-white/20 ${
                isActiveLink('/friends') ? 'bg-white/20 border-white/30' : ''
              }`}
            >
              Friends
            </Link>
            <Link 
              to="/groups" 
              className={`hover:bg-white/20 backdrop-blur-sm block px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 border border-transparent hover:border-white/20 ${
                isActiveLink('/groups') ? 'bg-white/20 border-white/30' : ''
              }`}
            >
              Groups
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
