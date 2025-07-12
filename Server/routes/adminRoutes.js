const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authMiddleware } = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware'); // <--- NO curly braces!

// Example admin-only route
router.post(
  '/users/:id/ban',
  authMiddleware,
  roleMiddleware('admin'), // <--- Call as a function!
  adminController.banUser
);
router.post('/users/:id/unban', authMiddleware, roleMiddleware('admin'), adminController.unbanUser);

// Approve a skill
router.post('/skills/:id/approve', authMiddleware, roleMiddleware('admin'), adminController.approveSkill);

// Reject a skill
router.post('/skills/:id/reject', authMiddleware, roleMiddleware('admin'), adminController.rejectSkill);

// Delete feedback
router.delete('/feedback/:id', authMiddleware, roleMiddleware('admin'), adminController.deleteFeedback);

// Post announcement
router.post('/announcement', authMiddleware, roleMiddleware('admin'), adminController.postAnnouncement);

// Download platform reports
router.get('/reports', authMiddleware, roleMiddleware('admin'), adminController.getReports);

module.exports = router;
