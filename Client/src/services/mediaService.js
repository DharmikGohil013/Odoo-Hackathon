import authService from './authService';

const API_BASE_URL = 'http://localhost:5000/api';

class MediaService {
  async uploadMedia(file) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        headers: {
          ...(authService.token && { Authorization: `Bearer ${authService.token}` })
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to upload media');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async uploadMultipleMedia(files) {
    try {
      const uploadPromises = Array.from(files).map(file => this.uploadMedia(file));
      return await Promise.all(uploadPromises);
    } catch (error) {
      throw error;
    }
  }

  validateFileType(file, allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']) {
    return allowedTypes.includes(file.type);
  }

  validateFileSize(file, maxSizeInMB = 5) {
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    return file.size <= maxSizeInBytes;
  }
}

export default new MediaService();
