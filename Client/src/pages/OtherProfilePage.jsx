import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import userService from '../services/userService';
import swapService from '../services/swapService';
import feedbackService from '../services/feedbackService';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../components/Toast';
import Avatar from '../components/Avatar';

const OtherProfilePage = () => {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSwapForm, setShowSwapForm] = useState(false);
  const [swapData, setSwapData] = useState({
    offered_skill: '',
    requested_skill: '',
    message: ''
  });
  
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const [userData, feedbackData] = await Promise.all([
        userService.getUserById(userId),
        feedbackService.getAllFeedbackForUser(userId)
      ]);
      setUser(userData);
      setFeedback(feedbackData);
    } catch (error) {
      showError('Failed to load user profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSendSwapRequest = async (e) => {
    e.preventDefault();
    try {
      await swapService.sendSwapRequest({
        to_user_id: userId,
        ...swapData
      });
      showSuccess('Swap request sent successfully');
      setShowSwapForm(false);
      setSwapData({ offered_skill: '', requested_skill: '', message: '' });
    } catch (error) {
      showError('Failed to send swap request');
    }
  };

  const handleAddFriend = async () => {
    try {
      await userService.addFriend(userId);
      showSuccess('Friend request sent');
    } catch (error) {
      showError('Failed to add friend');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg">User not found</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* Header */}
        <div className="px-6 py-8 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <div className="flex items-center space-x-6">
            <Avatar user={user} size="lg" className="border-4 border-white" />
            <div className="flex-1">
              <h1 className="text-3xl font-bold">{user.name}</h1>
              <p className="text-blue-100">{user.email}</p>
              {user.location && <p className="text-blue-100">📍 {user.location}</p>}
              {user.college_or_company && <p className="text-blue-100">🏢 {user.college_or_company}</p>}
              {user.rating > 0 && (
                <div className="flex items-center mt-2">
                  <span className="text-yellow-300">⭐</span>
                  <span className="ml-1 text-blue-100">{user.rating.toFixed(1)} rating</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        {currentUser && currentUser._id !== userId && (
          <div className="px-6 py-4 bg-gray-50 border-b">
            <div className="flex space-x-4">
              <button
                onClick={() => setShowSwapForm(!showSwapForm)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Request Skill Swap
              </button>
              <button
                onClick={handleAddFriend}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                Add Friend
              </button>
            </div>
          </div>
        )}

        {/* Swap Request Form */}
        {showSwapForm && (
          <div className="px-6 py-4 bg-blue-50 border-b">
            <form onSubmit={handleSendSwapRequest} className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Send Swap Request</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Skill I Offer</label>
                  <input
                    type="text"
                    value={swapData.offered_skill}
                    onChange={(e) => setSwapData(prev => ({ ...prev, offered_skill: e.target.value }))}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Photoshop"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Skill I Want</label>
                  <input
                    type="text"
                    value={swapData.requested_skill}
                    onChange={(e) => setSwapData(prev => ({ ...prev, requested_skill: e.target.value }))}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Excel"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Message</label>
                <textarea
                  value={swapData.message}
                  onChange={(e) => setSwapData(prev => ({ ...prev, message: e.target.value }))}
                  rows={3}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Tell them why you want to swap skills..."
                />
              </div>
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Send Request
                </button>
                <button
                  type="button"
                  onClick={() => setShowSwapForm(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="px-6 py-8">
          {/* Skills Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Skills Offered */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Skills Offered</h3>
              {user.skills_offered && user.skills_offered.length > 0 ? (
                <div className="space-y-3">
                  {user.skills_offered.map((skill, index) => (
                    <div key={index} className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-medium text-green-800">{skill.name}</h4>
                      {skill.description && (
                        <p className="text-sm text-green-600 mt-1">{skill.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No skills offered</p>
              )}
            </div>

            {/* Skills Wanted */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Skills Wanted</h3>
              {user.skills_wanted && user.skills_wanted.length > 0 ? (
                <div className="space-y-3">
                  {user.skills_wanted.map((skill, index) => (
                    <div key={index} className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-medium text-blue-800">{skill.name}</h4>
                      {skill.description && (
                        <p className="text-sm text-blue-600 mt-1">{skill.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No skills wanted</p>
              )}
            </div>
          </div>

          {/* Availability */}
          {user.availability && (
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Availability</h3>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                {user.availability}
              </span>
            </div>
          )}

          {/* Feedback Section */}
          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Feedback & Reviews</h3>
            {feedback.length > 0 ? (
              <div className="space-y-4">
                {feedback.map((item, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <span className="text-yellow-400">{'⭐'.repeat(item.rating)}</span>
                        <span className="ml-2 text-sm text-gray-600">({item.rating}/5)</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(item.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700">{item.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No feedback yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtherProfilePage;
