const Employee = require('../models/Employee');
const MevrickDetails = require('../models/MevrickDetails');
const { hashPassword } = require('../utils/auth');
const { uploadImage } = require('../utils/cloudinary');
// For email functionality, you would integrate with nodemailer or a service like SendGrid
// const sendEmail = require('../utils/sendEmail');

// @desc    Bulk create employees from CSV data
// @route   POST /api/hrms/bulk-create
// @access  Private/Admin
const bulkCreateEmployees = async (req, res) => {
  try {
    const { employees } = req.body;

    if (!employees || !Array.isArray(employees)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide an array of employees'
      });
    }

    const createdEmployees = [];
    const errors = [];

    for (const empData of employees) {
      try {
        // Check if employee already exists
        const employeeExists = await Employee.findOne({
          $or: [{ employeeId: empData.employeeId }, { email: empData.email }]
        });

        if (employeeExists) {
          errors.push({
            employeeId: empData.employeeId,
            error: 'Employee with this ID or email already exists'
          });
          continue;
        }

        // Hash password
        const hashedPassword = await hashPassword(empData.password);

        // Create employee
        const employee = await Employee.create({
          employeeId: empData.employeeId,
          name: empData.name,
          email: empData.email,
          password: hashedPassword,
          designation: empData.designation,
          department: empData.department,
          dateOfJoining: empData.dateOfJoining
        });

        createdEmployees.push(employee);
      } catch (error) {
        errors.push({
          employeeId: empData.employeeId,
          error: error.message
        });
      }
    }

    res.status(201).json({
      success: true,
      created: createdEmployees.length,
      errors: errors.length,
      createdEmployees,
      errorDetails: errors
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Generate bulk offer letters
// @route   POST /api/hrms/bulk-offer-letters
// @access  Private/Admin
const generateBulkOfferLetters = async (req, res) => {
  try {
    const { employeeIds } = req.body;

    if (!employeeIds || !Array.isArray(employeeIds)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide an array of employee IDs'
      });
    }

    // In a real implementation, you would generate PDF offer letters here
    // For now, we'll just return a success response

    res.status(200).json({
      success: true,
      message: `Offer letters generated for ${employeeIds.length} employees`,
      employeeIds
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Send bulk emails with offer letters
// @route   POST /api/hrms/bulk-emails
// @access  Private/Admin
const sendBulkEmails = async (req, res) => {
  try {
    const { employeeIds, subject, message } = req.body;

    if (!employeeIds || !Array.isArray(employeeIds)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide an array of employee IDs'
      });
    }

    // In a real implementation, you would send emails here using nodemailer or SendGrid
    // For now, we'll just return a success response

    res.status(200).json({
      success: true,
      message: `Emails sent to ${employeeIds.length} employees`,
      employeeIds
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get all employee details for HRMS
// @route   GET /api/hrms/employees
// @access  Private/Admin
const getAllEmployeeDetails = async (req, res) => {
  try {
    const employees = await Employee.find({}).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: employees.length,
      employees
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  bulkCreateEmployees,
  generateBulkOfferLetters,
  sendBulkEmails,
  getAllEmployeeDetails
};