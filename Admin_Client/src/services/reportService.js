import authService from './authService'

const API_BASE_URL = 'http://localhost:5000/api'

class ReportService {
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

  async getReports() {
    try {
      const response = await this.makeAuthenticatedRequest('/admin/reports')
      
      if (!response.ok) {
        throw new Error('Failed to fetch reports')
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching reports:', error)
      throw error
    }
  }

  async generateReport(reportType, options = {}) {
    try {
      const queryParams = new URLSearchParams({
        type: reportType,
        ...options
      })

      const response = await this.makeAuthenticatedRequest(`/admin/reports/generate?${queryParams}`, {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to generate report')
      }

      return await response.json()
    } catch (error) {
      console.error('Error generating report:', error)
      throw error
    }
  }

  async downloadReport(reportId, format = 'csv') {
    try {
      const response = await this.makeAuthenticatedRequest(`/admin/reports/${reportId}/download?format=${format}`)
      
      if (!response.ok) {
        throw new Error('Failed to download report')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `report_${reportId}.${format}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      return true
    } catch (error) {
      console.error('Error downloading report:', error)
      throw error
    }
  }

  async getUsersReport(options = {}) {
    try {
      const queryParams = new URLSearchParams(options)
      const response = await this.makeAuthenticatedRequest(`/admin/reports/users?${queryParams}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch users report')
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching users report:', error)
      throw error
    }
  }

  async getSwapsReport(options = {}) {
    try {
      const queryParams = new URLSearchParams(options)
      const response = await this.makeAuthenticatedRequest(`/admin/reports/swaps?${queryParams}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch swaps report')
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching swaps report:', error)
      throw error
    }
  }

  async getSkillsReport(options = {}) {
    try {
      const queryParams = new URLSearchParams(options)
      const response = await this.makeAuthenticatedRequest(`/admin/reports/skills?${queryParams}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch skills report')
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching skills report:', error)
      throw error
    }
  }

  async getFeedbackReport(options = {}) {
    try {
      const queryParams = new URLSearchParams(options)
      const response = await this.makeAuthenticatedRequest(`/admin/reports/feedback?${queryParams}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch feedback report')
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching feedback report:', error)
      throw error
    }
  }

  async getPlatformAnalytics() {
    try {
      const response = await this.makeAuthenticatedRequest('/admin/reports/analytics')
      
      if (!response.ok) {
        throw new Error('Failed to fetch platform analytics')
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching platform analytics:', error)
      throw error
    }
  }
}

export default new ReportService()