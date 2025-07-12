import authService from './authService'

const API_BASE_URL = 'http://localhost:5000/api'

class UserService {
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

  async getUsers() {
    try {
      const response = await this.makeAuthenticatedRequest('/admin/users')
      
      if (!response.ok) {
        throw new Error('Failed to fetch users')
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching users:', error)
      throw error
    }
  }

  async banUser(userId) {
    try {
      const response = await this.makeAuthenticatedRequest(`/admin/users/${userId}/ban`, {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to ban user')
      }

      return await response.json()
    } catch (error) {
      console.error('Error banning user:', error)
      throw error
    }
  }

  async unbanUser(userId) {
    try {
      const response = await this.makeAuthenticatedRequest(`/admin/users/${userId}/unban`, {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to unban user')
      }

      return await response.json()
    } catch (error) {
      console.error('Error unbanning user:', error)
      throw error
    }
  }

  async getUserDetails(userId) {
    try {
      const response = await this.makeAuthenticatedRequest(`/admin/users/${userId}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch user details')
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching user details:', error)
      throw error
    }
  }

  async updateUser(userId, userData) {
    try {
      const response = await this.makeAuthenticatedRequest(`/admin/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        throw new Error('Failed to update user')
      }

      return await response.json()
    } catch (error) {
      console.error('Error updating user:', error)
      throw error
    }
  }

  async deleteUser(userId) {
    try {
      const response = await this.makeAuthenticatedRequest(`/admin/users/${userId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete user')
      }

      return await response.json()
    } catch (error) {
      console.error('Error deleting user:', error)
      throw error
    }
  }
}

export default new UserService()