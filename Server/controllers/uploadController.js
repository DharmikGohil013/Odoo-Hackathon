const cloudinary = require('../config/cloudinary');
const fs = require('fs');
const path = require('path');

// @desc    Upload a file to Cloudinary
// @route   POST /api/upload
// @access  Private
exports.uploadMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: 'auto', // auto detects: image, video, audio, etc.
      folder: 'skill-swap',
    });

    // Cleanup temp file
    fs.unlinkSync(req.file.path);

    res.status(201).json({
      url: result.secure_url,
      type: req.file.mimetype.split('/')[0], // image, video, audio, etc.
      public_id: result.public_id,
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ message: 'Upload failed', error: err.message });
  }
};
