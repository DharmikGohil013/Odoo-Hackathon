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
  
  const { showSuccess, showError } = useToast();

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
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Profile Photo Section */}
            <div className="flex items-center space-x-6">
              <div className="relative">
                <Avatar user={user} size="lg" />
                {uploading && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  </div>
                )}
              </div>
              <div>
                <label htmlFor="profile-photo" className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Photo
                </label>
                <input
                  type="file"
                  id="profile-photo"
                  accept="image/*"
                  onChange={handleProfilePhotoUpload}
                  disabled={uploading}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Ahmedabad, Gujarat"
                />
              </div>

              <div>
                <label htmlFor="college_or_company" className="block text-sm font-medium text-gray-700 mb-2">
                  College or Company
                </label>
                <input
                  type="text"
                  id="college_or_company"
                  name="college_or_company"
                  value={formData.college_or_company}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Nirma University"
                />
              </div>

              <div>
                <label htmlFor="availability" className="block text-sm font-medium text-gray-700 mb-2">
                  Availability
                </label>
                <select
                  id="availability"
                  name="availability"
                  value={formData.availability}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
            <div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_public"
                  name="is_public"
                  checked={formData.is_public}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="is_public" className="ml-2 block text-sm text-gray-900">
                  Make my profile public (others can find and contact me)
                </label>
              </div>
            </div>

            {/* Skills Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Skills</h3>
              
              {/* Add New Skill */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-md font-medium text-gray-700 mb-3">Add New Skill</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <select
                    value={newSkill.type}
                    onChange={(e) => setNewSkill(prev => ({ ...prev, type: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="offered">Skill I Offer</option>
                    <option value="wanted">Skill I Want</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Skill name"
                    value={newSkill.name}
                    onChange={(e) => setNewSkill(prev => ({ ...prev, name: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Description"
                    value={newSkill.description}
                    onChange={(e) => setNewSkill(prev => ({ ...prev, description: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    Add Skill
                  </button>
                </div>
              </div>

              {/* Skills Offered */}
              <div>
                <h4 className="text-md font-medium text-gray-700 mb-3">Skills I Offer</h4>
                <div className="space-y-2">
                  {formData.skills_offered.map((skill, index) => (
                    <div key={index} className="flex items-center justify-between bg-green-50 p-3 rounded-md">
                      <div>
                        <span className="font-medium text-green-800">{skill.name}</span>
                        {skill.description && (
                          <span className="text-sm text-green-600 ml-2">- {skill.description}</span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeSkill(index, 'offered')}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  {formData.skills_offered.length === 0 && (
                    <p className="text-gray-500 text-sm">No skills offered yet</p>
                  )}
                </div>
              </div>

              {/* Skills Wanted */}
              <div>
                <h4 className="text-md font-medium text-gray-700 mb-3">Skills I Want to Learn</h4>
                <div className="space-y-2">
                  {formData.skills_wanted.map((skill, index) => (
                    <div key={index} className="flex items-center justify-between bg-blue-50 p-3 rounded-md">
                      <div>
                        <span className="font-medium text-blue-800">{skill.name}</span>
                        {skill.description && (
                          <span className="text-sm text-blue-600 ml-2">- {skill.description}</span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeSkill(index, 'wanted')}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  {formData.skills_wanted.length === 0 && (
                    <p className="text-gray-500 text-sm">No skills wanted yet</p>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
