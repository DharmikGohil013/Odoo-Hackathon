const Video = require('../models/Video');
const User = require('../models/User');
const cloudinary = require('../config/cloudinary');
const { validateVideo } = require('../utils/fileValidator');
const fs = require('fs').promises;

// Get all videos
const getVideos = async (req, res) => {
  try {
    const videos = await Video.find({ isPublic: true })
      .populate('uploadedBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: videos
    });
  } catch (error) {
    console.error('Get videos error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch videos'
    });
  }
};

// Upload video
const uploadVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No video file provided'
      });
    }

    const { title } = req.body;
    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Title is required'
      });
    }

    console.log('Uploading video:', req.file.originalname, 'Size:', req.file.size);

    // Validate video file
    const validation = validateVideo(req.file);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: validation.error
      });
    }

    // Upload video to Cloudinary with proper configuration
    const uploadOptions = {
      folder: 'skill-learning/videos',
      resource_type: 'video',
      public_id: `video_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      chunk_size: 6000000, // 6MB chunks for large files
      eager: [
        { 
          width: 300, 
          height: 200, 
          crop: 'pad', 
          audio_codec: 'none', 
          format: 'jpg',
          resource_type: 'image'
        }
      ],
      eager_async: true
    };

    console.log('Starting Cloudinary upload...');
    const result = await cloudinary.uploader.upload(req.file.path, uploadOptions);
    console.log('Cloudinary upload successful:', result.public_id);

    // Extract video metadata
    const duration = result.duration || 0;
    const thumbnail = result.eager && result.eager[0] ? result.eager[0].secure_url : null;

    // Create video record
    const newVideo = new Video({
      title: title.trim(),
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      duration,
      cloudinaryUrl: result.secure_url,
      cloudinaryPublicId: result.public_id,
      thumbnail,
      uploadedBy: req.user.id
    });

    const savedVideo = await newVideo.save();
    await savedVideo.populate('uploadedBy', 'name email');

    // Clean up temporary file
    try {
      await fs.unlink(req.file.path);
    } catch (cleanupError) {
      console.warn('Failed to cleanup temp file:', cleanupError.message);
    }

    res.status(201).json({
      success: true,
      message: 'Video uploaded successfully',
      data: savedVideo
    });
  } catch (error) {
    console.error('Upload video error:', error);
    
    // Clean up temporary file on error
    if (req.file && req.file.path) {
      try {
        await fs.unlink(req.file.path);
      } catch (cleanupError) {
        console.warn('Failed to cleanup temp file on error:', cleanupError.message);
      }
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to upload video: ' + error.message
    });
  }
};

// Get video by ID
const getVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id)
      .populate('uploadedBy', 'name email');

    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found'
      });
    }

    // Increment view count
    video.views += 1;
    await video.save();

    res.status(200).json({
      success: true,
      data: video
    });
  } catch (error) {
    console.error('Get video error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch video'
    });
  }
};

// Delete video
const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found'
      });
    }

    // Check if user owns the video
    if (video.uploadedBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this video'
      });
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(video.cloudinaryPublicId, { resource_type: 'video' });

    // Delete thumbnail if exists
    if (video.thumbnail) {
      const thumbnailPublicId = video.cloudinaryPublicId.replace(/\.(mp4|mov|avi|wmv|flv|webm)$/, '');
      await cloudinary.uploader.destroy(thumbnailPublicId);
    }

    // Delete from database
    await Video.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Video deleted successfully'
    });
  } catch (error) {
    console.error('Delete video error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete video'
    });
  }
};

// Get videos by user
const getVideosByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const videos = await Video.find({ uploadedBy: userId, isPublic: true })
      .populate('uploadedBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: videos
    });
  } catch (error) {
    console.error('Get videos by user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch videos'
    });
  }
};

// Search videos
const searchVideos = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const videos = await Video.find({
      isPublic: true,
      title: { $regex: q, $options: 'i' }
    })
      .populate('uploadedBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: videos
    });
  } catch (error) {
    console.error('Search videos error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search videos'
    });
  }
};

// Update video details
const updateVideo = async (req, res) => {
  try {
    const { title, isPublic } = req.body;
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found'
      });
    }

    // Check if user owns the video
    if (video.uploadedBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this video'
      });
    }

    // Update fields
    if (title) video.title = title.trim();
    if (typeof isPublic === 'boolean') video.isPublic = isPublic;

    const updatedVideo = await video.save();
    await updatedVideo.populate('uploadedBy', 'name email');

    res.status(200).json({
      success: true,
      message: 'Video updated successfully',
      data: updatedVideo
    });
  } catch (error) {
    console.error('Update video error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update video'
    });
  }
};

// Get user's videos
const getUserVideos = async (req, res) => {
  try {
    const videos = await Video.find({ uploadedBy: req.user.id })
      .populate('uploadedBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: videos
    });
  } catch (error) {
    console.error('Get user videos error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user videos'
    });
  }
};

module.exports = {
  getVideos,
  uploadVideo,
  getVideo,
  deleteVideo,
  getVideosByUser,
  searchVideos,
  updateVideo,
  getUserVideos
};
