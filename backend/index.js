const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const { swaggerUi, specs } = require('./middleware/swagger');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const bookRoutes = require('./routes/books');
const categoryRoutes = require('./routes/categories');
const authorRoutes = require('./routes/authors');
const supportRoutes = require('./routes/support');
const statsRoutes = require('./routes/stats');
const borrowTicketRoutes = require('./routes/borrowTickets');
const borrowReturnRoutes = require('./routes/borrowReturns');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to database
connectDB();

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Route gốc - hiển thị thông tin server
app.get('/', (req, res) => {
  res.json({
    message: 'QLTV API Server',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      api: '/api',
      swagger: '/api-docs',
      ping: '/api/ping',
      health: '/health'
    },
    documentation: 'Truy cập /api-docs để xem tài liệu API đầy đủ'
  });
});

// Route kiểm tra sức khỏe hệ thống
app.get('/health', (req, res) => {
  const mongoose = require('mongoose');
  const mongoStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    mongodb: mongoStatus,
    uptime: process.uptime()
  });
});

// API mẫu
app.get('/api/ping', (req, res) => {
  res.json({ message: 'Pong từ backend!' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/authors', authorRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/borrow-tickets', borrowTicketRoutes);
app.use('/api/borrow-returns', borrowReturnRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Có lỗi xảy ra!', error: err.message });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route không tồn tại' });
});

app.listen(PORT, () => {
  console.log(Server đang chạy trên port ${PORT});
  console.log(Swagger docs: http://localhost:${PORT}/api-docs);
}); 