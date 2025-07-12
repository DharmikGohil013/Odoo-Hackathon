const express = require('express');
const router = express.Router();

const swapController = require('../controllers/swapController');
const { authMiddleware } = require('../middleware/authMiddleware');

// 📤 Send a swap request
router.post('/', authMiddleware, swapController.sendSwapRequest);

// 📬 Get all incoming swap requests (for me)
router.get('/incoming', authMiddleware, swapController.getIncomingRequests);

// 📤 Get all outgoing swap requests (I sent)
router.get('/outgoing', authMiddleware, swapController.getOutgoingRequests);

// ✅ Accept a swap request
router.post('/:id/accept', authMiddleware, swapController.acceptRequest);

// ❌ Reject a swap request
router.post('/:id/reject', authMiddleware, swapController.rejectRequest);

// 🔄 Cancel a pending request I sent
router.delete('/:id/cancel', authMiddleware, swapController.cancelRequest);

// 🧹 Delete any rejected/unaccepted request
router.delete('/:id', authMiddleware, swapController.deleteRequest);

module.exports = router;
