const Feedback = require('../models/Feedback');
const SwapRequest = require('../models/SwapRequest');
const User = require('../models/User');

// Add feedback after a completed swap
exports.addFeedback = async (req, res) => {
  try {
    const { swap_id, rating, comment, to_user_id } = req.body;
    if (!swap_id || !rating || !to_user_id) {
      return res.status(400).json({ message: 'swap_id, rating, and to_user_id are required' });
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Only allow if the swap is accepted and user is involved
    const swap = await SwapRequest.findById(swap_id);
    if (
      !swap ||
      swap.status !== 'accepted' ||
      (
        swap.from_user_id.toString() !== req.user._id.toString() &&
        swap.to_user_id.toString() !== req.user._id.toString()
      )
    ) {
      return res.status(403).json({ message: 'Not authorized or invalid swap' });
    }

    // Prevent duplicate feedback for the same swap from the same user
    const alreadyGiven = await Feedback.findOne({ swap_id, from_user_id: req.user._id });
    if (alreadyGiven) {
      return res.status(409).json({ message: 'Feedback already submitted for this swap by you.' });
    }

    const feedback = await Feedback.create({
      swap_id,
      from_user_id: req.user._id,
      to_user_id,
      rating,
      comment,
    });

    // Optionally update user's average rating
    const allFeedback = await Feedback.find({ to_user_id });
    const avgRating = allFeedback.length > 0
      ? allFeedback.reduce((sum, fb) => sum + fb.rating, 0) / allFeedback.length
      : 0;
    await User.findByIdAndUpdate(to_user_id, { rating: avgRating });

    res.status(201).json(feedback);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get all feedback received by a user
exports.getUserFeedback = async (req, res) => {
  try {
    const { userId } = req.params;
    const feedbacks = await Feedback.find({ to_user_id: userId })
      .populate('from_user_id', 'name profile_photo');
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Delete feedback (admin or feedback author)
exports.deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) return res.status(404).json({ message: 'Feedback not found' });

    // Only admin or the one who gave feedback can delete
    if (
      req.user.role !== 'admin' &&
      feedback.from_user_id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized to delete this feedback' });
    }

    await feedback.remove();
    res.json({ message: 'Feedback deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
