const express = require('express');
const {
  bulkCreateEmployees,
  generateBulkOfferLetters,
  sendBulkEmails,
  getAllEmployeeDetails
} = require('../controllers/hrms.controller');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication and admin authorization
router.use(protect, authorize('admin'));

router.post('/bulk-create', bulkCreateEmployees);
router.post('/bulk-offer-letters', generateBulkOfferLetters);
router.post('/bulk-emails', sendBulkEmails);
router.get('/employees', getAllEmployeeDetails);

module.exports = router;