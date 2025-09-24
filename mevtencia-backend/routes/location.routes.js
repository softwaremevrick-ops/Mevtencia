const express = require('express');
const {
  getLocations,
  getLocation,
  createLocation,
  updateLocation,
  deleteLocation,
  checkGeofence
} = require('../controllers/location.controller');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getLocations);
router.get('/:id', getLocation);
router.post('/check-geofence', checkGeofence);

// Admin routes
router.post('/', protect, authorize('admin'), createLocation);
router.put('/:id', protect, authorize('admin'), updateLocation);
router.delete('/:id', protect, authorize('admin'), deleteLocation);

module.exports = router;