import authService from './authService';

const API_BASE_URL = 'http://localhost:5000/api';

class SwapService {
  async sendSwapRequest(swapData) {
    try {
      const response = await fetch(`${API_BASE_URL}/swaps`, {
        method: 'POST',
        headers: authService.getAuthHeaders(),
        body: JSON.stringify(swapData)
      });

      if (!response.ok) {
        throw new Error('Failed to send swap request');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async getIncomingRequests() {
    try {
      const response = await fetch(`${API_BASE_URL}/swaps/incoming`, {
        headers: authService.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch incoming requests');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async getOutgoingRequests() {
    try {
      const response = await fetch(`${API_BASE_URL}/swaps/outgoing`, {
        headers: authService.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch outgoing requests');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async acceptSwapRequest(swapId) {
    try {
      const response = await fetch(`${API_BASE_URL}/swaps/${swapId}/accept`, {
        method: 'POST',
        headers: authService.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to accept swap request');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async rejectSwapRequest(swapId) {
    try {
      const response = await fetch(`${API_BASE_URL}/swaps/${swapId}/reject`, {
        method: 'POST',
        headers: authService.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to reject swap request');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async cancelSwapRequest(swapId) {
    try {
      const response = await fetch(`${API_BASE_URL}/swaps/${swapId}/cancel`, {
        method: 'DELETE',
        headers: authService.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to cancel swap request');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async deleteSwapRequest(swapId) {
    try {
      const response = await fetch(`${API_BASE_URL}/swaps/${swapId}`, {
        method: 'DELETE',
        headers: authService.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to delete swap request');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }
}

export default new SwapService();
