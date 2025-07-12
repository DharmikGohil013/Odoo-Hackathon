const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const {
  createSession,
  joinSession,
  leaveSession,
  getSession,
  saveCanvas,
  getCanvasData,
  getUserSessions,
  deleteSession,
  getSessionByRoomId
} = require('../controllers/canvasController');

// All routes require authentication
router.use(authMiddleware);

// Create canvas session
router.post('/session', createSession);

// Get user's canvas sessions
router.get('/sessions', getUserSessions);

// Join canvas session
router.post('/session/:sessionId/join', joinSession);

// Leave canvas session
router.post('/session/:sessionId/leave', leaveSession);

// Get session details
router.get('/session/:sessionId', getSession);

// Save canvas data
router.post('/session/:sessionId/save', saveCanvas);

// Get canvas data
router.get('/session/:sessionId/data', getCanvasData);

// Delete canvas session
router.delete('/session/:sessionId', deleteSession);

// Get session by room ID
router.get('/room/:roomId', getSessionByRoomId);

module.exports = router;
