const path = require('path');

// Allowed extensions and mimetypes
const allowedTypes = {
  image: ['.jpg', '.jpeg', '.png', '.gif'],
  video: ['.mp4', '.webm', '.mov'],
  audio: ['.mp3', '.wav', '.aac'],
  file: ['.pdf', '.doc', '.docx', '.ppt', '.pptx', '.txt']
};

const maxFileSize = 50 * 1024 * 1024; // 50MB (adjust as needed)

function fileValidator(req, res, next) {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  const ext = path.extname(req.file.originalname).toLowerCase();
  const mime = req.file.mimetype;

  // Check size
  if (req.file.size > maxFileSize) {
    return res.status(400).json({ message: `File too large. Max size is ${maxFileSize / (1024*1024)}MB.` });
  }

  // Check extension and mimetype
  const allAllowed = [
    ...allowedTypes.image,
    ...allowedTypes.video,
    ...allowedTypes.audio,
    ...allowedTypes.file,
  ];

  if (!allAllowed.includes(ext)) {
    return res.status(400).json({ message: `Invalid file type: ${ext}` });
  }

  next();
}

// File validation utilities
const validateFile = (file) => {
  const maxSize = 25 * 1024 * 1024; // Increased to 25MB for larger PDFs
  const allowedMimeTypes = [
    // Images
    'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/bmp', 'image/tiff',
    // Documents
    'application/pdf',
    'text/plain', 'text/csv', 'text/markdown', 'text/x-markdown',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    // Text and code files
    'text/html', 'text/xml', 'application/json', 'text/javascript', 'text/css',
    'application/javascript', 'application/xml',
    // Archives
    'application/zip',
    'application/x-rar-compressed',
    'application/x-7z-compressed'
  ];

  if (!file) {
    return {
      isValid: false,
      error: 'No file provided'
    };
  }

  if (file.size > maxSize) {
    return {
      isValid: false,
      error: 'File size must be less than 25MB'
    };
  }

  if (!allowedMimeTypes.includes(file.mimetype)) {
    console.log('Unsupported file type:', file.mimetype);
    return {
      isValid: false,
      error: `File type ${file.mimetype} not supported. Supported types: PDF, images, documents, spreadsheets, presentations, text files, and code files`
    };
  }

  return {
    isValid: true
  };
};

// Video validation
const validateVideo = (file) => {
  const maxSize = 100 * 1024 * 1024; // Increased to 100MB for larger videos
  const allowedMimeTypes = [
    'video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo',
    'video/x-ms-wmv', 'video/x-flv', 'video/webm', 'video/ogg',
    'video/3gpp', 'video/x-m4v', 'video/mov'
  ];

  if (!file) {
    return {
      isValid: false,
      error: 'No video file provided'
    };
  }

  if (file.size > maxSize) {
    return {
      isValid: false,
      error: 'Video file size must be less than 100MB'
    };
  }

  if (!allowedMimeTypes.includes(file.mimetype)) {
    console.log('Unsupported video type:', file.mimetype);
    return {
      isValid: false,
      error: `Video file type ${file.mimetype} not supported. Supported formats: MP4, WebM, MOV, AVI, etc.`
    };
  }

  return {
    isValid: true
  };
};

module.exports = {
  fileValidator,
  validateFile,
  validateVideo
};
