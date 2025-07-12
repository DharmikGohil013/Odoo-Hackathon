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
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold">SkillSwap</h1>
            </Link>
            
            {isAuthenticated && (
              <div className="hidden md:block ml-10">
                <div className="flex items-baseline space-x-4">
                  <Link to="/" className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium">
                    Home
                  </Link>
                  <Link to="/recommendations" className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium">
                    Recommendations
                  </Link>
                  <Link to="/swap-requests" className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium">
                    Swap Requests
                  </Link>
                  <Link to="/friends" className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium">
                    Friends
                  </Link>
                  <Link to="/groups" className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium">
                    Groups
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Right Side: Avatar, Auth Buttons */}
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                {/* Avatar + Dropdown */}
                <div className="relative">
                  <div className="flex items-center space-x-3">
                    <Avatar user={user} size="sm" />
                    <div className="hidden md:block">
                      <div className="text-sm font-medium">{user?.name}</div>
                      <div className="text-xs text-blue-200">{user?.email}</div>
                    </div>
                  </div>
                </div>
                
                <div className="relative group">
                  <button className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium">
                    Menu ▼
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 hidden group-hover:block">
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Profile
                    </Link>
                    <Link to="/upload" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Upload Media
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-500 hover:bg-blue-400 px-3 py-2 rounded-md text-sm font-medium"
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
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium">
              Home
            </Link>
            <Link to="/recommendations" className="hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium">
              Recommendations
            </Link>
            <Link to="/swap-requests" className="hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium">
              Swap Requests
            </Link>
            <Link to="/friends" className="hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium">
              Friends
            </Link>
            <Link to="/groups" className="hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium">
              Groups
            </Link>
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
