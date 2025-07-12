import authService from './authService'

const API_BASE_URL = 'http://localhost:5000/api'

class SwapService {
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

  async getSwaps() {
    try {
      const response = await this.makeAuthenticatedRequest('/admin/swaps')
      
      if (!response.ok) {
        throw new Error('Failed to fetch swaps')
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching swaps:', error)
      throw error
    }
  }

  async getSwapDetails(swapId) {
    try {
      const response = await this.makeAuthenticatedRequest(`/admin/swaps/${swapId}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch swap details')
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching swap details:', error)
      throw error
    }
  }

  async updateSwapStatus(swapId, status) {
    try {
      const response = await this.makeAuthenticatedRequest(`/admin/swaps/${swapId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      })

      if (!response.ok) {
        throw new Error('Failed to update swap status')
      }

      return await response.json()
    } catch (error) {
      console.error('Error updating swap status:', error)
      throw error
    }
  }

  async cancelSwap(swapId, reason) {
    try {
      const response = await this.makeAuthenticatedRequest(`/admin/swaps/${swapId}/cancel`, {
        method: 'POST',
        body: JSON.stringify({ reason }),
      })

      if (!response.ok) {
        throw new Error('Failed to cancel swap')
      }

      return await response.json()
    } catch (error) {
      console.error('Error canceling swap:', error)
      throw error
    }
  }

  async getSwapsByUser(userId) {
    try {
      const response = await this.makeAuthenticatedRequest(`/admin/swaps/user/${userId}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch user swaps')
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching user swaps:', error)
      throw error
    }
  }

  async getSwapStats() {
    try {
      const response = await this.makeAuthenticatedRequest('/admin/swaps/stats')
      
      if (!response.ok) {
        throw new Error('Failed to fetch swap stats')
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching swap stats:', error)
      throw error
    }
  }

  async getSwapTimeline(swapId) {
    try {
      const response = await this.makeAuthenticatedRequest(`/admin/swaps/${swapId}/timeline`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch swap timeline')
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching swap timeline:', error)
      throw error
    }
  }

  async addSwapNote(swapId, note) {
    try {
      const response = await this.makeAuthenticatedRequest(`/admin/swaps/${swapId}/notes`, {
        method: 'POST',
        body: JSON.stringify({ note }),
      })

      if (!response.ok) {
        throw new Error('Failed to add swap note')
      }

      return await response.json()
    } catch (error) {
      console.error('Error adding swap note:', error)
      throw error
    }
  }
}

export default new SwapService()