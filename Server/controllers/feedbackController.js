const Feedback = require('../models/Feedback');
const SwapRequest = require('../models/SwapRequest');

// @desc    Submit feedback after a swap
// @route   POST /api/feedback/:swapId
// @access  Private
exports.submitFeedback = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const { swapId } = req.params;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const swap = await SwapRequest.findById(swapId);
    if (!swap) return res.status(404).json({ message: 'Swap not found' });

    // Prevent feedback if swap not accepted
    if (swap.status !== 'accepted') {
      return res.status(403).json({ message: 'Feedback allowed only for accepted swaps' });
    }

    // Check if current user is part of this swap
    if (
      String(swap.from_user_id) !== String(req.user._id) &&
      String(swap.to_user_id) !== String(req.user._id)
    ) {
      return res.status(403).json({ message: 'You are not part of this swap' });
    }

    // Identify recipient (the other person)
    const to_user_id =
      String(swap.from_user_id) === String(req.user._id)
        ? swap.to_user_id
        : swap.from_user_id;

    // Prevent duplicate feedback for same swap by same user
    const existing = await Feedback.findOne({
      swap_id: swapId,
      from_user_id: req.user._id,
    });

    if (existing) {
      return res.status(409).json({ message: 'You already submitted feedback for this swap' });
    }

    const feedback = await Feedback.create({
      swap_id: swapId,
      from_user_id: req.user._id,
      to_user_id,
      rating,
      comment,
    });

    res.status(201).json(feedback);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc    Get all feedback for a user
// @route   GET /api/feedback/user/:userId
// @access  Public (or protected)
exports.getFeedbackForUser = async (req, res) => {
  try {
    const feedbackList = await Feedback.find({ to_user_id: req.params.userId })
      .populate('from_user_id', 'name profile_photo')
      .sort({ created_at: -1 });

    res.json(feedbackList);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
