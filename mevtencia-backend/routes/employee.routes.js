const express = require('express');
const multer = require('multer');
const {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  uploadProfileImage,
  getMevrickDetails,
  updateMevrickDetails,
  resetPassword
} = require('../controllers/employee.controller');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// All routes require authentication
router.use(protect);

// Employee routes
router.route('/resetpassword')
  .post(resetPassword);

// Admin only routes
router.route('/')
  .get(authorize('admin'), getEmployees)
  .post(authorize('admin'), createEmployee);

router.route('/:id')
  .get(authorize('admin'), getEmployee)
  .put(authorize('admin'), updateEmployee)
  .delete(authorize('admin'), deleteEmployee);

router.route('/:id/profile-image')
  .post(authorize('admin'), upload.single('profileImage'), uploadProfileImage);

router.route('/:id/mevrick-details')
  .get(authorize('admin'), getMevrickDetails)
  .put(authorize('admin'), updateMevrickDetails);

module.exports = router;