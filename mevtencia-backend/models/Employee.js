const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
  empId: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  designation: {
    type: String,
    required: true
  },
  empType: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['Employee', 'Admin'],
    default: 'Employee'
  },
  status: {
    type: String,
    enum: ['Active', 'Resigned', 'Terminated'],
    default: 'Active'
  },
  projectLocation: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
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

module.exports = mongoose.model('Employee', EmployeeSchema);