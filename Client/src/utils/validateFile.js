export const validateFileType = (file, allowedTypes = []) => {
  if (!file) return { valid: false, error: 'No file provided' };
  
  const defaultAllowedTypes = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml'
  ];
  
  const typesToCheck = allowedTypes.length > 0 ? allowedTypes : defaultAllowedTypes;
  
  if (!typesToCheck.includes(file.type)) {
    return {
      valid: false,
      error: `File type ${file.type} is not allowed. Allowed types: ${typesToCheck.join(', ')}`
    };
  }
  
  return { valid: true };
};

export const validateFileSize = (file, maxSizeInMB = 5) => {
  if (!file) return { valid: false, error: 'No file provided' };
  
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  
  if (file.size > maxSizeInBytes) {
    return {
      valid: false,
      error: `File size ${(file.size / 1024 / 1024).toFixed(2)}MB exceeds maximum allowed size of ${maxSizeInMB}MB`
    };
  }
  
  return { valid: true };
};

export const validateImage = (file, options = {}) => {
  const {
    maxSizeInMB = 5,
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    maxWidth = null,
    maxHeight = null
  } = options;
  
  // Check file type
  const typeValidation = validateFileType(file, allowedTypes);
  if (!typeValidation.valid) return typeValidation;
  
  // Check file size
  const sizeValidation = validateFileSize(file, maxSizeInMB);
  if (!sizeValidation.valid) return sizeValidation;
  
  // Check image dimensions if specified
  if (maxWidth || maxHeight) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        if (maxWidth && img.width > maxWidth) {
          resolve({
            valid: false,
            error: `Image width ${img.width}px exceeds maximum allowed width of ${maxWidth}px`
          });
          return;
        }
        
        if (maxHeight && img.height > maxHeight) {
          resolve({
            valid: false,
            error: `Image height ${img.height}px exceeds maximum allowed height of ${maxHeight}px`
          });
          return;
        }
        
        resolve({ valid: true });
      };
      
      img.onerror = () => {
        resolve({ valid: false, error: 'Invalid image file' });
      };
      
      img.src = URL.createObjectURL(file);
    });
  }
  
  return { valid: true };
};

export const getFilePreview = (file) => {
  if (!file) return null;
  
  if (file.type.startsWith('image/')) {
    return URL.createObjectURL(file);
  }
  
  return null;
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
