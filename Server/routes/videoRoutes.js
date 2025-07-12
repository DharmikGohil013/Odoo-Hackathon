const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { authMiddleware } = require('../middleware/authMiddleware');
const { fileValidator } = require('../utils/fileValidator');
const {
  getVideos,
  uploadVideo,
  getVideo,
  deleteVideo,
  getVideosByUser,
  searchVideos,
  updateVideo,
  getUserVideos
} = require('../controllers/videoController');

// Configure multer for video uploads
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
    fileSize: 50 * 1024 * 1024 // 50MB limit for videos
  }
});

// Public routes
router.get('/', getVideos);
router.get('/search', searchVideos);
router.get('/user/:userId', getVideosByUser);
router.get('/:id', getVideo);

// Protected routes
router.use(authMiddleware);

// User's videos
router.get('/user/me', getUserVideos);

// Upload video
router.post('/upload', upload.single('video'), uploadVideo);

// Update video
router.put('/:id', updateVideo);

// Delete video
router.delete('/:id', deleteVideo);

module.exports = router;
