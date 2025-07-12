const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Add feedback after a swap
router.post('/', authMiddleware, feedbackController.addFeedback);

// Get all feedback for a user
router.get('/:userId', feedbackController.getUserFeedback);

// Delete feedback (admin/user)
router.delete('/:id', authMiddleware, feedbackController.deleteFeedback);

module.exports = router;
