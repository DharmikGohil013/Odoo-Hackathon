const CanvasSession = require('../models/CanvasSession');
const User = require('../models/User');

// Create canvas session
const createSession = async (req, res) => {
  try {
    const { roomId, title } = req.body;

    if (!roomId) {
      return res.status(400).json({
        success: false,
        message: 'Room ID is required'
      });
    }

    // Check if room already exists
    const existingSession = await CanvasSession.findOne({ roomId });
    if (existingSession) {
      return res.status(400).json({
        success: false,
        message: 'Room ID already exists'
      });
    }

    const newSession = new CanvasSession({
      roomId: roomId.trim(),
      title: title || 'Canvas Session',
      createdBy: req.user.id,
      participants: [{
        user: req.user.id,
        joinedAt: new Date(),
        isActive: true
      }]
    });

    const savedSession = await newSession.save();
    await savedSession.populate('createdBy', 'name email');
    await savedSession.populate('participants.user', 'name email');

    res.status(201).json({
      success: true,
      message: 'Canvas session created successfully',
      data: savedSession
    });
  } catch (error) {
    console.error('Create canvas session error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create canvas session'
    });
  }
};

// Join canvas session
const joinSession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await CanvasSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Canvas session not found'
      });
    }

    if (!session.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Canvas session is not active'
      });
    }

    // Check if user is already in the session
    const existingParticipant = session.participants.find(
      p => p.user.toString() === req.user.id
    );

    if (existingParticipant) {
      // Reactivate if inactive
      existingParticipant.isActive = true;
    } else {
      // Check participant limit
      const activeParticipants = session.participants.filter(p => p.isActive).length;
      if (activeParticipants >= session.maxParticipants) {
        return res.status(400).json({
          success: false,
          message: 'Session has reached maximum participants'
        });
      }

      // Add new participant
      session.participants.push({
        user: req.user.id,
        joinedAt: new Date(),
        isActive: true
      });
    }

    const updatedSession = await session.save();
    await updatedSession.populate('createdBy', 'name email');
    await updatedSession.populate('participants.user', 'name email');

    res.status(200).json({
      success: true,
      message: 'Joined canvas session successfully',
      data: updatedSession
    });
  } catch (error) {
    console.error('Join canvas session error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to join canvas session'
    });
  }
};

// Leave canvas session
const leaveSession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await CanvasSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Canvas session not found'
      });
    }

    // Find and deactivate participant
    const participant = session.participants.find(
      p => p.user.toString() === req.user.id
    );

    if (!participant) {
      return res.status(400).json({
        success: false,
        message: 'User is not in this session'
      });
    }

    participant.isActive = false;

    const updatedSession = await session.save();
    await updatedSession.populate('createdBy', 'name email');
    await updatedSession.populate('participants.user', 'name email');

    res.status(200).json({
      success: true,
      message: 'Left canvas session successfully',
      data: updatedSession
    });
  } catch (error) {
    console.error('Leave canvas session error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to leave canvas session'
    });
  }
};

// Get session details
const getSession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await CanvasSession.findById(sessionId)
      .populate('createdBy', 'name email')
      .populate('participants.user', 'name email');

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Canvas session not found'
      });
    }

    res.status(200).json({
      success: true,
      data: session
    });
  } catch (error) {
    console.error('Get canvas session error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch canvas session'
    });
  }
};

// Save canvas data
const saveCanvas = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { canvasData } = req.body;

    const session = await CanvasSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Canvas session not found'
      });
    }

    // Check if user is a participant
    const isParticipant = session.participants.some(
      p => p.user.toString() === req.user.id && p.isActive
    );

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to save canvas data'
      });
    }

    session.canvasData = JSON.stringify(canvasData);
    const updatedSession = await session.save();

    res.status(200).json({
      success: true,
      message: 'Canvas data saved successfully',
      data: updatedSession
    });
  } catch (error) {
    console.error('Save canvas error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save canvas data'
    });
  }
};

// Get canvas data
const getCanvasData = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await CanvasSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Canvas session not found'
      });
    }

    const canvasData = session.canvasData ? JSON.parse(session.canvasData) : null;

    res.status(200).json({
      success: true,
      data: canvasData
    });
  } catch (error) {
    console.error('Get canvas data error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch canvas data'
    });
  }
};

// Get user's canvas sessions
const getUserSessions = async (req, res) => {
  try {
    const sessions = await CanvasSession.find({
      $or: [
        { createdBy: req.user.id },
        { 'participants.user': req.user.id }
      ]
    })
      .populate('createdBy', 'name email')
      .populate('participants.user', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: sessions
    });
  } catch (error) {
    console.error('Get user canvas sessions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch canvas sessions'
    });
  }
};

// Delete canvas session
const deleteSession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await CanvasSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Canvas session not found'
      });
    }

    // Check if user is the creator
    if (session.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this session'
      });
    }

    await CanvasSession.findByIdAndDelete(sessionId);

    res.status(200).json({
      success: true,
      message: 'Canvas session deleted successfully'
    });
  } catch (error) {
    console.error('Delete canvas session error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete canvas session'
    });
  }
};

// Get session by room ID
const getSessionByRoomId = async (req, res) => {
  try {
    const { roomId } = req.params;

    const session = await CanvasSession.findOne({ roomId })
      .populate('createdBy', 'name email')
      .populate('participants.user', 'name email');

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Canvas session not found'
      });
    }

    res.status(200).json({
      success: true,
      data: session
    });
  } catch (error) {
    console.error('Get session by room ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch canvas session'
    });
  }
};

module.exports = {
  createSession,
  joinSession,
  leaveSession,
  getSession,
  saveCanvas,
  getCanvasData,
  getUserSessions,
  deleteSession,
  getSessionByRoomId
};
