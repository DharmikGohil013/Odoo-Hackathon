import authService from './authService'

const API_BASE_URL = 'http://localhost:5000/api'

class FeedbackService {
  async makeAuthenticatedRequest(url, options = {}) {
    const token = authService.getToken()
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    }

    const response = await fetch(`${API_BASE_URL}${url}`, config)
    
    if (response.status === 401) {
      authService.logout()
      window.location.href = '/login'
      return
    }

    return response
  }

  async getFeedback() {
    try {
      const response = await this.makeAuthenticatedRequest('/admin/feedback')
      
      if (!response.ok) {
        throw new Error('Failed to fetch feedback')
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching feedback:', error)
      throw error
    }
  }

  async deleteFeedback(feedbackId) {
    try {
      const response = await this.makeAuthenticatedRequest(`/admin/feedback/${feedbackId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete feedback')
      }

      return await response.json()
    } catch (error) {
      console.error('Error deleting feedback:', error)
      throw error
    }
  }

  async getFeedbackDetails(feedbackId) {
    try {
      const response = await this.makeAuthenticatedRequest(`/admin/feedback/${feedbackId}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch feedback details')
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching feedback details:', error)
      throw error
    }
  }

  async getFeedbackByUser(userId) {
    try {
      const response = await this.makeAuthenticatedRequest(`/admin/feedback/user/${userId}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch user feedback')
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching user feedback:', error)
      throw error
    }
  }

  async getFeedbackBySwap(swapId) {
    try {
      const response = await this.makeAuthenticatedRequest(`/admin/feedback/swap/${swapId}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch swap feedback')
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching swap feedback:', error)
      throw error
    }
  }

  async getFeedbackStats() {
    try {
      const response = await this.makeAuthenticatedRequest('/admin/feedback/stats')
      
      if (!response.ok) {
        throw new Error('Failed to fetch feedback stats')
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching feedback stats:', error)
      throw error
    }
  }
}

export default new FeedbackService()