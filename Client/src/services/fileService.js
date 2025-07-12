import api from '../utils/api';

const API_BASE = '/api/files';

export const fileService = {
  // Get all files
  getFiles: async () => {
    const response = await api.get(API_BASE);
    return response.data;
  },

  // Upload file
  uploadFile: async (formData) => {
    const response = await api.post(`${API_BASE}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Download file
  downloadFile: async (fileId) => {
    const response = await api.get(`${API_BASE}/${fileId}/download`, {
      responseType: 'blob'
    });
    return response;
  },

  // Delete file
  deleteFile: async (fileId) => {
    const response = await api.delete(`${API_BASE}/${fileId}`);
    return response.data;
  },

  // Get file by ID
  getFile: async (fileId) => {
    const response = await api.get(`${API_BASE}/${fileId}`);
    return response.data;
  },

  // Get files by type
  getFilesByType: async (type) => {
    const response = await api.get(`${API_BASE}/type/${type}`);
    return response.data;
  },

  // Search files
  searchFiles: async (query) => {
    const response = await api.get(`${API_BASE}/search`, {
      params: { q: query }
    });
    return response.data;
  }
};
