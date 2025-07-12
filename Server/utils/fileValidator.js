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

module.exports = fileValidator;
