import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import swapService from '../services/swapService';
import userService from '../services/userService';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../components/Toast';

const SwapRequestForm = () => {
  const [formData, setFormData] = useState({
    to_user_id: '',
    offered_skill: '',
    requested_skill: '',
    message: ''
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  React.useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    } else {
      setIsDarkMode(systemPrefersDark);
    }

    fetchUsers();
    // eslint-disable-next-line
  }, []);

  React.useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const fetchUsers = async () => {
    try {
      const userData = await userService.getAllPublicUsers();
      setUsers(userData.filter(u => u._id !== user._id));
    } catch (error) {
      showError('Failed to load users');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await swapService.sendSwapRequest(formData);
      showSuccess('Swap request sent successfully!');
      navigate('/swap-requests');
    } catch (error) {
      showError('Failed to send swap request');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-indigo-900 dark:to-purple-900 transition-colors duration-500">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Send Swap Request</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">Connect with someone and exchange skills</p>
          </div>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-3 bg-white/20 dark:bg-gray-800/20 backdrop-blur-md rounded-xl border border-white/30 dark:border-gray-700/30 hover:bg-white/30 transition-all duration-200"
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </div>

        {/* Main Form Card */}
        <div className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-md rounded-3xl border border-white/30 dark:border-gray-700/30 overflow-hidden shadow-2xl">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 dark:from-indigo-600/20 dark:to-purple-600/20 backdrop-blur-sm p-8 border-b border-white/20 dark:border-gray-700/30">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Skill Exchange Request</h2>
                <p className="text-gray-600 dark:text-gray-400">Share what you know, learn what you need</p>
              </div>
            </div>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* User Selection */}
            <div className="bg-white/30 dark:bg-gray-700/30 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-gray-600/20">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Select User to Exchange With
              </h3>
              
              {/* Search Input */}
              <div className="relative mb-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-gray-700/50 border border-white/30 dark:border-gray-600/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                />
              </div>

              {/* User Dropdown */}
              <select
                value={formData.to_user_id}
                onChange={(e) => setFormData(prev => ({ ...prev, to_user_id: e.target.value }))}
                required
                className="block w-full px-4 py-3 bg-white/50 dark:bg-gray-700/50 border border-white/30 dark:border-gray-600/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent backdrop-blur-sm text-gray-900 dark:text-white transition-all duration-200"
              >
                <option value="">Choose a user to swap skills with</option>
                {filteredUsers.map(user => (
                  <option key={user._id} value={user._id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
            </div>

            {/* Skills Exchange */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Skill I Offer */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 backdrop-blur-sm rounded-2xl p-6 border border-green-200/50 dark:border-green-700/50">
                <h3 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-4 flex items-center">
                  <span className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mr-3"></span>
                  Skill I Offer
                </h3>
                <input
                  type="text"
                  value={formData.offered_skill}
                  onChange={(e) => setFormData(prev => ({ ...prev, offered_skill: e.target.value }))}
                  required
                  placeholder="e.g., Photoshop, JavaScript, Guitar"
                  className="block w-full px-4 py-3 bg-white/70 dark:bg-gray-700/70 border border-green-200/50 dark:border-green-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                />
                <p className="text-xs text-green-600 dark:text-green-400 mt-2">What can you teach or help others with?</p>
              </div>

              {/* Skill I Want */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 backdrop-blur-sm rounded-2xl p-6 border border-blue-200/50 dark:border-blue-700/50">
                <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-4 flex items-center">
                  <span className="w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mr-3"></span>
                  Skill I Want to Learn
                </h3>
                <input
                  type="text"
                  value={formData.requested_skill}
                  onChange={(e) => setFormData(prev => ({ ...prev, requested_skill: e.target.value }))}
                  required
                  placeholder="e.g., Excel, Python, Piano"
                  className="block w-full px-4 py-3 bg-white/70 dark:bg-gray-700/70 border border-blue-200/50 dark:border-blue-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                />
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">What would you like to learn from them?</p>
              </div>
            </div>

            {/* Message */}
            <div className="bg-white/30 dark:bg-gray-700/30 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-gray-600/20">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Personal Message (Optional)
              </h3>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                rows={4}
                placeholder="Tell them why you want to swap skills and how you can help each other..."
                className="block w-full px-4 py-3 bg-white/50 dark:bg-gray-700/50 border border-white/30 dark:border-gray-600/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200 resize-none"
              />
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">Share your motivation and how this exchange would benefit both of you</p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-8 py-3 bg-white/30 dark:bg-gray-700/30 backdrop-blur-sm text-gray-700 dark:text-gray-300 font-semibold rounded-xl border border-white/30 dark:border-gray-600/30 hover:bg-white/40 dark:hover:bg-gray-700/40 transition-all duration-200 transform hover:scale-105"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    <span>Send Request</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SwapRequestForm;
