# Backend API - Hệ thống Quản lý Thư viện

## Cấu trúc thư mục

```
backend/
├── config/
│   └── database.js          # Cấu hình kết nối MongoDB
├── routes/
│   ├── auth.js              # Route xác thực (đăng nhập, đăng ký)
│   ├── users.js             # Route quản lý người dùng
│   ├── books.js             # Route quản lý sách
│   ├── categories.js        # Route quản lý danh mục
│   ├── authors.js           # Route quản lý tác giả
│   ├── borrowTickets.js     # Route quản lý phiếu mượn
│   ├── borrowReturns.js     # Route quản lý phiếu trả
│   ├── support.js           # Route hỗ trợ
│   └── stats.js             # Route thống kê
├── middleware/
│   └── swagger.js           # Cấu hình Swagger API docs
├── utils/
│   └── helpers.js           # Các hàm tiện ích
├── models/                  # Các model MongoDB
│   ├── UserModel.js
│   ├── BookModel.js
│   ├── DanhMucModel.js
│   ├── TacGiaModel.js
│   ├── PhieuMuonSachModel.js
│   ├── MuonTraModel.js
│   └── SupportModel.js
├── index.js                 # File chính (cũ)
├── index-new.js             # File chính mới (đã tách route)
├── package.json
└── README.md
```

## Cài đặt và chạy

1. Cài đặt dependencies:
```bash
npm install
```

2. Cấu hình MongoDB:
- Tạo file `.env` hoặc set environment variable `MONGO_URI`
- Mặc định: `mongodb://localhost:27017/QLTV`

3. Chạy server:
```bash
# Sử dụng file cũ (tất cả trong 1 file)
npm start

# Hoặc sử dụng file mới (đã tách route)
node index-new.js
```

## API Endpoints

### Authentication
- `POST /api/login` - Đăng nhập
- `POST /api/register` - Đăng ký

### Users
- `GET /api/users` - Lấy danh sách người dùng
- `GET /api/users/readers` - Lấy danh sách độc giả
- `GET /api/users/:id` - Lấy thông tin người dùng
- `PUT /api/users/:id` - Cập nhật người dùng
- `DELETE /api/users/:id` - Xóa người dùng

### System
- `GET /` - Thông tin server
- `GET /health` - Kiểm tra sức khỏe hệ thống
- `GET /api/ping` - Test API
- `GET /api-docs` - Swagger documentation

## Kế hoạch commit lên GitHub

### Commit 1: Cấu trúc cơ bản
- Tạo thư mục config, routes, middleware, utils, models
- Di chuyển các model files
- Tạo file cấu hình database và swagger

### Commit 2: Authentication routes
- Tách route authentication
- Tạo file auth.js

### Commit 3: User management routes
- Tách route quản lý người dùng
- Tạo file users.js

### Commit 4: Book management routes
- Tách route quản lý sách
- Tạo file books.js

### Commit 5: Category & Author routes
- Tách route danh mục và tác giả
- Tạo files categories.js và authors.js

### Commit 6: Borrow & Return routes
- Tách route phiếu mượn và trả
- Tạo files borrowTickets.js và borrowReturns.js

### Commit 7: Support & Stats routes
- Tách route hỗ trợ và thống kê
- Tạo files support.js và stats.js

### Commit 8: Refactor main file
- Cập nhật index.js để sử dụng các route đã tách
- Thêm error handling và middleware

### Commit 9: Documentation & Testing
- Cập nhật README
- Thêm test files
- Hoàn thiện documentation 