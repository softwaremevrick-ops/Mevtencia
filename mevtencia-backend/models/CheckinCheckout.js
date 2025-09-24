const mongoose = require('mongoose');

const CheckinCheckoutSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  checkinTime: {
    type: Date,
    required: true
  },
  checkoutTime: {
    type: Date
  },
  checkinLocation: {
    latitude: {
      type: Number
    },
    longitude: {
      type: Number
    },
    address: {
      type: String
    },
    selfie: {
      type: String
    }
  },
  checkoutLocation: {
    latitude: {
      type: Number
    },
    longitude: {
      type: Number
    },
    address: {
      type: String
    }
  },
  totalTime: {
    type: Number // in minutes
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'late', 'half-day'],
    default: 'present'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('CheckinCheckout', CheckinCheckoutSchema);