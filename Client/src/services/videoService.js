import api from '../utils/api';

const API_BASE = '/api/videos';

export const videoService = {
  // Get all videos
  getVideos: async () => {
    const response = await api.get(API_BASE);
    return response.data;
  },

  // Upload video
  uploadVideo: async (formData) => {
    const response = await api.post(`${API_BASE}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete video
  deleteVideo: async (videoId) => {
    const response = await api.delete(`${API_BASE}/${videoId}`);
    return response.data;
  },

  // Get video by ID
  getVideo: async (videoId) => {
    const response = await api.get(`${API_BASE}/${videoId}`);
    return response.data;
  },

  // Get videos by user
  getVideosByUser: async (userId) => {
    const response = await api.get(`${API_BASE}/user/${userId}`);
    return response.data;
  },

  // Search videos
  searchVideos: async (query) => {
    const response = await api.get(`${API_BASE}/search`, {
      params: { q: query }
    });
    return response.data;
  },

  // Update video details
  updateVideo: async (videoId, data) => {
    const response = await api.put(`${API_BASE}/${videoId}`, data);
    return response.data;
  }
};
