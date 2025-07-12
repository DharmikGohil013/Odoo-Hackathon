// CreateGroupPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import groupService from '../services/groupService';
import mediaService from '../services/mediaService';
import { useToast } from '../components/Toast';

const CreateGroupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    is_public: true,
    icon: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    } else {
      setIsDarkMode(systemPrefersDark);
    }

    // Trigger entrance animation
    setTimeout(() => setIsVisible(true), 100);
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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleIconUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const response = await mediaService.uploadMedia(file);
      setFormData(prev => ({ ...prev, icon: response.url }));
      showSuccess('Icon uploaded successfully');
    } catch (error) {
      showError('Failed to upload icon');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const group = await groupService.createGroup(formData);
      showSuccess('Group created successfully!');
      navigate(`/groups/${group._id}`);
    } catch (error) {
      showError('Failed to create group');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Create Your Group</h1>
          <p className="text-lg text-gray-600">Build a community around your shared interests</p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl border border-white/20 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Group Name Field */}
            <div className="space-y-2">
              <label htmlFor="name" className="flex items-center text-sm font-semibold text-gray-800 mb-3">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                Group Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="block w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl shadow-sm transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 hover:border-gray-300"
                placeholder="e.g., Web Dev Learners, Photography Club"
              />
            </div>

            {/* Description Field */}
            <div className="space-y-2">
              <label htmlFor="description" className="flex items-center text-sm font-semibold text-gray-800 mb-3">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={4}
                className="block w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl shadow-sm transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 hover:border-gray-300 resize-none"
                placeholder="Describe what your group is about and what members can expect..."
              />
            </div>

            {/* Group Icon Upload */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold text-gray-800 mb-3">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Group Icon
              </label>
              <div className="flex items-center space-x-6 p-6 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 transition-all duration-200 hover:border-blue-400 hover:bg-blue-50/50">
                {formData.icon ? (
                  <div className="relative">
                    <img 
                      className="h-20 w-20 rounded-full object-cover border-4 border-white shadow-lg" 
                      src={formData.icon} 
                      alt="Group icon" 
                    />
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                ) : (
                  <div className="h-20 w-20 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                )}
                <div className="flex-1">
                  <input
                    type="file"
                    id="icon"
                    accept="image/*"
                    onChange={handleIconUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                  <label 
                    htmlFor="icon" 
                    className="cursor-pointer inline-flex items-center px-6 py-3 bg-white border-2 border-blue-300 rounded-lg text-blue-700 font-medium hover:bg-blue-50 hover:border-blue-400 transition-all duration-200 disabled:opacity-50"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    {uploading ? 'Uploading...' : 'Choose Image'}
                  </label>
                  <p className="text-sm text-gray-500 mt-2">PNG, JPG up to 5MB</p>
                </div>
              </div>
            </div>

            {/* Privacy Toggle */}
            <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
              <div className="flex items-start space-x-4">
                <div className="flex items-center h-6">
                  <input
                    type="checkbox"
                    id="is_public"
                    name="is_public"
                    checked={formData.is_public}
                    onChange={handleInputChange}
                    className="h-5 w-5 text-blue-600 bg-white border-2 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="is_public" className="block text-sm font-semibold text-gray-900 mb-1">
                    Make this group public
                  </label>
                  <p className="text-sm text-gray-600">
                    {formData.is_public 
                      ? "Anyone can discover and join your group" 
                      : "Only people with an invite link can join"
                    }
                  </p>
                </div>
                <div className="flex-shrink-0">
                  {formData.is_public ? (
                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/groups')}
                className="px-8 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 order-2 sm:order-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || uploading}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl order-1 sm:order-2 flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Create Group
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

export default CreateGroupPage;
