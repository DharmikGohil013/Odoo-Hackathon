const express = require('express');
const router = express.Router();

const uploadController = require('../controllers/uploadController');
const { authMiddleware } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload'); // multer config

// 📤 Upload media (file/image/video/audio/etc.)
router.post('/', authMiddleware, upload.single('file'), uploadController.uploadMedia);

module.exports = router;
