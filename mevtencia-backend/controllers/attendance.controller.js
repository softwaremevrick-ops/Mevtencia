const CheckinCheckout = require('../models/CheckinCheckout');
const Employee = require('../models/Employee');
const { comparePassword, generateToken } = require('../utils/auth');

// @desc    Check in employee with authentication
// @route   POST /api/attendance/checkin-with-auth
// @access  Public
const checkinWithAuth = async (req, res) => {
  try {
    const { empId, password, date, checkinTime, checkinLocation } = req.body;

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
      console.log(`Employee not found for ID: ${empId}`);
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Check if employee is active
    if (employee.status !== 'Active') {
      console.log(`Employee account deactivated for ID: ${empId}`);
      return res.status(401).json({
        success: false,
        error: 'Account is deactivated'
      });
    }

    // Check password
    const isMatch = await comparePassword(password, employee.password);

    if (!isMatch) {
      console.log(`Invalid password for employee ID: ${empId}`);
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Check if already checked in today
    const existingCheckin = await CheckinCheckout.findOne({
      employeeId: employee._id,
      date: {
        $gte: new Date(new Date(date).setHours(0, 0, 0, 0)),
        $lt: new Date(new Date(date).setHours(23, 59, 59, 999))
      }
    });

    if (existingCheckin && existingCheckin.checkinTime) {
      return res.status(400).json({
        success: false,
        error: 'Already checked in today'
      });
    }

    let attendance;
    if (existingCheckin) {
      // Update existing record
      attendance = await CheckinCheckout.findByIdAndUpdate(
        existingCheckin._id,
        { checkinTime, checkinLocation },
        { new: true }
      );
    } else {
      // Create new record
      attendance = await CheckinCheckout.create({
        employeeId: employee._id,
        date,
        checkinTime,
        checkinLocation
      });
    }

    // Generate token
    const token = generateToken(employee._id);

    res.status(201).json({
      success: true,
      token,
      employee: {
        id: employee._id,
        empId: employee.empId,
        username: employee.username,
        role: employee.role,
        designation: employee.designation
      },
      attendance
    });
  } catch (error) {
    console.error('Checkin with auth error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Check in employee
// @route   POST /api/attendance/checkin
// @access  Private/Employee
const checkin = async (req, res) => {
  try {
    const { date, checkinTime, checkinLocation } = req.body;

    // Check if already checked in today
    const existingCheckin = await CheckinCheckout.findOne({
      employeeId: req.employee.id,
      date: {
        $gte: new Date(new Date(date).setHours(0, 0, 0, 0)),
        $lt: new Date(new Date(date).setHours(23, 59, 59, 999))
      }
    });

    if (existingCheckin && existingCheckin.checkinTime) {
      return res.status(400).json({
        success: false,
        error: 'Already checked in today'
      });
    }

    let attendance;
    if (existingCheckin) {
      // Update existing record
      attendance = await CheckinCheckout.findByIdAndUpdate(
        existingCheckin._id,
        { checkinTime, checkinLocation },
        { new: true }
      );
    } else {
      // Create new record
      attendance = await CheckinCheckout.create({
        employeeId: req.employee.id,
        date,
        checkinTime,
        checkinLocation
      });
    }

    res.status(201).json({
      success: true,
      attendance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Check out employee
// @route   POST /api/attendance/checkout
// @access  Private/Employee
const checkout = async (req, res) => {
  try {
    const { date, checkoutTime, checkoutLocation } = req.body;

    // Find today's checkin record
    const attendance = await CheckinCheckout.findOne({
      employeeId: req.employee.id,
      date: {
        $gte: new Date(new Date(date).setHours(0, 0, 0, 0)),
        $lt: new Date(new Date(date).setHours(23, 59, 59, 999))
      }
    });

    if (!attendance) {
      return res.status(400).json({
        success: false,
        error: 'No checkin record found for today'
      });
    }

    if (attendance.checkoutTime) {
      return res.status(400).json({
        success: false,
        error: 'Already checked out today'
      });
    }

    // Calculate total time in minutes
    const checkin = new Date(attendance.checkinTime);
    const checkout = new Date(checkoutTime);
    const totalTime = Math.round((checkout - checkin) / (1000 * 60));

    // Update record
    const updatedAttendance = await CheckinCheckout.findByIdAndUpdate(
      attendance._id,
      { checkoutTime, checkoutLocation, totalTime },
      { new: true }
    );

    res.status(200).json({
      success: true,
      attendance: updatedAttendance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get employee attendance records
// @route   GET /api/attendance/employee
// @access  Private/Employee
const getEmployeeAttendance = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let query = { employeeId: req.employee.id };

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const attendanceRecords = await CheckinCheckout.find(query).sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: attendanceRecords.length,
      attendanceRecords
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get all attendance records (Admin)
// @route   GET /api/attendance
// @access  Private/Admin
const getAllAttendance = async (req, res) => {
  try {
    const { startDate, endDate, employeeId } = req.query;

    let query = {};

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    if (employeeId) {
      query.employeeId = employeeId;
    }

    const attendanceRecords = await CheckinCheckout.find(query)
      .populate('employeeId', 'empId username designation')
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: attendanceRecords.length,
      attendanceRecords
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get attendance summary
// @route   GET /api/attendance/summary
// @access  Private/Employee
const getAttendanceSummary = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let query = { employeeId: req.employee.id };

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const attendanceRecords = await CheckinCheckout.find(query);

    const summary = {
      totalDays: attendanceRecords.length,
      presentDays: attendanceRecords.filter(record => record.status === 'present').length,
      absentDays: attendanceRecords.filter(record => record.status === 'absent').length,
      lateDays: attendanceRecords.filter(record => record.status === 'late').length,
      halfDays: attendanceRecords.filter(record => record.status === 'half-day').length,
      totalTime: attendanceRecords.reduce((total, record) => total + (record.totalTime || 0), 0)
    };

    res.status(200).json({
      success: true,
      summary
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  checkinWithAuth,
  checkin,
  checkout,
  getEmployeeAttendance,
  getAllAttendance,
  getAttendanceSummary
};