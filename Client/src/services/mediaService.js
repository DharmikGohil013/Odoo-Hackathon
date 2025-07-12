import api from './authService';

export const mediaService = {
  // Upload media files
  uploadMedia: async (file, type = 'image') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    
    const response = await api.post('/media/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // Delete media
  deleteMedia: async (mediaId) => {
    const response = await api.delete(`/media/${mediaId}`);
    return response.data;
  },

  // Get user's media
  getUserMedia: async (userId) => {
    const response = await api.get(`/media/user/${userId}`);
    return response.data;
  },

  // Mock functions
  mockUploadMedia: async (file, type = 'image') => {
    return new Promise((resolve, reject) => {
      // Validate file
      const maxSize = 50 * 1024 * 1024; // 50MB
      const allowedTypes = {
        image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
        video: ['video/mp4', 'video/webm', 'video/quicktime'],
        document: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      };

      if (file.size > maxSize) {
        reject(new Error('File size exceeds 50MB limit'));
        return;
      }

      const typeAllowed = allowedTypes[type] || allowedTypes.image;
      if (!typeAllowed.includes(file.type)) {
        reject(new Error(`File type ${file.type} not allowed for ${type}`));
        return;
      }

      setTimeout(() => {
        resolve({
          id: Date.now(),
          filename: file.name,
          originalName: file.name,
          mimeType: file.type,
          size: file.size,
          type,
          url: URL.createObjectURL(file),
          uploadedAt: new Date().toISOString()
        });
      }, 1000);
    });
  }
};