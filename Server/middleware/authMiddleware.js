const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.authMiddleware = async (req, res, next) => {
  let token;

  // Look for token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'No token. Authorization denied.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'Invalid token. User not found.' });
    }

    if (user.is_banned) {
      return res.status(403).json({ message: 'User is banned.' });
    }

    req.user = user; // Attach full user object to the request
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token.' });
  }
};
