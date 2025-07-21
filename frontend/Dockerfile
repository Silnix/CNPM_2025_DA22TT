# Dùng node 18 bản nhẹ
FROM node:18-alpine

# Tạo thư mục làm việc
WORKDIR /app

# Copy package trước để tận dụng cache Docker layer
COPY package*.json ./

# Cài đặt các dependency
RUN npm install

# Copy toàn bộ source code
COPY . .

# Build dự án Vite
RUN npm run build

# Cài thêm serve để chạy frontend
RUN npm install -g serve

# Mở cổng 5173 (mặc định của vite preview/serve)
EXPOSE 5173

# Chạy production với thư mục dist/
CMD ["serve", "-s", "dist", "-l", "5173"]
