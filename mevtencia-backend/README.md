# Mevtencia Backend API

This is the backend API for the Mevtencia Attendance Management System, built with Node.js, Express, and MongoDB.

## Features

- Employee authentication (Admin & Employee)
- Attendance tracking (Check-in/Check-out)
- Geofencing for location-based attendance
- Employee management
- HRMS module for bulk operations
- Image upload to Cloudinary
- JWT-based authentication

## Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas cluster
- Cloudinary account
- Email service (SMTP or SendGrid)

## Installation

1. Clone the repository
2. Navigate to the backend directory:
   ```
   cd mevtencia-backend
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Create a `.env` file based on `.env.example` and configure your environment variables
5. Start the development server:
   ```
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/admin/login` - Admin login
- `POST /api/auth/employee/login` - Employee login
- `GET /api/auth/me` - Get current user

### Employees
- `GET /api/employees` - Get all employees (Admin)
- `GET /api/employees/:id` - Get employee by ID (Admin)
- `POST /api/employees` - Create employee (Admin)
- `PUT /api/employees/:id` - Update employee (Admin)
- `DELETE /api/employees/:id` - Delete employee (Admin)
- `POST /api/employees/:id/profile-image` - Upload profile image (Admin)
- `GET /api/employees/:id/mevrick-details` - Get employee HR details (Admin)
- `PUT /api/employees/:id/mevrick-details` - Update employee HR details (Admin)

### Attendance
- `POST /api/attendance/checkin` - Employee check-in
- `POST /api/attendance/checkout` - Employee check-out
- `GET /api/attendance/employee` - Get employee attendance records
- `GET /api/attendance/summary` - Get attendance summary
- `GET /api/attendance` - Get all attendance records (Admin)

### Locations
- `GET /api/locations` - Get all locations
- `GET /api/locations/:id` - Get location by ID
- `POST /api/locations/check-geofence` - Check if coordinates are within geofence
- `POST /api/locations` - Create location (Admin)
- `PUT /api/locations/:id` - Update location (Admin)
- `DELETE /api/locations/:id` - Delete location (Admin)

### HRMS
- `POST /api/hrms/bulk-create` - Bulk create employees (Admin)
- `POST /api/hrms/bulk-offer-letters` - Generate bulk offer letters (Admin)
- `POST /api/hrms/bulk-emails` - Send bulk emails (Admin)
- `GET /api/hrms/employees` - Get all employee details (Admin)

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb+srv://<username>:<password>@mevtencia-cluster0.mongodb.net/mevtencia?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=mevtencia_jwt_secret_key
JWT_EXPIRE=30d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Configuration (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USERNAME=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

## Development

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server

## Project Structure

```
mevtencia-backend/
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── utils/
├── .env
├── server.js
└── package.json
```