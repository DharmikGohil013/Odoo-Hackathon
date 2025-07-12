const API_BASE_URL = 'http://localhost:5000/api'

class AuthService {
  constructor() {
    this.token = localStorage.getItem('adminToken')
  }

  async login(credentials) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Login failed')
      }

      // Check if user has admin role
      if (data.user.role !== 'admin') {
        throw new Error('Access denied. Admin privileges required.')
      }

      this.token = data.token
      localStorage.setItem('adminToken', data.token)
      
      return data
    } catch (error) {
      throw error
    }
  }

  logout() {
    this.token = null
    localStorage.removeItem('adminToken')
  }

  getToken() {
    return this.token || localStorage.getItem('adminToken')
  }

  isAuthenticated() {
    const token = this.getToken()
    if (!token) return false

    try {
      // Basic token validation (you might want to add expiry checking)
      const payload = JSON.parse(atob(token.split('.')[1]))
      return payload.role === 'admin'
    } catch {
      return false
    }
  }

  getUser() {
    const token = this.getToken()
    if (!token) return null

    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      return {
        id: payload.userId,
        email: payload.email,
        role: payload.role,
        name: payload.name
      }
    } catch {
      return null
    }
  }

  async refreshToken() {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.getToken()}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        this.token = data.token
        localStorage.setItem('adminToken', data.token)
        return data.token
      } else {
        this.logout()
        return null
      }
    } catch (error) {
      this.logout()
      return null
    }
  }
}

export default new AuthService()