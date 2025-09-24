const express = require('express');
const {
  checkinWithAuth,
  checkin,
  checkout,
  getEmployeeAttendance,
  getAllAttendance,
  getAttendanceSummary
} = require('../controllers/attendance.controller');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public route for checkin with authentication
router.post('/checkin-with-auth', checkinWithAuth);

// Employee routes
router.post('/checkin', protect, checkin);
router.post('/checkout', protect, checkout);
router.get('/employee', protect, getEmployeeAttendance);
router.get('/summary', protect, getAttendanceSummary);

// Admin routes
router.get('/', protect, authorize('admin'), getAllAttendance);

module.exports = router;