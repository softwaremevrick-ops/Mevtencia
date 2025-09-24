const Employee = require('../models/Employee');
const MevrickDetails = require('../models/MevrickDetails');
const { hashPassword } = require('../utils/auth');
const { uploadImage } = require('../utils/cloudinary');

// @desc    Get all employees
// @route   GET /api/employees
// @access  Private/Admin
const getEmployees = async (req, res) => {
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

// @desc    Get single employee
// @route   GET /api/employees/:id
// @access  Private/Admin
const getEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        error: 'Employee not found'
      });
    }

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

// @desc    Create employee
// @route   POST /api/employees
// @access  Private/Admin
const createEmployee = async (req, res) => {
  try {
    const { empId, username, password, designation, empType, projectLocation } = req.body;

    // Check if employee already exists
    const employeeExists = await Employee.findOne({
      empId
    });

    if (employeeExists) {
      return res.status(400).json({
        success: false,
        error: 'Employee with this ID already exists'
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create employee
    const employee = await Employee.create({
      empId,
      username,
      password: hashedPassword,
      designation,
      empType,
      projectLocation
    });

    res.status(201).json({
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

// @desc    Update employee
// @route   PUT /api/employees/:id
// @access  Private/Admin
const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!employee) {
      return res.status(404).json({
        success: false,
        error: 'Employee not found'
      });
    }

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

// @desc    Delete employee
// @route   DELETE /api/employees/:id
// @access  Private/Admin
const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        error: 'Employee not found'
      });
    }

    await employee.remove();

    res.status(200).json({
      success: true,
      message: 'Employee removed'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Upload employee profile image
// @route   POST /api/employees/:id/profile-image
// @access  Private/Admin
const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Please upload a file'
      });
    }

    // Upload to Cloudinary
    const result = await uploadImage(req.file.path);

    // Update employee with image URL
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      { profileImage: result.url },
      { new: true }
    );

    if (!employee) {
      return res.status(404).json({
        success: false,
        error: 'Employee not found'
      });
    }

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

// @desc    Get employee mevrick details
// @route   GET /api/employees/:id/mevrick-details
// @access  Private/Admin
const getMevrickDetails = async (req, res) => {
  try {
    const details = await MevrickDetails.findOne({ employeeId: req.params.id });

    res.status(200).json({
      success: true,
      details
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Update employee mevrick details
// @route   PUT /api/employees/:id/mevrick-details
// @access  Private/Admin
const updateMevrickDetails = async (req, res) => {
  try {
    let details = await MevrickDetails.findOne({ employeeId: req.params.id });

    if (details) {
      // Update existing details
      details = await MevrickDetails.findOneAndUpdate(
        { employeeId: req.params.id },
        req.body,
        { new: true, runValidators: true }
      );
    } else {
      // Create new details
      details = await MevrickDetails.create({
        employeeId: req.params.id,
        ...req.body
      });
    }

    res.status(200).json({
      success: true,
      details
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Reset employee password
// @route   POST /api/employees/resetpassword
// @access  Private/Employee
const resetPassword = async (req, res) => {
  try {
    const { newpassword, confirmpassword } = req.body;

    // Validate input
    if (!newpassword || !confirmpassword) {
      return res.status(400).json({
        success: false,
        error: {
          msg: 'Please provide both new password and confirm password'
        }
      });
    }

    if (newpassword !== confirmpassword) {
      return res.status(400).json({
        success: false,
        error: {
          msg: 'Passwords do not match'
        }
      });
    }

    // Hash the new password
    const hashedPassword = await hashPassword(newpassword);

    // Update employee password
    const employee = await Employee.findByIdAndUpdate(
      req.employee.id,
      { password: hashedPassword },
      { new: true }
    );

    if (!employee) {
      return res.status(404).json({
        success: false,
        error: {
          msg: 'Employee not found'
        }
      });
    }

    res.status(200).json({
      success: true,
      msg: 'Password reset successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        msg: error.message
      }
    });
  }
};

module.exports = {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  uploadProfileImage,
  getMevrickDetails,
  updateMevrickDetails,
  resetPassword
};