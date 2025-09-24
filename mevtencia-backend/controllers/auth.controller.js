const Employee = require('../models/Employee');
const { generateToken, hashPassword, comparePassword } = require('../utils/auth');

// @desc    Admin login
// @route   POST /api/auth/admin/login
// @access  Public
const adminLogin = async (req, res) => {
  try {
    const { empId, password } = req.body;

    // Validate input
    if (!empId || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide employee ID and password'
      });
    }

    // Check for employee
    const employee = await Employee.findOne({ empId }).select('+password');

    if (!employee) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Check if employee is admin
    if (employee.role !== 'Admin') {
      return res.status(401).json({
        success: false,
        error: 'Not authorized as admin'
      });
    }

    // Check if employee is active
    if (employee.status !== 'Active') {
      return res.status(401).json({
        success: false,
        error: 'Account is deactivated'
      });
    }

    // Check password
    const isMatch = await comparePassword(password, employee.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken(employee._id);

    res.status(200).json({
      success: true,
      token,
      employee: {
        id: employee._id,
        empId: employee.empId,
        username: employee.username,
        role: employee.role,
        designation: employee.designation
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Employee login
// @route   POST /api/auth/employee/login
// @access  Public
const employeeLogin = async (req, res) => {
  try {
    const { empId, password } = req.body;

    // Validate input
    if (!empId || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide employee ID and password'
      });
    }

    // Check for employee
    const employee = await Employee.findOne({ empId }).select('+password');

    if (!employee) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Check if employee is active
    if (employee.status !== 'Active') {
      return res.status(401).json({
        success: false,
        error: 'Account is deactivated'
      });
    }

    // Check password
    const isMatch = await comparePassword(password, employee.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken(employee._id);

    res.status(200).json({
      success: true,
      token,
      employee: {
        id: employee._id,
        empId: employee.empId,
        username: employee.username,
        role: employee.role,
        designation: employee.designation
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get current logged in employee
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const employee = await Employee.findById(req.employee.id);

    res.status(200).json({
      success: true,
      employee
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  adminLogin,
  employeeLogin,
  getMe,
  comparePassword, // Export for use in other controllers
  generateToken     // Export for use in other controllers
};