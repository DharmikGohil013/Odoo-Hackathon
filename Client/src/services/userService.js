import authService from './authService';

const API_BASE_URL = 'http://localhost:5000/api';

class UserService {
  async getOwnProfile() {
    try {
      const response = await fetch(`${API_BASE_URL}/users/me`, {
        headers: authService.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async updateProfile(profileData) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/me`, {
        method: 'PUT',
        headers: authService.getAuthHeaders(),
        body: JSON.stringify(profileData)
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async setProfilePrivacy(isPublic) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/me/privacy`, {
        method: 'PATCH',
        headers: authService.getAuthHeaders(),
        body: JSON.stringify({ is_public: isPublic })
      });

      if (!response.ok) {
        throw new Error('Failed to update privacy settings');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async updateSkills(skillsData) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/me/skills`, {
        method: 'PUT',
        headers: authService.getAuthHeaders(),
        body: JSON.stringify(skillsData)
      });

      if (!response.ok) {
        throw new Error('Failed to update skills');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async getAllPublicUsers() {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        headers: authService.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async getUserById(userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        headers: authService.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async addFriend(userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/friend`, {
        method: 'POST',
        headers: authService.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to add friend');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async removeFriend(userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/friend`, {
        method: 'DELETE',
        headers: authService.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to remove friend');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async blockUser(userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/block`, {
        method: 'POST',
        headers: authService.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to block user');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async unblockUser(userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/block`, {
        method: 'DELETE',
        headers: authService.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to unblock user');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }
}

export default new UserService();
