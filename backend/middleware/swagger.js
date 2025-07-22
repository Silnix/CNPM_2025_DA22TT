const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'QLTV API',
      version: '1.0.0',
      description: 'API cho hệ thống quản lý thư viện',
    },
    servers: [
      {
        url: 'https://celri.onrender.com',  // ✅ URL thật của server deploy trên Render
        description: 'Render production server',
      },
      {
        url: 'http://localhost:5000',        // ✅ Dùng khi chạy local
        description: 'Development server',
      },
    ],
  },
  apis: ['./routes/*.js'],
};


const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs }; 