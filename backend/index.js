const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const { swaggerUi, specs } = require('./middleware/swagger');

// Import routes



// Middleware


// Connect to database
connectDB();

// Swagger documentation


// Route gốc - hiển thị thông tin server


// Route kiểm tra sức khỏe hệ thống


// API mẫu


// Routes


// Error handling middleware


// 404 handler


app.listen(PORT, () => {
  console.log(`Server đang chạy trên port ${PORT}`);
  console.log(`Swagger docs: http://localhost:${PORT}/api-docs`);
}); 