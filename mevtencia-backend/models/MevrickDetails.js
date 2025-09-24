const mongoose = require('mongoose');

const MevrickDetailsSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  personalDetails: {
    fullName: String,
    fatherName: String,
    motherName: String,
    dateOfBirth: Date,
    gender: String,
    maritalStatus: String,
    bloodGroup: String,
    nationality: String,
    aadharNumber: String,
    panNumber: String,
    passportNumber: String
  },
  contactDetails: {
    phoneNumber: String,
    alternatePhoneNumber: String,
    personalEmail: String,
    currentAddress: String,
    permanentAddress: String
  },
  educationDetails: [{
    qualification: String,
    institution: String,
    university: String,
    startDate: Date,
    endDate: Date,
    percentage: Number
  }],
  workExperience: [{
    companyName: String,
    position: String,
    startDate: Date,
    endDate: Date,
    responsibilities: String
  }],
  bankDetails: {
    bankName: String,
    accountNumber: String,
    ifscCode: String,
    branch: String,
    accountHolderName: String
  },
  salaryDetails: {
    basicSalary: Number,
    hra: Number,
    conveyance: Number,
    medical: Number,
    specialAllowance: Number,
    pf: Number,
    esi: Number
  },
  documents: [{
    name: String,
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('MevrickDetails', MevrickDetailsSchema);