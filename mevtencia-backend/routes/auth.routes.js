const express = require('express');
const { adminLogin, employeeLogin, getMe } = require('../controllers/auth.controller');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/admin/login', adminLogin);
router.post('/employee/login', employeeLogin);

// Private routes
router.get('/me', protect, getMe);

module.exports = router;