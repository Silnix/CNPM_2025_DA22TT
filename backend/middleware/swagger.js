const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'QLTV API - Hệ thống Quản lý Thư viện',
      version: '1.0.0',
      description: 'API documentation cho hệ thống quản lý thư viện',
      contact: {
        name: 'QLTV Team',
        email: 'qltv@example.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server'
      }
    ],
    components: {
      schemas: {
        User: {
          type: 'object',
          properties: {
            ID: { type: 'string', example: 'U001' },
            username: { type: 'string', example: 'user123' },
            password: { type: 'string', example: 'password123' },
            ho_ten: { type: 'string', example: 'Nguyễn Văn A' },
            dia_chi: { type: 'string', example: 'Hà Nội' },
            email: { type: 'string', example: 'user@example.com' },
            loai: { type: 'number', example: 2, description: '1=Admin, 2=User' }
          }
        },
        Book: {
          type: 'object',
          properties: {
            ID: { type: 'string', example: 'B001' },
            ten_sach: { type: 'string', example: 'Sách mẫu' },
            tac_gia: { type: 'string', example: 'Tác giả mẫu' },
            nam_xuat_ban: { type: 'number', example: 2023 },
            ngon_ngu: { type: 'string', example: 'Tiếng Việt' },
            trang_thai: { type: 'string', example: 'Có sẵn' },
            vi_tri: { type: 'string', example: 'Kệ A-1' },
            danh_muc: { type: 'string', example: 'Văn học' },
            so_luong: { type: 'number', example: 5 }
          }
        },
        PhieuMuonSach: {
          type: 'object',
          properties: {
            ID_phieu: { type: 'string', example: 'PM001' },
            ID_nguoi_dung: { type: 'string', example: 'U001' },
            ngay_muon: { type: 'string', example: '01/01/2024' },
            ngay_tra_du_kien: { type: 'string', example: '15/01/2024' },
            ngay_tra_thuc_te: { type: 'string', example: '14/01/2024' },
            trang_thai: { type: 'string', example: 'Đã trả' },
            sach_muon: { 
              type: 'array', 
              items: { type: 'string' },
              example: ['B001', 'B002']
            }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js'], // Path to the API routes
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs }; 