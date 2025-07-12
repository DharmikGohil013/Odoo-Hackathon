const File = require('../models/File');
const User = require('../models/User');
const cloudinary = require('../config/cloudinary');
const { validateFile } = require('../utils/fileValidator');
const fs = require('fs').promises;

// Get all files
const getFiles = async (req, res) => {
  try {
    const files = await File.find({ isPublic: true })
      .populate('uploadedBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: files
    });
  } catch (error) {
    console.error('Get files error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch files'
    });
  }
};

// Upload file
const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file provided'
      });
    }

    const { title } = req.body;
    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Title is required'
      });
    }

    console.log('Uploading file:', req.file.originalname, 'Type:', req.file.mimetype, 'Size:', req.file.size);

    // Validate file
    const validation = validateFile(req.file);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: validation.error
      });
    }

    // Determine file type
    const getFileType = (mimetype) => {
      if (mimetype.startsWith('image/')) return 'image';
      if (mimetype === 'application/pdf') return 'pdf';
      if (mimetype.includes('word') || mimetype.includes('document')) return 'document';
      if (mimetype.includes('excel') || mimetype.includes('sheet')) return 'spreadsheet';
      if (mimetype.includes('powerpoint') || mimetype.includes('presentation')) return 'presentation';
      return 'other';
    };

    // Determine resource type for Cloudinary
    const getResourceType = (mimetype) => {
      if (mimetype.startsWith('image/')) return 'image';
      if (mimetype.startsWith('video/')) return 'video';
      return 'raw'; // For PDFs and other documents
    };

    // Upload to Cloudinary with proper configuration
    const uploadOptions = {
      folder: 'skill-learning/files',
      resource_type: getResourceType(req.file.mimetype),
      public_id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      use_filename: true,
      unique_filename: false,
      // Add flags for better web compatibility
      flags: 'attachment',
      // For PDFs, try to optimize for web viewing
      ...(req.file.mimetype === 'application/pdf' && {
        pages: true, // Enable page extraction for PDFs
        flags: 'progressive' // Better loading for web
      })
    };

    console.log('Starting Cloudinary upload with options:', uploadOptions);
    const result = await cloudinary.uploader.upload(req.file.path, uploadOptions);
    console.log('Cloudinary upload successful:', result.public_id);

    // Create file record
    const newFile = new File({
      title: title.trim(),
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      type: getFileType(req.file.mimetype),
      cloudinaryUrl: result.secure_url,
      cloudinaryPublicId: result.public_id,
      uploadedBy: req.user.id
    });

    const savedFile = await newFile.save();
    await savedFile.populate('uploadedBy', 'name email');

    // Clean up temporary file
    try {
      await fs.unlink(req.file.path);
    } catch (cleanupError) {
      console.warn('Failed to cleanup temp file:', cleanupError.message);
    }

    res.status(201).json({
      success: true,
      message: 'File uploaded successfully',
      data: savedFile
    });
  } catch (error) {
    console.error('Upload file error:', error);
    
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
      message: 'Failed to upload file: ' + error.message
    });
  }
};

// Get file by ID
const getFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id)
      .populate('uploadedBy', 'name email');

    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    res.status(200).json({
      success: true,
      data: file
    });
  } catch (error) {
    console.error('Get file error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch file'
    });
  }
};

// Download file
const downloadFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Increment download count
    file.downloads += 1;
    await file.save();

    // Redirect to Cloudinary URL for download
    res.redirect(file.cloudinaryUrl);
  } catch (error) {
    console.error('Download file error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to download file'
    });
  }
};

// Delete file
const deleteFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Check if user owns the file
    if (file.uploadedBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this file'
      });
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(file.cloudinaryPublicId);

    // Delete from database
    await File.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete file'
    });
  }
};

// Get files by type
const getFilesByType = async (req, res) => {
  try {
    const { type } = req.params;
    const validTypes = ['image', 'pdf', 'document', 'spreadsheet', 'presentation', 'other'];

    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid file type'
      });
    }

    const files = await File.find({ type, isPublic: true })
      .populate('uploadedBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: files
    });
  } catch (error) {
    console.error('Get files by type error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch files'
    });
  }
};

// Search files
const searchFiles = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const files = await File.find({
      isPublic: true,
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { originalName: { $regex: q, $options: 'i' } }
      ]
    })
      .populate('uploadedBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: files
    });
  } catch (error) {
    console.error('Search files error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search files'
    });
  }
};

// Get user's files
const getUserFiles = async (req, res) => {
  try {
    const files = await File.find({ uploadedBy: req.user.id })
      .populate('uploadedBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: files
    });
  } catch (error) {
    console.error('Get user files error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user files'
    });
  }
};

// Preview file
const previewFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // For preview, we'll return the Cloudinary URL with proper headers
    // This allows the frontend to properly embed the file
    let previewUrl = file.cloudinaryUrl;
    
    // For PDFs, provide alternative preview options
    if (file.type === 'pdf') {
      // Try to get a PDF-optimized URL
      const pdfUrl = file.cloudinaryUrl.replace('/upload/', '/upload/fl_progressive/');
      previewUrl = pdfUrl;
    }
    
    res.status(200).json({
      success: true,
      data: {
        ...file.toObject(),
        previewUrl,
        canPreview: ['image', 'pdf'].includes(file.type) || file.mimetype.startsWith('text/'),
        // Provide multiple preview options for PDFs
        ...(file.type === 'pdf' && {
          previewOptions: {
            direct: file.cloudinaryUrl,
            progressive: file.cloudinaryUrl.replace('/upload/', '/upload/fl_progressive/'),
            googleViewer: `https://docs.google.com/viewer?url=${encodeURIComponent(file.cloudinaryUrl)}`,
            pdfjs: `https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(file.cloudinaryUrl)}`
          }
        })
      }
    });
  } catch (error) {
    console.error('Preview file error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to preview file'
    });
  }
};

module.exports = {
  getFiles,
  uploadFile,
  getFile,
  downloadFile,
  deleteFile,
  getFilesByType,
  searchFiles,
  getUserFiles,
  previewFile
};
