import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import userService from '../services/userService';
import mediaService from '../services/mediaService';
import { useToast } from '../components/Toast';
import Avatar from '../components/Avatar';

const ProfilePage = () => {
  const { user, updateUserProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    college_or_company: '',
    availability: '',
    is_public: true,
    skills_offered: [],
    skills_wanted: []
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [newSkill, setNewSkill] = useState({ type: 'offered', name: '', description: '' });
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    } else {
      setIsDarkMode(systemPrefersDark);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        location: user.location || '',
        college_or_company: user.college_or_company || '',
        availability: user.availability || '',
        is_public: user.is_public ?? true,
        skills_offered: user.skills_offered || [],
        skills_wanted: user.skills_wanted || []
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleProfilePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const response = await mediaService.uploadMedia(file);
      const updatedProfile = await userService.updateProfile({
        profile_photo: response.url
      });
      updateUserProfile(updatedProfile);
      showSuccess('Profile photo updated successfully');
    } catch (error) {
      showError('Failed to upload profile photo');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updatedProfile = await userService.updateProfile({
        name: formData.name,
        location: formData.location,
        college_or_company: formData.college_or_company,
        availability: formData.availability
      });

      await userService.setProfilePrivacy(formData.is_public);
      await userService.updateSkills({
        skills_offered: formData.skills_offered,
        skills_wanted: formData.skills_wanted
      });

      updateUserProfile(updatedProfile);
      showSuccess('Profile updated successfully');
    } catch (error) {
      showError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const addSkill = () => {
    if (!newSkill.name.trim()) return;

    const skill = {
      name: newSkill.name,
      description: newSkill.description,
      media: []
    };

    if (newSkill.type === 'offered') {
      setFormData(prev => ({
        ...prev,
        skills_offered: [...prev.skills_offered, skill]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        skills_wanted: [...prev.skills_wanted, skill]
      }));
    }

    setNewSkill({ type: 'offered', name: '', description: '' });
  };

  const removeSkill = (index, type) => {
    if (type === 'offered') {
      setFormData(prev => ({
        ...prev,
        skills_offered: prev.skills_offered.filter((_, i) => i !== index)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        skills_wanted: prev.skills_wanted.filter((_, i) => i !== index)
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-indigo-900 dark:to-purple-900 transition-colors duration-500">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">My Profile</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">Manage your profile and showcase your skills</p>
          </div>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-3 bg-white/20 dark:bg-gray-800/20 backdrop-blur-md rounded-xl border border-white/30 dark:border-gray-700/30 hover:bg-white/30 transition-all duration-200"
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Profile Header Card */}
          <div className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-md rounded-3xl p-8 border border-white/30 dark:border-gray-700/30">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
              <div className="relative group">
                <div className="relative">
                  <Avatar user={user} size="xl" className="ring-4 ring-white/50 dark:ring-gray-700/50 shadow-2xl" />
                  {uploading && (
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                      <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                </div>
                <label htmlFor="profile-photo" className="absolute bottom-2 right-2 p-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full cursor-pointer hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </label>
                <input
                  type="file"
                  id="profile-photo"
                  accept="image/*"
                  onChange={handleProfilePhotoUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{user?.name || 'Your Name'}</h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">{user?.email}</p>
                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                  {user?.location && (
                    <div className="flex items-center space-x-2 bg-white/30 dark:bg-gray-700/30 backdrop-blur-sm px-4 py-2 rounded-xl">
                      <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-gray-700 dark:text-gray-300">{user.location}</span>
                    </div>
                  )}
                  {user?.college_or_company && (
                    <div className="flex items-center space-x-2 bg-white/30 dark:bg-gray-700/30 backdrop-blur-sm px-4 py-2 rounded-xl">
                      <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <span className="text-gray-700 dark:text-gray-300">{user.college_or_company}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Basic Information Card */}
          <div className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-md rounded-2xl p-8 border border-white/30 dark:border-gray-700/30">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <svg className="w-6 h-6 mr-3 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="block w-full px-4 py-3 bg-white/50 dark:bg-gray-700/50 border border-white/30 dark:border-gray-600/30 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="block w-full px-4 py-3 bg-white/50 dark:bg-gray-700/50 border border-white/30 dark:border-gray-600/30 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                  placeholder="e.g., Ahmedabad, Gujarat"
                />
              </div>

              <div>
                <label htmlFor="college_or_company" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  College or Company
                </label>
                <input
                  type="text"
                  id="college_or_company"
                  name="college_or_company"
                  value={formData.college_or_company}
                  onChange={handleInputChange}
                  className="block w-full px-4 py-3 bg-white/50 dark:bg-gray-700/50 border border-white/30 dark:border-gray-600/30 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                  placeholder="e.g., Nirma University"
                />
              </div>

              <div>
                <label htmlFor="availability" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Availability
                </label>
                <select
                  id="availability"
                  name="availability"
                  value={formData.availability}
                  onChange={handleInputChange}
                  className="block w-full px-4 py-3 bg-white/50 dark:bg-gray-700/50 border border-white/30 dark:border-gray-600/30 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent backdrop-blur-sm text-gray-900 dark:text-white transition-all duration-200"
                >
                  <option value="">Select availability</option>
                  <option value="weekdays">Weekdays</option>
                  <option value="weekends">Weekends</option>
                  <option value="evenings">Evenings</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>
            </div>

            {/* Privacy Settings */}
            <div className="mt-6 p-4 bg-white/30 dark:bg-gray-700/30 backdrop-blur-sm rounded-xl border border-white/20 dark:border-gray-600/20">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="is_public"
                  name="is_public"
                  checked={formData.is_public}
                  onChange={handleInputChange}
                  className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded transition-colors duration-200"
                />
                <div>
                  <label htmlFor="is_public" className="text-sm font-medium text-gray-900 dark:text-white">
                    Make my profile public
                  </label>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Others can find and contact me for skill exchanges</p>
                </div>
              </div>
            </div>
          </div>

          {/* Skills Management Card */}
          <div className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-md rounded-2xl p-8 border border-white/30 dark:border-gray-700/30">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <svg className="w-6 h-6 mr-3 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Skills Management
            </h3>
            
            {/* Add New Skill */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-800/50 dark:to-gray-700/50 backdrop-blur-sm p-6 rounded-2xl border border-white/30 dark:border-gray-600/30 mb-8">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add New Skill
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <select
                  value={newSkill.type}
                  onChange={(e) => setNewSkill(prev => ({ ...prev, type: e.target.value }))}
                  className="px-4 py-3 bg-white/70 dark:bg-gray-700/70 border border-white/30 dark:border-gray-600/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent backdrop-blur-sm text-gray-900 dark:text-white transition-all duration-200"
                >
                  <option value="offered">Skill I Offer</option>
                  <option value="wanted">Skill I Want</option>
                </select>
                <input
                  type="text"
                  placeholder="Skill name"
                  value={newSkill.name}
                  onChange={(e) => setNewSkill(prev => ({ ...prev, name: e.target.value }))}
                  className="px-4 py-3 bg-white/70 dark:bg-gray-700/70 border border-white/30 dark:border-gray-600/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={newSkill.description}
                  onChange={(e) => setNewSkill(prev => ({ ...prev, description: e.target.value }))}
                  className="px-4 py-3 bg-white/70 dark:bg-gray-700/70 border border-white/30 dark:border-gray-600/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Skill
                </button>
              </div>
            </div>

            {/* Skills Offered */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <span className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mr-3"></span>
                Skills I Offer ({formData.skills_offered.length})
              </h4>
              <div className="space-y-3">
                {formData.skills_offered.map((skill, index) => (
                  <div key={index} className="group bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 backdrop-blur-sm p-4 rounded-xl border border-green-200/50 dark:border-green-700/50 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h5 className="font-semibold text-green-800 dark:text-green-300 text-lg">{skill.name}</h5>
                        {skill.description && (
                          <p className="text-green-600 dark:text-green-400 text-sm mt-1">{skill.description}</p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeSkill(index, 'offered')}
                        className="opacity-0 group-hover:opacity-100 bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-all duration-200 transform hover:scale-105"
                        title="Remove skill"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
                {formData.skills_offered.length === 0 && (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-lg">No skills offered yet</p>
                    <p className="text-gray-400 dark:text-gray-500 text-sm">Add skills you can teach others</p>
                  </div>
                )}
              </div>
            </div>

            {/* Skills Wanted */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <span className="w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mr-3"></span>
                Skills I Want to Learn ({formData.skills_wanted.length})
              </h4>
              <div className="space-y-3">
                {formData.skills_wanted.map((skill, index) => (
                  <div key={index} className="group bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 backdrop-blur-sm p-4 rounded-xl border border-blue-200/50 dark:border-blue-700/50 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h5 className="font-semibold text-blue-800 dark:text-blue-300 text-lg">{skill.name}</h5>
                        {skill.description && (
                          <p className="text-blue-600 dark:text-blue-400 text-sm mt-1">{skill.description}</p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeSkill(index, 'wanted')}
                        className="opacity-0 group-hover:opacity-100 bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-all duration-200 transform hover:scale-105"
                        title="Remove skill"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
                {formData.skills_wanted.length === 0 && (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-lg">No skills wanted yet</p>
                    <p className="text-gray-400 dark:text-gray-500 text-sm">Add skills you want to learn</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-12 py-4 rounded-2xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-xl hover:shadow-2xl flex items-center space-x-3"
            >
              {loading ? (
                <>
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
