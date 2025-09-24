const jwt = require('jsonwebtoken');
const Employee = require('../models/Employee');
const { verifyToken } = require('../utils/auth');

// Protect routes
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = verifyToken(token);

      // Get employee from token
      req.employee = await Employee.findById(decoded.id);

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized, token failed'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Not authorized, no token'
    });
  }
};

// Authorize roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.employee.role)) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this route'
      });
    }
    next();
  };
};

module.exports = {
  protect,
  authorize
};