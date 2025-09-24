const mongoose = require('mongoose');
require('dotenv').config();

// Import the Employee model
const employeeSchema = new mongoose.Schema({
  empId: String,
  username: String,
  password: String,
  designation: String,
  empType: String,
  role: String,
  status: String,
  projectLocation: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
});

const Employee = mongoose.model('Employee', employeeSchema);

// Connect to MongoDB
const mongoUri = process.env.DEVELOPMENT_MONGODB_URI || process.env.MONGODB_URI;
console.log('Connecting to MongoDB with URI:', mongoUri);

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch((err) => console.log('MongoDB connection error:', err));

// Test authentication function
async function testAuth() {
  try {
    // Wait a bit for the connection to establish
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Try to find a specific employee by empId
    const employee = await Employee.findOne({ empId: 'MEV/280/2024' });
    console.log('Found employee by empId:', employee);
    
    if (employee) {
      console.log('Employee found:');
      console.log('- empId:', employee.empId);
      console.log('- username:', employee.username);
      console.log('- password (hashed):', employee.password);
      console.log('- role:', employee.role);
      console.log('- status:', employee.status);
    } else {
      console.log('Employee not found');
    }
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    mongoose.connection.close();
  }
}

// Run the test
testAuth();