// middleware/roleMiddleware.js

/**
 * Role-based authorization middleware.
 * Usage: roleMiddleware('admin')
 */

module.exports = function(requiredRole) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized: user not authenticated' });
    }
    if (req.user.role !== requiredRole) {
      return res.status(403).json({ message: `Forbidden: ${requiredRole} only` });
    }
    next();
  };
};
