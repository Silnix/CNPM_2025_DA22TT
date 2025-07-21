# Hệ Thống Quản Lý Thư Viện

## Cấu trúc dự án
- `frontend/` - Ứng dụng Vue.js
- `backend/` - API server Node.js/Express
- `GD/` - Thư mục chứa thiết kế giao diện

## Cài đặt và chạy

### 1. Cài đặt dependencies

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd frontend
npm install
```

### 2. Khởi động MongoDB
Đảm bảo MongoDB đang chạy trên localhost:27017

### 3. Chạy Backend
```bash
cd backend
npm start
```
Backend sẽ chạy trên http://localhost:5000

### 4. Chạy Frontend
```bash
cd frontend
npm run dev
```
Frontend sẽ chạy trên http://localhost:5173

## API Endpoints

### Đăng ký
- **POST** `/api/auth/register`
- Body: `{ username, password, ho_ten, email, dia_chi }`

### Đăng nhập
- **POST** `/api/login`
- Body: `{ username, password }`

### Kiểm tra danh sách users (debug)
- **GET** `/api/users`
- Trả về danh sách tất cả users (không bao gồm password)

### Lấy danh sách độc giả (users loại 2)
- **GET** `/api/users/readers`
- Trả về danh sách chỉ users loại 2 (độc giả)

### Cập nhật thông tin user
- **PUT** `/api/users/:id`
- Body: `{ ho_ten, dia_chi, email }`
- Cập nhật thông tin người dùng theo ID

### Xóa user
- **DELETE** `/api/users/:id`
- Xóa người dùng theo ID

### Thống kê tổng quan
- **GET** `/api/stats/overview`
- Trả về số liệu tổng quan: users, books, borrows, categories

### Thống kê đăng ký theo tháng
- **GET** `/api/stats/registrations`
- Trả về số lượng đăng ký theo từng tháng trong năm

### Thống kê mượn sách theo tháng
- **GET** `/api/stats/borrows`
- Trả về số lượng mượn sách theo từng tháng trong năm

### Thống kê sách theo danh mục
- **GET** `/api/stats/books-by-category`
- Trả về phân bố sách theo danh mục

### Tìm kiếm sách
- **GET** `/api/books/search?q=keyword`

## Tính năng đã hoàn thành

### Frontend
- ✅ Form đăng ký với đầy đủ thông tin
- ✅ Validation form
- ✅ Kết nối API đăng ký
- ✅ Chuyển hướng sau đăng ký thành công

### Backend
- ✅ API đăng ký với validation
- ✅ Model User với đầy đủ trường
- ✅ Tự động sinh ID người dùng
- ✅ Kiểm tra trùng lặp username/email
- ✅ CORS configuration

## Cơ sở dữ liệu
- Database: `QLTV`
- Collection: `NGUOIDUNG`
- Schema User: `ID`, `username`, `password`, `ho_ten`, `dia_chi`, `email`, `loai`

### Loại người dùng (trường `loai`)
- `1` = Admin/Quản trị viên
- `2` = Người dùng thường (mặc định khi đăng ký)

## Test hệ thống

### Chạy test tự động
```bash
node test-register.js
```

### Kiểm tra thủ công
1. Truy cập `http://localhost:5000/api/users` để xem danh sách users
2. Đăng ký qua frontend tại `http://localhost:5173/register`
3. Kiểm tra lại danh sách users để xác nhận user mới đã được thêm 

## Kế hoạch kiểm thử CI/CD GitHub Actions

### 1. Mục tiêu kiểm thử
- Đảm bảo workflow CI/CD hoạt động đúng khi có thay đổi code ở backend hoặc frontend.
- Xác nhận các bước: cài đặt, kiểm thử backend, build frontend đều thực thi thành công hoặc báo lỗi đúng khi có vấn đề.
- Đảm bảo quy trình tự động, phát hiện lỗi sớm.

### 2. Các trường hợp kiểm thử (Test cases)

#### TC1: Push code hợp lệ lên nhánh main
- **Bước thực hiện:**
  1. Sửa một file bất kỳ (ví dụ: README.md) ở backend hoặc frontend.
  2. Commit và push lên nhánh main.
- **Kết quả mong đợi:**
  - Workflow CI/CD tự động chạy.
  - Các bước: checkout, cài đặt backend, test backend, cài đặt frontend, build frontend đều thành công (màu xanh).

#### TC2: Code backend có lỗi (test fail)
- **Bước thực hiện:**
  1. Thêm một đoạn code lỗi vào backend (ví dụ: throw new Error('Test error') trong một route).
  2. Commit và push lên nhánh main.
- **Kết quả mong đợi:**
  - Workflow CI/CD chạy.
  - Bước test backend báo lỗi (màu đỏ), các bước sau không thực hiện.
  - Log hiển thị rõ lỗi.

#### TC3: Build frontend lỗi
- **Bước thực hiện:**
  1. Sửa code frontend để gây lỗi build (ví dụ: xóa một import cần thiết trong file src/main.js).
  2. Commit và push lên nhánh main.
- **Kết quả mong đợi:**
  - Workflow CI/CD chạy.
  - Bước build frontend báo lỗi (màu đỏ), log hiển thị lỗi build.

#### TC4: Tạo Pull Request vào nhánh main
- **Bước thực hiện:**
  1. Tạo một nhánh mới, sửa code backend hoặc frontend, push lên GitHub.
  2. Tạo Pull Request vào nhánh main.
- **Kết quả mong đợi:**
  - Workflow CI/CD tự động chạy trên Pull Request.
  - Các bước thực hiện như khi push lên main.

#### TC5: Không có test backend
- **Bước thực hiện:**
  1. Đảm bảo trong backend không có test hoặc script test không làm gì.
  2. Commit và push lên nhánh main.
- **Kết quả mong đợi:**
  - Workflow CI/CD chạy.
  - Bước test backend báo “Không có test hoặc test thất bại” nhưng workflow vẫn tiếp tục các bước sau.

### 3. Theo dõi & ghi nhận kết quả
- Vào tab Actions trên GitHub để theo dõi trạng thái từng workflow.
- Ghi lại kết quả từng test case (thành công/thất bại, log lỗi nếu có).

### 4. Xử lý lỗi (nếu có)
- Nếu workflow báo lỗi, đọc log chi tiết để xác định nguyên nhân.
- Sửa code hoặc cấu hình, lặp lại kiểm thử cho đến khi tất cả các bước đều thành công.

### 5. (Tuỳ chọn) Kiểm thử bước deploy (nếu có)
- Nếu bạn bổ sung bước deploy, hãy kiểm thử thêm các trường hợp deploy thành công và deploy lỗi (ví dụ: sai thông tin server, thiếu quyền...). 

## Tự động cập nhật web lên hosting với CI/CD

### 1. Quy trình tự động cập nhật
- Mỗi khi push code lên nhánh main hoặc tạo pull request, GitHub Actions sẽ tự động chạy các bước: cài đặt, kiểm thử, build backend/frontend.
- Sau khi build xong, workflow sẽ tự động kết nối SSH vào server hosting, pull code mới nhất, cài đặt lại dependencies, build lại frontend (nếu cần) và khởi động lại ứng dụng.

### 2. Cách cấu hình thông tin hosting trên GitHub
- Vào repository trên GitHub, chọn **Settings → Secrets and variables → Actions**.
- Thêm các secrets sau:
  - `SERVER_HOST`: Địa chỉ IP hoặc domain của server hosting.
  - `SERVER_USER`: Tên user đăng nhập SSH (ví dụ: ubuntu, root, ...).
  - `SERVER_SSH_KEY`: Private key SSH (dạng text, không phải file).
  - `SERVER_PORT`: Port SSH (mặc định là 22, nếu khác thì điền số port).

### 3. Cập nhật đường dẫn deploy trên server
- Trong file `.github/workflows/ci-cd.yml`, sửa dòng:
  ```yaml
  cd /home/ubuntu/app
  ```
  thành đúng đường dẫn thư mục chứa source code trên server của bạn.

### 4. Kết quả
- Sau khi cấu hình xong, mỗi lần cập nhật code lên GitHub, website sẽ tự động được cập nhật lên hosting mà không cần thao tác thủ công.

**Lưu ý:** Đảm bảo server đã cài đặt sẵn Node.js, npm, pm2, git, ... và đã thêm public key vào `~/.ssh/authorized_keys` trên server. 