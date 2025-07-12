import authService from './authService';

const API_BASE_URL = 'http://localhost:5000/api';

class FeedbackService {
  async addFeedback(feedbackData) {
    try {
      const response = await fetch(`${API_BASE_URL}/feedback`, {
        method: 'POST',
        headers: authService.getAuthHeaders(),
        body: JSON.stringify(feedbackData)
      });

      if (!response.ok) {
        throw new Error('Failed to add feedback');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async getAllFeedbackForUser(userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/feedback/${userId}`, {
        headers: authService.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch feedback');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async deleteFeedback(feedbackId) {
    try {
      const response = await fetch(`${API_BASE_URL}/feedback/${feedbackId}`, {
        method: 'DELETE',
        headers: authService.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to delete feedback');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async getRecommendations() {
    try {
      const response = await fetch(`${API_BASE_URL}/recommendations`, {
        headers: authService.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch recommendations');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }
}

export default new FeedbackService();
