const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { authMiddleware } = require('../middleware/authMiddleware');
const { fileValidator } = require('../utils/fileValidator');
const {
  getFiles,
  uploadFile,
  getFile,
  downloadFile,
  previewFile,
  deleteFile,
  getFilesByType,
  searchFiles,
  getUserFiles
} = require('../controllers/fileController');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Public routes
router.get('/', getFiles);
router.get('/search', searchFiles);
router.get('/type/:type', getFilesByType);
router.get('/:id', getFile);
router.get('/:id/preview', previewFile);
router.get('/:id/download', downloadFile);

// Protected routes
router.use(authMiddleware);

// User's files
router.get('/user/me', getUserFiles);

// Upload file
router.post('/upload', upload.single('file'), uploadFile);

// Delete file
router.delete('/:id', deleteFile);

module.exports = router;
