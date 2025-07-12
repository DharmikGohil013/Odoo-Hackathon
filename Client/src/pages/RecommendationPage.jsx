// RecommendationPage.jsx
import React, { useState, useEffect } from 'react';
import feedbackService from '../services/feedbackService';
import UserCard from '../components/UserCard';
import { useToast } from '../components/Toast';

const RecommendationPage = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { showError } = useToast();

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const data = await feedbackService.getRecommendations();
      setRecommendations(data.recommendations || []);
    } catch (error) {
      showError('Failed to load recommendations');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Recommendations for You</h1>
          <p className="text-gray-600 mt-1">Users who might be interested in skill swaps with you</p>
        </div>

        <div className="p-6">
          {recommendations.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg mb-4">No recommendations available</div>
              <p className="text-gray-400">
                Complete your profile and add skills to get personalized recommendations!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map(user => (
                <UserCard key={user._id} user={user} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecommendationPage;
