import authService from './authService';

const API_BASE_URL = 'http://localhost:5000/api';

class GroupService {
  async createGroup(groupData) {
    try {
      const response = await fetch(`${API_BASE_URL}/groups`, {
        method: 'POST',
        headers: authService.getAuthHeaders(),
        body: JSON.stringify(groupData)
      });

      if (!response.ok) {
        throw new Error('Failed to create group');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async getAllPublicGroups() {
    try {
      const response = await fetch(`${API_BASE_URL}/groups`, {
        headers: authService.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch groups');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async getGroupDetails(groupId) {
    try {
      const response = await fetch(`${API_BASE_URL}/groups/${groupId}`, {
        headers: authService.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch group details');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async joinGroup(groupId) {
    try {
      const response = await fetch(`${API_BASE_URL}/groups/${groupId}/join`, {
        method: 'POST',
        headers: authService.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to join group');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async leaveGroup(groupId) {
    try {
      const response = await fetch(`${API_BASE_URL}/groups/${groupId}/leave`, {
        method: 'POST',
        headers: authService.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to leave group');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async deleteGroup(groupId) {
    try {
      const response = await fetch(`${API_BASE_URL}/groups/${groupId}`, {
        method: 'DELETE',
        headers: authService.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to delete group');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async getGroupMembers(groupId) {
    try {
      const response = await fetch(`${API_BASE_URL}/groups/${groupId}/members`, {
        headers: authService.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch group members');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }
}

export default new GroupService();
