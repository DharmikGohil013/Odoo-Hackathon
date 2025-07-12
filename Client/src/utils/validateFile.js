export const validateFile = (file, options = {}) => {
  const {
    maxSize = 50 * 1024 * 1024, // 50MB default
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'application/pdf'],
    category = 'general'
  } = options;

  const errors = [];

  // Check if file exists
  if (!file) {
    errors.push('No file selected');
    return { isValid: false, errors };
  }

  // Check file size
  if (file.size > maxSize) {
    const maxSizeMB = Math.round(maxSize / (1024 * 1024));
    errors.push(`File size exceeds ${maxSizeMB}MB limit`);
  }

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    errors.push(`File type ${file.type} is not allowed`);
  }

  // Category-specific validations
  switch (category) {
    case 'image':
      if (!file.type.startsWith('image/')) {
        errors.push('Only image files are allowed');
      }
      break;
    case 'video':
      if (!file.type.startsWith('video/')) {
        errors.push('Only video files are allowed');
      }
      break;
    case 'document': {
      const docTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!docTypes.includes(file.type)) {
        errors.push('Only PDF and Word documents are allowed');
      }
      break;
    }
  }

  // Check file name length
  if (file.name.length > 100) {
    errors.push('File name is too long (max 100 characters)');
  }

  return {
    isValid: errors.length === 0,
    errors,
    fileInfo: {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified
    }
  };
};

export const getFileIcon = (fileType) => {
  if (fileType.startsWith('image/')) return '🖼️';
  if (fileType.startsWith('video/')) return '🎥';
  if (fileType === 'application/pdf') return '📄';
  if (fileType.includes('word')) return '📝';
  return '📎';
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default validateFile;