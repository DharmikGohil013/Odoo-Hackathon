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
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedMimeTypes = [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'application/pdf', 'text/plain', 'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation'
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
      error: 'File size must be less than 10MB'
    };
  }

  if (!allowedMimeTypes.includes(file.mimetype)) {
    return {
      isValid: false,
      error: 'File type not supported'
    };
  }

  return {
    isValid: true
  };
};

// Video validation
const validateVideo = (file) => {
  const maxSize = 50 * 1024 * 1024; // 50MB
  const allowedMimeTypes = [
    'video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo',
    'video/x-ms-wmv', 'video/x-flv', 'video/webm'
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
      error: 'Video file size must be less than 50MB'
    };
  }

  if (!allowedMimeTypes.includes(file.mimetype)) {
    return {
      isValid: false,
      error: 'Video file type not supported'
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
