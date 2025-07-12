// FriendsPage.jsx
import React, { useState, useEffect } from 'react';
import userService from '../services/userService';
import UserCard from '../components/UserCard';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../components/Toast';
import './FriendsPage.css';

const FriendsPage = () => {
  const [friends, setFriends] = useState([]);
  const [filteredFriends, setFilteredFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  const { user } = useAuth();
  const { showError } = useToast();

  // Theme: Init
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    } else {
      setIsDarkMode(systemPrefersDark);
    }
  }, []);

  // Theme: Apply
  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(d => !d);

  useEffect(() => { fetchFriends(); }, []);
  useEffect(() => { filterFriends(); }, [friends, searchTerm]);

  // Fetch friends
  const fetchFriends = async () => {
    try {
      setLoading(true);
      const allUsers = await userService.getAllPublicUsers();
      const userFriends = allUsers.filter(u => user?.friends?.includes(u._id));
      setFriends(userFriends);
    } catch (error) {
      showError('Failed to load friends');
    } finally {
      setLoading(false);
    }
  };

  // Filter by search
  const filterFriends = () => {
    if (!searchTerm) {
      setFilteredFriends(friends);
      return;
    }
    const filtered = friends.filter(friend =>
      friend.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      friend.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredFriends(filtered);
  };

  // Loading Spinner
  if (loading) {
    return (
      <div className="friends-loader-container">
        <div className="friends-loader-center">
          <div className="friends-loader-spin" style={{ position: 'relative', width: 68, height: 68 }}>
            <div className="friends-loader-ring" />
            <div className="friends-loader-ring2" />
          </div>
          <div className="friends-loader-text">Loading your friends...</div>
        </div>
      </div>
    );
  }

  // Main Render
  return (
    <div className="friends-root">
      <div className="friends-maxwidth">
        {/* Navbar */}
        <nav className="friends-navbar">
          <div className="friends-navbar-content">
            <div className="friends-navbar-left">
              <div className="friends-logo">
                <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <div className="friends-title">My Friends</div>
                <div className="friends-subtitle">Connect and manage your network</div>
              </div>
            </div>
            <div className="friends-navbar-right">
              {/* Search Bar */}
              <div className="friends-searchbar">
                <span style={{ position: 'absolute', left: 13, top: 10, pointerEvents: 'none', color: 'var(--primary)', opacity: 0.5 }}>
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Search friends..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="friends-theme-toggle"
                aria-label="Toggle theme"
              >
                {isDarkMode ? (
                  <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </nav>

        {/* Stats Cards */}
        <div className="friends-stats-grid">
          <div className="friends-stats-card">
            <div className="friends-stats-icon" style={{ background: 'linear-gradient(135deg, #e0e7ff 60%, #a5b4fc 100%)' }}>
              <svg width="26" height="26" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="friends-stats-text">
              <div className="friends-stats-label">Total Friends</div>
              <div className="friends-stats-value">{friends.length}</div>
            </div>
          </div>
          <div className="friends-stats-card">
            <div className="friends-stats-icon" style={{ background: 'linear-gradient(135deg, #bbf7d0 60%, #6ee7b7 100%)' }}>
              <svg width="26" height="26" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="friends-stats-text">
              <div className="friends-stats-label">Active Friends</div>
              <div className="friends-stats-value">{friends.filter(f => f.isActive).length || friends.length}</div>
            </div>
          </div>
          <div className="friends-stats-card">
            <div className="friends-stats-icon" style={{ background: 'linear-gradient(135deg, #f3e8ff 60%, #d8b4fe 100%)' }}>
              <svg width="26" height="26" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div className="friends-stats-text">
              <div className="friends-stats-label">Search Results</div>
              <div className="friends-stats-value">{filteredFriends.length}</div>
            </div>
          </div>
        </div>

        {/* Main Panel */}
        <div className="friends-mainpanel">
          <div className="friends-mainpanel-inner">
            {/* Empty State */}
            {filteredFriends.length === 0 ? (
              <div className="friends-emptystate">
                <div className="friends-emptystate-icon">
                  {searchTerm ? (
                    <svg width="38" height="38" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  ) : (
                    <svg width="38" height="38" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  )}
                </div>
                <div className="friends-emptystate-title">
                  {searchTerm ? 'No friends found' : 'No friends yet'}
                </div>
                <div className="friends-emptystate-desc">
                  {searchTerm
                    ? `No friends match "${searchTerm}". Try a different search term.`
                    : 'Start connecting with other users to build your network and expand your community!'}
                </div>
                {!searchTerm && (
                  <button className="friends-emptystate-btn">
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Find Friends
                  </button>
                )}
              </div>
            ) : (
              <div>
                <div className="friends-grid-header">
                  <h2 className="friends-title" style={{ fontSize: '1.32rem', fontWeight: 700, marginBottom: 0 }}>
                    {searchTerm ? `Search Results (${filteredFriends.length})` : `Your Friends (${filteredFriends.length})`}
                  </h2>
                  <div className="friends-grid-mode">
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                    <span>Grid View</span>
                  </div>
                </div>
                <div className="friends-usergrid">
                  {filteredFriends.map(friend => (
                    <div key={friend._id} className="friends-usercard-wrap">
                      <UserCard user={friend} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FriendsPage;
