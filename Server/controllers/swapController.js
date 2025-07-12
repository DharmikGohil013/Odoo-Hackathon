const SwapRequest = require('../models/SwapRequest');
const User = require('../models/User');

// Send a new swap request
exports.sendSwapRequest = async (req, res) => {
  try {
    const { to_user_id, offered_skill, requested_skill, message } = req.body;

    if (!to_user_id || !offered_skill || !requested_skill) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    if (to_user_id === req.user._id.toString()) {
      return res.status(400).json({ message: "You can't send a swap to yourself." });
    }

    // Prevent duplicate pending requests
    const exists = await SwapRequest.findOne({
      from_user_id: req.user._id,
      to_user_id,
      offered_skill,
      requested_skill,
      status: 'pending'
    });
    if (exists) return res.status(409).json({ message: 'Swap already requested and pending.' });

    const swap = await SwapRequest.create({
      from_user_id: req.user._id,
      to_user_id,
      offered_skill,
      requested_skill,
      message,
      status: 'pending',
    });

    res.status(201).json(swap);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get all incoming swap requests (requests sent to me)
exports.getIncomingRequests = async (req, res) => {
  try {
    const swaps = await SwapRequest.find({ to_user_id: req.user._id })
      .populate('from_user_id', 'name profile_photo skills_offered')
      .sort({ createdAt: -1 });
    res.json(swaps);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get all outgoing swap requests (requests I sent)
exports.getOutgoingRequests = async (req, res) => {
  try {
    const swaps = await SwapRequest.find({ from_user_id: req.user._id })
      .populate('to_user_id', 'name profile_photo skills_wanted')
      .sort({ createdAt: -1 });
    res.json(swaps);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Accept a swap request
exports.acceptRequest = async (req, res) => {
  try {
    const swap = await SwapRequest.findById(req.params.id);
    if (!swap) return res.status(404).json({ message: 'Swap not found' });
    if (swap.to_user_id.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });

    if (swap.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending requests can be accepted.' });
    }

    swap.status = 'accepted';
    await swap.save();
    res.json({ message: 'Swap accepted', swap });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Reject a swap request
exports.rejectRequest = async (req, res) => {
  try {
    const swap = await SwapRequest.findById(req.params.id);
    if (!swap) return res.status(404).json({ message: 'Swap not found' });
    if (swap.to_user_id.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });

    if (swap.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending requests can be rejected.' });
    }

    swap.status = 'rejected';
    await swap.save();
    res.json({ message: 'Swap rejected', swap });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Cancel a pending swap request I sent
exports.cancelRequest = async (req, res) => {
  try {
    const swap = await SwapRequest.findById(req.params.id);
    if (!swap) return res.status(404).json({ message: 'Swap not found' });
    if (swap.from_user_id.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });

    if (swap.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending requests can be cancelled.' });
    }

    swap.status = 'cancelled';
    await swap.save();
    res.json({ message: 'Swap cancelled', swap });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Delete a swap request (only if not accepted)
exports.deleteRequest = async (req, res) => {
  try {
    const swap = await SwapRequest.findById(req.params.id);

    if (!swap) return res.status(404).json({ message: 'Swap not found' });

    // Only the sender can delete and only if NOT accepted
    if (swap.from_user_id.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });

    if (swap.status === 'accepted') {
      return res.status(400).json({ message: 'Cannot delete accepted swap.' });
    }

    await swap.remove();
    res.json({ message: 'Swap request deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
