import api from './authService';

export const feedbackService = {
  // Submit feedback/rating for a user
  submitFeedback: async (userId, swapId, feedbackData) => {
    const response = await api.post(`/feedback/${userId}`, {
      swapId,
      ...feedbackData
    });
    return response.data;
  },

  // Get feedback for a user
  getUserFeedback: async (userId) => {
    const response = await api.get(`/feedback/${userId}`);
    return response.data;
  },

  // Report a user
  reportUser: async (userId, reason, description) => {
    const response = await api.post(`/feedback/report/${userId}`, {
      reason,
      description
    });
    return response.data;
  },

  // Mock feedback data
  mockFeedback: [
    {
      id: 1,
      rating: 5,
      review: 'Excellent teacher! Very patient and knowledgeable.',
      reviewer: {
        id: 2,
        name: 'Sarah Chen',
        avatar: null
      },
      swapId: 3,
      skillTaught: 'Python Programming',
      createdAt: '2024-03-01T16:30:00Z'
    },
    {
      id: 2,
      rating: 4,
      review: 'Great experience learning React. Highly recommended!',
      reviewer: {
        id: 4,
        name: 'Emma Wilson',
        avatar: null
      },
      swapId: 2,
      skillTaught: 'React Development',
      createdAt: '2024-02-28T10:15:00Z'
    }
  ],

  // Mock functions
  mockSubmitFeedback: async (userId, swapId, feedbackData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const feedback = {
          id: Date.now(),
          ...feedbackData,
          swapId,
          createdAt: new Date().toISOString()
        };
        resolve(feedback);
      }, 300);
    });
  },

  mockGetUserFeedback: async (userId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          feedback: feedbackService.mockFeedback,
          averageRating: 4.5,
          totalReviews: 2
        });
      }, 300);
    });
  }
};