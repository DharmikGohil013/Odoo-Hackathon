import api from '../utils/api';

const API_BASE = '/api/canvas';

export const canvasService = {
  // Create canvas session
  createSession: async (roomId) => {
    const response = await api.post(`${API_BASE}/session`, { roomId });
    return response.data;
  },

  // Join canvas session
  joinSession: async (sessionId) => {
    const response = await api.post(`${API_BASE}/session/${sessionId}/join`);
    return response.data;
  },

  // Leave canvas session
  leaveSession: async (sessionId) => {
    const response = await api.post(`${API_BASE}/session/${sessionId}/leave`);
    return response.data;
  },

  // Get session details
  getSession: async (sessionId) => {
    const response = await api.get(`${API_BASE}/session/${sessionId}`);
    return response.data;
  },

  // Save canvas data
  saveCanvas: async (sessionId, canvasData) => {
    const response = await api.post(`${API_BASE}/session/${sessionId}/save`, {
      canvasData
    });
    return response.data;
  },

  // Get canvas data
  getCanvasData: async (sessionId) => {
    const response = await api.get(`${API_BASE}/session/${sessionId}/data`);
    return response.data;
  },

  // Get user's canvas sessions
  getUserSessions: async () => {
    const response = await api.get(`${API_BASE}/sessions`);
    return response.data;
  },

  // Delete canvas session
  deleteSession: async (sessionId) => {
    const response = await api.delete(`${API_BASE}/session/${sessionId}`);
    return response.data;
  }
};
