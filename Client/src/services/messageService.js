import api from './api';

const messageService = {
  // Get messages for a group
  async getGroupMessages(groupId, page = 1, limit = 50) {
    try {
      const response = await api.get(`/messages/group/${groupId}?page=${page}&limit=${limit}`);
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch messages');
    }
  },

  // Send a message to a group
  async sendMessage(groupId, messageData) {
    try {
      const response = await api.post(`/messages/group/${groupId}`, messageData);
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to send message');
    }
  },

  // Edit a message
  async editMessage(messageId, content) {
    try {
      const response = await api.put(`/messages/${messageId}`, { content });
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to edit message');
    }
  },

  // Delete a message
  async deleteMessage(messageId) {
    try {
      const response = await api.delete(`/messages/${messageId}`);
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to delete message');
    }
  },

  // Add reaction to a message
  async addReaction(messageId, emoji) {
    try {
      const response = await api.post(`/messages/${messageId}/reaction`, { emoji });
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to add reaction');
    }
  },

  // Remove reaction from a message
  async removeReaction(messageId, emoji) {
    try {
      const response = await api.delete(`/messages/${messageId}/reaction`, { data: { emoji } });
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to remove reaction');
    }
  },

  // Get unread message count for a group
  async getUnreadCount(groupId) {
    try {
      const response = await api.get(`/messages/group/${groupId}/unread`);
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to get unread count');
    }
  }
};

export default messageService;
