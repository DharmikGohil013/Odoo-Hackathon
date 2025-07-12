const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'; // default to 7 days

// Sign a new token (user object or payload)
exports.signToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// Verify a token (returns decoded if valid, throws if invalid)
exports.verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

// Decode a token without verifying signature (not secure for auth)
exports.decodeToken = (token) => {
  return jwt.decode(token);
};
